/**
 * Default site navigation.
 *
 * Nav and footer links normally come from the Strapi "Global" entry, but the
 * CMS isn't always reachable (not yet deployed, outage, cold start). These
 * fallbacks keep the header and footer usable in that case — the sections are
 * fixed properties of the site, not editorial content, so hard-coding them is
 * safe. Whenever Strapi does return links, its values win.
 */

export type NavLink = {
  text: string;
  url: string;
  isExternal?: boolean;
};

export const DEFAULT_NAV: NavLink[] = [
  { text: "Business", url: "/business" },
  { text: "Technology", url: "/technology" },
  { text: "Sports", url: "/sports" },
  { text: "Entertainment", url: "/entertainment" },
];

export const DEFAULT_FOOTER_SECTIONS = [
  { title: "Sections", footerLink: DEFAULT_NAV },
  {
    title: "Explore",
    footerLink: [
      { text: "Search", url: "/search" },
      { text: "Home", url: "/" },
    ] as NavLink[],
  },
];

export const DEFAULT_SOCIAL: NavLink[] = [
  { text: "Facebook", url: "https://facebook.com", isExternal: true },
  { text: "X", url: "https://x.com", isExternal: true },
  { text: "Instagram", url: "https://instagram.com", isExternal: true },
];

/** Prefers CMS-provided links, falling back to the defaults above. */
export function withFallback<T>(cmsValue: T[] | undefined | null, fallback: T[]): T[] {
  return cmsValue && cmsValue.length > 0 ? cmsValue : fallback;
}
