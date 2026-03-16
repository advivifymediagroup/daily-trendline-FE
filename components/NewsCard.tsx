import React from "react";
import { Box, Typography, Chip } from "@mui/material";

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
  return (
    <Box
      sx={{ width, height }}
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

      {/* Content */}
      <Box className="absolute bottom-0 p-5 text-white flex flex-col gap-2">
        <Chip
          label={category}
          size="small"
          className="w-fit !bg-red-600 !text-white"
        />

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
