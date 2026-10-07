import { escapeHtml } from "../utils/html";
import { slugify } from "../utils/slug";
import { renderInline, renderPlain } from "./inline";
import { MONTHS, formatMonth } from "./months";
import { summarizeMonth } from "./summary";
import type { ChangelogBugfix, ChangelogEntry, ChangelogMonth } from "./types";
import { SITE_URL, breadcrumb, organization, website } from "../utils/jsonLd";

export const CHANGELOG_URL = `${SITE_URL}/changelog/`;
export const CHANGELOG_NAME = "Lettr Changelog";
export const FEED_URL = `${CHANGELOG_URL}feed.xml`;
export const LLMS_URL = `${CHANGELOG_URL}llms.txt`;

/** Google shows roughly this many characters of a title and a description. */
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

export const INDEX_TITLE = "Lettr Changelog: New Features, Improvements & Bugfixes";
export const INDEX_DESCRIPTION =
  "Everything we ship to Lettr, month by month: new features, improvements and bugfixes across the transactional email API, campaigns, audience and the platform.";

/** The product every entry is about. Minimal, like the two nodes above. */
const software = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: "Lettr",
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
};

export function monthUrl(id: string): string {
  return `${CHANGELOG_URL}${id}/`;
}

/**
 * Anchor id for one entry, scoped to its month like the section anchors are,
 * so a feed showing several months never carries two entries with one id.
 */
export function entryAnchor(month: Pick<ChangelogMonth, "id">, entry: ChangelogEntry): string {
  return `${month.id}-${slugify(entry.title)}`;
}

export function entryUrl(month: Pick<ChangelogMonth, "id">, entry: ChangelogEntry): string {
  return `${monthUrl(month.id)}#${entryAnchor(month, entry)}`;
}

/** "2026-08-31" as "August 31, 2026". */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

/** `<title>` for a month page: "August 2026 Changelog: What's New in Lettr". */
export function monthTitle(month: Pick<ChangelogMonth, "id">): string {
  return `${formatMonth(month.id)} Changelog: What's New in Lettr`;
}

/**
 * Meta description for a month: the counts, then as many headline feature
 * titles as fit the limit, so the snippet names what shipped rather than only
 * how much of it did.
 */
export function monthDescription(month: ChangelogMonth): string {
  const label = formatMonth(month.id);
  const summary = summarizeMonth(month)?.replace(/ /g, " ");
  const base = summary
    ? `Everything Lettr shipped in ${label}: ${summary}`
    : `Everything Lettr shipped in ${label}`;

  const titles = month.features.map((entry) => entry.title);
  for (let take = titles.length; take > 0; take--) {
    const named = titles.slice(0, take);
    const list =
      named.length === 1 ? named[0] : `${named.slice(0, -1).join(", ")} and ${named.at(-1)}`;
    const candidate = `${base}, including ${list}.`;
    if (candidate.length <= DESCRIPTION_LIMIT) return candidate;
  }

  return `${base}.`;
}

/**
 * Structured data for the index: a CollectionPage whose main entity lists
 * every month page, dated by the newest month so crawlers see it is current.
 */
export function indexJsonLd(newest: ChangelogMonth) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": CHANGELOG_URL,
        url: CHANGELOG_URL,
        name: CHANGELOG_NAME,
        description: INDEX_DESCRIPTION,
        dateModified: newest.published,
        inLanguage: "en",
        isPartOf: { "@id": website["@id"] },
        publisher: { "@id": organization["@id"] },
        about: { "@id": software["@id"] },
        breadcrumb: { "@id": `${CHANGELOG_URL}#breadcrumb` },
        mainEntity: { "@id": `${CHANGELOG_URL}#months` },
      },
      {
        "@type": "ItemList",
        "@id": `${CHANGELOG_URL}#months`,
        name: `${CHANGELOG_NAME} by month`,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: MONTHS.length,
        itemListElement: MONTHS.map((id, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${formatMonth(id)} changelog`,
          url: monthUrl(id),
        })),
      },
      breadcrumb(`${CHANGELOG_URL}#breadcrumb`, [
        { name: "Home", item: `${SITE_URL}/` },
        { name: "Changelog", item: CHANGELOG_URL },
      ]),
      website,
      organization,
      software,
    ],
  };
}

function entryListItems(month: ChangelogMonth) {
  const entries = [...month.features, ...month.improvements].map((entry) => ({
    name: entry.title,
    url: entryUrl(month, entry),
    description: renderPlain(entry.lead),
  }));
  const fixes = month.bugfixes.map((fix) => ({
    name: renderPlain(fix.text),
    url: `${monthUrl(month.id)}#${month.id}-bugfixes`,
  }));

  return [...entries, ...fixes].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    ...item,
  }));
}

/**
 * Structured data for a month page: the release notes as a TechArticle with
 * real dates, and every entry as a list item pointing at its anchor.
 */
export function monthJsonLd(month: ChangelogMonth) {
  const url = monthUrl(month.id);
  const label = formatMonth(month.id);
  const description = monthDescription(month);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: monthTitle(month),
        description,
        datePublished: month.published,
        dateModified: month.published,
        inLanguage: "en",
        isPartOf: { "@id": website["@id"] },
        publisher: { "@id": organization["@id"] },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#article` },
      },
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: `Lettr changelog: ${label}`,
        description,
        url,
        mainEntityOfPage: { "@id": url },
        datePublished: month.published,
        dateModified: month.published,
        inLanguage: "en",
        author: { "@id": organization["@id"] },
        publisher: { "@id": organization["@id"] },
        about: { "@id": software["@id"] },
        isPartOf: { "@id": CHANGELOG_URL },
        keywords: ["changelog", "release notes", "Lettr", "email API"],
      },
      {
        "@type": "ItemList",
        "@id": `${url}#entries`,
        name: `Changes shipped to Lettr in ${label}`,
        numberOfItems: month.features.length + month.improvements.length + month.bugfixes.length,
        itemListElement: entryListItems(month),
      },
      breadcrumb(`${url}#breadcrumb`, [
        { name: "Home", item: `${SITE_URL}/` },
        { name: "Changelog", item: CHANGELOG_URL },
        { name: label, item: url },
      ]),
      website,
      organization,
      software,
    ],
  };
}

function llmsEntryLine(month: ChangelogMonth, entry: ChangelogEntry): string {
  const tags = [...entry.modules, ...(entry.tags ?? [])].join(", ");
  return `- [${entry.title}](${entryUrl(month, entry)}) (${tags}): ${renderPlain(entry.lead)}`;
}

function llmsFixLine(fix: ChangelogBugfix): string {
  const tags = [...fix.modules, ...(fix.tags ?? [])].join(", ");
  return `- (${tags}) ${renderPlain(fix.text)}`;
}

/**
 * The whole changelog as one llms.txt file (llmstxt.org). The index page
 * prerenders only the newest month and lazily loads the rest, so this is the
 * one place an AI crawler gets every entry in a single fetch. `months` must be
 * newest first, the way the registry is.
 */
export function changelogLlmsTxt(months: readonly ChangelogMonth[]): string {
  const sections = months.map((month) => {
    const label = formatMonth(month.id);
    const parts = [
      `## ${label}`,
      `Published ${month.published}. Full notes: ${monthUrl(month.id)}`,
    ];

    if (month.features.length) {
      parts.push(
        `### New features\n\n${month.features.map((entry) => llmsEntryLine(month, entry)).join("\n")}`,
      );
    }
    if (month.improvements.length) {
      parts.push(
        `### Improvements\n\n${month.improvements.map((entry) => llmsEntryLine(month, entry)).join("\n")}`,
      );
    }
    if (month.bugfixes.length) {
      parts.push(`### Bugfixes\n\n${month.bugfixes.map(llmsFixLine).join("\n")}`);
    }

    return parts.join("\n\n");
  });

  const entries = months.reduce(
    (total, month) =>
      total + month.features.length + month.improvements.length + month.bugfixes.length,
    0,
  );
  const oldest = months.at(-1);
  const span = oldest ? `${formatMonth(oldest.id)} to ${formatMonth(months[0].id)}` : "";

  return (
    [
      `# ${CHANGELOG_NAME}`,
      `> ${entries} changes shipped to Lettr, the email platform for SaaS, from ${span}: new features, improvements and bugfixes across the transactional email API, campaigns, audience and the platform, newest month first.`,
      `Each entry is tagged with the product areas it touches (transactional, campaigns, audience, platform) and the kind of change (API, SDKs, Webhooks, Breaking, …). Each link opens the entry on its month's page. The changelog index is ${CHANGELOG_URL}, an Atom feed is at ${FEED_URL}, and the Lettr developer docs are https://docs.lettr.com.`,
      ...sections,
    ].join("\n\n") + "\n"
  );
}

function entryHtml(entry: ChangelogEntry): string {
  const body = (entry.body ?? []).map((paragraph) => `<p>${renderInline(paragraph)}</p>`).join("");
  return `<h3>${escapeHtml(entry.title)}</h3><p><strong>${renderInline(entry.lead)}</strong></p>${body}`;
}

function sectionHtml(heading: string, items: string[]): string {
  return items.length ? `<h2>${heading}</h2>${items.join("")}` : "";
}

/** The month's notes as HTML for a feed reader, without the site's markup. */
export function monthFeedHtml(month: ChangelogMonth): string {
  return [
    sectionHtml("New features", month.features.map(entryHtml)),
    sectionHtml("Improvements", month.improvements.map(entryHtml)),
    sectionHtml("Bugfixes", [
      month.bugfixes.length
        ? `<ul>${month.bugfixes.map((fix) => `<li>${renderInline(fix.text)}</li>`).join("")}</ul>`
        : "",
    ]),
  ].join("");
}

function xmlText(value: string): string {
  return escapeHtml(value);
}

/**
 * The changelog as an Atom feed, one entry per month. Feed readers, changelog
 * aggregators and some AI crawlers discover updates this way, and the feed is
 * linked from every changelog page as an alternate representation.
 */
export function changelogAtom(months: readonly ChangelogMonth[]): string {
  const updated = months[0] ? `${months[0].published}T00:00:00Z` : "1970-01-01T00:00:00Z";
  const entries = months.map((month) => {
    const url = monthUrl(month.id);
    return [
      "  <entry>",
      `    <id>${url}</id>`,
      `    <title>${xmlText(`Lettr changelog: ${formatMonth(month.id)}`)}</title>`,
      `    <link rel="alternate" type="text/html" href="${url}"/>`,
      `    <published>${month.published}T00:00:00Z</published>`,
      `    <updated>${month.published}T00:00:00Z</updated>`,
      `    <summary>${xmlText(monthDescription(month))}</summary>`,
      `    <content type="html">${xmlText(monthFeedHtml(month))}</content>`,
      "  </entry>",
    ].join("\n");
  });

  return (
    [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<feed xmlns="http://www.w3.org/2005/Atom">',
      `  <id>${CHANGELOG_URL}</id>`,
      `  <title>${CHANGELOG_NAME}</title>`,
      `  <subtitle>${xmlText(INDEX_DESCRIPTION)}</subtitle>`,
      `  <link rel="alternate" type="text/html" href="${CHANGELOG_URL}"/>`,
      `  <link rel="self" type="application/atom+xml" href="${FEED_URL}"/>`,
      `  <updated>${updated}</updated>`,
      "  <author><name>Lettr</name><uri>https://lettr.com</uri></author>",
      ...entries,
      "</feed>",
    ].join("\n") + "\n"
  );
}
