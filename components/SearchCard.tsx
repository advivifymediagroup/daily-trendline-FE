"use client";

import React, { useState } from "react";
import { Alert, Box, Chip, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useRouter } from "next/navigation";

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

  const handleClose = (event?: React.SyntheticEvent | Event) => {
    event?.stopPropagation?.();
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
      className="flex gap-4 p-4 rounded border border-gray-200 hover:shadow-md transition cursor-pointer bg-white"
    >
      {/* LEFT IMAGE */}
      <Box className="relative min-w-[180px] h-[150px]">
        <Image
          src={featuredImage}
          alt={headline}
          fill
          className="object-cover rounded-lg"
          unoptimized
        />

        {/* CATEGORY CHIP */}
        <Chip
          label={category}
          size="small"
          sx={{
            bgcolor: chipColor,
          }}
          className="absolute! top-2 left-2 text-white! text-xs"
        />
      </Box>

      {/* RIGHT CONTENT */}
      <Box className="flex flex-col flex-1 justify-between">
        {/* TEXT */}
        <Box>
          <Typography className="font-semibold text-gray-900 line-clamp-2 hover:underline">
            {headline}
          </Typography>

          <Typography className="font-semibold text-gray-900 line-clamp-2 hover:underline text-sm! my-2!">
            {date}
          </Typography>

          <Typography className="text-sm text-gray-600 mt-1 line-clamp-2">
            {description}
          </Typography>
        </Box>

        {/* SHARE */}
        <Box className="flex justify-end mt-2">
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
            onClose={handleClose}
            onClick={(event) => event.stopPropagation()}
            slotProps={{
              paper: {
                onClick: (event) => event.stopPropagation(),
                onMouseDown: (event) => event.stopPropagation(),
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
