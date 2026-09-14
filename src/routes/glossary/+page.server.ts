import type { PageServerLoad } from "./$types";

import { groupByLetter } from "$lib/glossary/letters";
import { loadTermIndex } from "$lib/glossary/terms";

export const load: PageServerLoad = () => {
  const index = loadTermIndex();
  return {
    groups: groupByLetter(index),
    count: index.length,
  };
};
