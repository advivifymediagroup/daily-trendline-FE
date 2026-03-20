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

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Business", href: "/business" },
  { label: "Technology", href: "/technology" },
  { label: "Sports", href: "/sports" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  return (
    <Box>
      <AppBar
        position="sticky"
        className="bg-[#faf902]! text-black! shadow-sm!"
      >
        <Toolbar className="max-w-7xl mx-auto w-full flex justify-between">
          <Link href="/">
            {/* Logo */}
            <Image
              src="/daily-trendline-logo.jpg"
              alt="daily-trendline-logo"
              width={80}
              height={100}
            />
          </Link>

          {/* Desktop Navigation */}
          <Box className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1 rounded transition-colors ${
                    isActive
                      ? "border-2 border-black text-black"
                      : "text-black hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* SEARCH TOGGLE */}
            {!showSearch ? (
              <IconButton
                onClick={() => setShowSearch(true)}
                className="text-black!"
              >
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
                  className="text-black!"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Mobile Hamburger */}
          <Box className="md:hidden">
            <IconButton className="text-white!" onClick={() => setOpen(true)}>
              <MenuIcon className="text-white!" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="top" open={open} onClose={() => setOpen(false)}>
        <Box className="h-full bg-black text-white p-4">
          {/* Drawer Header */}
          <Box className="flex justify-between mb-6">
            <Typography>Menu</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon className="text-white!" />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.label}
                component={Link}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
