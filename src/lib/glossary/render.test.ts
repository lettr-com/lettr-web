import { describe, expect, it } from "vite-plus/test";
import { renderTermBody } from "./render";

describe("renderTermBody", () => {
  it("opens absolute links in a new tab and keeps relative links in the same tab", () => {
    const html = renderTermBody("[Docs](https://docs.lettr.com/x) and [SPF](/glossary/spf/).");
    expect(html).toContain(
      '<a href="https://docs.lettr.com/x" target="_blank" rel="noopener noreferrer">Docs</a>',
    );
    expect(html).toContain('<a href="/glossary/spf/">SPF</a>');
  });

  it("gives headings slugified ids", () => {
    const html = renderTermBody("## How DKIM works\n\n### DKIM vs SPF");
    expect(html).toContain('<h2 id="how-dkim-works">How DKIM works</h2>');
    expect(html).toContain('<h3 id="dkim-vs-spf">DKIM vs SPF</h3>');
  });

  it("renders GFM inline markup and lists", () => {
    const html = renderTermBody("**DKIM** signs mail.\n\n- one\n- two");
    expect(html).toContain("<strong>DKIM</strong>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>two</li>");
  });

  it("escapes quotes in link titles and hrefs", () => {
    const html = renderTermBody('[x](/glossary/a/ "say \\"hi\\"")');
    expect(html).toContain('title="say &quot;hi&quot;"');
  });
});
