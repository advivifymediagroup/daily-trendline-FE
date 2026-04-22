"use client";

import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useRouter } from "next/navigation";

interface NewsCardProps {
  featuredImage: string;
  width?: string | number;
  height?: string | number;
  headline: string;
  category: string;
  slug: string;
  description?: string;
  author: string;
  date: string;
  chipColor?: string;
  documentId?: string;
  id: string | number;
}

const NewsCard: React.FC<NewsCardProps> = ({
  featuredImage,
  width = "100%",
  height = 400,
  headline,
  category,
  slug,
  description,
  author,
  date,
  documentId,
  id,
  chipColor,
}) => {
  const router = useRouter();

  const handleClick = () => {
    const queryParams = new URLSearchParams();

    if (documentId) {
      queryParams.set("documentId", documentId);
    }

    queryParams.set("id", String(id));

    router.push(`/${category.toLowerCase()}/${slug}?${queryParams.toString()}`);
  };

  return (
    <Box
      sx={{ width, height }}
      onClick={handleClick}
      className="relative rounded-sm overflow-hidden group cursor-pointer"
    >
      <Box
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        sx={{
          backgroundImage: `url(${featuredImage})`,
        }}
      />

      <Box className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      <Chip
        label={category}
        size="small"
        sx={{ bgcolor: chipColor }}
        className="w-fit top-3 left-3 relative text-white!"
      />

      <Box className="absolute bottom-0 p-5 text-white flex flex-col gap-2">
        <Typography variant="h6" className="font-bold leading-snug">
          {headline}
        </Typography>

        {description && (
          <Typography variant="body2" className="text-gray-200 line-clamp-2">
            {description}
          </Typography>
        )}

        <Typography variant="caption" className="text-gray-300 capitalize">
          {author} • {date}
        </Typography>
      </Box>
    </Box>
  );
};

export default NewsCard;
