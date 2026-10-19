import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";

import { markdownForAgents } from "./src/lib/agents/vite.ts";
import { sitemapWithDates } from "./src/lib/seo/sitemap.ts";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    tailwindcss(),
    sveltekit(),
    // Writes build/sitemap.xml from the prerendered pages, with the dates the content has.
    sitemapWithDates(),
    markdownForAgents(),
  ],
});
