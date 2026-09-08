import { error } from "@sveltejs/kit";
import { MONTHS, isMonthId, loadMonth } from "$lib/changelog/months";
import type { EntryGenerator, PageLoad } from "./$types";

/**
 * Declared explicitly so every month prerenders whether or not the feed
 * happens to link to it — the crawler only reaches lazily loaded months once
 * JavaScript has run, which it does not do at build time.
 */
export const entries: EntryGenerator = () => MONTHS.map((month) => ({ month }));

export const load: PageLoad = async ({ params }) => {
  if (!isMonthId(params.month)) {
    error(404, `There is no changelog for "${params.month}".`);
  }

  // MONTHS runs newest first, so the lower index is the more recent month.
  const index = MONTHS.indexOf(params.month);

  return {
    month: await loadMonth(params.month),
    newer: index > 0 ? MONTHS[index - 1] : null,
    older: index < MONTHS.length - 1 ? MONTHS[index + 1] : null,
  };
};
