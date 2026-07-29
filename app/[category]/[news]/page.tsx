import React from "react";
import type { Metadata } from "next";
import { Avatar, Box, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getArticleById,
  getArticleBySlug,
  getNewsByCategory,
} from "@/app/api/news";
import ArticleShareActions from "@/components/ArticleShareActions";
import CategoryNewsCard from "@/components/CategoryNewsCard";
import Reveal from "@/components/Reveal";
import { mapStrapiToNewsCard } from "@/utils/newsCard";
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

/**
 * Articles resolve primarily by URL slug so shared/bookmarked links work.
 * The legacy ?documentId=&id= query params are kept as a fallback for old
 * links whose slug may have changed.
 */
async function resolveArticle(
  slug: string,
  documentId?: string,
  id?: string,
) {
  const bySlug = await getArticleBySlug(slug);
  if (bySlug) return bySlug;

  if (documentId || id) {
    return getArticleById(documentId ?? "", id ?? "");
  }

  return null;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { news } = await params;
  const { documentId, id } = await searchParams;

  const article = await resolveArticle(news, documentId, id);

  if (!article) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: article.title || "Article",
    description: article.excerpt || article.description || undefined,
  };
}

const Page = async ({ params, searchParams }: Props) => {
  const { category, news } = await params;
  const { documentId, id } = await searchParams;

  const article = await resolveArticle(news, documentId, id);

  if (!article) {
    notFound();
  }

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  const articleImage =
    getStrapiMediaURL(article.featuredImage?.url) || "/fallback.jpg";
  const articleTitle = article.title || "Untitled article";
  const articleAuthor = article.author?.name || "Admin";
  const authorAvatar = getStrapiMediaURL(article.author?.avatar?.url);
  const articleContent =
    article.content || article.description || article.excerpt || "";
  const articleCategory = article.category?.name || category;
  const articleExcerpt = article.excerpt || article.description || "";

  const categorySlug = article.category?.slug || category;
  const related = ((await getNewsByCategory(categorySlug, 5))?.data ?? [])
    .filter((item: any) => item.id !== article.id)
    .slice(0, 4);

  return (
    <Box className="py-10 text-slate-900 dark:text-slate-100">
      <Box className="mx-auto max-w-3xl">
        {/* Kicker */}
        <Link
          href={`/${articleCategory.toLowerCase()}`}
          className="inline-block bg-brand px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-900 no-underline hover:bg-slate-900 hover:text-white transition-colors"
        >
          {articleCategory}
        </Link>

        {/* Headline */}
        <Typography
          component="h1"
          className="font-serif font-black text-4xl! md:text-5xl! leading-tight! mt-4! text-slate-900 dark:text-slate-100"
        >
          {articleTitle}
        </Typography>

        {/* Standfirst */}
        {articleExcerpt && articleExcerpt !== articleContent && (
          <Typography className="font-serif text-xl! text-slate-600 dark:text-slate-400 mt-4! leading-relaxed!">
            {articleExcerpt}
          </Typography>
        )}

        {/* Byline */}
        <Box className="flex items-center justify-between flex-wrap gap-4 border-y-2 border-slate-900 dark:border-slate-100 py-4 mt-6 mb-8">
          <Box className="flex items-center gap-3">
            <Avatar
              src={authorAvatar || undefined}
              className="bg-slate-900! text-brand! font-bold capitalize"
            >
              {articleAuthor.charAt(0)}
            </Avatar>

            <Box className="flex flex-col">
              <Typography className="font-bold! capitalize text-sm!">
                {articleAuthor}
              </Typography>
              <Typography className="text-xs! uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {publishedDate}
              </Typography>
            </Box>
          </Box>

          <ArticleShareActions title={articleTitle} />
        </Box>

        {/* Featured image */}
        <Box className="relative w-full h-[420px] md:h-[520px] border hairline overflow-hidden mb-8">
          <Image
            src={articleImage}
            alt={articleTitle}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </Box>

        {/* Body */}
        <Typography
          component="div"
          className="article-body whitespace-pre-line text-slate-900 dark:text-slate-200"
        >
          {articleContent || "No content available for this article yet."}
        </Typography>

        {/* Related stories */}
        {related.length > 0 && (
          <Reveal>
            <Box className="mt-14">
              <Box className="section-rule pt-3 mb-5">
                <Typography component="h2" className="section-label">
                  More in {articleCategory}
                </Typography>
              </Box>

              <Box className="grid sm:grid-cols-2 gap-x-8">
                {related.map((item: any) => (
                  <CategoryNewsCard
                    key={item.id}
                    {...mapStrapiToNewsCard(item)}
                  />
                ))}
              </Box>
            </Box>
          </Reveal>
        )}

        {/* Footer nav */}
        <Box className="mt-12 border-t-4 border-slate-900 dark:border-slate-100 pt-4">
          <Link
            href={`/${articleCategory.toLowerCase()}`}
            className="text-xs uppercase tracking-widest font-bold text-slate-600 no-underline hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
          >
            ← More from {articleCategory}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
