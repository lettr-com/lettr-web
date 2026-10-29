import type { LayoutServerLoad } from "./$types";

import { MONTHS, loadMonth } from "$lib/changelog/months";
import { highlightCode } from "$lib/server/highlight";

/**
 * Every month's code samples, highlighted at prerender time and keyed by their
 * source. The feed loads earlier months in the browser, so their colours come
 * with the page rather than with the month. `ChangelogEntry` reads them.
 */
export const load: LayoutServerLoad = async () => {
  const months = await Promise.all(MONTHS.map(loadMonth));
  const samples = months
    .flatMap((month) => [...month.features, ...month.improvements])
    .flatMap((entry) => (entry.code ? [entry.code] : []));
  const changelogCode: Record<string, string> = {};
  for (const { source, lang } of samples) {
    const { html } = await highlightCode(source, lang);
    if (html) changelogCode[source] = html;
  }
  return { changelogCode };
};
