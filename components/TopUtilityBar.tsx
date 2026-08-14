"use client";

import React from "react";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

/** Date + search strip above the feed, on xl where the rail is visible. */
const TopUtilityBar = () => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-6 hidden items-center justify-between gap-4 border-b hairline py-4 xl:flex">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
        {today}
      </p>

      <div className="flex items-center gap-2">
        <SearchBar width="w-64" />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default TopUtilityBar;
