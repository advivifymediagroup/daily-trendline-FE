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
  const { socialLink, logoText, footerText, footerSection } = data ?? {};

  const wordmark =
    typeof logoText === "string" ? logoText : logoText?.text || "Daily Trendline";

  const footerLinks = footerSection?.map((section: any) => ({
    title: section.title,
    links: (section.footerLink || []).map((link: any) => ({
      label: link.text,
      href: link.url,
    })),
  }));

  return (
    <footer className="w-full bg-slate-950 text-slate-100 border-t-4 border-brand">
      <Box className="max-w-[1310px] mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-5">
        {/* Wordmark + description + social */}
        <Box className="md:col-span-2 space-y-4">
          <span className="font-serif font-black text-3xl text-white">
            {wordmark}
            <span className="text-brand">.</span>
          </span>

          <Typography variant="body2" className="text-slate-400 max-w-sm">
            {typeof footerText === "string"
              ? footerText
              : footerText?.text ||
                "Sharp, concise reporting on business, technology, sports and entertainment — delivered daily."}
          </Typography>

          <Box className="flex gap-1">
            {socialLink?.map((social: any) => {
              const icon = iconMap[social.text] || null;
              if (!icon) return null;

              return (
                <IconButton
                  key={social.id ?? social.text}
                  component="a"
                  href={social.url}
                  target={social.isExternal ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  aria-label={social.text}
                  className="text-slate-100! hover:text-brand! hover:bg-transparent! transition-colors!"
                >
                  {icon}
                </IconButton>
              );
            })}
          </Box>
        </Box>

        {/* Link sections */}
        {footerLinks?.map((section: any) => (
          <Box key={section.title}>
            <Typography className="uppercase tracking-[0.2em] text-xs! font-bold! text-brand mb-4!">
              {section.title}
            </Typography>

            <Box className="flex flex-col space-y-2">
              {section.links.map((link: any) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-slate-300 hover:text-white no-underline hover:underline transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>
        ))}

        {/* Company links (always present, independent of CMS) */}
        <Box>
          <Typography className="uppercase tracking-[0.2em] text-xs! font-bold! text-brand mb-4!">
            Company
          </Typography>

          <Box className="flex flex-col space-y-2">
            {[
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Use", href: "/terms" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white no-underline hover:underline transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Copyright */}
      <Box className="border-t border-slate-800 py-4 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} {wordmark}. All rights reserved.
      </Box>
    </footer>
  );
};

export default Footer;
