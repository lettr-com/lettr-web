import { NodeHtmlMarkdown } from "node-html-markdown";
import { parse, type HTMLElement } from "node-html-parser";

import { escapeHtml } from "../utils/html.ts";

const SITE = "https://lettr.com";

/** Controls, decoration and UI mockups that carry no reading content for an agent. */
const STRIP = [
  "script",
  "style",
  "svg",
  "noscript",
  "template",
  "iframe",
  "canvas",
  "video",
  "nav",
  "button",
  "form",
  '[aria-hidden="true"]',
  '[data-markdown="skip"]',
].join(", ");

const markdown = new NodeHtmlMarkdown({ bulletMarker: "-", maxConsecutiveNewlines: 2 });

interface Faq {
  question: string;
  answer: string;
}

function absolute(url: string): string {
  return url.startsWith("/") && !url.startsWith("//") ? SITE + url : url;
}

function frontmatter(fields: Record<string, string | undefined>): string {
  const lines = Object.entries(fields)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  return `---\n${lines.join("\n")}\n---`;
}

function redirectTarget(document: HTMLElement): string | undefined {
  const refresh = document.querySelector('meta[http-equiv="refresh"]')?.getAttribute("content");
  return refresh?.match(/url=(.+)$/i)?.[1];
}

type JsonLdNode = Record<string, unknown>;

function isNode(value: unknown): value is JsonLdNode {
  return typeof value === "object" && value !== null;
}

/** The nodes of one JSON-LD script, top level or inside `@graph`; none when it is not valid JSON. */
function jsonLdNodes(text: string): JsonLdNode[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }
  const nodes = isNode(data) && Array.isArray(data["@graph"]) ? data["@graph"] : [data];
  return nodes.filter(isNode);
}

/** Question/answer pairs from the page's FAQPage structured data, skipping entries of another shape. */
function faqsFromJsonLd(document: HTMLElement): Faq[] {
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    const faqPage = jsonLdNodes(script.text).find((node) => node["@type"] === "FAQPage");
    if (!faqPage) continue;
    return [faqPage.mainEntity].flat().flatMap((entry): Faq[] => {
      if (!isNode(entry) || !isNode(entry.acceptedAnswer)) return [];
      const question = entry.name;
      const answer = entry.acceptedAnswer.text;
      return typeof question === "string" && typeof answer === "string"
        ? [{ question, answer }]
        : [];
    });
  }
  return [];
}

/**
 * The markdown twin of a prerendered page, served to agents that send
 * `Accept: text/markdown`. Only `<main>` is converted, so the navbar, footer
 * and cookie banner stay out; site-relative links and images are made
 * absolute because the markdown is often read outside the site.
 *
 * Components steer the output with `data-markdown`: "skip" drops a UI mockup,
 * and "faq" marks an accordion whose answers only exist in the FAQPage JSON-LD
 * (collapsed answers are not rendered), so it is rebuilt from that data.
 */
export function pageToMarkdown(html: string, path: string): string {
  const document = parse(html);
  const url = document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? SITE + path;
  const header = frontmatter({
    title: document.querySelector("title")?.text.trim(),
    description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
    url,
  });

  const main = document.querySelector("main");
  if (!main) {
    const target = redirectTarget(document);
    return target ? `${header}\n\nThis page moved to ${absolute(target)}\n` : `${header}\n`;
  }

  const faqs = faqsFromJsonLd(document)
    .map(({ question, answer }) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`)
    .join("");
  for (const accordion of main.querySelectorAll('[data-markdown="faq"]')) {
    accordion.replaceWith(faqs);
  }

  for (const icon of main.querySelectorAll("svg[aria-label]")) {
    icon.replaceWith(escapeHtml(icon.getAttribute("aria-label")!));
  }
  for (const element of main.querySelectorAll(STRIP)) element.remove();
  for (const image of main.querySelectorAll("img")) {
    const alt = image.getAttribute("alt")?.trim();
    const src = image.getAttribute("src");
    if (alt && src) image.setAttribute("src", absolute(src));
    else image.remove();
  }
  for (const link of main.querySelectorAll("a[href]")) {
    link.setAttribute("href", absolute(link.getAttribute("href")!));
  }

  return `${header}\n\n${markdown.translate(main.innerHTML).trim()}\n`;
}
