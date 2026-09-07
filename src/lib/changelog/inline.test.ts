import { describe, expect, it } from "vite-plus/test";
import { renderInline } from "./inline";

describe("renderInline", () => {
  it("escapes HTML before doing anything else", () => {
    expect(renderInline('a & b < c > d "e"')).toBe("a &amp; b &lt; c &gt; d &quot;e&quot;");
  });

  it("does not let authored markup through", () => {
    expect(renderInline("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("renders backtick code spans", () => {
    expect(renderInline("call `POST /audience/contacts/bulk` once")).toBe(
      'call <code class="changelog-code">POST /audience/contacts/bulk</code> once',
    );
  });

  it("escapes inside code spans too", () => {
    expect(renderInline("`<b>`")).toBe('<code class="changelog-code">&lt;b&gt;</code>');
  });

  it("renders external links with a safe rel", () => {
    expect(renderInline("see [the docs](https://docs.lettr.com/learn/audience/topics)")).toBe(
      'see <a href="https://docs.lettr.com/learn/audience/topics" target="_blank"' +
        ' rel="noopener noreferrer" class="changelog-link">the docs</a>',
    );
  });

  it("renders internal links in the same tab", () => {
    expect(renderInline("[support](/support/)")).toBe(
      '<a href="/support/" class="changelog-link">support</a>',
    );
  });

  it("lets a code span win over a link that starts later", () => {
    expect(renderInline("`[a](b)`")).toBe('<code class="changelog-code">[a](b)</code>');
  });

  it("rejects non-navigational hrefs, keeping the label as text", () => {
    expect(renderInline("[click](javascript:void0)")).toBe("click");
    expect(renderInline("[click](data:text/html,x)")).toBe("click");
  });

  it("ignores every other markdown construct", () => {
    expect(renderInline("**bold** and *em* and # heading")).toBe("**bold** and *em* and # heading");
  });

  it("returns an empty string unchanged", () => {
    expect(renderInline("")).toBe("");
  });
});
