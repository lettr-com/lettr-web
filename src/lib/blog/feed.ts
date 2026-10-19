import { escapeHtml } from "../utils/html.ts";
import { SITE_URL } from "../utils/jsonLd.ts";
import type { PostMeta } from "../data/posts.ts";

export const BLOG_URL = `${SITE_URL}/blog/`;
export const BLOG_FEED_URL = `${BLOG_URL}feed.xml`;
export const BLOG_NAME = "Lettr Blog";

/** "September 18, 2026" as "2026-09-18". */
export function isoDate(date: string): string {
  const parsed = new Date(`${date} 00:00:00 UTC`);
  if (Number.isNaN(parsed.getTime())) throw new Error(`Unreadable post date: "${date}"`);
  return parsed.toISOString().slice(0, 10);
}

export function postUrl(slug: string): string {
  return `${BLOG_URL}${slug}/`;
}

/** An Atom feed of the posts, newest first as given. */
export function blogAtom(posts: readonly PostMeta[]): string {
  const dates = posts.map((post) => isoDate(post.date));
  const updated = [...dates].sort().at(-1) ?? "1970-01-01";
  const entries = posts.map((post, index) => {
    const url = postUrl(post.slug);
    return `  <entry>
    <id>${url}</id>
    <title>${escapeHtml(post.title)}</title>
    <link rel="alternate" type="text/html" href="${url}"/>
    <published>${dates[index]}T00:00:00Z</published>
    <updated>${dates[index]}T00:00:00Z</updated>
    <author><name>${escapeHtml(post.author)}</name></author>
    <category term="${escapeHtml(post.category)}"/>
    <summary>${escapeHtml(post.excerpt)}</summary>
  </entry>`;
  });
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${BLOG_URL}</id>
  <title>${BLOG_NAME}</title>
  <subtitle>Guides on email deliverability, transactional email and email infrastructure engineering.</subtitle>
  <link rel="self" type="application/atom+xml" href="${BLOG_FEED_URL}"/>
  <link rel="alternate" type="text/html" href="${BLOG_URL}"/>
  <updated>${updated}T00:00:00Z</updated>
${entries.join("\n")}
</feed>
`;
}
