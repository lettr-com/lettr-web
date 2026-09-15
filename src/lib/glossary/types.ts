import type { LETTERS } from "./letters";

export type Letter = (typeof LETTERS)[number];

export interface ReadingLink {
  title: string;
  /** Absolute docs.lettr.com URL or a lettr.com path. */
  href: string;
}

/** Frontmatter of one term file plus its slug (the file name). */
export interface GlossaryTermMeta {
  slug: string;
  /** Display label, e.g. "DKIM". */
  term: string;
  /** e.g. "DomainKeys Identified Mail". */
  fullName?: string;
  /** "What is" | "What are" | ... Defaults to "What is". */
  question: string;
  /** Meta description, 120 to 160 characters. */
  description: string;
  /** Sibling slugs, 2 to 5. */
  related: string[];
  /** 1 to 4 docs links. */
  reading: ReadingLink[];
}

export interface GlossaryTerm extends GlossaryTermMeta {
  /** Rendered body. */
  html: string;
  /** First sentence of the body as plain text. */
  definition: string;
}

export interface GlossaryTermLink {
  slug: string;
  term: string;
  /** `/glossary/${slug}/` */
  href: string;
}

export interface LetterGroup {
  letter: Letter;
  terms: GlossaryTermLink[];
}

/** One term file, parsed but not rendered. */
export interface GlossaryTermSource {
  meta: GlossaryTermMeta;
  /** Markdown body with the frontmatter removed and surrounding whitespace trimmed. */
  body: string;
}
