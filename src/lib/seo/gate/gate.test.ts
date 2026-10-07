import { describe, expect, it } from "vite-plus/test";

import { pathOfBuiltFile, readPage } from "./page.ts";
import { compare, toKnown } from "./ratchet.ts";
import { checkPage, checkSite, internalPath, type SiteContext, type SiteInput } from "./rules.ts";
import type { Baseline, PageFacts } from "./types.ts";

function html(main: string, head = "", nav = ""): string {
  return `<html><head><title>Transactional Email API for SaaS | Lettr</title><meta name="description" content="A description"><link rel="canonical" href="https://lettr.com/pricing/">${head}</head><body><nav>${nav}</nav><main>${main}</main></body></html>`;
}

const context: SiteContext = {
  pages: new Set(["/", "/pricing/", "/email-api/"]),
  redirects: {},
  fileExists: () => false,
};

function facts(overrides: Partial<PageFacts> = {}): PageFacts {
  return { ...readPage(html("<h1>Pricing</h1>"), "/pricing/"), ...overrides };
}

describe("readPage", () => {
  it("reads the head, headings, links and structured data", () => {
    const page = readPage(
      html(
        '<h1>Pricing</h1><h2>Plans</h2><a href="/email-api/">API</a>',
        '<script type="application/ld+json">{"@graph":[{"@type":"Organization"},{"@type":["WebSite","Thing"]}]}</script><script type="application/ld+json">{"@type":"FAQPage","mainEntity":[{"@type":"Question"}]}</script>',
        '<a href="/pricing/">Pricing</a>',
      ),
      "/pricing/",
    );
    expect(page.title).toBe("Transactional Email API for SaaS | Lettr");
    expect(page.headings.map((heading) => [heading.level, heading.text])).toEqual([
      [1, "Pricing"],
      [2, "Plans"],
    ]);
    expect(page.links).toEqual(["/pricing/", "/email-api/"]);
    expect(page.navLinks).toEqual(["/pricing/"]);
    expect(page.jsonLdTypes).toEqual(["FAQPage", "Organization", "Question", "Thing", "WebSite"]);
  });

  it("flags headings inside aria-hidden or skipped mockups", () => {
    const page = readPage(
      html(
        '<h1>Real</h1><div aria-hidden="true"><h3>Your trial is live!</h3></div><div data-markdown="skip"><h2>What\'s new</h2></div>',
      ),
      "/",
    );
    expect(page.headings.map((heading) => heading.insideMockup)).toEqual([false, true, true]);
  });

  it("recognises a redirect stub", () => {
    const stub =
      '<html><head><meta http-equiv="refresh" content="0; url=/demo/"></head><body></body></html>';
    expect(readPage(stub, "/book/").redirectsTo).toBe("/demo/");
    expect(readPage(html("<h1>x</h1>"), "/").redirectsTo).toBeUndefined();
  });

  it("turns built files into page paths", () => {
    expect(pathOfBuiltFile("index.html")).toBe("/");
    expect(pathOfBuiltFile("blog/post/index.html")).toBe("/blog/post/");
  });
});

describe("internalPath", () => {
  it("reads on-site links and ignores the rest", () => {
    expect(internalPath("/pricing")).toEqual({ path: "/pricing/", hasSlash: false });
    expect(internalPath("https://lettr.com/pricing/?plan=marketing#faq")).toEqual({
      path: "/pricing/",
      hasSlash: true,
    });
    expect(internalPath("https://lettr.com")).toEqual({ path: "/", hasSlash: true });
    for (const href of [
      "https://docs.lettr.com",
      "/llms.txt",
      "#top",
      "mailto:a@b.c",
      "//cdn.example.com/x",
    ]) {
      expect(internalPath(href)).toBeUndefined();
    }
  });
});

describe("checkPage", () => {
  const rules = (page: PageFacts) => checkPage(page, context).map((issue) => issue.rule);

  it("passes a well-formed page", () => {
    expect(rules(facts())).toEqual([]);
  });

  it("checks the title length", () => {
    expect(rules(facts({ title: "Pricing — Lettr" }))).toContain("title-short");
    expect(rules(facts({ title: "x".repeat(61) }))).toContain("title-long");
    expect(rules(facts({ title: undefined }))).toContain("title-missing");
  });

  it("checks the description, canonical and H1 count", () => {
    expect(rules(facts({ description: "x".repeat(161) }))).toContain("description-long");
    expect(rules(facts({ canonical: "https://lettr.com/pricing" }))).toContain(
      "canonical-not-self",
    );
    expect(rules(facts({ canonical: undefined }))).toContain("canonical-missing");
    expect(rules(facts({ headings: [] }))).toContain("h1-count");
  });

  it("flags mockup headings and widget glyphs", () => {
    const page = facts({
      headings: [
        { level: 1, text: "Pricing", insideMockup: false },
        { level: 3, text: "Your trial is live!", insideMockup: true },
        { level: 3, text: "Clean REST API +", insideMockup: false },
      ],
    });
    expect(rules(page)).toEqual(["heading-in-mockup", "heading-widget-glyph"]);
  });

  it("flags slashless and broken internal links", () => {
    const issues = checkPage(
      facts({ links: ["/pricing", "/nowhere/", "https://docs.lettr.com"] }),
      context,
    );
    expect(issues.map((issue) => issue.rule)).toEqual([
      "internal-link-without-slash",
      "internal-link-broken",
    ]);
  });

  it("does not hold a redirect stub to page rules, only to its target", () => {
    expect(rules(facts({ redirectsTo: "/pricing/", title: undefined }))).toEqual([]);
    expect(rules(facts({ redirectsTo: "/gone/" }))).toEqual(["redirect-stub-target-missing"]);
  });

  it("wants the product links in the server-rendered header of the home page", () => {
    const home = facts({
      path: "/",
      canonical: "https://lettr.com/",
      navLinks: ["/pricing/", "/blog/"],
    });
    expect(
      checkPage(home, context).find((issue) => issue.rule === "nav-links-missing")?.detail,
    ).toContain("/email-api/");
    const complete = facts({
      path: "/",
      canonical: "https://lettr.com/",
      navLinks: [
        "/email-api/",
        "/smtp-relay/",
        "/inbound-email-api/",
        "/email-marketing/",
        "/pricing/",
        "/compare/",
        "https://docs.lettr.com",
      ],
    });
    expect(rules(complete)).toEqual([]);
  });
});

describe("checkSite", () => {
  const baseline: Baseline = {
    takenOn: "2026-10-07",
    pages: {
      "/pricing/": {
        title: "t",
        h1: "h",
        canonical: "c",
        jsonLdTypes: ["FAQPage"],
        noindex: false,
      },
      "/old/": { title: "t", h1: "h", canonical: "c", jsonLdTypes: [], noindex: false },
    },
  };
  const base: SiteInput = {
    pages: [facts({ jsonLdTypes: ["FAQPage"] })],
    baseline,
    redirects: {},
    sitemapUrls: ["https://lettr.com/pricing/"],
    sitemapIgnore: [],
    llmsLinks: [],
    robotsTxt: "User-agent: *\nDisallow:\n\nSitemap: https://lettr.com/sitemap.xml\n",
    fileExists: () => false,
  };
  const rules = (override: Partial<SiteInput> = {}) =>
    checkSite({ ...base, ...override }).map((issue) => `${issue.rule} ${issue.url}`);

  it("loses no baseline URL: it must be built or redirected", () => {
    expect(rules()).toEqual(["baseline-url-lost /old/"]);
    expect(rules({ redirects: { "/old/": "/pricing/" } })).toEqual([]);
  });

  it("loses no structured data type or gains a noindex", () => {
    expect(
      rules({ redirects: { "/old/": "/pricing/" }, pages: [facts({ jsonLdTypes: [] })] }),
    ).toEqual(["structured-data-lost /pricing/"]);
    expect(
      rules({
        redirects: { "/old/": "/pricing/" },
        pages: [facts({ jsonLdTypes: ["FAQPage"], robots: "noindex" })],
      }),
    ).toContain("noindex-added /pricing/");
  });

  it("checks the sitemap both ways", () => {
    const redirects = { "/old/": "/pricing/" };
    expect(rules({ redirects, sitemapUrls: [] })).toEqual(["page-missing-from-sitemap /pricing/"]);
    expect(
      rules({ redirects, sitemapUrls: ["https://lettr.com/pricing/", "https://lettr.com/ghost/"] }),
    ).toEqual(["sitemap-url-without-page /ghost/"]);
  });

  it("checks the links in llms.txt", () => {
    const redirects = { "/old/": "/pricing/" };
    expect(rules({ redirects, llmsLinks: ["https://lettr.com/pricing"] })).toEqual([
      "llms-txt-link-without-slash llms.txt",
    ]);
    expect(rules({ redirects, llmsLinks: ["https://lettr.com/ghost/"] })).toEqual([
      "llms-txt-link-broken llms.txt",
    ]);
  });

  it("checks robots.txt and the redirect map", () => {
    const redirects = { "/old/": "/pricing/" };
    expect(rules({ redirects, robotsTxt: "User-agent: *\nDisallow: /\n" })).toEqual([
      "robots-txt robots.txt",
      "robots-txt robots.txt",
    ]);
    expect(rules({ redirects: { "/old/": "/nowhere/" } })).toEqual([
      "redirect-target-missing /old/",
    ]);
    expect(
      rules({ redirects: { "/old/": "/pricing/", "/pricing/": "/old/" } }).filter((rule) =>
        rule.startsWith("redirect-chain"),
      ),
    ).toHaveLength(2);
  });

  it("flags titles that two pages share", () => {
    const pages = [
      facts({ jsonLdTypes: ["FAQPage"] }),
      facts({ path: "/other/", jsonLdTypes: ["FAQPage"] }),
    ];
    expect(
      rules({
        redirects: { "/old/": "/pricing/" },
        pages,
        sitemapUrls: ["https://lettr.com/pricing/", "https://lettr.com/other/"],
      }),
    ).toEqual(["title-duplicate /pricing/", "title-duplicate /other/"]);
  });
});

describe("ratchet", () => {
  const issue = (rule: string, url: string) => ({ rule, url, detail: "" });

  it("records issues by rule", () => {
    expect(
      toKnown([issue("title-short", "/b/"), issue("title-short", "/a/"), issue("h1-count", "/a/")]),
    ).toEqual({
      "h1-count": ["/a/"],
      "title-short": ["/a/", "/b/"],
    });
  });

  it("fails on new issues, tolerates known ones and reports fixed ones", () => {
    const known = { "title-short": ["/a/", "/b/"] };
    const result = compare([issue("title-short", "/a/"), issue("title-short", "/c/")], known);
    expect(result.regressions).toEqual([issue("title-short", "/c/")]);
    expect(result.fixed).toEqual([{ rule: "title-short", url: "/b/" }]);
  });

  it("never tolerates a hard rule, even when it was recorded", () => {
    const known = { "baseline-url-lost": ["/old/"] };
    expect(compare([issue("baseline-url-lost", "/old/")], known).regressions).toHaveLength(1);
  });
});
