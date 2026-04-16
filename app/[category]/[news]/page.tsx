import React from "react";
import type { Metadata } from "next";
import { Avatar, Box, Card, CardMedia, Typography } from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleById } from "@/app/api/news";
import ArticleShareActions from "@/components/ArticleShareActions";
import { getStrapiMediaURL } from "@/utils/strapiUtils";

type Props = {
  params: Promise<{
    category: string;
    news: string;
  }>;
  searchParams: Promise<{
    documentId?: string;
    id?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { documentId, id } = await searchParams;

  if (!documentId && !id) {
    return {
      title: "Page Not Found",
    };
  }

  const article = await getArticleById(documentId ?? "", id ?? "");

  if (!article) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: article.title || "Article",
  };
}

const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  const { documentId, id } = await searchParams;

  if (!documentId && !id) {
    notFound();
  }

  const article = await getArticleById(documentId ?? "", id ?? "");

  if (!article) {
    notFound();
  }

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const articleImage =
    getStrapiMediaURL(article.featuredImage?.url) || "/fallback.jpg";
  const articleTitle = article.title || "Untitled article";
  const articleAuthor = article.author?.name || "Admin";
  const articleContent =
    article.content || article.description || article.excerpt || "";
  const articleCategory = article.category?.name || category;

  return (
    <Box className="mx-auto px-4 py-10 max-w-[1310px]!">
      {/* Breadcrumb */}
      <Box className="mb-4 text-sm text-gray-500">
        <Link
          href={`/${articleCategory.toLowerCase()}`}
          className="hover:underline capitalize"
        >
          {articleCategory} News
        </Link>{" "}
        / <span className="capitalize">{articleTitle}</span>
      </Box>

      {/* Headline */}
      <Typography variant="h3" className="font-bold mb-4 text-[#333333]">
        {articleTitle}
      </Typography>

      <Box className="flex items-center justify-between flex-wrap gap-4 mb-6 mt-4">
        {/* LEFT: Author Info */}
        <Box className="flex items-center gap-4">
          <Avatar className="bg-gray-300 text-black capitalize">
            {articleAuthor.charAt(0)}
          </Avatar>

          <Box className="flex flex-col">
            <Typography className="font-semibold! underline capitalize!">
              {articleAuthor || "Admin"}
            </Typography>

            <Box className="flex items-center gap-1 mt-2 text-sm text-gray-500">
              {publishedDate}
            </Box>
          </Box>
        </Box>

        <ArticleShareActions title={articleTitle} />
      </Box>

      {/* Featured Image */}
      <Card className="mb-6 rounded-xl overflow-hidden shadow-lg">
        <CardMedia
          component="img"
          image={articleImage}
          alt={articleTitle}
          className="h-150 w-full object-cover!"
        />
      </Card>

      {/* Description / Content */}
      <Typography className="text-[#111111] leading-relaxed whitespace-pre-line">
        {articleContent || "No content available for this article yet."}
      </Typography>
    </Box>
  );
};

export default Page;
