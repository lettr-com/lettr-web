/**
 * Scroll-spy active-heading resolution.
 *
 * Extracted from the table-of-contents component so the decision logic is
 * unit-testable in isolation from the DOM and the IntersectionObserver.
 *
 * Two systems write the active heading: a click handler (sets it once, when the
 * reader clicks a TOC link) and an IntersectionObserver (recomputes from live
 * geometry as the page scrolls). During a smooth scroll the observer fires many
 * times; without coordination it overwrites the clicked target with every
 * heading the scroll passes through, so the indicator stutters down the list
 * instead of staying on the clicked item. The `pinnedId` argument expresses the
 * click's intent and suppresses those intermediate writes until the scroll
 * arrives. See [[resolveActiveId]] for the exact rule.
 */

/** One observed heading's vertical position, in viewport (client) pixels. */
export interface HeadingPosition {
  id: string;
  /** `getBoundingClientRect().top` for the heading element. */
  top: number;
}

export interface ResolveActiveOptions {
  /** Distance from the top of the viewport where a heading counts as "passed". */
  bandTop?: number;
  /** Viewport height; the active band extends to `bandFraction * viewportHeight`. */
  viewportHeight: number;
  /** Fraction of the viewport height that forms the active band. */
  bandFraction?: number;
  /**
   * The heading a click is currently scrolling toward, or `null` when no
   * click-scroll is in flight. While set, it pins the result so the observer
   * cannot overwrite the clicked target mid-scroll — until the scroll has
   * actually reached it (see {@link hasReachedPinned}).
   */
  pinnedId?: string | null;
}

/**
 * Decide which heading should be marked active.
 *
 * Pure: callers pass a geometry snapshot; this returns the id to light up. The
 * geometry rule (unchanged from the original component): the topmost heading
 * sitting inside the band near the top of the viewport wins; if none are in the
 * band, the most recently passed heading (the section being read) stays lit.
 *
 * The pinning rule (the fix): when `pinnedId` is set and the pinned heading has
 * not yet reached the band, return `pinnedId` regardless of geometry. This is
 * what keeps the indicator on the clicked item for the whole smooth scroll.
 */
export function resolveActiveId(
  positions: HeadingPosition[],
  options: ResolveActiveOptions,
): string | null {
  if (positions.length === 0) return options.pinnedId ?? null;

  const bandTop = options.bandTop ?? 120;
  const bandFraction = options.bandFraction ?? 0.34;
  const bandBottom = options.viewportHeight * bandFraction;

  // While a click-scroll is in flight, hold the clicked target until the scroll
  // actually arrives — otherwise the observer walks the indicator through every
  // heading the scroll passes over.
  if (options.pinnedId != null && !hasReachedPinned(positions, options)) {
    return options.pinnedId;
  }

  const inBand = positions
    .filter((p) => p.top >= 0 && p.top <= bandBottom)
    .sort((a, b) => a.top - b.top);

  if (inBand.length > 0) {
    // Topmost heading inside the band wins.
    return inBand[0].id;
  }

  // Nothing in the band: keep the most recently passed heading lit (the section
  // being read). Falls back to the first heading at the very top of the page.
  let lastPassedId = positions[0].id;
  for (const p of positions) {
    if (p.top <= bandTop) lastPassedId = p.id;
  }
  return lastPassedId;
}

/**
 * Has the pinned heading settled into the active band — i.e. has the click-scroll
 * arrived?
 *
 * Used both to decide when to release the pin and to gate {@link resolveActiveId}.
 * "Reached" means the heading's top is now inside the band (`0 <= top <= bandBottom`),
 * where it comes to rest at the end of the scroll. The lower bound matters for
 * directional symmetry: a one-sided `top <= bandBottom` test also matches headings
 * scrolled *above* the viewport, which would release the pin instantly on an
 * upward click-scroll and let the observer walk the indicator down through every
 * heading the scroll passes. Requiring the target to be in the band holds the pin
 * equally for up- and down-scrolls; the caller's safety timeout covers the rare
 * short-section case where a heading never rises to `top >= 0`. A pinned id not
 * present in `positions` counts as reached (nothing to wait for).
 */
export function hasReachedPinned(
  positions: HeadingPosition[],
  options: Pick<ResolveActiveOptions, "pinnedId" | "viewportHeight" | "bandFraction">,
): boolean {
  if (options.pinnedId == null) return true;
  const target = positions.find((p) => p.id === options.pinnedId);
  if (!target) return true;
  const bandBottom = options.viewportHeight * (options.bandFraction ?? 0.34);
  return target.top >= 0 && target.top <= bandBottom;
}
