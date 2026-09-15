import type { ChangelogMonth, FeatureTag, Module } from "./types";

/**
 * A filter selection is a flat set of badges. Modules and feature tags share
 * one space deliberately: a reader thinking "just show me Transactional" and a
 * reader thinking "just show me UI/UX" are doing the same thing, and asking
 * them to notice which of the two vocabularies a badge belongs to would be
 * asking them to care about a distinction that only the data model has.
 */
export type FilterToken = Module | FeatureTag;

export const MODULES: readonly Module[] = ["transactional", "campaigns", "audience", "platform"];

/** "Breaking" is rendered on its own row, so it is kept last here too. */
export const FEATURE_TAGS: readonly FeatureTag[] = [
  "API",
  "SDKs",
  "Webhooks",
  "AI",
  "Deliverability",
  "UI/UX",
  "Docs",
  "Security",
  "Performance",
  "Billing",
  "Breaking",
];

export const MODULE_LABELS: Record<Module, string> = {
  transactional: "Transactional",
  campaigns: "Campaigns",
  audience: "Audience",
  platform: "Platform",
};

/**
 * Canonical display order. A selection is always sorted into it, so the same
 * set of badges produces the same URL however it was clicked together — two
 * people sharing "the Transactional and API view" share the same link.
 */
const TOKEN_ORDER: readonly FilterToken[] = [...MODULES, ...FEATURE_TAGS];

export function tokenLabel(token: FilterToken): string {
  return token in MODULE_LABELS ? MODULE_LABELS[token as Module] : token;
}

/**
 * URL slug for a token: "UI/UX" => "ui-ux". Slugs rather than raw labels keep
 * the query string readable — a percent-encoded slash in a link someone is
 * about to paste into Slack is noise.
 */
export function tokenSlug(token: FilterToken): string {
  return token.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const TOKENS_BY_SLUG = new Map<string, FilterToken>(
  TOKEN_ORDER.map((token) => [tokenSlug(token), token]),
);

/**
 * Reads a selection from `searchParams.getAll("filter")`. Unknown slugs are
 * dropped rather than rejected: a link written against a tag that has since
 * been renamed should still open the changelog, just unfiltered by that part.
 */
export function parseFilter(values: readonly string[]): FilterToken[] {
  const selected = new Set<FilterToken>();

  for (const value of values) {
    const token = TOKENS_BY_SLUG.get(value.trim().toLowerCase());
    if (token) selected.add(token);
  }

  return TOKEN_ORDER.filter((token) => selected.has(token));
}

/** Repeated params (`?filter=a&filter=b`) rather than one comma-joined value,
 * which `URLSearchParams` would escape to `a%2Cb`. */
export function filterQuery(tokens: readonly FilterToken[]): string {
  if (tokens.length === 0) return "";

  const params = new URLSearchParams();
  for (const token of tokens) params.append("filter", tokenSlug(token));
  return `?${params.toString()}`;
}

/** A month link that carries the active filter, so narrowing to one area
 * survives moving between months. */
export function monthHref(id: string, tokens: readonly FilterToken[] = []): string {
  return `/changelog/${id}/${filterQuery(tokens)}`;
}

export function toggleFilter(tokens: readonly FilterToken[], token: FilterToken): FilterToken[] {
  const next = tokens.includes(token)
    ? tokens.filter((existing) => existing !== token)
    : [...tokens, token];

  return TOKEN_ORDER.filter((candidate) => next.includes(candidate));
}

/**
 * An entry matches if it carries *any* selected badge — the selection widens
 * the view rather than narrowing it with each click. Intersecting instead
 * ("Transactional AND Breaking") would make the second click almost always
 * empty the page, which reads as a broken filter rather than a precise one.
 */
export function matchesFilter(
  item: { modules: Module[]; tags?: FeatureTag[] },
  tokens: readonly FilterToken[],
): boolean {
  if (tokens.length === 0) return true;

  return (
    item.modules.some((module) => tokens.includes(module)) ||
    (item.tags ?? []).some((tag) => tokens.includes(tag))
  );
}

/** The month with every section reduced to its matching entries. Returned as a
 * whole `ChangelogMonth` so components can keep rendering one shape. */
export function filterMonth(month: ChangelogMonth, tokens: readonly FilterToken[]): ChangelogMonth {
  if (tokens.length === 0) return month;

  return {
    id: month.id,
    published: month.published,
    features: month.features.filter((entry) => matchesFilter(entry, tokens)),
    improvements: month.improvements.filter((entry) => matchesFilter(entry, tokens)),
    bugfixes: month.bugfixes.filter((fix) => matchesFilter(fix, tokens)),
  };
}

export function entryCount(month: ChangelogMonth): number {
  return month.features.length + month.improvements.length + month.bugfixes.length;
}

/** "Transactional, API or UI/UX" — the selection said the way the UI says it. */
export function describeFilter(tokens: readonly FilterToken[]): string {
  const labels = tokens.map(tokenLabel);
  if (labels.length <= 1) return labels[0] ?? "";
  return `${labels.slice(0, -1).join(", ")} or ${labels.at(-1)}`;
}

/**
 * The one line that says both how many entries a selection matched and which
 * badges produced them — "165 entries tagged Transactional or API". Returned
 * without closing punctuation so a caller can qualify it before ending the
 * sentence.
 *
 * `total` is passed where there is a fixed denominator to compare against — one
 * month's page — and omitted on the index, where the log has no total the
 * reader is measuring the count against.
 */
export function summarizeMatches(
  count: number,
  tokens: readonly FilterToken[],
  total?: number,
): string {
  const noun = (total ?? count) === 1 ? "entry" : "entries";
  const head = total === undefined ? `${count} ${noun}` : `${count} of ${total} ${noun}`;

  return `${head} tagged ${describeFilter(tokens)}`;
}
