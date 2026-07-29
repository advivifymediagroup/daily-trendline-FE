"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

/**
 * Sitewide newsletter subscription band.
 * Posts to /api/subscribe — currently a stub endpoint; wire it to a real
 * mailing-list provider (or a Strapi subscriber collection) when available.
 */
const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
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

  return (
    <section className="bg-brand border-y-2 border-slate-900">
      <Box className="mx-auto max-w-[1310px] px-4 py-10 grid gap-6 md:grid-cols-2 md:items-center">
        <Box>
          <Typography className="section-label text-slate-900!">
            The Daily Brief
          </Typography>
          <Typography className="font-serif font-black text-3xl! md:text-4xl! text-slate-900 mt-2!">
            The day&apos;s biggest stories, in your inbox.
          </Typography>
          <Typography className="text-slate-800 mt-2!">
            One concise email every morning. No noise, no spam — unsubscribe
            anytime.
          </Typography>
        </Box>

        {status === "done" ? (
          <Box className="flex items-center gap-3 md:justify-end">
            <MarkEmailReadOutlinedIcon className="text-slate-900" />
            <Typography className="font-bold text-slate-900">
              You&apos;re on the list. See you tomorrow morning.
            </Typography>
          </Box>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 md:justify-end"
          >
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
              className="w-full sm:w-72 border-2 border-slate-900 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="border-2 border-slate-900 bg-slate-900 px-6 py-3 font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-60"
            >
              {status === "loading" ? "Signing up…" : "Sign up"}
            </button>
            {status === "error" && (
              <Typography className="text-sm! text-red-800 sm:self-center">
                Please enter a valid email and try again.
              </Typography>
            )}
          </form>
        )}
      </Box>
    </section>
  );
};

export default NewsletterSignup;
