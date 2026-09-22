import { describe, expect, it } from "vite-plus/test";
import { pageToMarkdown } from "./markdown";

function page(main: string, head = ""): string {
  return `<html><head><title>Pricing — Lettr</title><meta name="description" content="Plans &amp; tiers">${head}</head><body><nav><a href="/">Home</a></nav><main>${main}</main><footer>Footer</footer></body></html>`;
}

describe("pageToMarkdown", () => {
  it("prefixes frontmatter from the title, description and canonical url", () => {
    const md = pageToMarkdown(
      page("<h1>Pricing</h1>", '<link rel="canonical" href="https://lettr.com/pricing/">'),
      "/pricing/",
    );
    expect(md).toMatch(
      /^---\ntitle: "Pricing — Lettr"\ndescription: "Plans & tiers"\nurl: "https:\/\/lettr.com\/pricing\/"\n---\n\n# Pricing\n$/,
    );
  });

  it("falls back to the page path when there is no canonical link", () => {
    expect(pageToMarkdown(page("<p>x</p>"), "/about/")).toContain(
      'url: "https://lettr.com/about/"',
    );
  });

  it("converts only <main> and drops controls, decoration and skipped mockups", () => {
    const md = pageToMarkdown(
      page(
        '<p>Kept</p><button>Copy</button><svg><text>icon</text></svg><span aria-hidden="true">deco</span><div data-markdown="skip">Create mutation</div>',
      ),
      "/",
    );
    expect(md).toContain("Kept");
    for (const dropped of ["Home", "Footer", "Copy", "icon", "deco", "Create mutation"]) {
      expect(md).not.toContain(dropped);
    }
  });

  it("makes site-relative links and images absolute and drops images without alt text", () => {
    const md = pageToMarkdown(
      page(
        '<a href="/pricing/">Pricing</a> <a href="https://docs.lettr.com">Docs</a><img src="/a.svg" alt="Topol"><img src="/b.svg" alt="">',
      ),
      "/",
    );
    expect(md).toContain("[Pricing](https://lettr.com/pricing/)");
    expect(md).toContain("[Docs](https://docs.lettr.com)");
    expect(md).toContain("![Topol](https://lettr.com/a.svg)");
    expect(md).not.toContain("b.svg");
  });

  it("keeps the label of labelled icons, such as table checkmarks", () => {
    const md = pageToMarkdown(
      page(
        '<table><tr><th>Feature</th><th>Pro</th></tr><tr><td>SMTP</td><td><svg role="img" aria-label="Included"></svg></td></tr></table>',
      ),
      "/",
    );
    expect(md).toContain("| SMTP    | Included |");
  });

  it("rebuilds a FAQ accordion from the FAQPage JSON-LD in @graph", () => {
    const jsonLd = JSON.stringify({
      "@graph": [
        { "@type": "Organization" },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Is it <free>?",
              acceptedAnswer: { "@type": "Answer", text: "Yes." },
            },
          ],
        },
      ],
    });
    const md = pageToMarkdown(
      page(
        '<h2>FAQ</h2><div data-markdown="faq"><button><h3>Is it &lt;free&gt;?</h3></button></div>',
        `<script type="application/ld+json">${jsonLd}</script>`,
      ),
      "/",
    );
    expect(md).toContain("## FAQ\n\n### Is it <free>?\n\nYes.");
  });

  it("describes a redirect stub by its target", () => {
    const md = pageToMarkdown('<meta http-equiv="refresh" content="0;url=/demo/">', "/book/");
    expect(md).toBe(
      '---\nurl: "https://lettr.com/book/"\n---\n\nThis page moved to https://lettr.com/demo/\n',
    );
  });
});
