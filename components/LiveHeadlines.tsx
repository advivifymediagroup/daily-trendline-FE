import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import BoltIcon from "@mui/icons-material/Bolt";
import {
  getLiveHeadlines,
  formatRelativeTime,
  type GNewsCategory,
} from "@/utils/gnews";

type LiveHeadlinesProps = {
  category?: GNewsCategory;
  title?: string;
  max?: number;
  /** "grid" for wide sections, "list" for sidebars */
  layout?: "grid" | "list";
};

/**
 * Server component. Renders live external headlines from GNews.
 * Renders nothing when the feed is unavailable (no key / error / empty),
 * so it can be dropped into any page safely.
 */
const LiveHeadlines = async ({
  category = "general",
  title = "Live from around the web",
  max = 6,
  layout = "grid",
}: LiveHeadlinesProps) => {
  // Always fetch 10 so this shares one cache entry with the /read lookup,
  // then trim to the requested display count.
  const articles = (await getLiveHeadlines(category, 10)).slice(0, max);

  if (!articles.length) return null;

  return (
    <section>
      {/* Section header */}
      <Box className="section-rule pt-3 mb-5 flex items-center justify-between">
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
          Updated hourly — via GNews
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
            key={article.url}
            href={`/read?category=${category}&url=${encodeURIComponent(article.url)}`}
            className={
              layout === "grid"
                ? "group bg-white p-4 no-underline flex flex-col gap-2 hover:bg-stone-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors relative z-0 hover:z-10 card-lift"
                : "group border-b hairline pb-3 last:border-b-0 no-underline flex flex-col gap-1"
            }
          >
            {layout === "grid" && article.image && (
              <span className="block h-40 w-full overflow-hidden border hairline">
                {/* External images from arbitrary hosts — plain <img> keeps
                    next/image domain config out of the equation. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
            )}

            <Typography className="font-serif font-semibold! leading-snug text-slate-900 group-hover:underline decoration-2 underline-offset-2 dark:text-slate-100 line-clamp-3">
              {article.title}
            </Typography>

            {layout === "grid" && article.description && (
              <Typography className="text-sm! text-slate-600 dark:text-slate-400 line-clamp-2">
                {article.description}
              </Typography>
            )}

            <Box className="flex items-center gap-1 mt-auto pt-1">
              <Typography className="text-xs! uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">
                {article.source?.name}
              </Typography>
              <Typography className="text-xs! text-slate-400 dark:text-slate-500">
                — {formatRelativeTime(article.publishedAt)}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
    </section>
  );
};

export default LiveHeadlines;
