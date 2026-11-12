import type { Integration, IntegrationSection } from "./types";

/**
 * Every integration Lettr lists, one record each. The hub, the detail pages,
 * the structured data and the llms.txt section are all built from this file.
 *
 * Source: the integrations specification in Linear TPL-3845 (every listing was
 * opened on 2026-11-10) and the Lettr docs. Product claims come only from the
 * docs. A partner entry says what the partner's connector covers today and is
 * never called official. Copy is a draft until Martin approves it.
 */

export const sections: IntegrationSection[] = [
  {
    id: "agents",
    heading: "AI agents and MCP",
    intro: "Let an AI assistant send email, manage templates and check delivery.",
  },
  {
    id: "sdks",
    heading: "SDKs and frameworks",
    intro: "Official libraries for sending from your own code.",
  },
  {
    id: "platforms",
    heading: "Platforms and plugins",
    intro: "Send from the tools your app already runs on.",
  },
  {
    id: "connectors",
    heading: "Connector platforms",
    intro: "Lettr in integration catalogs, built and maintained by each platform.",
  },
  {
    id: "everything",
    heading: "Works with everything else",
    intro: "If a tool sends over SMTP or makes HTTP requests, it works with Lettr.",
  },
];

const checked = "2026-11-10";

export const integrations: Integration[] = [
  // AI agents and MCP
  {
    name: "Hosted MCP server",
    ctaName: "a hosted MCP server",
    slug: "mcp",
    type: "AI agents and MCP",
    category: "agents",
    builtBy: "Lettr",
    statement: "Lettr works with AI assistants through a hosted MCP server at app.lettr.com/mcp.",
    summary: "Send email, manage templates and check delivery from Claude, ChatGPT or Cursor.",
    canDo: [
      "Connect Claude, Claude Code, ChatGPT, Cursor or GitHub Copilot",
      "Send and schedule email in plain language",
      "Manage templates, domains, webhooks, campaigns and your audience",
      "Look into bounces and delivery problems",
    ],
    auth: "OAuth or API key",
    links: {
      docs: "https://docs.lettr.com/learn/mcp/setup",
      listing: "https://app.lettr.com/mcp",
      listingLabel: "Server URL",
    },
    featured: true,
    setup: [
      {
        kind: "steps",
        steps: [
          "In Claude, open Customize, then Connectors, click + and choose Add custom connector.",
          "Enter Lettr as the name and https://app.lettr.com/mcp as the server URL, then click Add.",
          "Click Connect and sign in to Lettr in the window that opens.",
          "Start a new conversation and ask about your sending domains or recent bounces.",
        ],
      },
      {
        kind: "code",
        label: "Claude Code",
        lang: "bash",
        note: "In Claude Code, add the server from your terminal, then run /mcp and choose Authenticate.",
        code: "claude mcp add --transport http lettr https://app.lettr.com/mcp",
      },
    ],
    requirements: [
      "A Lettr account with a verified sending domain",
      "An AI assistant that supports MCP",
    ],
    related: ["agent-skills", "composio", "one"],
    faq: [
      {
        question: "Do I need an API key to connect?",
        answer:
          "No. The server signs you in to Lettr with OAuth. For CI jobs and headless agents it also accepts a Lettr API key in an Authorization header.",
      },
    ],
    seo: {
      title: "MCP Email Integration: Hosted Lettr MCP Server | Lettr",
      description:
        "Lettr works with AI assistants through a hosted MCP server. Send email and check delivery from Claude, ChatGPT or Cursor. Built by Lettr.",
      heading: "Send email from your AI assistant with Lettr",
    },
    keywords: ["claude", "chatgpt", "cursor", "copilot", "ai", "model context protocol"],
    status: "live",
    lastChecked: checked,
    logo: "/images/icons/mcp.svg",
    sortName: "MCP server",
    logoScale: 0.8,
  },
  {
    name: "Agent skills",
    slug: "agent-skills",
    lettermark: ".md",
    type: "AI agents and MCP",
    category: "agents",
    builtBy: "Lettr",
    statement:
      "Lettr works with AI coding agents through agent skills installed with npx skills add.",
    summary: "Teach Claude Code, Cursor or Codex to install Lettr and send email correctly.",
    canDo: [
      "Install the right SDK and configure the API key",
      "Send transactional email and author templates",
      "Wire webhooks and diagnose delivery problems",
    ],
    setup: [
      {
        kind: "code",
        label: "Terminal",
        lang: "bash",
        note: "Set your API key as LETTR_API_KEY. The install skill walks your agent through verifying a sending domain.",
        code: "npx skills add lettr-com/lettr-skills",
      },
    ],
    auth: "API key",
    links: { source: "https://github.com/lettr-com/lettr-skills" },
    requirements: ["A Lettr API key, set as LETTR_API_KEY", "A sending domain verified in Lettr"],
    related: ["mcp", "nodejs", "laravel"],
    seo: {
      title: "Agent Skills Email Integration: Coding Agents | Lettr",
      description:
        "Lettr works with AI coding agents through agent skills. Install the SDK, send email and wire webhooks from Claude Code or Cursor. Built by Lettr.",
      heading: "Teach your coding agent to send email with Lettr",
    },
    keywords: ["claude code", "cursor", "codex", "windsurf", "ai"],
    status: "live",
    lastChecked: checked,
  },
  {
    name: "One",
    slug: "one",
    logo: "/images/icons/one.svg",
    type: "AI agents and MCP",
    category: "agents",
    builtBy: "One",
    statement: "Lettr works with One through 71 actions in One's agent tool catalog.",
    summary: "71 Lettr actions for AI agents, from sending email to campaigns.",
    canDo: [
      "Send, schedule and cancel email",
      "Read email events",
      "Manage templates, domains and webhooks",
      "Manage contacts, lists, segments and topics",
      "Work with campaigns",
    ],
    setup: [
      {
        kind: "steps",
        steps: [
          "Open the Lettr entry in One's catalog.",
          "Connect your Lettr account by following One's connection flow.",
          "Give your agent the Lettr actions it needs.",
        ],
      },
    ],
    auth: "Set up in the platform",
    links: { listing: "https://www.withone.ai/knowledge/lettr" },
    keywords: ["pica", "ai agents"],
    status: "live",
    lastChecked: checked,
    related: ["composio", "mcp", "n8n"],
    seo: {
      title: "One Email Integration: Lettr Actions for AI Agents | Lettr",
      description:
        "Lettr works with One through 71 actions for AI agents: send email, manage templates, contacts and campaigns. Built by One, formerly Pica.",
      heading: "Use Lettr in One",
    },
  },
  {
    name: "Composio",
    slug: "composio",
    logo: "/images/icons/composio.svg",
    type: "AI agents and MCP",
    category: "agents",
    builtBy: "Composio",
    statement: "Lettr works with Composio through a toolkit of 60 tools for AI agents.",
    summary: "A 60-tool Lettr toolkit for agents built on Composio.",
    canDo: [
      "Send and schedule email",
      "Manage templates, domains and webhooks",
      "Manage contacts, lists, segments and topics",
      "Work with campaigns",
    ],
    setup: [
      {
        kind: "steps",
        steps: [
          "Open the Lettr toolkit in Composio.",
          "Connect your Lettr account by following Composio's connection flow.",
          "Add the Lettr tools your agent needs.",
        ],
      },
    ],
    auth: "Set up in the platform",
    links: { listing: "https://composio.dev/toolkits/lettr" },
    keywords: ["ai agents"],
    status: "live",
    lastChecked: checked,
    related: ["one", "mcp", "agent-skills"],
    seo: {
      title: "Composio Email Integration: Lettr Tools for Agents | Lettr",
      description:
        "Lettr works with Composio through a toolkit of 60 tools: send and schedule email, manage templates, contacts and campaigns. Built by Composio.",
      heading: "Use Lettr in Composio",
    },
  },

  // SDKs and frameworks
  {
    name: "Node.js",
    slug: "nodejs",
    type: "SDK",
    category: "sdks",
    builtBy: "Lettr",
    statement: "Lettr works with Node.js and TypeScript through the lettr package on npm.",
    summary: "Type-safe SDK for Node.js and TypeScript, with Next.js and Nuxt guides.",
    canDo: [
      "Send HTML, plain text and template email",
      "Manage templates, domains and webhooks",
      "Manage your audience and campaigns",
    ],
    setup: [
      { kind: "code", label: "Terminal", lang: "bash", code: "npm install lettr" },
      {
        kind: "code",
        label: "send.ts",
        lang: "typescript",
        note: "Every method returns data and error instead of throwing.",
        code: `import { Lettr } from "lettr";

const client = new Lettr(process.env.LETTR_API_KEY!);

const { data, error } = await client.emails.send({
  from: "you@yourdomain.com",
  to: ["recipient@example.com"],
  subject: "Hello",
  html: "<p>Hi there</p>",
});`,
      },
    ],
    auth: "API key",
    requirements: ["Node.js 18 or later"],
    links: {
      docs: "https://docs.lettr.com/quickstart/nodejs/introduction",
      listing: "https://www.npmjs.com/package/lettr",
      listingLabel: "Package on npm",
    },
    featured: true,
    related: ["rest-api", "agent-skills", "php"],
    seo: {
      title: "Node.js Email Integration: TypeScript SDK Setup | Lettr",
      description:
        "Lettr works with Node.js through the lettr package. Send HTML and template email from TypeScript. Built by Lettr. Setup takes 2 steps.",
      heading: "Send email from Node.js with Lettr",
    },
    keywords: ["javascript", "typescript", "next.js", "nuxt", "npm"],
    status: "live",
    lastChecked: checked,
    logo: "/images/icons/node-js.svg",
  },
  {
    name: "PHP",
    slug: "php",
    type: "SDK",
    category: "sdks",
    builtBy: "Lettr",
    statement: "Lettr works with PHP through the lettr/lettr-php package on Packagist.",
    summary: "Type-safe PHP SDK with a fluent email builder.",
    canDo: [
      "Send email with the fluent builder or templates",
      "Manage domains and webhooks",
      "Manage your audience and campaigns",
    ],
    setup: [
      { kind: "code", label: "Terminal", lang: "bash", code: "composer require lettr/lettr-php" },
      {
        kind: "code",
        label: "send.php",
        lang: "php",
        code: `use Lettr\\Lettr;

$lettr = Lettr::client(getenv('LETTR_API_KEY'));

$lettr->emails()->sendHtml(
    from: 'sender@yourdomain.com',
    to: 'recipient@example.com',
    subject: 'Hello',
    html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
);`,
      },
    ],
    auth: "API key",
    requirements: ["PHP 8.4 or later", "Guzzle 7.5 or later, which Composer installs"],
    links: {
      docs: "https://docs.lettr.com/quickstart/php/introduction",
      listing: "https://packagist.org/packages/lettr/lettr-php",
      listingLabel: "Package on Packagist",
    },
    related: ["laravel", "wordpress", "rest-api"],
    seo: {
      title: "PHP Email Integration: Send with the PHP SDK | Lettr",
      description:
        "Lettr works with PHP through the lettr/lettr-php package. Send HTML, text and template email. Built by Lettr. Setup takes 2 steps.",
      heading: "Send email from PHP with Lettr",
    },
    keywords: ["composer", "packagist"],
    status: "live",
    lastChecked: checked,
    logo: "/images/icons/php.svg",
  },
  {
    name: "Laravel",
    slug: "laravel",
    type: "Framework",
    category: "sdks",
    builtBy: "Lettr",
    statement:
      "Lettr works with Laravel through the lettr/lettr-laravel package and the Mail facade.",
    summary: "Mail facade, Mailables and notifications, plus type-safe templates.",
    canDo: [
      "Send with the Mail facade, Mailables and notifications",
      "Generate type-safe enums and DTOs from your templates",
      "Manage domains, webhooks, audience and campaigns",
    ],
    auth: "API key",
    requirements: ["PHP 8.4 or later", "Laravel 10, 11, 12 or 13"],
    links: {
      docs: "https://docs.lettr.com/quickstart/laravel/introduction",
      listing: "https://packagist.org/packages/lettr/lettr-laravel",
      listingLabel: "Package on Packagist",
    },
    featured: true,
    setup: [
      {
        kind: "code",
        label: "Terminal",
        lang: "bash",
        code: "composer require lettr/lettr-laravel",
      },
      {
        kind: "code",
        label: "Terminal",
        lang: "bash",
        note: "The guided setup adds your API key, the Lettr mailer and your sender address.",
        code: "php artisan lettr:init",
      },
      {
        kind: "code",
        label: "Send a template",
        lang: "php",
        code: `use Illuminate\\Support\\Facades\\Mail;

Mail::lettr()
    ->to('user@example.com')
    ->sendTemplate('welcome-email', substitutionData: [
        'name' => 'John',
        'company' => 'Acme Inc',
    ]);`,
      },
    ],
    related: ["php", "agent-skills", "mcp"],
    seo: {
      title: "Laravel Email Integration: Mailer Package Setup | Lettr",
      description:
        "Lettr works with Laravel through the lettr/lettr-laravel package. Send with the Mail facade and Mailables. Built by Lettr. Setup takes 3 steps.",
      heading: "Send email from Laravel with Lettr",
    },
    keywords: ["php", "composer", "mail facade"],
    status: "live",
    lastChecked: checked,
    logo: "/images/icons/laravel.svg",
  },
  {
    name: "Go",
    slug: "go",
    type: "SDK",
    category: "sdks",
    builtBy: "Lettr",
    statement: "Lettr works with Go through the lettr-go module.",
    summary: "Go SDK for sending email and managing your Lettr account.",
    canDo: [
      "Send email and templates",
      "Manage domains and webhooks",
      "Manage your audience and campaigns",
    ],
    auth: "API key",
    links: {
      docs: "https://docs.lettr.com/quickstart/go/quickstart",
      listing: "https://pkg.go.dev/github.com/lettr-com/lettr-go",
      listingLabel: "Module on pkg.go.dev",
      source: "https://github.com/lettr-com/lettr-go",
    },
    setup: [
      {
        kind: "code",
        label: "Terminal",
        lang: "bash",
        code: "go get github.com/lettr-com/lettr-go",
      },
      {
        kind: "code",
        label: "main.go",
        lang: "go",
        code: `client := lettr.NewClient(os.Getenv("LETTR_API_KEY"))

resp, err := client.Emails.Send(ctx, &lettr.SendEmailRequest{
    From:    "sender@yourdomain.com",
    To:      []string{"recipient@example.com"},
    Subject: "Hello from Lettr",
    Html:    "<h1>Hello!</h1><p>This is a test email.</p>",
})`,
      },
    ],
    requirements: ["Go 1.21 or later"],
    related: ["rust", "nodejs", "rest-api"],
    seo: {
      title: "Go Email Integration: Send with the Go SDK | Lettr",
      description:
        "Lettr works with Go through the lettr-go module. Send email with context support and typed errors. Built by Lettr. Setup takes 2 steps.",
      heading: "Send email from Go with Lettr",
    },
    keywords: ["golang"],
    status: "live",
    lastChecked: checked,
    logo: "/images/icons/golang.svg",
  },
  {
    name: "Rust",
    slug: "rust",
    type: "SDK",
    category: "sdks",
    builtBy: "Lettr",
    statement: "Lettr works with Rust through the lettr crate.",
    summary: "Rust SDK for sending email and managing your Lettr account.",
    canDo: [
      "Send email and templates",
      "Manage domains and webhooks",
      "Manage your audience and campaigns",
    ],
    auth: "API key",
    links: {
      docs: "https://docs.lettr.com/quickstart/rust/quickstart",
      listing: "https://crates.io/crates/lettr",
      listingLabel: "Crate on crates.io",
      source: "https://github.com/lettr-com/lettr-rust",
    },
    setup: [
      {
        kind: "code",
        label: "Terminal",
        lang: "bash",
        code: "cargo add lettr\ncargo add tokio --features macros,rt-multi-thread",
      },
      {
        kind: "code",
        label: "main.rs",
        lang: "rust",
        code: `use lettr::{Lettr, CreateEmailOptions};

#[tokio::main]
async fn main() -> lettr::Result<()> {
    let client = Lettr::new("your-api-key");

    let email = CreateEmailOptions::new(
        "sender@yourdomain.com",
        ["recipient@example.com"],
        "Hello from Lettr",
    )
    .with_html("<h1>Hello!</h1><p>This is a test email.</p>");

    client.emails.send(email).await?;
    Ok(())
}`,
      },
    ],
    requirements: ["Rust 1.85 or later", "Tokio as the async runtime"],
    related: ["go", "nodejs", "rest-api"],
    seo: {
      title: "Rust Email Integration: Send with the Rust SDK | Lettr",
      description:
        "Lettr works with Rust through the lettr crate. Send email from async Rust on Tokio. Built by Lettr. Setup takes 2 steps.",
      heading: "Send email from Rust with Lettr",
    },
    keywords: ["cargo", "crate", "tokio"],
    status: "live",
    lastChecked: checked,
    logo: "/images/icons/rust.svg",
  },
  {
    name: "Python",
    slug: "python",
    type: "SDK",
    category: "sdks",
    builtBy: "Lettr",
    statement: "Lettr works with Python through the lettr package on PyPI.",
    summary: "Python SDK with sync and async clients.",
    canDo: ["Send email and templates", "Use the sync or async client", "Manage templates"],
    auth: "API key",
    links: {
      docs: "https://docs.lettr.com/quickstart/python/quickstart",
      listing: "https://pypi.org/project/lettr/",
    },
    // Held: the PyPI page links to a repository and docs address that return 404.
    status: "held",
    lastChecked: checked,
    logo: "/images/icons/python.svg",
  },
  {
    name: "Java",
    slug: "java",
    type: "SDK",
    category: "sdks",
    builtBy: "Lettr",
    statement: "Lettr works with Java through the Lettr SDK on Maven Central.",
    summary: "Java SDK for sending email and managing your Lettr account.",
    canDo: ["Send email and templates", "Manage domains and webhooks"],
    auth: "API key",
    links: {},
    // Held: the docs Maven snippet still shows 1.1.0 while Maven Central has 1.7.0.
    status: "held",
    lastChecked: checked,
    logo: "/images/icons/java.svg",
  },

  // Platforms and plugins
  {
    name: "Supabase",
    slug: "supabase",
    logo: "/images/icons/supabase.svg",
    type: "Platform guide",
    category: "platforms",
    builtBy: "Lettr",
    statement:
      "Lettr works with Supabase through SMTP for Supabase Auth and the HTTP API from Edge Functions.",
    summary: "Auth emails over SMTP, everything else from Edge Functions.",
    canDo: [
      "Send Supabase Auth confirmation, password reset, magic link and invite emails",
      "Send transactional email from Edge Functions",
      "Trigger email from Database Webhooks when a row changes",
      "See every message and its delivery status in the Lettr logs",
    ],
    setup: [
      {
        kind: "steps",
        steps: [
          "In your Supabase project, open Authentication, then SMTP Settings, and turn on Enable Custom SMTP.",
          "Set the sender email to an address on a domain you verified in Lettr.",
          "Enter host smtp.lettr.com, port 465, username lettr, and your Lettr API key as the password.",
          "Save. Supabase Auth emails now send through Lettr.",
        ],
      },
      {
        kind: "code",
        label: "Edge Function",
        lang: "typescript",
        note: "For email beyond Auth, store your key with supabase secrets set LETTR_API_KEY=… and call the API from an Edge Function.",
        code: `Deno.serve(async (req) => {
  const { to, subject, html } = await req.json();

  const res = await fetch("https://app.lettr.com/api/emails", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${Deno.env.get("LETTR_API_KEY")}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "noreply@yourdomain.com",
      to: [to],
      subject,
      html,
    }),
  });

  return new Response(await res.text(), { status: res.status });
});`,
      },
    ],
    auth: "SMTP credentials",
    requirements: ["A Supabase project", "A sending domain verified in Lettr", "A Lettr API key"],
    links: { docs: "https://docs.lettr.com/integrations/supabase" },
    featured: true,
    keywords: ["auth emails", "edge functions", "postgres"],
    status: "live",
    lastChecked: checked,
    // Supabase's brand guide: the green icon for small spaces and beside other brand icons, on light or dark.
    logoScale: 0.8,
    related: ["wordpress", "stripe", "smtp-relay"],
    faq: [
      {
        question: "Can Supabase Auth send its emails through Lettr?",
        answer:
          "Yes. Turn on custom SMTP in Supabase Auth and enter smtp.lettr.com, port 465, username lettr and your Lettr API key. Confirmation, password reset, magic link and invite emails then send through Lettr.",
      },
      {
        question: "Can I keep using Supabase's email templates?",
        answer:
          "Yes. Supabase renders its auth templates, including variables such as {{ .ConfirmationURL }}, before it hands the message to Lettr for delivery.",
      },
    ],
    seo: {
      title: "Supabase Email Integration: SMTP and API Setup | Lettr",
      description:
        "Lettr works with Supabase through SMTP and the HTTP API. Send Auth emails and email from Edge Functions. Built by Lettr. Setup takes 4 steps.",
      heading: "Send email from Supabase with Lettr",
    },
  },
  {
    name: "WordPress",
    slug: "wordpress",
    logo: "/images/icons/wordpress.svg",
    type: "Plugin",
    category: "platforms",
    builtBy: "Lettr",
    statement:
      "Lettr works with WordPress through a plugin that sends every wp_mail() email through the Lettr API.",
    summary: "One plugin for every wp_mail() email, WooCommerce included.",
    canDo: [
      "Send every email that calls wp_mail(), from WooCommerce to contact forms",
      "Send attachments, HTML and plain text",
      "Send a test email from the plugin's setup page",
      "Track delivery, opens, clicks and bounces in the Lettr logs",
    ],
    setup: [
      {
        kind: "steps",
        steps: [
          "Install the Lettr plugin from wordpress.org, or upload the ZIP from GitHub under Plugins, Add Plugin, Upload Plugin.",
          "Activate it. WordPress opens the plugin's setup page.",
          "Enter your Lettr API key and a sender address on a domain you verified in Lettr.",
          "Send a test email and check it in the Lettr logs.",
        ],
      },
    ],
    auth: "API key",
    requirements: [
      "WordPress 5.8 or later",
      "PHP 7.2 or later",
      "A sending domain verified in Lettr",
    ],
    links: {
      docs: "https://docs.lettr.com/integrations/wordpress",
      listing: "https://wordpress.org/plugins/lettr/",
      listingLabel: "Plugin on wordpress.org",
      source: "https://github.com/lettr-com/lettr-wordpress",
    },
    keywords: ["woocommerce", "wp_mail", "smtp plugin"],
    status: "live",
    lastChecked: checked,
    related: ["supabase", "smtp-relay", "php"],
    faq: [
      {
        question: "Do I need to configure SMTP?",
        answer:
          "No. The plugin sends through the Lettr HTTP API, so there are no SMTP settings and no ports to open on your server.",
      },
      {
        question: "Does it work with WooCommerce and contact form plugins?",
        answer:
          "Yes. Any plugin that sends with wp_mail(), including WooCommerce and Contact Form 7, sends through Lettr once the plugin is active.",
      },
    ],
    seo: {
      title: "WordPress Email Integration: Plugin for wp_mail | Lettr",
      description:
        "Lettr works with WordPress through a plugin that replaces wp_mail(). WooCommerce and form emails send via Lettr. Built by Lettr. Setup takes 4 steps.",
      heading: "Send email from WordPress with Lettr",
    },
  },
  {
    name: "Stripe",
    slug: "stripe",
    logo: "/images/icons/stripe.svg",
    type: "Marketplace app",
    category: "platforms",
    builtBy: "Lettr",
    statement: "Lettr works with Stripe through the Lettr app on the Stripe App Marketplace.",
    summary: "Send emails and templates to customers without leaving Stripe.",
    canDo: [
      "Send a one-off email from a customer's Stripe profile",
      "Send a saved Lettr template without leaving Stripe",
      "Personalize email with the customer's Stripe details",
    ],
    setup: [
      {
        kind: "steps",
        steps: [
          "Open the Lettr app on the Stripe App Marketplace and click Install.",
          "Authorize the app for your Stripe account.",
          "Enter a Lettr API key with sending permission.",
          "Open a customer in Stripe and send from the Lettr panel in the sidebar.",
        ],
      },
    ],
    auth: "API key",
    requirements: ["A Stripe account", "A sending domain verified in Lettr"],
    links: {
      docs: "https://docs.lettr.com/integrations/stripe",
      listing: "https://marketplace.stripe.com/apps/lettr",
      listingLabel: "App on the Stripe App Marketplace",
    },
    keywords: ["payments", "billing"],
    status: "live",
    lastChecked: checked,
    related: ["supabase", "n8n", "wordpress"],
    seo: {
      title: "Stripe Email Integration: Send from the Dashboard | Lettr",
      description:
        "Lettr works with Stripe through a marketplace app. Send emails and saved templates from a customer's profile. Built by Lettr. Setup takes 4 steps.",
      heading: "Send email from Stripe with Lettr",
    },
  },
  {
    name: "n8n",
    slug: "n8n",
    logo: "/images/icons/n8n.svg",
    type: "Automation platform",
    category: "platforms",
    builtBy: "Lettr",
    statement: "Lettr works with n8n through the Lettr node, verified by n8n.",
    summary: "A verified n8n node for email, templates, audience and campaigns.",
    canDo: [
      "Send, schedule and cancel email in a workflow",
      "Manage templates, domains and webhooks",
      "Manage contacts, lists, topics and segments",
      "Send and schedule campaigns",
    ],
    setup: [
      {
        kind: "steps",
        steps: [
          "In n8n, open the nodes panel and search for Lettr.",
          "Add the Lettr node to your workflow.",
          "Create a Lettr credential with your API key.",
          "Pick a resource and operation, such as Email and Send.",
        ],
      },
    ],
    auth: "API key",
    links: {
      listing: "https://n8n.io/integrations/lettr/",
      listingLabel: "Node on n8n.io",
      source: "https://github.com/lettr-com/lettr-n8n",
    },
    keywords: ["automation", "workflow"],
    status: "live",
    lastChecked: checked,
    related: ["stripe", "one", "composio"],
    seo: {
      title: "n8n Email Integration: Send Email from Workflows | Lettr",
      description:
        "Lettr works with n8n through a verified node. Send and schedule email, manage templates and contacts in a workflow. Built by Lettr. Setup takes 4 steps.",
      heading: "Send email from n8n with Lettr",
    },
  },
  {
    name: "Zapier",
    slug: "zapier",
    type: "Automation platform",
    category: "platforms",
    builtBy: "Lettr",
    statement: "Lettr works with Zapier through the Lettr app on Zapier.",
    summary: "Send email from a Zap.",
    canDo: ["Send email from a Zap"],
    auth: "API key",
    links: {
      docs: "https://docs.lettr.com/integrations/zapier",
      listing: "https://zapier.com/apps/lettr/integrations",
    },
    // Held: the Zapier listing describes Lettr as "a email API for artisans". Lettr owns that text.
    status: "held",
    lastChecked: checked,
  },

  // Connector platforms
  {
    name: "MindCloud",
    slug: "mindcloud",
    logo: "/images/icons/mindcloud.svg",
    type: "Connector platform",
    category: "connectors",
    builtBy: "MindCloud",
    statement: "Lettr works with MindCloud through 32 actions in MindCloud's app catalog.",
    summary: "32 Lettr actions for email, templates, domains and webhooks.",
    canDo: [
      "Send and schedule email",
      "Read email events",
      "Manage templates, domains and webhooks",
    ],
    setup: [
      {
        kind: "steps",
        steps: [
          "Open the Lettr app in MindCloud.",
          "Connect your Lettr account by following MindCloud's connection flow.",
          "Use the Lettr actions in your integrations.",
        ],
      },
    ],
    auth: "Set up in the platform",
    links: { listing: "https://mindcloud.co/apps/lettr/integrations" },
    keywords: ["ipaas"],
    status: "live",
    lastChecked: checked,
    related: ["tray", "n8n", "one"],
    seo: {
      title: "MindCloud Email Integration: Lettr Actions | Lettr",
      description:
        "Lettr works with MindCloud through 32 actions: send and schedule email, read events, manage templates, domains and webhooks. Built by MindCloud.",
      heading: "Use Lettr in MindCloud",
    },
  },
  {
    name: "Tray.ai",
    slug: "tray",
    logo: "/images/icons/tray.svg",
    type: "Connector platform",
    category: "connectors",
    builtBy: "Tray.ai",
    statement: "Lettr works with Tray.ai through a connector built on Tray's HTTP connector.",
    summary: "24 documented Lettr actions and 7 webhook events.",
    canDo: [
      "Send email and work with campaigns",
      "Manage contacts and lists",
      "Manage templates and domains",
      "React to 7 Lettr webhook events",
    ],
    setup: [
      {
        kind: "steps",
        steps: [
          "Open the Lettr connector page on Tray.ai.",
          "Connect your Lettr account by following Tray's connection flow.",
          "Use the Lettr actions and webhook events in your workflows.",
        ],
      },
    ],
    auth: "Set up in the platform",
    links: { listing: "https://tray.ai/connectors/lettr-integrations/" },
    keywords: ["tray.io", "ipaas"],
    status: "live",
    lastChecked: checked,
    related: ["mindcloud", "n8n", "composio"],
    seo: {
      title: "Tray.ai Email Integration: Lettr Connector | Lettr",
      description:
        "Lettr works with Tray.ai through 24 documented actions and 7 webhook events: email, campaigns, contacts and templates. Built by Tray.ai.",
      heading: "Use Lettr in Tray.ai",
    },
  },

  // Works with everything else
  {
    name: "SMTP relay",
    slug: "smtp-relay",
    type: "Protocol",
    category: "everything",
    builtBy: "Lettr",
    statement: "Lettr works with any tool that sends over SMTP through smtp.lettr.com.",
    summary: "Point any SMTP setting at smtp.lettr.com. No code changes.",
    canDo: [
      "Send from any app, CMS or framework that speaks SMTP",
      "Move from another provider by changing credentials",
    ],
    auth: "SMTP credentials",
    links: { docs: "https://docs.lettr.com/quickstart/smtp/introduction" },
    setup: [
      {
        kind: "steps",
        steps: [
          "Set the SMTP host to smtp.lettr.com.",
          "Use port 465 with implicit TLS or 587 with STARTTLS. Ports 2465 and 2587 work when the standard ones are blocked.",
          "Use lettr as the username and your Lettr API key as the password.",
          "Send from an address on a domain you verified in Lettr.",
        ],
      },
    ],
    requirements: ["A Lettr API key", "A sending domain verified in Lettr"],
    related: ["wordpress", "supabase", "rest-api"],
    faq: [
      {
        question: "Which port should I use?",
        answer:
          "Port 465 with implicit TLS or 587 with STARTTLS. If a firewall blocks those, try 2465 or 2587. Many cloud providers block port 25.",
      },
    ],
    seo: {
      title: "SMTP Email Integration: Lettr SMTP Relay Settings | Lettr",
      description:
        "Lettr works with any tool that sends over SMTP. Point it at smtp.lettr.com and use your API key as the password. Built by Lettr. Setup takes 4 steps.",
      heading: "Send email over SMTP with Lettr",
    },
    keywords: ["smtp", "mail server"],
    status: "live",
    lastChecked: checked,
    logo: "/images/icons/smtp.svg",
  },
  {
    name: "REST API",
    slug: "rest-api",
    type: "API",
    category: "everything",
    builtBy: "Lettr",
    statement: "Lettr works with anything that makes HTTP requests through the REST API.",
    summary: "Send email and manage your account over HTTP.",
    canDo: [
      "Send and schedule email",
      "Manage templates, domains, webhooks, audience and campaigns",
    ],
    auth: "API key",
    links: { docs: "https://docs.lettr.com/api-reference/emails/send-email" },
    setup: [
      {
        kind: "code",
        label: "Terminal",
        lang: "bash",
        code: `curl -X POST https://app.lettr.com/api/emails \\
  -H "Authorization: Bearer $LETTR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "noreply@yourdomain.com",
    "to": ["recipient@example.com"],
    "subject": "Hello from Lettr",
    "html": "<p>It works.</p>"
  }'`,
      },
    ],
    requirements: ["A Lettr API key", "A sending domain verified in Lettr"],
    related: ["nodejs", "webhooks", "smtp-relay"],
    seo: {
      title: "REST API Email Integration: Send over HTTP | Lettr",
      description:
        "Lettr works with anything that makes HTTP requests through the REST API. Send and schedule email with one call. Built by Lettr.",
      heading: "Send email over HTTP with Lettr",
    },
    keywords: ["http", "curl", "api"],
    status: "live",
    lastChecked: checked,
    logo: "/images/icons/api.svg",
  },
  {
    name: "Webhooks",
    slug: "webhooks",
    type: "Protocol",
    category: "everything",
    builtBy: "Lettr",
    statement: "Lettr works with your own endpoints through webhooks that report email events.",
    summary: "Get delivery, bounce, open, click and inbound events as they happen.",
    canDo: [
      "Get delivery, bounce, delay and spam complaint events",
      "Get open and click events",
      "Get unsubscribe events",
      "Get inbound relay events",
    ],
    auth: "Set per endpoint",
    links: { docs: "https://docs.lettr.com/learn/webhooks/event-types" },
    setup: [
      {
        kind: "steps",
        steps: [
          "In Lettr, open Webhooks in the sidebar and click Create Webhook.",
          "Name the webhook and enter the HTTPS address of your endpoint.",
          "Choose all events, or pick types from the message, engagement, generation, unsubscribe and relay groups.",
          "Set Basic Auth or OAuth 2.0 for deliveries, then save.",
        ],
      },
    ],
    requirements: ["A public HTTPS endpoint"],
    related: ["rest-api", "n8n", "smtp-relay"],
    seo: {
      title: "Webhooks Email Integration: Delivery Event Setup | Lettr",
      description:
        "Lettr works with your endpoints through webhooks for delivery, bounce, open, click and inbound events. Built by Lettr. Setup takes 4 steps.",
      heading: "Get Lettr email events with webhooks",
    },
    keywords: ["events", "callbacks", "bounces"],
    status: "live",
    lastChecked: checked,
  },
];
