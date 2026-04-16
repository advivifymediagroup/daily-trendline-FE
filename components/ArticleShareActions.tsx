"use client";
import React, { useState } from "react";
import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";

type ArticleShareActionsProps = {
  title: string;
};

const ArticleShareActions = ({ title }: ArticleShareActionsProps) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const getArticleUrl = () => window.location.href;

  const openShareUrl = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    const url = getArticleUrl();

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if ((error as DOMException).name === "AbortError") {
          return;
        }
      }
    }

    await handleCopyLink();
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(getArticleUrl());
    openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  };

  const handleXShare = () => {
    const url = encodeURIComponent(getArticleUrl());
    const text = encodeURIComponent(title);
    openShareUrl(`https://x.com/intent/tweet?url=${url}&text=${text}`);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(
      `Check out this article: ${getArticleUrl()}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = async () => {
    const url = getArticleUrl();

    try {
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied to clipboard");
    } catch {
      setFeedback("Could not copy the link");
    }
  };

  return (
    <>
      <Box className="flex items-center gap-2">
        {/* <Box className="flex justify-center items-center">
          <ShareIcon className="text-black m-2" />
          <Typography>Share</Typography>
        </Box> */}

        <Tooltip title="Share this article">
          <IconButton
            aria-label="share article"
            onClick={handleNativeShare}
            className="text-black! hover:text-gray-700!"
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share on Facebook">
          <IconButton
            aria-label="share on facebook"
            onClick={handleFacebookShare}
            className="text-black! hover:text-blue-600!"
          >
            <FacebookIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share on X">
          <IconButton
            aria-label="share on x"
            onClick={handleXShare}
            className="text-black! hover:text-black!"
          >
            <XIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Send via Email">
          <IconButton
            aria-label="share by email"
            onClick={handleEmailShare}
            className="text-black! hover:text-red-500!"
          >
            <EmailIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Copy Link">
          <IconButton
            aria-label="copy article link"
            onClick={handleCopyLink}
            className="text-black! hover:text-green-600!"
          >
            <LinkIcon className="text-black!" />
          </IconButton>
        </Tooltip>
      </Box>

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={2500}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setFeedback(null)}
          severity={
            feedback === "Link copied to clipboard" ? "success" : "error"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {feedback}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ArticleShareActions;
