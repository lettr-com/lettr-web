import { describe, expect, it } from "vite-plus/test";
import { buildTerm, readSources } from "./terms";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FIRST_PERSON = /(^|[.!?]\s+)I\s/m;

// Loading also fails on any related slug or body link to a term without a file.
const sources = readSources();

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

describe("glossary content set", () => {
  it("links every term from at least one other term", () => {
    const linked = new Set<string>();
    for (const { meta, body } of sources) {
      const bodyLinks = [...body.matchAll(/\]\(\/glossary\/([^)/]+)\/\)/g)].map(
        (match) => match[1],
      );
      for (const slug of [...meta.related, ...bodyLinks]) if (slug !== meta.slug) linked.add(slug);
    }
    expect(sources.map(({ meta }) => meta.slug).filter((slug) => !linked.has(slug))).toEqual([]);
  });

  it("has unique labels", () => {
    expect(new Set(sources.map((source) => source.meta.term.toLowerCase())).size).toBe(
      sources.length,
    );
  });
});

for (const { meta, body } of sources) {
  describe(`term ${meta.slug}`, () => {
    it("has a valid slug and a label", () => {
      expect(meta.slug).toMatch(SLUG);
      expect(meta.term.trim()).not.toBe("");
    });

    it("has a question heading that names the term", () => {
      expect(meta.heading).toMatch(/^What (is|are) [^?]+\?$/);
      expect(meta.heading).not.toMatch(/^What (is|are) (A|An|The) /);
    });

    it("was updated on or after it was published", () => {
      expect(meta.updated >= meta.published, `${meta.published} to ${meta.updated}`).toBe(true);
    });

    it("has a 120 to 160 character description", () => {
      expect(meta.description.length).toBeGreaterThanOrEqual(120);
      expect(meta.description.length).toBeLessThanOrEqual(160);
    });

    it("lists 2 to 5 related terms, none itself", () => {
      expect(meta.related.length).toBeGreaterThanOrEqual(2);
      expect(meta.related.length).toBeLessThanOrEqual(5);
      expect(meta.related).not.toContain(meta.slug);
    });

    it("has 1 to 4 reading links on docs.lettr.com or lettr.com", () => {
      expect(meta.reading.length).toBeGreaterThanOrEqual(1);
      expect(meta.reading.length).toBeLessThanOrEqual(4);
      for (const link of meta.reading) {
        expect(link.title.trim()).not.toBe("");
        expect(
          link.href.startsWith("https://docs.lettr.com/") || link.href.startsWith("/"),
          link.href,
        ).toBe(true);
      }
    });

    it("has a 450 to 900 word body with no H1", () => {
      const words = wordCount(body);
      expect(words, `${meta.slug}: ${words} words`).toBeGreaterThanOrEqual(450);
      expect(words, `${meta.slug}: ${words} words`).toBeLessThanOrEqual(900);
      expect(body).not.toMatch(/^# /m);
    });

    it("bolds the term in the first paragraph", () => {
      expect(body.split(/\n\s*\n/)[0]).toContain("**");
    });

    it("closes with an in Lettr section", () => {
      const headings = body.match(/^## .+$/gm) ?? [];
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[headings.length - 1]).toMatch(/ in Lettr$/);
    });

    it("uses no em dashes and no first person", () => {
      expect(body).not.toContain(" — ");
      expect(body).not.toMatch(FIRST_PERSON);
    });

    it("opens with a one-sentence definition of 40 to 240 characters", () => {
      const definition = buildTerm(meta.slug)?.definition ?? "";
      expect(definition.length, definition).toBeGreaterThanOrEqual(40);
      expect(definition.length, definition).toBeLessThanOrEqual(240);
      expect(definition).toMatch(/[.!?]$/);
    });

    it("renders through the real loader", () => {
      expect(buildTerm(meta.slug)?.html).toContain("<h2");
    });
  });
}
