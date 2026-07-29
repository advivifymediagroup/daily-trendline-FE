"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { StrapiImage } from "./StrapiImage";

interface CategoryNewsCardProps {
  width?: string;
  featuredImage: string;
  headline: string;
  category: string;
  date?: string;
  description?: string;
  slug?: string;
  documentId?: string;
  id?: string | number;
}

const CategoryNewsCard: React.FC<CategoryNewsCardProps> = ({
  width = "w-full",
  featuredImage,
  headline,
  category,
  date,
  slug,
  documentId,
  id,
}) => {
  const router = useRouter();

  const fallbackSlug = headline
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");

  const handleClick = () => {
    const queryParams = new URLSearchParams();

    if (documentId) {
      queryParams.set("documentId", documentId);
    }

    if (id !== undefined) {
      queryParams.set("id", String(id));
    }

    const articleSlug = slug || fallbackSlug;
    const queryString = queryParams.toString();

    router.push(
      `/${category.toLowerCase()}/${articleSlug}${queryString ? `?${queryString}` : ""}`,
    );
  };

  return (
    <Box
      onClick={handleClick}
      className={`flex gap-4 ${width} cursor-pointer group border-b hairline pb-3 last:border-b-0`}
    >
      {/* Thumbnail */}
      <Box className="min-w-[100px] h-[80px] relative overflow-hidden border hairline">
        <StrapiImage
          src={featuredImage}
          alt={headline}
          width={100}
          height={80}
          className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      </Box>

      {/* Content */}
      <Box className="flex flex-col justify-between py-0.5">
        <Typography className="font-serif font-semibold! leading-snug text-slate-900 group-hover:underline decoration-2 underline-offset-2 dark:text-slate-100 line-clamp-2 overflow-hidden">
          {headline}
        </Typography>

        <Typography className="text-xs! uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {category}
          {date ? ` — ${date}` : ""}
        </Typography>
      </Box>
    </Box>
  );
};

export default CategoryNewsCard;
