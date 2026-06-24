export interface PostMeta {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
}

// Single source of truth for blog post metadata (newest first).
// Used by the blog index listing and the "Related articles" block on each post.
export const posts: PostMeta[] = [
  {
    slug: "hard-bounce-vs-soft-bounce",
    category: "Deliverability",
    title: "Hard bounce vs. soft bounce: what email bounces mean and how to handle them",
    excerpt:
      "What an email bounce is, the difference between a hard bounce (a permanent failure such as an address that does not exist) and a soft bounce (a temporary one such as a full mailbox), the common causes of each, why a bounce rate above roughly 2% damages sender reputation, and how to handle both kinds correctly.",
    author: "Erik Vlčák",
    date: "June 24, 2026",
    readTime: "7 min read",
  },
  {
    slug: "mailer-daemon-mail-delivery-subsystem",
    category: "Fundamentals",
    title: "Mailer Daemon and Mail Delivery Subsystem errors explained (and how to fix them)",
    excerpt:
      "What a Mailer Daemon or Mail Delivery Subsystem bounce-back means, the common reasons an email fails to deliver, how to read the SMTP status code in the message, step-by-step fixes for each cause, Gmail and Yahoo specifics, and what bounces that arrive for mail you never sent are telling you.",
    author: "Erik Vlčák",
    date: "June 24, 2026",
    readTime: "8 min read",
  },
  {
    slug: "email-attachment-size-limits",
    category: "Fundamentals",
    title: "Email attachment size limits by provider (and how to send large files)",
    excerpt:
      "The attachment size limits for Gmail, Outlook, Yahoo, and iCloud Mail, why the real ceiling is lower than the number suggests because of encoding overhead, and the practical ways to send a file that is too big to attach, including large video.",
    author: "Erik Vlčák",
    date: "June 24, 2026",
    readTime: "6 min read",
  },
  {
    slug: "onboarding-email-best-practices",
    category: "Fundamentals",
    title: "Onboarding email best practices (with examples and templates)",
    excerpt:
      "A practical guide to onboarding email sequences: what an onboarding email is, how to time and structure the welcome-to-activation flow, the best practices that matter (subject lines, personalization, a single CTA, the metrics to track), teardown examples, copy-paste templates, and how to send the sequence programmatically.",
    author: "Erik Vlčák",
    date: "June 24, 2026",
    readTime: "9 min read",
  },
  {
    slug: "email-deliverability-checklist",
    category: "Deliverability",
    title: "Email deliverability checklist",
    excerpt:
      "A complete email deliverability checklist covering authentication (SPF, DKIM, DMARC), list hygiene, content and spam triggers, sender reputation and IP warmup, and the monitoring metrics to watch, with a printable summary at the end.",
    author: "Erik Vlčák",
    date: "June 24, 2026",
    readTime: "9 min read",
  },
  {
    slug: "email-signature-size-and-dimensions",
    category: "Fundamentals",
    title: "Email signature size and dimensions",
    excerpt:
      "The recommended pixel dimensions, file size, and format for an email signature, how signatures render in Gmail, Outlook, and Apple Mail, and the common mistakes that make them break on mobile or load slowly.",
    author: "Erik Vlčák",
    date: "June 24, 2026",
    readTime: "5 min read",
  },
  {
    slug: "introducing-lettr-marketing-audiences-and-campaigns",
    category: "Product",
    title: "Introducing marketing emails in Lettr",
    excerpt:
      "Marketing email now lives inside Lettr. The new module adds Audiences for managing who you send to and Campaigns for designing and sending bulk email, all in the same account and on the same domains you already use for transactional sending.",
    author: "Erik Vlčák",
    date: "June 2, 2026",
    readTime: "7 min read",
  },
  {
    slug: "managing-lettr-from-your-ai-assistant",
    category: "Product",
    title: "Managing Lettr from your AI assistant: the MCP integration",
    excerpt:
      "How Lettr's MCP integration lets an AI assistant call the Lettr API in plain language: what MCP is, what the tools cover, the difference between the remote and local servers, how to set up each one, and which tasks suit a chat interface versus the dashboard.",
    author: "Erik Vlčák",
    date: "May 27, 2026",
    readTime: "5 min read",
  },
  {
    slug: "the-hidden-cost-of-diy-transactional-email",
    category: "Deliverability",
    title: "The hidden cost of DIY transactional email",
    excerpt:
      "The real cost of running your own transactional email stack: deliverability drift, no delivery logs, on-call time spent on bounces and blocklists, and template changes that require a deploy. What DIY actually costs beyond infrastructure, and what a managed alternative replaces.",
    author: "Erik Vlčák",
    date: "May 13, 2026",
    readTime: "5 min read",
  },
  {
    slug: "how-to-warm-up-a-sending-domain",
    category: "Deliverability",
    title: "How to warm up a new sending domain",
    excerpt:
      "How to build sending reputation on a new domain by ramping volume gradually: who needs a warm-up, which recipients and content to send first, two sample ramp schedules, the bounce and complaint signals to watch, and the stop signals that mean pause immediately.",
    author: "Erik Vlčák",
    date: "April 22, 2026",
    readTime: "9 min read",
  },
  {
    slug: "separate-transactional-and-marketing-email",
    category: "Deliverability",
    title: "Why you should separate transactional and marketing email",
    excerpt:
      "Why transactional and marketing email belong on separate subdomains: how shared sender reputation lets a marketing campaign drag 2FA codes into spam, how to classify the gray-area emails that sit between the two, and what the legal rules add on top.",
    author: "Erik Vlčák",
    date: "April 8, 2026",
    readTime: "7 min read",
  },
  {
    slug: "smtp-vs-rest-api-how-to-choose",
    category: "Engineering",
    title: "SMTP vs. REST API: how to choose and when to switch",
    excerpt:
      "How SMTP and REST API email transports differ in practice (statefulness, serverless fit, templates, idempotency, error handling), when each is the right choice, and a step-by-step plan for migrating from SMTP to a REST API.",
    author: "Erik Vlčák",
    date: "March 18, 2026",
    readTime: "8 min read",
  },
  {
    slug: "spf-dkim-dmarc-explained-for-developers",
    category: "Deliverability",
    title: "SPF, DKIM, and DMARC explained for developers",
    excerpt:
      "What SPF, DKIM, and DMARC each do, how they fit together to stop email spoofing, and how to read the DNS records and authentication headers to tell whether they're working.",
    author: "Erik Vlčák",
    date: "March 4, 2026",
    readTime: "10 min read",
  },
  {
    slug: "the-journey-of-an-email",
    category: "Engineering",
    title: "The journey of an email: from API call to inbox",
    excerpt:
      "A step-by-step walkthrough of what happens to an email between your API call and the recipient's inbox: validation, message assembly, DKIM signing, DNS routing, the SMTP handshake, authentication, content filtering, and placement.",
    author: "Erik Vlčák",
    date: "February 18, 2026",
    readTime: "11 min read",
  },
  {
    slug: "what-is-transactional-email",
    category: "Fundamentals",
    title: "How transactional email actually works",
    excerpt:
      "What separates transactional email from marketing email, why inbox providers and regulators treat them differently, and how to keep these messages reliable in production.",
    author: "Erik Vlčák",
    date: "February 4, 2026",
    readTime: "6 min read",
  },
];

/**
 * Returns related posts for a given slug, preferring the same category and
 * filling the remaining slots with the most recent other posts. Guarantees up
 * to `limit` results so every post gets a full "Related articles" block.
 */
export function getRelatedPosts(slug: string | undefined, limit = 3): PostMeta[] {
  const others = posts.filter((post) => post.slug !== slug);
  const current = posts.find((post) => post.slug === slug);
  if (!current) return others.slice(0, limit);

  const sameCategory = others.filter((post) => post.category === current.category);
  const rest = others.filter((post) => post.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
