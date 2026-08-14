import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FeedCard, { type FeedItem } from "@/components/FeedCard";
import Reveal from "@/components/Reveal";
import { getCategoryBySlug, getNewsByCategory } from "../api/news";
import { mapStrapiToNewsCard } from "@/utils/newsCard";
import {
  getGuardianHeadlines,
  toGuardianSection,
  formatRelativeTime,
  readingTime,
  largerImage,
} from "@/utils/guardian";

type Props = {
  params: Promise<{ category: string }>;
};

/** "business" -> "Business" — used when the CMS has no record for the slug. */
function titleFromSlug(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategoryBySlug(category);
  const name = categoryData?.name ?? titleFromSlug(category);

  if (!categoryData && !toGuardianSection(category)) {
    return { title: "Page Not Found" };
  }

  return { title: `${name} News` };
}

const Page = async ({ params }: Props) => {
  const { category } = await params;
  const guardianSection = toGuardianSection(category);
  const categoryData = await getCategoryBySlug(category);

  // Valid if the CMS knows it OR it maps to a Guardian section, so the
  // standard sections keep working when Strapi is unavailable.
  if (!categoryData && !guardianSection) {
    notFound();
  }

  const categoryName = categoryData?.name ?? titleFromSlug(category);

  const [categoryNews, guardian] = await Promise.all([
    getNewsByCategory(category, 12),
    guardianSection
      ? getGuardianHeadlines(guardianSection, 10)
      : Promise.resolve([]),
  ]);

  const ownItems: FeedItem[] = (categoryNews?.data ?? []).map(
    (item: any, index: number) => {
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
        layout: index === 0 ? "lead" : "compact",
      };
    },
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
    layout: index % 4 === 0 ? "lead" : "compact",
  }));

  const feed = [...ownItems, ...guardianItems];

  return (
    <div className="text-slate-900 dark:text-slate-100">
      {/* Section header */}
      <div className="mb-2 border-b-2 border-slate-900 pb-3 dark:border-slate-100">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-dark">
          Section
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {categoryName}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Latest updates and breaking stories from {categoryName}.
        </p>
      </div>

      <div className="flex flex-col">
        {feed.map((item, index) => (
          <Reveal key={`${item.href}-${index}`} delay={index < 3 ? 0 : 60}>
            <FeedCard item={item} />
          </Reveal>
        ))}

        {feed.length === 0 && (
          <p className="py-10 text-center text-slate-500">
            No stories in this section yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
