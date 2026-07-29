import type { Metadata } from "next";
import StaticPageShell from "@/components/StaticPageShell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Daily Trendline editorial desk.",
};

const contacts = [
  {
    label: "Editorial & story tips",
    value: "newsdesk@dailytrendline.com",
    note: "Tips, corrections and story ideas. We read everything.",
  },
  {
    label: "Partnerships & advertising",
    value: "partners@dailytrendline.com",
    note: "Sponsorships, syndication and commercial enquiries.",
  },
  {
    label: "Newsletter support",
    value: "brief@dailytrendline.com",
    note: "Delivery issues, subscription changes and feedback on The Daily Brief.",
  },
];

export default function ContactPage() {
  return (
    <StaticPageShell
      kicker="Talk to us"
      title="Contact"
      intro="Questions, tips, corrections or partnerships — here's how to reach the desk."
    >
      <div className="grid gap-px bg-slate-300 dark:bg-slate-800 border border-slate-300 dark:border-slate-800">
        {contacts.map((contact) => (
          <div
            key={contact.value}
            className="bg-white dark:bg-slate-900 p-6 flex flex-col gap-1"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {contact.label}
            </span>
            <a
              href={`mailto:${contact.value}`}
              className="font-serif font-bold text-xl text-slate-900 dark:text-slate-100 no-underline hover:underline decoration-2 underline-offset-4"
            >
              {contact.value}
            </a>
            <p className="text-sm">{contact.note}</p>
          </div>
        ))}
      </div>

      <h2>Corrections</h2>
      <p>
        Accuracy matters to us. If you spot an error in any story, email the
        news desk with the article link and what needs fixing — corrections are
        made promptly and noted on the story.
      </p>
    </StaticPageShell>
  );
}
