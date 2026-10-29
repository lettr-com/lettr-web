import { describe, expect, it } from "vite-plus/test";
import { isNewTabLink, withSafeRel } from "./blogLinks";

describe("isNewTabLink", () => {
  it("opens links that leave lettr.com in a new tab", () => {
    expect(isNewTabLink("https://docs.lettr.com/learn/domains/sending-domains")).toBe(true);
    expect(isNewTabLink("https://app.lettr.com/register")).toBe(true);
    expect(isNewTabLink("https://www.rfc-editor.org/rfc/rfc5321")).toBe(true);
    expect(isNewTabLink("//cdn.example.com/file.pdf")).toBe(true);
  });

  it("keeps links to other lettr.com pages in the same tab", () => {
    expect(isNewTabLink("/pricing/")).toBe(false);
    expect(isNewTabLink("/blog/what-is-transactional-email/")).toBe(false);
    expect(isNewTabLink("https://lettr.com/email-api/")).toBe(false);
    expect(isNewTabLink("https://www.lettr.com/compare/")).toBe(false);
    expect(isNewTabLink("glossary/spf/")).toBe(false);
  });

  it("keeps in-page anchors and non-navigational schemes in the same tab", () => {
    expect(isNewTabLink("#faq")).toBe(false);
    expect(isNewTabLink("mailto:hello@lettr.com")).toBe(false);
    expect(isNewTabLink("tel:+420123456789")).toBe(false);
    expect(isNewTabLink("JavaScript:void(0)")).toBe(false);
  });

  it("ignores missing or empty hrefs", () => {
    expect(isNewTabLink(null)).toBe(false);
    expect(isNewTabLink(undefined)).toBe(false);
    expect(isNewTabLink("   ")).toBe(false);
  });
});

describe("withSafeRel", () => {
  it("adds noopener and noreferrer to an empty rel", () => {
    expect(withSafeRel(null)).toBe("noopener noreferrer");
  });

  it("preserves existing tokens and does not duplicate", () => {
    expect(withSafeRel("nofollow noopener")).toBe("nofollow noopener noreferrer");
  });
});
