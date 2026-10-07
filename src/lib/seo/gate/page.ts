import { parse, type HTMLElement } from "node-html-parser";

import type { Heading, PageFacts } from "./types.ts";

const MOCKUP = '[aria-hidden="true"], [data-markdown="skip"]';

function schemaTypes(value: unknown, into: Set<string>): void {
  if (Array.isArray(value)) {
    for (const entry of value) schemaTypes(entry, into);
  } else if (typeof value === "object" && value !== null) {
    const node = value as Record<string, unknown>;
    const type = node["@type"];
    if (typeof type === "string") into.add(type);
    else if (Array.isArray(type))
      for (const entry of type) if (typeof entry === "string") into.add(entry);
    schemaTypes(node["@graph"], into);
    schemaTypes(node.mainEntity, into);
  }
}

function insideMockup(element: HTMLElement): boolean {
  let parent: HTMLElement | null = element;
  while (parent) {
    if (parent.matches?.(MOCKUP)) return true;
    parent = parent.parentNode;
  }
  return false;
}

/** The text of a heading as a reader sees it: whitespace collapsed. */
function text(element: HTMLElement): string {
  return element.text.replace(/\s+/g, " ").trim();
}

export function readPage(html: string, path: string): PageFacts {
  const document = parse(html);
  const main = document.querySelector("main");
  const types = new Set<string>();
  let badJsonLd = 0;
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      schemaTypes(JSON.parse(script.text), types);
    } catch {
      badJsonLd += 1;
    }
  }

  const headings: Heading[] = (main?.querySelectorAll("h1, h2, h3, h4, h5, h6") ?? []).map(
    (heading): Heading => ({
      level: Number(heading.tagName.slice(1)),
      text: text(heading),
      insideMockup: insideMockup(heading),
    }),
  );

  return {
    path,
    title: document.querySelector("title")?.text.trim(),
    description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    robots: document.querySelector('meta[name="robots"]')?.getAttribute("content"),
    headings,
    links: document.querySelectorAll("a[href]").map((link) => link.getAttribute("href")!),
    navLinks: (document.querySelector("nav")?.querySelectorAll("a[href]") ?? []).map(
      (link) => link.getAttribute("href")!,
    ),
    jsonLdTypes: [...types].sort(),
    badJsonLd,
    redirectsTo: main
      ? undefined
      : document
          .querySelector('meta[http-equiv="refresh"]')
          ?.getAttribute("content")
          ?.match(/url\s*=\s*['"]?([^'"\s]+)/i)?.[1],
  };
}

/** "/pricing/index.html" in the build is the page "/pricing/". */
export function pathOfBuiltFile(file: string): string {
  const normalised = file.replaceAll("\\", "/");
  if (normalised === "index.html") return "/";
  return `/${normalised.replace(/index\.html$/, "")}`;
}
