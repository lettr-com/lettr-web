import { describe, expect, it } from "vite-plus/test";
import { classifyBlogLink, newDepths } from "./blog";

describe("classifyBlogLink", () => {
  it("recognises signup, docs and article links", () => {
    expect(classifyBlogLink("https://app.lettr.com/register")).toBe("signup");
    expect(classifyBlogLink("https://docs.lettr.com/learn/mcp/api-key-auth")).toBe("docs");
    expect(classifyBlogLink("/blog/what-is-transactional-email/")).toBe("article");
    expect(classifyBlogLink("https://lettr.com/blog/smtp-relay/")).toBe("article");
  });

  it("treats other lettr.com pages as product links", () => {
    expect(classifyBlogLink("/pricing/")).toBe("product");
    expect(classifyBlogLink("/glossary/spf/")).toBe("product");
    expect(classifyBlogLink("/blog/")).toBe("product");
  });

  it("treats other sites, and the app outside registration, as external", () => {
    expect(classifyBlogLink("https://www.rfc-editor.org/rfc/rfc5321")).toBe("external");
    expect(classifyBlogLink("https://app.lettr.com/login")).toBe("external");
  });
});

describe("newDepths", () => {
  it("returns each depth once, in order", () => {
    expect(newDepths(0, 30)).toEqual([25]);
    expect(newDepths(25, 80)).toEqual([50, 75]);
    expect(newDepths(80, 100)).toEqual([100]);
    expect(newDepths(100, 100)).toEqual([]);
  });
});
