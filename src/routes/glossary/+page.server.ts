import type { PageServerLoad } from "./$types";

import { groupByLetter } from "$lib/glossary/letters";
import { buildIndex } from "$lib/glossary/terms";

export const load: PageServerLoad = () => {
  const index = buildIndex();
  return {
    groups: groupByLetter(index),
    count: index.length,
  };
};
