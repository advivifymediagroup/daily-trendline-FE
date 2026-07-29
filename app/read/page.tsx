import React from "react";
import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  getLiveHeadlines,
  formatRelativeTime,
  toGNewsCategory,
  type GNewsArticle,
  type GNewsCategory,
} from "@/utils/gnews";

type Props = {
  searchParams: Promise<{
    url?: string;
    category?: string;
  }>;
};

const ALL_CATEGORIES: GNewsCategory[] = [
  "general",
  "business",
  "technology",
  "sports",
  "entertainment",
];

/**
 * Finds an article in the cached live feeds by its source URL.
 * Checks the hinted category first, then the rest — all feeds are cached
 * hourly, so this almost never costs extra API quota.
 */
async function findLiveArticle(
  url: string,
  categoryHint?: string,
): Promise<{ article: GNewsArticle; category: GNewsCategory } | null> {
  const hinted = categoryHint ? toGNewsCategory(categoryHint) : null;
  const order: GNewsCategory[] = hinted
    ? [hinted, ...ALL_CATEGORIES.filter((c) => c !== hinted)]
    : ALL_CATEGORIES;

  for (const category of order) {
    const articles = await getLiveHeadlines(category, 10);
    const article = articles.find((a) => a.url === url);
    if (article) return { article, category };
  }

  return null;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/** GNews truncates content with a "... [1234 chars]" tail — clean it up. */
function cleanSnippet(content: string | null): string {
  if (!content) return "";
  return content.replace(/\s*(\.\.\.|…)?\s*\[\+?\d+\s*chars\]\s*$/i, "…");
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { url, category } = await searchParams;

  if (!url || !isValidHttpUrl(url)) {
    return { title: "Story not found" };
  }

  const found = await findLiveArticle(url, category);
  return {
    title: found?.article.title || "Live story",
    description: found?.article.description || undefined,
  };
}

const Page = async ({ searchParams }: Props) => {
  const { url, category } = await searchParams;

  if (!url || !isValidHttpUrl(url)) {
    notFound();
  }

  const found = await findLiveArticle(url, category);

  // Feed rotated since the reader clicked — no stored copy exists, so offer
  // the external link explicitly rather than auto-redirecting.
  if (!found) {
    return (
      <Box className="py-16 text-slate-900 dark:text-slate-100">
        <Box className="mx-auto max-w-2xl text-center flex flex-col items-center gap-6">
          <Typography className="section-label text-brand-dark!">
            Live story
          </Typography>
          <Typography
            component="h1"
            className="font-serif font-black text-4xl!"
          >
            This story has moved on
          </Typography>
          <Typography className="text-slate-600 dark:text-slate-400">
            Our live feed refreshes hourly and this headline is no longer in
            it. You can still read the full story at the original publisher.
          </Typography>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-slate-900 bg-slate-900 px-6 py-3 font-bold uppercase tracking-widest text-white no-underline transition-colors hover:bg-white hover:text-slate-900 dark:border-slate-100"
          >
            Read at source <OpenInNewIcon fontSize="small" />
          </a>
          <Link
            href="/"
            className="text-xs uppercase tracking-widest font-bold text-slate-500 no-underline hover:underline"
          >
            ← Back to home
          </Link>
        </Box>
      </Box>
    );
  }

  const { article } = found;
  const snippet = cleanSnippet(article.content);
  const description = article.description || "";
  // Avoid printing the same text twice when description == start of content.
  const showDescription =
    description && !snippet.startsWith(description.slice(0, 60));
  const published = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Box className="py-10 text-slate-900 dark:text-slate-100">
      <Box className="mx-auto max-w-3xl">
        {/* Kicker */}
        <Box className="flex items-center gap-3">
          <span className="inline-block bg-brand px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-900">
            Live — {found.category}
          </span>
          <Typography className="text-xs! uppercase tracking-widest text-slate-500 dark:text-slate-400">
            From {article.source?.name}
          </Typography>
        </Box>

        {/* Headline */}
        <Typography
          component="h1"
          className="font-serif font-black text-4xl! md:text-5xl! leading-tight! mt-4!"
        >
          {article.title}
        </Typography>

        {/* Byline */}
        <Box className="flex items-center justify-between flex-wrap gap-4 border-y-2 border-slate-900 dark:border-slate-100 py-4 mt-6 mb-8">
          <Box className="flex flex-col">
            <Typography className="font-bold! text-sm!">
              {article.source?.name}
            </Typography>
            <Typography className="text-xs! uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {published} — {formatRelativeTime(article.publishedAt)}
            </Typography>
          </Box>
        </Box>

        {/* Image */}
        {article.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image}
            alt=""
            className="w-full max-h-[520px] object-cover border hairline mb-8"
          />
        )}

        {/* Licensed snippet */}
        <Box className="article-body text-slate-900 dark:text-slate-200 flex flex-col gap-5">
          {showDescription && (
            <p className="font-semibold">{description}</p>
          )}
          {snippet && <p>{snippet}</p>}
          {!snippet && !showDescription && (
            <p>Read the full story at {article.source?.name}.</p>
          )}
        </Box>

        {/* Continue reading CTA */}
        <Box className="mt-10 border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Box>
            <Typography className="font-serif font-bold! text-lg!">
              This is a preview of reporting by {article.source?.name}.
            </Typography>
            <Typography className="text-sm! text-slate-600 dark:text-slate-400 mt-1!">
              The full story — and the credit — belongs to the original
              publisher.
            </Typography>
          </Box>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 border-2 border-slate-900 bg-slate-900 px-6 py-3 font-bold uppercase tracking-widest text-white no-underline transition-colors hover:bg-brand hover:text-slate-900 dark:border-slate-100"
          >
            Continue reading <OpenInNewIcon fontSize="small" />
          </a>
        </Box>

        {/* Back nav */}
        <Box className="mt-12 border-t-4 border-slate-900 dark:border-slate-100 pt-4">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest font-bold text-slate-600 no-underline hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
          >
            ← Back to Daily Trendline
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
