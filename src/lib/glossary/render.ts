import { Marked, type Tokens } from "marked";
import { slugify } from "../utils/slug";

const EXTERNAL = /^https?:\/\//i;
const SIBLING = /^\/glossary\/([^/]+)\/$/;

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Absolute links open in a new tab at build time (the blog does this on the
 * client); sibling glossary links and site paths stay in the same tab because
 * readers browse between terms. A sibling link whose slug is not in
 * `knownSlugs` renders as plain text: the prerenderer crawls every link and
 * fails the build on a 404, and content batches link forward to terms that
 * are written later. Headings get ids so H2s are linkable; no table of
 * contents is drawn. The instance is built per call because the link renderer
 * closes over the slug set; 158 builds at prerender time cost nothing.
 */
function createMarkdown(knownSlugs?: ReadonlySet<string>): Marked {
  return new Marked({ gfm: true }).use({
    renderer: {
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const sibling = SIBLING.exec(href);
        if (sibling && knownSlugs && !knownSlugs.has(sibling[1])) return text;
        const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";
        const external = EXTERNAL.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${escapeAttribute(href)}"${titleAttribute}${external}>${text}</a>`;
      },
      heading({ tokens, depth, text }: Tokens.Heading) {
        const id = slugify(text);
        const inner = this.parser.parseInline(tokens);
        const idAttribute = id ? ` id="${id}"` : "";
        return `<h${depth}${idAttribute}>${inner}</h${depth}>\n`;
      },
    },
  });
}

export function renderTermBody(markdown: string, knownSlugs?: ReadonlySet<string>): string {
  return createMarkdown(knownSlugs).parse(markdown, { async: false });
}
