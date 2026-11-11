import { describe, expect, test } from "vite-plus/test";

import { liveIntegrations } from "./index.ts";
import { filterByLetter, letterOf, normalize, searchIntegrations } from "./search.ts";

const live = liveIntegrations();
const slugsFor = (query: string) => searchIntegrations(live, query).map((entry) => entry.slug);

describe("normalize", () => {
  test("lowercases, strips accents and punctuation", () => {
    expect(normalize("Tray.ai")).toBe("tray ai");
    expect(normalize("  Café  SMTP! ")).toBe("cafe smtp");
  });
});

describe("searchIntegrations", () => {
  test("an empty query keeps every entry in order", () => {
    expect(slugsFor("")).toEqual(live.map((entry) => entry.slug));
    expect(slugsFor("   ")).toHaveLength(live.length);
  });

  test("finds by name, case-insensitively, from the start of a word", () => {
    expect(slugsFor("SUPA")).toContain("supabase");
    expect(slugsFor("base")).not.toContain("supabase");
  });

  test("finds by alias", () => {
    expect(slugsFor("javascript")).toContain("nodejs");
    expect(slugsFor("pica")).toEqual(["one"]);
    expect(slugsFor("claude")).toContain("mcp");
  });

  test("finds by builder and type", () => {
    expect(slugsFor("built by composio")).toEqual(["composio"]);
    expect(slugsFor("sdk")).toEqual(expect.arrayContaining(["nodejs", "php", "go", "rust"]));
  });

  test("every word must match", () => {
    expect(slugsFor("tray ai")).toEqual(["tray"]);
    expect(slugsFor("stripe zzz")).toEqual([]);
  });

  test("held entries are never found", () => {
    expect(slugsFor("zapier")).toEqual([]);
  });
});

describe("letters", () => {
  test("an entry files under its sort name, else its name", () => {
    expect(letterOf({ name: "Hosted MCP server", sortName: "MCP server" })).toBe("M");
    expect(letterOf({ name: "n8n" })).toBe("N");
    expect(letterOf({ name: "1Password" })).toBe("#");
  });

  test("filtering by letter keeps order, null keeps everything", () => {
    expect(filterByLetter(live, "S").map((entry) => entry.slug)).toEqual([
      "supabase",
      "stripe",
      "smtp-relay",
    ]);
    expect(filterByLetter(live, null)).toHaveLength(live.length);
  });
});
