import { describe, expect, it } from "vite-plus/test";
import { parseTermFile, splitFrontmatter } from "./frontmatter";

const raw = `---
term: DKIM
fullName: DomainKeys Identified Mail
heading: "What is DKIM?"
description: "DKIM signs email: a private key, a public key in DNS."
published: 2026-09-14
updated: "2026-09-15"
related: [spf, dmarc]
reading:
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
---
**DKIM** is a signature.

## DKIM in Lettr

Text.
`;

describe("splitFrontmatter", () => {
  it("separates the YAML block from the body", () => {
    const { data, body } = splitFrontmatter(raw, "dkim.md");
    expect(data.term).toBe("DKIM");
    expect(body.startsWith("**DKIM** is a signature.")).toBe(true);
    expect(body.endsWith("Text.")).toBe(true);
  });

  it("throws with the file name when the fence is missing", () => {
    expect(() => splitFrontmatter("no fence here", "broken.md")).toThrow(/broken\.md/);
  });

  it("throws when the block is not a mapping", () => {
    expect(() => splitFrontmatter("---\n- a\n- b\n---\nbody", "list.md")).toThrow(/list\.md/);
  });
});

const required =
  'heading: "What is X?"\ndescription: "d"\npublished: 2026-09-14\nupdated: 2026-09-15\n';

describe("parseTermFile", () => {
  it("builds the meta with the slug and defaults", () => {
    const { meta, body } = parseTermFile("dkim", raw);
    expect(meta).toEqual({
      slug: "dkim",
      term: "DKIM",
      fullName: "DomainKeys Identified Mail",
      heading: "What is DKIM?",
      description: "DKIM signs email: a private key, a public key in DNS.",
      published: "2026-09-14",
      updated: "2026-09-15",
      related: ["spf", "dmarc"],
      reading: [
        {
          title: "Understanding SPF, DKIM, and DMARC",
          href: "https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc",
        },
      ],
    });
    expect(body).toContain("## DKIM in Lettr");
  });

  it("defaults related and reading to empty lists", () => {
    const { meta } = parseTermFile("x", `---\nterm: X\n${required}---\nbody`);
    expect(meta.related).toEqual([]);
    expect(meta.reading).toEqual([]);
    expect(meta.fullName).toBeUndefined();
  });

  it("throws with the file name when the heading or a date is missing or malformed", () => {
    const without = (key: string) =>
      `---\nterm: X\n${required
        .split("\n")
        .filter((line) => !line.startsWith(`${key}:`))
        .join("\n")}---\nbody`;
    expect(() => parseTermFile("x", without("heading"), "x.md")).toThrow(/x\.md.*heading/);
    expect(() => parseTermFile("x", without("published"), "x.md")).toThrow(/x\.md.*published/);
    expect(() =>
      parseTermFile(
        "x",
        `---\nterm: X\n${required.replace("2026-09-15", "15.9.2026")}---\nbody`,
        "x.md",
      ),
    ).toThrow(/x\.md.*updated/);
  });

  it("throws with the file name when term or description is missing", () => {
    expect(() =>
      parseTermFile(
        "x",
        '---\nheading: "What is X?"\ndescription: "d"\npublished: 2026-09-14\nupdated: 2026-09-15\n---\nbody',
        "x.md",
      ),
    ).toThrow(/x\.md.*term/);
    expect(() =>
      parseTermFile("x", '---\nterm: X\nheading: "What is X?"\n---\nbody', "x.md"),
    ).toThrow(/x\.md.*description/);
  });

  it("throws when related is not a list of strings or reading entries lack title/href", () => {
    expect(() =>
      parseTermFile(
        "x",
        '---\nterm: X\nheading: "What is X?"\ndescription: "d"\npublished: 2026-09-14\nupdated: 2026-09-15\nrelated: spf\n---\nbody',
        "x.md",
      ),
    ).toThrow(/related/);
    expect(() =>
      parseTermFile(
        "x",
        '---\nterm: X\nheading: "What is X?"\ndescription: "d"\npublished: 2026-09-14\nupdated: 2026-09-15\nreading:\n  - title: T\n---\nbody',
        "x.md",
      ),
    ).toThrow(/reading/);
  });
});
