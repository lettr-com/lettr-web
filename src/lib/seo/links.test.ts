import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

import { posts } from "../data/posts";
import { setupLinks } from "./links";

const termSlugs = new Set(
  readdirSync(new URL("../glossary/terms/", import.meta.url)).map((file) =>
    file.slice(0, -".md".length),
  ),
);
const postSlugs = new Set(posts.map((post) => post.slug));
// /compare/[provider] pages come from providers.ts; the "alternatives" pages are routes of their own
const compareSlugs = new Set([
  ...[
    ...readFileSync(new URL("../data/providers.ts", import.meta.url), "utf8").matchAll(
      /slug:\s*"([^"]+)"/g,
    ),
  ].map((match) => match[1]),
  ...readdirSync(new URL("../../routes/compare/", import.meta.url)).filter((name) =>
    /^[a-z0-9-]+$/.test(name),
  ),
]);

describe("product page links", () => {
  const all = Object.entries(setupLinks).flatMap(([path, links]) =>
    links.map((link) => ({ path, ...link })),
  );

  it("points every on-site link at a post, term or comparison that exists", () => {
    for (const { path, href } of all) {
      const [, section, slug] = href.match(/^\/(blog|glossary|compare)\/([a-z0-9-]+)\/$/) ?? [];
      if (!section) continue;
      const known =
        section === "blog" ? postSlugs : section === "glossary" ? termSlugs : compareSlugs;
      expect(known.has(slug), `${path} links to ${href}`).toBe(true);
    }
  });

  it("gives the five core product pages a docs link and a comparison", () => {
    for (const path of [
      "/email-api/",
      "/free-email-api/",
      "/smtp-relay/",
      "/inbound-email-api/",
      "/email-marketing/",
    ]) {
      const hrefs = setupLinks[path].map((link) => link.href);
      expect(
        hrefs.some((href) => href.startsWith("https://docs.lettr.com/")),
        path,
      ).toBe(true);
      expect(
        hrefs.some((href) => href.startsWith("/compare/")),
        path,
      ).toBe(true);
    }
  });

  it("uses no link twice on a page", () => {
    for (const [path, links] of Object.entries(setupLinks)) {
      const hrefs = links.map((link) => link.href);
      expect(new Set(hrefs).size, path).toBe(hrefs.length);
    }
  });
});
