import { describe, expect, it } from "vite-plus/test";
import {
  buildIndex,
  buildNeighbours,
  buildTerm,
  readSources,
  resolveRelated,
  slugFromPath,
} from "./terms";

const file = (term: string, extra = "") =>
  `---\nterm: ${term}\ndescription: "About ${term}."\n${extra}---\n**${term}** is a thing.\n\n## ${term} in Lettr\n\nText.\n`;

const files = {
  "./terms/beta.md": file("Beta"),
  "./terms/alpha.md": file("alpha", "related: [beta]\n"),
  "./terms/gamma.md": file("Gamma", "fullName: Gamma Ray\n"),
};

describe("slugFromPath", () => {
  it("takes the file name without extension", () => {
    expect(slugFromPath("./terms/hard-bounce.md")).toBe("hard-bounce");
  });
});

describe("readSources", () => {
  it("parses every file, names it by slug, and sorts case-insensitively by label", () => {
    const sources = readSources(files);
    expect(sources.map((s) => s.meta.slug)).toEqual(["alpha", "beta", "gamma"]);
    expect(sources[2].meta.fullName).toBe("Gamma Ray");
  });

  it("throws when there are no term files", () => {
    expect(() => readSources({})).toThrow(/no glossary terms/);
  });

  it("names the broken file in the error", () => {
    expect(() => readSources({ "./terms/bad.md": "no fence" })).toThrow(/bad\.md/);
  });

  it("throws on a related slug without a file", () => {
    expect(() =>
      readSources({ ...files, "./terms/delta.md": file("Delta", "related: [zeta]\n") }),
    ).toThrow(/delta\.md.*zeta/);
  });

  it("throws on a body link to a term without a file", () => {
    const delta = file("Delta").replace("is a thing.", "links [Zeta](/glossary/zeta/).");
    expect(() => readSources({ ...files, "./terms/delta.md": delta })).toThrow(/delta\.md.*zeta/);
  });
});

describe("buildIndex", () => {
  it("returns links with glossary hrefs", () => {
    expect(buildIndex(files)).toEqual([
      { slug: "alpha", term: "alpha", href: "/glossary/alpha/" },
      { slug: "beta", term: "Beta", href: "/glossary/beta/" },
      { slug: "gamma", term: "Gamma", href: "/glossary/gamma/" },
    ]);
  });
});

describe("buildTerm", () => {
  it("renders the body to html", () => {
    const term = buildTerm("beta", files);
    expect(term?.term).toBe("Beta");
    expect(term?.html).toContain("<strong>Beta</strong>");
    expect(term?.html).toContain('<h2 id="beta-in-lettr">Beta in Lettr</h2>');
  });

  it("returns undefined for an unknown slug", () => {
    expect(buildTerm("nope", files)).toBeUndefined();
  });
});

describe("buildNeighbours", () => {
  it("walks the sorted index", () => {
    expect(buildNeighbours("alpha", files)).toEqual({
      prev: undefined,
      next: { slug: "beta", term: "Beta", href: "/glossary/beta/" },
    });
    expect(buildNeighbours("beta", files).prev?.slug).toBe("alpha");
    expect(buildNeighbours("beta", files).next?.slug).toBe("gamma");
    expect(buildNeighbours("gamma", files).next).toBeUndefined();
  });

  it("returns nothing for an unknown slug", () => {
    expect(buildNeighbours("nope", files)).toEqual({});
  });
});

describe("resolveRelated", () => {
  it("maps slugs to links in the given order", () => {
    expect(resolveRelated(["gamma", "beta"], files).map((l) => l.term)).toEqual(["Gamma", "Beta"]);
  });
});
