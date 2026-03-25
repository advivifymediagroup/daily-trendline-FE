"use client";

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const footerLinks = [
  {
    title: "News",
    links: [
      { label: "Business", href: "/business" },
      { label: "Technology", href: "/technology" },
      { label: "Sports", href: "/sports" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Advertise", href: "/advertise" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Editorial Policy", href: "/editorial-policy" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "RSS Feed", href: "/rss" },
    ],
  },
];

const socialLinks = [
  { icon: <FacebookIcon />, href: "https://facebook.com" },
  { icon: <XIcon />, href: "https://x.com" },
  { icon: <LinkedInIcon />, href: "https://linkedin.com" },
  { icon: <InstagramIcon />, href: "https://instagram.com" },
];

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#faf902] text-black">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
        {/* Logo + Description */}
        <Box className="space-y-4">
          <Typography variant="h6" className="text-black font-bold text-xl">
            Daily Trendline
          </Typography>

          <Typography variant="body2" className="text-gray-800">
            Daily Trendline brings you the latest news, breaking stories, and
            trending updates from around the world in very few words - covering
            politics, technology, business, entertainment and more.
          </Typography>

          <Box className="flex space-x-3 mt-2">
            {socialLinks.map((social, idx) => (
              <IconButton
                key={idx}
                component="a"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black! hover:text-gray-700! transition-colors!"
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Footer Links */}
        {footerLinks.map((section) => (
          <Box key={section.title}>
            <Typography className="font-semibold text-black mb-4">
              {section.title}
            </Typography>

            <Box className="flex flex-col space-y-2">
              {section.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-800 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Copyright */}
      <Box className="border-t border-black/30 py-4 text-center text-gray-800 text-sm">
        © {new Date().getFullYear()} Daily Trendline. All rights reserved.
      </Box>
    </footer>
  );
};

export default Footer;
