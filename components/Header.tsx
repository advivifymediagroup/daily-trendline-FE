"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SearchBar from "./SearchBar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getStrapiMedia } from "./StrapiImage";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  data: any;
};

const Header = ({ data }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  const { navLink, logo } = data;

  return (
    <Box>
      <AppBar
        position="sticky"
        className="bg-[#faf902]! text-black! shadow-sm! dark:bg-slate-900! dark:text-slate-100!"
      >
        <Toolbar className="max-w-7xl mx-auto w-full flex justify-between">
          <Link href="/">
            {/* Logo */}
            <Image
              src={getStrapiMedia(logo?.url) || "/fallback.jpg"}
              alt="daily-trendline-logo"
              width={80}
              height={100}
              unoptimized
            />
          </Link>

          {/* Desktop Navigation */}
          <Box className="hidden md:flex items-center gap-4">
            {navLink.map((link: any) => {
              const isActive =
                pathname === link.url || pathname.startsWith(link.url + "/");

              return (
                <Link
                  key={link.text}
                  href={link.url}
                  className={`px-3 py-1 rounded transition-colors ${
                    isActive
                      ? "border-2 border-black text-black dark:border-slate-100 dark:text-slate-100"
                      : "text-black hover:text-black dark:text-slate-100 dark:hover:text-white"
                  }`}
                >
                  {link.text}
                </Link>
              );
            })}

            {/* SEARCH TOGGLE */}
            {!showSearch ? (
              <IconButton onClick={() => setShowSearch(true)} className="text-black! dark:text-slate-100!">
                <SearchIcon />
              </IconButton>
            ) : (
              <Box className="flex items-center gap-2">
                <SearchBar
                  width="w-48"
                  variant="light"
                  clearOnSearch
                  onSearch={() => setShowSearch(false)}
                />

                <IconButton
                  onClick={() => setShowSearch(false)}
                  className="text-black! dark:text-slate-100!"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}

            <ThemeToggle />
          </Box>

          {/* Mobile Hamburger */}
          <Box className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <IconButton className="text-black! dark:text-slate-100!" onClick={() => setOpen(true)}>
              <MenuIcon className="text-black! dark:text-slate-100!" />
            </IconButton>
          </Box>
        </Toolbar>
        {/* Date Header */}
        <Box className="bg-yellow-100! text-black dark:bg-slate-800! dark:text-slate-100!">
          <Box className="max-w-7xl mx-auto w-full px-8 py-2 flex gap-3 items-center">
            <CalendarMonthOutlined />

            <Typography variant="body2" className="font-medium">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="top" open={open} onClose={() => setOpen(false)}>
        <Box className="h-full bg-black text-white p-4 dark:bg-slate-950 dark:text-slate-100">
          {/* Drawer Header */}
          <Box className="flex justify-between mb-6">
            <Typography>Menu</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon className="text-white!" />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <List>
            {navLink.map((link: any) => (
              <ListItem
                key={link.text}
                component={Link}
                href={link.url}
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={link.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
