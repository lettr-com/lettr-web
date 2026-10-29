import { getRelatedPosts, posts, type PostMeta } from "$lib/data/posts";

/**
 * Most-read posts, from PostHog (Lettr Main, `lettr.com/blog/*`, 2026-07-31 to
 * 2026-10-29, consenting visitors, with the 1024x768 headless-browser traffic
 * excluded). Refresh by hand each quarter; the index labels the list "this
 * quarter", so a stale list is a visible bug.
 */
export const mostReadSlugs = [
  "why-we-built-lettr-on-laravel",
  "best-transactional-email-services",
  "email-attachment-size-limits",
];

/** A reading path: posts in the order we'd hand them to someone new to the topic. */
export interface Collection {
  title: string;
  description: string;
  slugs: string[];
  /** Where the path hands the reader over to the product once they've read it. */
  next: { href: string; label: string };
}

export const deliverabilityPath: Collection = {
  title: "Reach the inbox, in four reads",
  description: "The order we'd hand a new engineer setting up a sending domain.",
  slugs: [
    "spf-dkim-dmarc-explained-for-developers",
    "how-to-warm-up-a-sending-domain",
    "separate-transactional-and-marketing-email",
    "email-deliverability-checklist",
  ],
  next: { href: "/platform/deliverability/", label: "See how Lettr sets up SPF, DKIM and DMARC" },
};

export function postsBySlug(slugs: readonly string[]): PostMeta[] {
  return slugs.map((slug) => {
    const post = posts.find((candidate) => candidate.slug === slug);
    if (!post) throw new Error(`Unknown blog post: ${slug}`);
    return post;
  });
}

/**
 * What to read after a post: the next step of its reading path when it has
 * one, then posts from the same category, newest first.
 */
export function readNextFor(slug: string, limit = 2): PostMeta[] {
  const picks: PostMeta[] = [];
  const step = deliverabilityPath.slugs.indexOf(slug);
  if (step !== -1 && step < deliverabilityPath.slugs.length - 1) {
    picks.push(...postsBySlug([deliverabilityPath.slugs[step + 1]]));
  }
  for (const post of getRelatedPosts(slug, limit + 1)) {
    if (picks.length >= limit) break;
    if (!picks.some((pick) => pick.slug === post.slug)) picks.push(post);
  }
  return picks;
}
