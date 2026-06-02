/**
 * Convert heading text to a URL-safe anchor slug.
 *
 * Lowercase, collapse runs of non-alphanumerics to a single "-", and trim
 * leading/trailing "-". Returns "" for empty/symbol-only input; the table of
 * contents treats "" as "no usable id" and skips the heading.
 *
 * Pure and SSR-safe: no DOM, no module state.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
