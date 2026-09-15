import { describe, expect, it } from "vite-plus/test";
import { LETTERS, groupByLetter, letterFor } from "./letters";
import type { GlossaryTermLink } from "./types";

const link = (term: string): GlossaryTermLink => {
  const slug = term.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return { slug, term, href: `/glossary/${slug}/` };
};

describe("LETTERS", () => {
  it("is A to Z followed by #", () => {
    expect(LETTERS).toHaveLength(27);
    expect(LETTERS[0]).toBe("A");
    expect(LETTERS[25]).toBe("Z");
    expect(LETTERS[26]).toBe("#");
  });
});

describe("letterFor", () => {
  it("uppercases the first character", () => {
    expect(letterFor("DKIM")).toBe("D");
    expect(letterFor("email header")).toBe("E");
  });

  it("puts anything outside A to Z under #", () => {
    expect(letterFor("2FA")).toBe("#");
    expect(letterFor("éclair")).toBe("#");
    expect(letterFor("")).toBe("#");
  });
});

describe("groupByLetter", () => {
  it("returns only non-empty groups in letter order and keeps input order inside a group", () => {
    const groups = groupByLetter([link("Bounce"), link("ARC"), link("Bulk Sender"), link("2FA")]);
    expect(groups.map((g) => g.letter)).toEqual(["A", "B", "#"]);
    expect(groups[1].terms.map((t) => t.term)).toEqual(["Bounce", "Bulk Sender"]);
  });

  it("returns an empty list for no terms", () => {
    expect(groupByLetter([])).toEqual([]);
  });
});
