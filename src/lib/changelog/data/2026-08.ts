import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-08",
  published: "2026-08-31",

  features: [
    {
      title: "Manage Email Preferences Page Replaces The Unsubscribe Screen",
      modules: ["audience", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "The unsubscribe link in every email now opens a page where recipients choose their" +
        " topics, pause emails or unsubscribe, instead of a screen that could only unsubscribe.",
      body: [
        "The page shows the recipient's current status (Subscribed, Paused, Unsubscribed or Not" +
          " receiving emails), a checkbox for each topic, a pause of 30, 60 or 90 days, and the" +
          " campaigns they recently received, each linked to its web version. One “Update" +
          " preferences” button saves everything. Unticking every topic unsubscribes, after" +
          " asking for a reason, and ticking topics again brings an unsubscribed recipient back.",
        "Topic opt-outs and pauses are checked again just before each part of a campaign is" +
          " sent, so a change made during a large send still counts. A full unsubscribe also" +
          " removes the recipient from private topics for good, so subscribing again does not" +
          " bring them back.",
        "The page still opens when a link carries a broken parameter. Its limits count requests" +
          " per contact, not per IP address, so security gateways that open links before delivery" +
          " can't stop a real recipient from unsubscribing.",
        "Pauses show in Audiences too: a Paused badge with its end date, a Paused filter (the" +
          " Subscribed filter no longer includes paused contacts), and the status and a" +
          " `paused_until` column in CSV exports. The API adds a `paused_until` field that can be" +
          " `null`; `status` still reads `subscribed` for a paused contact, and nothing else" +
          " changes.",
      ],
      docs: {
        label: "Email preferences",
        href: "https://docs.lettr.com/learn/audience/email-preferences",
      },
    },
  ],

  improvements: [
    {
      title: "Bulk Contacts Endpoint Accepts Per-Contact Properties, Lists And Topics",
      modules: ["audience"],
      tags: ["API"],
      lead:
        "`POST /audience/contacts/bulk` now takes a list of contacts, each with its own" +
        " properties, lists and topic subscriptions, and imports them in one call.",
      body: [
        "Importing contacts with their own properties used to take one request per contact, and" +
          " more for topics, at 3 requests per second for each team. Ten thousand contacts with" +
          " properties and two topics each took about 30,000 requests and almost three hours; the" +
          " same import now takes about 10 requests and a few seconds.",
        "The response includes the ids of the new contacts, so there is no need to page through" +
          " the audience to find them. Rows that fail validation are skipped and listed in the" +
          " response while the rest are imported, and `update_existing` updates the properties of" +
          " contacts that already exist. Top-level `properties`, `list_ids` and `topics` apply to" +
          " every row unless the row sets its own. A topic set to `opt_out` keeps a new contact" +
          " out of a topic that would otherwise subscribe them automatically.",
        "New `POST` and `DELETE /audience/contacts/topics/bulk` endpoints add and remove topics" +
          " for many contacts at once, like the existing ones for lists. The old `{emails," +
          " list_id, properties}` request works exactly as before, so existing integrations and" +
          " lettr-php 2.4.0 need no changes.",
      ],
      code: {
        lang: "bash",
        source: `curl -X POST https://app.lettr.com/api/audience/contacts/bulk \\
  -H "Authorization: Bearer $LETTR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contacts": [
      {
        "email": "jane@example.com",
        "properties": { "first_name": "Jane", "plan": "pro" },
        "list_ids": ["1f9a0c62-2e1b-4b6b-9a1e-6b0f5c2d7a30"],
        "topics": [{ "id": "a3c7e18d-55f2-4c90-8e44-2d1b7f6a9c05" }]
      },
      {
        "email": "joe@example.com",
        "topics": [
          {
            "id": "a3c7e18d-55f2-4c90-8e44-2d1b7f6a9c05",
            "subscription": "opt_out"
          }
        ]
      }
    ],
    "update_existing": true
  }'`,
      },
      docs: {
        label: "Bulk create contacts",
        href: "https://docs.lettr.com/api-reference/audience/bulk-create-contacts",
      },
    },
    {
      title: "Topic Opt-Outs In Bulk Imports Apply To Existing Contacts",
      modules: ["audience"],
      tags: ["API", "Breaking"],
      lead:
        "An `opt_out` in a bulk import now unsubscribes an existing contact from that topic," +
        " whether or not `update_existing` is set.",
      body: [
        "Without `update_existing`, the opt-out used to be ignored: the request returned 201" +
          " with no error and the contact stayed subscribed. `update_existing` now only controls" +
          " whether properties are updated, because withdrawing consent is not something a" +
          " request option should override. Check any import that counted on opt-outs being" +
          " ignored.",
        "Topic changes made through the bulk endpoints are now also recorded in each contact's" +
          " consent history, which they used to skip.",
      ],
      docs: {
        label: "Bulk create contacts",
        href: "https://docs.lettr.com/api-reference/audience/bulk-create-contacts",
      },
    },
    {
      title: "The 50-Recipient Cap Now Counts Cc And Bcc",
      modules: ["transactional"],
      tags: ["API", "Breaking"],
      lead:
        "The 50-recipient limit on sends now counts `to`, `cc` and `bcc` together, as the" +
        " documentation always said.",
      body: [
        "Only `to` used to be limited, so one request could carry, and be billed for, any" +
          " number of recipients. A request with more than 50 in total now returns a 422, and" +
          " scheduled sends follow the same limit, so check how many recipients your integration" +
          " puts on one send.",
      ],
      docs: {
        label: "Recipients",
        href: "https://docs.lettr.com/learn/sending/recipients",
      },
    },
    {
      title: "API Sends Skip Unsubscribe Suppression By Default",
      modules: ["transactional"],
      tags: ["API", "Docs", "Breaking"],
      lead:
        "The API reference now states that `options.transactional` defaults to `true`, so an API" +
        " send also goes to unsubscribed recipients unless it is set to `false`.",
      body: [
        "Sending has always worked this way; only the reference was missing it. Marketing" +
          " emails sent through the API need `options.transactional` set to `false`.",
      ],
      docs: {
        label: "Complaints and unsubscribes",
        href: "https://docs.lettr.com/learn/suppressions/complaints-unsubscribes",
      },
    },
    {
      title: "Adamko AI Assistant Available To Every Team",
      modules: ["platform"],
      tags: ["AI"],
      lead: "Adamko, the AI assistant, is now available to every team while it is in beta.",
      body: [
        "The chat panel now opens with its introduction only once for each team, instead of on" +
          " every visit, and the onboarding banner on the dashboard can be dismissed for good.",
      ],
      docs: {
        label: "Meet Adamko",
        href: "https://docs.lettr.com/learn/ai-assistant/introduction",
      },
    },
    {
      title: "Adamko Creates API Keys And Sending Domains In Conversation",
      modules: ["platform"],
      tags: ["AI", "Security"],
      lead:
        "Adamko can now create an API key or add a sending domain when asked in chat, not only in" +
        " the “Set up everything” scenario.",
      body: [
        "In ordinary chat he used to refuse, with reasons that were not true, such as needing" +
          " your domain registrar login. Adding a sending domain in Lettr never needs one.",
        "He now takes the same steps as the setup scenario. An API key can be live or sandbox," +
          " with full or sending-only access. When a domain is already in use or blocked, he" +
          " gives the real reason, and he still walks you through the DNS setup when you ask for" +
          " that instead.",
      ],
      docs: {
        label: "Onboarding and setup",
        href: "https://docs.lettr.com/learn/ai-assistant/onboarding-and-setup",
      },
    },
    {
      title: "Stop Button And Message Queue In The Adamko Chat",
      modules: ["platform"],
      tags: ["AI", "UI/UX"],
      lead:
        "A reply from Adamko can now be stopped while he is writing it, and a new message can be" +
        " queued while he is still answering.",
      body: [
        "The message box used to stay locked until he finished. A stopped reply keeps the text" +
          " already shown, and a queued message sends itself when the current reply ends. Work he" +
          " has already started in the background, such as a brand kit or a set of emails, still" +
          " finishes, and the stopped reply says so.",
      ],
    },
    {
      title: "Backoff Schedule For Repeat DNS Failure Alerts",
      modules: ["platform"],
      tags: ["Deliverability"],
      lead:
        "With the default settings, a DNS record that stays broken now alerts on day 0, 1, 4 and" +
        " 11 and then goes quiet, instead of alerting every day.",
      body: [
        "The domain still shows as failing in the app, and the summary email follows the same" +
          " schedule. A record that newly breaks still alerts right away, and fixing a record" +
          " starts the schedule again. The alert settings slider, now called “First repeat" +
          " after”, sets the first gap; the next two are three and seven times as long.",
      ],
      docs: {
        label: "Alerts",
        href: "https://docs.lettr.com/learn/settings/alerts",
      },
    },
    {
      title: "Move And Duplicate Folder Pickers Limited To The Email's Module",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "The folder pickers for moving and duplicating an email now list only folders of the same" +
        " kind, marketing or transactional.",
      body: [
        "Picking a folder of the other kind used to change the email's type without warning." +
          " The duplicate picker now opens on a folder (the email's own, the module's main folder" +
          " or the first one offered) instead of an empty choice. Marketing email cards also get" +
          " “Copy to Transactional”, and a copy made for the other module now goes into one of" +
          " that module's folders.",
      ],
    },
    {
      title: "Documentation Link In The App Top Bar",
      modules: ["platform"],
      tags: ["Docs", "UI/UX"],
      lead: "The top bar of the app now links straight to the documentation.",
    },
  ],

  bugfixes: [
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Confirmation and warning messages appear again after actions such as adding or deleting" +
        " a domain, and editor settings no longer confirm a save twice.",
    },
    {
      modules: ["platform"],
      tags: ["Billing"],
      text:
        "Fixed the dashboard returning a 500 error for teams whose subscription no longer exists;" +
        " they now see the free plan's limits.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability"],
      text:
        "Deleting a domain now removes its health alert from the dashboard, including alerts from" +
        " earlier deletions, and old “Check domain” links open the domain list.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed previewing a premade email in the Create Email dialog changing the look of the app" +
        " behind it, with stretched thumbnails and a resized logo.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "A closed Adamko panel now stays closed after a page reload or a new sign-in, even before" +
        " onboarding is finished.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed the Adamko chat opening on the first message instead of the latest one when" +
        " reopened.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "The “Drop your CSV to attach it” overlay in the Adamko chat no longer gets stuck and" +
        " blocks the chat until the page is reloaded.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed Adamko's suggested quick actions not updating, so “Help me set up my sending" +
        " domain” stayed after a domain was already added.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "“Set up everything” now creates the emails when the account has only one blank untitled" +
        " draft, instead of reporting them as already created.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Brand kit logo detection no longer picks another site's logo from the page, such as a" +
        " partner badge, over the site's own logo.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Brand kit logos now use the right light or dark version, and very light logos get a" +
        " darker tile, instead of vanishing against the background.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed brand kit logos sometimes showing as a broken image while emails were being" +
        " generated.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Generated emails no longer include pink dividers or other colors from outside the brand;" +
        " those now become a shade of the brand color.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed brand kits with only one color producing generated emails with empty content" +
        " blocks, large gaps and oversized rounded corners.",
    },
    {
      modules: ["campaigns"],
      tags: ["AI"],
      text:
        "Campaign drafts that Adamko creates now go into a marketing folder instead of a" +
        " transactional one.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Social icons in generated emails now turn white on dark or strongly colored footers," +
        " where the grey icons used to disappear.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "A brand kit website that can't be read now gets a clear explanation and a prompt to try" +
        " another address, instead of near-empty setup emails.",
    },
  ],
};
