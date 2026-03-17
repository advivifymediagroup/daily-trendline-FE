"use client";

import React from "react";
import { Box, Typography, Chip, Tooltip } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CategoryNewsCardProps {
  imgUrl: string;
  headline: string;
  category: string;
  date?: string;
}

const CategoryNewsCard: React.FC<CategoryNewsCardProps> = ({
  imgUrl,
  headline,
  category,
  date,
}) => {
  const router = useRouter();

  const slug = headline
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");

  const handleClick = () => {
    router.push(`/${category.toLowerCase()}/${slug}`);
  };

  return (
    <Box
      onClick={handleClick}
      className="flex gap-4 cursor-pointer rounded-lg hover:bg-gray-100 transition group mb-4"
    >
      {/* Left Image */}
      <Box className="min-w-[100px] h-[80px] relative">
        <Image
          src={imgUrl}
          alt={headline}
          fill
          className="object-cover rounded"
        />
      </Box>

      {/* Right Content */}
      <Box className="flex flex-col">
        {/* Headline with Tooltip */}
        <Tooltip title={headline} arrow>
          <Typography
            className="font-semibold text-gray-800 group-hover:text-blue-800 group-hover:underline transition 
            line-clamp-2 overflow-hidden text-ellipsis mb-2!"
          >
            {headline}
          </Typography>
        </Tooltip>

        {/* Category */}
        <Typography className="text-sm font-medium mt-1">{category}</Typography>
      </Box>
    </Box>
  );
};

export default CategoryNewsCard;
