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
      // The site canonicalises to trailing-slash URLs (trailingSlash = "always"),
      // so the sitemap must list the trailing-slash form to stay canonical.
      trailingSlashes: true,
      // Keep non-indexable routes out of the index: the 404 fallback, the
      // superseded terms version, and /book (a 308 redirect to /demo).
      // Patterns are matched against the built files under `build/`, so the
      // 404 fallback must be referenced by its file name (`build/404` never
      // matches `build/404.html`); the other two are route directories.
      ignore: ["404.html", "terms-15-02-2026", "book"],
    }),
  ],
});
