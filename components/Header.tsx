"use client";

import React, { useState } from "react";
import {
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import SearchBar from "./SearchBar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getStrapiMedia } from "./StrapiImage";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  data: any;
};

const Header = ({ data }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  const navLink = data?.navLink ?? [];
  const logo = data?.logo;
  const wordmark = data?.logoText?.text || "Daily Trendline";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white dark:bg-slate-950">
      {/* Utility bar */}
      <Box className="border-b hairline">
        <Box className="mx-auto max-w-[1310px] px-4 py-2 flex items-center justify-between gap-4">
          <Typography className="text-xs! uppercase tracking-[0.15em] text-slate-600 dark:text-slate-400">
            {today}
          </Typography>

          <Box className="flex items-center gap-1">
            {!showSearch ? (
              <IconButton
                size="small"
                onClick={() => setShowSearch(true)}
                aria-label="Open search"
                className="text-slate-900! dark:text-slate-100!"
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            ) : (
              <Box className="flex items-center gap-1">
                <SearchBar
                  width="w-56"
                  clearOnSearch
                  onSearch={() => setShowSearch(false)}
                />
                <IconButton
                  size="small"
                  onClick={() => setShowSearch(false)}
                  aria-label="Close search"
                  className="text-slate-900! dark:text-slate-100!"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            <ThemeToggle />
          </Box>
        </Box>
      </Box>

      {/* Masthead */}
      <Box className="mx-auto max-w-[1310px] px-4 py-6 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-4 no-underline">
          {logo?.url && (
            <Image
              src={getStrapiMedia(logo.url) || "/fallback.jpg"}
              alt={`${wordmark} logo`}
              width={64}
              height={64}
              unoptimized
            />
          )}
          <span className="font-serif font-black text-4xl md:text-5xl tracking-tight text-slate-900 dark:text-slate-100">
            {wordmark}
            <span className="text-brand">.</span>
          </span>
        </Link>
      </Box>

      {/* Nav bar */}
      <Box className="sticky top-0 z-50 border-y-2 border-slate-900 bg-white dark:border-slate-100 dark:bg-slate-950">
        <Box className="mx-auto max-w-[1310px] px-4 flex items-center justify-between">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-stretch">
            <Link
              href="/"
              className={`px-4 py-3 text-sm font-bold uppercase tracking-widest no-underline transition-colors ${
                pathname === "/"
                  ? "bg-brand text-slate-900"
                  : "text-slate-900 hover:bg-brand hover:text-slate-900 dark:text-slate-100"
              }`}
            >
              Home
            </Link>

            {navLink.map((link: any) => {
              const isActive =
                pathname === link.url || pathname.startsWith(link.url + "/");

              return (
                <Link
                  key={link.text}
                  href={link.url}
                  className={`px-4 py-3 text-sm font-bold uppercase tracking-widest no-underline transition-colors ${
                    isActive
                      ? "bg-brand text-slate-900"
                      : "text-slate-900 hover:bg-brand hover:text-slate-900 dark:text-slate-100"
                  }`}
                >
                  {link.text}
                </Link>
              );
            })}
          </nav>

          <Typography className="hidden md:block text-xs! uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Your daily briefing
          </Typography>

          {/* Mobile hamburger */}
          <Box className="md:hidden flex w-full items-center justify-between py-1">
            <Typography className="text-sm! font-bold uppercase tracking-widest">
              Menu
            </Typography>
            <IconButton
              className="text-slate-900! dark:text-slate-100!"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer anchor="top" open={open} onClose={() => setOpen(false)}>
        <Box className="bg-slate-950 text-white p-4">
          <Box className="flex justify-between items-center mb-4">
            <span className="font-serif font-black text-2xl">
              {wordmark}
              <span className="text-brand">.</span>
            </span>
            <IconButton onClick={() => setOpen(false)} aria-label="Close menu">
              <CloseIcon className="text-white!" />
            </IconButton>
          </Box>

          <List>
            <ListItem
              component={Link}
              href="/"
              onClick={() => setOpen(false)}
              className="border-b border-slate-800"
            >
              <ListItemText
                primary="Home"
                slotProps={{
                  primary: {
                    className:
                      "uppercase tracking-widest font-bold text-white",
                  },
                }}
              />
            </ListItem>

            {navLink.map((link: any) => (
              <ListItem
                key={link.text}
                component={Link}
                href={link.url}
                onClick={() => setOpen(false)}
                className="border-b border-slate-800"
              >
                <ListItemText
                  primary={link.text}
                  slotProps={{
                    primary: {
                      className:
                        "uppercase tracking-widest font-bold text-white",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </header>
  );
};

export default Header;
