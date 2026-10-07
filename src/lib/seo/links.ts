/**
 * The "Set up, compare, learn" block at the foot of each product page: the docs
 * quickstart to start from, the comparisons a buyer reads next, and the posts and
 * glossary terms that explain the topic. Keyed by page path.
 */
export interface SetupLink {
  href: string;
  label: string;
  description: string;
}

const docs = (path: string) => `https://docs.lettr.com/${path}`;

const quickstart = {
  laravel: {
    href: docs("quickstart/laravel/introduction"),
    label: "Laravel quickstart",
    description: "Install the official package and send your first email.",
  },
  php: {
    href: docs("quickstart/php/introduction"),
    label: "PHP quickstart",
    description: "Send with the PHP SDK and its fluent builder.",
  },
  node: {
    href: docs("quickstart/nodejs/introduction"),
    label: "Node.js quickstart",
    description: "Send from TypeScript or JavaScript with a typed client.",
  },
  python: {
    href: docs("quickstart/python/quickstart"),
    label: "Python quickstart",
    description: "Send with sync or async clients and typed errors.",
  },
  smtp: {
    href: docs("quickstart/smtp/introduction"),
    label: "SMTP quickstart",
    description: "Connection settings and credentials for any SMTP client.",
  },
  api: {
    href: docs("api-reference/introduction"),
    label: "API reference",
    description: "Every endpoint, request and response.",
  },
  mcp: {
    href: docs("mcp/introduction"),
    label: "MCP setup",
    description: "Connect an AI assistant to your Lettr account.",
  },
  intro: {
    href: docs("introduction"),
    label: "Getting started",
    description: "Create an account, verify a domain, send.",
  },
};

const compare = {
  sendgrid: {
    href: "/compare/sendgrid/",
    label: "Lettr vs SendGrid",
    description: "Features and pricing side by side.",
  },
  resend: {
    href: "/compare/resend/",
    label: "Lettr vs Resend",
    description: "Features and pricing side by side.",
  },
  postmark: {
    href: "/compare/postmark/",
    label: "Lettr vs Postmark",
    description: "Features and pricing side by side.",
  },
  mailgun: {
    href: "/compare/mailgun/",
    label: "Lettr vs Mailgun",
    description: "Features and pricing side by side.",
  },
  mailersend: {
    href: "/compare/mailersend/",
    label: "Lettr vs MailerSend",
    description: "Features and pricing side by side.",
  },
  ses: {
    href: "/compare/aws-ses-alternatives/",
    label: "Amazon SES alternatives",
    description: "What to use when SES is not enough.",
  },
  mailerlite: {
    href: "/compare/mailerlite-alternatives/",
    label: "MailerLite alternatives",
    description: "Options for product teams.",
  },
};

const post = (slug: string, label: string, description: string): SetupLink => ({
  href: `/blog/${slug}/`,
  label,
  description,
});
const term = (slug: string, label: string, description: string): SetupLink => ({
  href: `/glossary/${slug}/`,
  label,
  description,
});

export const setupLinks: Record<string, SetupLink[]> = {
  "/email-api/": [
    quickstart.laravel,
    quickstart.node,
    quickstart.python,
    quickstart.api,
    compare.sendgrid,
    compare.resend,
  ],
  "/free-email-api/": [
    quickstart.intro,
    quickstart.node,
    quickstart.laravel,
    compare.resend,
    compare.sendgrid,
    post(
      "what-is-an-email-api",
      "Email API: what it is and how to choose one",
      "How an email API works and what to look for.",
    ),
  ],
  "/smtp-relay/": [
    quickstart.smtp,
    compare.mailgun,
    compare.sendgrid,
    compare.ses,
    post(
      "smtp-vs-rest-api-how-to-choose",
      "SMTP vs. REST API",
      "How to choose, and when to switch.",
    ),
    term("smtp-relay", "SMTP relay, defined", "The term in the glossary."),
  ],
  "/inbound-email-api/": [
    quickstart.api,
    quickstart.intro,
    compare.mailgun,
    compare.sendgrid,
    term("webhook", "Webhook, defined", "How Lettr calls your app."),
    post("the-journey-of-an-email", "The journey of an email", "From API call to inbox."),
  ],
  "/email-marketing/": [
    quickstart.intro,
    compare.mailersend,
    compare.mailerlite,
    post(
      "introducing-lettr-marketing-audiences-and-campaigns",
      "Introducing marketing emails in Lettr",
      "Audiences and campaigns, inside Lettr.",
    ),
    post(
      "how-to-send-bulk-email",
      "How to send bulk email the right way",
      "Limits, consent and unsubscribes.",
    ),
    term("double-opt-in", "Double opt-in, defined", "The consent step explained."),
  ],
  "/platform/deliverability/": [
    quickstart.intro,
    compare.postmark,
    post(
      "spf-dkim-dmarc-explained-for-developers",
      "SPF, DKIM and DMARC explained",
      "What each does and how they fit together.",
    ),
    post(
      "email-deliverability-checklist",
      "Email deliverability checklist",
      "Everything to check before you send.",
    ),
    term("dmarc", "DMARC, defined", "The policy that ties SPF and DKIM together."),
  ],
  "/platform/analytics/": [
    quickstart.api,
    post(
      "hard-bounce-vs-soft-bounce",
      "Hard bounce vs. soft bounce",
      "What bounces mean and how to handle them.",
    ),
    term("webhook", "Webhook, defined", "Get events in your own app."),
    term("bounce-rate", "Bounce rate, defined", "What counts and what is too high."),
  ],
  "/platform/templates/": [
    quickstart.intro,
    post(
      "onboarding-email-best-practices",
      "Onboarding email best practices",
      "Sequences, timing and templates.",
    ),
    term("topol-email-editor", "Topol email editor, defined", "The editor behind Lettr templates."),
    term("merge-tag", "Merge tag, defined", "Personalise every send."),
  ],
  "/platform/mcp/": [
    quickstart.mcp,
    post(
      "managing-lettr-from-your-ai-assistant",
      "Managing Lettr from your AI assistant",
      "What the MCP integration can do.",
    ),
    term("mcp", "MCP, defined", "The protocol, in plain words."),
  ],
  "/platform/multilingual-campaigns/": [
    post(
      "introducing-multilingual-campaigns",
      "Introducing multilingual campaigns",
      "One campaign, every language.",
    ),
    term(
      "multilingual-campaign",
      "Multilingual campaign, defined",
      "How the right version reaches each contact.",
    ),
    term("email-localization", "Email localization, defined", "Beyond translation."),
  ],
  "/channels/email/": [
    quickstart.intro,
    quickstart.api,
    post("the-journey-of-an-email", "The journey of an email", "From API call to inbox."),
  ],
};
