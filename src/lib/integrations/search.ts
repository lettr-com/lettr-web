import type { Integration } from "./types.ts";

/** Lowercase, accents stripped, punctuation turned to spaces, so "Tray.ai" and "tray ai" meet. */
export function normalize(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Everything a visitor might type to find an entry, as one normalized string. */
export function searchText(entry: Integration, sectionHeading = ""): string {
  return normalize(
    [
      entry.name,
      entry.slug,
      entry.summary,
      entry.type,
      `built by ${entry.builtBy}`,
      entry.statement,
      ...entry.canDo,
      sectionHeading,
      ...(entry.keywords ?? []),
    ].join(" "),
  );
}

/**
 * The entries whose text holds every word of the query, in their original order.
 * An empty query matches everything. Words match from the start of a word, so
 * "sup" finds Supabase but "base" does not.
 */
export function searchIntegrations<T extends Integration>(
  entries: readonly T[],
  query: string,
  headingFor: (entry: T) => string = () => "",
): T[] {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (terms.length === 0) return [...entries];
  return entries.filter((entry) => {
    const words = ` ${searchText(entry, headingFor(entry))}`;
    return terms.every((term) => words.includes(` ${term}`));
  });
}
