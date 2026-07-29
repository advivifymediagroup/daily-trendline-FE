import React from "react";
import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SearchCard from "@/components/SearchCard";
import LiveHeadlines from "@/components/LiveHeadlines";
import Reveal from "@/components/Reveal";
import {
  getCategoryBySlug,
  getNewsByCategory,
  getPopularTags,
} from "../api/news";
import { getStrapiMediaURL } from "@/utils/strapiUtils";
import { toGNewsCategory } from "@/utils/gnews";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategoryBySlug(category);

  if (!categoryData) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${categoryData.name} News`,
  };
}

const Page = async ({ params }: Props) => {
  const { category } = await params;
  const [categoryData, popularTags] = await Promise.all([
    getCategoryBySlug(category),
    getPopularTags(),
  ]);

  if (!categoryData) {
    notFound();
  }

  const categoryNews = await getNewsByCategory(category, 12);
  const { data } = categoryNews;

  const normalizedNews = data.map((item: any) => ({
    headline: item.title,
    description: item.description,
    featuredImage:
      getStrapiMediaURL(item.featuredImage?.url) || "/fallback.jpg",
    date: new Date(item.publishedAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    category: item.category?.name || "",
    slug: item.slug,
    isFeatured: item.isFeatured,
    isTrending: item.isTrending,
    documentId: item.documentId,
    id: item.id,
  }));

  const featured =
    normalizedNews.find((item: any) => item.isFeatured) || normalizedNews[0];

  const restNews = normalizedNews.filter((item: any) => item !== featured);
  const trendingNews = normalizedNews.filter((item: any) => item.isTrending);
  const gnewsCategory = toGNewsCategory(category);

  return (
    <Box className="py-8 text-slate-900 dark:text-slate-100">
      {/* Category masthead */}
      <Box className="mb-10 border-b-4 border-slate-900 dark:border-slate-100 pb-6">
        <Typography className="section-label text-brand-dark!">
          Section
        </Typography>
        <Typography
          component="h1"
          className="font-serif font-black text-5xl! md:text-6xl! capitalize mt-1!"
        >
          {categoryData.name}
        </Typography>
        <Typography className="text-slate-600 mt-2! dark:text-slate-400">
          Latest updates and breaking stories from {categoryData.name}.
        </Typography>
      </Box>

      <Box className="grid lg:grid-cols-4 gap-10">
        {/* Main column */}
        <Box className="lg:col-span-3 flex flex-col gap-12">
          {/* Featured article */}
          {featured && (
            <Link
              href={{
                pathname: `/${featured.category.toLowerCase()}/${featured.slug}`,
                query: {
                  documentId: featured.documentId,
                  id: String(featured.id),
                },
              }}
              className="no-underline block group"
            >
              <Box className="border border-slate-900 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
                <Box className="relative h-[400px] overflow-hidden">
                  <Image
                    src={featured.featuredImage}
                    alt={featured.headline}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <span className="absolute top-0 left-0 bg-brand px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-900">
                    Featured
                  </span>
                </Box>

                <Box className="p-6">
                  <Typography
                    variant="h5"
                    className="font-serif font-bold! text-slate-900 dark:text-slate-100 group-hover:underline decoration-2 underline-offset-4"
                  >
                    {featured.headline}
                  </Typography>

                  {featured?.description && (
                    <Typography className="text-slate-600 mt-2! dark:text-slate-400">
                      {featured.description}
                    </Typography>
                  )}

                  <Typography className="text-xs! uppercase tracking-widest text-slate-500 mt-4! dark:text-slate-400">
                    {featured.date}
                  </Typography>
                </Box>
              </Box>
            </Link>
          )}

          {/* Latest list */}
          <Box>
            <Box className="section-rule pt-3 mb-5">
              <Typography component="h2" className="section-label capitalize">
                Latest in {categoryData.name}
              </Typography>
            </Box>

            <Box className="grid gap-4">
              {restNews.map((item: any, index: number) => (
                <Reveal key={index} delay={Math.min(index, 4) * 70}>
                  <SearchCard {...item} />
                </Reveal>
              ))}
            </Box>

            {normalizedNews.length === 0 && (
              <Typography className="text-slate-500 mt-6 text-center dark:text-slate-500">
                No news available for this category.
              </Typography>
            )}
          </Box>

          {/* Live external headlines for this category */}
          {gnewsCategory && (
            <Reveal>
              <LiveHeadlines
                category={gnewsCategory}
                title={`Live ${categoryData.name} headlines`}
                max={6}
              />
            </Reveal>
          )}
        </Box>

        {/* Sidebar */}
        <Box className="hidden lg:flex flex-col gap-6">
          <Box className="border hairline bg-white p-5 dark:bg-slate-900">
            <Box className="flex items-center gap-2 pb-3 border-b-2 border-slate-900 dark:border-slate-100 mb-4">
              <TrendingUpIcon fontSize="small" />
              <Typography className="section-label">Trending</Typography>
            </Box>

            <Box className="flex flex-col gap-3">
              {trendingNews.map((item: any, index: number) => (
                <Link
                  key={index}
                  href={{
                    pathname: `/${item.category.toLowerCase()}/${item.slug}`,
                    query: {
                      documentId: item.documentId,
                      id: String(item.id),
                    },
                  }}
                  className="flex gap-3 group no-underline border-b hairline pb-3 last:border-b-0"
                >
                  <Image
                    src={item.featuredImage || "/fallback.jpg"}
                    alt={item.headline}
                    width={400}
                    height={300}
                    className="w-20 h-16 object-cover border hairline"
                    unoptimized
                  />

                  <Typography className="text-sm font-serif font-medium leading-snug line-clamp-3 text-slate-900 group-hover:underline dark:text-slate-200">
                    {item.headline}
                  </Typography>
                </Link>
              ))}

              {trendingNews.length === 0 && (
                <Typography className="text-sm text-slate-500">
                  Nothing trending right now.
                </Typography>
              )}
            </Box>
          </Box>

          <Box className="border hairline bg-white p-5 dark:bg-slate-900">
            <Box className="flex items-center gap-2 pb-3 border-b-2 border-slate-900 dark:border-slate-100 mb-4">
              <LocalOfferIcon fontSize="small" />
              <Typography className="section-label">Popular Tags</Typography>
            </Box>

            <Box className="flex flex-wrap gap-2">
              {popularTags.map((tag: any) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="no-underline border hairline px-3 py-1 text-xs uppercase tracking-widest font-bold text-slate-700 hover:bg-slate-900 hover:text-white transition-colors dark:text-slate-300 dark:hover:bg-slate-100 dark:hover:text-slate-900"
                >
                  {tag.name}
                </Link>
              ))}

              {popularTags.length === 0 && (
                <Typography className="text-sm text-slate-500">
                  No tags yet.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
