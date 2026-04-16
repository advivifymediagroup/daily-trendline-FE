import React from "react";
import type { Metadata } from "next";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchCard from "@/components/SearchCard";
import { getCategoryBySlug, getNewsByCategory } from "../api/news";
import { getStrapiMediaURL } from "@/utils/strapiUtils";

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

  return (
    <Box className="max-w-7xl mx-auto px-4 py-10">
      {/* Category Header */}
      <Box className="mb-10">
        <Typography variant="h4" className="font-bold capitalize">
          {categoryData.name} News
        </Typography>

        <Typography className="text-gray-600 mt-2">
          Latest updates and breaking stories from {categoryData.name}.
        </Typography>

        <Divider className="mt-4!" />
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

                <CardContent>
                  <Typography variant="h5" className="font-bold">
                    {featured.headline}
                  </Typography>

                  {featured?.description && (
                    <Typography className="text-gray-600 mt-2">
                      {featured.description}
                    </Typography>
                  )}

                  <Box className="flex items-center gap-2 mt-4 text-sm text-gray-500">
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
            <Typography className="text-gray-500 mt-10 text-center">
              No news available for this category.
            </Typography>
          )}
        </Box>

        {/* Sidebar */}
        <Box className="hidden lg:flex flex-col gap-6 bg-white px-2 py-4 rounded max-h-[80vh]">
          <Typography variant="h5" className="font-bold">
            Trending
          </Typography>

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
              className="flex gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md no-underline"
            >
              <Image
                src={item.featuredImage || "/fallback.jpg"}
                alt={item.headline}
                width={400}
                height={300}
                className="w-20 h-16 object-cover rounded"
                unoptimized
              />

              <Typography className="text-sm font-medium line-clamp-3 leading-snug h-18 overflow-hidden">
                {item.headline}
              </Typography>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
