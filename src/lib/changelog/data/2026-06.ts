import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-06",
  published: "2026-06-09",

  features: [
    {
      title: "Transactional And Marketing Mode Switcher In The Sidebar",
      modules: ["platform", "transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "The sidebar now opens with a Transactional and Marketing mode switcher, and the menu" +
        " below it shows only what that mode uses.",
      body: [
        "Both sets of navigation used to share one sidebar. Marketing mode adds Audience and" +
          " Campaigns, and its Emails list shows only marketing emails. Switching mode on the" +
          " Emails page shows the other mode's emails, and switching away from a marketing-only" +
          " page such as Audience or Campaigns opens the dashboard.",
        "A shared link always opens in the right mode, whichever mode the person opening it" +
          " used last, and the chosen mode stays set between sessions. Analytics and Events now" +
          " sit together under Metrics.",
        "The new layout also adds a top bar, a team switcher at the bottom of the sidebar and a" +
          " proper menu drawer on mobile, where the app used to show a narrower copy of the" +
          " desktop sidebar.",
      ],
    },
    {
      title: "Adamko AI Assistant With Account Tools And Guided Setup",
      modules: ["platform"],
      tags: ["AI"],
      lead:
        "Adamko is a new AI assistant in the app that can look at your account, make changes in" +
        " it and guide you through its pages.",
      body: [
        "Asked which sending domains are ready to send, he lists them with the same readiness" +
          " badge the Domains page shows. Asked why a domain is not verifying, he checks its live" +
          " DNS records against what the provider reports and names the actual mistake: a record" +
          " at the wrong host, two SPF records, a CNAME flattened or proxied by Cloudflare, DMARC" +
          " on the wrong host or a typo in the value. He only calls a record correct after" +
          " checking it in the same reply, and he quotes every host and value exactly.",
        "When the answer is a page in the app, he opens it instead of describing the way there." +
          " He can also point to each step on the real page, for creating a sending domain or an" +
          " API key, building a list or a segment, adding a webhook, or finding the events for" +
          " one recipient.",
        "Onboarding now runs through him and replaces the old checklist. Given your website, he" +
          " reads it, shows what he found, creates the transactional emails you pick, then" +
          " creates an API key and adds a sending domain. He finishes with a walkthrough of the" +
          " DNS records, since verification still depends on your registrar and on the DNS" +
          " changes spreading.",
        "His tools follow the same permissions as the matching pages, so chat can't do anything" +
          " your role doesn't allow in the app. Every action he takes is recorded in an audit log" +
          " with sensitive values removed, and an API key he creates appears only in its own" +
          " card, never in the chat history. He doesn't use emoji. Adamko is in beta and is being" +
          " turned on team by team.",
      ],
      docs: {
        label: "Meet Adamko",
        href: "https://docs.lettr.com/learn/ai-assistant/introduction",
      },
    },
    {
      title: "Notification Centre In The App Top Bar",
      modules: ["platform"],
      tags: ["UI/UX"],
      lead:
        "A bell in the app top bar now collects notifications about things that finish while you" +
        " are elsewhere in Lettr.",
      body: [
        "A finished campaign send shows its recipient count and links to the campaign, and a" +
          " finished contacts export links to its download, which expires after one hour." +
          " Announcements from us arrive here too, instead of by email. Notifications can be" +
          " marked as read one at a time or all at once.",
      ],
      docs: {
        label: "Notifications",
        href: "https://docs.lettr.com/learn/settings/notifications",
      },
    },
  ],

  improvements: [
    {
      title: "Audience And Campaigns Enabled For Every Team",
      modules: ["audience", "campaigns"],
      lead:
        "Audience and Campaigns are now available to every team, instead of being turned on team" +
        " by team.",
    },
    {
      title: "Separate Dashboard Metrics For Transactional And Marketing Mode",
      modules: ["platform"],
      tags: ["UI/UX"],
      lead:
        "The dashboard now shows different cards and numbers in transactional and marketing mode," +
        " where it used to show one set for everything.",
      body: [
        "In transactional mode, the usage card counts emails against your email limit and the" +
          " analytics table groups sends by tag. In marketing mode, it counts contacts against" +
          " your contact limit, the traffic chart shows a bar on each campaign's send date," +
          " delivery performance adds click and unsubscribe rates, and the table has one row per" +
          " campaign.",
        "Transactional numbers leave out campaign sends but still count sends that have no tag," +
          " and those now appear in their own Untagged row.",
      ],
      docs: {
        label: "Reading the dashboard",
        href: "https://docs.lettr.com/learn/analytics/reading-the-dashboard",
      },
    },
    {
      title: "Card Grid View For Marketing Emails",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead:
        "Marketing emails now show as folders and thumbnail cards, with a toggle back to the" +
        " table view.",
      body: [
        "Folders now belong to either marketing or transactional emails, and the marketing" +
          " table hides the columns that only apply to transactional emails (slug, sent, opened" +
          " and open rate). The transactional email list is unchanged.",
      ],
    },
    {
      title: "Two-Column Layout For The Transactional Email Page",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead:
        "The transactional email page now has its settings on the left and a preview on the" +
        " right, with desktop and mobile tabs and a language selector.",
      body: [
        "Name and subject save as you type, and the settings panel also shows the slug and the" +
          " email's merge tags. The version status now sits in the header and turns green when a" +
          " version is live, and version history opens in a drawer over the page instead of a" +
          " separate view.",
      ],
    },
    {
      title: "Copy To Marketing And Copy To Transactional Email Actions",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "Each email in the list now has a “Copy to Marketing” or “Copy to Transactional” action" +
        " that copies it to the other mode.",
      body: [
        "The copy stays in the same folder, so an email designed for one mode no longer has to" +
          " be rebuilt for the other.",
      ],
    },
    {
      title: "Three-Day Sessions And An Expiry Warning In The Email Editor",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "The email editor now notices an expired session and offers to sign you back in before" +
        " unsaved work is lost.",
      body: [
        "An expired session used to show up only as a failed save. Sessions now also last three" +
          " days instead of two hours, so being signed out while editing is much less likely. The" +
          " editor also uses Lettr's own colors now.",
      ],
    },
    {
      title: "Warning State For Incomplete Steps In The Campaign Stepper",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead:
        "A campaign step that has been passed but still has unresolved issues now shows a warning" +
        " instead of a green tick.",
      body: ["The step navigation also moved into the top bar."],
    },
    {
      title: "X-Correlation-Id Header On Every API Response",
      modules: ["platform"],
      tags: ["API"],
      lead:
        "Every API response now includes an `X-Correlation-Id` header, and requests that end in" +
        " an unexpected error are now logged.",
      body: [
        "Those requests used to leave no log entry. The API log page has new account and" +
          " correlation id filters, so one id is enough to trace a failing request between your" +
          " side and ours.",
      ],
      docs: {
        label: "Logs",
        href: "https://docs.lettr.com/learn/logs/introduction",
      },
    },
    {
      title: "Brand Impersonation Screening For New Sending Domains",
      modules: ["platform"],
      tags: ["Deliverability", "Security"],
      lead:
        "New sending domains are now checked for names that imitate a well-known brand, such as a" +
        " swapped digit or a lookalike spelling.",
      body: [
        "A clear lookalike is created as blocked, with a banner on the Domains page saying so," +
          " and a borderline one goes to our team for review. If the check itself fails, the" +
          " domain is created as usual.",
      ],
    },
    {
      title: "Clearer Messages For Domains Registered Elsewhere And Cancelled Domain Connect Setup",
      modules: ["platform"],
      tags: ["Deliverability"],
      lead:
        "Adding a sending domain that an account outside Lettr has already registered with the" +
        " provider now says so and asks you to contact support, instead of failing with a general" +
        " error.",
      body: [
        "Cancelling the one-click Cloudflare setup no longer looks like success. The sending," +
          " inbound and tracking domain pages now show that the setup was cancelled.",
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
        "A team can no longer send from another team's verified sending domain, which is now" +
        " refused with the same error as an unknown domain.",
    },
    {
      modules: ["campaigns"],
      tags: ["Security"],
      text:
        "Fixed the campaign preview returning any team's campaign HTML to any signed-in user; it" +
        " now checks that the campaign belongs to their team.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed a request logger recording far more of each request than intended. It now hides" +
        " authorization, cookie and API key headers and skips request bodies.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Our internal log of API requests now keeps only non-sensitive fields, so recipient" +
        " addresses, content, attachments, substitution data, metadata and headers are never" +
        " stored.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["Security"],
      text:
        "Fixed any signed-in user being able to create, edit or delete the premade blocks shown" +
        " in every team's editor; this now needs an administrator.",
    },
    {
      modules: ["platform"],
      tags: ["Billing"],
      text:
        "Sending many emails at the same moment can no longer go over a plan's daily or monthly" +
        " limit. Close to the limit, a send may occasionally be refused slightly early.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Password reset, email verification and team invitation links in Lettr's own emails now" +
        " work, instead of arriving broken.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed password reset links failing when the email address in the link arrived encoded," +
        " for example with `%40` in place of `@`.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "A failed sign-in now shows its error message, and the email address typed there carries" +
        " over to the password reset form.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "API sends whose HTML contains a link with an IP address, such as" +
        " `http://192.168.1.50/status`, are no longer rejected with a 403 error.",
    },
    {
      modules: ["transactional"],
      tags: ["Webhooks", "Performance"],
      text:
        "Fixed large bursts of delivery events from the provider being refused on our side with" +
        " 429 errors.",
    },
    {
      modules: ["transactional"],
      tags: ["UI/UX"],
      text:
        "The Events and message detail pages no longer fail on events that arrive without a" +
        " transmission id or recipient details.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability"],
      text:
        "A tracking domain behind the Cloudflare proxy is no longer shown as verified. Set its" +
        " record to DNS only in Cloudflare so it can verify.",
    },
    {
      modules: ["platform"],
      tags: ["Docs"],
      text:
        "The short links `/domains`, `/logs`, `/templates` and `/suppressions` used in our" +
        " documentation now redirect to the right pages instead of returning 404.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text: "Creating a new list from inside the CSV import flow now works instead of failing.",
    },
    {
      modules: ["transactional"],
      tags: ["UI/UX"],
      text:
        "The emails list scrolls again instead of being cut off, and the sidebar no longer shows" +
        " a scrollbar it doesn't need.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Successful statuses in the API log and webhook lists now show in green instead of the" +
        " wrong color.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed a sidebar section staying highlighted next to the more specific page open inside" +
        " it.",
    },
  ],
};
