import { describe, expect, it } from "vite-plus/test";
import {
  isStripAllowed,
  nextStripVisibility,
  readProgress,
  salesPromptFor,
  type ScrollSnapshot,
} from "./salesStrip";

// A 5000px page in an 800px viewport: 4200px of scrollable distance.
const page = (scrollY: number): ScrollSnapshot => ({
  scrollY,
  scrollHeight: 5000,
  viewportHeight: 800,
});

describe("readProgress", () => {
  it("is the share of the scrollable distance already scrolled", () => {
    expect(readProgress(page(2100))).toBe(0.5);
  });

  it("clamps overscroll and returns 0 when the page cannot scroll", () => {
    expect(readProgress(page(-50))).toBe(0);
    expect(readProgress(page(9000))).toBe(1);
    expect(readProgress({ scrollY: 0, scrollHeight: 600, viewportHeight: 800 })).toBe(0);
  });
});

describe("nextStripVisibility", () => {
  it("stays hidden before 30% read", () => {
    expect(nextStripVisibility(false, page(1200))).toBe(false); // 28.6%
  });

  it("shows at 30% read", () => {
    expect(nextStripVisibility(false, page(1260))).toBe(true); // 30%
  });

  it("keeps showing between the two thresholds (no flicker)", () => {
    expect(nextStripVisibility(true, page(1000))).toBe(true); // 23.8%
  });

  it("hides again below 20% read", () => {
    expect(nextStripVisibility(true, page(800))).toBe(false); // 19%
  });

  it("waits for at least one screen of scrolling", () => {
    // 2000px page, 800px viewport: 30% is only 360px down.
    const short: ScrollSnapshot = { scrollY: 600, scrollHeight: 2000, viewportHeight: 800 };
    expect(nextStripVisibility(false, short)).toBe(false);
    expect(nextStripVisibility(false, { ...short, scrollY: 800 })).toBe(true);
  });

  it("never shows on pages shorter than two screens", () => {
    const tiny: ScrollSnapshot = { scrollY: 700, scrollHeight: 1500, viewportHeight: 800 };
    expect(nextStripVisibility(false, tiny)).toBe(false);
    expect(nextStripVisibility(true, tiny)).toBe(false);
  });
});

describe("isStripAllowed", () => {
  it("hides the strip on the booking page and legal pages", () => {
    expect(isStripAllowed("/demo/")).toBe(false);
    expect(isStripAllowed("/privacy-policy")).toBe(false);
    expect(isStripAllowed("/terms/")).toBe(false);
  });

  it("allows it on marketing pages", () => {
    expect(isStripAllowed("/")).toBe(true);
    expect(isStripAllowed("/pricing/")).toBe(true);
  });
});

describe("salesPromptFor", () => {
  it("asks about volume on the pricing page", () => {
    expect(salesPromptFor("/pricing/").question).toBe("Sending at enterprise volume?");
  });

  it("talks migration on compare pages and alternatives posts", () => {
    expect(salesPromptFor("/compare/sendgrid/").question).toBe("Comparing providers?");
    expect(salesPromptFor("/blog/mailgun-alternatives/").question).toBe("Comparing providers?");
    expect(salesPromptFor("/blog/smtp-relay/").question).not.toBe("Comparing providers?");
  });

  it("talks contacts on marketing pages", () => {
    expect(salesPromptFor("/email-marketing/").short).toBe("Moving your contacts?");
  });

  it("falls back to the switch prompt", () => {
    expect(salesPromptFor("/").question).toBe("Moving your product email to Lettr?");
  });

  it("never uses em dashes in copy", () => {
    for (const path of ["/", "/pricing/", "/compare/", "/email-marketing/"]) {
      const prompt = salesPromptFor(path);
      expect(`${prompt.question} ${prompt.answer} ${prompt.short}`).not.toContain("\u2014");
    }
  });
});
