// "use client";
import NewsCard from "@/components/NewsCard";
import { Box, Typography } from "@mui/material";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import CategoryNewsCard from "@/components/CategoryNewsCard";
import type { Metadata } from "next";
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

// function blockRenderer(block: TBlocks, index: number) {
//   switch (block.__component) {
//     case "layout.hero-section":
//       return <HeroSection key={index} data={block as IHeroSectionProps} />;
//     case "layout.features-section":
//       return (
//         <FeaturesSection key={index} data={block as IFeaturesSectionProps} />
//       );
//     default:
//       return null;
//   }
// }

export default async function Home() {
  const featuredArticles = await getFeaturedNews();

  const topStories = await getTopStories();
  const businessNews = await getNewsByCategory("business");
  const techNews = await getNewsByCategory("technology");
  const sportsNews = await getNewsByCategory("sports");
  const entertainmentNews = await getNewsByCategory("entertainment");
  const tickerNews = await getTickerNews();

  return (
    <Box className="homepage max-w-7xl mx-auto px-4 py-6 flex flex-col gap-10 text-slate-900 dark:text-slate-100">
      <BreakingNewsTicker news={tickerNews?.data} />
      {/* Featured Section */}
      <Box className="flex flex-col gap-4">
        <Typography variant="h4" className="font-bold">
          Featured News
        </Typography>

        <Box className="grid md:grid-cols-3 gap-3">
          {/* LEFT BIG CARD */}
          <Box className="md:col-span-2">
            {featuredArticles.data[0] && (
              <NewsCard
                {...mapStrapiToNewsCard(featuredArticles.data[0])}
                height={492}
              />
            )}
          </Box>

          {/* RIGHT SIDE */}
          <Box className="flex flex-col gap-3">
            {featuredArticles.data.slice(1, 3).map((item: any) => (
              <NewsCard
                key={item.id}
                {...mapStrapiToNewsCard(item)}
                height={240}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Top Stories */}
      <Box className="flex flex-col gap-4">
        <Typography variant="h5" className="font-bold!">
          Top Stories
        </Typography>

        <Box className="grid md:grid-cols-2 gap-6">
          {topStories.data.map((item: any) => (
            <NewsCard key={item.id} {...mapStrapiToNewsCard(item)} />
          ))}
        </Box>
      </Box>

      {/* Latest News */}
      {/* <Box className="flex flex-col gap-4">
        <Typography variant="h5" className="font-bold">
          Latest News
        </Typography>

        <Box className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gridNews.map((news, index) => (
            <NewsCard key={index} {...news} />
          ))}
        </Box>
      </Box> */}

      {/* LATEST SECTION */}
      <Box className="flex flex-col gap-6 mt-2">
        {/* <Typography variant="h5" className="font-bold">
          Latest News
        </Typography> */}

        <Box className="grid md:grid-cols-2 gap-6">
          {/* Business Section */}
          <Box className="bg-white rounded-sm flex flex-col gap-4 p-4 dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <Typography variant="h5" className="font-bold! text-lg pb-2">
              Latest in Business
            </Typography>

            <Box className="flex flex-col gap-3">
              {businessNews.data.map((item: any, index: number) => (
                <CategoryNewsCard key={index} {...mapStrapiToNewsCard(item)} />
              ))}
            </Box>
          </Box>
          {/* Tech Section */}
          <Box className="bg-white rounded-sm flex flex-col gap-4 p-4 dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <Typography variant="h5" className="font-bold! pb-2">
              Latest in Technology
            </Typography>

            <Box className="flex flex-col gap-3">
              {techNews.data.map((item: any, index: number) => (
                <CategoryNewsCard key={index} {...mapStrapiToNewsCard(item)} />
              ))}
            </Box>
          </Box>

          {/* Sports Section */}
          <Box className="bg-white rounded-sm flex flex-col gap-4 p-4 dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <Typography variant="h5" className="font-bold! text-lg pb-2">
              Latest in Sports
            </Typography>

            <Box className="flex flex-col gap-3">
              {sportsNews.data.map((item: any, index: number) => (
                <CategoryNewsCard key={index} {...mapStrapiToNewsCard(item)} />
              ))}
            </Box>
          </Box>

          {/* Entertainment Section */}
          <Box className="bg-white rounded-sm flex flex-col gap-4 p-4 dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <Typography variant="h5" className="font-bold! text-lg pb-2">
              Latest in Entertainment
            </Typography>

            <Box className="flex flex-col gap-3">
              {entertainmentNews.data.map((item: any, index: number) => (
                <CategoryNewsCard key={index} {...mapStrapiToNewsCard(item)} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
