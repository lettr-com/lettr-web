/**
 * Blog article link behavior.
 *
 * Links that leave lettr.com (docs, the app, other sites) open in a new tab so
 * readers keep their place in the article. Links to other lettr.com pages stay
 * in the same tab: following one is the reader moving on through the site, and
 * a new tab would split their visit into separate sessions in analytics. This
 * is applied once, centrally, from `BlogPost.svelte`, so it holds for every
 * article without authors setting `target` by hand.
 *
 * In-page anchors (`#section`) and non-navigational schemes (`mailto:`, `tel:`,
 * `javascript:`) stay in the current tab; a new tab would be wrong for them.
 */

const SAME_TAB_SCHEMES = ["mailto:", "tel:", "javascript:"];
const SITE_HOSTS = new Set(["lettr.com", "www.lettr.com"]);

/** Whether a link with this `href` should open in a new tab. */
export function isNewTabLink(href: string | null | undefined): boolean {
  if (!href) return false;
  const value = href.trim();
  if (value === "" || value.startsWith("#")) return false;
  const lower = value.toLowerCase();
  if (SAME_TAB_SCHEMES.some((scheme) => lower.startsWith(scheme))) return false;
  if (!/^(https?:)?\/\//.test(lower)) return false;
  try {
    return !SITE_HOSTS.has(new URL(value, "https://lettr.com").hostname);
  } catch {
    return false;
  }
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
