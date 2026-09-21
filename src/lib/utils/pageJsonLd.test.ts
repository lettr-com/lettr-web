import { describe, expect, it } from "vitest";
import {
  basicPageJsonLd,
  blogPostJsonLd,
  featurePageJsonLd,
  productPageJsonLd,
} from "./pageJsonLd";

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

describe("productPageJsonLd", () => {
  it("describes Lettr with only the four allowed fields", () => {
    const graph = productPageJsonLd({
      path: "/pricing/",
      name: "Pricing",
      description: "Lettr pricing.",
    })["@graph"] as Record<string, unknown>[];
    expect(node(graph, "SoftwareApplication")).toEqual({
      "@type": "SoftwareApplication",
      name: "Lettr",
      description: "Lettr pricing.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    });
    const items = node(graph, "BreadcrumbList")!.itemListElement as Record<string, unknown>[];
    expect(items.map((item) => item.item)).toEqual([
      "https://lettr.com/",
      "https://lettr.com/pricing/",
    ]);
  });

  it("names Lettr, not the competitor, and puts the parent in the breadcrumb", () => {
    const graph = productPageJsonLd({
      path: "/compare/postmark/",
      name: "Lettr vs Postmark",
      description: "d",
      parent: { name: "Compare", path: "/compare/" },
    })["@graph"] as Record<string, unknown>[];
    expect(node(graph, "SoftwareApplication")!.name).toBe("Lettr");
    const breadcrumb = node(graph, "BreadcrumbList")!;
    expect(breadcrumb["@id"]).toBe("https://lettr.com/compare/postmark/#breadcrumb");
    expect(breadcrumb.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "https://lettr.com/" },
      { "@type": "ListItem", position: 2, name: "Compare", item: "https://lettr.com/compare/" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Lettr vs Postmark",
        item: "https://lettr.com/compare/postmark/",
      },
    ]);
  });
});

describe("basicPageJsonLd", () => {
  it("defaults to a WebPage with the shared Organization and WebSite", () => {
    const graph = basicPageJsonLd({ path: "/support/", name: "Support & Contact" })[
      "@graph"
    ] as Record<string, unknown>[];
    expect(node(graph, "WebPage")).toEqual({
      "@type": "WebPage",
      "@id": "https://lettr.com/support/",
      url: "https://lettr.com/support/",
      name: "Support & Contact",
      isPartOf: { "@id": "https://lettr.com/#website" },
    });
    expect(node(graph, "Organization")).toBeDefined();
    expect(node(graph, "WebSite")).toBeDefined();
  });

  it("uses the given page type", () => {
    const graph = basicPageJsonLd({ path: "/about/", name: "About Lettr", type: "AboutPage" })[
      "@graph"
    ] as Record<string, unknown>[];
    expect(node(graph, "AboutPage")!.url).toBe("https://lettr.com/about/");
    expect(node(graph, "WebPage")).toBeUndefined();
  });
});
