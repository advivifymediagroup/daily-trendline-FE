"use client";

import React, { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import SidebarNav from "./SidebarNav";
import ThemeToggle from "./ThemeToggle";

/**
 * Compact bar shown below the xl breakpoint, where the left rail is hidden.
 * Opens the same navigation in a drawer.
 */
const MobileTopBar = ({ data }: { data: any }) => {
  const [open, setOpen] = useState(false);
  const wordmark = data?.logoText?.text || "Daily Trendline";

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between border-b-2 border-slate-900 bg-white px-4 py-3 xl:hidden dark:border-slate-100 dark:bg-slate-950">
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="text-slate-900! dark:text-slate-100!"
        >
          <MenuIcon />
        </IconButton>

        <Link href="/" className="no-underline">
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {wordmark}
            <span className="text-brand-dark dark:text-brand">.</span>
          </span>
        </Link>

        <div className="flex items-center">
          <IconButton
            component={Link}
            href="/search"
            aria-label="Search"
            className="text-slate-900! dark:text-slate-100!"
          >
            <SearchIcon />
          </IconButton>
          <ThemeToggle />
        </div>
      </div>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <div className="w-[280px] bg-white px-4 dark:bg-slate-950">
          <div className="flex justify-end pt-3">
            <IconButton onClick={() => setOpen(false)} aria-label="Close menu">
              <CloseIcon className="text-slate-900! dark:text-slate-100!" />
            </IconButton>
          </div>
          <SidebarNav
            data={data}
            variant="drawer"
            onNavigate={() => setOpen(false)}
          />
        </div>
      </Drawer>
    </>
  );
};

export default MobileTopBar;
