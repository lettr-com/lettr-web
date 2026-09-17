import { describe, expect, it } from "vitest";
import { blogPostJsonLd, featurePageJsonLd } from "./pageJsonLd";

const post = {
  slug: "introducing-multilingual-campaigns",
  title: "Introducing multilingual campaigns",
  description: "One email, several languages.",
  datetime: "2026-09-16",
  category: "Product",
  author: {
    name: "Erik Vlčák",
    role: "Customer Success Engineer",
    avatar: "/images/authors/erik.jpg",
  },
};

function node(graph: Record<string, unknown>[], type: string) {
  return graph.find((entry) => entry["@type"] === type);
}

describe("blogPostJsonLd", () => {
  it("describes the post with a canonical trailing-slash URL and absolute images", () => {
    const graph = blogPostJsonLd(post)["@graph"] as Record<string, unknown>[];
    const article = node(graph, "BlogPosting")!;
    expect(article.url).toBe("https://lettr.com/blog/introducing-multilingual-campaigns/");
    expect(article.datePublished).toBe("2026-09-16");
    expect(article.dateModified).toBe("2026-09-16");
    expect(article.image).toBe("https://lettr.com/og-image.png");
    expect(article.publisher).toEqual({ "@id": "https://lettr.com/#organization" });
    expect((article.author as Record<string, unknown>).image).toBe(
      "https://lettr.com/images/authors/erik.jpg",
    );
  });

  it("uses dateModified when given and ends the breadcrumb on the post", () => {
    const graph = blogPostJsonLd({ ...post, dateModified: "2026-09-17" })["@graph"] as Record<
      string,
      unknown
    >[];
    expect(node(graph, "BlogPosting")!.dateModified).toBe("2026-09-17");
    const items = node(graph, "BreadcrumbList")!.itemListElement as Record<string, unknown>[];
    expect(items.map((item) => item.name)).toEqual(["Home", "Blog", post.title]);
  });

  it("emits FAQPage only when the post has FAQs", () => {
    expect(
      node(blogPostJsonLd(post)["@graph"] as Record<string, unknown>[], "FAQPage"),
    ).toBeUndefined();
    const graph = blogPostJsonLd({ ...post, faqs: [{ question: "Q?", answer: "A." }] })[
      "@graph"
    ] as Record<string, unknown>[];
    expect(node(graph, "FAQPage")!.mainEntity).toEqual([
      { "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } },
    ]);
  });
});

describe("featurePageJsonLd", () => {
  it("builds a WebPage with a breadcrumb for the path", () => {
    const graph = featurePageJsonLd({
      path: "/platform/multilingual-campaigns/",
      title: "Multilingual Email Campaigns",
      description: "d",
    })["@graph"] as Record<string, unknown>[];
    const page = node(graph, "WebPage")!;
    expect(page.url).toBe("https://lettr.com/platform/multilingual-campaigns/");
    expect(node(graph, "Organization")!["@id"]).toBe("https://lettr.com/#organization");
    expect(node(graph, "WebSite")!["@id"]).toBe("https://lettr.com/#website");
    expect(page.breadcrumb).toEqual({
      "@id": "https://lettr.com/platform/multilingual-campaigns/#breadcrumb",
    });
  });
});
