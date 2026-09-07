import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-04",

  features: [
    {
      title: "Campaigns",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead:
        "Pick an audience, write the email, schedule it, and then find out what happened" +
        " afterwards.",
      body: [
        "Composing runs through four steps — Compose, Audience, Schedule, Review and Send — and" +
          " the gate on each one is whether it is genuinely complete, not whether you clicked" +
          " past it. Problems surface on the step that owns them, and every item on the review" +
          " list is a button that jumps to the step and puts the cursor in the offending field." +
          " Reopening a saved draft unlocks every step so you can move around freely; the" +
          " validation still runs before you send.",
        "Pressing New campaign creates the draft immediately and drops you into the editor" +
          " rather than asking you to name it first, and the name follows the subject line as" +
          " you type until you edit it yourself. Write in the Topol editor or in raw HTML." +
          " The preview is a live render of the campaign rather than a cached screenshot, which" +
          " matters because a stored thumbnail is only ever as current as the last time" +
          " something regenerated it.",
        "The From field is a local part plus a dropdown of your verified domains, which kills" +
          " the most common way to build a campaign that cannot physically send. Test sends go" +
          " through the real sending path on your own subaccount, with tracking off so they" +
          " never pollute the campaign's numbers, and are capped at ten an hour.",
        "Scheduling now actually schedules. A scheduled campaign is held until its moment" +
          " arrives, and can be pulled back to draft before then. The time you pick is the time" +
          " that is stored.",
        "The results page leads with the numbers. Unique opens and clicks per recipient are the" +
          " figures shown: one person opening an email twenty times and twenty people opening it" +
          " once are not the same event, and a dashboard that reports them identically will" +
          " eventually talk somebody into a decision they cannot defend. Every rate is measured" +
          " against a fixed base of total recipients, with a tooltip saying so, because a moving" +
          " denominator makes two campaigns impossible to compare. The stat tiles double as" +
          " filters — clicking Bounced gets you the bounced recipients with the full bounce" +
          " reason, not one truncated just before the part that tells you anything.",
        "The page polls while a campaign prepares and sends, and keeps polling after it is sent," +
          " because provider events lag and an empty activity table looks exactly like a failed" +
          " send. A banner says it is waiting rather than leaving you to guess.",
        "Per-recipient event history runs 30 days. Four weeks after a send, a job archives that" +
          " campaign's events to storage just before they expire, and you can ask for the" +
          " archive from the campaign page and get a link by email. The activity view knows the" +
          " difference between “nothing has happened yet” and “this is older than the history" +
          " window”, and offers you the archive in the second case.",
        "Select two or more campaigns and open the comparison sheet: campaigns as rows, metrics" +
          " as columns, best and worst marked per metric. We built it the other way round first." +
          " It was worse, and transposing it cost almost nothing once we stopped defending the" +
          " original decision. Bulk delete and duplicate work from the same selection.",
      ],
      docs: {
        label: "Campaigns",
        href: "https://docs.lettr.com/learn/campaigns/introduction",
      },
    },
    {
      title: "Every Contact Keeps An Activity Log",
      modules: ["audience"],
      tags: ["UI/UX"],
      lead:
        "A timeline on each contact records creation, list membership, topic opt-ins and" +
        " opt-outs, property changes, email changes and status changes.",
      body: [
        "When somebody eventually asks why a particular person received a particular email, that" +
          " log is the answer, and recording it continuously is far easier than reconstructing" +
          " it afterwards. Names are stored as they were at the time, so deleting a list or a" +
          " topic later does not turn its history into an unreadable id.",
      ],
      docs: {
        label: "Contacts",
        href: "https://docs.lettr.com/learn/audience/contacts",
      },
    },
    {
      title: "Choose Your Default Bounce Domain",
      modules: ["platform"],
      tags: ["Deliverability"],
      lead:
        "A verified sending domain can be made the team's default bounce domain from its own" +
        " detail page.",
      body: [
        "The switch stays disabled until the domain's CNAME record checks out, and says so" +
          " rather than failing once you have already flipped it.",
      ],
      docs: {
        label: "Sending domains",
        href: "https://docs.lettr.com/learn/domains/sending-domains",
      },
    },
  ],

  improvements: [
    {
      title: "The Audience Section Was Rebuilt",
      modules: ["audience"],
      tags: ["UI/UX"],
      lead:
        "Contacts, Lists, Segments, Topics and Properties are now five peers rather than a list" +
        " with things nested inside it.",
      body: [
        "Every tab shares the same filter toolbar, table and empty states, filters show as chips" +
          " you can clear, and a contact opens in a drawer so an edit does not cost you your" +
          " place in the list. Stat cards are clickable status filters, the contacts table gained" +
          " Topics, Lists and Segments columns that filter when clicked, and empty states now" +
          " distinguish “nothing here yet” from “nothing matched”.",
        "The segment builder previews matching contacts as you type, with a count. Previously you" +
          " had to press Save and preview to find out what a condition caught, which meant saving" +
          " a filter to discover whether you wanted it.",
      ],
      docs: {
        label: "Segments",
        href: "https://docs.lettr.com/learn/audience/segments",
      },
    },
    {
      title: "Edit Contacts, Topics And Properties In Place",
      modules: ["audience"],
      tags: ["UI/UX"],
      lead:
        "One side sheet covers a contact's email, status, list membership and topics, and submits" +
        " only what actually changed.",
      body: [
        "Topics gained editable names, descriptions and visibility. A topic's default" +
          " subscription stays locked after creation, deliberately — it is not a field that" +
          " should change under contacts who already answered it. Properties allow the fallback" +
          " value to be edited, with an input that matches the property's type.",
      ],
    },
    {
      title: "Bulk Actions Across The Whole Audience",
      modules: ["audience"],
      tags: ["UI/UX", "Performance"],
      lead:
        "Select contacts and delete, subscribe, unsubscribe, or edit their lists and topics" +
        " together.",
      body: [
        "The bar knows what your selection is: Subscribe is disabled when everything selected is" +
          " already subscribed, and the list and topic pickers use three-state checkboxes, so" +
          " filtering by a list and acting on the result offers to remove people from it rather" +
          " than pointlessly re-adding them. Bulk delete followed for topics, properties," +
          " segments and lists.",
      ],
    },
    {
      title: "Contact Exports Are Scoped, Streamed And Visible While They Run",
      modules: ["audience"],
      tags: ["Performance", "Security"],
      lead:
        "Exporting from inside a list used to export the whole team; it now exports the list you" +
        " are standing in.",
      body: [
        "Exports stream to disk rather than being assembled in memory, so a large audience no" +
          " longer risks running out of it. A Recent exports strip shows the last five from the" +
          " past day and updates live as they finish. The download link only ever arrives by" +
          " email, never in the browser. Exports are capped at 20 an hour per user.",
      ],
      docs: {
        label: "Importing and exporting",
        href: "https://docs.lettr.com/learn/audience/importing-and-exporting",
      },
    },
    {
      title: "Campaign Drafts No Longer Appear Among Your Emails",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "Templates now carry a purpose, so the Emails list shows transactional templates and the" +
        " campaign builder shows campaign ones.",
      body: [
        "Purpose is set when a template is created and does not change afterwards. The API and" +
          " MCP create paths default to transactional and do not accept the field, so nothing you" +
          " already call behaves differently.",
      ],
    },
    {
      title: "Webhook Engagement Events Are Spelled Correctly",
      modules: ["platform"],
      tags: ["Webhooks", "API", "Breaking"],
      lead: "The six engagement event types were published as `engagament.*`. They are now `engagement.*`.",
      body: [
        "The misspelling is normalised on every read and write path, so a webhook subscribed" +
          " under the old name keeps working and you can move at your own pace. Anything that" +
          " matches on the event name string should be updated.",
      ],
      docs: {
        label: "Webhook event types",
        href: "https://docs.lettr.com/learn/webhooks/event-types",
      },
    },
    {
      title: "The Webhooks API Round-Trips",
      modules: ["platform"],
      tags: ["API", "Webhooks"],
      lead:
        "Creating a webhook now accepts the same short event names the read response gives back," +
        " so what you read can be sent straight back without translation.",
      body: [
        "`url` became the canonical field, with the older `target` still accepted on update, and" +
          " a webhook subscribed to everything returns the “all events” shape the reference" +
          " documents rather than an exhaustive list.",
      ],
      docs: {
        label: "Create a webhook",
        href: "https://docs.lettr.com/api-reference/webhooks/create-webhook",
      },
    },
    {
      title: "The Domain Response And Its Reference Agree",
      modules: ["platform"],
      tags: ["API", "Docs", "Breaking"],
      lead:
        "Four undocumented warning-level fields were dropped from the domain verification" +
        " response.",
      body: [
        "The reference gained real descriptions for the fields it had been carrying silently —" +
          " including that DKIM, DMARC and SPF status stay `null` until a domain has been" +
          " verified at least once, and that `cname_status` comes back as `not_applicable` for" +
          " an apex sending domain, which needs SPF rather than a CNAME.",
      ],
      docs: {
        label: "Verify a domain",
        href: "https://docs.lettr.com/api-reference/domains/verify-domain",
      },
    },
    {
      title: "Pages Render Before Their Slow Panels Do",
      modules: ["platform", "audience"],
      tags: ["Performance"],
      lead:
        "The dashboard and the Audience pages paint their shell immediately and fill the slow" +
        " parts in behind skeletons.",
      body: [
        "The three domain-health panels now make one call between them rather than three." +
          " Reloading after a filter change keeps the previous table on screen, dimmed, so the" +
          " page does not jump and your row selection survives.",
      ],
    },
    {
      title: "The App Matches The Lettr Brand",
      modules: ["platform"],
      tags: ["UI/UX"],
      lead:
        "New typefaces, the brand pink, squared-off corners throughout, and a warm off-white" +
        " ground in light mode with near-black in dark.",
      body: [
        "Content is also constrained to a centred column, so table rows stop stretching the full" +
          " width of a very large monitor.",
      ],
    },
  ],

  bugfixes: [
    {
      modules: ["platform"],
      tags: ["Billing"],
      text:
        "Fixed the daily sending counter reporting yesterday's number at the start of a new UTC" +
        " day and then continuing to add to the expired row, which could leave a free-tier team's" +
        " daily quota effectively frozen. Each day now gets its own counter rather than the count" +
        " depending on when expired data is physically reclaimed.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed the app navigation being completely unreachable below 768px. The sidebar hides at" +
        " that width and the mobile sheet existed, but nothing rendered a button to open it.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed adding an email already in your audience returning a server error. A re-add is now" +
        " a no-op and the result is reported plainly — “1 contact added, 2 already existed” —" +
        " rather than an error dialog.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed the Add contacts dialog closing with no confirmation that anything had happened," +
        " and contacts added from inside a list landing in All Contacts instead of that list." +
        " Submitting also returns you to the page you came from rather than a fixed destination.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed the “your export is ready” email never arriving. It was being sent through a" +
        " different mail path from the rest of the product, and now goes out the same way as" +
        " verification and invitation emails.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed Audience timestamps rendering about two hours off. Times are now sent with their" +
        " offset and rendered in your own timezone rather than parsed as though they were" +
        " local. Rows written before the fix stay skewed.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed a caching hole on the asset CDN where a response carrying one origin's" +
        " cross-origin header could be served to a different origin, because the origin was not" +
        " part of the cache key.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed the sign-up form stranding you on the final step when validation failed earlier —" +
        " a password problem now returns you to the password step and an email or name problem to" +
        " the first one, instead of showing an error you cannot see.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text: "Fixed toggle switches across the app not reflecting the value they were bound to.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed the segment create dialog making duplicate segments when the button was" +
        " double-clicked.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed a cluster of Audience layout faults: pagination buttons sitting underneath the" +
        " support widget, the stats and filters vanishing when a filter matched nothing, the" +
        " toolbar unmounting between tabs and shifting the page, and Import and Export wearing" +
        " each other's icons.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed the campaign activity list loading a single recipient out of dozens and needing" +
        " two clicks of “Load more” before it disappeared. Paging now returns a full page every" +
        " time, and the per-event tabs and the stat counters agree on how an event is named.",
    },
  ],
};
