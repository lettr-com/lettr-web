import type { RequestHandler } from "./$types";

import { glossaryLlmsTxt } from "$lib/glossary/seo";
import { buildIndex, buildTerm } from "$lib/glossary/terms";

// Endpoints do not inherit `prerender` from +layout.ts.
export const prerender = true;

export const GET: RequestHandler = () => {
  const terms = buildIndex().map(({ slug }) => buildTerm(slug)!);
  return new Response(glossaryLlmsTxt(terms), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
