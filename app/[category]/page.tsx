import React from "react";
import type { Metadata } from "next";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchCard from "@/components/SearchCard";
import {
  getCategoryBySlug,
  getNewsByCategory,
  getPopularTags,
} from "../api/news";
import { getStrapiMediaURL } from "@/utils/strapiUtils";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

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
  const categoryData = await getCategoryBySlug(category);
  const popularTags = await getPopularTags();

  if (!categoryData) {
    notFound();
  }

  const categoryNews = await getNewsByCategory(category);

  const { data, meta } = categoryNews;

  const normalizedNews = data.map((item: any) => ({
    headline: item.title,
    description: item.description,
    featuredImage:
      getStrapiMediaURL(item.featuredImage?.url) || "/fallback.jpg",
    date: new Date(item.publishedAt).toLocaleDateString(),
    category: item.category?.name || "",
    slug: item.slug,
    isFeatured: item.isFeatured,
    isTrending: item.isTrending,
    documentId: item.documentId,
    id: item.id,
  }));

  const featured =
    normalizedNews.find((item: any) => item.isFeatured) || normalizedNews[0];

  const trendingNews = normalizedNews.filter((item: any) => item.isTrending);
  const categoryStats = [
    {
      label: "Stories loaded",
      value: meta?.pagination?.total ?? normalizedNews.length,
      icon: <NewspaperRoundedIcon />,
      tone: "bg-sky-50 dark:bg-sky-500/10",
    },
    {
      label: "Trending now",
      value: trendingNews.length,
      icon: <BoltRoundedIcon />,
      tone: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      label: "Featured pick",
      value: featured ? "1" : "0",
      icon: <AutoAwesomeRoundedIcon />,
      tone: "bg-emerald-50 dark:bg-emerald-500/10",
    },
  ];

  return (
    <Box className="max-w-7xl mx-auto px-4 py-10 text-slate-900 dark:text-slate-100">
      {/* Category Header */}
      <Box className="mb-10 rounded-[28px] border border-black/10 bg-gradient-to-br from-white via-stone-50 to-amber-50 px-6 py-8 shadow-sm dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <Typography variant="h4" className="font-bold capitalize">
          {categoryData.name} News
        </Typography>

        <Typography className="text-gray-600 mt-2 dark:text-slate-400">
          Latest updates and breaking stories from {categoryData.name}.
        </Typography>

        <Box className="mt-6 grid gap-4 md:grid-cols-3">
          {categoryStats.map((stat) => (
            <Box
              key={stat.label}
              className={`rounded-2xl border border-black/5 p-4 dark:border-white/10 ${stat.tone}`}
            >
              <Box className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                {stat.icon}
                <Typography className="text-sm">{stat.label}</Typography>
              </Box>
              <Typography variant="h5" className="mt-3 font-bold!">
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider className="mt-6!" />
      </Box>

      <Box className="grid lg:grid-cols-4 gap-10">
        {/* Main Content */}
        <Box className="lg:col-span-3">
          {/* Featured Article */}
          {featured && (
            <Link
              href={{
                pathname: `/${featured.category.toLowerCase()}/${featured.slug}`,
                query: {
                  documentId: featured.documentId,
                  id: String(featured.id),
                },
              }}
              className="no-underline block"
            >
              <Card className="mb-10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardMedia
                  component="img"
                  image={featured.featuredImage}
                  alt={featured.headline}
                  className="h-100 w-full object-cover!"
                />

                <CardContent className="bg-white dark:bg-slate-900">
                  <Typography
                    variant="h5"
                    className="font-bold dark:text-slate-100"
                  >
                    {featured.headline}
                  </Typography>

                  {featured?.description && (
                    <Typography className="text-gray-600 mt-2 dark:text-slate-400">
                      {featured.description}
                    </Typography>
                  )}

                  <Box className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-slate-500">
                    <AccessTimeIcon />

                    {featured.date}
                  </Box>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* News Grid */}
          {/* <Box className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {restNews.map((item, index) => (
              <Link
                key={index}
                href={`/${category}/${item?.headline.toLowerCase().replace(/\s+/g, "-")}`}
                className="no-underline"
              >
                <Card className="rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                  <CardMedia
                    component="img"
                    image={item.featuredImage}
                    alt={item.headline}
                    className="h-50 w-full object-cover!"
                  />

                  <CardContent>
                    <Typography className="font-semibold line-clamp-2">
                      {item.headline}
                    </Typography>

                    <Box className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                      <AccessTimeIcon />
                      {item.date}
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Box> */}
          <Box className="">
            <Typography className="font-semibold mb-6! capitalize" variant="h4">
              Latest in {categoryData.name}
            </Typography>
            <Box className="grid gap-6">
              {normalizedNews.map((item: any, index: number) => (
                <SearchCard key={index} {...item} />
              ))}
            </Box>
          </Box>

          {normalizedNews.length === 0 && (
            <Typography className="text-gray-500 mt-10 text-center dark:text-slate-500">
              No news available for this category.
            </Typography>
          )}
        </Box>

        {/* Sidebar */}
        <Box className="hidden lg:flex flex-col gap-6">
          <Box className="rounded-[24px] border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
            <Typography variant="h6" className="font-bold!">
              Explore This Desk
            </Typography>
            <Typography className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Use the featured story for the big picture, then scan the latest
              feed and trending list for fast updates.
            </Typography>
            <Box className="mt-4 flex flex-wrap gap-2">
              <Chip
                label={`${normalizedNews.length} articles shown`}
                className="dark:!bg-slate-800 dark:!text-slate-100"
              />
              <Chip
                label={`${trendingNews.length} trending`}
                className="dark:!bg-slate-800 dark:!text-slate-100"
              />
              {featured && (
                <Chip
                  label="Featured lead"
                  className="dark:!bg-slate-800 dark:!text-slate-100"
                />
              )}
            </Box>
          </Box>

          <Box className="bg-white px-2 py-4 rounded max-h-[73vh] dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <Box className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="text-slate-900 dark:text-white!" />
              <Typography variant="h5" className="font-bold mb-4">
                Trending
              </Typography>
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
                  className="flex gap-3 cursor-pointer rounded-md p-2 no-underline hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <Image
                    src={item.featuredImage || "/fallback.jpg"}
                    alt={item.headline}
                    width={400}
                    height={300}
                    className="w-20 h-16 object-cover rounded"
                    unoptimized
                  />

                  <Typography className="h-18 overflow-hidden text-sm font-medium leading-snug line-clamp-3 dark:text-slate-200">
                    {item.headline}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Box>

          <Box className="bg-white px-4 py-4 rounded dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <Box className="flex items-center gap-2">
              <LocalOfferIcon className="text-slate-900 dark:text-white!" />
              <Typography variant="h5" className="font-bold mb-4">
                Popular Tags
              </Typography>
            </Box>

            <Box className="flex flex-wrap gap-2 mt-4">
              {popularTags.map((tag: any) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="no-underline"
                >
                  <Chip
                    label={tag.name}
                    clickable
                    className="!bg-gray-100 !text-gray-800 hover:!bg-gray-200 dark:!bg-slate-800 dark:!text-slate-200 dark:hover:!bg-slate-700 transition-colors"
                  />
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
