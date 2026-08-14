"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getStrapiMedia } from "./StrapiImage";
import { DEFAULT_NAV, withFallback } from "@/utils/siteNav";

type SidebarNavProps = {
  data: any;
  /** Rendered inside the mobile drawer — drops the sticky positioning. */
  variant?: "rail" | "drawer";
  onNavigate?: () => void;
};

const COMPANY_LINKS = [
  { text: "About Us", url: "/about" },
  { text: "Contact", url: "/contact" },
  { text: "Privacy Policy", url: "/privacy-policy" },
  { text: "Terms of Use", url: "/terms" },
];

/**
 * Persistent left navigation rail: wordmark, section list, and the company
 * link groups underneath — the primary way around the site.
 */
const SidebarNav = ({
  data,
  variant = "rail",
  onNavigate,
}: SidebarNavProps) => {
  const pathname = usePathname();

  const navLink = withFallback(data?.navLink, DEFAULT_NAV);
  const logo = data?.logo;
  const wordmark = data?.logoText?.text || "Daily Trendline";

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(url + "/");

  return (
    <div
      className={
        variant === "rail"
          ? "sticky top-0 h-screen overflow-y-auto py-6 pr-6 flex flex-col gap-8 border-r hairline"
          : "py-4 flex flex-col gap-8"
      }
    >
      {/* Wordmark */}
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2 no-underline px-1"
      >
        {logo?.url && (
          <Image
            src={getStrapiMedia(logo.url) || "/fallback.jpg"}
            alt=""
            width={32}
            height={32}
            unoptimized
          />
        )}
        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {wordmark}
          <span className="text-brand-dark dark:text-brand">.</span>
        </span>
      </Link>

      {/* Section heading */}
      <div className="px-1">
        <h2 className="text-2xl font-extrabold leading-tight text-slate-900 dark:text-slate-100">
          Today&apos;s briefing
        </h2>
        <Link
          href="/search"
          onClick={onNavigate}
          className="mt-1 inline-block text-sm text-slate-600 underline hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Search all stories
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col border-t hairline pt-4">
        <Link
          href="/"
          onClick={onNavigate}
          className={`px-3 py-2.5 text-[15px] no-underline transition-colors ${
            isActive("/")
              ? "bg-brand font-bold text-slate-900"
              : "font-medium text-slate-700 hover:bg-stone-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          }`}
        >
          Top Stories
        </Link>

        {navLink.map((link: any) => (
          <Link
            key={link.text}
            href={link.url}
            onClick={onNavigate}
            className={`px-3 py-2.5 text-[15px] no-underline transition-colors ${
              isActive(link.url)
                ? "bg-brand font-bold text-slate-900"
                : "font-medium text-slate-700 hover:bg-stone-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            }`}
          >
            {link.text}
          </Link>
        ))}
      </nav>

      {/* Newsletter CTA */}
      <Link
        href="/#newsletter"
        onClick={onNavigate}
        className="mx-1 bg-slate-900 px-4 py-2.5 text-center text-sm font-bold uppercase tracking-widest text-white no-underline transition-colors hover:bg-brand hover:text-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-brand"
      >
        Get the brief
      </Link>

      {/* Company links */}
      <div className="px-1">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-500">
          About Daily Trendline
        </p>
        <div className="flex flex-col gap-2 border-t hairline pt-3">
          {COMPANY_LINKS.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              onClick={onNavigate}
              className="text-sm text-slate-600 no-underline hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
