// Shared by FAQSection and the pricing page FAQ, and used for the FAQPage JSON-LD.
export const faqs: { question: string; answer: string }[] = [
  {
    question: "What is Lettr?",
    answer:
      "Lettr is an email infrastructure platform built for SaaS companies. It combines a clean REST API and SMTP relay for developers with a drag-and-drop visual editor (powered by Topol, trusted by 40,000+ companies) for marketing and product teams. Unlike general-purpose email tools, every feature, template, and metric is designed for the emails SaaS products send: onboarding sequences, password resets, trial nudges, product updates, and marketing campaigns.",
  },
  {
    question: "How is Lettr different from Resend, Postmark, or SendGrid?",
    answer:
      "Resend offers a developer-friendly API and code-based templates (React Email), but no drag-and-drop editor that non-technical teammates can use. Postmark is strong on transactional deliverability but has only limited campaign tooling and no drag-and-drop editor. SendGrid and Mailchimp serve a very broad audience and split transactional and marketing into separate products. Lettr is built specifically for SaaS: it pairs a developer-friendly REST API and SMTP relay with a drag-and-drop editor powered by Topol (used by 40,000+ companies), and handles both transactional and marketing email from one platform with one bill.",
  },
  {
    question: "Is Lettr free?",
    answer:
      "Yes. Lettr's free tier includes 3,000 transactional emails per month, or 500 marketing contacts, with no credit card required. Paid plans start at $15/month for transactional email and $10/month for marketing, billed by usage.",
  },
  {
    question: "How much does Lettr cost?",
    answer:
      "Lettr uses simple, usage-based pricing. Transactional email is free up to 3,000 emails per month, then starts at $15/month. Marketing is free up to 500 contacts, then starts at $10/month, billed per contact. Transactional and marketing are billed together on one account, so there is no separate provider or second invoice to manage.",
  },
  {
    question: "Does Lettr support SPF, DKIM, and DMARC?",
    answer:
      "Yes. Lettr authenticates every sending domain with SPF, DKIM, and DMARC to protect deliverability and prevent spoofing. It is built by the team behind DMARCeye, a dedicated DMARC monitoring and reporting platform, so domain authentication and email security are first-class parts of the product.",
  },
  {
    question: "Is Lettr EU-hosted and GDPR-compliant?",
    answer:
      "Yes. Lettr runs on EU-hosted infrastructure, with primary infrastructure in the EU, so your email and data stay under EU jurisdiction. This applies on every plan, including the free tier. Data residency is not gated behind an enterprise upgrade, as it is with some US providers. Lettr is GDPR-compliant by default and is built by the Big Good group, a European company operating email infrastructure since 2014.",
  },
  {
    question: "Can I send both transactional and marketing emails with Lettr?",
    answer:
      "Yes. Lettr handles both transactional emails (password resets, security alerts, usage notifications) and marketing emails (product updates, feature announcements, newsletters) from a single platform. Both are built in the same drag-and-drop editor, with one integration. No need to manage separate providers for transactional and marketing email.",
  },
  {
    question: "What programming languages does Lettr support?",
    answer:
      "Lettr provides official SDKs for six languages: Laravel (PHP), PHP, Node.js, Go, Java, and Rust. It also offers a standard REST API and SMTP relay compatible with any language or framework. The Laravel SDK includes first-class support with a one-command installation.",
  },
  {
    question: "Does Lettr include an email template editor?",
    answer:
      "Yes. Lettr includes a full drag-and-drop email editor powered by Topol, a technology trusted by over 40,000 companies. Features include synced sections that update across all templates at once, a draft-and-publish workflow with version history, multilingual template support, dynamic placeholders for personalization, and pre-built templates for SaaS use cases like onboarding, alerts, and product updates.",
  },
  {
    question: "Who built Lettr?",
    answer:
      "Lettr is built by the Big Good group, the team behind Topol (email editor used by 40,000+ companies), Ecomail (email marketing platform serving 12,000+ organizations for over 12 years), and DMARCeye (DMARC monitoring and reporting). Lettr leverages this deep email infrastructure expertise to deliver enterprise-grade reliability at startup-friendly pricing.",
  },
  {
    question: "When is Lettr not the right fit?",
    answer:
      "Lettr is purpose-built for SaaS products sending onboarding, transactional, and product-marketing email. It is a weaker fit if you run a high-volume ecommerce store that needs deep product-feed automation, if you need a full CRM rather than an email platform, or if you only send occasional one-off newsletters with no product app behind them. For those cases a general-purpose marketing or ecommerce tool may suit you better.",
  },
];
