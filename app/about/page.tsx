import type { Metadata } from "next";
import StaticPageShell from "@/components/StaticPageShell";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Daily Trendline is a daily news briefing covering business, technology, sports and entertainment.",
};

export default function AboutPage() {
  return (
    <StaticPageShell
      kicker="Who we are"
      title="About Daily Trendline"
      intro="A daily briefing built for busy readers — the stories that matter, told sharply and without the noise."
    >
      <p>
        Daily Trendline started with a simple observation: most people don&apos;t
        have time to read everything, but everyone needs to know what&apos;s
        going on. So we built a publication around brevity and clarity — short,
        carefully-written stories across the four beats that shape daily life:
        business, technology, sports and entertainment.
      </p>

      <h2>What we do</h2>
      <p>
        Every day our editorial desk curates and writes the stories worth your
        attention, alongside a live feed of headlines from trusted publications
        around the web. Our morning newsletter, The Daily Brief, condenses it
        all into one email you can read with your first coffee.
      </p>

      <h2>How we work</h2>
      <p>
        We value accuracy over speed and clarity over cleverness. When we make a
        mistake, we correct it visibly. When a story is developing, we say so.
        External headlines on this site always link to the original publisher —
        credit belongs with the people who did the reporting.
      </p>

      <h2>Get in touch</h2>
      <p>
        Got a story tip, feedback, or a correction? We read everything — reach
        us through the contact page.
      </p>
    </StaticPageShell>
  );
}
