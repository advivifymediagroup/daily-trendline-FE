import type { Metadata } from "next";
import Link from "next/link";
import FeedCard, { type FeedItem } from "@/components/FeedCard";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import Reveal from "@/components/Reveal";
import {
  getFeaturedNews,
  getLatestNews,
  getNewsByCategory,
  getTickerNews,
  getTopStories,
} from "./api/news";
import { mapStrapiToNewsCard } from "@/utils/newsCard";
import {
  getGuardianHeadlines,
  formatRelativeTime,
  readingTime,
  largerImage,
} from "@/utils/guardian";

export const metadata: Metadata = {
  title: "Home | DailyTrendline",
};

/** Strapi article -> feed row. */
function fromStrapi(item: any, layout: FeedItem["layout"]): FeedItem {
  const mapped = mapStrapiToNewsCard(item);
  const query = `documentId=${mapped.documentId ?? ""}&id=${mapped.id}`;

  return {
    href: `/${mapped.category.toLowerCase()}/${mapped.slug}?${query}`,
    source: "Daily Trendline",
    sourceNote: `newsroom · ${mapped.author}`,
    verified: true,
    headline: mapped.headline,
    summary: mapped.description,
    image: mapped.featuredImage,
    timeAgo: mapped.date,
    category: mapped.category,
    layout,
  };
}

export default async function Home() {
  const [featured, topStories, latest, tickerNews, guardian] =
    await Promise.all([
      getFeaturedNews(),
      getTopStories(),
      getLatestNews(12),
      getTickerNews(),
      getGuardianHeadlines("news", 10),
    ]);

  // Flagged stories lead the feed, then every other published article,
  // then live wire copy fills out whatever's left. De-duped so a story
  // that's both featured and in the latest batch isn't shown twice.
  const seen = new Set<string | number>();
  const ownStories: any[] = [];
  for (const item of [
    ...(featured?.data ?? []),
    ...(topStories?.data ?? []),
    ...(latest?.data ?? []),
  ]) {
    const key = item.documentId ?? item.id;
    if (seen.has(key)) continue;
    seen.add(key);
    ownStories.push(item);
  }

  const ownItems: FeedItem[] = ownStories.map((item, index) =>
    fromStrapi(item, index === 0 ? "lead" : "compact"),
  );

  const guardianItems: FeedItem[] = guardian.map((article, index) => ({
    href: `/read?g=${encodeURIComponent(article.id)}`,
    source: "The Guardian",
    sourceNote: `partner publisher · ${article.sectionName}`,
    verified: true,
    headline: article.title,
    summary: article.standfirst ?? undefined,
    image:
      index % 4 === 0 ? largerImage(article.thumbnail) : article.thumbnail,
    timeAgo: formatRelativeTime(article.publishedAt),
    readingTime: readingTime(article),
    // Give the wire feed a lead image every few rows for rhythm.
    layout: index % 4 === 0 ? "lead" : "compact",
  }));

  const feed = [...ownItems, ...guardianItems];

  return (
    <div className="text-slate-900 dark:text-slate-100">
      {tickerNews?.data?.length ? (
        <div className="mb-6">
          <BreakingNewsTicker news={tickerNews.data} />
        </div>
      ) : null}

      {/* Feed header */}
      <div className="mb-2 flex items-baseline justify-between gap-4 border-b-2 border-slate-900 pb-3 dark:border-slate-100">
        <h1 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100">
          Latest headlines
        </h1>
        <Link
          href="/search"
          className="text-xs font-bold uppercase tracking-widest text-slate-500 no-underline hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
        >
          Search →
        </Link>
      </div>

      {/* The feed */}
      <div className="flex flex-col">
        {feed.map((item, index) => (
          <Reveal key={`${item.href}-${index}`} delay={index < 3 ? 0 : 60}>
            <FeedCard item={item} />
          </Reveal>
        ))}

        {feed.length === 0 && (
          <p className="py-10 text-center text-slate-500">
            No stories yet — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
