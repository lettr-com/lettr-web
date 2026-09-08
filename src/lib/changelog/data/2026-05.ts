import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-05",

  features: [
    {
      title: "Audience Over The API",
      modules: ["audience"],
      tags: ["API", "Breaking"],
      lead:
        "Contacts, lists, segments, topics and properties are now fully addressable over the" +
        " REST API rather than merely readable.",
      body: [
        "Lists, segments, topics and properties gained create, update and delete; contacts gained" +
          " update and bulk create; and a contact can be attached to or detached from a list or a" +
          " topic, singly or in bulk. Writes need the `audience:write` scope and reads" +
          " `audience:read`.",
        "Three nested endpoints were removed in favour of filters on the collection routes." +
          " `GET /audience/lists/{id}/contacts` and `GET /audience/segments/{id}/contacts` become" +
          " `GET /audience/contacts?list_id=` and `?segment_id=`, and" +
          " `GET /audience/lists/{id}/segments` becomes `GET /audience/segments?list_id=`.",
        "The contacts list envelope changed with them, from `{contacts, total, page, per_page}`" +
          " to `{contacts, pagination: {…}}`, and a contact's embedded lists no longer carry" +
          " `contacts_count`. If you integrated before May, those three things are what will" +
          " break; read them before you upgrade.",
      ],
      docs: {
        label: "List contacts",
        href: "https://docs.lettr.com/api-reference/audience/list-audience-contacts",
      },
    },
    {
      title: "Campaigns Over The API",
      modules: ["campaigns"],
      tags: ["API"],
      lead:
        "A campaign can be listed, read, sent, scheduled, rescheduled and unscheduled from code," +
        " with its events and stats readable back.",
      body: [
        "Six endpoints ship behind two new scopes, `campaigns:read` and `campaigns:write`. Every" +
          " campaign carries a `stats` object — injections, deliveries, bounces, complaints," +
          " opens, unique opens, clicks, unique clicks and unsubscribes — read from the same" +
          " figures the app shows. The events endpoint is cursor-paginated and filters by event" +
          " type, recipient, and date range.",
        "Scheduling is idempotent: a draft can be scheduled and an already-scheduled campaign" +
          " moved to a new time. Sending immediately still requires a clean draft, and a campaign" +
          " with a schedule pending says so and points at the unschedule endpoint rather than" +
          " returning a vague refusal.",
        "Note what is not here: there is no endpoint that creates a campaign or attaches an" +
          " audience to one. A campaign is still composed in the app, and the API drives it from" +
          " there.",
      ],
      docs: {
        label: "List campaigns",
        href: "https://docs.lettr.com/api-reference/campaigns/list-campaigns",
      },
    },
    {
      title: "Every Marketing Send Carries A Working Unsubscribe",
      modules: ["campaigns"],
      tags: ["Deliverability"],
      lead:
        "Campaigns now go out with an unsubscribe link and one-click headers whether or not" +
        " anyone remembered to add the tag.",
      body: [
        "When neither `{{unsubscribe_link}}` nor `{{unsubscribe_url}}` appears in your HTML, a" +
          " minimal footer is appended at render time — not at save time, so your stored template" +
          " stays exactly as you wrote it. Every campaign also sets `List-Unsubscribe` and" +
          " `List-Unsubscribe-Post`, so the one-click button works in Gmail and Apple Mail" +
          " without you touching a template.",
        "There is no way to switch this off, and that is deliberate. The only way to avoid the" +
          " default footer is to place your own unsubscribe tag, which is then left alone. The" +
          " editor warns you before you save an email that has neither. Mailbox providers tighten" +
          " these rules every year; treat it as table stakes rather than a feature.",
      ],
      docs: {
        label: "Complaints and unsubscribes",
        href: "https://docs.lettr.com/learn/suppressions/complaints-unsubscribes",
      },
    },
    {
      title: "The Unsubscribe Page Asks Why, And Offers A Way Back",
      modules: ["campaigns", "audience"],
      tags: ["UI/UX"],
      lead:
        "Clicking the link in the body used to unsubscribe you the moment the page loaded. It" +
        " now asks first.",
      body: [
        "The page offers a reason — too many emails, not relevant, never signed up, or something" +
          " you type — and unsubscribing takes a deliberate action. Afterwards it offers a" +
          " one-click way back, because a good share of those clicks are accidents and there is" +
          " no reason to make them permanent. The reason is recorded on the contact's history.",
        "The one-click header path is untouched and still unsubscribes immediately, as the" +
          " specification requires.",
      ],
    },
    {
      title: "A Browser-Readable Copy Of Any Campaign",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead: "`{{webversion_link}}` gives every recipient their own “view in browser” link.",
      body: [
        "The page re-resolves that recipient's own merge data and renders the campaign, so what" +
          " they see in a browser matches what landed in their inbox. Send time and view time" +
          " share one code path, so the two cannot drift apart. The tag sits next to" +
          " `{{unsubscribe_link}}` in the editor.",
      ],
      docs: {
        label: "Template language",
        href: "https://docs.lettr.com/learn/templates/template-language",
      },
    },
    {
      title: "Recipient-Facing Pages In The Recipient's Language",
      modules: ["campaigns", "audience"],
      tags: ["UI/UX"],
      lead:
        "The unsubscribe and web-version pages went from English only to 19 languages over the" +
        " course of the month.",
      body: [
        "Language resolves per recipient: the contact's own communication language first, then a" +
          " team-level default you set in settings, then English. Only the surrounding page is" +
          " translated — the email inside it is your content and is left alone.",
        "Arabic and Hebrew were deliberately left out for now, because these pages have no" +
          " right-to-left handling yet and shipping them half-done would be worse than not" +
          " shipping them. Unsubscribe reasons are stored as stable keys rather than as the" +
          " translated label the recipient happened to see, so the data stays comparable across" +
          " languages.",
      ],
    },
    {
      title: "Sensitive Actions Are Gated For SSO Users Too",
      modules: ["platform"],
      tags: ["Security"],
      lead:
        "Signing in with Google or GitHub used to switch off re-authentication entirely for" +
        " everything behind it.",
      body: [
        "Changing your password, changing your account email, turning two-factor on or off," +
          " deleting your user and deleting a team all went through with no second check for" +
          " anyone holding an OAuth identity. That is now closed: SSO users get a six-digit code" +
          " by email, valid for ten minutes, and one verification opens a fifteen-minute window" +
          " across the gated actions. Password users are unchanged and still confirm with their" +
          " password.",
        "Changing your account email also now genuinely re-sends the verification email. It used" +
          " to mark you unverified and give you nothing to click.",
      ],
      docs: {
        label: "Security",
        href: "https://docs.lettr.com/learn/settings/security",
      },
    },
  ],

  improvements: [
    {
      title: "Topic Opt-In And Opt-Out Now Mean What They Say",
      modules: ["audience"],
      tags: ["API", "Breaking"],
      lead:
        "The flag was implemented backwards: a topic marked `opt_in` was the one that" +
        " automatically subscribed every new contact.",
      body: [
        "`opt_out` now means subscribed by default and `opt_in` means the contact has to" +
          " subscribe, which is what both words have always meant everywhere else. The app's own" +
          " descriptions matched the old implementation, so the wording was wrong in every place" +
          " at once.",
        "There is no data migration. Stored topics keep their values, so the effective behaviour" +
          " of every existing topic flipped when this shipped. Check the field on every topic" +
          " before your next send. It applies to contacts created through the API, through CSV" +
          " import, and in the app.",
      ],
      docs: {
        label: "Topics",
        href: "https://docs.lettr.com/learn/audience/topics",
      },
    },
    {
      title: "Segment AND/OR Was Documented Backwards",
      modules: ["audience"],
      tags: ["Docs", "API", "Breaking"],
      lead:
        "The reference said conditions inside a group are joined by AND and groups by OR. The" +
        " implementation has always done the opposite.",
      body: [
        "Conditions within a group are OR, and groups are combined with AND — consistently, in" +
          " the segment service, the app's own labels and the tests. Only the reference was" +
          " inverted, so nothing about your existing segments has changed and nothing needs" +
          " re-saving.",
        "That is the uncomfortable part: careful reading of our documentation produced exactly" +
          " the wrong conditions, which is worse than having no documentation at all. Genuine" +
          " apologies to anyone who lost time to it — and worth re-reading any segment you built" +
          " from the reference rather than from the builder.",
      ],
      docs: {
        label: "Create a segment",
        href: "https://docs.lettr.com/api-reference/audience/create-a-segment",
      },
    },
    {
      title: "Boolean Segment Conditions No Longer Need A Value",
      modules: ["audience"],
      tags: ["API"],
      lead:
        "`is_true` and `is_false` are the only operators offered for a boolean property, and yet" +
        " every condition was validated as requiring a `value`.",
      body: [
        "A boolean condition was therefore rejected outright and could not be expressed at all," +
          " over the API or in the app's own builder.",
      ],
    },
    {
      title: "Test Sends Go Through The Production Pipeline",
      modules: ["campaigns"],
      tags: ["Deliverability"],
      lead: "A test now tells you what recipients get, instead of approximately what they get.",
      body: [
        "Tracking is on, and the unsubscribe and web-version links are delivered as real" +
          " per-recipient substitutions pointed at safe preview routes, rather than literal URLs" +
          " baked into the HTML. The Send test button inside the editor was wired to the same" +
          " path when the editor is opened from a campaign — it previously used the generic" +
          " template test, which meant no unsubscribe footer, no web-version link, and the wrong" +
          " sender and subject.",
      ],
    },
    {
      title: "A Send Over Your Plan Limit Is Explained Before You Send It",
      modules: ["campaigns"],
      tags: ["Billing"],
      lead:
        "The campaign editor knows your contact count and your marketing limit, and says so up" +
        " front rather than failing behind the send.",
    },
    {
      title: "Duplicate A Segment",
      modules: ["audience"],
      tags: ["UI/UX"],
      lead:
        "The row menu on the Segments list copies a segment's conditions and list scope and drops" +
        " you on the copy.",
    },
    {
      title: "Hand Your DNS Records To Whoever Manages Your DNS",
      modules: ["platform"],
      tags: ["Deliverability", "UI/UX"],
      lead:
        "A “Send to developer” menu on each domain page downloads the records you need as CSV or" +
        " JSON.",
      body: [
        "It covers sending, tracking, inbound and storage domains, and uses the values already on" +
          " the page rather than a generic example.",
      ],
    },
  ],

  bugfixes: [
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed importing a semicolon-delimited CSV mapping nothing at all — the parser assumed" +
        " commas, so the whole file arrived as one enormous column and the mapping step reported" +
        " nothing mapped. A lot of European systems export semicolons. The delimiter is now" +
        " worked out from the first line — comma, semicolon, tab or pipe, counted outside quoted" +
        " text — and used for the preview, the header detection and the import itself.",
    },
    {
      modules: ["audience"],
      tags: ["UI/UX"],
      text:
        "Fixed a new segment saving with none of the conditions you had just built, so it had to" +
        " be opened and saved a second time before it did anything. This had been true since" +
        " segments shipped in March.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed everything typed into a campaign being lost when you opened the template editor." +
        " Opening the editor is a full navigation, so the subject, sender, audience and schedule" +
        " were discarded and the page came back as it had last been stored. The draft is now" +
        " saved first.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed the Send campaign button doing nothing at all for anyone running an ad blocker." +
        " The request went to a URL shape that several blocklists cancel outright, and now posts" +
        " to a neutral one that reaches the same place.",
    },
    {
      modules: ["audience"],
      tags: ["API"],
      text:
        "Fixed creating a contact with double opt-in against a missing or unpublished template" +
        " creating the contact anyway and returning an opaque server error, leaving a stranded" +
        " unverified contact and no confirmation email. The template is now resolved before" +
        " anything is written, and the failure names the actual problem — no active version, or" +
        " no default project configured.",
    },
    {
      modules: ["platform"],
      tags: ["Docs", "UI/UX"],
      text:
        "Fixed every per-provider setup guide button on the sending, tracking and inbound domain" +
        " pages leading to a page that did not exist, including three providers whose links did" +
        " not match the real guide names.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed the campaign preview dialog collapsing to a strip showing only the top of the" +
        " email.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed the domain detail header overflowing on a narrow screen, with the action buttons" +
        " pushed off the page instead of wrapping.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text: "Fixed the missing divider between the sidebar and the page in dark mode.",
    },
  ],
};
