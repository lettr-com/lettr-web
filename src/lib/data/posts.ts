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
      "A bounce report comes in and you tab between dashboard, terminal, and editor copying IDs. MCP turns that into a sentence in the AI assistant you already have open. Here’s how the integration works.",
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
      "You set up SPF, DKIM, and DMARC, flip the switch, send 50,000 emails on day one — and half vanish. Nothing is broken. Your domain is just new and untrusted. Here’s how to warm it up.",
    author: "Erik Vlčák",
    date: "April 22, 2026",
    readTime: "9 min read",
  },
  {
    slug: "separate-transactional-and-marketing-email",
    category: "Deliverability",
    title: "Why you should separate transactional and marketing email",
    excerpt:
      "Your password reset and your weekly newsletter have almost nothing in common — yet most teams send both from the same domain, then wonder why 2FA codes hit spam after a campaign goes sideways.",
    author: "Erik Vlčák",
    date: "April 8, 2026",
    readTime: "7 min read",
  },
  {
    slug: "smtp-vs-rest-api-how-to-choose",
    category: "Engineering",
    title: "SMTP vs. REST API: how to choose and when to switch",
    excerpt:
      "Most developers reach for the email transport they’ve used before — until they’re debugging a recycled SMTP connection in a serverless function at 2 AM. Here’s how to pick the right one and switch if you picked wrong.",
    author: "Erik Vlčák",
    date: "March 18, 2026",
    readTime: "8 min read",
  },
  {
    slug: "spf-dkim-dmarc-explained-for-developers",
    category: "Deliverability",
    title: "SPF, DKIM, and DMARC explained for developers",
    excerpt:
      "Open a terminal and you can send mail claiming to be from support@stripe.com — SMTP won’t stop you. Three DNS-based standards close that gap. Here’s what each one does and how to tell if it’s working.",
    author: "Erik Vlčák",
    date: "March 4, 2026",
    readTime: "10 min read",
  },
  {
    slug: "the-journey-of-an-email",
    category: "Engineering",
    title: "The journey of an email: from API call to inbox",
    excerpt:
      "You POST /emails, get a 200 OK, and assume it went through. Fifteen minutes later: “I never received my verification email.” Here’s everything that happens between your API call and the recipient’s inbox.",
    author: "Erik Vlčák",
    date: "February 18, 2026",
    readTime: "11 min read",
  },
  {
    slug: "what-is-transactional-email",
    category: "Fundamentals",
    title: "How transactional email actually works",
    excerpt:
      "A user clicks “Reset Password,” waits, checks spam, gives up — and files a ticket about an email you didn’t know was broken. If you’re shipping your first signup or receipt flow, the transactional vs. marketing distinction matters.",
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
