import { parseTermFile } from "./frontmatter";
import { renderTermBody } from "./render";
import type { GlossaryTerm, GlossaryTermLink, GlossaryTermSource } from "./types";

export type TermFiles = Readonly<Record<string, string>>;

/**
 * Every term file as raw Markdown, resolved at build time. Only
 * `+page.server.ts` loaders import this module, so with `prerender = true`
 * the Markdown and `marked` never reach the client bundle.
 */
export const termFiles: TermFiles = import.meta.glob<string>("./terms/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function slugFromPath(path: string): string {
  return path.replace(/^.*\//, "").replace(/\.md$/, "");
}

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

const cache = new WeakMap<TermFiles, readonly GlossaryTermSource[]>();

/** Parse every file once per files record and sort by label. Throws on a bad or missing file set. */
export function readSources(files: TermFiles = termFiles): readonly GlossaryTermSource[] {
  const cached = cache.get(files);
  if (cached) return cached;

  const paths = Object.keys(files);
  if (paths.length === 0) throw new Error("no glossary terms found in src/lib/glossary/terms");

  const seen = new Set<string>();
  const sources = paths.map((path) => {
    const slug = slugFromPath(path);
    if (seen.has(slug)) throw new Error(`duplicate glossary slug: ${slug}`);
    seen.add(slug);
    return parseTermFile(slug, files[path], path);
  });
  sources.sort((a, b) => collator.compare(a.meta.term, b.meta.term));

  cache.set(files, sources);
  return sources;
}

function linkFor(meta: { slug: string; term: string }): GlossaryTermLink {
  return { slug: meta.slug, term: meta.term, href: `/glossary/${meta.slug}/` };
}

export function buildIndex(files: TermFiles = termFiles): GlossaryTermLink[] {
  return readSources(files).map((source) => linkFor(source.meta));
}

export function buildTerm(slug: string, files: TermFiles = termFiles): GlossaryTerm | undefined {
  const sources = readSources(files);
  const source = sources.find((candidate) => candidate.meta.slug === slug);
  if (!source) return undefined;
  // Links to terms without a file render as text so the prerender crawl never 404s.
  const written = new Set(sources.map((candidate) => candidate.meta.slug));
  return { ...source.meta, html: renderTermBody(source.body, written) };
}

export function buildNeighbours(
  slug: string,
  files: TermFiles = termFiles,
): { prev?: GlossaryTermLink; next?: GlossaryTermLink } {
  const index = buildIndex(files);
  const position = index.findIndex((term) => term.slug === slug);
  if (position === -1) return {};
  return { prev: index[position - 1], next: index[position + 1] };
}

/**
 * Resolve related slugs to links, skipping terms that have no file yet so a
 * batch can name siblings written in a later batch. content.test.ts checks
 * every related slug against the planned list, so a typo still fails there.
 */
export function resolveRelated(
  slugs: readonly string[],
  files: TermFiles = termFiles,
): GlossaryTermLink[] {
  const index = buildIndex(files);
  return slugs.flatMap((slug) => {
    const link = index.find((term) => term.slug === slug);
    return link ? [link] : [];
  });
}

export const loadTermIndex = (): GlossaryTermLink[] => buildIndex();
export const loadTerm = (slug: string): GlossaryTerm | undefined => buildTerm(slug);
export const neighbours = (slug: string) => buildNeighbours(slug);
