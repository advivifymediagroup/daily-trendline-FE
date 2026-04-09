import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import SearchBar from "@/components/SearchBar";
import SearchCard from "@/components/SearchCard";
import CategoryNewsCard from "@/components/CategoryNewsCard";
import { getSearchedArticles, getTickerNews } from "../api/news";
import { getStrapiMediaURL } from "@/utils/strapiUtils";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

const page = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const query = params.q?.trim() || "";

  const [searchResponse, trendingResponse] = await Promise.all([
    query ? getSearchedArticles(query) : Promise.resolve({ data: [] }),
    getTickerNews(),
  ]);

  const results = (searchResponse?.data || []).map((item: any) => ({
    featuredImage:
      getStrapiMediaURL(item.featuredImage?.url) || "/fallback.jpg",
    headline: item.title,
    category: item.category?.name || "General",
    description: item.description || item.excerpt || "",
    date: item.publishedAt
      ? new Date(item.publishedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    slug: item.slug,
    documentId: item.documentId,
    id: item.id,
  }));

  const trendingNews = (trendingResponse?.data || []).map((item: any) => ({
    featuredImage:
      getStrapiMediaURL(item.featuredImage?.url) || "/fallback.jpg",
    headline: item.title,
    category: item.category?.name || "General",
    date: item.publishedAt
      ? new Date(item.publishedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    description: item.description || item.excerpt || "",
    slug: item.slug,
    documentId: item.documentId,
    id: item.id,
  }));

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
            {trendingNews.map((item: any, index: number) => (
              <CategoryNewsCard key={index} {...item} />
            ))}
          </Box>
        </Box>

        {/* CENTER: SEARCH SECTION */}
        <Box>
          <Box className="bg-gray-50 p-6 flex flex-col gap-6">
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
                {results.map((item: any, index: number) => (
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
