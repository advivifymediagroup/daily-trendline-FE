import React from "react";
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
import { featuredNews, secondaryNews, gridNews } from "@/components/dummyData";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchCard from "@/components/SearchCard";
type Props = {
  params: Promise<{ category: string }>;
};

const Page = async ({ params }: Props) => {
  const { category } = await params;

  // Combine all news into one array
  const allNews = [featuredNews, ...secondaryNews, ...gridNews];

  // Filter by category (case-insensitive)
  const filteredNews = allNews.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase(),
  );

  const featured = filteredNews[0];
  const restNews = filteredNews.slice(1);

  return (
    <Box className="max-w-7xl mx-auto px-4 py-10">
      {/* Category Header */}
      <Box className="mb-10">
        <Typography variant="h4" className="font-bold capitalize">
          {category} News
        </Typography>

        <Typography className="text-gray-600 mt-2">
          Latest updates and breaking stories from {category}.
        </Typography>

        <Divider className="mt-4!" />
      </Box>

      <Box className="grid lg:grid-cols-4 gap-10">
        {/* Main Content */}
        <Box className="lg:col-span-3">
          {/* Featured Article */}
          {featured && (
            <Card className="mb-10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
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
              Latest in {category}
            </Typography>
            <Box className="grid gap-6">
              {filteredNews.map((item, index) => (
                <SearchCard key={index} {...item} />
              ))}
            </Box>
          </Box>

          {filteredNews.length === 0 && (
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

          {gridNews.slice(0, 4).map((item, index) => (
            <Link
              key={index}
              href={`/${item.category.toLowerCase()}/${item.headline.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md no-underline"
            >
              <Image
                src={item.featuredImage}
                alt={item.headline}
                width={400}
                height={300}
                className="w-20 h-16 object-cover rounded"
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
