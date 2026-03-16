import React from "react";
import { Box, Typography, Card, CardMedia, Divider } from "@mui/material";
import Link from "next/link";
import {
  featuredNews,
  secondaryNews,
  gridNews,
} from "../../../components/dummyData";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

type Props = {
  params: {
    category: string;
    news: string;
  };
};

const Page = async ({ params }: Props) => {
  const { category, news } = await params;

  // Combine all news
  const allNews = [featuredNews, ...secondaryNews, ...gridNews];

  // Find the news item that matches the headline (case-insensitive)
  const newsItem = allNews.find(
    (item) =>
      item.headline?.toLowerCase().replace(/\s+/g, "-") === news?.toLowerCase(),
  );

  if (!newsItem) {
    return (
      <Box className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-500">
        News article not found.
      </Box>
    );
  }

  return (
    <Box className="mx-auto px-4 py-10 max-w-[1310px]!">
      {/* Breadcrumb */}
      <Box className="mb-4 text-sm text-gray-500">
        <Link href={`/${category}`} className="hover:underline capitalize">
          {category} News
        </Link>{" "}
        / <span className="capitalize">{newsItem.headline}</span>
      </Box>

      {/* Headline */}
      <Typography variant="h3" className="font-bold mb-4">
        {newsItem.headline}
      </Typography>

      {/* Date */}
      <Box className="flex items-center gap-2 text-sm text-gray-500 my-2">
        <AccessTimeIcon /> {newsItem.date}
      </Box>

      {/* Featured Image */}
      <Card className="mb-6 rounded-xl overflow-hidden shadow-lg">
        <CardMedia
          component="img"
          height="420"
          image={newsItem.imgUrl}
          alt={newsItem.headline}
        />
      </Card>

      {/* Description / Content */}
      <Typography className="text-gray-700 leading-relaxed mb-6">
        {newsItem.content ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet lacus enim. Nulla facilisi. Pellentesque vel dolor at quam efficitur dapibus. Suspendisse potenti."}
      </Typography>

      {/* Additional Paragraphs */}
      <Typography className="text-gray-700 leading-relaxed my-4!">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit
        amet accumsan arcu. Donec euismod orci sed lectus tincidunt, nec lacinia
        metus fringilla.
      </Typography>

      <Typography className="text-gray-700 leading-relaxed my-4!">
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
        cubilia curae; Cras hendrerit, eros vel malesuada faucibus, augue massa
        consectetur libero, in venenatis eros lorem ut purus.
      </Typography>

      {/* <Divider className="my-6" /> */}

      {/* Back Button */}
      {/* <Link
        href={`/${category}`}
        className="inline-block bg-black text-white px-6 py-2 rounded"
      >
        ← Back to {category} News
      </Link> */}
    </Box>
  );
};

export default Page;
