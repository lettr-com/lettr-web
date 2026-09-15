import { describe, expect, it } from "vite-plus/test";
import { MONTHS, loadMonth } from "./months";
import {
  CHANGELOG_URL,
  FEED_URL,
  INDEX_DESCRIPTION,
  INDEX_TITLE,
  changelogAtom,
  changelogLlmsTxt,
  entryAnchor,
  entryUrl,
  formatDate,
  indexJsonLd,
  monthDescription,
  monthFeedHtml,
  monthJsonLd,
  monthTitle,
  monthUrl,
} from "./seo";
import type { ChangelogEntry, ChangelogMonth } from "./types";

const entry = (title: string, lead = "Lead."): ChangelogEntry => ({
  title,
  modules: ["platform"],
  tags: ["API"],
  lead,
});

const month: ChangelogMonth = {
  id: "2026-08",
  published: "2026-08-31",
  features: [entry("Bulk Contact Import Over The API", "One call imports a `batch` of contacts.")],
  improvements: [
    entry("Repeat DNS Alerts Back Off", "See [alerts](https://docs.lettr.com/alerts)."),
  ],
  bugfixes: [{ modules: ["platform"], text: "Fixed `status` toasts never firing." }],
};

describe("urls and anchors", () => {
  it("builds trailing-slash month urls under the changelog", () => {
    expect(monthUrl("2026-08")).toBe(`${CHANGELOG_URL}2026-08/`);
  });

  it("scopes an entry anchor to its month, like section anchors", () => {
    expect(entryAnchor(month, month.features[0])).toBe("2026-08-bulk-contact-import-over-the-api");
    expect(entryUrl(month, month.features[0])).toBe(
      "https://lettr.com/changelog/2026-08/#2026-08-bulk-contact-import-over-the-api",
    );
  });
});

describe("titles and descriptions", () => {
  it("keeps the index and month titles within 60 characters", () => {
    expect(INDEX_TITLE.length).toBeLessThanOrEqual(60);
    expect(monthTitle({ id: "2026-09" })).toBe("September 2026 Changelog: What's New in Lettr");
    expect(monthTitle({ id: "2026-09" }).length).toBeLessThanOrEqual(60);
  });

  it("names the headline features when they fit, with ordinary spaces", () => {
    const description = monthDescription(month);
    expect(description).toBe(
      "Everything Lettr shipped in August 2026: 1 new feature, 1 improvement and 1 bugfix, including Bulk Contact Import Over The API.",
    );
    expect(description).not.toContain(" ");
  });

  it("drops feature names that would push the description past 160 characters", () => {
    const long: ChangelogMonth = {
      ...month,
      features: [entry("A".repeat(40)), entry("B".repeat(40))],
    };
    const description = monthDescription(long);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description).toContain("A".repeat(40));
    expect(description).not.toContain("B".repeat(40));
  });

  it("falls back to the counts alone when no feature name fits", () => {
    const long: ChangelogMonth = { ...month, features: [entry("A".repeat(200))] };
    expect(monthDescription(long)).toBe(
      "Everything Lettr shipped in August 2026: 1 new feature, 1 improvement and 1 bugfix.",
    );
  });

  it("formats a published date for reading", () => {
    expect(formatDate("2026-08-31")).toBe("August 31, 2026");
  });
});

describe("indexJsonLd", () => {
  const graph = indexJsonLd(month)["@graph"] as Record<string, unknown>[];
  const byType = (type: string) => graph.find((node) => node["@type"] === type)!;

  it("describes a collection page dated by the newest month", () => {
    expect(byType("CollectionPage")).toMatchObject({
      "@id": CHANGELOG_URL,
      description: INDEX_DESCRIPTION,
      dateModified: "2026-08-31",
      mainEntity: { "@id": `${CHANGELOG_URL}#months` },
    });
  });

  it("lists every registered month as a page", () => {
    const list = byType("ItemList") as { itemListElement: { url: string }[] };
    expect(list.itemListElement.map((item) => item.url)).toEqual(MONTHS.map(monthUrl));
  });

  it("carries breadcrumb, site, organization and software nodes", () => {
    for (const type of ["BreadcrumbList", "WebSite", "Organization", "SoftwareApplication"]) {
      expect(byType(type)).toBeDefined();
    }
  });
});

describe("monthJsonLd", () => {
  const graph = monthJsonLd(month)["@graph"] as Record<string, unknown>[];
  const byType = (type: string) => graph.find((node) => node["@type"] === type)!;

  it("dates the article and points it at the page", () => {
    expect(byType("TechArticle")).toMatchObject({
      headline: "Lettr changelog: August 2026",
      datePublished: "2026-08-31",
      mainEntityOfPage: { "@id": monthUrl("2026-08") },
      about: { "@id": "https://lettr.com/#software" },
    });
    expect(byType("WebPage")).toMatchObject({
      mainEntity: { "@id": `${monthUrl("2026-08")}#article` },
    });
  });

  it("lists every entry with plain-text copy and an anchor url", () => {
    const list = byType("ItemList") as {
      numberOfItems: number;
      itemListElement: { name: string; url: string; description?: string }[];
    };
    expect(list.numberOfItems).toBe(3);
    expect(list.itemListElement[0]).toMatchObject({
      name: "Bulk Contact Import Over The API",
      url: entryUrl(month, month.features[0]),
      description: "One call imports a batch of contacts.",
    });
    expect(list.itemListElement[2]).toMatchObject({
      name: "Fixed status toasts never firing.",
      url: `${monthUrl("2026-08")}#2026-08-bugfixes`,
    });
  });

  it("breadcrumbs home, changelog, month", () => {
    const crumbs = byType("BreadcrumbList") as { itemListElement: { name: string }[] };
    expect(crumbs.itemListElement.map((item) => item.name)).toEqual([
      "Home",
      "Changelog",
      "August 2026",
    ]);
  });
});

describe("changelogLlmsTxt", () => {
  const text = changelogLlmsTxt([month]);

  it("opens with the title, a blockquote summary and the feed link", () => {
    expect(text.startsWith("# Lettr Changelog\n\n> 3 changes shipped to Lettr")).toBe(true);
    expect(text).toContain(FEED_URL);
  });

  it("lists each entry as a link with its tags and plain-text lead", () => {
    expect(text).toContain(
      "## August 2026\n\nPublished 2026-08-31. Full notes: https://lettr.com/changelog/2026-08/",
    );
    expect(text).toContain(
      "- [Bulk Contact Import Over The API](https://lettr.com/changelog/2026-08/#2026-08-bulk-contact-import-over-the-api) (platform, API): One call imports a batch of contacts.",
    );
    expect(text).toContain("(platform, API): See alerts.");
    expect(text).toContain("### Bugfixes\n\n- (platform) Fixed status toasts never firing.");
  });
});

describe("changelogAtom", () => {
  const xml = changelogAtom([month]);

  it("is an Atom feed with one entry per month", () => {
    expect(
      xml.startsWith(
        '<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">',
      ),
    ).toBe(true);
    expect(xml).toContain(`<link rel="self" type="application/atom+xml" href="${FEED_URL}"/>`);
    expect(xml).toContain("<updated>2026-08-31T00:00:00Z</updated>");
    expect(xml.match(/<entry>/g)).toHaveLength(1);
    expect(xml).toContain("<title>Lettr changelog: August 2026</title>");
  });

  it("escapes the html content so the entry markup cannot break the xml", () => {
    expect(xml).toContain("&lt;h2&gt;New features&lt;/h2&gt;");
    expect(xml).not.toMatch(/<content type="html">[^&]*<h2>/);
  });

  it("renders inline markup inside the feed html", () => {
    const html = monthFeedHtml(month);
    expect(html).toContain('<code class="changelog-code">batch</code>');
    expect(html).toContain('<a href="https://docs.lettr.com/alerts"');
    expect(html).toContain("<h2>Bugfixes</h2><ul><li>");
  });
});

describe("registered months", () => {
  it("give every entry a unique anchor within its month", async () => {
    for (const id of MONTHS) {
      const data = await loadMonth(id);
      const anchors = [...data.features, ...data.improvements].map((item) =>
        entryAnchor(data, item),
      );
      expect(new Set(anchors).size, id).toBe(anchors.length);
      for (const anchor of anchors) expect(anchor, id).toMatch(/^\d{4}-\d{2}-[a-z0-9-]+$/);
    }
  });

  it("keep every generated title and description within the snippet limits", async () => {
    for (const id of MONTHS) {
      const data = await loadMonth(id);
      expect(monthTitle(data).length, id).toBeLessThanOrEqual(60);
      expect(monthDescription(data).length, id).toBeLessThanOrEqual(160);
    }
  });
});
