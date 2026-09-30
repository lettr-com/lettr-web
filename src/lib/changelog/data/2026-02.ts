import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-02",
  published: "2026-02-14",

  features: [
    {
      title: "Public Launch Of The Lettr Email API",
      modules: ["transactional", "platform"],
      tags: ["API", "SDKs", "Deliverability", "UI/UX", "Billing"],
      lead:
        "Lettr is now open to everyone: an email API built for Laravel, from the team behind" +
        " Topol.io and DMARCeye.",
      body: [
        "Installing the `lettr/lettr-laravel` package and adding an API key is all it takes to" +
          " send the first email. Applications that already send over SMTP can use the SMTP relay" +
          " instead of the REST API, and an MCP server lets an AI assistant work with your emails" +
          " and analytics.",
        "Emails are built in the drag-and-drop Topol editor or written as HTML. Merge tags fill" +
          " them in for each recipient, and a saved section used in several emails is updated in" +
          " all of them when it is edited. The images in your emails can be served from your own" +
          " domain.",
        "Adding a sending domain shows its DNS records next to the name of your DNS provider," +
          " which Lettr finds from the domain's nameservers, and for Cloudflare it creates a" +
          " one-click setup link. Records are checked again after the domain is verified, and a" +
          " record is only marked broken after a short grace period and several failed checks in" +
          " a row, so one slow lookup doesn't undo a verified domain.",
        "The dashboard shows delivery and open rates with trends. A `tag` on a send groups the" +
          " analytics by kind of email, such as password resets or invoices, and is filled in" +
          " from the email's slug when it is not set. The event log shows what happened to each" +
          " message, and alerts warn when you are close to your plan limit or a domain is" +
          " unverified or blocked.",
        "API keys can be limited to a set of IP addresses, and every send returns your" +
          " remaining quota in its response headers. Requests are limited to 3 per second across" +
          " all of a team's keys. The free plan needs no card and includes 3,000 emails a month," +
          " with at most 100 a day; paid plans start at 50,000 a month.",
      ],
      code: {
        lang: "bash",
        source: `composer require lettr/lettr-laravel
php artisan lettr:init`,
      },
      docs: {
        label: "Sending email",
        href: "https://docs.lettr.com/learn/sending/introduction",
      },
    },
    {
      title: "Sandbox API Keys",
      modules: ["transactional", "platform"],
      tags: ["API"],
      lead:
        "An API key can now be created as Sandbox instead of Live, and a sandbox key works" +
        " without a verified sending domain.",
      body: [
        "A sandbox send costs nothing and reaches only you: every recipient is replaced with" +
          " your own address, `cc` and `bcc` are left out, and the send doesn't count against" +
          " your quota or daily limit. Sandbox keys have their own rate limit of 10 requests a" +
          " minute and 100 a day, and every endpoint that changes your account refuses them with" +
          " a 403, so a sandbox key can't change anything.",
        "Sandbox sends can be read back through the same endpoints as other emails, and a new" +
          " Sandbox switch on the Events page shows them in the app.",
      ],
      docs: {
        label: "Sandbox",
        href: "https://docs.lettr.com/learn/api-keys/sandbox",
      },
    },
    {
      title: "Scheduled Sending Endpoints With A Three-Day Window",
      modules: ["transactional"],
      tags: ["API"],
      lead:
        "New endpoints under `/emails/scheduled` schedule a send for later, look it up, and" +
        " cancel it before it goes out.",
      body: [
        "`scheduled_at` must be at least five minutes and at most three days ahead. A scheduled" +
          " send goes through the same checks as an immediate one, so domain checks, quota and" +
          " counters all apply in the same way.",
      ],
      code: {
        lang: "bash",
        source: `curl -X POST https://app.lettr.com/api/emails/scheduled \\
  -H "Authorization: Bearer $LETTR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "hello@example.com",
    "to": ["jane@example.com"],
    "template_slug": "trial-ending",
    "scheduled_at": "2026-03-01T09:00:00Z"
  }'`,
      },
      docs: {
        label: "Schedule an email",
        href: "https://docs.lettr.com/api-reference/emails/schedule-email",
      },
    },
  ],

  improvements: [
    {
      title: "API Key Scopes Enforced On Every Endpoint",
      modules: ["platform"],
      tags: ["API", "Security", "Breaking"],
      lead:
        "API key permissions are now checked on every API endpoint, where they used to have no" +
        " effect.",
      body: [
        "Ten scopes cover sending, templates, domains, webhooks and projects. The full preset" +
          " grants all of them, the sending-only preset grants only the send scopes, and a custom" +
          " list of scopes is accepted too. A request the key has no permission for returns a 403" +
          " with `insufficient_scope`.",
        "A sending-only key used to read templates or domains no longer can, so give any key" +
          " that needs those reads full access or the matching scopes.",
      ],
      docs: {
        label: "API key permissions",
        href: "https://docs.lettr.com/learn/api-keys/permissions",
      },
    },
    {
      title: "Create, Update And Delete Endpoints For Webhooks",
      modules: ["platform"],
      tags: ["API", "Webhooks"],
      lead: "Webhooks can now be created, updated and deleted through the API, not only in the app.",
      body: [
        "An update changes only the fields it sends: the name, the target URL, the auth type," +
          " the subscribed events or whether the webhook is active.",
      ],
      docs: {
        label: "Create a webhook",
        href: "https://docs.lettr.com/api-reference/webhooks/create-webhook",
      },
    },
    {
      title: "Account-Wide Events Endpoint With Typed Event Objects",
      modules: ["transactional"],
      tags: ["API"],
      lead:
        "The new `GET /emails/events` searches events across all of your emails instead of one" +
        " message at a time, filtered by event type, recipient, date range and bounce class.",
      body: [
        "Each of the 18 event types, such as delivery, bounce, delay, click, open, spam" +
          " complaint, unsubscribe and policy rejection, now returns its own fields. Events also" +
          " include the browser, operating system and device read from the user agent, and" +
          " location data. Opens that a mailbox provider loaded in advance are labelled as" +
          " prefetched in the event log. The email list and detail responses now include `from`" +
          " and `to`.",
      ],
      docs: {
        label: "List email events",
        href: "https://docs.lettr.com/api-reference/emails/list-email-events",
      },
    },
    {
      title: "Substitution Data Accepts Arrays Of Objects For Loops",
      modules: ["transactional"],
      tags: ["API"],
      lead:
        "`data` on a send now accepts numbers, true/false values and arrays of objects, where it" +
        " used to accept only a flat map of strings.",
      body: [
        "Order lines, itemised receipts and digest lists can now be looped over inside the" +
          " email instead of being turned into one string before sending. Objects nested more" +
          " than one level deep are rejected, and the error names the key that caused it.",
      ],
      code: {
        lang: "bash",
        source: `curl -X POST https://app.lettr.com/api/emails \\
  -H "Authorization: Bearer $LETTR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "orders@example.com",
    "to": ["jane@example.com"],
    "template_slug": "order-confirmation",
    "data": {
      "first_name": "Jane",
      "items": [
        { "name": "Keyboard", "qty": 1, "price": "89.00" },
        { "name": "Cable", "qty": 2, "price": "12.00" }
      ]
    }
  }'`,
      },
      docs: {
        label: "Template language",
        href: "https://docs.lettr.com/learn/templates/template-language",
      },
    },
    {
      title: "Saving An Email Creates A New Version Instead Of A Draft",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead: "Saving an email now creates a new version, and the separate draft is gone.",
      body: [
        "The draft used to need a publish step, with a draft badge and a next-version" +
          " indicator; all three have been removed. Merge tags are saved with each version, the" +
          " update response names the version it created, and the editor can open any earlier" +
          " version.",
      ],
      docs: {
        label: "Versions",
        href: "https://docs.lettr.com/learn/templates/versions",
      },
    },
    {
      title: "Sending Domains Usable Without Manual Approval",
      modules: ["platform"],
      tags: ["Deliverability"],
      lead:
        "A new sending domain can now send straight away, where it used to stay pending until" +
        " someone reviewed and approved it.",
      body: [
        "Problem domains are now blocked at send time instead. A send from a blocked domain" +
          " fails with an error that says so, where it used to be accepted without one.",
      ],
      docs: {
        label: "Sending domains",
        href: "https://docs.lettr.com/learn/domains/sending-domains",
      },
    },
    {
      title: "Templates Renamed To Emails In The App",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead:
        "What the app called templates is now called emails everywhere, and the API stays the" +
        " same.",
    },
    {
      title: "Required Flag For Merge Tags Per Email Version",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead:
        "A merge tag on an email version can now be marked required by clicking its badge, and" +
        " required tags are highlighted.",
    },
    {
      title: "Redesigned Version History That Keeps The Last Version",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead:
        "Version history has a new layout with clearer wording on what saving and publishing each" +
        " do, and the last remaining version can no longer be deleted.",
      body: [
        "Previewing a version that isn't the live one is now marked in grey instead of a" +
          " warning color, since looking at an old version is a normal thing to do.",
      ],
      docs: {
        label: "Versions",
        href: "https://docs.lettr.com/learn/templates/versions",
      },
    },
    {
      title: "Expired Google And GitHub Sign-Ins Return To The Login Page",
      modules: ["platform"],
      tags: ["UI/UX", "Security"],
      lead:
        "A Google or GitHub sign-in that expired because the tab was left open now returns to the" +
        " login page with a message to try again, instead of an error.",
      body: [
        "A very long avatar URL from the provider can also no longer stop the account from" +
          " being created.",
      ],
    },
    {
      title: "Password Changes Sign Out All Other Sessions",
      modules: ["platform"],
      tags: ["Security"],
      lead: "Changing your password now signs you out of Lettr on every other device and browser.",
      body: [
        "User and team names are also stripped of markup when saved, so a name can't carry code" +
          " into an email or a page.",
      ],
    },
    {
      title: "API Reference Updated For Email Detail And All Event Types",
      modules: ["transactional"],
      tags: ["Docs", "API"],
      lead:
        "The API reference no longer lists paths and schemas that were removed, documents the" +
        " email detail endpoint properly, and describes every event type.",
      docs: {
        label: "API reference",
        href: "https://docs.lettr.com/api-reference/introduction",
      },
    },
  ],

  bugfixes: [
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "The quickstart email is no longer sent again each time an already verified account" +
        " receives another verification event.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "Fixed the single-email endpoint returning an unrelated error code when a message" +
        " couldn't be retrieved; it now returns its own code.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "Event latitude and longitude are now always strings, where whole numbers used to come" +
        " back as numbers.",
    },
  ],
};
