import { getContext, setContext } from "svelte";
import { postLinks } from "$lib/blog/links";
import type { PostMeta } from "$lib/data/posts";

const key = Symbol("blog-article");

/** Shared with the components inside a post, so they need no props to know which post they're in. */
export function setArticle(post: PostMeta): void {
  setContext(key, post);
}

export function getArticle(): PostMeta | undefined {
  return getContext<PostMeta | undefined>(key);
}

/** "5 min read" -> 5. */
export function readMinutes(readTime: string): number {
  return Number.parseInt(readTime, 10) || 0;
}

/**
 * Contents navigation needs enough sections to navigate between. (PostHog
 * showed little use of the old sidebar, which is why it is a slim rail rather
 * than a list; it still shows on every post that has real structure.)
 */
export function showsContents(sections: number): boolean {
  return sections >= 4;
}

/** Where the post body sits, in viewport pixels, when reading progress is measured. */
export interface BodyGeometry {
  top: number;
  height: number;
  /** Height of the body's first line. */
  firstLine: number;
  /** Bottom of the fixed header: text above it is out of view. */
  topEdge: number;
  viewportHeight: number;
}

/**
 * 0..1 through the post body. Stays at 0 until the first line has scrolled
 * out of view under the header, and reaches 1 when the end of the body is on
 * screen.
 */
export function readProgress({
  top,
  height,
  firstLine,
  topEdge,
  viewportHeight,
}: BodyGeometry): number {
  const start = topEdge - firstLine;
  const end = viewportHeight - height;
  if (start <= end) return top <= start ? 1 : 0;
  return Math.min(1, Math.max(0, (start - top) / (start - end)));
}

export type EndCta =
  | { kind: "compare"; compare: { href: string; label: string; description: string } }
  | { kind: "product"; product: { href: string; label: string; description: string } };

/**
 * What the end of a post offers. Comparison posts point at pricing, because
 * across the blog Pricing is the most-clicked link after the logo; every other
 * post points at the product it makes the case for.
 */
export function endCtaFor(slug: string): EndCta | undefined {
  const links = postLinks[slug];
  if (!links) return undefined;
  if (links.compare) return { kind: "compare", compare: links.compare };
  return { kind: "product", product: links.product };
}
