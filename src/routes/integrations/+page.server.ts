import type { PageServerLoad } from "./$types";

import { featuredIntegrations, hubFaqs, hubSections, liveIntegrations } from "$lib/integrations";

export const load: PageServerLoad = () => ({
  featured: featuredIntegrations(),
  sections: hubSections(),
  entries: liveIntegrations(),
  faqs: hubFaqs(),
  footerCta: {
    title: "Start sending",
    accent: "for free.",
    description: "Pick an integration and send your first email. No credit card required.",
  },
});
