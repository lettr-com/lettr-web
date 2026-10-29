import { describe, expect, it } from "vite-plus/test";
import { noWidow } from "./typography";

describe("noWidow", () => {
  it("joins the last two words with a non-breaking space", () => {
    expect(noWidow("Lettr's 79 MCP tools")).toBe("Lettr's 79 MCP tools");
  });

  it("leaves single words and empty strings alone", () => {
    expect(noWidow("Blog")).toBe("Blog");
    expect(noWidow("")).toBe("");
  });

  it("ignores surrounding whitespace", () => {
    expect(noWidow("  Introducing multilingual campaigns ")).toBe(
      "Introducing multilingual campaigns",
    );
  });
});
