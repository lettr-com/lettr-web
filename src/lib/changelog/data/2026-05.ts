import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-05",
  published: "2026-05-27",

  features: [
    {
      title: "Campaign Send, Schedule And Stats Endpoints In The API",
      modules: ["campaigns"],
      tags: ["API"],
      lead:
        "Campaigns can now be listed, read, sent, scheduled, rescheduled and unscheduled through" +
        " the API, with their events and stats.",
      body: [
        "Six endpoints use two new scopes, `campaigns:read` and `campaigns:write`. Every" +
          " campaign includes a `stats` object with injections, deliveries, bounces, complaints," +
          " opens, unique opens, clicks, unique clicks and unsubscribes, the same numbers the app" +
          " shows. `GET /campaigns/{id}/events` returns events page by page and filters by event" +
          " type, recipient and date range.",
        "A draft can be scheduled, and a scheduled campaign can be moved to a new time with the" +
          " same call. Sending right away still needs a draft without a send time: a campaign" +
          " that has one returns `campaign_has_pending_schedule`, which points to `POST" +
          " /campaigns/{id}/unschedule`.",
        "There is no endpoint for creating a campaign or choosing its audience. Campaigns are" +
          " still created in the app, and the API works with them from there.",
      ],
      docs: {
        label: "List campaigns",
        href: "https://docs.lettr.com/api-reference/campaigns/list-campaigns",
      },
    },
    {
      title: "Web Version Merge Tag For Viewing Campaigns In A Browser",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead:
        "The new `{{webversion_link}}` merge tag gives each recipient their own link to view the" +
        " campaign in a browser.",
      body: [
        "The page fills in that recipient's own details, so it matches the email they received." +
          " The tag is in the editor's merge-tag menu next to `{{unsubscribe_link}}`, and in test" +
          " emails it opens a preview.",
      ],
      docs: {
        label: "Template language",
        href: "https://docs.lettr.com/learn/templates/template-language",
      },
    },
  ],

  improvements: [
    {
      title: "Audience API Write Endpoints Replace Three Nested Routes",
      modules: ["audience"],
      tags: ["API", "Breaking"],
      lead:
        "The audience API can now create, update and delete segments, topics and properties," +
        " update lists and contacts, and create contacts in bulk.",
      body: [
        "A contact can be added to or removed from a list or a topic, and lists can also be" +
          " added to or removed from many contacts at once, or deleted in bulk. Writes need the" +
          " `audience:write` scope and don't work with sandbox API keys; reads need" +
          " `audience:read`.",
        "Three nested endpoints were removed in favour of filters. `GET" +
          " /audience/lists/{id}/contacts` and `GET /audience/segments/{id}/contacts` are now" +
          " `GET /audience/contacts?list_id=` and `?segment_id=`, and `GET" +
          " /audience/lists/{id}/segments` is now `GET /audience/segments?list_id=`.",
        "The contacts list response changed from `{contacts, total, page, per_page}` to" +
          " `{contacts, pagination: {…}}`, and the lists inside a contact no longer include" +
          " `contacts_count`. Check these changes in any integration built before May.",
      ],
      docs: {
        label: "List contacts",
        href: "https://docs.lettr.com/api-reference/audience/list-audience-contacts",
      },
    },
    {
      title: "Topic Opt-In And Opt-Out Defaults Corrected",
      modules: ["audience"],
      tags: ["API", "Breaking"],
      lead:
        "A topic set to `opt_out` now subscribes new contacts automatically and `opt_in` requires" +
        " them to subscribe, the reverse of how both used to work.",
      body: [
        "The setting was implemented backwards, and the app's own descriptions matched the" +
          " wrong behaviour. The fix applies to contacts created through the API, CSV import and" +
          " the app.",
        "Stored topics were not changed, so every existing topic now behaves the opposite way" +
          " from before. Check the setting on every topic before the next send.",
      ],
      docs: {
        label: "Topics",
        href: "https://docs.lettr.com/learn/audience/topics",
      },
    },
    {
      title: "Segment AND And OR Rules Corrected In The API Reference",
      modules: ["audience"],
      tags: ["Docs", "API", "Breaking"],
      lead:
        "The API reference now says conditions within a group are joined by OR and groups by AND," +
        " which is how segments have always worked.",
      body: [
        "The reference used to say the opposite. Only the text was wrong: segments and the" +
          " app's own labels always worked this way, so existing segments have not changed and" +
          " don't need saving again.",
        "Segments built by following the reference instead of the segment builder match the" +
          " opposite of what was intended, so check them. We're sorry for the time this cost.",
      ],
      docs: {
        label: "Create a segment",
        href: "https://docs.lettr.com/api-reference/audience/create-a-segment",
      },
    },
    {
      title: "Automatic Unsubscribe Footer And List-Unsubscribe Headers On Campaigns",
      modules: ["campaigns"],
      tags: ["Deliverability"],
      lead:
        "Every campaign now has an unsubscribe link and one-click unsubscribe headers, even when" +
        " the email has no unsubscribe tag.",
      body: [
        "When the HTML contains neither `{{unsubscribe_link}}` nor `{{unsubscribe_url}}`, a" +
          " short footer is added at sending time, and the saved email is not changed. Every" +
          " campaign also sets `List-Unsubscribe` and `List-Unsubscribe-Post`, so the one-click" +
          " unsubscribe button works in Gmail and Apple Mail.",
        "The footer can't be turned off; adding your own unsubscribe tag is the way to replace" +
          " it. The campaign editor shows a banner with an “Insert link” button when the tag is" +
          " missing, and warns before saving an email without one.",
      ],
      docs: {
        label: "Complaints and unsubscribes",
        href: "https://docs.lettr.com/learn/suppressions/complaints-unsubscribes",
      },
    },
    {
      title: "Unsubscribe Confirmation Page With Reasons And Resubscribe",
      modules: ["campaigns", "audience"],
      tags: ["UI/UX"],
      lead:
        "The unsubscribe link in an email now opens a page that asks for confirmation, instead of" +
        " unsubscribing the recipient as soon as the page loads.",
      body: [
        "Recipients can pick a reason (too many emails, not relevant, never signed up, or their" +
          " own text), which is saved in the contact's history. After unsubscribing, the page" +
          " offers a one-click way to subscribe again, since many of these clicks are accidents.",
        "The one-click unsubscribe in the mail client still unsubscribes right away, as the" +
          " standard requires.",
      ],
    },
    {
      title: "Unsubscribe And Web Version Pages In 19 Languages",
      modules: ["campaigns", "audience"],
      tags: ["UI/UX"],
      lead:
        "The unsubscribe and web version pages now show in the recipient's language, in 19" +
        " languages, where they used to be English only.",
      body: [
        "The language comes from the contact's communication language, then from a team default" +
          " the owner sets in Team settings → Overview, then English. Only the page around the" +
          " email is translated: the email itself is shown as written, and the default" +
          " unsubscribe footer added to campaigns stays in English.",
        "Arabic and Hebrew are not included yet, because the pages don't support right-to-left" +
          " text. Unsubscribe reasons are saved the same way whatever language the recipient saw," +
          " so they can be compared across languages.",
      ],
    },
    {
      title: "Emailed Confirmation Codes For Sensitive Actions On SSO Accounts",
      modules: ["platform"],
      tags: ["Security"],
      lead:
        "Accounts that sign in with Google or GitHub now confirm sensitive actions with a" +
        " six-digit code sent by email.",
      body: [
        "These accounts used to skip the check entirely when changing the password or account" +
          " email, turning two-factor authentication on or off, or deleting the user or a team." +
          " The code is valid for 10 minutes, and one confirmation covers all of these actions" +
          " for 15 minutes. Accounts with a password still confirm with it.",
        "Changing the account email now sends the verification email again; it used to mark the" +
          " account unverified with nothing to click. Password fields on sign-up, password reset" +
          " and settings also show a live checklist of the rules: at least 12 characters, upper" +
          " and lower case, a number and a symbol.",
      ],
      docs: {
        label: "Security",
        href: "https://docs.lettr.com/learn/settings/security",
      },
    },
    {
      title: "Campaign Test Sends Use The Production Sending Path",
      modules: ["campaigns"],
      tags: ["Deliverability"],
      lead:
        "Campaign test sends now go through the same sending path as the real campaign, so they" +
        " show what recipients will get.",
      body: [
        "Tracking is on, and the unsubscribe and web version links work, opening preview pages" +
          " that change nothing. The “Send test” button in the editor opened from a campaign now" +
          " uses the same path; it used to send without the unsubscribe footer or web version" +
          " link, and with the wrong sender and subject.",
      ],
    },
    {
      title: "Boolean Segment Conditions No Longer Require A Value",
      modules: ["audience"],
      tags: ["API"],
      lead:
        "Segment conditions on true/false properties (`is_true` and `is_false`) no longer require" +
        " a `value`.",
      body: [
        "Every condition used to require one, so a condition on a true/false property was" +
          " rejected, both through the API and in the app's segment builder.",
      ],
    },
    {
      title: "Plan Contact Limit Check Before A Campaign Is Sent",
      modules: ["campaigns"],
      tags: ["Billing"],
      lead:
        "The campaign editor now shows an “Upgrade required to send” dialog with your contact" +
        " count and plan limit when a send would go over the limit, instead of failing during the" +
        " send.",
    },
    {
      title: "Duplicate Action For Segments",
      modules: ["audience"],
      tags: ["UI/UX"],
      lead:
        "The row menu on the Segments list has a new Duplicate action that copies a segment's" +
        " conditions and list, then opens the copy.",
    },
    {
      title: "CSV And JSON Export Of Domain DNS Records",
      modules: ["platform"],
      tags: ["Deliverability", "UI/UX"],
      lead:
        "A new “Send to developer” menu on each domain page downloads the DNS records the domain" +
        " needs as CSV or JSON.",
      body: [
        "It works for sending, tracking, inbound and storage domains, and uses the domain's own" +
          " values from the page.",
      ],
    },
  ],

  bugfixes: [
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "CSV imports separated by semicolons, tabs or pipes now map their columns, instead of" +
        " arriving as one column with nothing mapped.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed new segments saving without their conditions, so every segment created since March" +
        " had to be opened and saved a second time.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Opening the email editor from a campaign no longer loses the subject, sender, audience" +
        " and schedule entered before it.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed the “Send campaign” button doing nothing when an ad blocker was running in the" +
        " browser.",
    },
    {
      modules: ["audience"],
      tags: ["API"],
      text:
        "Creating a contact with double opt-in and a missing or unpublished template no longer" +
        " creates the contact without sending a confirmation. The API now returns 404" +
        " `template_not_found`, or 502 `transmission_failed` when sending fails, instead of 500.",
    },
    {
      modules: ["platform"],
      tags: ["Docs", "UI/UX"],
      text:
        "The DNS provider guide buttons on the sending, tracking and inbound domain pages now" +
        " open the right guides instead of missing pages.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "The campaign preview dialog now shows the whole email instead of shrinking to a strip" +
        " with only its top.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed the action buttons in the domain page header running off narrow screens instead of" +
        " wrapping below the title.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text: "The divider between the sidebar and the page now shows in dark mode.",
    },
  ],
};
