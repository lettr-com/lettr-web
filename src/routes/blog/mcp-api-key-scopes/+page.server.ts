import type { PageServerLoad } from "./$types";

import { highlightCode } from "$lib/server/highlight";

const clientConfig = `{
  "url": "https://app.lettr.com/mcp",
  "headers": {
    "Authorization": "Bearer lttr_xxxxxxxxx"
  }
}`;

/** Highlights the post's code at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  code: {
    clientConfig: await highlightCode(clientConfig, "json"),
  },
});
