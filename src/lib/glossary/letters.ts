import type { GlossaryTermLink, Letter, LetterGroup } from "./types";

export const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "#",
] as const;

/** First character of the label, uppercased; anything outside A to Z lands in "#". */
export function letterFor(term: string): Letter {
  const first = term.trim().charAt(0).toUpperCase();
  return /^[A-Z]$/.test(first) ? (first as Letter) : "#";
}

/** Bucket an already sorted index by letter; empty letters are omitted. */
export function groupByLetter(terms: readonly GlossaryTermLink[]): LetterGroup[] {
  const buckets = new Map<Letter, GlossaryTermLink[]>();
  for (const term of terms) {
    const letter = letterFor(term.term);
    const bucket = buckets.get(letter);
    if (bucket) bucket.push(term);
    else buckets.set(letter, [term]);
  }
  return LETTERS.flatMap((letter) => {
    const bucket = buckets.get(letter);
    return bucket ? [{ letter, terms: bucket }] : [];
  });
}
