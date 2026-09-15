/**
 * Inline renderer for changelog copy.
 *
 * Changelog entries are typed data, not markdown documents, so the only markup
 * they may carry is a backtick code span and a `[text](url)` link. Everything
 * else — including anything that looks like HTML — is escaped and rendered as
 * literal text. The output is handed to `{@html}` by the changelog components,
 * so escaping runs first and the whole thing is a single tokenising pass:
 * chaining `.replace()` calls (as the old prose formatter did) would let a link
 * inside a code span be rewritten into an anchor.
 */

import { escapeHtml } from "../utils/html";

/** Schemes an authored link may use. Anything else renders as plain text. */
const SAFE_HREF = /^(https?:\/\/|\/|#|mailto:)/;

/** A code span, or a link — whichever starts first wins. */
const INLINE = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;

function renderLink(label: string, href: string): string {
  if (!SAFE_HREF.test(href)) return label;

  if (href.startsWith("http")) {
    return (
      `<a href="${href}" target="_blank" rel="noopener noreferrer"` +
      ` class="changelog-link">${label}</a>`
    );
  }

  return `<a href="${href}" class="changelog-link">${label}</a>`;
}

export function renderInline(text: string): string {
  return escapeHtml(text).replace(INLINE, (match, code, label, href) => {
    if (typeof code === "string") return `<code class="changelog-code">${code}</code>`;
    if (typeof label === "string" && typeof href === "string") return renderLink(label, href);
    return match;
  });
}

/**
 * The same copy with its markup removed rather than rendered: code spans keep
 * their text, links keep their label. For places that carry no HTML at all —
 * meta descriptions, the llms.txt index, feed summaries.
 */
export function renderPlain(text: string): string {
  return text.replace(INLINE, (match, code, label) => {
    if (typeof code === "string") return code;
    if (typeof label === "string") return label;
    return match;
  });
}
