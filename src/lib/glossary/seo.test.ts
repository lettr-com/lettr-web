import { describe, expect, it } from "vite-plus/test";
import { glossaryLlmsTxt, indexJsonLd, jsonLdScript, termJsonLd, termTitle } from "./seo";
import type { GlossaryTerm } from "./types";

const term = (overrides: Partial<GlossaryTerm> = {}): GlossaryTerm => ({
  slug: "dkim",
  term: "DKIM",
  fullName: "DomainKeys Identified Mail",
  question: "What is",
  description: "DKIM signs outgoing email. How it works and Lettr.",
  related: [],
  reading: [],
  html: "<p>x</p>",
  definition: "DKIM (DomainKeys Identified Mail) is an email authentication standard.",
  ...overrides,
});

describe("termTitle", () => {
  it("adds the full name when it fits 60 characters", () => {
    expect(termTitle(term())).toBe("What is DKIM (DomainKeys Identified Mail)? | Lettr Glossary");
  });

  it("falls back to the short heading when the full name is too long", () => {
    const long = term({
      term: "DMARC",
      fullName: "Domain-based Message Authentication, Reporting & Conformance",
    });
    expect(termTitle(long)).toBe("What is DMARC? | Lettr Glossary");
  });

  it("skips a full name that already contains the label", () => {
    expect(termTitle(term({ term: "Dark Mode", fullName: "Dark Mode in Email" }))).toBe(
      "What is Dark Mode? | Lettr Glossary",
    );
  });

  it("uses the short heading when there is no full name", () => {
    expect(termTitle(term({ term: "Tag", fullName: undefined }))).toBe(
      "What is Tag? | Lettr Glossary",
    );
  });
});

describe("termJsonLd", () => {
  it("describes the term with its definition and ties the page to the term set", () => {
    const graph = termJsonLd(term())["@graph"] as Record<string, unknown>[];
    const byType = (type: string) => graph.find((node) => node["@type"] === type)!;
    expect(byType("DefinedTerm")).toMatchObject({
      "@id": "https://lettr.com/glossary/dkim/#term",
      alternateName: "DomainKeys Identified Mail",
      description: "DKIM (DomainKeys Identified Mail) is an email authentication standard.",
      inDefinedTermSet: { "@id": "https://lettr.com/glossary/#set" },
    });
    expect(byType("WebPage")).toMatchObject({
      mainEntity: { "@id": "https://lettr.com/glossary/dkim/#term" },
      description: "DKIM signs outgoing email. How it works and Lettr.",
    });
    expect(byType("Organization")["@id"]).toBe("https://lettr.com/#organization");
  });
});

describe("indexJsonLd", () => {
  it("lists every term in the defined term set", () => {
    const graph = indexJsonLd([{ slug: "dkim", term: "DKIM", href: "/glossary/dkim/" }], "About.")[
      "@graph"
    ] as Record<string, unknown>[];
    const set = graph.find((node) => node["@type"] === "DefinedTermSet")!;
    expect(set.hasDefinedTerm).toEqual([
      {
        "@type": "DefinedTerm",
        "@id": "https://lettr.com/glossary/dkim/#term",
        name: "DKIM",
        url: "https://lettr.com/glossary/dkim/",
      },
    ]);
  });
});

describe("jsonLdScript", () => {
  it("escapes < so content cannot close the script tag", () => {
    const html = jsonLdScript({ text: "</script><b>" });
    expect(html).not.toContain("</script><b>");
    expect(html.endsWith("</script>")).toBe(true);
  });
});

describe("glossaryLlmsTxt", () => {
  it("groups linked definitions by letter under a title and summary", () => {
    const text = glossaryLlmsTxt([
      term(),
      term({
        slug: "spf",
        term: "SPF",
        fullName: undefined,
        definition: "SPF lists allowed servers.",
      }),
    ]);
    expect(text).toMatch(/^# Lettr Email Glossary\n\n> 2 email/);
    expect(text).toContain(
      "## D\n\n- [DKIM (DomainKeys Identified Mail)](https://lettr.com/glossary/dkim/): DKIM (DomainKeys Identified Mail) is an email authentication standard.",
    );
    expect(text).toContain(
      "## S\n\n- [SPF](https://lettr.com/glossary/spf/): SPF lists allowed servers.",
    );
  });
});
