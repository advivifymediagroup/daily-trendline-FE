import React from "react";
import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import SearchCard from "@/components/SearchCard";
import { getNewsByTag, getTagBySlug } from "@/app/api/news";
import { getStrapiMediaURL } from "@/utils/strapiUtils";

type Props = {
  params: Promise<{
    tag: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const tagData = await getTagBySlug(tag);

  if (!tagData) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${tagData.name} Tag`,
  };
}

const Page = async ({ params }: Props) => {
  const { tag } = await params;
  const tagData = await getTagBySlug(tag);

  if (!tagData) {
    notFound();
  }

  const response = await getNewsByTag(tag);
  const articles = (response?.data || []).map((item: any) => ({
    featuredImage:
      getStrapiMediaURL(item.featuredImage?.url) || "/fallback.jpg",
    headline: item.title,
    category: item.category?.name || "General",
    description: item.description || item.excerpt || "",
    date: item.publishedAt
      ? new Date(item.publishedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    slug: item.slug,
    documentId: item.documentId,
    id: item.id,
  }));

  return (
    <Box className="py-8 text-slate-900 dark:text-slate-100">
      <Box className="mb-10 border-b-4 border-slate-900 dark:border-slate-100 pb-6">
        <Typography className="section-label text-brand-dark!">Tag</Typography>
        <Typography
          component="h1"
          className="font-serif font-black text-5xl! mt-1!"
        >
          #{tagData.name}
        </Typography>

        <Typography className="mt-2! text-slate-600 dark:text-slate-400">
          Articles related to the {tagData.name} tag.
        </Typography>
      </Box>

      {articles.length > 0 ? (
        <Box className="grid gap-4 max-w-4xl">
          {articles.map((item: any, index: number) => (
            <SearchCard key={index} {...item} />
          ))}
        </Box>
      ) : (
        <Typography className="text-center text-slate-500 dark:text-slate-500">
          No articles available for this tag yet.
        </Typography>
      )}
    </Box>
  );
};

export default Page;
