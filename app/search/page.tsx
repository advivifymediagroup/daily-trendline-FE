import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import {
  featuredNews,
  secondaryNews,
  gridNews,
  latestCategoryNews,
} from "@/components/dummyData";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";
import SearchCard from "@/components/SearchCard";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

const page = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const query = params.q?.toLowerCase().trim() || "";

  const allNews = [
    featuredNews,
    ...secondaryNews,
    ...gridNews,
    ...latestCategoryNews,
  ];

  const results = allNews.filter((item) => {
    return (
      item.headline.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  const trendingNews = allNews.slice(0, 6);

  return (
    <Box className="max-w-7xl mx-auto px-4 py-8">
      <Box className="grid lg:grid-cols-[1fr_2fr] gap-8">
        {/* LEFT: TRENDING */}
        <Box className="flex flex-col gap-4 sticky top-24 h-fit">
          <Typography variant="h6" className="font-bold">
            Trending News
          </Typography>

          <Divider />

          <Box className="flex flex-col gap-2">
            {trendingNews.map((item, index) => (
              <NewsCard key={index} {...item} />
            ))}
          </Box>
        </Box>

        {/* CENTER: SEARCH SECTION */}
        <Box>
          <Box className="bg-gray-50  p-6 flex flex-col gap-6">
            {/* Title */}
            <Box>
              <Typography variant="h5" className="font-bold">
                Search News
              </Typography>

              <Typography className="text-gray-500 text-sm mt-1">
                {query
                  ? `Showing results for "${query}"`
                  : "Find articles across categories"}
              </Typography>
            </Box>

            {/* Search Bar */}
            <Box className="">
              <SearchBar />
            </Box>

            <Divider />

            {/* RESULTS */}
            {!query && (
              <Typography className="text-gray-400">
                Try searching for <b>Technology</b>, <b>Sports</b>, etc.
              </Typography>
            )}

            {query && results.length > 0 && (
              <Box className="grid gap-6">
                {results.map((item, index) => (
                  <SearchCard key={index} {...item} />
                ))}
              </Box>
            )}

            {query && results.length === 0 && (
              <Typography className="text-gray-500">
                No results found for <b>{query}</b>
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default page;
