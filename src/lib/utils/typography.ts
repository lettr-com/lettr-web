const NBSP = " ";

/**
 * Join the last two words with a non-breaking space, so a wrapped title can
 * never end on a single word. `text-wrap: balance` does the same in browsers
 * that support it; this holds everywhere, and in feeds and previews too.
 * One-letter words ("a", "I") are tied to the next word, so no line ends on one.
 */
export function noWidow(text: string): string {
  const trimmed = text.trim().replace(/(^|\s)(\p{L}) +/gu, `$1$2${NBSP}`);
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace <= 0) return trimmed;
  return `${trimmed.slice(0, lastSpace)}${NBSP}${trimmed.slice(lastSpace + 1)}`;
}
