import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-08",

  features: [
    {
      title: "Bulk Contact Import Over The API",
      modules: ["audience"],
      tags: ["API"],
      lead:
        "One call now imports a whole batch of contacts, each row carrying its own properties," +
        " list memberships and topic subscriptions.",
      body: [
        "Importing contacts used to cost one request per contact, against a per-team throttle of" +
          " three requests a second. Ten thousand contacts with properties and two topics each" +
          " came to roughly 30,000 requests and the better part of three hours. The same import" +
          " is now about ten requests and a few seconds.",
        "The response returns the ids of everything created, so there is no paging through the" +
          " audience afterwards to find them. Rows that fail validation are skipped and reported" +
          " individually rather than failing the batch, and `update_existing` merges properties" +
          " into contacts that already exist. Topics gained their own bulk endpoints alongside" +
          " the ones lists already had.",
        "The old `{emails, list_id, properties}` payload keeps its exact semantics, so existing" +
          " integrations and lettr-php 2.4.0 keep working untouched.",
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
      title: "Manage Email Preferences",
      modules: ["audience", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "The signed link in every email now opens a full preferences page instead of a" +
        " single-purpose unsubscribe screen.",
      body: [
        "Recipients see a derived status — Subscribed, Paused, Unsubscribed or Not receiving" +
          " emails — a checkbox per topic, a pause of 30, 60 or 90 days, and the campaigns they" +
          " recently received, each linked to its web version.",
        "One button commits all of it. Unticking everything unsubscribes, behind a reason" +
          " dialog; ticking topics again brings a recipient back, and a full unsubscribe" +
          " detaches private topics for good rather than quietly resurrecting them later. Topic" +
          " opt-outs genuinely suppress sends: consent is re-checked when recipients are" +
          " materialised and again per batch, because there is no provider-side backstop for" +
          " Lettr topics.",
        "The page is built not to fail closed — refusing to render an unsubscribe page is worse" +
          " than dropping a bad parameter — and its rate limiting is keyed by contact rather" +
          " than by IP, so a security gateway prefetching links cannot throttle a real recipient" +
          " out of unsubscribing.",
        "Pauses are visible on your side too. Audiences shows a Paused badge with its end date" +
          " and a matching filter, CSV exports carry the derived status and a `paused_until`" +
          " column, and the API additively gains a nullable `paused_until` field that changes" +
          " nothing you already parse.",
      ],
      docs: {
        label: "Email preferences",
        href: "https://docs.lettr.com/learn/audience/email-preferences",
      },
    },
  ],

  improvements: [
    {
      title: "Import Opt-Outs Are Always Honoured",
      modules: ["audience"],
      tags: ["API", "Breaking"],
      lead:
        "A row-level `opt_out` for a contact Lettr already knew about is no longer discarded" +
        " when `update_existing` is unset.",
      body: [
        "The request returned 201, reported no error row, and left the contact subscribed. The" +
          " flag now governs property merges only. A withdrawal of consent is not a data field" +
          " that a request flag gets to override.",
        "Bulk topic changes also write consent-history activity rows, which pivot-level writes" +
          " had been skipping entirely.",
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
        "The documented 50-recipient limit is now enforced across `to`, `cc` and `bcc`" +
        " combined.",
      body: [
        "Only `to` was capped before, so a single request could carry — and be billed for —" +
          " arbitrarily many recipients. Anything over 50 combined now returns a 422. Check your" +
          " fan-out before you upgrade.",
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
        "The spec now states what was always true: `options.transactional` defaults to `true`," +
        " so an API send bypasses unsubscribe suppression unless it is set to `false`.",
      body: [
        "The behaviour has not changed. The reference had simply never said so, which is the" +
          " kind of omission that only surfaces after something marketing-shaped has already" +
          " gone out. If you send campaigns through the API, turn the option off.",
      ],
      docs: {
        label: "Complaints and unsubscribes",
        href: "https://docs.lettr.com/learn/suppressions/complaints-unsubscribes",
      },
    },
    {
      title: "Adamko Is Open To Every Team",
      modules: ["platform"],
      tags: ["AI"],
      lead: "The flag gating the AI assistant is now on for everyone while it is in beta.",
      body: [
        "The rollout came with onboarding polish: the panel auto-opens with its introduction" +
          " once per team rather than on every visit, and the onboarding banner can be dismissed" +
          " for good.",
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
      lead: "Both actions used to work only inside the guided “Set up everything” scenario.",
      body: [
        "Asked to do either in ordinary chat, Adamko refused with confident, invented reasons —" +
          " that the full secret is shown only once and must be copied by you, that adding a" +
          " domain requires your registrar login. Neither was ever true, and registering a" +
          " domain in Lettr never touches your registrar.",
        "He now presses the same buttons the setup scenario presses, relays the real reason when" +
          " a domain is already taken or blacklisted, and still hands off to the DNS walkthrough" +
          " when you ask to be walked through it rather than done for you.",
      ],
      docs: {
        label: "Onboarding and setup",
        href: "https://docs.lettr.com/learn/ai-assistant/onboarding-and-setup",
      },
    },
    {
      title: "Stop And Queue Messages In The Adamko Chat",
      modules: ["platform"],
      tags: ["AI", "UI/UX"],
      lead:
        "A response can be stopped mid-generation, and a follow-up can be queued while one is" +
        " still in flight.",
      body: ["The composer used to stay locked until Adamko had finished."],
    },
    {
      title: "Repeat DNS Alerts Back Off",
      modules: ["platform"],
      tags: ["Deliverability"],
      lead:
        "A record that stays broken now alerts on day 0, 1, 4 and 11 and then goes quiet," +
        " instead of firing daily forever.",
      body: [
        "Nothing is hidden by the silence: the domain keeps showing as failing in the app. A" +
          " newly broken record still alerts immediately, and a recovery resets the schedule." +
          " The alert-settings slider was relabelled to match.",
      ],
      docs: {
        label: "Alerts",
        href: "https://docs.lettr.com/learn/settings/alerts",
      },
    },
    {
      title: "Folder Pickers Stay Inside Their Own Module",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "Moving or duplicating an email into a folder from the other module can no longer" +
        " silently flip its type.",
      body: [
        "Both pickers are now scoped to the template’s own module, and the duplicate picker" +
          " preselects a sensible folder — the email’s own, the module’s home folder, or the" +
          " first one offered — instead of opening on an empty placeholder.",
      ],
    },
    {
      title: "A Documentation Link In The Topbar",
      modules: ["platform"],
      tags: ["Docs", "UI/UX"],
      lead: "The app topbar now links straight to the documentation.",
    },
  ],

  bugfixes: [
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed confirmation and warning toasts not firing anywhere in the app: `status` and" +
        " `warning` flash messages were never shared under the key ten pages read them from, so" +
        " a redirect worked but its message never appeared. Seven distinct messages were being" +
        " dropped silently, domain create, delete and update among them. The email" +
        " editor-settings page also stopped toasting its save twice.",
    },
    {
      modules: ["platform"],
      tags: ["Billing"],
      text:
        "Fixed the dashboard returning a 500 for a team whose Stripe subscription no longer" +
        " exists — the page died while merely trying to label a plan tier. A missing" +
        " subscription now falls back to free-tier limits and is logged; every other Stripe" +
        " error still surfaces, and write paths still fail loudly.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability"],
      text:
        "Fixed a deleted domain leaving its health alert, and a “Check domain” link that 404’d," +
        " on the dashboard forever. All four delete paths now clean up, a reconcile pass heals" +
        " rows already stale in production, and a stale link from an old email or the" +
        " notification bell lands on the domain list with an explanation.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed picking a premade template in the Create Email modal restyling the app behind it," +
        " with stretched thumbnails and a resized logo. The preview was injecting the" +
        " template’s global email CSS into the app document; it now renders in a sandboxed" +
        " iframe like every other email preview.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed a closed Adamko panel reopening itself after every hard refresh and every sign-in" +
        " for anyone who had not finished the onboarding wizard — which, for someone who never" +
        " wants it, is forever. Panel state is now remembered per team.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed the Adamko drawer parking on the first message rather than scrolling to the" +
        " latest when reopened, and the “Drop your CSV to attach it” overlay latching on and" +
        " blocking the chat until a hard refresh.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed Adamko’s suggested quick-action chips going stale: registering a sending domain" +
        " yourself left the “Help me set up my sending domain” chip sitting there until a hard" +
        " refresh. They now refresh whenever the panel is opened.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed “Set up everything” reporting emails as already created, and refusing to generate" +
        " the set, when the account held nothing but a single blank untitled draft.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed brand kit logo detection picking another site’s logo off the page — a partner" +
        " badge named `…logo.png` outranked the site’s own mark, and one academy site shipped a" +
        " tourism portal’s logo in its email footers. Candidates are now weighed by who serves" +
        " them, and an image wrapped in the homepage link is promoted.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed brand kit logos rendering blank on a same-color background, or as a broken image" +
        " during generation. The light or dark variant is now chosen correctly, a near-white" +
        " logo with no light-surface twin gets a mid-tone tile to stay visible on, and a" +
        " fallback that published the logo to a storage bucket nobody could read is gone.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed generated emails shipping a pink divider to brands with no pink in them. Every" +
        " foreign color is now ranked, and those past the brand palette are recolored to a" +
        " brand-hued tone at their own lightness, so a pale hairline stays pale.",
    },
    {
      modules: ["platform", "campaigns"],
      tags: ["AI"],
      text:
        "Fixed a brand kit that extracted only one color leaving generated emails with unfilled" +
        " content blocks and large empty gaps. Fills now resolve against a tint ladder derived" +
        " from the primary color, corner radius scales by element so a “pill” brand no longer" +
        " stamps 100px on a page-tall card, and campaign drafts are no longer filed into" +
        " transactional folders.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed brand kit social icons vanishing on saturated footers. The premade library" +
        " authors every social icon as one mid-grey glyph; each is now republished as a white" +
        " twin and swapped in on dark surfaces, alpha and geometry intact.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed a site that blocks crawling producing a raw HTTP error, and the setup wizard" +
        " then scaffolding “successful” emails whose only text was the team name against a" +
        " brand kit that did not exist. A failure now names the host and a next step, offers" +
        " another URL, and the wizard refuses to scaffold without a completed kit.",
    },
  ],
};
