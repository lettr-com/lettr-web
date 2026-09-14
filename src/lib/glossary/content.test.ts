import { describe, expect, it } from "vite-plus/test";
import { buildTerm, readSources, termFiles } from "./terms";

// Raised by each content task: 3 → 31 → 63 → 97 → 121 → 158.
const EXPECTED_TERM_COUNT = 3;

/**
 * Every slug the glossary ships (design doc appendix, 158 entries). Related
 * slugs and body links are validated against this list rather than against
 * the files present, so a batch can link forward to terms written in a later
 * batch. Every written slug must be in it; once all 158 files exist the two
 * sets are equal and the check is strict.
 */
const PLANNED_SLUGS: readonly string[] = [
  "acceptable-use-policy",
  "amp-for-email",
  "api-error-code",
  "api-key",
  "arc",
  "arf",
  "authentication-results-header",
  "auto-submitted-header",
  "backscatter",
  "base64-encoding",
  "batch-sending",
  "bimi",
  "blocklist",
  "bounce",
  "bounce-rate",
  "bulk-sender",
  "can-spam-act",
  "casl",
  "character-encoding",
  "cid",
  "click-tracking",
  "cname-record",
  "content-block",
  "content-filtering",
  "custom-return-path",
  "dark-mode-email",
  "data-minimization",
  "data-processing-agreement",
  "dedicated-ip",
  "deferral",
  "deliverability",
  "delivery",
  "delivery-delay",
  "dkim",
  "dkim-selector",
  "dmarc",
  "dmarc-aggregate-report",
  "dmarc-alignment",
  "dmarc-forensic-report",
  "dns",
  "dns-propagation",
  "domain-connect",
  "domain-reputation",
  "domain-status",
  "double-opt-in",
  "dsn",
  "editor-settings",
  "ehlo-helo",
  "email-clipping",
  "email-engagement",
  "email-header",
  "email-relay",
  "email-spoofing",
  "enhanced-status-code",
  "envelope-from",
  "esmtp",
  "esp",
  "exchange-online-protection",
  "exponential-backoff",
  "express-consent",
  "feedback-loop",
  "focused-inbox",
  "from-header",
  "gdpr",
  "generation-failure",
  "generation-rejection",
  "google-postmaster-tools",
  "graylisting",
  "graymail",
  "hard-bounce",
  "idempotency",
  "imap",
  "implied-consent",
  "inbox-placement",
  "initial-open",
  "injection",
  "inline-css",
  "ip-pool",
  "ip-reputation",
  "jmrp",
  "list-hygiene",
  "list-unsubscribe",
  "list-unsubscribe-header",
  "loop-block",
  "mail-from",
  "mail-privacy-protection",
  "mailbox-provider",
  "marketing-email",
  "mcp",
  "merge-tag",
  "message-id",
  "message-threading",
  "mime",
  "mta",
  "mua",
  "multipart-message",
  "mx-record",
  "one-click-unsubscribe",
  "open-tracking",
  "opt-in",
  "opt-out",
  "out-of-band-bounce",
  "phishing",
  "plus-addressing",
  "policy-rejection",
  "preference-center",
  "preheader-text",
  "premade-template",
  "project",
  "promotions-tab",
  "ptr-record",
  "quoted-printable-encoding",
  "rate-limiting",
  "rcpt-to",
  "rendering-engine",
  "reply-to-header",
  "reputation-isolation",
  "return-path",
  "reverse-dns",
  "role-based-address",
  "sandbox-mode",
  "saved-block",
  "seed-list",
  "sender-reputation",
  "shared-ip",
  "single-opt-in",
  "smartscreen",
  "smtp",
  "smtp-relay",
  "snds",
  "soft-bounce",
  "spam-complaint",
  "spam-score",
  "spam-trap",
  "spf",
  "starttls",
  "structure",
  "subdomain",
  "substitution-data",
  "sunset-policy",
  "suppression-list",
  "tag",
  "template-slug",
  "template-version",
  "throttling",
  "tls",
  "topol-email-editor",
  "tracking-domain",
  "tracking-pixel",
  "transactional-email",
  "txt-record",
  "variable-reply-to-address",
  "verified-mark-certificate",
  "verp",
  "warm-up",
  "wcag",
  "webhook",
  "webhook-signature",
];

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const GLOSSARY_LINK = /\]\(\/glossary\/([^)/]+)\/\)/g;
const FIRST_PERSON = /(^|[.!?]\s+)I\s/m;

const planned = new Set(PLANNED_SLUGS);
const sources = readSources(termFiles);
const slugs = new Set(sources.map((source) => source.meta.slug));

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

describe("glossary content set", () => {
  it("plans 158 unique slugs", () => {
    expect(PLANNED_SLUGS).toHaveLength(158);
    expect(planned.size).toBe(158);
  });

  it(`has ${EXPECTED_TERM_COUNT} terms`, () => {
    expect(sources).toHaveLength(EXPECTED_TERM_COUNT);
  });

  it("has unique slugs and unique labels", () => {
    expect(slugs.size).toBe(sources.length);
    expect(new Set(sources.map((source) => source.meta.term.toLowerCase())).size).toBe(
      sources.length,
    );
  });

  it("only contains planned slugs", () => {
    for (const slug of slugs) {
      expect(planned.has(slug), `${slug} is not in PLANNED_SLUGS`).toBe(true);
    }
  });
});

for (const { meta, body } of sources) {
  describe(`term ${meta.slug}`, () => {
    it("has a valid slug and a label", () => {
      expect(meta.slug).toMatch(SLUG);
      expect(meta.term.trim()).not.toBe("");
    });

    it("has a 120 to 160 character description", () => {
      expect(meta.description.length).toBeGreaterThanOrEqual(120);
      expect(meta.description.length).toBeLessThanOrEqual(160);
    });

    it("lists 2 to 5 planned related terms, none itself", () => {
      expect(meta.related.length).toBeGreaterThanOrEqual(2);
      expect(meta.related.length).toBeLessThanOrEqual(5);
      for (const slug of meta.related) {
        expect(
          planned.has(slug),
          `${meta.slug}: related slug ${slug} is not in PLANNED_SLUGS`,
        ).toBe(true);
        expect(slug).not.toBe(meta.slug);
      }
    });

    it("has 1 to 4 reading links on docs.lettr.com or lettr.com", () => {
      expect(meta.reading.length).toBeGreaterThanOrEqual(1);
      expect(meta.reading.length).toBeLessThanOrEqual(4);
      for (const link of meta.reading) {
        expect(link.title.trim()).not.toBe("");
        expect(
          link.href.startsWith("https://docs.lettr.com/") || link.href.startsWith("/"),
          link.href,
        ).toBe(true);
      }
    });

    it("has a 450 to 900 word body with no H1", () => {
      const words = wordCount(body);
      expect(words, `${meta.slug}: ${words} words`).toBeGreaterThanOrEqual(450);
      expect(words, `${meta.slug}: ${words} words`).toBeLessThanOrEqual(900);
      expect(body).not.toMatch(/^# /m);
    });

    it("bolds the term in the first paragraph", () => {
      expect(body.split(/\n\s*\n/)[0]).toContain("**");
    });

    it("closes with an in Lettr section", () => {
      const headings = body.match(/^## .+$/gm) ?? [];
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[headings.length - 1]).toMatch(/ in Lettr$/);
    });

    it("links only to planned glossary slugs", () => {
      for (const match of body.matchAll(GLOSSARY_LINK)) {
        expect(
          planned.has(match[1]),
          `${meta.slug}: glossary link ${match[1]} is not in PLANNED_SLUGS`,
        ).toBe(true);
      }
    });

    it("uses no em dashes and no first person", () => {
      expect(body).not.toContain(" — ");
      expect(body).not.toMatch(FIRST_PERSON);
    });

    it("renders through the real loader", () => {
      expect(buildTerm(meta.slug)?.html).toContain("<h2");
    });
  });
}
