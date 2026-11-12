import { error } from "@sveltejs/kit";
import type { EntryGenerator, PageServerLoad } from "./$types";

import { detailIntegrations, findIntegration, relatedIntegrations } from "$lib/integrations";
import { highlightTabs } from "$lib/server/highlight";

/** Declared so every detail page prerenders even if the hub stopped linking one. */
export const entries: EntryGenerator = () => detailIntegrations().map(({ slug }) => ({ slug }));

export const load: PageServerLoad = async ({ params }) => {
  const entry = findIntegration(params.slug);
  if (!entry?.seo) error(404, "Integration not found");

  // Code blocks are highlighted here at prerender time with the homepage's `lettr-mint` theme,
  // for the same CodeSwitcher panel; step lists pass through.
  const setup = await Promise.all(
    (entry.setup ?? []).map(async (block, index) => {
      if (block.kind !== "code") return block;
      const [tab] = await highlightTabs(
        [{ id: `step-${index}`, label: block.label, lang: block.lang, code: block.code }],
        "lettr-mint",
      );
      return { ...block, tab };
    }),
  );

  return {
    entry,
    setup,
    related: relatedIntegrations(entry),
    footerCta: {
      title: `Send from ${entry.ctaName ?? entry.name}`,
      accent: "for free.",
      description: "Create a Lettr account and connect it in a few steps. No credit card required.",
    },
  };
};
