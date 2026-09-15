import { describe, expect, it } from "vite-plus/test";
import { sectionAnchor, sectionsOf, summarizeMonth, summarizeMonthHtml } from "./summary";
import type { ChangelogMonth } from "./types";

const entry = (title: string) => ({ title, modules: ["platform" as const], lead: "Lead." });
const fix = (text: string) => ({ modules: ["platform" as const], text });

const month: ChangelogMonth = {
  id: "2026-08",
  published: "2026-08-31",
  features: [entry("A")],
  improvements: [entry("B"), entry("C")],
  bugfixes: [fix("Fixed x"), fix("Fixed y"), fix("Fixed z")],
};

describe("sectionsOf", () => {
  it("lists the three sections in display order with their counts", () => {
    expect(sectionsOf(month)).toEqual([
      { key: "features", label: "New features", count: 1 },
      { key: "improvements", label: "Improvements", count: 2 },
      { key: "bugfixes", label: "Bugfixes", count: 3 },
    ]);
  });
});

describe("sectionAnchor", () => {
  it("scopes the anchor to the month so months in one feed never collide", () => {
    expect(sectionAnchor(month, "bugfixes")).toBe("2026-08-bugfixes");
  });
});

describe("summarizeMonth", () => {
  it("joins the non-empty sections with commas and a final 'and'", () => {
    expect(summarizeMonth(month)).toBe(
      "1\u00a0new feature, 2\u00a0improvements and 3\u00a0bugfixes",
    );
  });

  it("binds every count to its noun so a line never wraps between them", () => {
    const summary = summarizeMonth(month) ?? "";
    expect(summary).not.toMatch(/\d /);
    expect(summary.match(/\u00a0/g)).toHaveLength(3);
  });

  it("skips empty sections", () => {
    expect(summarizeMonth({ ...month, features: [], improvements: [] })).toBe("3\u00a0bugfixes");
  });

  it("returns null for an empty month", () => {
    expect(summarizeMonth({ ...month, features: [], improvements: [], bugfixes: [] })).toBeNull();
  });
});

describe("summarizeMonthHtml", () => {
  it("wraps each count and nothing else", () => {
    expect(summarizeMonthHtml(month)).toBe(
      '<strong class="changelog-count">1</strong>\u00a0new feature, ' +
        '<strong class="changelog-count">2</strong>\u00a0improvements and ' +
        '<strong class="changelog-count">3</strong>\u00a0bugfixes',
    );
  });

  it("reads the same as the plain summary once the markup is stripped", () => {
    const html = summarizeMonthHtml(month) ?? "";
    expect(html.replace(/<[^>]+>/g, "")).toBe(summarizeMonth(month));
  });

  it("returns null for an empty month", () => {
    expect(
      summarizeMonthHtml({ ...month, features: [], improvements: [], bugfixes: [] }),
    ).toBeNull();
  });
});
