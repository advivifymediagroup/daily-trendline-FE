"use client";

import React, { useState } from "react";
import { Alert, Box, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useRouter } from "next/navigation";
import type { SyntheticEvent } from "react";

interface SearchCardProps {
  featuredImage: any;
  headline: string;
  category: string;
  description?: string;
  date: string;
  chipColor?: string;
  slug?: string;
  documentId?: string;
  id?: string | number;
}

const SearchCard: React.FC<SearchCardProps> = ({
  featuredImage,
  headline,
  category,
  description,
  date,
  chipColor,
  slug,
  documentId,
  id,
}) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const open = Boolean(anchorEl);

  // slug for routing
  const fallbackSlug = headline
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");

  const queryParams = new URLSearchParams();

  if (documentId) {
    queryParams.set("documentId", documentId);
  }

  if (id !== undefined) {
    queryParams.set("id", String(id));
  }

  const articleSlug = slug || fallbackSlug;
  const queryString = queryParams.toString();
  const articlePath = `/${category.toLowerCase()}/${articleSlug}${queryString ? `?${queryString}` : ""}`;

  const handleNavigate = () => {
    if (open) {
      return;
    }

    router.push(articlePath);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const getArticleUrl = () => {
    if (typeof window === "undefined") {
      return articlePath;
    }

    return new URL(articlePath, window.location.origin).toString();
  };

  const openShareUrl = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleClose = (event?: SyntheticEvent | Event) => {
    if (event && "stopPropagation" in event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  const handleFacebookShare = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const url = encodeURIComponent(getArticleUrl());
    openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    handleClose();
  };

  const handleXShare = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const url = encodeURIComponent(getArticleUrl());
    const text = encodeURIComponent(headline);
    openShareUrl(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
    handleClose();
  };

  const handleEmailShare = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const subject = encodeURIComponent(headline);
    const body = encodeURIComponent(`Check out this article: ${getArticleUrl()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    handleClose();
  };

  const handleCopy = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(getArticleUrl());
      setFeedback("Link copied to clipboard");
    } catch {
      setFeedback("Could not copy the link");
    }

    handleClose();
  };

  return (
    <Box
      onClick={handleNavigate}
      className="flex gap-4 p-4 border hairline hover:border-slate-900 dark:hover:border-slate-400 transition-colors cursor-pointer bg-white dark:bg-slate-900 group"
    >
      {/* LEFT IMAGE */}
      <Box className="relative min-w-[180px] h-[150px] overflow-hidden border hairline">
        <Image
          src={featuredImage}
          alt={headline}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />

        <span className="absolute top-0 left-0 bg-brand px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-slate-900">
          {category}
        </span>
      </Box>

      {/* RIGHT CONTENT */}
      <Box className="flex flex-col flex-1 justify-between">
        {/* TEXT */}
        <Box>
          <Typography className="font-serif font-semibold! text-lg! leading-snug text-slate-900 line-clamp-2 group-hover:underline decoration-2 underline-offset-2 dark:text-slate-100">
            {headline}
          </Typography>

          <Typography className="text-xs! uppercase tracking-widest text-slate-500 my-2! dark:text-slate-400">
            {date}
          </Typography>

          <Typography className="text-sm text-slate-600 mt-1 line-clamp-2 dark:text-slate-400">
            {description}
          </Typography>
        </Box>

        {/* SHARE */}
        <Box className="flex justify-end mt-2 text-slate-700 dark:text-slate-300">
          <Box
            onClick={handleShareClick}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex items-center gap-2"
          >
            <ShareIcon fontSize="small" /> <Typography>Share</Typography>
          </Box>

          {/* SHARE MENU */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose()}
            onClick={(event) => event.stopPropagation()}
            slotProps={{
              paper: {
                onClick: (event: React.MouseEvent<HTMLElement>) => event.stopPropagation(),
                onMouseDown: (event: React.MouseEvent<HTMLElement>) => event.stopPropagation(),
                className: "dark:bg-slate-900 dark:text-slate-100 dark:border dark:border-slate-800",
              },
            }}
          >
            <MenuItem onClick={handleFacebookShare}>
              <FacebookIcon fontSize="small" className="mr-2 text-blue-600!" />
              Facebook
            </MenuItem>

            <MenuItem onClick={handleXShare}>
              <XIcon fontSize="small" className="mr-2 text-black" />X
            </MenuItem>

            <MenuItem onClick={handleEmailShare}>
              <EmailIcon fontSize="small" className="mr-2 text-red-500" />
              Email
            </MenuItem>

            <MenuItem onClick={handleCopy}>
              <ContentCopyIcon
                fontSize="small"
                className="mr-2 text-green-600"
              />
              Copy Link
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={2500}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setFeedback(null)}
          severity={feedback === "Link copied to clipboard" ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {feedback}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchCard;
