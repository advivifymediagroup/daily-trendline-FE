import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

const BreakingNewsTicker: React.FC<any> = ({ news }) => {
  if (!news?.length) return null;

  return (
    <Box className="w-full flex items-center bg-slate-950 text-white overflow-hidden border-2 border-slate-950 dark:border-slate-100">
      {/* Label */}
      <Box className="bg-brand px-4 py-2 shrink-0">
        <Typography
          variant="body2"
          className="font-bold! tracking-[0.2em] uppercase text-slate-900"
        >
          Breaking
        </Typography>
      </Box>

      {/* Scrolling text */}
      <Box className="relative overflow-hidden w-full">
        <Box className="ticker-track flex gap-10 px-4 py-2 whitespace-nowrap">
          {news.concat(news).map((item: any, index: number) => (
            <Link
              key={index}
              href={{
                pathname: `/${item?.category?.name?.toLowerCase()}/${item.slug}`,
                query: {
                  documentId: item.documentId,
                  id: String(item.id),
                },
              }}
              className="text-sm text-white no-underline hover:text-brand hover:underline decoration-brand"
            >
              <span className="text-brand mr-2">●</span>
              {item.title}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BreakingNewsTicker;
