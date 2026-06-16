import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { svelteSitemap } from "svelte-sitemap/vite";
import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    tailwindcss(),
    sveltekit(),
    // Auto-generates build/sitemap.xml from the prerendered HTML pages
    // (including dynamic /compare/[provider] routes) after each build.
    svelteSitemap({
      domain: "https://lettr.com",
      changeFreq: "weekly",
      // Keep the 404 page and superseded terms version out of the index.
      ignore: ["404", "terms-15-02-2026"],
    }),
  ],
});
