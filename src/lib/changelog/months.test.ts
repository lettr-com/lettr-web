import { describe, expect, it } from "vite-plus/test";
import { MONTHS, formatMonth, isMonthId, loadMonth, monthModules } from "./months";

const idFromPath = (path: string) => path.replace("./data/", "").replace(".ts", "");

describe("MONTHS registry", () => {
  it("has a data module for every registered month, and vice versa", () => {
    const registered = [...MONTHS].sort();
    const onDisk = Object.keys(monthModules).map(idFromPath).sort();
    expect(registered).toEqual(onDisk);
  });

  it("contains no duplicates", () => {
    expect(new Set(MONTHS).size).toBe(MONTHS.length);
  });

  it("is ordered newest first", () => {
    expect([...MONTHS]).toEqual([...MONTHS].sort().reverse());
  });

  it("uses YYYY-MM ids", () => {
    for (const id of MONTHS) expect(id).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
  });

  it("gives every data module an id matching its filename", async () => {
    for (const id of MONTHS) {
      const month = await loadMonth(id);
      expect(month.id).toBe(id);
    }
  });

  it("gives every entry at least one module and a non-empty title and lead", async () => {
    for (const id of MONTHS) {
      const month = await loadMonth(id);
      for (const entry of [...month.features, ...month.improvements]) {
        expect(entry.modules.length, `${id}: ${entry.title}`).toBeGreaterThan(0);
        expect(entry.title.trim()).not.toBe("");
        expect(entry.lead.trim()).not.toBe("");
      }
      for (const fix of month.bugfixes) {
        expect(fix.modules.length, `${id}: ${fix.text}`).toBeGreaterThan(0);
        expect(fix.text.trim()).not.toBe("");
      }
    }
  });

  it("only ever links to verified docs.lettr.com pages", async () => {
    for (const id of MONTHS) {
      const month = await loadMonth(id);
      for (const entry of [...month.features, ...month.improvements]) {
        if (!entry.docs) continue;
        expect(entry.docs.href, `${id}: ${entry.title}`).toMatch(/^https:\/\/docs\.lettr\.com\//);
      }
    }
  });
});

describe("isMonthId", () => {
  it("accepts a registered month and rejects anything else", () => {
    expect(isMonthId(MONTHS[0])).toBe(true);
    expect(isMonthId("1999-01")).toBe(false);
    expect(isMonthId("nonsense")).toBe(false);
  });
});

describe("formatMonth", () => {
  it("renders a readable month and year", () => {
    expect(formatMonth("2026-08")).toBe("August 2026");
    expect(formatMonth("2026-01")).toBe("January 2026");
    expect(formatMonth("2026-12")).toBe("December 2026");
  });

  it("falls back to the raw id for an unparseable month", () => {
    expect(formatMonth("2026-99")).toBe("2026-99");
  });
});

describe("loadMonth", () => {
  it("throws for a month with no data module", async () => {
    await expect(loadMonth("1999-01")).rejects.toThrow(/1999-01/);
  });
});
