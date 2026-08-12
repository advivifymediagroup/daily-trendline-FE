import React from "react";
import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Reveal from "@/components/Reveal";
import {
  getGuardianArticle,
  isValidGuardianId,
  formatRelativeTime,
  readingTime,
} from "@/utils/guardian";

type Props = {
  searchParams: Promise<{
    g?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { g } = await searchParams;
  if (!g || !isValidGuardianId(g)) return { title: "Story not found" };

  const article = await getGuardianArticle(g);
  if (!article) return { title: "Story not found" };

  return {
    title: article.title,
    description: article.standfirst || undefined,
  };
}

const Page = async ({ searchParams }: Props) => {
  const { g } = await searchParams;

  if (!g || !isValidGuardianId(g)) {
    notFound();
  }

  const article = await getGuardianArticle(g);

  if (!article) {
    notFound();
  }

  const published = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Box className="py-10 text-slate-900 dark:text-slate-100">
      <Box className="mx-auto max-w-3xl">
        {/* Kicker */}
        <Box className="flex items-center gap-3 flex-wrap">
          <span className="inline-block bg-brand px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-900">
            {article.sectionName}
          </span>
          <Typography className="text-xs! uppercase tracking-widest text-slate-500 dark:text-slate-400">
            The Guardian
          </Typography>
        </Box>

        {/* Headline */}
        <Typography
          component="h1"
          className="font-serif font-black text-4xl! md:text-5xl! leading-tight! mt-4!"
        >
          {article.title}
        </Typography>

        {/* Standfirst */}
        {article.standfirst && (
          <Typography className="font-serif text-xl! text-slate-600 dark:text-slate-400 mt-4! leading-relaxed!">
            {article.standfirst}
          </Typography>
        )}

        {/* Byline */}
        <Box className="flex items-center justify-between flex-wrap gap-4 border-y-2 border-slate-900 dark:border-slate-100 py-4 mt-6 mb-8">
          <Box className="flex flex-col">
            <Typography className="font-bold! text-sm!">
              {article.byline || "The Guardian"}
            </Typography>
            <Typography className="text-xs! uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {published} — {formatRelativeTime(article.publishedAt)}
            </Typography>
          </Box>

          <Box className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <MenuBookIcon sx={{ fontSize: 16 }} />
            <Typography className="text-xs! uppercase tracking-widest">
              {readingTime(article)} min read
            </Typography>
          </Box>
        </Box>

        {/* Lead image */}
        {article.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.thumbnail}
            alt=""
            className="w-full max-h-[520px] object-cover border hairline mb-8"
          />
        )}

        {/* Full body — parsed to text blocks server-side, escaped by React */}
        <Box className="article-body text-slate-900 dark:text-slate-200 flex flex-col gap-5">
          {article.blocks.map((block, index) => {
            if (block.type === "h2") {
              return (
                <Typography
                  key={index}
                  component="h2"
                  className="font-serif font-bold! text-2xl! mt-4!"
                >
                  {block.text}
                </Typography>
              );
            }

            if (block.type === "quote") {
              return (
                <Box
                  key={index}
                  component="blockquote"
                  className="border-l-4 border-brand pl-5 my-2 font-serif italic text-slate-700 dark:text-slate-300"
                >
                  {block.text}
                </Box>
              );
            }

            return <p key={index}>{block.text}</p>;
          })}
        </Box>

        {/* Attribution — required by the Guardian Open Platform licence */}
        <Reveal>
          <Box className="mt-10 border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Box>
              <Typography className="font-serif font-bold! text-lg!">
                Reporting by {article.byline || "The Guardian"}
              </Typography>
              <Typography className="text-sm! text-slate-600 dark:text-slate-400 mt-1!">
                Published by The Guardian and shown here via the Guardian Open
                Platform.
              </Typography>
            </Box>

            <a
              href={article.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 border-2 border-slate-900 bg-slate-900 px-6 py-3 font-bold uppercase tracking-widest text-white no-underline transition-colors hover:bg-brand hover:text-slate-900 dark:border-slate-100"
            >
              View original <OpenInNewIcon fontSize="small" />
            </a>
          </Box>
        </Reveal>

        {/* Back nav */}
        <Box className="mt-12 border-t-4 border-slate-900 dark:border-slate-100 pt-4">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest font-bold text-slate-600 no-underline hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
          >
            ← Back to Daily Trendline
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
