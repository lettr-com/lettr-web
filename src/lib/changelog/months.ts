import type { ChangelogMonth } from "./types";

/**
 * The changelog registry, newest first. Adding a month is a two-place edit —
 * write `data/YYYY-MM.ts` and prepend its id here — so `months.test.ts` asserts
 * the two stay in step. Without that a missed registration would render nothing
 * and raise no error.
 */
export const MONTHS: readonly string[] = [
  "2026-08",
  "2026-07",
  "2026-06",
  "2026-05",
  "2026-04",
  "2026-03",
  "2026-02",
];

/**
 * Lazy loaders keyed by data-file path. Vite compiles the glob at build time,
 * so each month ships as its own chunk and only the months actually scrolled
 * to are ever fetched. Exported so the registry test can compare its keys
 * against {@link MONTHS}.
 */
export const monthModules = import.meta.glob<{ month: ChangelogMonth }>("./data/*.ts");

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function isMonthId(id: string): boolean {
  return MONTHS.includes(id);
}

/** "2026-08" => "August 2026". A static table, so no locale APIs are involved. */
export function formatMonth(id: string): string {
  const [year, month] = id.split("-");
  const name = MONTH_NAMES[Number(month) - 1];
  return name ? `${name} ${year}` : id;
}

export async function loadMonth(id: string): Promise<ChangelogMonth> {
  const loader = monthModules[`./data/${id}.ts`];
  if (!loader) throw new Error(`No changelog data module for month "${id}".`);

  const module = await loader();
  return module.month;
}

export interface ArchiveSlot {
  /** "Jan" — always rendered, so an empty month still holds the grid's shape. */
  label: string;
  /** The registered month id, or null when nothing shipped that month. */
  id: string | null;
}

export interface ArchiveYear {
  year: string;
  /** Twelve slots, January first. */
  slots: ArchiveSlot[];
}

/**
 * {@link MONTHS} regrouped as one fixed twelve-slot row per year, newest year
 * first. A flat list of months grows a line of links every month; grouped this
 * way the index grows a row once a year and each row keeps the same width, so
 * the header stays the same size whether the log covers one year or ten.
 */
export function archiveByYear(): ArchiveYear[] {
  const years = new Map<string, ArchiveSlot[]>();

  for (const id of MONTHS) {
    const [year, month] = id.split("-");
    const index = Number(month) - 1;
    if (!MONTH_NAMES[index]) continue;

    let slots = years.get(year);
    if (!slots) {
      slots = MONTH_NAMES.map((name) => ({ label: name.slice(0, 3), id: null }));
      years.set(year, slots);
    }
    slots[index].id = id;
  }

  return [...years.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, slots]) => ({ year, slots }));
}
