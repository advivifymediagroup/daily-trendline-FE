"use client";

import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
interface NewsCardProps {
  imgUrl: string;
  width?: string | number;
  height?: string | number;
  headline: string;
  category: string;
  description?: string;
  author: string;
  date: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  imgUrl,
  width = "100%",
  height = 400,
  headline,
  category,
  description,
  author,
  date,
}) => {
  const router = useRouter();

  const slug = headline.toLowerCase().replace(/\s+/g, "-");

  const handleClick = () => {
    router.push(`/${category.toLowerCase()}/${slug}`);
  };

  return (
    <Box
      sx={{ width, height }}
      onClick={handleClick}
      className="relative rounded-sm overflow-hidden group cursor-pointer"
    >
      {/* Background Image */}
      <Box
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        sx={{
          backgroundImage: `url(${imgUrl})`,
        }}
      />

      {/* Gradient Overlay */}
      <Box className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      <Chip
        label={category}
        size="small"
        className="w-fit top-3 left-3 relative bg-[#333333]! text-white!"
      />

      {/* Content */}
      <Box className="absolute bottom-0 p-5 text-white flex flex-col gap-2">
        <Typography variant="h6" className="font-bold leading-snug">
          {headline}
        </Typography>

        {description && (
          <Typography variant="body2" className="text-gray-200 line-clamp-2">
            {description}
          </Typography>
        )}

        <Typography variant="caption" className="text-gray-300">
          {author} • {date}
        </Typography>
      </Box>
    </Box>
  );
};

export default NewsCard;
