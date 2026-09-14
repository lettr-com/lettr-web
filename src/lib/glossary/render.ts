import { Marked, type Tokens } from "marked";
import { escapeHtml } from "../utils/html";
import { slugify } from "../utils/slug";

const EXTERNAL = /^https?:\/\//i;

/**
 * Absolute links open in a new tab at build time (the blog does this on the
 * client); sibling glossary links and site paths stay in the same tab because
 * readers browse between terms. Headings get ids so H2s are linkable; no table
 * of contents is drawn.
 */
const markdown = new Marked({ gfm: true }).use({
  renderer: {
    link({ href, title, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens);
      const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
      const external = EXTERNAL.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapeHtml(href)}"${titleAttribute}${external}>${text}</a>`;
    },
    heading({ tokens, depth, text }: Tokens.Heading) {
      const id = slugify(text);
      const inner = this.parser.parseInline(tokens);
      const idAttribute = id ? ` id="${id}"` : "";
      return `<h${depth}${idAttribute}>${inner}</h${depth}>\n`;
    },
  },
});

export function renderTermBody(body: string): string {
  return markdown.parse(body, { async: false });
}
