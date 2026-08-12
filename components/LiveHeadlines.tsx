import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import BoltIcon from "@mui/icons-material/Bolt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  getGuardianHeadlines,
  formatRelativeTime,
  readingTime,
  type GuardianSection,
} from "@/utils/guardian";

type LiveHeadlinesProps = {
  section?: GuardianSection;
  title?: string;
  max?: number;
  /** "grid" for wide sections, "list" for sidebars */
  layout?: "grid" | "list";
};

/**
 * Server component. Live Guardian headlines — each opens a full-text reader
 * on our own site at /read, since Guardian content is licensed for reuse.
 * Renders nothing when the feed is unavailable (no key / error / empty).
 */
const LiveHeadlines = async ({
  section = "news",
  title = "Live from around the web",
  max = 6,
  layout = "grid",
}: LiveHeadlinesProps) => {
  const articles = await getGuardianHeadlines(section, max);

  if (!articles.length) return null;

  return (
    <section>
      {/* Section header */}
      <Box className="section-rule pt-3 mb-5 flex items-center justify-between gap-4 flex-wrap">
        <Box className="flex items-center gap-2">
          <BoltIcon className="text-brand-dark" fontSize="small" />
          <Typography component="h2" className="section-label">
            {title}
          </Typography>
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 bg-red-600"></span>
          </span>
        </Box>
        <Typography className="text-xs! uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Full stories — courtesy of The Guardian
        </Typography>
      </Box>

      <Box
        className={
          layout === "grid"
            ? "grid gap-px bg-slate-300 dark:bg-slate-800 border hairline sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-3"
        }
      >
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/read?g=${encodeURIComponent(article.id)}`}
            className={
              layout === "grid"
                ? "group bg-white p-4 no-underline flex flex-col gap-2 hover:bg-stone-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
                : "group border-b hairline pb-3 last:border-b-0 no-underline flex flex-col gap-1"
            }
          >
            {layout === "grid" && article.thumbnail && (
              // Guardian CDN host — plain <img> avoids next/image domain config.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.thumbnail}
                alt=""
                loading="lazy"
                className="h-40 w-full object-cover border hairline"
              />
            )}

            <Typography className="font-serif font-semibold! leading-snug text-slate-900 group-hover:underline decoration-2 underline-offset-2 dark:text-slate-100 line-clamp-3">
              {article.title}
            </Typography>

            {layout === "grid" && article.standfirst && (
              <Typography className="text-sm! text-slate-600 dark:text-slate-400 line-clamp-2">
                {article.standfirst}
              </Typography>
            )}

            <Box className="flex items-center gap-2 mt-auto pt-1 flex-wrap">
              <Typography className="text-xs! uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">
                The Guardian
              </Typography>
              <Typography className="text-xs! text-slate-400 dark:text-slate-500">
                — {formatRelativeTime(article.publishedAt)}
              </Typography>
              <Box className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                <MenuBookIcon sx={{ fontSize: 12 }} />
                <Typography className="text-xs!">
                  {readingTime(article)} min read
                </Typography>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    </section>
  );
};

export default LiveHeadlines;
