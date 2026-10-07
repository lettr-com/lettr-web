import { SITE, type Baseline, type Issue, type PageFacts, type Redirects } from "./types.ts";

export const TITLE_MIN = 30;
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

/** Header links a crawler must find in the server-rendered HTML (report fix B1). */
export const REQUIRED_NAV_LINKS = [
  "/email-api/",
  "/smtp-relay/",
  "/inbound-email-api/",
  "/email-marketing/",
  "/pricing/",
  "/compare/",
  "https://docs.lettr.com",
];

export interface SiteContext {
  /** Every built page path. */
  pages: ReadonlySet<string>;
  redirects: Redirects;
  /** True for a file that exists in the build, e.g. "/llms.txt". */
  fileExists: (path: string) => boolean;
}

/** The on-site path an href points at, or undefined for external links, files and fragments. */
export function internalPath(href: string): { path: string; hasSlash: boolean } | undefined {
  let value = href.trim();
  if (value.startsWith(SITE)) value = value.slice(SITE.length) || "/";
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  const path = value.split("#")[0].split("?")[0];
  if (!path) return undefined;
  if (/\.[a-z0-9]+$/i.test(path.split("/").pop() ?? "")) return undefined;
  return { path: path.endsWith("/") ? path : `${path}/`, hasSlash: path.endsWith("/") };
}

function sample(values: string[], max = 4): string {
  const shown = values.slice(0, max).join(", ");
  return values.length > max ? `${shown} (+${values.length - max} more)` : shown;
}

export function checkPage(page: PageFacts, context: SiteContext): Issue[] {
  const issues: Issue[] = [];
  const add = (rule: string, detail: string) => issues.push({ rule, url: page.path, detail });

  if (page.redirectsTo) {
    const target = internalPath(page.redirectsTo);
    if (target && !context.pages.has(target.path))
      add("redirect-stub-target-missing", page.redirectsTo);
    return issues;
  }

  if (!page.title) add("title-missing", "no <title>");
  else if (page.title.length < TITLE_MIN)
    add("title-short", `${page.title.length} chars: "${page.title}"`);
  else if (page.title.length > TITLE_MAX)
    add("title-long", `${page.title.length} chars: "${page.title}"`);

  if (!page.description) add("description-missing", "no meta description");
  else if (page.description.length > DESCRIPTION_MAX) {
    add("description-long", `${page.description.length} chars`);
  }

  const expected = `${SITE}${page.path}`;
  if (!page.canonical) add("canonical-missing", "no canonical link");
  else if (page.canonical !== expected)
    add("canonical-not-self", `${page.canonical}, expected ${expected}`);

  const h1s = page.headings.filter((heading) => heading.level === 1 && !heading.insideMockup);
  if (h1s.length !== 1) add("h1-count", `${h1s.length} H1s`);

  for (const heading of page.headings) {
    if (heading.insideMockup) add("heading-in-mockup", `h${heading.level} "${heading.text}"`);
    else if (/\s[+−]$/.test(heading.text)) add("heading-widget-glyph", `"${heading.text}"`);
  }

  const slashless: string[] = [];
  const broken: string[] = [];
  for (const href of page.links) {
    const target = internalPath(href);
    if (!target) continue;
    if (!target.hasSlash) slashless.push(href);
    if (!context.pages.has(target.path) && !(target.path in context.redirects)) broken.push(href);
  }
  if (slashless.length) add("internal-link-without-slash", sample([...new Set(slashless)]));
  if (broken.length) add("internal-link-broken", sample([...new Set(broken)]));

  if (page.badJsonLd) add("json-ld-invalid", `${page.badJsonLd} block(s) do not parse`);

  if (page.path === "/") {
    const present = new Set(page.navLinks.map((href) => href.replace(SITE, "") || "/"));
    const missing = REQUIRED_NAV_LINKS.filter(
      (href) => !present.has(href) && !present.has(href.replace(/\/$/, "")),
    );
    if (missing.length) add("nav-links-missing", `header has no ${sample(missing, 7)}`);
  }

  return issues;
}

export interface SiteInput {
  pages: PageFacts[];
  baseline: Baseline;
  redirects: Redirects;
  /** URLs listed in sitemap.xml, as written. */
  sitemapUrls: string[];
  /** Paths the sitemap deliberately leaves out. */
  sitemapIgnore: string[];
  /** Links found in llms.txt, as written. */
  llmsLinks: string[];
  robotsTxt: string | undefined;
  fileExists: (path: string) => boolean;
}

export function checkSite(input: SiteInput): Issue[] {
  const issues: Issue[] = [];
  const add = (rule: string, url: string, detail: string) => issues.push({ rule, url, detail });
  const byPath = new Map(input.pages.map((page) => [page.path, page]));

  for (const [path, base] of Object.entries(input.baseline.pages)) {
    const now = byPath.get(path);
    if (!now) {
      if (!(path in input.redirects))
        add("baseline-url-lost", path, "neither built nor redirected");
      continue;
    }
    const lost = base.jsonLdTypes.filter((type) => !now.jsonLdTypes.includes(type));
    if (lost.length) add("structured-data-lost", path, `lost ${lost.join(", ")}`);
    if (/noindex/i.test(now.robots ?? "") && !base.noindex) {
      add("noindex-added", path, `robots: ${now.robots}`);
    }
  }

  const titles = new Map<string, string[]>();
  for (const page of input.pages) {
    if (!page.title || page.redirectsTo) continue;
    titles.set(page.title, [...(titles.get(page.title) ?? []), page.path]);
  }
  for (const [title, paths] of titles) {
    if (paths.length > 1)
      for (const path of paths)
        add("title-duplicate", path, `shared with ${paths.length - 1} other page(s): "${title}"`);
  }

  const inSitemap = new Set<string>();
  for (const url of input.sitemapUrls) {
    const target = internalPath(url);
    if (!target) continue;
    if (!target.hasSlash) add("sitemap-url-without-slash", target.path, url);
    inSitemap.add(target.path);
    if (!byPath.has(target.path))
      add("sitemap-url-without-page", target.path, "listed but not built");
  }
  for (const page of input.pages) {
    const left =
      input.sitemapIgnore.includes(page.path) ||
      Boolean(page.redirectsTo) ||
      /noindex/i.test(page.robots ?? "");
    if (!left && !inSitemap.has(page.path))
      add("page-missing-from-sitemap", page.path, "built but not listed");
  }

  const seenLinks = new Set<string>();
  for (const href of input.llmsLinks) {
    if (seenLinks.has(href)) continue;
    seenLinks.add(href);
    const target = internalPath(href);
    if (!target) continue;
    if (!target.hasSlash) add("llms-txt-link-without-slash", "llms.txt", href);
    if (!byPath.has(target.path) && !(target.path in input.redirects))
      add("llms-txt-link-broken", "llms.txt", href);
  }

  if (!input.robotsTxt) add("robots-txt", "robots.txt", "missing");
  else {
    if (!/^sitemap:\s*https:\/\/lettr\.com\/sitemap\.xml\s*$/im.test(input.robotsTxt))
      add("robots-txt", "robots.txt", "no Sitemap line");
    if (/^disallow:\s*\/\s*$/im.test(input.robotsTxt))
      add("robots-txt", "robots.txt", "disallows the whole site");
  }

  for (const [from, to] of Object.entries(input.redirects)) {
    if (to in input.redirects) add("redirect-chain", from, `${to} redirects again`);
    else if (!byPath.has(to)) add("redirect-target-missing", from, `${to} is not built`);
    if (byPath.has(from))
      add("redirect-source-still-built", from, "page exists as well as the redirect");
  }

  return issues;
}
