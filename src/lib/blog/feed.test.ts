import { describe, expect, it } from "vite-plus/test";

import type { PostMeta } from "../data/posts";
import { posts } from "../data/posts";
import { blogAtom, isoDate, postUrl } from "./feed";

const post: PostMeta = {
  slug: "smtp-relay",
  category: "Fundamentals",
  title: "SMTP & relays <explained>",
  excerpt: "What an SMTP relay does.",
  author: "Jack Zagorski",
  date: "September 18, 2026",
  readTime: "5 min read",
};

describe("blog feed", () => {
  it("reads the human dates of posts.ts", () => {
    expect(isoDate("September 18, 2026")).toBe("2026-09-18");
    expect(isoDate("March 5, 2026")).toBe("2026-03-05");
    expect(() => isoDate("someday")).toThrow(/Unreadable/);
  });

  it("builds an Atom feed with escaped text and trailing-slash links", () => {
    const xml = blogAtom([post]);
    expect(xml).toContain("<id>https://lettr.com/blog/smtp-relay/</id>");
    expect(xml).toContain("<title>SMTP &amp; relays &lt;explained&gt;</title>");
    expect(xml).toContain(
      '<link rel="self" type="application/atom+xml" href="https://lettr.com/blog/feed.xml"/>',
    );
    expect(xml).toContain("<updated>2026-09-18T00:00:00Z</updated>");
  });

  it("takes the feed's updated date from the newest post, whatever the order", () => {
    const older = { ...post, slug: "older", date: "March 5, 2026" };
    expect(blogAtom([older, post])).toMatch(
      /<\/subtitle>[\s\S]*<updated>2026-09-18T00:00:00Z<\/updated>/,
    );
  });

  it("covers every post in posts.ts with a readable date", () => {
    const xml = blogAtom(posts);
    expect(xml.match(/<entry>/g)).toHaveLength(posts.length);
    for (const entry of posts) expect(xml).toContain(postUrl(entry.slug));
  });
});
