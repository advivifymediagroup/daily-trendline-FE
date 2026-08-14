"use client";

import React, { useState } from "react";
import Link from "next/link";
import BoltIcon from "@mui/icons-material/Bolt";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { DEFAULT_NAV } from "@/utils/siteNav";

/** Compact newsletter form for the rail. */
const RailNewsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="flex items-start gap-2">
        <MarkEmailReadOutlinedIcon fontSize="small" className="text-slate-900" />
        <p className="text-sm font-semibold text-slate-900">
          You&apos;re on the list. See you tomorrow morning.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="you@example.com"
        aria-label="Email address"
        className="w-full border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-slate-900"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="border-2 border-slate-900 bg-slate-900 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-60"
      >
        {status === "loading" ? "Signing up…" : "Sign up"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-800">Enter a valid email address.</p>
      )}
    </form>
  );
};

/**
 * Right-hand widget rail: newsletter, section shortcuts and an explainer.
 * Hidden below xl so the feed keeps full width on smaller screens.
 */
const RightRail = () => {
  return (
    <aside className="sticky top-6 flex flex-col gap-6 py-6">
      {/* Newsletter */}
      <section id="newsletter" className="border-2 border-slate-900 bg-brand p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900">
          The Daily Brief
        </p>
        <h2 className="mt-1 mb-1 text-xl font-extrabold leading-tight text-slate-900">
          The day&apos;s biggest stories, in your inbox.
        </h2>
        <p className="mb-3 text-sm text-slate-800">
          One concise email each morning. No spam — unsubscribe anytime.
        </p>
        <RailNewsletter />
      </section>

      {/* Sections */}
      <section className="border hairline bg-white p-5 dark:bg-slate-900">
        <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">
          Browse sections
        </h2>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Business, technology, sport and culture — updated through the day.
        </p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_NAV.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className="border hairline bg-stone-50 px-3 py-1.5 text-sm font-medium text-slate-700 no-underline transition-colors hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-100 dark:hover:text-slate-900"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="border hairline bg-white p-5 dark:bg-slate-900">
        <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100">
          Why Daily Trendline
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <BoltIcon fontSize="small" className="mt-0.5 text-brand-dark" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Live and continuous
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Headlines refresh through the day, not once a cycle.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <VerifiedOutlinedIcon
              fontSize="small"
              className="mt-0.5 text-brand-dark"
            />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Trusted sources
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Full stories from The Guardian, credited and linked back.
              </p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default RightRail;
