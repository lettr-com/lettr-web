import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

import { posts } from "../data/posts";
import { postLinks } from "./links";

const termsDir = new URL("../glossary/terms/", import.meta.url);
const termNames = new Map(
  readdirSync(termsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = readFileSync(new URL(file, termsDir), "utf8");
      return [
        file.slice(0, -3),
        /^term:\s*(.+)$/m.exec(raw)?.[1].replace(/^["']|["']$/g, ""),
      ] as const;
    }),
);

describe("blog post links", () => {
  it("covers every post", () => {
    expect(posts.map((post) => post.slug).filter((slug) => !(slug in postLinks))).toEqual([]);
    expect(
      Object.keys(postLinks).filter((slug) => !posts.some((post) => post.slug === slug)),
    ).toEqual([]);
  });

  it("gives every post at least two glossary terms and a product page", () => {
    for (const [slug, links] of Object.entries(postLinks)) {
      expect(links.terms.length, slug).toBeGreaterThanOrEqual(2);
      expect(links.product.href, slug).toMatch(/^\/[a-z0-9-]+(\/[a-z0-9-]+)*\/$/);
    }
  });

  it("names each term the way the glossary does", () => {
    for (const [slug, links] of Object.entries(postLinks)) {
      for (const { slug: term, label } of links.terms) {
        expect(termNames.has(term), `${slug}: no glossary term "${term}"`).toBe(true);
        expect(label, `${slug}: ${term}`).toBe(termNames.get(term));
      }
    }
  });
});
