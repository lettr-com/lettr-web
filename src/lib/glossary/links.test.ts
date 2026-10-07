import { readdirSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

import { linksForTerm, placedTerms } from "./links";

const slugs = readdirSync(new URL("./terms", import.meta.url))
  .filter((file) => file.endsWith(".md"))
  .map((file) => file.slice(0, -".md".length));

describe("glossary links", () => {
  it("places every term under a topic, so none is an island", () => {
    const missing = slugs.filter((slug) => !linksForTerm(slug));
    expect(
      missing,
      `place these terms in src/lib/glossary/links.ts: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("lists no term that does not exist", () => {
    expect(placedTerms().filter((slug) => !slugs.includes(slug))).toEqual([]);
  });

  it("leads each term into a product page and a blog post", () => {
    const dkim = linksForTerm("dkim");
    expect(dkim?.product.href).toBe("/platform/deliverability/");
    expect(dkim?.post.href).toMatch(/^\/blog\/[a-z0-9-]+\/$/);
    expect(linksForTerm("smtp-relay")?.product.href).toBe("/smtp-relay/");
  });
});
