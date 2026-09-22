import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, sep } from "node:path";
import type { Plugin } from "vite-plus";

import { pageToMarkdown } from "./markdown.ts";

/**
 * Writes an `index.md` next to every prerendered `index.html` once the static
 * adapter has finished. CloudFront's viewer-request function serves it in
 * place of the HTML when a request prefers `Accept: text/markdown`, so every
 * page needs its twin, including redirect stubs.
 */
export function markdownForAgents(outDir = "build"): Plugin {
  let isSsr = false;

  return {
    name: "markdown-for-agents",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      isSsr = Boolean(config.build.ssr);
    },
    closeBundle: {
      sequential: true,
      order: "post",
      async handler() {
        // SvelteKit prerenders in the SSR build's closeBundle; the nested client build has no pages yet.
        if (!isSsr) return;
        const files = await readdir(outDir, { recursive: true });
        const pages = files.filter((file) => basename(file) === "index.html");
        await Promise.all(
          pages.map(async (file) => {
            const dir = dirname(file);
            const path = dir === "." ? "/" : `/${dir.split(sep).join("/")}/`;
            const html = await readFile(join(outDir, file), "utf8");
            await writeFile(join(outDir, dir, "index.md"), pageToMarkdown(html, path));
          }),
        );
      },
    },
  };
}
