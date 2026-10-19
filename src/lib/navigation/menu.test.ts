import { describe, expect, it } from "vite-plus/test";
import type { PostMeta } from "$lib/data/posts";
import { activeSection, featuredPost, isCurrentItem, menus } from "./menu";

describe("activeSection", () => {
  it("marks Pricing on the pricing page", () => {
    expect(activeSection("/pricing/")).toBe("pricing");
    expect(activeSection("/pricing")).toBe("pricing");
  });

  it("maps product and resource pages to their menu", () => {
    expect(activeSection("/email-api/")).toBe("product");
    expect(activeSection("/platform/templates/")).toBe("product");
    expect(activeSection("/blog/smtp-relay/")).toBe("resources");
    expect(activeSection("/compare/resend/")).toBe("resources");
  });

  it("returns null for the homepage", () => {
    expect(activeSection("/")).toBeNull();
  });
});

describe("isCurrentItem", () => {
  it("matches internal links only", () => {
    const [product] = menus;
    const emailApi = product.sections[0].items[0];
    expect(isCurrentItem(emailApi, "/email-api")).toBe(true);
    expect(isCurrentItem({ label: "Docs", href: "/", external: true }, "/")).toBe(false);
  });
});

describe("featuredPost", () => {
  const post = (slug: string, category: string): PostMeta => ({
    slug,
    category,
    title: slug,
    excerpt: "",
    author: "",
    date: "",
    readTime: "",
  });

  it("picks the newest case study or product post", () => {
    const list = [post("a", "Fundamentals"), post("b", "Case study"), post("c", "Product")];
    expect(featuredPost(list)?.slug).toBe("b");
  });
});

describe("menu copy", () => {
  it("contains no em dashes", () => {
    const text = JSON.stringify(menus);
    expect(text).not.toContain("\u2014");
  });

  it("gives every item outside the quickstart grid a description", () => {
    for (const menu of menus) {
      for (const section of menu.sections) {
        if (section.id === "quickstarts") continue;
        for (const item of section.items) expect(item.description, item.label).toBeTruthy();
      }
    }
  });
});
