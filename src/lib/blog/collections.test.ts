import { describe, expect, it } from "vite-plus/test";
import { posts } from "$lib/data/posts";
import { endCtaFor, readMinutes, showsContents } from "./article";
import { deliverabilityPath, mostReadSlugs, postsBySlug, readNextFor } from "./collections";

describe("blog collections", () => {
  it("only names posts that exist", () => {
    expect(postsBySlug(mostReadSlugs)).toHaveLength(mostReadSlugs.length);
    expect(postsBySlug(deliverabilityPath.slugs)).toHaveLength(deliverabilityPath.slugs.length);
  });

  it("refuses an unknown slug", () => {
    expect(() => postsBySlug(["no-such-post"])).toThrow("no-such-post");
  });
});

describe("article helpers", () => {
  it("reads the minutes out of a read time", () => {
    expect(readMinutes("11 min read")).toBe(11);
    expect(readMinutes("")).toBe(0);
  });

  it("shows contents on posts with enough sections to navigate", () => {
    expect(showsContents(4)).toBe(true);
    expect(showsContents(11)).toBe(true);
    expect(showsContents(3)).toBe(false);
  });

  it("ends comparison posts on pricing and other posts on their product", () => {
    expect(endCtaFor("mailgun-alternatives")?.kind).toBe("compare");
    expect(endCtaFor("mcp-api-key-scopes")?.kind).toBe("product");
  });

  it("has an end block for every post", () => {
    for (const post of posts) expect(endCtaFor(post.slug), post.slug).toBeDefined();
  });
});

describe("readNextFor", () => {
  it("leads with the next step of a reading path", () => {
    const next = readNextFor("spf-dkim-dmarc-explained-for-developers");
    expect(next[0].slug).toBe("how-to-warm-up-a-sending-domain");
    expect(next).toHaveLength(2);
  });

  it("falls back to related posts and never repeats the current one", () => {
    const next = readNextFor("mcp-api-key-scopes");
    expect(next).toHaveLength(2);
    expect(next.map((post) => post.slug)).not.toContain("mcp-api-key-scopes");
  });
});
