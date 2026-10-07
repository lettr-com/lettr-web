import type { RequestHandler } from "./$types";

import { MONTHS, loadMonth } from "$lib/changelog/months";
import { changelogLlmsTxt } from "$lib/changelog/seo";

// Endpoints do not inherit `prerender` from +layout.ts.
export const prerender = true;

export const GET: RequestHandler = async () => {
  const months = await Promise.all(MONTHS.map((id) => loadMonth(id)));
  return new Response(changelogLlmsTxt(months), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
