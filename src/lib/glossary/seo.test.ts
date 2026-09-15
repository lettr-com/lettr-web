import { describe, expect, it } from "vite-plus/test";
import {
  formatTermDate,
  glossaryLlmsTxt,
  indexJsonLd,
  jsonLdScript,
  termJsonLd,
  termTitle,
} from "./seo";
import type { GlossaryTerm } from "./types";

const term = (overrides: Partial<GlossaryTerm> = {}): GlossaryTerm => ({
  slug: "dkim",
  term: "DKIM",
  fullName: "DomainKeys Identified Mail",
  heading: "What is DKIM?",
  description: "DKIM signs outgoing email. How it works and Lettr.",
  published: "2026-09-14",
  updated: "2026-09-15",
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

  it("falls back to the heading when the full name is too long", () => {
    const long = term({
      term: "DMARC",
      heading: "What is DMARC?",
      fullName: "Domain-based Message Authentication, Reporting & Conformance",
    });
    expect(termTitle(long)).toBe("What is DMARC? | Lettr Glossary");
  });

  it("lowercases the full name with a lowercased label but keeps an acronym", () => {
    expect(
      termTitle(
        term({ term: "Blocklist", heading: "What is a blocklist?", fullName: "Blacklist" }),
      ),
    ).toBe("What is a blocklist (blacklist)? | Lettr Glossary");
    expect(
      termTitle(
        term({
          term: "Non-Delivery Report",
          heading: "What is a non-delivery report?",
          fullName: "NDR",
        }),
      ),
    ).toBe("What is a non-delivery report (NDR)? | Lettr Glossary");
  });

  it("uses the heading alone when it does not end with the label", () => {
    expect(
      termTitle(
        term({
          term: "Dark Mode",
          heading: "What is dark mode in email?",
          fullName: "Dark Mode in Email",
        }),
      ),
    ).toBe("What is dark mode in email? | Lettr Glossary");
    expect(
      termTitle(term({ term: "Tag", heading: "What is an email tag?", fullName: undefined })),
    ).toBe("What is an email tag? | Lettr Glossary");
  });
});

describe("formatTermDate", () => {
  it("writes an ISO date out in US English", () => {
    expect(formatTermDate("2026-09-05")).toBe("September 5, 2026");
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
      datePublished: "2026-09-14",
      dateModified: "2026-09-15",
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
