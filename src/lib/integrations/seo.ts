import { HUB_PATH, detailPath, hubSections, integrationHref } from "./index.ts";
import type { Integration, IntegrationFaq } from "./types.ts";
import { SITE_URL, absoluteUrl, breadcrumb, organization, website } from "../utils/jsonLd.ts";

const HUB_URL = `${SITE_URL}${HUB_PATH}`;

export const HUB_TITLE = "Lettr Integrations: SDKs, MCP Server and Connectors | Lettr";
export const HUB_DESCRIPTION =
  "Everything Lettr connects to: SDKs, a hosted MCP server, SMTP, webhooks, plugins and connectors built by partners. Each with setup and who built it.";

/** Types Lettr ships as installable software, which get SoftwareApplication markup. */
const SHIPPED_TYPES = new Set(["Plugin", "Marketplace app", "Automation platform"]);

/** "2026-11-10" as "November 10, 2026". */
export function formatCheckedDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

function faqPage(id: string, faqs: readonly IntegrationFaq[]) {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function hubJsonLd(entries: readonly Integration[], faqs: readonly IntegrationFaq[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": HUB_URL,
        url: HUB_URL,
        name: "Lettr Integrations",
        description: HUB_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": website["@id"] },
        publisher: { "@id": organization["@id"] },
        breadcrumb: { "@id": `${HUB_URL}#breadcrumb` },
        mainEntity: { "@id": `${HUB_URL}#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${HUB_URL}#list`,
        numberOfItems: entries.length,
        itemListElement: entries.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entry.name,
          url: absoluteUrl(integrationHref(entry)),
        })),
      },
      faqPage(`${HUB_URL}#faq`, faqs),
      breadcrumb(`${HUB_URL}#breadcrumb`, [
        { name: "Home", item: `${SITE_URL}/` },
        { name: "Integrations", item: HUB_URL },
      ]),
      website,
      organization,
    ],
  };
}

export function detailJsonLd(entry: Integration) {
  const url = `${SITE_URL}${detailPath(entry.slug)}`;
  const graph: object[] = [
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name: entry.seo?.heading ?? entry.name,
      description: entry.seo?.description ?? entry.statement,
      dateModified: entry.lastChecked,
      inLanguage: "en",
      isPartOf: { "@id": website["@id"] },
      publisher: { "@id": organization["@id"] },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    breadcrumb(`${url}#breadcrumb`, [
      { name: "Home", item: `${SITE_URL}/` },
      { name: "Integrations", item: HUB_URL },
      { name: entry.name, item: url },
    ]),
    website,
    organization,
  ];
  if (entry.faq?.length) graph.push(faqPage(`${url}#faq`, entry.faq));
  if (entry.builtBy === "Lettr" && SHIPPED_TYPES.has(entry.type)) {
    graph.push({
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: `Lettr for ${entry.name}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: entry.name,
      url: entry.links.listing ?? url,
      publisher: { "@id": organization["@id"] },
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/**
 * The integrations as an llms.txt file (llmstxt.org): one line per live entry
 * with its URL, builder and plain statement, grouped like the hub.
 */
export function integrationsLlmsTxt(): string {
  const groups = hubSections().map(({ heading, entries }) => {
    const lines = entries.map((entry) => {
      const url = absoluteUrl(integrationHref(entry));
      return `- [${entry.name}](${url}): ${entry.statement} Built by ${entry.builtBy}.`;
    });
    return `## ${heading}\n\n${lines.join("\n")}`;
  });
  return (
    [
      "# Lettr Integrations",
      "> Everything Lettr, the email platform for SaaS, connects to: SDKs, a hosted MCP server, SMTP, webhooks, plugins and connectors built by partners.",
      `The integrations hub is ${HUB_URL}. Setup guides are in the Lettr docs at https://docs.lettr.com/integrations/introduction. Lettr has no Ruby or .NET SDK; both work over SMTP or the REST API.`,
      ...groups,
    ].join("\n\n") + "\n"
  );
}

export { jsonLdScript } from "../utils/jsonLd.ts";
