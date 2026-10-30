import type { PageServerLoad } from "./$types";

import { highlightTabs } from "$lib/server/highlight";
import { codeTabs } from "$lib/utils/shiki";

/** Highlights the code samples at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  codeTabs: await highlightTabs(codeTabs),
});
