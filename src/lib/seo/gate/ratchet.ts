import { HARD_RULES, type Issue } from "./types.ts";

export type Known = Record<string, string[]>;

/** Known issues by rule, each a list of the URLs or files carrying it. */
export function toKnown(issues: Issue[]): Known {
  const known: Known = {};
  for (const issue of issues) {
    (known[issue.rule] ??= []).push(issue.url);
  }
  for (const rule of Object.keys(known)) known[rule] = [...new Set(known[rule])].sort();
  return Object.fromEntries(Object.entries(known).sort(([a], [b]) => a.localeCompare(b)));
}

export interface Comparison {
  /** Issues not in the known list, plus every issue of a hard rule: these fail the gate. */
  regressions: Issue[];
  /** Known issues that no longer occur: remove them from the list. */
  fixed: { rule: string; url: string }[];
}

/**
 * The gate only ratchets: today's problems are recorded, new ones fail, and a
 * problem that has been fixed has to leave the list so it cannot come back.
 */
export function compare(issues: Issue[], known: Known): Comparison {
  const regressions = issues.filter(
    (issue) => HARD_RULES.has(issue.rule) || !known[issue.rule]?.includes(issue.url),
  );
  const current = new Set(issues.map((issue) => `${issue.rule}\n${issue.url}`));
  const fixed = Object.entries(known).flatMap(([rule, urls]) =>
    urls.filter((url) => !current.has(`${rule}\n${url}`)).map((url) => ({ rule, url })),
  );
  return { regressions, fixed };
}
