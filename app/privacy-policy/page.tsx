import type { Metadata } from "next";
import StaticPageShell from "@/components/StaticPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Daily Trendline collects, uses and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <StaticPageShell
      kicker="Legal"
      title="Privacy Policy"
      intro="We collect as little as possible, and we're clear about what we do collect."
    >
      <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">
        Last updated: July 2026
      </p>

      <h2>What we collect</h2>
      <p>
        If you subscribe to The Daily Brief, we store the email address you give
        us — that&apos;s the only personal information the newsletter needs. If
        you contact us by email, we keep the correspondence for as long as it
        takes to resolve your query.
      </p>

      <h2>What we don&apos;t do</h2>
      <p>
        We don&apos;t sell your data. We don&apos;t share your email address
        with advertisers. We don&apos;t build advertising profiles of readers,
        and we don&apos;t track you across other websites.
      </p>

      <h2>Cookies and preferences</h2>
      <p>
        The site stores a single preference in your browser&apos;s local
        storage: your light/dark theme choice. It never leaves your device.
      </p>

      <h2>Third-party content</h2>
      <p>
        Live headline sections link to external publications. When you follow
        those links you leave this site and the destination&apos;s own privacy
        policy applies. Live headlines are provided by the GNews service; your
        browser does not contact GNews directly — the feed is fetched by our
        servers.
      </p>

      <h2>Unsubscribing and deletion</h2>
      <p>
        Every newsletter includes an unsubscribe link. You can also email us at
        any time to have your address removed entirely — removal is permanent
        and processed within 30 days.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to the addresses on our contact
        page.
      </p>
    </StaticPageShell>
  );
}
