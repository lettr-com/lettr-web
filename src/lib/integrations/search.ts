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

// Written out so `Letter` is the 27 literals, not `string`.
// prettier-ignore
export const LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#",
] as const;
export type Letter = (typeof LETTERS)[number];

/** The A–Z bucket an entry files under: the first letter of its sort name, or "#" for a digit. */
export function letterOf(entry: Pick<Integration, "name" | "sortName">): Letter {
  const first = normalize(entry.sortName ?? entry.name)
    .charAt(0)
    .toUpperCase();
  return (/[A-Z]/.test(first) ? first : "#") as Letter;
}

/** Entries filed under `letter`, in their original order; `null` keeps them all. */
export function filterByLetter<T extends Integration>(
  entries: readonly T[],
  letter: Letter | null,
): T[] {
  return letter ? entries.filter((entry) => letterOf(entry) === letter) : [...entries];
}
