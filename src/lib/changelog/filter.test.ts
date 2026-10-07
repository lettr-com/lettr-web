import { describe, expect, it } from "vite-plus/test";
import {
  describeFilter,
  entryCount,
  filterMonth,
  filterQuery,
  matchesFilter,
  monthHref,
  parseFilter,
  summarizeMatches,
  toggleFilter,
} from "./filter";
import type { ChangelogMonth } from "./types";

const month: ChangelogMonth = {
  id: "2026-08",
  published: "2026-08-31",
  features: [
    { title: "Retries", modules: ["transactional"], tags: ["API"], lead: "Lead." },
    { title: "Editor", modules: ["campaigns"], tags: ["UI/UX"], lead: "Lead." },
  ],
  improvements: [
    { title: "Imports", modules: ["audience"], lead: "Lead." },
    { title: "Console", modules: ["platform"], tags: ["UI/UX", "Performance"], lead: "Lead." },
  ],
  bugfixes: [
    { modules: ["transactional"], tags: ["Webhooks"], text: "Fixed webhook retries." },
    { modules: ["campaigns"], text: "Fixed send times." },
  ],
};

describe("parseFilter", () => {
  it("reads slugs back into tokens", () => {
    expect(parseFilter(["transactional", "ui-ux"])).toEqual(["transactional", "UI/UX"]);
  });

  it("normalises to display order so the same selection is always the same link", () => {
    expect(parseFilter(["ui-ux", "api", "campaigns"])).toEqual(["campaigns", "API", "UI/UX"]);
  });

  it("drops unknown and duplicate slugs rather than failing the page", () => {
    expect(parseFilter(["api", "does-not-exist", "api", ""])).toEqual(["API"]);
  });
});

describe("filterQuery", () => {
  it("writes one param per token, leaving slashes unescaped", () => {
    expect(filterQuery(["transactional", "UI/UX"])).toBe("?filter=transactional&filter=ui-ux");
  });

  it("is empty for an empty selection", () => {
    expect(filterQuery([])).toBe("");
  });

  it("round-trips through parseFilter", () => {
    const tokens = ["campaigns", "API", "Breaking"] as const;
    const values = new URLSearchParams(filterQuery(tokens)).getAll("filter");
    expect(parseFilter(values)).toEqual([...tokens]);
  });
});

describe("monthHref", () => {
  it("keeps the trailing slash the site is prerendered with", () => {
    expect(monthHref("2026-08")).toBe("/changelog/2026-08/");
  });

  it("carries the filter across months", () => {
    expect(monthHref("2026-08", ["API"])).toBe("/changelog/2026-08/?filter=api");
  });
});

describe("toggleFilter", () => {
  it("adds a token in display order, not click order", () => {
    expect(toggleFilter(["UI/UX"], "campaigns")).toEqual(["campaigns", "UI/UX"]);
  });

  it("removes a token that is already selected", () => {
    expect(toggleFilter(["campaigns", "UI/UX"], "campaigns")).toEqual(["UI/UX"]);
  });
});

describe("matchesFilter", () => {
  const entry = { modules: ["transactional" as const], tags: ["API" as const] };

  it("matches everything when nothing is selected", () => {
    expect(matchesFilter(entry, [])).toBe(true);
  });

  it("matches on a module", () => {
    expect(matchesFilter(entry, ["transactional"])).toBe(true);
  });

  it("matches on a tag", () => {
    expect(matchesFilter(entry, ["API"])).toBe(true);
  });

  it("unions the selection rather than intersecting it", () => {
    expect(matchesFilter(entry, ["campaigns", "API"])).toBe(true);
  });

  it("excludes an entry carrying none of the selected badges", () => {
    expect(matchesFilter(entry, ["campaigns", "UI/UX"])).toBe(false);
  });

  it("handles an entry with no tags at all", () => {
    expect(matchesFilter({ modules: ["audience"] }, ["audience"])).toBe(true);
    expect(matchesFilter({ modules: ["audience"] }, ["API"])).toBe(false);
  });
});

describe("filterMonth", () => {
  it("returns the month untouched when nothing is selected", () => {
    expect(filterMonth(month, [])).toBe(month);
  });

  it("reduces every section, keeping the month id", () => {
    const filtered = filterMonth(month, ["transactional"]);
    expect(filtered.id).toBe("2026-08");
    expect(filtered.features.map((entry) => entry.title)).toEqual(["Retries"]);
    expect(filtered.improvements).toEqual([]);
    expect(filtered.bugfixes.map((fix) => fix.text)).toEqual(["Fixed webhook retries."]);
  });

  it("collects entries from every section for a cross-cutting tag", () => {
    expect(entryCount(filterMonth(month, ["UI/UX"]))).toBe(2);
  });

  it("can empty a month", () => {
    expect(entryCount(filterMonth(month, ["Docs"]))).toBe(0);
  });
});

describe("describeFilter", () => {
  it("names a single selection", () => {
    expect(describeFilter(["transactional"])).toBe("Transactional");
  });

  it("joins several with commas and a final 'or', matching the union it applies", () => {
    expect(describeFilter(["transactional", "API", "UI/UX"])).toBe("Transactional, API or UI/UX");
  });

  it("is empty for an empty selection", () => {
    expect(describeFilter([])).toBe("");
  });
});

describe("summarizeMatches", () => {
  it("says how many and which badges in one line", () => {
    expect(summarizeMatches(165, ["transactional", "API"])).toBe(
      "165 entries tagged Transactional or API",
    );
  });

  it("carries a denominator where one month is the whole population", () => {
    expect(summarizeMatches(3, ["transactional"], 28)).toBe("3 of 28 entries tagged Transactional");
  });

  it("pluralises on the count when there is no total", () => {
    expect(summarizeMatches(1, ["API"])).toBe("1 entry tagged API");
  });

  it("pluralises on the total when there is one, so '0 of 28' is not '0 of 28 entry'", () => {
    expect(summarizeMatches(0, ["API"], 28)).toBe("0 of 28 entries tagged API");
    expect(summarizeMatches(0, ["API"], 1)).toBe("0 of 1 entry tagged API");
  });

  it("closes cleanly, so the caller owns the punctuation", () => {
    expect(summarizeMatches(2, ["API"]).endsWith(".")).toBe(false);
  });
});
