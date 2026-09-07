import { MONTHS, loadMonth } from "$lib/changelog/months";
import type { PageLoad } from "./$types";

/**
 * Resolving the newest month here (rather than importing it in the component)
 * keeps its content in the prerendered HTML while leaving every earlier month
 * to the feed's lazy loader.
 */
export const load: PageLoad = async () => {
  return {
    month: await loadMonth(MONTHS[0]),
  };
};
