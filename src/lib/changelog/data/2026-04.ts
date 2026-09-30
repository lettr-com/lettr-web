import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-04",
  published: "2026-04-29",

  features: [
    {
      title: "Email Campaigns With Scheduling And Per-Recipient Results",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead:
        "Lettr can now send campaigns: write the email, choose an audience, send it now or at a" +
        " set time, and see the results for each recipient.",
      body: [
        "A campaign is set up in four steps: Compose, Audience, Schedule, and Review and Send." +
          " A step counts as done only when it is complete, a problem shows on the step it" +
          " belongs to, and each item on the review list jumps to its step and field. “New" +
          " campaign” opens the editor straight away, and the campaign's name follows its subject" +
          " line until you change it. The email can be written in the Topol editor or in raw" +
          " HTML, and the preview shows the campaign as it is now instead of a saved screenshot." +
          " A reopened draft lets you move between steps freely, and everything is still checked" +
          " before sending.",
        "The From address is the part before the @ plus a list of your verified sending" +
          " domains, so a campaign can't be set up with an address it can't send from. Test sends" +
          " go out the same way as the real campaign, with open and click tracking off so they" +
          " don't count in its results, and each team can send 10 an hour. A scheduled campaign" +
          " is sent at the time you picked and can be moved back to draft until then.",
        "The results page shows unique opens and clicks, counted once per recipient. Every rate" +
          " is measured against the total number of recipients, so campaigns can be compared with" +
          " each other, and a tooltip says so. The number tiles also filter the recipient list:" +
          " Bounced lists the bounced recipients with the full bounce reason. While a campaign" +
          " prepares and sends, the page updates by itself, and it keeps updating for a while" +
          " after sending, with a banner saying it is waiting for delivery events.",
        "Activity for each recipient is kept for 30 days. Just before it expires, each" +
          " campaign's events are archived, and the campaign page can email you a download link;" +
          " the activity view offers it once the history is older than 30 days. Select two or" +
          " more campaigns to compare them side by side, with the best and worst result for each" +
          " metric marked, or to delete or duplicate them together.",
      ],
      docs: {
        label: "Campaigns",
        href: "https://docs.lettr.com/learn/campaigns/introduction",
      },
    },
  ],

  improvements: [
    {
      title: "Separate Audience Tabs For Lists And Segments With Live Segment Preview",
      modules: ["audience"],
      tags: ["UI/UX"],
      lead:
        "Lists and Segments now have their own tabs in Audience, next to Contacts, Topics and" +
        " Properties.",
      body: [
        "All five tabs share the same filters, table and empty states. Active filters show as" +
          " chips that can be cleared, the number cards at the top filter by status, and a" +
          " contact opens in a side panel, so editing it doesn't lose your place in the list. The" +
          " contacts table has new Topics, Lists and Segments columns that filter the list when" +
          " clicked, shows 25, 50, 100 or 150 contacts per page, and an empty tab now says" +
          " whether nothing exists yet or nothing matched the filters.",
        "The segment builder now shows the matching contacts and their count while the" +
          " conditions are being written. It used to show them only after “Save & preview”.",
      ],
      docs: {
        label: "Segments",
        href: "https://docs.lettr.com/learn/audience/segments",
      },
    },
    {
      title: "Activity Log On The Contact Detail Page",
      modules: ["audience"],
      tags: ["UI/UX"],
      lead:
        "Each contact's page now has an activity log recording when the contact was created and" +
        " every change to its lists, topics, properties, email address and status.",
      body: [
        "Names are saved as they were at the time, so the log still shows a list or topic by" +
          " name after it is deleted.",
      ],
      docs: {
        label: "Contacts",
        href: "https://docs.lettr.com/learn/audience/contacts",
      },
    },
    {
      title: "Inline Editing For Contacts, Topics And Property Fallback Values",
      modules: ["audience"],
      tags: ["UI/UX"],
      lead:
        "An Edit contact panel on the contact's page now changes its email address, status, lists" +
        " and topics in one place.",
      body: [
        "Topics now have an editable name, description and visibility. A topic's default" +
          " subscription can't be changed after the topic is created, because contacts were" +
          " already subscribed or not based on it. For properties, the fallback value can now be" +
          " edited, with an input that matches the property's type.",
      ],
    },
    {
      title: "Bulk Actions For Contacts, Lists, Segments, Topics And Properties",
      modules: ["audience"],
      tags: ["UI/UX", "Performance"],
      lead:
        "Selected contacts can now be deleted, subscribed, unsubscribed, or added to and removed" +
        " from lists and topics all at once.",
      body: [
        "The actions match the selection. Subscribe and Unsubscribe are turned off when every" +
          " selected contact already has that status, and the list and topic pickers show whether" +
          " all, some or none of the contacts are in each one, so after filtering by a list the" +
          " picker offers to remove the contacts from it instead of adding them again. Topics," +
          " properties, segments and lists can be deleted in bulk too.",
      ],
    },
    {
      title: "List-Scoped Contact Exports With A Recent Exports Panel",
      modules: ["audience"],
      tags: ["Performance", "Security"],
      lead:
        "Exporting contacts from inside a list now exports only that list, where it used to" +
        " export your whole audience.",
      body: [
        "Large audiences now export without running out of memory. A Recent exports panel shows" +
          " the last five exports from the past 24 hours and updates as each one finishes. The" +
          " download link is sent only by email, never shown in the browser, and each user can" +
          " start up to 20 exports an hour.",
      ],
      docs: {
        label: "Importing and exporting",
        href: "https://docs.lettr.com/learn/audience/importing-and-exporting",
      },
    },
    {
      title: "Purpose Field Separates Campaign Emails From Transactional Emails",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "Every email now has a purpose, so the Emails list shows only transactional emails and" +
        " the campaign builder shows only campaign emails.",
      body: [
        "Campaign drafts used to appear among transactional emails. The purpose is set when an" +
          " email is created and can't be changed later. Emails created through the API or MCP" +
          " are always transactional, and those endpoints don't accept the field, so existing" +
          " integrations work as before.",
      ],
    },
    {
      title: "Default Bounce Domain Switch On Sending Domains",
      modules: ["platform"],
      tags: ["Deliverability"],
      lead:
        "A verified sending domain can now be made the team's default bounce domain with a switch" +
        " on the domain's page.",
      body: [
        "The switch stays off until the domain's CNAME record is verified, with the hint" +
          " “Verify the CNAME record before enabling”, instead of failing after it is turned on.",
      ],
      docs: {
        label: "Sending domains",
        href: "https://docs.lettr.com/learn/domains/sending-domains",
      },
    },
    {
      title: "Webhook Event Types Renamed From Engagament To Engagement",
      modules: ["platform"],
      tags: ["Webhooks", "API", "Breaking"],
      lead:
        "The six webhook engagement event types, published as `engagament.*`, are now spelled" +
        " `engagement.*`.",
      body: [
        "The old spelling is still accepted everywhere, so webhooks subscribed under it keep" +
          " working. Update any code that matches on the event name.",
      ],
      docs: {
        label: "Webhook event types",
        href: "https://docs.lettr.com/learn/webhooks/event-types",
      },
    },
    {
      title: "Webhooks API Accepts Fully-Prefixed Event Names On Create",
      modules: ["platform"],
      tags: ["API", "Webhooks"],
      lead:
        "Creating a webhook now accepts the full event names that the webhook response returns," +
        " such as `message.delivery`, as well as the short form `delivery`.",
      body: [
        "`url` is now the main field for the webhook address, and `target` is still accepted on" +
          " update. A webhook subscribed to every event now returns `event_types: null`, the" +
          " all-events form the API reference describes, instead of a list of every event.",
      ],
      docs: {
        label: "Create a webhook",
        href: "https://docs.lettr.com/api-reference/webhooks/create-webhook",
      },
    },
    {
      title: "Warning-Level Fields Removed From The Domain Verification Response",
      modules: ["platform"],
      tags: ["API", "Docs", "Breaking"],
      lead:
        "Four undocumented `*_warning_level` fields were removed from the domain verification" +
        " response.",
      body: [
        "The API reference now describes the DMARC, SPF and DKIM fields the response already" +
          " returned. DKIM, DMARC and SPF status stay `null` until a domain has been verified at" +
          " least once, and `cname_status` is `not_applicable` for a sending domain at the root" +
          " of your domain, which uses SPF instead of a CNAME record. Check any code that reads" +
          " the removed fields.",
      ],
      docs: {
        label: "Verify a domain",
        href: "https://docs.lettr.com/api-reference/domains/verify-domain",
      },
    },
    {
      title: "Deferred Loading For Dashboard And Audience Panels",
      modules: ["platform", "audience"],
      tags: ["Performance"],
      lead:
        "The dashboard and the Audience pages now open straight away and show placeholders while" +
        " their slower panels load.",
      body: [
        "The three domain health panels on the dashboard now load together instead of" +
          " separately. When a filter changes, the Audience table stays on screen, dimmed, until" +
          " the new results arrive, so the page doesn't jump and selected rows stay selected.",
      ],
    },
    {
      title: "App Typefaces, Colors And Corners Updated To The Lettr Brand",
      modules: ["platform"],
      tags: ["UI/UX"],
      lead:
        "The app now uses the Lettr brand's typefaces and pink, square corners throughout, and an" +
        " off-white background in light mode with near-black in dark mode.",
      body: [
        "Page content now sits in a centred column, so tables no longer stretch across the full" +
          " width of a very large monitor.",
      ],
    },
  ],

  bugfixes: [
    {
      modules: ["platform"],
      tags: ["Billing"],
      text:
        "Fixed the daily sending counter showing the previous day's count after midnight UTC," +
        " which could leave a free team's daily limit stuck.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "The app navigation can now be opened on screens narrower than 768px, where there used to" +
        " be no button to open it.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Adding an email address that is already in your audience no longer returns a server" +
        " error, and the result says how many already existed.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "The Add contacts dialog now confirms that the contacts were added and returns you to the" +
        " page you added them from.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text: "Contacts added from inside a list now go into that list instead of All Contacts.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed the “your export is ready” email with the download link never arriving after a" +
        " contact export.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Audience times now show in your own timezone instead of about two hours off, though" +
        " entries saved before this fix keep the old time.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed a caching gap that could serve our asset files with the cross-origin permission" +
        " meant for a different website.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "When sign-up rejects a password, email or name, the form now returns to the step with" +
        " the problem instead of hiding the error.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text: "Toggle switches across the app now show whether they are on or off correctly.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Double-clicking the create button in the segment dialog no longer creates the same" +
        " segment twice.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed Audience layout faults: pagination hidden under the chat button, filters" +
        " disappearing when nothing matched, pages shifting between tabs, and swapped Import and" +
        " Export icons.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Campaign activity now loads a full page of recipients every time, where it used to show" +
        " one of dozens and need “Load more” twice.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "The event tabs in campaign activity and the stat counters now name each type of event" +
        " the same way, so their numbers match.",
    },
  ],
};
