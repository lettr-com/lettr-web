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
