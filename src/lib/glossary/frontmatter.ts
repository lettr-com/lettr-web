import { load } from "js-yaml";
import type { GlossaryTermMeta, GlossaryTermSource, ReadingLink } from "./types";

export interface FrontmatterResult {
  data: Record<string, unknown>;
  body: string;
}

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/;

/**
 * Split a Markdown document into its leading YAML block and body. A bad file
 * throws with `name` in the message so the build fails loudly instead of
 * rendering an empty page.
 */
export function splitFrontmatter(raw: string, name = "document"): FrontmatterResult {
  const match = FENCE.exec(raw);
  if (!match) {
    throw new Error(`${name}: missing frontmatter fence (the file must start with ---)`);
  }

  const data = load(match[1]);
  const body = match[2].trim();
  if (data === null || data === undefined) return { data: {}, body };
  if (typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${name}: frontmatter must be a YAML mapping`);
  }
  return { data: data as Record<string, unknown>, body };
}

function requireString(data: Record<string, unknown>, key: string, name: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name}: frontmatter "${key}" is required and must be a non-empty string`);
  }
  return value.trim();
}

function optionalString(
  data: Record<string, unknown>,
  key: string,
  name: string,
): string | undefined {
  const value = data[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new Error(`${name}: frontmatter "${key}" must be a string`);
  return value.trim();
}

function stringList(data: Record<string, unknown>, key: string, name: string): string[] {
  const value = data[key];
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`${name}: frontmatter "${key}" must be a list of strings`);
  }
  return value.map((item) => item.trim());
}

function readingList(data: Record<string, unknown>, name: string): ReadingLink[] {
  const value = data.reading;
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error(`${name}: frontmatter "reading" must be a list`);
  return value.map((item, index) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(`${name}: frontmatter "reading[${index}]" must have title and href`);
    }
    const entry = item as Record<string, unknown>;
    if (typeof entry.title !== "string" || typeof entry.href !== "string") {
      throw new Error(`${name}: frontmatter "reading[${index}]" must have string title and href`);
    }
    return { title: entry.title.trim(), href: entry.href.trim() };
  });
}

export function parseTermFile(slug: string, raw: string, name = `${slug}.md`): GlossaryTermSource {
  const { data, body } = splitFrontmatter(raw, name);
  const meta: GlossaryTermMeta = {
    slug,
    term: requireString(data, "term", name),
    fullName: optionalString(data, "fullName", name),
    question: optionalString(data, "question", name) ?? "What is",
    description: requireString(data, "description", name),
    related: stringList(data, "related", name),
    reading: readingList(data, name),
  };
  return { meta, body };
}
