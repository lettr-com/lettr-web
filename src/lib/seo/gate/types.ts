export const SITE = "https://lettr.com";

export interface Heading {
  level: number;
  text: string;
  /** Set when the heading sits inside a UI mockup or another element hidden from assistive tech. */
  insideMockup: boolean;
}

/** What the gate reads from one built page. */
export interface PageFacts {
  /** Root-relative path with a trailing slash, e.g. "/pricing/". */
  path: string;
  title: string | undefined;
  description: string | undefined;
  canonical: string | undefined;
  robots: string | undefined;
  headings: Heading[];
  /** Every href on the page, as written. */
  links: string[];
  /** Hrefs inside the first <nav>, the site header. */
  navLinks: string[];
  /** Schema.org @type values from every JSON-LD block, sorted and unique. */
  jsonLdTypes: string[];
  /** A JSON-LD block that did not parse. */
  badJsonLd: number;
  /** Set on a redirect stub (meta refresh, no <main>): the path it sends visitors to. */
  redirectsTo: string | undefined;
}

export interface Issue {
  rule: string;
  /** Page path, or a file name for site-level rules. */
  url: string;
  detail: string;
}

/** Rules that fail the gate even when an issue was already known. */
export const HARD_RULES = new Set([
  "baseline-url-lost",
  "structured-data-lost",
  "noindex-added",
  "sitemap-url-without-page",
  "redirect-target-missing",
  "redirect-chain",
  "redirect-stub-target-missing",
]);

export interface BaselinePage {
  title: string | undefined;
  h1: string | undefined;
  canonical: string | undefined;
  jsonLdTypes: string[];
  noindex: boolean;
}

export interface Baseline {
  /** ISO date the baseline was taken from the deployed site. */
  takenOn: string;
  pages: Record<string, BaselinePage>;
}

/** Old path to new path, both root-relative with trailing slashes. */
export type Redirects = Record<string, string>;
