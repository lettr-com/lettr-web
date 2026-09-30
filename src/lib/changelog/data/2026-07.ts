import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-07",
  published: "2026-07-24",

  features: [
    {
      title: "Daily DNS Health Checks For Verified Domains",
      modules: ["platform"],
      tags: ["Deliverability"],
      lead:
        "Verified domains are now checked once a day, with an alert when one stops resolving or" +
        " stops pointing at Lettr.",
      body: [
        "A domain that verified months ago and broke later used to go unnoticed until sending" +
          " failed. The check only reads DNS and never changes a domain's status, so it can't" +
          " turn off a domain that is still sending.",
        "Broken records show on the dashboard and as a badge on the domain, email and campaign" +
          " lists, with the failing records and how long they have been failing. A newly broken" +
          " record always sends an alert, a record already reported stays quiet for a while, and" +
          " a team with several broken domains gets one email for all of them instead of one per" +
          " domain.",
        "The alert can be turned off in Settings → Alerts, which also sets the minimum time" +
          " between repeat alerts for a failing record, from 1 to 720 hours.",
      ],
      docs: {
        label: "Alerts",
        href: "https://docs.lettr.com/learn/settings/alerts",
      },
    },
    {
      title: "Activity Log And Undo For Changes Made By Adamko",
      modules: ["platform"],
      tags: ["AI", "Security"],
      lead:
        "Every email, campaign, brand kit, sending domain, API key and contact property that" +
        " Adamko creates or changes now appears in one Activity view, where anything he created" +
        " can be undone.",
      body: [
        "Each entry shows the message that led to it, and a bulk action is one row with a count" +
          " instead of one row per item. Entries stay in the log after the chat history is" +
          " cleared or the item itself is deleted.",
        "Undo is offered only while it is safe: a campaign must still be an untouched draft, an" +
          " email must be unedited, a sending domain must not be verified yet, and an API key" +
          " must still exist. A changed brand kit goes back to how it was before the change. When" +
          " something can't be undone, the reason is shown, and the entry stays in the log either" +
          " way.",
      ],
      docs: {
        label: "Activity log and undo",
        href: "https://docs.lettr.com/learn/ai-assistant/activity-log-and-undo",
      },
    },
  ],

  improvements: [
    {
      title: "Adamko Generates Branded Transactional Emails From Premade Bases",
      modules: ["platform", "transactional"],
      tags: ["AI"],
      lead:
        "Adamko now picks the transactional emails that suit your product and builds each one" +
        " from a Lettr premade in your brand's colors, fonts and logo.",
      body: [
        "The premades are already tested in email clients, and one design style is chosen for" +
          " each team and kept, so its transactional emails and campaign drafts look alike. He" +
          " can also build a single email from a description, such as an announcement or a" +
          " newsletter, starting from the closest premade.",
        "The text is now written in your website's language, subject lines included, where it" +
          " used to be English. If a translation fails, the English version is kept rather than a" +
          " half-translated one.",
        "Emails are built in the background, and the chat shows a progress bar with a rough" +
          " time estimate. The chosen emails appear in the Emails list right away with a" +
          " Finalizing badge and can't be opened until they are finished.",
      ],
      docs: {
        label: "Content creation",
        href: "https://docs.lettr.com/learn/ai-assistant/content-creation",
      },
    },
    {
      title: "Brand Kit Extraction Reworked For Colors, Fonts And Inline SVG Logos",
      modules: ["platform"],
      tags: ["AI"],
      lead:
        "Reading a brand kit from a website now finds the site's own colors, fonts and logo more" +
        " reliably, instead of framework defaults, hover colors or fonts the page never uses.",
      body: [
        "Colors used only for hover, focus or selection now count for less, colors written by" +
          " name (such as `gold`) are recognised, a CSS framework's built-in colors no longer" +
          " outvote the brand, and a single decorative gradient no longer beats a color used" +
          " across the site.",
        "Fonts are ranked by what the site actually loads, not by every font a site builder" +
          " lists in its stylesheet. Logos drawn straight into the page as SVG, with no image" +
          " file behind them, are now found through the link back to the homepage and saved as a" +
          " separate file.",
      ],
      docs: {
        label: "Brand kit",
        href: "https://docs.lettr.com/learn/ai-assistant/onboarding-and-setup",
      },
    },
    {
      title: "Adamko Read-Only Account Tools And Advisory Diagnostics",
      modules: ["platform", "transactional", "campaigns"],
      tags: ["AI", "Deliverability"],
      lead:
        "Adamko can now look up your plan and quota, emails, API keys, webhooks, team members," +
        " delivery events, API logs, contacts, imports and suppression list, and give advice" +
        " based on what he finds.",
      body: [
        "He used to answer many of these questions with “I cannot see that”. API keys are shown" +
          " as details only, and the key itself is never returned. He can also check whether one" +
          " particular recipient is on the suppression list.",
        "Asked why an address didn't get an email, he gives one cause (suppressed, complained," +
          " hard bounced, blocked by the provider, delayed, rejected at send, still on its way," +
          " or delivered) with the evidence and what to do. Asked about failing API requests or" +
          " webhooks, he lists the problems by severity, such as rejected keys, rate limits or a" +
          " disabled webhook, with the steps to fix each one.",
        "He checks an email for broken merge tags, a missing unsubscribe link, images without" +
          " alt text, fixed widths that break on phones, a size Gmail will clip and subject lines" +
          " likely to look like spam. He also compares recent campaigns, suggests a list or" +
          " segment for a goal, and plans lifecycle emails or a campaign calendar within the" +
          " sending quota you have left. Rates with nothing to calculate from show as unknown" +
          " instead of 0%, and he never claims to have scheduled anything, since none of his" +
          " tools can.",
      ],
      docs: {
        label: "Troubleshooting and diagnostics",
        href: "https://docs.lettr.com/learn/ai-assistant/troubleshooting-and-diagnostics",
      },
    },
    {
      title: "Adamko CSV Import Review And Column Mapping",
      modules: ["audience"],
      tags: ["AI"],
      lead:
        "A CSV file dropped on the Adamko chat now goes straight to the contact import, and the" +
        " file itself is never sent to the AI.",
      body: [
        "When columns are left unmapped, “Ask Adamko” on the mapping step lists what is wrong" +
          " with the file (no email column, invalid addresses, duplicates in the file, contacts" +
          " you already have, no consent information or unknown statuses), quoting the values it" +
          " found. “Map them for me” first shows which custom fields will be created and with" +
          " what type, which existing fields are reused and how the status column will be read." +
          " Each field he creates can be undone from the activity log.",
        "After the import, he can suggest segments based on the mapped columns. The mapping" +
          " step now also offers “Subscription status” as a field, where it used to offer only" +
          " the email address.",
      ],
      docs: {
        label: "Audience and imports",
        href: "https://docs.lettr.com/learn/ai-assistant/audience-and-imports",
      },
    },
    {
      title: "Secret And Personal Data Redaction For Every AI Request",
      modules: ["platform"],
      tags: ["AI", "Security"],
      lead:
        "Every AI feature in Lettr now removes secrets and recipient details from a request" +
        " before it goes to the AI, where this used to depend on the feature.",
      body: [
        "API keys, bearer tokens, private keys and long secret-looking strings are masked for" +
          " good, in your messages, the chat history and tool results alike. Recipient details" +
          " inside email HTML are swapped for placeholders that are put back in the response, so" +
          " an email edited with AI comes back complete.",
        "Details in ordinary conversation are left as they are, since a question about why mail" +
          " to a named address bounced needs that address; this is covered in the data processing" +
          " agreement. Two older AI chat features in the email editor now follow the same access" +
          " rules, rate limit and monthly spending cap as Adamko.",
      ],
      docs: {
        label: "Privacy and limits",
        href: "https://docs.lettr.com/learn/ai-assistant/privacy-and-limits",
      },
    },
    {
      title: "Proactive Adamko Notices For Five Account Problems",
      modules: ["platform"],
      tags: ["AI"],
      lead:
        "Adamko now shows a notice on the relevant page, without being asked, for a failing" +
        " domain, a sudden rise in bounces, a stalled setup, a missing API key or a draft he" +
        " started that was left unfinished.",
      body: [
        "Each page shows at most one notice. A dismissed notice stays hidden for 3 to 14 days" +
          " depending on its type, a domain notice dismissed by one teammate is hidden for the" +
          " whole team, and dismissing three notices in a week hides them all for a while.",
      ],
      docs: {
        label: "Guided tours and nudges",
        href: "https://docs.lettr.com/learn/ai-assistant/guided-tours-and-nudges",
      },
    },
    {
      title: "Complete DNS Walkthroughs For Sending, Tracking, Inbound And Storage Domains",
      modules: ["platform"],
      tags: ["AI", "UI/UX"],
      lead:
        "Adamko's add-domain walkthrough now covers every DNS record and the verification step," +
        " where it used to stop after the first record.",
      body: [
        "It goes through DKIM, CNAME, SPF, DMARC and verification in order, and skips any" +
          " record a domain type doesn't have instead of stalling on it. Tracking, inbound and" +
          " storage domains got the same walkthroughs; storage domains had none. A record step" +
          " now finishes when you copy its value, not only when you click the text, and the API" +
          " key walkthrough has a new step for choosing a sandbox key.",
      ],
      docs: {
        label: "Guided tours and nudges",
        href: "https://docs.lettr.com/learn/ai-assistant/guided-tours-and-nudges",
      },
    },
    {
      title: "Section Links, Copy Button And Tables In Adamko Answers",
      modules: ["platform"],
      tags: ["AI", "UI/UX"],
      lead:
        "When Adamko names a section of the app in an answer, he now offers a link to it instead" +
        " of only putting the name in bold.",
      body: [
        "These links, and the “Guide me” and “Docs” buttons, stay clickable in later messages" +
          " and after a page reload; they used to disappear with the next message. Every answer" +
          " has a Copy button, tables show as tables instead of rows of `|` characters, and the" +
          " message box grows as you type.",
      ],
    },
    {
      title: "Adamko Onboarding Cards Persist Across Page Reloads",
      modules: ["platform"],
      tags: ["AI"],
      lead:
        "The cards in Adamko's replies (the brand kit preview, the email picker, the API key and" +
        " the domain) now stay after a page reload, where they used to be replaced by plain text.",
      body: [
        "They come back in their finished state: a restored API key card is masked and has no" +
          " copy button, and the key itself is still never saved. The email picker now says how" +
          " many of the available emails it will create, for example “Create 4 of 7 emails”, and" +
          " shows that more options are further down the list.",
      ],
    },
    {
      title: "Per-Source Data Windows For Adamko Sending Health Answers",
      modules: ["platform"],
      tags: ["AI", "Deliverability"],
      lead:
        "Adamko's answers about sending health now use the time range each data source actually" +
        " keeps, instead of claiming 90 days for everything.",
      body: [
        "Questions reaching past the roughly 10 days of kept message events used to fail with" +
          " “something went wrong on my side”. Trends still cover the full period, while recent" +
          " examples cover only what is kept and say so. When the examples can't be loaded, the" +
          " answer still comes back without them.",
      ],
    },
    {
      title: "Synced Section Edits Create New Email Versions",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "Editing a synced header or footer now saves a new version of every email that uses it," +
        " instead of overwriting those emails in place.",
      body: [
        "The editor then offers to publish them all at once, or to keep them as drafts to check" +
          " first.",
      ],
    },
    {
      title: "New Marketing Emails Open Directly In The Editor",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead:
        "Creating a marketing email now opens it straight in the editor, without the detail page" +
        " in between.",
      body: [
        "After saving, the newest version is shown instead of an older one, and the folder" +
          " picker on the emails page offers only folders of the kind being browsed.",
      ],
    },
  ],

  bugfixes: [
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed one-time codes being rejected as invalid or expired for everyone, which blocked" +
        " password and email changes, two-factor setup and team deletion.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Requesting a new one-time code right after verifying one now sends a working code," +
        " instead of reporting success without creating one.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "One-time code emails no longer arrive after the code has expired when a lot of other" +
        " mail is waiting to be sent.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "Deleting a folder no longer deletes the emails inside it; they now move to another" +
        " folder of the same kind.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "A marketing email moved into a folder no longer also shows at the top level, where it" +
        " looked like a duplicate.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed duplicating a marketing email always creating a transactional copy, which left the" +
        " copy missing from the campaigns list.",
    },
    {
      modules: ["transactional"],
      tags: ["Deliverability"],
      text: "Open rates on the dashboard and in tag stats no longer go above 100%.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text: "Fixed a double-click on Sign up creating two accounts or showing a server error.",
    },
    {
      modules: ["platform"],
      tags: ["AI", "UI/UX"],
      text:
        "The screen no longer flashes and the Adamko panel no longer jumps each time he takes you" +
        " to another page.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "The editor's file manager now lists every file in a folder that holds more than 1,000" +
        " files, not only the first 1,000.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed files in the editor's file manager coming back after a delete that was reported as" +
        " successful.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "Files uploaded from inside a subfolder of the editor's file manager now go into that" +
        " subfolder, not a new folder at the top level.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Pasting a link into the Adamko chat no longer returns “please try again in a moment”; he" +
        " now says he can't open web pages.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed Adamko mentioning the names of his internal tools, such as `get_brand_kit`, in his" +
        " replies.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text: "Walkthrough replies from Adamko no longer end with the same closing sentence twice.",
    },
    {
      modules: ["platform"],
      tags: ["AI", "UI/UX"],
      text:
        "In replies not written in English, the closing “Guide me” button no longer merges into" +
        " the paragraph above it.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed the campaigns list not scrolling, which left campaigns further down the list out" +
        " of reach.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "The email preview no longer shrinks to nothing when the window is too narrow to show it" +
        " side by side.",
    },
  ],
};
