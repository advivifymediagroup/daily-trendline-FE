/**
 * Guardian Open Platform integration (https://open-platform.theguardian.com).
 *
 * Unlike GNews — whose terms allow only headlines/snippets — the Guardian
 * licenses its content for reuse, so we can render the FULL article body on
 * our own pages provided we credit the Guardian and link back to the
 * original. Every rendered article must keep its byline + "Read on The
 * Guardian" link.
 *
 * Server-side only: reads GUARDIAN_API_KEY (never NEXT_PUBLIC_*).
 *
 * Free "Developer" tier: 500 calls/day, non-commercial use. Listings are
 * cached 1h and individual articles 6h, which keeps a normal day of traffic
 * comfortably inside that budget.
 */

export type GuardianBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export type GuardianArticle = {
  id: string;
  title: string;
  standfirst: string | null;
  byline: string | null;
  thumbnail: string | null;
  webUrl: string;
  publishedAt: string;
  sectionName: string;
  wordcount: number | null;
  blocks: GuardianBlock[];
};

export type GuardianSection =
  | "news"
  | "business"
  | "technology"
  | "sport"
  | "culture";

/** Our category slugs -> Guardian section ids. */
const SECTION_MAP: Record<string, GuardianSection> = {
  business: "business",
  technology: "technology",
  sports: "sport",
  entertainment: "culture",
};

const BASE = "https://content.guardianapis.com";
const LIST_REVALIDATE = 3600; // 1 hour
const ITEM_REVALIDATE = 21600; // 6 hours — published articles rarely change

export function toGuardianSection(slug: string): GuardianSection | null {
  return SECTION_MAP[slug.toLowerCase()] ?? null;
}

/** Decode the handful of HTML entities that appear in Guardian copy. */
function decodeEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&pound;/g, "£")
    .replace(/&euro;/g, "€")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

/**
 * Turns the Guardian's body HTML into an ordered list of plain-text blocks.
 * We deliberately do NOT pass raw HTML to the browser — parsing to text here
 * means React escapes everything on render, so no third-party markup or
 * scripts can reach the page.
 */
export function parseBody(html: string): GuardianBlock[] {
  if (!html) return [];

  const blocks: GuardianBlock[] = [];
  const pattern = /<(p|h2|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const text = stripTags(match[2]);
    if (!text) continue;

    if (tag === "h2") blocks.push({ type: "h2", text });
    else if (tag === "blockquote") blocks.push({ type: "quote", text });
    else blocks.push({ type: "p", text });
  }

  // Fallback for bodies without block markup.
  if (blocks.length === 0) {
    const text = stripTags(html);
    if (text) blocks.push({ type: "p", text });
  }

  return blocks;
}

function toArticle(item: any): GuardianArticle {
  const fields = item?.fields ?? {};
  return {
    id: item.id,
    title: fields.headline || item.webTitle || "Untitled",
    standfirst: fields.standfirst ? stripTags(fields.standfirst) : null,
    byline: fields.byline ? fields.byline.trim() : null,
    thumbnail: fields.thumbnail || null,
    webUrl: item.webUrl,
    publishedAt: item.webPublicationDate,
    sectionName: item.sectionName || "News",
    wordcount: fields.wordcount ? Number(fields.wordcount) : null,
    blocks: parseBody(fields.body || ""),
  };
}

async function request(path: string, params: Record<string, string>, revalidate: number) {
  const apiKey = process.env.GUARDIAN_API_KEY;
  if (!apiKey) return null;

  const query = new URLSearchParams({ ...params, "api-key": apiKey });

  try {
    const res = await fetch(`${BASE}${path}?${query.toString()}`, {
      next: { revalidate },
    });

    if (!res.ok) {
      console.error(`[guardian] ${path} failed: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json?.response ?? null;
  } catch (error) {
    console.error(`[guardian] ${path} error:`, error);
    return null;
  }
}

/** Latest articles for a section. Returns [] when unavailable. */
export async function getGuardianHeadlines(
  section: GuardianSection = "news",
  max = 6,
): Promise<GuardianArticle[]> {
  const params: Record<string, string> = {
    "show-fields": "headline,standfirst,byline,thumbnail,body,wordcount",
    "page-size": String(max),
    "order-by": "newest",
  };

  // "news" means no section filter — the general front page.
  if (section !== "news") params.section = section;

  const response = await request("/search", params, LIST_REVALIDATE);
  const results = response?.results;
  return Array.isArray(results) ? results.map(toArticle) : [];
}

/** A single article, with full body, by its Guardian id. */
export async function getGuardianArticle(
  id: string,
): Promise<GuardianArticle | null> {
  const response = await request(
    `/${id}`,
    { "show-fields": "headline,standfirst,byline,thumbnail,body,wordcount" },
    ITEM_REVALIDATE,
  );

  return response?.content ? toArticle(response.content) : null;
}

/**
 * Guardian ids look like "business/2026/aug/12/some-slug". Live-blog ids get
 * very long (200+ chars), so the ceiling is generous; the character class and
 * the ".." check are what actually keep this from being a path-traversal or
 * SSRF vector.
 */
export function isValidGuardianId(id: string): boolean {
  return /^[a-z0-9][a-z0-9\-/.]{3,400}$/i.test(id) && !id.includes("..");
}

export function formatRelativeTime(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "";

  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.round(hours / 24)}d ago`;
}

/**
 * Guardian thumbnails come back at 500px wide, which is soft in a wide lead
 * slot. The CDN serves the same crop at 1000px, so swap the width segment
 * where the URL follows that pattern. 1200 is not offered — it 403s.
 */
export function largerImage(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/\/500\.(jpg|jpeg|png)$/i, "/1000.$1");
}

export function readingTime(article: GuardianArticle): number {
  const words =
    article.wordcount ??
    article.blocks.reduce((n, b) => n + b.text.split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 220));
}
