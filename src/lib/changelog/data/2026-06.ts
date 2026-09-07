import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-06",

  intro:
    "Two projects shipped this month. We scoped them as unrelated work, which lasted about a" +
    " week.",

  features: [
    {
      title: "Modes: Transactional And Marketing Are Separate Now",
      modules: ["platform", "transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "The sidebar opens with a mode switcher, and everything below it narrows to the one you" +
        " picked.",
      body: [
        "Lettr does transactional email and marketing email, and until now both sets of" +
          " navigation lived in one sidebar. Everyone saw twice the menu they needed and quietly" +
          " filtered out the half that was not theirs. Nobody ever raised it as a problem, which" +
          " is the difficult kind: a complaint you can act on, whereas people silently using less" +
          " of your product is something you have to go looking for.",
        "Shared links were the genuinely tricky part, because a campaign URL says nothing about" +
          " which mode the person opening it was last in. Mode is inferred from the URL first and" +
          " only then from what you last chose, so a pasted link lands correctly regardless, and" +
          " the choice sticks between sessions afterwards. Switching mode switches context on the" +
          " page you are standing on rather than throwing you to the start.",
        "Analytics and Events now sit under Metrics together, an arrangement nothing was stopping" +
          " us from choosing the first time. The layout was rebuilt against the designs while" +
          " this was open, including a real mobile drawer — the previous mobile experience was" +
          " the desktop sidebar, narrower.",
      ],
    },
    {
      title: "A Dashboard That Knows Which Mode You Are In",
      modules: ["platform"],
      tags: ["UI/UX"],
      lead:
        "The dashboard stopped showing one set of numbers to everyone; the mode now decides which" +
        " cards render and what they count.",
      body: [
        "In transactional mode the usage card meters emails against your email limit and the" +
          " analytics table breaks down by tag. In marketing mode it meters contacts against your" +
          " contact limit, the traffic chart becomes bars on each campaign's send date, delivery" +
          " performance gains click and unsubscribe rates, and the table becomes one row per" +
          " campaign.",
        "Transactional figures are computed by subtracting campaign volume from the totals rather" +
          " than by filtering on a campaign id, specifically so that sends carrying no tag still" +
          " get counted. An explicit Untagged row surfaces those instead of letting them vanish" +
          " into a rounding difference.",
      ],
      docs: {
        label: "Reading the dashboard",
        href: "https://docs.lettr.com/learn/analytics/reading-the-dashboard",
      },
    },
    {
      title: "Meet Adamko",
      modules: ["platform"],
      tags: ["AI"],
      lead:
        "An assistant in a drawer in the app that can read your account and act inside it, rather" +
        " than a documentation search with a chat box on the front.",
      body: [
        "Asked which of your domains are ready to send, he lists them with the same readiness" +
          " badge the Domains page shows. Asked why a sending domain is not verifying, he checks" +
          " the live DNS himself and compares it against what the provider reports, then names" +
          " the actual mistake — the record pasted at the wrong host, two SPF records, a CNAME" +
          " flattened or proxied by Cloudflare, DMARC on the wrong host, a typo in the target." +
          " He is not permitted to call a record correct without a tool result in the same turn," +
          " and must quote every host and value verbatim rather than paraphrase one.",
        "Where the right answer is a page in the app, he opens it instead of describing how to" +
          " get there, and can run a pointer tour over the real interface — creating a domain or" +
          " an API key, building a list or a segment, adding a webhook, or walking you to the" +
          " event trail for a particular recipient.",
        "Onboarding runs through him now. Ask him to set everything up, give him your website," +
          " and he reads it, shows you what he found, lets you choose which transactional emails" +
          " you want, creates them, issues an API key and registers a sending domain — ending in" +
          " a DNS walkthrough, since verification still waits on your registrar and on" +
          " propagation. A guided setup that ends there is a fair improvement on what we had" +
          " before, which was a checklist sitting next to a link to the docs.",
        "Every tool he holds runs the same permission checks as the equivalent screen, so he" +
          " cannot do through chat what your role forbids in the app. Every call is written to an" +
          " audit log with its arguments redacted. An API key he creates travels only inside its" +
          " own card and never through the model or the chat history. He is also banned from" +
          " using emoji.",
        "He is in beta and is being turned on team by team.",
      ],
      docs: {
        label: "Meet Adamko",
        href: "https://docs.lettr.com/learn/ai-assistant/introduction",
      },
    },
    {
      title: "A Notification Centre",
      modules: ["platform"],
      tags: ["UI/UX"],
      lead: "A bell in the topbar collects the things that finish while you are somewhere else.",
      body: [
        "A campaign finishing its send arrives with its recipient count and a link to it; an" +
          " export becoming ready arrives with a download link. Announcements from us land in the" +
          " same place rather than in your inbox.",
      ],
      docs: {
        label: "Notifications",
        href: "https://docs.lettr.com/learn/settings/notifications",
      },
    },
    {
      title: "Marketing Emails As A Card Grid",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead:
        "Marketing emails render as folders and thumbnails, with a toggle back to the table if" +
        " you prefer it.",
      body: [
        "Folders became mode-aware with it, and the columns that only mean something for" +
          " transactional email — slug, sent, opened, open rate — are hidden on the marketing" +
          " side. The transactional list is unchanged.",
      ],
    },
    {
      title: "A Redesigned Transactional Email Page",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead:
        "Settings on the left, a preview canvas on the right with desktop and mobile tabs and a" +
        " language selector.",
      body: [
        "Name and subject save as you type. Version status moved into the header bar and turns" +
          " green when a version is live, and version history opens as a drawer over the page" +
          " rather than taking you somewhere else.",
      ],
    },
  ],

  improvements: [
    {
      title: "Audience And Campaigns Are On For Every Team",
      modules: ["audience", "campaigns"],
      lead:
        "The marketing half of the product is no longer enabled team by team — it is simply" +
        " there.",
    },
    {
      title: "Copy An Email Between Transactional And Marketing",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "A row action copies an email across to the other side, so a design built for one half of" +
        " the product does not have to be rebuilt for the other.",
    },
    {
      title: "The Editor Warns You Before Your Session Costs You Work",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "The email editor now notices an expired session and offers to sign you back in, rather" +
        " than letting you find out when a save fails.",
      body: [
        "Sessions also last three days instead of two hours, so being signed out mid-edit is far" +
          " less likely in the first place. The editor picked up Lettr's own palette in the same" +
          " pass.",
      ],
    },
    {
      title: "The Campaign Stepper Tells The Truth About Completeness",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead:
        "A step you have passed but left with unresolved issues now shows a warning rather than a" +
        " green tick.",
    },
    {
      title: "Every API Response Carries A Correlation Id",
      modules: ["platform"],
      tags: ["API"],
      lead:
        "`X-Correlation-Id` comes back on every response, and requests that end in an unhandled" +
        " error are logged rather than vanishing.",
      body: [
        "The API log view gained account and correlation filters, so a failing request can be" +
          " traced from your side to ours with one identifier.",
      ],
      docs: {
        label: "Logs",
        href: "https://docs.lettr.com/learn/logs/introduction",
      },
    },
    {
      title: "New Sending Domains Are Screened For Impersonation",
      modules: ["platform"],
      tags: ["Deliverability", "Security"],
      lead:
        "A domain registered to imitate a well-known brand — a swapped digit, a lookalike" +
        " spelling — is caught when it is added.",
      body: [
        "A high-confidence lookalike is created blocked, with a banner saying so; a borderline" +
          " one goes to review. The check fails open, so an error on our side never stops a" +
          " legitimate domain being created.",
      ],
    },
    {
      title: "Clearer Answers When A Domain Cannot Be Added",
      modules: ["platform"],
      tags: ["Deliverability"],
      lead:
        "A domain already registered with our email provider by an account outside Lettr now says" +
        " so, and tells you to contact support, instead of failing generically.",
      body: [
        "Cancelling out of the one-click Cloudflare setup also stops looking like success — each" +
          " domain page now shows that you cancelled rather than quietly celebrating.",
      ],
      docs: {
        label: "Domain Connect",
        href: "https://docs.lettr.com/learn/domains/domain-connect",
      },
    },
  ],

  bugfixes: [
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed a team being able to send from another team's verified sending domain. The domain" +
        " was resolved through an index with no tenant scope, so isolation had been resting on" +
        " the provider's own accounts alone. The domain is now checked against the calling team," +
        " and refused with the same message as an unknown domain so a probe cannot tell the two" +
        " apart.",
    },
    {
      modules: ["campaigns"],
      tags: ["Security"],
      text:
        "Fixed the campaign preview endpoint returning any team's campaign HTML to any" +
        " authenticated caller — it was reachable with no authorisation check at all. It now" +
        " authorises against the campaign's own team.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed a request logger that had been registered across the whole application rather than" +
        " on the surface it was written for, so it captured far more than it should have. It is" +
        " now scoped correctly, redacts authorization, cookie and API-key headers, and no longer" +
        " records request bodies. The API request log was cut back to an allowlist at the same" +
        " time, so recipient addresses, content, attachments, substitution data, metadata and" +
        " headers never reach it.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["Security"],
      text:
        "Fixed any signed-in user being able to create, edit or delete the curated premade blocks" +
        " that are served into every team's editor. Those actions now require an administrator.",
    },
    {
      modules: ["platform"],
      tags: ["Billing"],
      text:
        "Fixed concurrent sends overshooting a plan's daily and monthly limits. The quota was" +
        " read, then the send went out, then the counter moved — so several requests arriving" +
        " together all read the same number and all went. Quota is now reserved before the send" +
        " and reconciled afterwards. It errs toward an occasional over-reject rather than an" +
        " over-send, and still lets sends through if the counter store is unreachable.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed our own password-reset, email-verification and team-invitation links arriving" +
        " broken. Click tracking rewrites every URL in a message, which mangled the signature on" +
        " a signed link. Those links are now assembled inside the template so only the static" +
        " part is ever wrapped, and where a signed URL cannot be split — export and archive" +
        " downloads — click tracking is turned off for that send instead.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed a password reset failing when the address in the link arrived percent-encoded, so" +
        " it never matched the token. The same change makes a failed sign-in actually show its" +
        " error, and carries the address you typed across to the reset form.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "Fixed a valid email being rejected before it ever reached us when its HTML contained a" +
        " URL with an IP address in it — a link to `http://192.168.1.50/status` in a monitoring" +
        " alert, for instance. A protective rule was reading that as an attempt to make the" +
        " server fetch something. Sending is exempt from that rule now; the paths that genuinely" +
        " do fetch HTML keep it.",
    },
    {
      modules: ["transactional"],
      tags: ["Webhooks", "Performance"],
      text:
        "Fixed bursts of delivery events being rate-limited at the edge and answered with 429s." +
        " The provider's server-to-server callbacks arrive from a small shared pool of addresses" +
        " and were being counted against a per-address limit meant for browsers.",
    },
    {
      modules: ["transactional"],
      tags: ["UI/UX"],
      text:
        "Fixed the Events and message-detail pages failing outright on events that arrive without" +
        " a transmission id or without recipient fields, which were treated as always present.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability"],
      text:
        "Fixed a Cloudflare-proxied tracking domain being treated as verified. A hostname behind" +
        " the proxy answers with an address record rather than the CNAME that is actually" +
        " required, and the check accepted it. It is now its own state, with an instruction to" +
        " set the record to DNS-only, and no longer earns a verification grace period.",
    },
    {
      modules: ["platform"],
      tags: ["Docs"],
      text:
        "Fixed the four short dashboard URLs our documentation links to — `/domains`, `/logs`," +
        " `/templates` and `/suppressions` — returning 404. They now redirect to the real pages," +
        " and do so from outside the sign-in gate, so a signed-out visitor lands on the login" +
        " screen rather than a dead page.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text: "Fixed being unable to create a list from inside the CSV import flow.",
    },
    {
      modules: ["transactional"],
      tags: ["UI/UX"],
      text:
        "Fixed the emails list being unable to scroll, clipped by its container, and the sidebar" +
        " showing a scrollbar it did not need.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed successful statuses in the API log and webhook lists rendering in the wrong" +
        " colour, and a sidebar section highlighting alongside the more specific page inside it.",
    },
  ],
};
