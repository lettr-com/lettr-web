/**
 * Blog article link behavior.
 *
 * Every link inside an article body opens in a new tab so readers keep their
 * place in the article. This is applied once, centrally, from `BlogPost.svelte`
 * rather than per `<a>` in each post, so it holds for every published article
 * and every future one without authors having to remember `target="_blank"`.
 *
 * In-page anchors (`#section`) and non-navigational schemes (`mailto:`, `tel:`,
 * `javascript:`) stay in the current tab; a new tab would be wrong for them.
 */

const SAME_TAB_SCHEMES = ["mailto:", "tel:", "javascript:"];

/** Whether a link with this `href` should open in a new tab. */
export function isNewTabLink(href: string | null | undefined): boolean {
  if (!href) return false;
  const value = href.trim();
  if (value === "" || value.startsWith("#")) return false;
  const lower = value.toLowerCase();
  return !SAME_TAB_SCHEMES.some((scheme) => lower.startsWith(scheme));
}

/** Merge `noopener noreferrer` into an existing `rel` value without duplicating tokens. */
export function withSafeRel(rel: string | null | undefined): string {
  const tokens = new Set((rel ?? "").split(/\s+/).filter(Boolean));
  tokens.add("noopener");
  tokens.add("noreferrer");
  return [...tokens].join(" ");
}

/**
 * Point every qualifying `<a>` under `root` at a new tab.
 * Safe to call more than once; it only adds attributes.
 */
export function openLinksInNewTab(root: ParentNode): void {
  for (const anchor of root.querySelectorAll<HTMLAnchorElement>("a[href]")) {
    if (!isNewTabLink(anchor.getAttribute("href"))) continue;
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", withSafeRel(anchor.getAttribute("rel")));
  }
}
