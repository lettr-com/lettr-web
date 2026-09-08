import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-02",

  features: [
    {
      title: "Lettr Is Live",
      modules: ["transactional", "platform"],
      tags: ["API", "SDKs", "Deliverability", "UI/UX", "Billing"],
      lead:
        "An email API built for the Laravel ecosystem, from the team behind Topol.io and" +
        " DMARCeye.",
      body: [
        "Setting up transactional email in a new project means wiring a mail driver, picking a" +
          " service, wrestling DNS records and designing templates in some external tool. Then" +
          " the visibility runs out: nothing shows what your application is actually sending," +
          " whether the welcome emails are landing in inboxes or spam folders, or that something" +
          " broke three days ago. We wanted something that belonged in the ecosystem instead of" +
          " sitting next to it.",
        "Install the package, add an API key, and the first email goes out. Templates can be" +
          " built in the drag-and-drop editor — we brought over the best parts of Topol.io — or" +
          " written as HTML, whichever you would rather. Merge tags fill them in per recipient," +
          " and saved sections shared across templates propagate everywhere they are used when" +
          " you edit one.",
        "Sending domains walk you through the DNS. Lettr identifies your DNS provider from the" +
          " nameservers and shows the records next to its name, and for Cloudflare it can" +
          " generate a one-click setup link rather than making you type anything. Records are" +
          " re-checked rather than trusted once, with a short grace period and repeated failures" +
          " required before a domain is marked broken, so one slow lookup does not undo a" +
          " verified domain. You can also point your own domain at the storage holding the images" +
          " your emails use.",
        "There is more than one way in. Beyond the REST API there is an SMTP relay, for" +
          " applications that already speak SMTP and are not going to be rewritten, and an MCP" +
          " server so an AI assistant can work with your templates and analytics directly.",
        "Everything you send is visible. The dashboard covers delivery and open rates with trends;" +
          " a `tag` on a send — filled in automatically from the template slug if you do not set" +
          " one — groups your analytics by the kind of email it was, so password resets and" +
          " invoices can be told apart without any extra work. The event log goes down to" +
          " individual messages and what happened to them. Alerts cover the things that stop" +
          " sends: approaching your plan limit, and a domain that is unverified or blocked.",
        "API keys can be restricted to a set of IP addresses, and every send answers with your" +
          " remaining quota in the response headers. Requests are throttled at three a second" +
          " across all of a team's keys.",
        "The free plan is genuinely free, with no card required: 3,000 emails a month, and 100 a" +
          " day. Paid plans start at 50,000 a month.",
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
        "A key can be created as Sandbox instead of Live, and needs no verified sending domain to" +
        " work.",
      body: [
        "A sandbox send costs nothing and reaches nobody: every recipient is replaced with your" +
          " own address, `cc` and `bcc` are dropped, and it skips billing and your daily limit" +
          " entirely. Sandbox keys are throttled separately and refused by every write endpoint," +
          " so nothing you do with one can change your account. The sends are readable back" +
          " through the same endpoints as everything else.",
      ],
      docs: {
        label: "Sandbox",
        href: "https://docs.lettr.com/learn/api-keys/sandbox",
      },
    },
    {
      title: "Scheduled Sending Over The API",
      modules: ["transactional"],
      tags: ["API"],
      lead: "Schedule a send, look it up, and cancel it before it goes.",
      body: [
        "`scheduled_at` has to be at least five minutes and at most three days ahead. Scheduling" +
          " reuses the entire ordinary send path, so domain checks, quota and counters all apply" +
          " exactly as they do to an immediate send.",
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
    {
      title: "Manage Webhooks Over The API",
      modules: ["platform"],
      tags: ["API", "Webhooks"],
      lead:
        "Webhooks stopped being something you could only create in the interface — they can now be" +
        " created, updated and deleted from code.",
      body: [
        "An update is partial, so you can change a name, a target, an auth type, the events it is" +
          " subscribed to or whether it is active, without resending the rest.",
      ],
      docs: {
        label: "Create a webhook",
        href: "https://docs.lettr.com/api-reference/webhooks/create-webhook",
      },
    },
    {
      title: "Query Events Across Every Email",
      modules: ["transactional"],
      tags: ["API"],
      lead:
        "A new endpoint searches events across all of your mail rather than one message at a" +
        " time, filtering by event type, recipient, date range and bounce class.",
      body: [
        "The events themselves gained real shapes at the same time. Eighteen types — delivery," +
          " bounce, delay, click, open, spam complaint, unsubscribe, policy rejection and the" +
          " rest — each carry their own fields, with the user agent parsed out into browser," +
          " operating system and device, and location data alongside. Opens that a mailbox" +
          " provider prefetched are labelled as such in the event log. `from` and `to` were added" +
          " to both the list and the detail response.",
      ],
      docs: {
        label: "List email events",
        href: "https://docs.lettr.com/api-reference/emails/list-email-events",
      },
    },
    {
      title: "Loops In Substitution Data",
      modules: ["transactional"],
      tags: ["API"],
      lead: "`data` used to be a flat map of strings. It now takes any scalar, and arrays of objects.",
      body: [
        "Which means order lines, itemised receipts and digest lists can be looped over inside the" +
          " template instead of being rendered into a string before you send them. Objects nested" +
          " more than one level deep are rejected, and the message names the key that caused it.",
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
  ],

  improvements: [
    {
      title: "API Key Scopes Are Enforced",
      modules: ["platform"],
      tags: ["API", "Security", "Breaking"],
      lead: "Key permissions stopped being decorative and are now checked on every route.",
      body: [
        "Ten scopes cover sending, templates, domains, webhooks and projects. The two presets map" +
          " onto them — full grants everything, sending-only grants just the send scopes — and a" +
          " custom set is accepted too.",
        "If you issued a sending-only key and used it to read templates or domains, that stops" +
          " working here. A key carrying a scope we do not recognise is now refused rather than" +
          " waved through.",
      ],
      docs: {
        label: "API key permissions",
        href: "https://docs.lettr.com/learn/api-keys/permissions",
      },
    },
    {
      title: "Every Save Is A Version",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead: "The separate draft is gone; saving an email creates a version.",
      body: [
        "The publish-draft step, the draft badge and the next-version indicator went with it." +
          " Merge tags are extracted and stored as part of the same save, the update response" +
          " tells you which version it created, and the editor can be opened against any earlier" +
          " version.",
      ],
      docs: {
        label: "Versions",
        href: "https://docs.lettr.com/learn/templates/versions",
      },
    },
    {
      title: "Adding A Sending Domain No Longer Waits For Review",
      modules: ["platform"],
      tags: ["Deliverability"],
      lead:
        "A new domain used to be created pending while it was scored, and could not send until" +
        " somebody approved it.",
      body: [
        "Domains are usable straight away now. Enforcement moved behind the send instead: a" +
          " domain that turns out to be a problem is blocked there, and an attempt to send from a" +
          " blocked domain fails with a message saying so rather than being quietly accepted.",
      ],
      docs: {
        label: "Sending domains",
        href: "https://docs.lettr.com/learn/domains/sending-domains",
      },
    },
    {
      title: "Templates Are Now Called Emails",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead: "The same thing, named the way everyone was already describing it. The API is unchanged.",
    },
    {
      title: "Merge Tags Can Be Marked Required",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead:
        "Click a merge tag's badge on an email to mark it required; required tags render" +
        " highlighted.",
    },
    {
      title: "Version History Was Redesigned",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead:
        "Clearer wording about what saving and publishing each do, and deleting the last remaining" +
        " version is now refused rather than allowed.",
      body: [
        "Previewing a version that is not the live one is flagged quietly rather than in alarm" +
          " colours, since looking at an old version is a normal thing to do.",
      ],
      docs: {
        label: "Versions",
        href: "https://docs.lettr.com/learn/templates/versions",
      },
    },
    {
      title: "Signing In With Google Or GitHub No Longer Dead-Ends",
      modules: ["platform"],
      tags: ["UI/UX", "Security"],
      lead:
        "Leaving the tab open long enough for the sign-in to expire used to produce an unhandled" +
        " error rather than a page.",
      body: [
        "You are now returned to the login screen and told the session expired and to try again." +
          " An oversized avatar URL from a provider can also no longer break account creation.",
      ],
    },
    {
      title: "Changing Your Password Signs Out Your Other Sessions",
      modules: ["platform"],
      tags: ["Security"],
      lead:
        "Which is what most people already assume it does. Names on users and teams are also" +
        " stripped of markup when saved, so one cannot carry anything into an email or a page.",
    },
    {
      title: "The API Reference Matches The API",
      modules: ["transactional"],
      tags: ["Docs", "API"],
      lead:
        "Paths and schemas that no longer existed were removed, the email-detail endpoint was" +
        " documented properly, and the full set of event types was written up.",
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
        "Fixed the quickstart email being sent again every time a verification event arrived for" +
        " someone already verified. It recorded that it had sent one but never checked first, so" +
        " re-verifying meant another copy.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "Fixed the single-email endpoint returning a borrowed error code when a message could not" +
        " be retrieved, instead of one that says what actually went wrong.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "Fixed the latitude and longitude on an event changing type between responses — whole" +
        " numbers came back as numbers and everything else as strings. They are always strings" +
        " now.",
    },
  ],
};
