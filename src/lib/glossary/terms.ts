import { parseTermFile } from "./frontmatter";
import { definitionFromBody, renderTermBody } from "./render";
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

const GLOSSARY_LINK = /\]\(\/glossary\/([^)/]+)\/\)/g;

export function slugFromPath(path: string): string {
  return path.replace(/^.*\//, "").replace(/\.md$/, "");
}

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

interface TermSet {
  sources: readonly GlossaryTermSource[];
  index: readonly GlossaryTermLink[];
  /** Slug to position in `sources` and `index`. */
  positions: Map<string, number>;
}

const cache = new WeakMap<TermFiles, TermSet>();

/**
 * Parse every file once per files record, sort by label and check that every
 * related slug and body glossary link names a term that has a file. Throws on
 * a bad or missing file set, so a broken reference fails the build.
 */
function loadTermSet(files: TermFiles): TermSet {
  const cached = cache.get(files);
  if (cached) return cached;

  const paths = Object.keys(files);
  if (paths.length === 0) throw new Error("no glossary terms found in src/lib/glossary/terms");

  const sources = paths.map((path) => parseTermFile(slugFromPath(path), files[path], path));
  sources.sort((a, b) => collator.compare(a.meta.term, b.meta.term));

  const positions = new Map(sources.map((source, position) => [source.meta.slug, position]));
  for (const { meta, body } of sources) {
    const linked = [...body.matchAll(GLOSSARY_LINK)].map((match) => match[1]);
    for (const slug of [...meta.related, ...linked]) {
      if (!positions.has(slug)) throw new Error(`${meta.slug}.md: unknown glossary term ${slug}`);
    }
  }

  const index = sources.map(({ meta }) => ({
    slug: meta.slug,
    term: meta.term,
    href: `/glossary/${meta.slug}/`,
  }));

  const set = { sources, index, positions };
  cache.set(files, set);
  return set;
}

export function readSources(files: TermFiles = termFiles): readonly GlossaryTermSource[] {
  return loadTermSet(files).sources;
}

export function buildIndex(files: TermFiles = termFiles): readonly GlossaryTermLink[] {
  return loadTermSet(files).index;
}

export function buildTerm(slug: string, files: TermFiles = termFiles): GlossaryTerm | undefined {
  const { sources, positions } = loadTermSet(files);
  const position = positions.get(slug);
  if (position === undefined) return undefined;
  const { meta, body } = sources[position];
  return { ...meta, html: renderTermBody(body), definition: definitionFromBody(body) };
}

export function buildNeighbours(
  slug: string,
  files: TermFiles = termFiles,
): { prev?: GlossaryTermLink; next?: GlossaryTermLink } {
  const { index, positions } = loadTermSet(files);
  const position = positions.get(slug);
  if (position === undefined) return {};
  return { prev: index[position - 1], next: index[position + 1] };
}

/** Resolve related slugs to links; the loader has already checked every slug exists. */
export function resolveRelated(
  slugs: readonly string[],
  files: TermFiles = termFiles,
): GlossaryTermLink[] {
  const { index, positions } = loadTermSet(files);
  return slugs.map((slug) => index[positions.get(slug)!]);
}
