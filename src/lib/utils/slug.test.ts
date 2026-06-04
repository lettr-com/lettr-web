import { describe, expect, it } from "vite-plus/test";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("When it breaks")).toBe("when-it-breaks");
  });

  it("collapses runs of non-alphanumerics to a single dash", () => {
    expect(slugify("Domains, DKIM & SPF")).toBe("domains-dkim-spf");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugify("  Hello!  ")).toBe("hello");
    expect(slugify("...intro...")).toBe("intro");
  });

  it("preserves numbers", () => {
    expect(slugify("Step 2 of 3")).toBe("step-2-of-3");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("returns empty string for symbol-only input", () => {
    expect(slugify("!!! @#$ ???")).toBe("");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(slugify("   ")).toBe("");
  });
});
