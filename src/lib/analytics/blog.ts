import { capturePosthogEvent, trackSignupClick } from "$lib/analytics/posthog";

/**
 * Blog reading events. Everything goes through the consent-gated PostHog
 * client, so the counts are lower bounds. Signup clicks reuse the site-wide
 * `signup_clicked` event with a blog placement instead of a blog-only event,
 * so the signup funnel has one source of truth.
 */

export interface BlogArticleContext {
  slug: string;
  category: string;
}

/** Where on the article a tracked link or block sits. */
export type BlogPlacement =
  | "blog_body"
  | "blog_product_note"
  | "blog_end_cta"
  | "blog_read_next"
  | "blog_contents_rail"
  | "blog_contents_panel"
  | "blog_contents_mobile";

export const readDepths = [25, 50, 75, 100] as const;

export type ReadDepth = (typeof readDepths)[number];

/** The depths a reader has newly reached, given how far they had got before. */
export function newDepths(previous: number, current: number): ReadDepth[] {
  return readDepths.filter((depth) => depth > previous && depth <= current);
}

export function trackArticleViewed(article: BlogArticleContext, readMinutes: number): void {
  void capturePosthogEvent("blog_article_viewed", { ...article, read_minutes: readMinutes });
}

export function trackReadProgress(article: BlogArticleContext, depth: ReadDepth): void {
  void capturePosthogEvent("blog_read_progress", { ...article, depth });
}

export function trackContentsClicked(
  article: BlogArticleContext,
  section: string,
  placement: BlogPlacement,
): void {
  void capturePosthogEvent("blog_toc_clicked", { ...article, section, placement });
}

export function trackCtaViewed(
  article: BlogArticleContext,
  cta: string,
  placement: BlogPlacement,
): void {
  void capturePosthogEvent("blog_cta_viewed", { ...article, cta, placement });
}

export type BlogLinkKind = "signup" | "docs" | "article" | "product" | "external";

/** Classifies a link clicked inside an article. */
export function classifyBlogLink(href: string): BlogLinkKind {
  let url: URL;
  try {
    url = new URL(href, "https://lettr.com");
  } catch {
    return "external";
  }
  if (url.hostname === "app.lettr.com" && url.pathname.startsWith("/register")) return "signup";
  if (url.hostname === "docs.lettr.com") return "docs";
  if (url.hostname !== "lettr.com" && url.hostname !== "www.lettr.com") return "external";
  if (/^\/blog\/[^/]+\/?$/.test(url.pathname)) return "article";
  return "product";
}

/** Records a click on a link inside an article, under the event that fits its target. */
export function trackArticleLink(
  article: BlogArticleContext,
  href: string,
  placement: BlogPlacement,
): void {
  const kind = classifyBlogLink(href);
  const properties = { ...article, href, placement };
  switch (kind) {
    case "signup":
      trackSignupClick(placement, href, { ...article });
      break;
    case "docs":
      void capturePosthogEvent("blog_docs_clicked", properties);
      break;
    case "article":
      void capturePosthogEvent("blog_related_clicked", properties);
      break;
    case "product":
      void capturePosthogEvent("blog_cta_clicked", properties);
      break;
    case "external":
      break;
  }
}
