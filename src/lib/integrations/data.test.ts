import { describe, expect, test } from "vite-plus/test";

import { integrations } from "./data.ts";
import { detailIntegrations, hubFaqs, integrationHref, liveIntegrations } from "./index.ts";
import { HUB_DESCRIPTION, HUB_TITLE, integrationsLlmsTxt } from "./seo.ts";

const live = liveIntegrations();

describe("integration records", () => {
  test("slugs are unique, lowercase and URL-safe", () => {
    const slugs = integrations.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  test.each(live.map((entry) => [entry.slug, entry] as const))(
    "%s states a plain fact",
    (_, entry) => {
      expect(entry.statement).toMatch(/^Lettr works with .+\.$/);
      expect(entry.canDo.length).toBeGreaterThanOrEqual(1);
      expect(entry.canDo.length).toBeLessThanOrEqual(5);
      expect(entry.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(`${entry.statement} ${entry.summary}`).not.toMatch(/\bofficial\b/i);
    },
  );

  test("related slugs point at live entries", () => {
    const liveSlugs = new Set(live.map((entry) => entry.slug));
    for (const entry of live)
      for (const slug of entry.related ?? []) expect(liveSlugs).toContain(slug);
  });

  test("every card leads to the entry's own page, never off the site", () => {
    for (const entry of live) expect(integrationHref(entry)).toBe(`/integrations/${entry.slug}/`);
  });
});

describe("detail pages", () => {
  const details = detailIntegrations();

  test("every live entry has a page", () => {
    expect(details.map((entry) => entry.slug).sort()).toEqual(
      live.map((entry) => entry.slug).sort(),
    );
  });

  test.each(details.map((entry) => [entry.slug, entry] as const))(
    "%s fills the template",
    (_, entry) => {
      expect(entry.setup?.length).toBeGreaterThan(0);
      expect(entry.links.listing ?? entry.links.docs ?? entry.links.source).toBeTruthy();
      expect(entry.seo).toBeDefined();
      const { title, description, heading } = entry.seo!;
      expect(title.length).toBeGreaterThanOrEqual(50);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).toMatch(/^.+ Email Integration: .+ \| Lettr$/);
      expect(description.length).toBeLessThanOrEqual(155);
      expect(description).toMatch(/^Lettr works with /);
      expect(heading).toContain("Lettr");
    },
  );
});

describe("hub", () => {
  test("title and description fit", () => {
    expect(HUB_TITLE.length).toBeLessThanOrEqual(60);
    expect(HUB_DESCRIPTION.length).toBeLessThanOrEqual(155);
  });

  test("questions name only live SDKs", () => {
    const sdkAnswer = hubFaqs().find((faq) => faq.question.includes("SDK"))!.answer;
    expect(sdkAnswer).toContain("Node.js");
    expect(sdkAnswer).not.toContain("Python");
  });

  test("llms.txt has one line per live entry", () => {
    const lines = integrationsLlmsTxt()
      .split("\n")
      .filter((line) => line.startsWith("- ["));
    expect(lines).toHaveLength(live.length);
  });
});
