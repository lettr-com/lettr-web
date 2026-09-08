/**
 * Product areas an entry touches. Rendered as tinted, colored badges; an entry
 * that spans several modules carries every one of them.
 */
export type Module = "transactional" | "campaigns" | "audience" | "platform";

/**
 * Secondary, cross-module labels. Rendered as outline badges, except "Breaking",
 * which uses the warning color so an upgrade-blocking change is visible at a glance.
 */
export type FeatureTag =
  | "API"
  | "SDKs"
  | "Webhooks"
  | "AI"
  | "Deliverability"
  | "UI/UX"
  | "Docs"
  | "Security"
  | "Performance"
  | "Billing"
  | "Breaking";

/**
 * Inline formatting in `lead`, `body` and `text` is limited to backtick code
 * spans and `[text](url)` links, rendered by `renderInline()`. Nothing else in
 * those strings is treated as markup.
 */
export interface ChangelogEntry {
  /** Title Case. Doubles as the PostHog `entry_title` property. */
  title: string;
  /** At least one. */
  modules: Module[];
  tags?: FeatureTag[];
  /** First sentence, rendered bold by the component rather than by markup. */
  lead: string;
  /** Plain paragraphs following the lead. */
  body?: string[];
  code?: { lang: string; source: string };
  /** Only ever a docs.lettr.com page verified to return 200. */
  docs?: { label: string; href: string };
}

export interface ChangelogBugfix {
  modules: Module[];
  tags?: FeatureTag[];
  /** One line, opening with "Fixed". Doubles as the PostHog `entry_title`. */
  text: string;
}

export interface ChangelogMonth {
  /** "YYYY-MM"; must equal the data file's name. Asserted by months.test.ts. */
  id: string;
  features: ChangelogEntry[];
  improvements: ChangelogEntry[];
  bugfixes: ChangelogBugfix[];
}
