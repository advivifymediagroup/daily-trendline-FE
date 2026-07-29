/**
 * GNews (https://gnews.io) live-headlines integration.
 *
 * Server-side only — the API key must NOT be exposed to the client, so this
 * reads GNEWS_API_KEY (not NEXT_PUBLIC_*). Responses are cached via Next's
 * data cache and revalidated every 30 minutes, which keeps a whole day of
 * traffic well inside the free tier (100 requests/day).
 *
 * When the key is missing or the request fails, callers receive an empty
 * array and the UI sections render nothing — the site never breaks because
 * of the external feed.
 */

export type GNewsArticle = {
  title: string;
  description: string | null;
  /** Truncated on the free tier — ends with a "[+N chars]" marker. */
  content: string | null;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
};

export type GNewsCategory =
  | "general"
  | "business"
  | "technology"
  | "sports"
  | "entertainment";

const KNOWN_CATEGORIES: GNewsCategory[] = [
  "general",
  "business",
  "technology",
  "sports",
  "entertainment",
];

// 1 hour: 5 feeds (general + 4 categories) x 24 refreshes/day = 120 worst
// case, but on-demand revalidation keeps real usage well under the GNews
// free tier's 100 requests/day.
const REVALIDATE_SECONDS = 3600;

export function toGNewsCategory(slug: string): GNewsCategory | null {
  const normalized = slug.toLowerCase() as GNewsCategory;
  return KNOWN_CATEGORIES.includes(normalized) ? normalized : null;
}

export async function getLiveHeadlines(
  category: GNewsCategory = "general",
  max = 6,
): Promise<GNewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    category,
    lang: "en",
    max: String(max),
    apikey: apiKey,
  });

  try {
    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?${params.toString()}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );

    if (!res.ok) {
      console.error(`[gnews] top-headlines ${category} failed: ${res.status}`);
      return [];
    }

    const json = await res.json();
    return Array.isArray(json?.articles) ? json.articles : [];
  } catch (error) {
    console.error(`[gnews] top-headlines ${category} error:`, error);
    return [];
  }
}

export function formatRelativeTime(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "";

  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
