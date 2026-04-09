import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

const BreakingNewsTicker: React.FC<any> = ({ news }) => {
  console.log("NEWS::", news);

  return (
    <Box className="w-full flex items-center bg-white text-black rounded-md overflow-hidden border-1">
      {/* Label */}
      <Box className="bg-red px-4 py-2 shrink-0 bg-red-600 text-white">
        <Typography
          variant="body2"
          className="font-semibold tracking-wide uppercase"
        >
          BREAKING NEWS
        </Typography>
      </Box>

      {/* Scrolling Text */}
      <Box className="relative overflow-hidden w-full">
        <Box className="ticker-track flex gap-8 px-4 py-2 whitespace-nowrap">
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
              className="hover:underline text-sm"
            >
              {item.title}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BreakingNewsTicker;
