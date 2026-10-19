/**
 * Visibility rules and copy for the Contact sales strip under the main bar.
 *
 * The strip is a reward for reading, not an interruption: it appears once the
 * visitor has read about 30% of the page, and only after at least one full
 * screen of scrolling so a short page never flashes it on the first flick.
 * Two thresholds (show at 30%, hide below 20%) give it hysteresis, so jitter
 * around the threshold cannot make it flicker.
 */

export const SHOW_AT = 0.3;
export const HIDE_BELOW = 0.2;
/** Pages shorter than this many viewports never show the strip. */
export const MIN_PAGE_SCREENS = 2;

export interface ScrollSnapshot {
  scrollY: number;
  scrollHeight: number;
  viewportHeight: number;
}

export interface SalesPrompt {
  question: string;
  answer: string;
  /** Short form for narrow screens. */
  short: string;
}

/** Fraction of the scrollable distance already read, clamped to 0..1. */
export function readProgress({ scrollY, scrollHeight, viewportHeight }: ScrollSnapshot): number {
  const scrollable = scrollHeight - viewportHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / scrollable));
}

/** Decide the next visibility from the current one and a scroll snapshot. */
export function nextStripVisibility(visible: boolean, snapshot: ScrollSnapshot): boolean {
  if (snapshot.scrollHeight < snapshot.viewportHeight * MIN_PAGE_SCREENS) return false;

  const progress = readProgress(snapshot);
  if (visible) return progress >= HIDE_BELOW;
  return progress >= SHOW_AT && snapshot.scrollY >= snapshot.viewportHeight;
}

const hiddenPaths = [
  "/demo/",
  "/privacy-policy/",
  "/terms/",
  "/terms-15-02-2026/",
  "/accessibility-statement/",
];

function normalize(pathname: string): string {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/** The strip is pointless on the booking page itself and noise on legal pages. */
export function isStripAllowed(pathname: string): boolean {
  return !hiddenPaths.includes(normalize(pathname));
}

const defaultPrompt: SalesPrompt = {
  question: "Moving your product email to Lettr?",
  answer: "We'll help you plan the switch.",
  short: "Planning a switch to Lettr?",
};

/** Contextual question for the current page. Every variant leads to /demo/. */
export function salesPromptFor(pathname: string): SalesPrompt {
  const path = normalize(pathname);

  if (path === "/pricing/") {
    return {
      question: "Sending at enterprise volume?",
      answer: "Ask about dedicated IPs and an SLA.",
      short: "Sending at enterprise volume?",
    };
  }

  if (path.startsWith("/compare/") || /^\/blog\/[^/]*alternatives\/$/.test(path)) {
    return {
      question: "Comparing providers?",
      answer: "We'll walk your team through the migration.",
      short: "Comparing providers?",
    };
  }

  if (path === "/email-marketing/" || path === "/platform/multilingual-campaigns/") {
    return {
      question: "Bringing contacts over from another tool?",
      answer: "We'll help you move them.",
      short: "Moving your contacts?",
    };
  }

  return defaultPrompt;
}
