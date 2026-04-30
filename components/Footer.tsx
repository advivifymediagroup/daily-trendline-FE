"use client";
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const iconMap: Record<string, React.ReactNode> = {
  Facebook: <FacebookIcon />,
  X: <XIcon />,
  Twitter: <XIcon />,
  LinkedIn: <LinkedInIcon />,
  Instagram: <InstagramIcon />,
};

type FooterProps = {
  data: any;
};

const Footer = ({ data }: FooterProps) => {
  const { socialLink, logoText, footerText, footerSection } = data;

  const footerLinks = footerSection?.map((section: any) => ({
    title: section.title,
    links: section.footerLink.map((link: any) => ({
      label: link.text,
      href:
        section.title === "Company"
          ? `/pages/${link.url.replace(/^\/+/, "")}`
          : link.url,
    })),
  }));

  return (
    <footer className="w-full bg-[#faf902] text-black transition-colors dark:bg-slate-900 dark:text-slate-100">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-5 gap-8">
        {/* Logo + Description */}
        <Box className="space-y-4">
          <Typography
            variant="h6"
            className="text-black font-bold text-xl dark:text-slate-100"
          >
            {typeof logoText === "string"
              ? logoText
              : logoText?.text || "Daily Trendline"}
          </Typography>

          <Typography
            variant="body2"
            className="text-gray-800 dark:text-slate-300"
          >
            {typeof footerText === "string"
              ? footerText
              : footerText?.text || ""}
          </Typography>

          <Box className="flex space-x-3 mt-2">
            {socialLink?.map((social: any) => {
              const icon = iconMap[social.text] || null;

              if (!icon) return null;

              return (
                <IconButton
                  key={social.id}
                  component="a"
                  href={social.url}
                  target={social.isExternal ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="text-black! hover:text-gray-700! transition-colors! dark:text-slate-100! dark:hover:text-yellow-300!"
                >
                  {icon}
                </IconButton>
              );
            })}
          </Box>
        </Box>

        {/* Footer Links */}
        {footerLinks?.map((section: any) => (
          <Box key={section.title}>
            <Typography className="font-bold! text-black mb-4 dark:text-slate-100">
              {section.title}
            </Typography>

            <Box className="flex flex-col space-y-2">
              {section.links.map((link: any) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-800 hover:text-black transition-colors dark:text-slate-300 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Copyright */}
      <Box className="border-t border-black/30 py-4 text-center text-gray-800 text-sm dark:border-white/10 dark:text-slate-400">
        © {new Date().getFullYear()} Daily Trendline. All rights reserved.
      </Box>
    </footer>
  );
};

export default Footer;
