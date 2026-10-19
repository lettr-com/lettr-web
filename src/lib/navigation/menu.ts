/**
 * Main navigation content.
 *
 * Single source of truth for the desktop mega menus and the mobile drilldown,
 * mirroring the "web · navigation" page in Paper. Every destination here
 * exists on lettr.com or on the docs and status subdomains.
 */
import { posts, type PostMeta } from "$lib/data/posts";

export type MenuKey = "product" | "developers" | "resources";
export type Lane = "transactional" | "marketing" | "shared";

export interface NavItem {
  label: string;
  description?: string;
  href: string;
  external?: boolean;
  /** Path to a small logo, used by the SDK quickstart tiles. */
  icon?: string;
}

export interface NavSection {
  id: string;
  title: string;
  /** One line under a lane heading. */
  subtitle?: string;
  lane?: Lane;
  items: NavItem[];
}

export interface NavMenu {
  key: MenuKey;
  label: string;
  /** Shown under the row label in the mobile menu. */
  summary: string;
  sections: NavSection[];
  /** Path prefixes that mark this menu as the current section. */
  activePrefixes: string[];
}

export const docsUrl = "https://docs.lettr.com";
export const pricingHref = "/pricing/";
export const salesHref = "/demo/";
export const signInHref = "https://app.lettr.com";

const productMenu: NavMenu = {
  key: "product",
  label: "Product",
  summary: "Transactional, marketing and what they share",
  sections: [
    {
      id: "transactional",
      title: "Transactional",
      subtitle: "Triggered by your app, billed per email",
      lane: "transactional",
      items: [
        { label: "Email API", description: "Send from your code over REST", href: "/email-api/" },
        {
          label: "SMTP relay",
          description: "Point any app or framework at Lettr",
          href: "/smtp-relay/",
        },
        {
          label: "Inbound email",
          description: "Receive replies and parse them by webhook",
          href: "/inbound-email-api/",
        },
      ],
    },
    {
      id: "marketing",
      title: "Marketing",
      subtitle: "Sent by your team, billed per contact",
      lane: "marketing",
      items: [
        {
          label: "Campaigns",
          description: "Newsletters and launches, with audiences and segments",
          href: "/email-marketing/",
        },
        {
          label: "Multilingual campaigns",
          description: "One send, each contact gets their language",
          href: "/platform/multilingual-campaigns/",
        },
      ],
    },
    {
      id: "shared",
      title: "Shared by both lanes",
      subtitle: "One editor, one dashboard, one bill",
      lane: "shared",
      items: [
        {
          label: "Visual editor",
          description: "Drag-and-drop templates, built on Topol",
          href: "/platform/templates/",
        },
        {
          label: "Analytics and logs",
          description: "Every event, searchable, with webhooks",
          href: "/platform/analytics/",
        },
        {
          label: "Deliverability",
          description: "SPF, DKIM, DMARC and dedicated IPs",
          href: "/platform/deliverability/",
        },
        {
          label: "MCP server",
          description: "Run Lettr from Claude, ChatGPT or Cursor",
          href: "/platform/mcp/",
        },
        {
          label: "Multi-region sending",
          description: "Routed through the closest data center",
          href: "/channels/email/",
        },
      ],
    },
  ],
  activePrefixes: [
    "/email-api/",
    "/smtp-relay/",
    "/inbound-email-api/",
    "/free-email-api/",
    "/email-marketing/",
    "/platform/",
    "/channels/",
  ],
};

const developersMenu: NavMenu = {
  key: "developers",
  label: "Developers",
  summary: "Docs, API reference and quickstarts",
  sections: [
    {
      id: "docs",
      title: "Documentation",
      items: [
        {
          label: "Documentation",
          description: "Guides, API reference and examples",
          href: docsUrl,
          external: true,
        },
      ],
    },
    {
      id: "reference",
      title: "Reference",
      items: [
        {
          label: "API reference",
          description: "Every endpoint, with request examples",
          href: `${docsUrl}/api-reference/introduction`,
          external: true,
        },
        {
          label: "SMTP setup",
          description: "Host, ports and credentials",
          href: `${docsUrl}/quickstart/smtp/introduction`,
          external: true,
        },
        {
          label: "MCP setup",
          description: "Connect Claude, Cursor or ChatGPT",
          href: `${docsUrl}/mcp/introduction`,
          external: true,
        },
        {
          label: "Status",
          description: "Live uptime and incident history",
          href: "https://status.lettr.com",
          external: true,
        },
      ],
    },
    {
      id: "quickstarts",
      title: "Quickstarts",
      items: [
        {
          label: "Laravel",
          href: `${docsUrl}/quickstart/laravel/introduction`,
          external: true,
          icon: "/images/icons/laravel.svg",
        },
        {
          label: "PHP",
          href: `${docsUrl}/quickstart/php/introduction`,
          external: true,
          icon: "/images/icons/php.svg",
        },
        {
          label: "Node.js",
          href: `${docsUrl}/quickstart/nodejs/introduction`,
          external: true,
          icon: "/images/icons/node-js.svg",
        },
        {
          label: "Go",
          href: `${docsUrl}/quickstart/go/quickstart`,
          external: true,
          icon: "/images/icons/golang.svg",
        },
        {
          label: "Java",
          href: `${docsUrl}/quickstart/java/quickstart`,
          external: true,
          icon: "/images/icons/java.svg",
        },
        {
          label: "Rust",
          href: `${docsUrl}/quickstart/rust/quickstart`,
          external: true,
          icon: "/images/icons/rust.svg",
        },
      ],
    },
  ],
  activePrefixes: [],
};

const resourcesMenu: NavMenu = {
  key: "resources",
  label: "Resources",
  summary: "Blog, comparisons, company",
  sections: [
    {
      id: "learn",
      title: "Learn",
      items: [
        { label: "Blog", description: "Deliverability, APIs and product news", href: "/blog/" },
        {
          label: "Compare providers",
          description: "Lettr next to SendGrid, Mailgun, SES and more",
          href: "/compare/",
        },
        {
          label: "Email glossary",
          description: "Email terms, explained plainly",
          href: "/glossary/",
        },
        { label: "Changelog", description: "What shipped, month by month", href: "/changelog/" },
      ],
    },
    {
      id: "company",
      title: "Company",
      items: [
        { label: "About", description: "The team behind Topol and Ecomail", href: "/about/" },
        {
          label: "Support",
          description: "Replies within 4 hours on business days",
          href: "/support/",
        },
        {
          label: "Talk to the team",
          description: "Book a call about volume or migration",
          href: salesHref,
        },
      ],
    },
  ],
  activePrefixes: ["/blog/", "/compare/", "/glossary/", "/changelog/", "/about/", "/support/"],
};

export const menus: NavMenu[] = [productMenu, developersMenu, resourcesMenu];

export const sisterProducts: NavItem[] = [
  {
    label: "Topol",
    href: "https://topol.io",
    external: true,
    icon: "/images/logos/topol-icon.svg",
  },
  {
    label: "DMARCeye",
    href: "https://dmarceye.com",
    external: true,
    icon: "/images/logos/dmarceye-icon.svg",
  },
];

/** The story featured in the Resources menu: the newest case study or product post. */
export function featuredPost(list: PostMeta[] = posts): PostMeta | undefined {
  return list.find((post) => post.category === "Case study" || post.category === "Product");
}

/** Which top-level destination the current path belongs to, if any. */
export function activeSection(pathname: string): MenuKey | "pricing" | null {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (path === pricingHref) return "pricing";
  const match = menus.find((menu) => menu.activePrefixes.some((prefix) => path.startsWith(prefix)));
  return match?.key ?? null;
}

/** True when an internal nav item points at the current page. */
export function isCurrentItem(item: NavItem, pathname: string): boolean {
  if (item.external) return false;
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return item.href === path;
}
