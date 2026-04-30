import React from "react";
import type { Metadata } from "next";
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleById, getNewsByCategory } from "@/app/api/news";
import ArticleShareActions from "@/components/ArticleShareActions";
import ArticleReaderTools from "@/components/ArticleReaderTools";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import RecentlyViewedArticles from "@/components/RecentlyViewedArticles";
import { getStrapiMediaURL } from "@/utils/strapiUtils";
import SearchCard from "@/components/SearchCard";

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
  const { category, news } = await params;
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
  const articleCategorySlug = article.category?.slug || category;
  const articleTags = article.tags || [];
  const wordCount = articleContent.trim()
    ? articleContent.trim().split(/\s+/).length
    : 0;

  const relatedArticlesResponse = await getNewsByCategory(
    articleCategorySlug,
    6,
  );
  const relatedArticles = relatedArticlesResponse.data
    .filter((item: any) => String(item.id) !== String(article.id))
    .slice(0, 3)
    .map((item: any) => ({
      headline: item.title,
      description: item.description || item.excerpt,
      featuredImage:
        getStrapiMediaURL(item.featuredImage?.url) || "/fallback.jpg",
      date: item.publishedAt
        ? new Date(item.publishedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
      category: item.category?.name || articleCategory,
      slug: item.slug,
      documentId: item.documentId,
      id: item.id,
    }));

  return (
    <>
      <ReadingProgressBar />
      <Box className="mx-auto max-w-[1310px]! px-4 py-10 text-slate-900 dark:text-slate-100">
        <Box className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Box>
            {/* Breadcrumb */}
            <Box className="mb-4 text-sm text-gray-500 dark:text-slate-400">
              <Link
                href={`/${articleCategorySlug}`}
                className="hover:underline capitalize"
              >
                {articleCategory} News
              </Link>{" "}
              / <span className="capitalize">{articleTitle}</span>
            </Box>

            {/* Headline */}
            <Typography
              variant="h3"
              className="mb-4 text-[#333333] font-bold dark:text-slate-100"
            >
              {articleTitle}
            </Typography>

            <Box className="flex flex-wrap gap-2 pb-5">
              <Chip
                label={articleCategory}
                className="dark:!bg-slate-800 dark:!text-slate-100"
              />
              {articleTags.slice(0, 4).map((tag: any) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="no-underline"
                >
                  <Chip
                    label={`#${tag.name}`}
                    clickable
                    className="dark:!bg-slate-800 dark:!text-slate-100"
                  />
                </Link>
              ))}
            </Box>

            <Box className="mb-6 flex items-center justify-between gap-4 border-y border-black/10 py-5 dark:border-white/10">
              <Box className="flex items-center gap-4">
                <Avatar className="bg-gray-300 text-black capitalize">
                  {articleAuthor.charAt(0)}
                </Avatar>

                <Box className="flex flex-col">
                  <Typography className="font-semibold! underline capitalize!">
                    {articleAuthor || "Admin"}
                  </Typography>

                  <Box className="mt-2 flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                    {publishedDate}
                  </Box>
                </Box>
              </Box>

              <ArticleShareActions title={articleTitle} />
            </Box>

            <ArticleReaderTools
              article={{
                id: article.id,
                documentId: article.documentId,
                title: articleTitle,
                category: articleCategory,
                slug: article.slug || news,
                image: articleImage,
                date: publishedDate,
              }}
              wordCount={wordCount}
            />

            {/* Featured Image */}
            <Card className="my-6 overflow-hidden rounded-[28px] shadow-lg dark:bg-slate-900! dark:ring-1 dark:ring-slate-800!">
              <CardMedia
                component="img"
                image={articleImage}
                alt={articleTitle}
                className="h-150 w-full object-cover!"
              />
            </Card>

            {/* Description / Content */}
            <Typography className="text-lg leading-8 text-[#111111] whitespace-pre-line dark:text-slate-200">
              {articleContent || "No content available for this article yet."}
            </Typography>

            {relatedArticles.length > 0 && (
              <Box className="mt-12">
                <Divider className="mb-6!" />
                <Typography variant="h5" className="mb-5! font-bold!">
                  Continue Reading
                </Typography>
                <Box className="grid gap-5">
                  {relatedArticles.map((item: any) => (
                    <SearchCard key={item.id} {...item} />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Box className="space-y-6">
            <RecentlyViewedArticles />

            <Box className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <Typography variant="h6" className="font-bold!">
                Story Snapshot
              </Typography>
              <Box className="mt-4 grid grid-cols-2 gap-3">
                <Box className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-500/10">
                  <Typography className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Category
                  </Typography>
                  <Typography className="mt-2 font-semibold">
                    {articleCategory}
                  </Typography>
                </Box>
                <Box className="rounded-2xl bg-sky-50 p-4 dark:bg-sky-500/10">
                  <Typography className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Read Time
                  </Typography>
                  <Typography className="mt-2 font-semibold">
                    {Math.max(1, Math.ceil(wordCount / 220))} minutes
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Page;
