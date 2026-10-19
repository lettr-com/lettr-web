import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, sep } from "node:path";
import type { Plugin } from "vite-plus";

import { isoDate } from "../blog/feed.ts";
import { posts } from "../data/posts.ts";
import { parseTermFile } from "../glossary/frontmatter.ts";
import { escapeHtml } from "../utils/html.ts";

const SITE = "https://lettr.com";

/** Built pages that stay out of the sitemap on purpose: the superseded terms version. */
const LEFT_OUT = ["/terms-15-02-2026/"];

export interface SitemapEntry {
  /** Root-relative path with a trailing slash. */
  path: string;
  /** YYYY-MM-DD, only when the page has a real date behind it. */
  lastmod?: string;
}

/**
 * Google ignores `changefreq` and `priority`, and distrusts a `lastmod` that is
 * not honest, so an entry carries a date only when the content has one.
 */
export function buildSitemap(entries: readonly SitemapEntry[]): string {
  const urls = [...entries]
    .sort((a, b) => a.path.localeCompare(b.path))
    .map(({ path, lastmod }) => {
      const date = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${escapeHtml(SITE + path)}</loc>${date}\n  </url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

const latest = (dates: string[]) => dates.sort().at(-1);

/** Dates that exist in the content: when a post was published, when a glossary term was last updated. */
export async function lastmodByPath(
  termsDir = "src/lib/glossary/terms",
): Promise<Map<string, string>> {
  const dates = new Map<string, string>();
  for (const post of posts) dates.set(`/blog/${post.slug}/`, isoDate(post.date));

  const updated: string[] = [];
  for (const file of (await readdir(termsDir)).filter((name) => name.endsWith(".md"))) {
    const slug = file.slice(0, -".md".length);
    const { meta } = parseTermFile(slug, await readFile(join(termsDir, file), "utf8"), file);
    dates.set(`/glossary/${slug}/`, meta.updated);
    updated.push(meta.updated);
  }

  const newestPost = latest(posts.map((post) => isoDate(post.date)));
  const newestTerm = latest(updated);
  if (newestPost) dates.set("/blog/", newestPost);
  if (newestTerm) dates.set("/glossary/", newestTerm);
  return dates;
}

/** A page worth listing: it has content (not a redirect stub) and does not ask to stay out of the index. */
export function isIndexable(html: string): boolean {
  if (!/<main[\s>]/.test(html)) return false;
  return !/<meta[^>]+name="robots"[^>]+noindex/i.test(html);
}

/** Writes build/sitemap.xml from the prerendered pages once the static adapter has finished. */
export function sitemapWithDates(outDir = "build"): Plugin {
  let isSsr = false;

  return {
    name: "sitemap-with-dates",
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
        const dates = await lastmodByPath();
        const files = (await readdir(outDir, { recursive: true })).filter(
          (file) => basename(file) === "index.html",
        );
        const entries: SitemapEntry[] = [];
        for (const file of files) {
          const dir = dirname(file);
          const path = dir === "." ? "/" : `/${dir.split(sep).join("/")}/`;
          if (LEFT_OUT.includes(path) || !isIndexable(await readFile(join(outDir, file), "utf8")))
            continue;
          entries.push({ path, lastmod: dates.get(path) });
        }
        await writeFile(join(outDir, "sitemap.xml"), buildSitemap(entries));
      },
    },
  };
}
