import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Divider,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import {
  featuredNews,
  secondaryNews,
  gridNews,
  latestCategoryNews,
} from "../../../components/dummyData";
import { Avatar, IconButton } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";

type Props = {
  params: {
    category: string;
    news: string;
  };
};

const Page = async ({ params }: Props) => {
  const { category, news } = await params;

  // Combine all news
  const allNews = [
    featuredNews,
    ...secondaryNews,
    ...gridNews,
    ...latestCategoryNews,
  ];

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
      <Typography variant="h3" className="font-bold mb-4 text-[#333333]">
        {newsItem.headline}
      </Typography>

      <Box className="flex items-center justify-between flex-wrap gap-4 mb-6 mt-4">
        {/* LEFT: Author Info */}
        <Box className="flex items-center gap-4">
          <Avatar className="bg-gray-300 text-black">
            {newsItem.author?.charAt(0)}
          </Avatar>

          <Box className="flex flex-col">
            <Typography className="font-semibold! underline">
              {newsItem.author}
            </Typography>

            <Box className="flex items-center gap-1 mt-2 text-sm text-gray-500">
              {/* <AccessTimeIcon fontSize="small" /> */}
              {newsItem.date}
            </Box>
          </Box>
        </Box>

        {/* Share Buttons */}
        <Box className="flex items-center gap-2">
          <Box className="flex justify-center items-center">
            <ShareIcon className="text-black m-2" />
            <Typography>Share</Typography>
          </Box>

          <Tooltip title="Share on Facebook">
            <IconButton className="text-black! hover:text-blue-600!">
              <FacebookIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share on X">
            <IconButton className="text-black! hover:text-black!">
              <XIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send via Email">
            <IconButton className="text-black! hover:text-red-500!">
              <EmailIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Copy Link">
            <IconButton
            // className="text-gray-600 hover:text-green-600"
            // onClick={() => {
            //   navigator.clipboard.writeText(window.location.href);
            // }}
            >
              <LinkIcon className="text-black!" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Featured Image */}
      <Card className="mb-6 rounded-xl overflow-hidden shadow-lg">
        <CardMedia
          component="img"
          image={newsItem.imgUrl}
          alt={newsItem.headline}
          className="h-150 w-full object-cover!"
        />
      </Card>

      {/* Description / Content */}
      <Typography className="text-[#111111] leading-relaxed mb-6">
        {newsItem.content ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet lacus enim. Nulla facilisi. Pellentesque vel dolor at quam efficitur dapibus. Suspendisse potenti."}
      </Typography>

      {/* Additional Paragraphs */}
      <Typography className="text-[#111111] leading-relaxed my-4!">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit
        amet accumsan arcu. Donec euismod orci sed lectus tincidunt, nec lacinia
        metus fringilla.
      </Typography>

      <Typography className="text-[#111111] leading-relaxed my-4!">
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
