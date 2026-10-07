/**
 * What each blog post links to at its foot: glossary terms it leans on and the
 * product page it makes the case for. Terms are listed with their display
 * names so the block needs no glossary content in the page bundle; the test
 * checks every slug and name against the glossary.
 */
export interface PostLinks {
  /** At least two, in the order they come up in the post. */
  terms: { slug: string; label: string }[];
  product: { href: string; label: string; description: string };
  /** A comparison page, for posts that weigh Lettr against other providers. */
  compare?: { href: string; label: string; description: string };
}

const term = (slug: string, label: string) => ({ slug, label });

const api = {
  href: "/email-api/",
  label: "Transactional email API",
  description: "Send transactional email over a REST API with logs, webhooks and SDKs.",
};
const smtp = {
  href: "/smtp-relay/",
  label: "SMTP relay",
  description: "Point any app or server at Lettr over SMTP.",
};
const deliverability = {
  href: "/platform/deliverability/",
  label: "Deliverability on Lettr",
  description: "SPF, DKIM, DMARC and dedicated IPs, set up for you.",
};
const analytics = {
  href: "/platform/analytics/",
  label: "Analytics and logs",
  description: "See what happened to every email: delivered, bounced, opened, clicked.",
};
const editor = {
  href: "/platform/templates/",
  label: "Visual email editor",
  description: "A drag-and-drop editor your whole team can use.",
};
const marketing = {
  href: "/email-marketing/",
  label: "Email marketing",
  description: "Campaigns, lists and segments on the same account as your transactional email.",
};

export const postLinks: Record<string, PostLinks> = {
  "best-transactional-email-services": {
    terms: [
      term("transactional-email", "Transactional Email"),
      term("esp", "ESP"),
      term("deliverability", "Deliverability"),
    ],
    product: api,
    compare: {
      href: "/compare/",
      label: "Compare Lettr",
      description: "Lettr next to Resend, Postmark, SendGrid, Mailgun and MailerSend.",
    },
  },
  "email-attachment-size-limits": {
    terms: [
      term("mime", "MIME"),
      term("base64-encoding", "Base64 Encoding"),
      term("multipart-message", "Multipart Message"),
    ],
    product: api,
  },
  "email-deliverability-checklist": {
    terms: [
      term("spf", "SPF"),
      term("dkim", "DKIM"),
      term("dmarc", "DMARC"),
      term("list-hygiene", "List Hygiene"),
    ],
    product: deliverability,
  },
  "email-signature-size-and-dimensions": {
    terms: [
      term("rendering-engine", "Rendering Engine"),
      term("dark-mode-email", "Dark Mode"),
      term("inline-css", "Inline CSS"),
    ],
    product: editor,
  },
  "hard-bounce-vs-soft-bounce": {
    terms: [
      term("hard-bounce", "Hard Bounce"),
      term("soft-bounce", "Soft Bounce"),
      term("suppression-list", "Suppression List"),
    ],
    product: analytics,
  },
  "how-to-send-bulk-email": {
    terms: [
      term("bulk-sender", "Bulk Sender"),
      term("list-unsubscribe-header", "List-Unsubscribe Header"),
      term("double-opt-in", "Double Opt-In"),
    ],
    product: marketing,
  },
  "how-to-warm-up-a-sending-domain": {
    terms: [
      term("warm-up", "Warm-Up"),
      term("sender-reputation", "Sender Reputation"),
      term("domain-reputation", "Domain Reputation"),
    ],
    product: deliverability,
  },
  "introducing-lettr-marketing-audiences-and-campaigns": {
    terms: [
      term("marketing-email", "Marketing Email"),
      term("suppression-list", "Suppression List"),
      term("unsubscribe-rate", "Unsubscribe Rate"),
    ],
    product: marketing,
  },
  "introducing-multilingual-campaigns": {
    terms: [
      term("multilingual-campaign", "Multilingual Campaign"),
      term("email-localization", "Email Localization"),
      term("language-code", "Language Code"),
    ],
    product: {
      href: "/platform/multilingual-campaigns/",
      label: "Multilingual campaigns",
      description: "Send one campaign in several languages.",
    },
  },
  "mailer-daemon-mail-delivery-subsystem": {
    terms: [
      term("non-delivery-report", "Non-Delivery Report"),
      term("bounce", "Bounce"),
      term("dsn", "DSN"),
    ],
    product: analytics,
  },
  "mailgun-alternatives": {
    terms: [
      term("transactional-email", "Transactional Email"),
      term("esp", "ESP"),
      term("smtp-relay", "SMTP Relay"),
    ],
    product: api,
    compare: {
      href: "/compare/mailgun/",
      label: "Lettr vs Mailgun",
      description: "Features and pricing side by side.",
    },
  },
  "managing-lettr-from-your-ai-assistant": {
    terms: [term("mcp", "MCP"), term("api-key", "API Key"), term("webhook", "Webhook")],
    product: {
      href: "/platform/mcp/",
      label: "MCP server",
      description: "Connect an AI assistant to your Lettr account.",
    },
  },
  "meet-adamko": {
    terms: [
      term("mcp", "MCP"),
      term("topol-email-editor", "Topol Email Editor"),
      term("email-localization", "Email Localization"),
    ],
    product: editor,
  },
  "onboarding-email-best-practices": {
    terms: [
      term("transactional-email", "Transactional Email"),
      term("preheader-text", "Preheader Text"),
      term("merge-tag", "Merge Tag"),
    ],
    product: editor,
  },
  "sendgrid-alternatives": {
    terms: [
      term("transactional-email", "Transactional Email"),
      term("esp", "ESP"),
      term("shared-ip", "Shared IP"),
    ],
    product: api,
    compare: {
      href: "/compare/sendgrid/",
      label: "Lettr vs SendGrid",
      description: "Features and pricing side by side.",
    },
  },
  "separate-transactional-and-marketing-email": {
    terms: [
      term("transactional-email", "Transactional Email"),
      term("marketing-email", "Marketing Email"),
      term("reputation-isolation", "Reputation Isolation"),
    ],
    product: deliverability,
  },
  "smtp-relay": {
    terms: [term("smtp-relay", "SMTP Relay"), term("smtp", "SMTP"), term("starttls", "STARTTLS")],
    product: smtp,
  },
  "smtp-vs-rest-api-how-to-choose": {
    terms: [term("smtp", "SMTP"), term("idempotency", "Idempotency"), term("webhook", "Webhook")],
    product: api,
  },
  "spf-dkim-dmarc-explained-for-developers": {
    terms: [
      term("spf", "SPF"),
      term("dkim", "DKIM"),
      term("dmarc", "DMARC"),
      term("dmarc-alignment", "DMARC Alignment"),
    ],
    product: deliverability,
  },
  "the-hidden-cost-of-diy-transactional-email": {
    terms: [
      term("transactional-email", "Transactional Email"),
      term("sender-reputation", "Sender Reputation"),
      term("bounce", "Bounce"),
    ],
    product: api,
  },
  "the-journey-of-an-email": {
    terms: [term("mta", "MTA"), term("mx-record", "MX Record"), term("deferral", "Deferral")],
    product: api,
  },
  "what-is-an-email-api": {
    terms: [
      term("api-key", "API Key"),
      term("webhook", "Webhook"),
      term("idempotency", "Idempotency"),
    ],
    product: api,
  },
  "what-is-transactional-email": {
    terms: [
      term("transactional-email", "Transactional Email"),
      term("marketing-email", "Marketing Email"),
      term("can-spam-act", "CAN-SPAM Act"),
    ],
    product: api,
  },
  "why-emails-go-to-spam": {
    terms: [
      term("spam-score", "Spam Score"),
      term("spam-complaint", "Complaint"),
      term("spf", "SPF"),
    ],
    product: deliverability,
  },
  "why-lettr-runs-on-lambda-with-bref": {
    terms: [term("mta", "MTA"), term("rate-limiting", "Rate Limiting")],
    product: api,
  },
  "why-we-built-lettr-on-laravel": {
    terms: [term("smtp", "SMTP"), term("webhook", "Webhook")],
    product: api,
  },
  "zaptime-cut-deliverability-tickets-to-zero": {
    terms: [term("deliverability", "Deliverability"), term("bounce", "Bounce")],
    product: deliverability,
  },
};
