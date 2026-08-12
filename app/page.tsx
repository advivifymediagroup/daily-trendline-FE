import NewsCard from "@/components/NewsCard";
import { Box, Typography } from "@mui/material";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import CategoryNewsCard from "@/components/CategoryNewsCard";
import LiveHeadlines from "@/components/LiveHeadlines";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getFeaturedNews,
  getNewsByCategory,
  getTickerNews,
  getTopStories,
} from "./api/news";
import { mapStrapiToNewsCard } from "@/utils/newsCard";

export const metadata: Metadata = {
  title: "Home | DailyTrendline",
};

function SectionHeader({
  label,
  href,
}: {
  label: string;
  href?: string;
}) {
  return (
    <Box className="section-rule pt-3 mb-5 flex items-center justify-between">
      <Typography component="h2" className="section-label">
        {label}
      </Typography>
      {href && (
        <Link
          href={href}
          className="text-xs uppercase tracking-widest font-bold text-slate-500 no-underline hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
        >
          View all →
        </Link>
      )}
    </Box>
  );
}

export default async function Home() {
  const [
    featuredArticles,
    topStories,
    businessNews,
    techNews,
    sportsNews,
    entertainmentNews,
    tickerNews,
  ] = await Promise.all([
    getFeaturedNews(),
    getTopStories(),
    getNewsByCategory("business"),
    getNewsByCategory("technology"),
    getNewsByCategory("sports"),
    getNewsByCategory("entertainment"),
    getTickerNews(),
  ]);

  const briefing = [
    ...(topStories?.data ?? []),
    ...(featuredArticles?.data?.slice(1) ?? []),
  ].slice(0, 5);

  const categorySections = [
    { label: "Business", href: "/business", items: businessNews?.data ?? [] },
    { label: "Technology", href: "/technology", items: techNews?.data ?? [] },
    { label: "Sports", href: "/sports", items: sportsNews?.data ?? [] },
    {
      label: "Entertainment",
      href: "/entertainment",
      items: entertainmentNews?.data ?? [],
    },
  ];

  return (
    <Box className="py-6 flex flex-col gap-12 text-slate-900 dark:text-slate-100">
      <BreakingNewsTicker news={tickerNews?.data} />

      {/* Lead: hero + the briefing */}
      <Box component="section">
        <SectionHeader label="Top of the day" />

        <Box className="grid lg:grid-cols-3 gap-6">
          {/* Hero story */}
          <Box className="lg:col-span-2">
            {featuredArticles?.data?.[0] && (
              <NewsCard
                {...mapStrapiToNewsCard(featuredArticles.data[0])}
                height={500}
              />
            )}
          </Box>

          {/* The briefing — numbered digest */}
          <Box className="border hairline bg-white dark:bg-slate-900 p-5">
            <Typography className="section-label pb-3 border-b-2 border-slate-900 dark:border-slate-100">
              The Briefing
            </Typography>

            <Box className="flex flex-col">
              {briefing.map((item: any, index: number) => {
                const mapped = mapStrapiToNewsCard(item);
                return (
                  <Link
                    key={item.id ?? index}
                    href={`/${mapped.category.toLowerCase()}/${mapped.slug}?documentId=${mapped.documentId ?? ""}&id=${mapped.id}`}
                    className="group flex gap-4 py-4 border-b hairline last:border-b-0 no-underline"
                  >
                    <span className="font-serif font-black text-3xl leading-none text-slate-300 dark:text-slate-700 group-hover:text-brand-dark transition-colors">
                      {index + 1}
                    </span>
                    <Box>
                      <Typography className="font-serif font-semibold! leading-snug text-slate-900 dark:text-slate-100 group-hover:underline decoration-2 underline-offset-2 line-clamp-2">
                        {mapped.headline}
                      </Typography>
                      <Typography className="text-xs! uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1!">
                        {mapped.category} — {mapped.date}
                      </Typography>
                    </Box>
                  </Link>
                );
              })}

              {briefing.length === 0 && (
                <Typography className="text-sm text-slate-500 py-4">
                  No stories yet — check back soon.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Live external headlines (Guardian, full text) */}
      <Reveal>
        <LiveHeadlines
          section="news"
          title="Live from around the web"
          max={6}
        />
      </Reveal>

      {/* Category sections */}
      <Box component="section">
        <SectionHeader label="The Sections" />

        <Box className="grid md:grid-cols-2 gap-6">
          {categorySections.map((section, sectionIndex) => (
            <Reveal
              key={section.label}
              delay={(sectionIndex % 2) * 100}
              className="h-full"
            >
            <Box
              className="border hairline bg-white dark:bg-slate-900 p-5 h-full"
            >
              <Box className="flex items-center justify-between pb-3 border-b-2 border-slate-900 dark:border-slate-100 mb-4">
                <Typography className="section-label">
                  {section.label}
                </Typography>
                <Link
                  href={section.href}
                  className="text-xs uppercase tracking-widest font-bold text-slate-500 no-underline hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
                >
                  More →
                </Link>
              </Box>

              <Box className="flex flex-col gap-3">
                {section.items.map((item: any, index: number) => (
                  <CategoryNewsCard key={index} {...mapStrapiToNewsCard(item)} />
                ))}

                {section.items.length === 0 && (
                  <Typography className="text-sm text-slate-500">
                    Nothing here yet.
                  </Typography>
                )}
              </Box>
            </Box>
            </Reveal>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
