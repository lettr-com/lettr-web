import { groupByLetter } from "./letters";
import type { GlossaryTerm, GlossaryTermLink } from "./types";

const SITE_URL = "https://lettr.com";
const GLOSSARY_URL = `${SITE_URL}/glossary/`;
const SET_ID = `${GLOSSARY_URL}#set`;
const TITLE_LIMIT = 60;
const TITLE_SUFFIX = " | Lettr Glossary";

export const GLOSSARY_NAME = "Lettr Email Glossary";

/**
 * The homepage defines these nodes in full; each glossary page repeats a
 * minimal copy because crawlers do not resolve an `@id` across pages.
 */
const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Lettr",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` },
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Lettr",
  url: SITE_URL,
  publisher: { "@id": organization["@id"] },
};

export function termUrl(slug: string): string {
  return `${GLOSSARY_URL}${slug}/`;
}

/**
 * `<title>` for a term page. When the heading ends with the label, the full
 * name goes in parentheses before the question mark if the title still fits
 * 60 characters, so both forms of a term ("DKIM", "DomainKeys Identified
 * Mail") match searches. A heading that lowercased the label ("What is a
 * blocklist?") gets a lowercased full name too, unless it is an acronym.
 */
export function termTitle(term: Pick<GlossaryTerm, "heading" | "term" | "fullName">): string {
  const { heading, fullName } = term;
  const question = heading.slice(0, -1);
  const tail = question.slice(-term.term.length);
  if (fullName && tail.toLowerCase() === term.term.toLowerCase()) {
    const lowercase = tail !== term.term && /[a-z]/.test(fullName);
    const long = `${question} (${lowercase ? fullName.toLowerCase() : fullName})?${TITLE_SUFFIX}`;
    if (long.length <= TITLE_LIMIT) return long;
  }
  return `${heading}${TITLE_SUFFIX}`;
}

/** "2026-09-15" as "September 15, 2026". */
export function formatTermDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

/** Label with the full name in parentheses when there is one, e.g. "DKIM (DomainKeys Identified Mail)". */
export function termLabel(term: Pick<GlossaryTerm, "term" | "fullName">): string {
  return term.fullName ? `${term.term} (${term.fullName})` : term.term;
}

function breadcrumb(id: string, items: { name: string; item: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...entry,
    })),
  };
}

export function termJsonLd(term: GlossaryTerm) {
  const url = termUrl(term.slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: term.heading,
        description: term.description,
        datePublished: term.published,
        dateModified: term.updated,
        inLanguage: "en",
        isPartOf: { "@id": website["@id"] },
        publisher: { "@id": organization["@id"] },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#term` },
      },
      {
        "@type": "DefinedTerm",
        "@id": `${url}#term`,
        name: term.term,
        ...(term.fullName ? { alternateName: term.fullName } : {}),
        description: term.definition,
        url,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          "@id": SET_ID,
          name: GLOSSARY_NAME,
          url: GLOSSARY_URL,
        },
      },
      breadcrumb(`${url}#breadcrumb`, [
        { name: "Home", item: `${SITE_URL}/` },
        { name: "Glossary", item: GLOSSARY_URL },
        { name: term.term, item: url },
      ]),
      website,
      organization,
    ],
  };
}

export function indexJsonLd(terms: readonly GlossaryTermLink[], description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": GLOSSARY_URL,
        url: GLOSSARY_URL,
        name: GLOSSARY_NAME,
        description,
        inLanguage: "en",
        isPartOf: { "@id": website["@id"] },
        publisher: { "@id": organization["@id"] },
        breadcrumb: { "@id": `${GLOSSARY_URL}#breadcrumb` },
        mainEntity: { "@id": SET_ID },
      },
      {
        "@type": "DefinedTermSet",
        "@id": SET_ID,
        name: GLOSSARY_NAME,
        description,
        url: GLOSSARY_URL,
        inLanguage: "en",
        publisher: { "@id": organization["@id"] },
        hasDefinedTerm: terms.map((term) => ({
          "@type": "DefinedTerm",
          "@id": `${termUrl(term.slug)}#term`,
          name: term.term,
          url: termUrl(term.slug),
        })),
      },
      breadcrumb(`${GLOSSARY_URL}#breadcrumb`, [
        { name: "Home", item: `${SITE_URL}/` },
        { name: "Glossary", item: GLOSSARY_URL },
      ]),
      website,
      organization,
    ],
  };
}

/**
 * The glossary as an llms.txt file (llmstxt.org): one link per term with its
 * definition, grouped by letter, so AI crawlers get every term in one fetch.
 * `terms` must already be sorted the way the index is.
 */
export function glossaryLlmsTxt(terms: readonly GlossaryTerm[]): string {
  const groups = groupByLetter(
    terms.map(({ slug, term }) => ({ slug, term, href: termUrl(slug) })),
  );
  const bySlug = new Map(terms.map((term) => [term.slug, term]));
  const sections = groups.map(({ letter, terms: links }) => {
    const lines = links.map(({ slug }) => {
      const term = bySlug.get(slug)!;
      return `- [${termLabel(term)}](${termUrl(slug)}): ${term.definition}`;
    });
    return `## ${letter}\n\n${lines.join("\n")}`;
  });
  return (
    [
      `# ${GLOSSARY_NAME}`,
      `> ${terms.length} email infrastructure, deliverability, authentication and compliance terms, each explained in plain language with how it shows up in Lettr, the email platform for SaaS.`,
      `Each link opens the full article: how the term works, common problems and how it applies in Lettr. The glossary index is ${GLOSSARY_URL} and the Lettr developer docs are https://docs.lettr.com.`,
      ...sections,
    ].join("\n\n") + "\n"
  );
}

/**
 * A `<script type="application/ld+json">` tag for `{@html}`. `<` is escaped
 * so text such as a quoted `</script>` in a definition cannot end the tag.
 */
export function jsonLdScript(data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}
