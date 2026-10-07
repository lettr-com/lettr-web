import { error } from "@sveltejs/kit";
import type { EntryGenerator, PageServerLoad } from "./$types";

import { buildIndex, buildNeighbours, buildTerm, resolveRelated } from "$lib/glossary/terms";

/**
 * Declared explicitly so every term prerenders even if a link were ever
 * missing from the index page.
 */
export const entries: EntryGenerator = () => buildIndex().map((term) => ({ slug: term.slug }));

export const load: PageServerLoad = ({ params }) => {
  const term = buildTerm(params.slug);
  if (!term) error(404, "Glossary term not found");

  const { prev, next } = buildNeighbours(params.slug);

  return {
    term,
    prev,
    next,
    related: resolveRelated(term.related),
  };
};
