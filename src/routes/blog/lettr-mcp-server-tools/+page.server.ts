import type { PageServerLoad } from "./$types";

import { highlightCode } from "$lib/server/highlight";

const apiKeyConnect = `claude mcp add --transport http lettr https://app.lettr.com/mcp \\
  --header "Authorization: Bearer lttr_xxxxxxxxx"`;

/** Highlights the post's code at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  code: {
    apiKeyConnect: await highlightCode(apiKeyConnect, "bash"),
  },
});
