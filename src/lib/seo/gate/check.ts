/**
 * SEO gate: reads the built site and checks it against the rules in
 * src/lib/seo/gate. Run after `pnpm build`:
 *
 *   node src/lib/seo/gate/check.ts                  check; fail on regressions
 *   node src/lib/seo/gate/check.ts --strict         fail on every issue, known or not
 *   node src/lib/seo/gate/check.ts --update-known   record today's issues (and drop fixed ones)
 *   node src/lib/seo/gate/check.ts --write-baseline snapshot the built site as the baseline
 *
 * The data lives in docs/seo (baseline.json: every URL that must survive;
 * known-issues.json: the ratchet) and terraform/redirects.json (old path to new path).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

import { pathOfBuiltFile, readPage } from "./page.ts";
import { compare, toKnown, type Known } from "./ratchet.ts";
import { checkPage, checkSite } from "./rules.ts";
import { HARD_RULES, type Baseline, type Issue, type PageFacts, type Redirects } from "./types.ts";

const args = new Set(process.argv.slice(2));
const buildDir =
  process.argv.find((arg) => arg.startsWith("--build-dir="))?.split("=")[1] ?? "build";
const DATA = "docs/seo";

/** Built pages the sitemap leaves out on purpose; mirrors LEFT_OUT in src/lib/seo/sitemap.ts. */
const SITEMAP_IGNORE = ["/terms-15-02-2026/"];

function readJson<T>(file: string, fallback: T): T {
  return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as T) : fallback;
}

function writeJson(file: string, value: unknown): void {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function readBuild(): Promise<PageFacts[]> {
  const files = (await readdir(buildDir, { recursive: true })).filter((file) =>
    file.endsWith("index.html"),
  );
  return files
    .sort()
    .map((file) => readPage(readFileSync(join(buildDir, file), "utf8"), pathOfBuiltFile(file)));
}

function readText(file: string): string | undefined {
  const path = join(buildDir, file);
  return existsSync(path) ? readFileSync(path, "utf8") : undefined;
}

if (!existsSync(buildDir)) {
  console.error(`No ${buildDir}/ directory. Run pnpm build first.`);
  process.exit(2);
}

const pages = await readBuild();

if (args.has("--write-baseline")) {
  const baseline: Baseline = {
    takenOn: new Date().toISOString().slice(0, 10),
    pages: Object.fromEntries(
      pages.map((page) => [
        page.path,
        {
          title: page.title,
          h1: page.headings.find((heading) => heading.level === 1)?.text,
          canonical: page.canonical,
          jsonLdTypes: page.jsonLdTypes,
          noindex: /noindex/i.test(page.robots ?? ""),
        },
      ]),
    ),
  };
  writeJson(`${DATA}/baseline.json`, baseline);
  console.log(`Baseline written: ${pages.length} pages.`);
  process.exit(0);
}

const baseline = readJson<Baseline>(`${DATA}/baseline.json`, { takenOn: "", pages: {} });
const redirects = readJson<Redirects>("terraform/redirects.json", {});
const known = readJson<Known>(`${DATA}/known-issues.json`, {});
const sitemap = readText("sitemap.xml") ?? "";
const llms = readText("llms.txt") ?? "";
const fileExists = (path: string) => existsSync(join(buildDir, path));
const context = { pages: new Set(pages.map((page) => page.path)), redirects, fileExists };

const issues: Issue[] = [
  ...pages.flatMap((page) => checkPage(page, context)),
  ...checkSite({
    pages,
    baseline,
    redirects,
    sitemapUrls: [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]),
    sitemapXml: sitemap,
    sitemapIgnore: SITEMAP_IGNORE,
    llmsLinks: [...llms.matchAll(/\]\((https:\/\/lettr\.com[^)\s]*)\)/g)].map((match) => match[1]),
    robotsTxt: readText("robots.txt"),
    fileExists,
  }),
];

if (args.has("--update-known")) {
  writeJson(`${DATA}/known-issues.json`, toKnown(issues));
  console.log(
    `known-issues.json updated: ${issues.length} issues across ${Object.keys(toKnown(issues)).length} rules.`,
  );
  process.exit(0);
}

const byRule = new Map<string, number>();
for (const issue of issues) byRule.set(issue.rule, (byRule.get(issue.rule) ?? 0) + 1);
console.log(
  `${pages.length} pages, ${issues.length} issues (${issues.length - compare(issues, known).regressions.length} already known)`,
);
for (const [rule, count] of [...byRule].sort(([a], [b]) => a.localeCompare(b)))
  console.log(`  ${String(count).padStart(4)}  ${rule}`);

const result = args.has("--strict") ? { regressions: issues, fixed: [] } : compare(issues, known);
const { fixed } = result;
// hard failures (lost URLs, lost structured data) first, then by rule
const regressions = [...result.regressions].sort(
  (a, b) =>
    Number(HARD_RULES.has(b.rule)) - Number(HARD_RULES.has(a.rule)) || a.rule.localeCompare(b.rule),
);

if (fixed.length) {
  console.log(
    `\n${fixed.length} known issue(s) are fixed. Run with --update-known to drop them from the list:`,
  );
  for (const { rule, url } of fixed.slice(0, 10)) console.log(`  fixed  ${rule}  ${url}`);
  if (fixed.length > 10) console.log(`  ... and ${fixed.length - 10} more`);
}

if (regressions.length) {
  console.log(`\n${regressions.length} ${args.has("--strict") ? "issue(s)" : "new issue(s)"}:`);
  for (const issue of regressions.slice(0, 60))
    console.log(`  FAIL  ${issue.rule}  ${issue.url}  ${issue.detail}`);
  if (regressions.length > 60) console.log(`  ... and ${regressions.length - 60} more`);
  process.exit(1);
}
console.log("\nSEO gate passed.");
