"use client";

import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { StrapiImage } from "./StrapiImage";

interface CategoryNewsCardProps {
  width?: string;
  featuredImage: string;
  headline: string;
  category: string;
  date?: string;
  description?: string;
}

const CategoryNewsCard: React.FC<CategoryNewsCardProps> = ({
  width = "w-full",
  featuredImage,
  headline,
  category,
  date,
  description,
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
      className={`flex gap-4 ${width} cursor-pointer rounded-lg hover:bg-gray-100 transition group mb-4`}
    >
      {/* Left Image */}
      <Box className="min-w-[100px] h-[80px] relative overflow-hidden">
        <StrapiImage
          src={featuredImage}
          alt={headline}
          width={100}
          height={80}
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
        {/* <Typography>{description}</Typography> */}

        {/* Category */}
        <Typography className="text-sm font-medium mt-1">{category}</Typography>
      </Box>
    </Box>
  );
};

export default CategoryNewsCard;
