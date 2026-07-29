import React from "react";
import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
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

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q?.trim();

  return {
    title: query ? `Search: ${query}` : "Search",
  };
}

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
    <Box className="py-8 text-slate-900 dark:text-slate-100">
      {/* Page masthead */}
      <Box className="mb-10 border-b-4 border-slate-900 dark:border-slate-100 pb-6">
        <Typography className="section-label text-brand-dark!">
          Search
        </Typography>
        <Typography
          component="h1"
          className="font-serif font-black text-5xl! mt-1!"
        >
          {query ? `Results for “${query}”` : "Search the archive"}
        </Typography>
        <Typography className="text-slate-600 mt-2! dark:text-slate-400">
          {query
            ? `${results.length} ${results.length === 1 ? "story" : "stories"} found`
            : "Find articles across every section."}
        </Typography>
      </Box>

      <Box className="grid lg:grid-cols-[2fr_1fr] gap-10">
        {/* Results */}
        <Box className="flex flex-col gap-6">
          <SearchBar initialQuery={query} clearOnSearch={false} />

          {!query && (
            <Typography className="text-slate-500 dark:text-slate-500">
              Try searching for <b>Technology</b>, <b>Sports</b>, etc.
            </Typography>
          )}

          {query && results.length > 0 && (
            <Box className="grid gap-4">
              {results.map((item: any, index: number) => (
                <SearchCard key={index} {...item} />
              ))}
            </Box>
          )}

          {query && results.length === 0 && (
            <Typography className="text-slate-500 dark:text-slate-400">
              No results found for <b>{query}</b>. Try a different keyword.
            </Typography>
          )}
        </Box>

        {/* Trending sidebar */}
        <Box className="h-fit lg:sticky lg:top-24 border hairline bg-white p-5 dark:bg-slate-900">
          <Typography className="section-label pb-3 border-b-2 border-slate-900 dark:border-slate-100 mb-4">
            Trending Now
          </Typography>

          <Box className="flex flex-col gap-3">
            {trendingNews.map((item: any, index: number) => (
              <CategoryNewsCard key={index} {...item} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default page;
