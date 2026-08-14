import React from "react";
import Link from "next/link";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VerifiedIcon from "@mui/icons-material/Verified";

export type FeedItem = {
  href: string;
  /** Opens in a new tab when the destination is off-site. */
  external?: boolean;
  source: string;
  sourceNote?: string;
  verified?: boolean;
  headline: string;
  summary?: string;
  image?: string | null;
  timeAgo?: string;
  readingTime?: number;
  category?: string;
  /** Large lead image vs. a thumbnail beside the text. */
  layout?: "lead" | "compact";
};

/**
 * Feed row in the style of an aggregator timeline: source attribution,
 * headline, summary, then a metadata bar. Square-edged to match the site.
 */
const FeedCard = ({ item }: { item: FeedItem }) => {
  const isLead = item.layout !== "compact";

  const linkProps = item.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <article className="border-b hairline py-6 first:pt-0">
      {/* Source row */}
      <div className="mb-3 flex items-center gap-2">
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center bg-slate-900 text-[11px] font-bold text-brand dark:bg-brand dark:text-slate-900"
        >
          {item.source.slice(0, 2).toUpperCase()}
        </span>

        <div className="min-w-0 leading-tight">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
              {item.source}
            </span>
            {item.verified && (
              <VerifiedIcon
                sx={{ fontSize: 14 }}
                className="text-brand-dark"
                aria-label="Verified source"
              />
            )}
          </div>
          {item.sourceNote && (
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {item.sourceNote}
            </p>
          )}
        </div>
      </div>

      <Link
        href={item.href}
        {...linkProps}
        className="group block no-underline"
      >
        {isLead ? (
          <>
            {item.image && (
              // Sources span many CDNs; a plain img avoids per-host config.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="mb-3 h-[300px] w-full border hairline object-cover"
              />
            )}
            <h2 className="text-xl font-extrabold leading-snug text-slate-900 group-hover:underline decoration-2 underline-offset-2 dark:text-slate-100">
              {item.headline}
            </h2>
            {item.summary && (
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
                {item.summary}
              </p>
            )}
          </>
        ) : (
          <div className="flex gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold leading-snug text-slate-900 group-hover:underline decoration-2 underline-offset-2 dark:text-slate-100">
                {item.headline}
              </h2>
              {item.summary && (
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
                  {item.summary}
                </p>
              )}
            </div>

            {item.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="h-[110px] w-[170px] shrink-0 border hairline object-cover"
              />
            )}
          </div>
        )}
      </Link>

      {/* Meta bar */}
      <div className="mt-3 flex flex-wrap items-center gap-5 text-slate-500 dark:text-slate-400">
        {item.category && (
          <span className="bg-brand px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-slate-900">
            {item.category}
          </span>
        )}

        {item.timeAgo && <span className="text-sm">{item.timeAgo}</span>}

        {item.readingTime ? (
          <span className="flex items-center gap-1 text-sm">
            <MenuBookIcon sx={{ fontSize: 15 }} />
            {item.readingTime} min read
          </span>
        ) : null}

        <span className="flex items-center gap-1 text-sm">
          <ThumbUpOutlinedIcon sx={{ fontSize: 15 }} />
        </span>

        <span className="flex items-center gap-1 text-sm">
          <ChatBubbleOutlineIcon sx={{ fontSize: 15 }} />
        </span>
      </div>
    </article>
  );
};

export default FeedCard;
