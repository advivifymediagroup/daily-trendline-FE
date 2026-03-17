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
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Business", href: "/business" },
  { label: "Technology", href: "/technology" },
  { label: "Sports", href: "/sports" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleDrawer = (state: boolean) => {
    setOpen(state);
  };

  return (
    <Box>
      <AppBar
        position="sticky"
        className="bg-black! text-white! shadow-md border-b border-gray-800"
      >
        <Toolbar className="max-w-7xl mx-auto w-full flex justify-between">
          <Link href="/">
            {/* Logo */}
            <Typography className="font-bold text-xl">
              Daily Trendline
            </Typography>
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
                  className={`px-3 py-1 rounded transition-colors
      ${
        isActive
          ? "border-2 border-white text-white"
          : "text-gray-300 hover:text-white"
      }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Search Bar */}
            <SearchBar />
          </Box>

          {/* Mobile Hamburger */}

          <Box className="md:hidden flex items-center">
            <IconButton
              className="text-white!"
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="top" open={open} onClose={() => toggleDrawer(false)}>
        <Box className=" h-full bg-black text-white p-4">
          {/* Drawer Header */}
          <Box className="flex justify-between items-center mb-6">
            <Typography className="font-bold text-lg">Menu</Typography>

            <IconButton
              className="text-white!"
              onClick={() => toggleDrawer(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <List>
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <ListItem
                  key={link.label}
                  component={Link}
                  href={link.href}
                  onClick={() => toggleDrawer(false)}
                  className={`rounded ${
                    isActive
                      ? "border-2 border-white bg-gray-900"
                      : "hover:bg-gray-900"
                  }`}
                >
                  <ListItemText primary={link.label} />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
