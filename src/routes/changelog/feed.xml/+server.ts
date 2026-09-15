import type { RequestHandler } from "./$types";

import { MONTHS, loadMonth } from "$lib/changelog/months";
import { changelogAtom } from "$lib/changelog/seo";

// Endpoints do not inherit `prerender` from +layout.ts.
export const prerender = true;

export const GET: RequestHandler = async () => {
  const months = await Promise.all(MONTHS.map((id) => loadMonth(id)));
  return new Response(changelogAtom(months), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
};
