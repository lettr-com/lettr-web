import { capturePosthogEvent } from "$lib/analytics/posthog";

/**
 * Delegated click handler for the changelog. Attached once to the feed
 * container and once to a month page's container, so months loaded later by
 * the infinite scroll are instrumented without wiring anything per entry.
 *
 * Context comes from the DOM: `data-entry-title` on each entry `<article>` and
 * each bugfix `<li>`, `data-month` on each month wrapper.
 */
export function trackChangelogLinkClick(event: MouseEvent): void {
  const anchor = (event.target as HTMLElement | null)?.closest("a");
  if (!anchor) return;

  const href = anchor.getAttribute("href") ?? "";
  if (!href) return;

  void capturePosthogEvent("changelog_link_clicked", {
    href,
    label: anchor.textContent?.trim() ?? "",
    entry_title: anchor.closest("[data-entry-title]")?.getAttribute("data-entry-title") ?? null,
    month: anchor.closest("[data-month]")?.getAttribute("data-month") ?? null,
    is_external: /^https?:\/\//.test(href),
  });
}

/**
 * Fired when a reader changes the badge filter, with the selection as it stands
 * afterwards. Called from the toggle handler rather than from an effect, so a
 * filter restored from a shared link is not reported as someone's choice.
 */
export function trackChangelogFilterChange(tokens: readonly string[]): void {
  void capturePosthogEvent("changelog_filter_changed", {
    filter: tokens.join(","),
    filter_count: tokens.length,
  });
}
