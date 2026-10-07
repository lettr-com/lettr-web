import { describe, expect, it } from "vite-plus/test";

import { posts } from "../data/posts";
import { buildSitemap, isIndexable, lastmodByPath } from "./sitemap";

describe("buildSitemap", () => {
  it("lists trailing-slash URLs, sorted, with a date only where there is one", () => {
    const xml = buildSitemap([
      { path: "/pricing/" },
      { path: "/", lastmod: undefined },
      { path: "/blog/post/", lastmod: "2026-09-18" },
    ]);
    expect(xml).toContain("<loc>https://lettr.com/</loc>\n  </url>");
    expect(xml).toContain(
      "<loc>https://lettr.com/blog/post/</loc>\n    <lastmod>2026-09-18</lastmod>",
    );
    expect(xml.indexOf("https://lettr.com/</loc>")).toBeLessThan(xml.indexOf("/blog/post/"));
    expect(xml.indexOf("/blog/post/")).toBeLessThan(xml.indexOf("/pricing/"));
  });

  it("does not carry changefreq or priority, which Google ignores", () => {
    expect(buildSitemap([{ path: "/", lastmod: "2026-10-01" }])).not.toMatch(/changefreq|priority/);
  });
});

describe("isIndexable", () => {
  it("keeps real pages and drops redirect stubs and noindex pages", () => {
    expect(isIndexable("<html><body><main>x</main></body></html>")).toBe(true);
    expect(
      isIndexable('<html><head><meta http-equiv="refresh" content="0; url=/demo/"></head></html>'),
    ).toBe(false);
    expect(
      isIndexable(
        '<html><head><meta name="robots" content="noindex, follow"></head><body><main>x</main></body></html>',
      ),
    ).toBe(false);
    expect(
      isIndexable(
        '<html><head><meta name="robots" content="index, follow"></head><body><main>x</main></body></html>',
      ),
    ).toBe(true);
  });
});

describe("lastmodByPath", () => {
  it("dates posts by publication, glossary terms by last update, and the two indexes by the newest", async () => {
    const dates = await lastmodByPath();
    expect(dates.get(`/blog/${posts[0].slug}/`)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(dates.get("/glossary/dkim/")).toBe("2026-09-14");
    expect(dates.get("/glossary/")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(dates.has("/pricing/")).toBe(false);
  });
});
