import { createHighlighter, type Highlighter } from "shiki";

import { lettrTheme, type CodeTab, type HighlightedTab } from "$lib/utils/shiki";

const langs = [
  "php",
  "javascript",
  "typescript",
  "json",
  "python",
  "go",
  "ruby",
  "java",
  "bash",
  "shell",
];
const aliases: Record<string, string> = { ts: "typescript", js: "javascript", sh: "bash" };

let highlighter: Promise<Highlighter> | undefined;

/** One highlighter for every page in the prerender, created on first use. */
function getHighlighter(): Promise<Highlighter> {
  highlighter ??= createHighlighter({ themes: [lettrTheme], langs });
  return highlighter;
}

/**
 * Highlights code with the site's Shiki theme at prerender time, so pages ship
 * coloured HTML and no highlighter. A PHP fragment without an opening tag is
 * highlighted with one, then the tag's line is dropped.
 */
export async function highlight(code: string, lang: string): Promise<string> {
  const shiki = await getHighlighter();
  const isPhpFragment = lang === "php" && !code.trimStart().startsWith("<?");
  const html = shiki.codeToHtml(isPhpFragment ? `<?php\n${code}` : code, {
    lang,
    theme: "lettr",
  });
  return isPhpFragment ? html.replace(/(<code[^>]*>).*?\n/, "$1") : html;
}

/** Props for the blog's `Code`. `text`, or any language without a grammar here, gets no `html` and shows uncoloured. */
export async function highlightCode(
  code: string,
  lang: string,
): Promise<{ code: string; lang: string; html?: string }> {
  const grammar = aliases[lang] ?? lang;
  return {
    code,
    lang,
    html: langs.includes(grammar) ? await highlight(code.trim(), grammar) : undefined,
  };
}

/** Highlights every tab of a `CodeSnippet`, the ones behind "More" included. */
export function highlightTabs(tabs: CodeTab[]): Promise<HighlightedTab[]> {
  return Promise.all(
    tabs.map(async (tab) => ({ ...tab, html: await highlight(tab.code, tab.lang) })),
  );
}
