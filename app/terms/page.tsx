import type { Metadata } from "next";
import StaticPageShell from "@/components/StaticPageShell";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of Daily Trendline.",
};

export default function TermsPage() {
  return (
    <StaticPageShell
      kicker="Legal"
      title="Terms of Use"
      intro="The short version: read freely, share fairly, don't misuse the site."
    >
      <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">
        Last updated: July 2026
      </p>

      <h2>Using the site</h2>
      <p>
        Daily Trendline is free to read. You may link to any story, quote brief
        excerpts with attribution, and share our headlines on social platforms.
        You may not republish full articles, scrape the site at scale, or
        present our work as your own.
      </p>

      <h2>Our content</h2>
      <p>
        Original stories, headlines and design on this site are the property of
        Daily Trendline. External headlines in the live sections belong to
        their respective publishers and link to the original source; we display
        only titles, summaries and images as provided by the publisher&apos;s
        feed.
      </p>

      <h2>Accuracy</h2>
      <p>
        We work hard to get things right, but news moves quickly and stories
        may be updated or corrected after publication. Content is provided
        &quot;as is&quot; without warranties; nothing on this site constitutes
        financial, legal or professional advice.
      </p>

      <h2>The newsletter</h2>
      <p>
        By subscribing to The Daily Brief you agree to receive one daily email.
        You can unsubscribe at any time using the link in every issue.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Material changes will be
        noted on this page with a new &quot;last updated&quot; date. Continued
        use of the site after changes means you accept the updated terms.
      </p>
    </StaticPageShell>
  );
}
