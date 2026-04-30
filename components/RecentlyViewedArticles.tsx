"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

type RecentlyViewedItem = {
  id: string | number;
  documentId?: string;
  title: string;
  category: string;
  slug: string;
  image: string;
  date: string;
};

const STORAGE_KEY = "dailytrendline-recently-viewed";

const RecentlyViewedArticles = () => {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      setItems(saved);
    } catch {
      setItems([]);
    }
  }, []);

  if (items.length < 2) {
    return null;
  }

  return (
    <Box className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <Typography variant="h6" className="font-bold!">
        Recently Viewed
      </Typography>
      <Typography className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Jump back into stories you opened earlier.
      </Typography>

      <Box className="mt-4 flex flex-col gap-4">
        {items.slice(1, 5).map((item) => {
          const query = new URLSearchParams();

          if (item.documentId) {
            query.set("documentId", item.documentId);
          }

          query.set("id", String(item.id));

          return (
            <Link
              key={`${item.id}-${item.slug}`}
              href={`/${item.category.toLowerCase()}/${item.slug}?${query.toString()}`}
              className="no-underline"
            >
              <Box className="flex gap-3 rounded-2xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                <Image
                  src={item.image || "/fallback.jpg"}
                  alt={item.title}
                  width={88}
                  height={72}
                  className="h-[72px] w-[88px] rounded-xl object-cover"
                  unoptimized
                />

                <Box className="min-w-0 flex-1">
                  <Typography className="line-clamp-2 font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </Typography>
                  <Typography className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    {item.category}
                  </Typography>
                  <Box className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                    {item.date}
                  </Box>
                </Box>
              </Box>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
};

export default RecentlyViewedArticles;
