"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";

type ArticleReaderToolsProps = {
  article: {
    id: string | number;
    documentId?: string;
    title: string;
    category: string;
    slug: string;
    image: string;
    date: string;
  };
  wordCount: number;
};

const BOOKMARKS_KEY = "dailytrendline-bookmarks";
const RECENTLY_VIEWED_KEY = "dailytrendline-recently-viewed";

const ArticleReaderTools = ({
  article,
  wordCount,
}: ArticleReaderToolsProps) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 220));

  const [bookmarked, setBookmarked] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      const savedBookmarks = JSON.parse(
        window.localStorage.getItem(BOOKMARKS_KEY) || "[]",
      );

      return savedBookmarks.some(
        (item: { id: string | number; documentId?: string }) =>
          String(item.id) === String(article.id) ||
          (article.documentId && item.documentId === article.documentId),
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(
        window.localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]",
      );

      const nextHistory = [
        {
          ...article,
          viewedAt: new Date().toISOString(),
        },
        ...savedHistory.filter(
          (item: { id: string | number; documentId?: string }) =>
            String(item.id) !== String(article.id) &&
            (!article.documentId || item.documentId !== article.documentId),
        ),
      ].slice(0, 8);

      window.localStorage.setItem(
        RECENTLY_VIEWED_KEY,
        JSON.stringify(nextHistory),
      );
    } catch {}
  }, [article]);

  const handleToggleBookmark = () => {
    try {
      const savedBookmarks = JSON.parse(
        window.localStorage.getItem(BOOKMARKS_KEY) || "[]",
      );

      if (bookmarked) {
        const nextBookmarks = savedBookmarks.filter(
          (item: { id: string | number; documentId?: string }) =>
            String(item.id) !== String(article.id) &&
            (!article.documentId || item.documentId !== article.documentId),
        );

        window.localStorage.setItem(
          BOOKMARKS_KEY,
          JSON.stringify(nextBookmarks),
        );
        setBookmarked(false);
        setFeedback("Removed from bookmarks");
        return;
      }

      const nextBookmarks = [
        {
          ...article,
          savedAt: new Date().toISOString(),
        },
        ...savedBookmarks,
      ].slice(0, 20);

      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(nextBookmarks));
      setBookmarked(true);
      setFeedback("Saved to bookmarks");
    } catch {
      setFeedback("Could not update bookmarks");
    }
  };

  return (
    <>
      <Box className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/90">
        <Box className="flex flex-wrap items-center gap-2">
          <Chip
            icon={<AutoStoriesRoundedIcon />}
            label={`${estimatedReadTime} min read`}
            className="dark:!bg-slate-800 dark:!text-slate-100"
          />
          <Chip
            icon={<MenuBookRoundedIcon />}
            label={`${wordCount} words`}
            className="dark:!bg-slate-800 dark:!text-slate-100"
          />
        </Box>

        {/* <Tooltip title={bookmarked ? "Remove bookmark" : "Save article"}>
          <IconButton
            aria-label="toggle bookmark"
            onClick={handleToggleBookmark}
            className="text-slate-900! dark:text-slate-100!"
          >
            {bookmarked ? (
              <BookmarkRoundedIcon className="text-amber-500!" />
            ) : (
              <BookmarkBorderRoundedIcon />
            )}
          </IconButton>
        </Tooltip> */}
      </Box>

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={2200}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setFeedback(null)}
          severity={feedback?.includes("Could not") ? "error" : "success"}
          variant="filled"
        >
          <Typography>{feedback}</Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default ArticleReaderTools;
