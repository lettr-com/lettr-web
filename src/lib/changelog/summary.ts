import type { ChangelogMonth } from "./types";

export type SectionKey = "features" | "improvements" | "bugfixes";

export interface MonthSection {
  key: SectionKey;
  label: string;
  count: number;
}

const SECTION_LABELS: Record<SectionKey, string> = {
  features: "New features",
  improvements: "Improvements",
  bugfixes: "Bugfixes",
};

/** The three sections of a month in display order, each with its entry count. */
export function sectionsOf(month: ChangelogMonth): MonthSection[] {
  return (Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => ({
    key,
    label: SECTION_LABELS[key],
    count: month[key].length,
  }));
}

/** Anchor id shared by a section heading and the rail link that jumps to it. */
export function sectionAnchor(month: ChangelogMonth, key: SectionKey): string {
  return `${month.id}-${key}`;
}

/**
 * A count is bound to its noun with a non-breaking space, so a line never wraps
 * between them and leaves a bare "9" hanging at the end of a line with no idea
 * what it counts. Written as an escape rather than a literal so it survives
 * editing. The separators between phrases stay ordinary spaces — those are
 * where the line is meant to break.
 */
function countLabel(n: number, singular: string, plural: string): string | null {
  if (n === 0) return null;
  return `${n}\u00a0${n === 1 ? singular : plural}`;
}

/**
 * "3 new features, 8 improvements and 14 bugfixes" (each count joined to its
 * noun by a non-breaking space), or null for an empty month.
 */
export function summarizeMonth(month: ChangelogMonth): string | null {
  const parts = [
    countLabel(month.features.length, "new feature", "new features"),
    countLabel(month.improvements.length, "improvement", "improvements"),
    countLabel(month.bugfixes.length, "bugfix", "bugfixes"),
  ].filter((part): part is string => part !== null);

  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`;
}
