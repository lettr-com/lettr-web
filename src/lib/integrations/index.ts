import { integrations, sections } from "./data.ts";
import type { Integration, IntegrationFaq, IntegrationSection } from "./types.ts";

export const HUB_PATH = "/integrations/";
export const LISTING_EMAIL = "info@lettr.com";

/** Every entry that renders. Held and removed entries stay in the data file only. */
export function liveIntegrations(): Integration[] {
  return integrations.filter((entry) => entry.status === "live");
}

export function findIntegration(slug: string): Integration | undefined {
  return liveIntegrations().find((entry) => entry.slug === slug);
}

/** Every live entry has its own page at `/integrations/{slug}/`. */
export function detailIntegrations(): Integration[] {
  return liveIntegrations();
}

export function detailPath(slug: string): string {
  return `${HUB_PATH}${slug}/`;
}

/**
 * Where a card leads: always the entry's own page. Outside links (docs,
 * listings, source) and lettr.com product pages are linked from there only.
 */
export function integrationHref(entry: Integration): string {
  return detailPath(entry.slug);
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function featuredIntegrations(): Integration[] {
  return liveIntegrations().filter((entry) => entry.featured);
}

export interface HubSection extends IntegrationSection {
  entries: Integration[];
}

/** Hub sections in page order, each with its live entries; empty sections are dropped. */
export function hubSections(): HubSection[] {
  const live = liveIntegrations();
  return sections
    .map((section) => ({
      ...section,
      entries: live.filter((entry) => entry.category === section.id),
    }))
    .filter((section) => section.entries.length > 0);
}

export function relatedIntegrations(entry: Integration): Integration[] {
  return (entry.related ?? [])
    .map((slug) => findIntegration(slug))
    .filter((related): related is Integration => related !== undefined);
}

function listJoin(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

/** The hub's questions. The SDK answer is built from the live entries so it cannot go stale. */
export function hubFaqs(): IntegrationFaq[] {
  const live = liveIntegrations();
  const sdks = live.filter((entry) => entry.type === "SDK").map((entry) => entry.name);
  const lettrBuilt = live
    .filter(
      (entry) =>
        entry.builtBy === "Lettr" &&
        ["Plugin", "Marketplace app", "Automation platform"].includes(entry.type),
    )
    .map(
      (entry) =>
        `the ${entry.name} ${entry.type === "Plugin" ? "plugin" : entry.type === "Marketplace app" ? "app" : "node"}`,
    );

  return [
    {
      question: "Does Lettr have an MCP server?",
      answer:
        "Yes. Lettr hosts an MCP server at https://app.lettr.com/mcp. You connect by signing in to Lettr or with an API key, and it works with Claude, Claude Code, ChatGPT, Cursor and GitHub Copilot.",
    },
    {
      question: "Which languages have an official Lettr SDK?",
      answer: `Lettr builds SDKs for ${listJoin(sdks)}, and a Laravel package on top of the PHP SDK.`,
    },
    {
      question: "Can I use Lettr with a tool that is not listed?",
      answer:
        "Yes. Any tool that sends over SMTP can use smtp.lettr.com with the username lettr and your API key as the password. Anything that can make an HTTP request can use the REST API.",
    },
    {
      question: "Who builds and maintains the connectors on partner platforms?",
      answer: `The platform that lists them. Every card says who built it. Lettr builds the SDKs, the MCP server, ${listJoin(lettrBuilt)}.`,
    },
    {
      question: "Is there a Ruby or .NET SDK?",
      answer: "No. Ruby and .NET apps can send through Lettr over SMTP or the REST API.",
    },
    {
      question: "How do I get my connector listed or corrected?",
      answer: `Email ${LISTING_EMAIL} with a link to your live public listing. We check it and add it, or fix what is wrong.`,
    },
  ];
}
