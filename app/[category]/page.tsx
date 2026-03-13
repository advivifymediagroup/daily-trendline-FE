import React from "react";
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { FaClock } from "react-icons/fa";
import Link from "next/link";

const news = [
  {
    id: 1,
    category: "technology",
    title: "Apple announces next generation AI chip",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    time: "2 hours ago",
  },
  {
    id: 2,
    category: "sports",
    title: "India wins thrilling cricket match",
    image: "https://images.unsplash.com/photo-1505842465776-3bfd1889e7e0",
    time: "4 hours ago",
  },
  {
    id: 3,
    category: "technology",
    title: "New electric cars dominate 2026 market",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    time: "6 hours ago",
  },
  {
    id: 4,
    category: "entertainment",
    title: "Streaming platforms releasing big movies",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    time: "8 hours ago",
  },
];

type Props = {
  params: Promise<{
    category: string;
  }>;
};


const page = async ({ params }: Props) => {
  const { category } = await params;

  console.log("PARAMS::", category);

  // Filter news by category
  const filteredNews = news.filter((item) => item.category === category);

  return (
    <Box className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Title */}
      <Box className="mb-10">
        <Typography
          variant="h4"
          className="font-bold capitalize text-gray-900 dark:text-white"
        >
          {category} News
        </Typography>

        <Typography className="text-gray-600 dark:text-gray-400 mt-2">
          Latest updates and breaking news in {category}.
        </Typography>
      </Box>

      {/* Featured Article */}
      {filteredNews.length > 0 && (
        <Box className="mb-12">
          <Card className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-900">
            <CardMedia
              component="img"
              height="400"
              image={filteredNews[0].image}
              alt={filteredNews[0].title}
            />

            <CardContent>
              <Typography
                variant="h5"
                className="font-bold text-gray-900 dark:text-white"
              >
                {filteredNews[0].title}
              </Typography>

              <Box className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <FaClock />
                {filteredNews[0].time}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* News Grid */}
      <Box className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNews.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`}>
            <Card className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 dark:bg-gray-900 cursor-pointer">
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.title}
              />

              <CardContent>
                <Typography className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {item.title}
                </Typography>

                <Box className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <FaClock />
                  {item.time}
                </Box>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Box>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <Typography className="text-gray-500 dark:text-gray-400 mt-10 text-center">
          No news available for this category.
        </Typography>
      )}
    </Box>
  );
};

export default page;
