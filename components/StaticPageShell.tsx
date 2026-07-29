import React from "react";
import { Box, Typography } from "@mui/material";

type StaticPageShellProps = {
  kicker: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
};

/** Shared editorial layout for static pages (About, Contact, Privacy, Terms). */
const StaticPageShell = ({
  kicker,
  title,
  intro,
  children,
}: StaticPageShellProps) => {
  return (
    <Box className="py-10 text-slate-900 dark:text-slate-100">
      <Box className="mx-auto max-w-3xl">
        <Box className="border-b-4 border-slate-900 dark:border-slate-100 pb-6 mb-8">
          <Typography className="section-label text-brand-dark!">
            {kicker}
          </Typography>
          <Typography
            component="h1"
            className="font-serif font-black text-5xl! mt-1!"
          >
            {title}
          </Typography>
          {intro && (
            <Typography className="font-serif text-xl! text-slate-600 dark:text-slate-400 mt-4! leading-relaxed!">
              {intro}
            </Typography>
          )}
        </Box>

        <Box className="flex flex-col gap-6 leading-relaxed [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-4 [&_p]:text-slate-700 dark:[&_p]:text-slate-300">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default StaticPageShell;
