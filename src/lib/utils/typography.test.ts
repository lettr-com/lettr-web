import { describe, expect, it } from "vite-plus/test";
import { noWidow } from "./typography";

describe("noWidow", () => {
  it("joins the last two words with a non-breaking space", () => {
    expect(noWidow("Lettr's 79 MCP tools")).toBe("Lettr's 79 MCP tools");
  });

  it("keeps one-letter words on the line of the word after them", () => {
    expect(noWidow("The order we'd hand a new engineer setting up a sending domain.")).toBe(
      "The order we'd hand a\u00a0new engineer setting up a\u00a0sending\u00a0domain.",
    );
    expect(noWidow("A guide to SMTP")).toBe("A\u00a0guide to\u00a0SMTP");
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
