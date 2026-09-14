import { describe, expect, it } from "vite-plus/test";
import { parseTermFile, splitFrontmatter } from "./frontmatter";

const raw = `---
term: DKIM
fullName: DomainKeys Identified Mail
description: "DKIM signs email: a private key, a public key in DNS."
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

describe("parseTermFile", () => {
  it("builds the meta with the slug and defaults", () => {
    const { meta, body } = parseTermFile("dkim", raw);
    expect(meta).toEqual({
      slug: "dkim",
      term: "DKIM",
      fullName: "DomainKeys Identified Mail",
      question: "What is",
      description: "DKIM signs email: a private key, a public key in DNS.",
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

  it("defaults related and reading to empty lists and question to What is", () => {
    const { meta } = parseTermFile("x", '---\nterm: X\ndescription: "d"\n---\nbody');
    expect(meta.question).toBe("What is");
    expect(meta.related).toEqual([]);
    expect(meta.reading).toEqual([]);
    expect(meta.fullName).toBeUndefined();
  });

  it("keeps an explicit question", () => {
    const { meta } = parseTermFile(
      "ehlo-helo",
      '---\nterm: EHLO / HELO\nquestion: What are\ndescription: "d"\n---\nbody',
    );
    expect(meta.question).toBe("What are");
  });

  it("throws with the file name when term or description is missing", () => {
    expect(() => parseTermFile("x", '---\ndescription: "d"\n---\nbody', "x.md")).toThrow(
      /x\.md.*term/,
    );
    expect(() => parseTermFile("x", "---\nterm: X\n---\nbody", "x.md")).toThrow(
      /x\.md.*description/,
    );
  });

  it("throws when related is not a list of strings or reading entries lack title/href", () => {
    expect(() =>
      parseTermFile("x", '---\nterm: X\ndescription: "d"\nrelated: spf\n---\nbody', "x.md"),
    ).toThrow(/related/);
    expect(() =>
      parseTermFile(
        "x",
        '---\nterm: X\ndescription: "d"\nreading:\n  - title: T\n---\nbody',
        "x.md",
      ),
    ).toThrow(/reading/);
  });
});
