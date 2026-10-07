import { posts } from "../data/posts.ts";

/** A product page a glossary term leads into. */
export interface ProductLink {
  href: string;
  label: string;
}

const PRODUCTS = {
  api: { href: "/email-api/", label: "Transactional email API" },
  smtp: { href: "/smtp-relay/", label: "SMTP relay" },
  deliverability: { href: "/platform/deliverability/", label: "Deliverability on Lettr" },
  analytics: { href: "/platform/analytics/", label: "Analytics and logs" },
  editor: { href: "/platform/templates/", label: "Visual email editor" },
  marketing: { href: "/email-marketing/", label: "Email marketing" },
  multilingual: { href: "/platform/multilingual-campaigns/", label: "Multilingual campaigns" },
  mcp: { href: "/platform/mcp/", label: "MCP server" },
} satisfies Record<string, ProductLink>;

/**
 * Every glossary term belongs to one topic, and each topic leads into one
 * product page and one blog post. Terms are listed by slug on purpose: a new
 * term has to be placed (the test fails until it is), so no term is left as an
 * island that links to nothing Lettr sells.
 */
const TOPICS: { product: ProductLink; post: string; terms: string[] }[] = [
  {
    // SPF, DKIM, DMARC, DNS and the envelope: proving a message is yours
    product: PRODUCTS.deliverability,
    post: "spf-dkim-dmarc-explained-for-developers",
    terms: [
      "spf",
      "dkim",
      "dkim-selector",
      "key-rotation",
      "dmarc",
      "dmarc-alignment",
      "dmarc-aggregate-report",
      "dmarc-forensic-report",
      "arc",
      "bimi",
      "verified-mark-certificate",
      "email-spoofing",
      "phishing",
      "return-path",
      "custom-return-path",
      "envelope-from",
      "mail-from",
      "rcpt-to",
      "verp",
      "reverse-dns",
      "ptr-record",
      "dns",
      "dns-propagation",
      "domain-connect",
      "domain-status",
      "cname-record",
      "mx-record",
      "txt-record",
      "zone-apex",
      "zone-file",
      "subdomain",
      "tracking-domain",
      "starttls",
      "tls",
    ],
  },
  {
    // Reputation and inbox placement: whether a message lands
    product: PRODUCTS.deliverability,
    post: "email-deliverability-checklist",
    terms: [
      "deliverability",
      "inbox-placement",
      "sender-reputation",
      "domain-reputation",
      "ip-reputation",
      "reputation-isolation",
      "dedicated-ip",
      "shared-ip",
      "ip-pool",
      "blocklist",
      "google-postmaster-tools",
      "snds",
      "yahoo-sender-hub",
      "jmrp",
      "feedback-loop",
      "arf",
      "seed-list",
      "mailbox-provider",
      "smartscreen",
      "exchange-online-protection",
      "focused-inbox",
      "promotions-tab",
      "graymail",
      "graylisting",
      "content-filtering",
      "list-hygiene",
      "suppression-list",
      "sunset-policy",
      "role-based-address",
      "policy-rejection",
    ],
  },
  {
    product: PRODUCTS.deliverability,
    post: "how-to-warm-up-a-sending-domain",
    terms: ["warm-up"],
  },
  {
    product: PRODUCTS.deliverability,
    post: "why-emails-go-to-spam",
    terms: ["spam-complaint", "spam-score", "spam-trap"],
  },
  {
    // Bounces and delivery status
    product: PRODUCTS.analytics,
    post: "hard-bounce-vs-soft-bounce",
    terms: [
      "bounce",
      "bounce-rate",
      "hard-bounce",
      "soft-bounce",
      "out-of-band-bounce",
      "backscatter",
      "dsn",
      "enhanced-status-code",
      "non-delivery-report",
      "deferral",
      "delivery-delay",
      "delivery",
      "authentication-results-header",
    ],
  },
  {
    // Sending through the API: keys, limits, webhooks
    product: PRODUCTS.api,
    post: "what-is-an-email-api",
    terms: [
      "api-key",
      "api-error-code",
      "idempotency",
      "exponential-backoff",
      "rate-limiting",
      "throttling",
      "batch-sending",
      "injection",
      "sandbox-mode",
      "project",
      "template-slug",
      "substitution-data",
      "merge-tag",
      "tag",
      "webhook",
      "webhook-signature",
      "loop-block",
      "variable-reply-to-address",
      "generation-failure",
      "generation-rejection",
    ],
  },
  {
    product: PRODUCTS.api,
    post: "what-is-transactional-email",
    terms: ["transactional-email", "no-reply-address", "auto-submitted-header", "reply-to-header"],
  },
  {
    product: PRODUCTS.api,
    post: "best-transactional-email-services",
    terms: ["esp"],
  },
  {
    product: PRODUCTS.mcp,
    post: "managing-lettr-from-your-ai-assistant",
    terms: ["mcp"],
  },
  {
    // The SMTP protocol and the machines that speak it
    product: PRODUCTS.smtp,
    post: "smtp-vs-rest-api-how-to-choose",
    terms: ["smtp", "esmtp", "ehlo-helo", "mta", "mua", "imap", "email-relay"],
  },
  {
    product: PRODUCTS.smtp,
    post: "smtp-relay",
    terms: ["smtp-relay"],
  },
  {
    // What is inside a message
    product: PRODUCTS.api,
    post: "the-journey-of-an-email",
    terms: [
      "email-header",
      "x-header",
      "from-header",
      "message-id",
      "message-threading",
      "mime",
      "multipart-message",
      "quoted-printable-encoding",
      "base64-encoding",
      "character-encoding",
      "plus-addressing",
    ],
  },
  {
    // Building and rendering the email
    product: PRODUCTS.editor,
    post: "onboarding-email-best-practices",
    terms: [
      "amp-for-email",
      "content-block",
      "saved-block",
      "premade-template",
      "template-version",
      "structure",
      "editor-settings",
      "inline-css",
      "dark-mode-email",
      "preheader-text",
      "rendering-engine",
      "email-clipping",
      "wcag",
      "topol-email-editor",
      "cid",
    ],
  },
  {
    // Campaigns: consent, unsubscribes, tracking and the law
    product: PRODUCTS.marketing,
    post: "how-to-send-bulk-email",
    terms: [
      "marketing-email",
      "bulk-sender",
      "opt-in",
      "opt-out",
      "single-opt-in",
      "double-opt-in",
      "express-consent",
      "implied-consent",
      "unsubscribe-rate",
      "list-unsubscribe",
      "list-unsubscribe-header",
      "one-click-unsubscribe",
      "preference-center",
      "can-spam-act",
      "casl",
      "gdpr",
      "data-minimization",
      "data-processing-agreement",
      "acceptable-use-policy",
    ],
  },
  {
    product: PRODUCTS.marketing,
    post: "introducing-lettr-marketing-audiences-and-campaigns",
    terms: [
      "email-engagement",
      "open-tracking",
      "click-tracking",
      "unique-open",
      "initial-open",
      "tracking-pixel",
      "mail-privacy-protection",
      "utm-parameters",
    ],
  },
  {
    product: PRODUCTS.multilingual,
    post: "introducing-multilingual-campaigns",
    terms: [
      "ai-translation",
      "communication-language",
      "email-localization",
      "language-code",
      "multilingual-campaign",
      "multilingual-template",
      "primary-language",
    ],
  },
];

export interface TermLinks {
  product: ProductLink;
  post: { href: string; label: string };
}

const bySlug = new Map<string, TermLinks>();
for (const topic of TOPICS) {
  const post = posts.find((entry) => entry.slug === topic.post);
  if (!post) throw new Error(`Glossary topic points at an unknown blog post: ${topic.post}`);
  for (const term of topic.terms) {
    if (bySlug.has(term)) throw new Error(`Glossary term listed under two topics: ${term}`);
    bySlug.set(term, {
      product: topic.product,
      post: { href: `/blog/${post.slug}/`, label: post.title },
    });
  }
}

/** The product page and blog post a glossary term leads into; undefined for a term nobody has placed yet. */
export function linksForTerm(slug: string): TermLinks | undefined {
  return bySlug.get(slug);
}

export const placedTerms = (): string[] => [...bySlug.keys()];
