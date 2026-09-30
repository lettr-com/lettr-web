import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-03",
  published: "2026-03-10",

  features: [
    {
      title: "Audience Module With Contacts, Lists, Segments And Topics",
      modules: ["audience"],
      tags: ["API", "UI/UX"],
      lead:
        "The new Audience section keeps the people you send to as contacts and groups them into" +
        " lists, segments and topics.",
      body: [
        "A contact is an email address with a status and any number of properties your team" +
          " defines. Each property has a type and can have a fallback value, so a merge tag still" +
          " shows something for a contact who never filled the field in. Lists are groups filled" +
          " by hand, by import or through the API. Topics record what each contact agreed to" +
          " receive, so unsubscribing from one topic keeps the others.",
        "A segment stores conditions instead of members and is checked every time it is used," +
          " so it matches different contacts as the audience changes. It offers sixteen" +
          " operators, limited to the ones that fit each property type, can be limited to one" +
          " list, and shows the matching contacts while the conditions are being written. A" +
          " segment can also be described in a sentence, which is turned into conditions you can" +
          " edit.",
        "A CSV import has three steps: upload, column mapping, and an import that runs in the" +
          " background and emails you when it is done. Lettr detects whether the first row holds" +
          " headers, adds headers when it doesn't, and suggests which column goes to which" +
          " property. A contact that already exists is either skipped (the default) or updated" +
          " with the row's properties, and contacts are matched by email address regardless of" +
          " letter case, so an import never creates duplicates. Rows with a missing or invalid" +
          " address are counted and reported instead of stopping the import. Contact exports" +
          " arrive by email as a download link that works for 7 days.",
        "The new `audience:read` and `audience:write` API key scopes allow listing, creating" +
          " and deleting contacts and lists, and reading segments and their contacts. A contact" +
          " created through the API can go through double opt-in: Lettr sends a confirmation" +
          " email, using one of your emails named in the request, and a public confirmation link" +
          " confirms the contact and redirects to an address you choose.",
      ],
      docs: {
        label: "Audience",
        href: "https://docs.lettr.com/learn/audience/introduction",
      },
    },
    {
      title: "API Failure Rate Alerts By Email And Webhook",
      modules: ["platform", "transactional"],
      tags: ["Webhooks", "Deliverability"],
      lead:
        "A new Alerts page in Settings tells the team owner when the share of failing API" +
        " requests goes up.",
      body: [
        "Two checks run, one over the last 15 minutes for sudden failures and one over the last" +
          " day for slower ones. When the failure rate crosses the alert threshold, the team" +
          " owner is notified, at most once per cooldown period you set. A quiet account needs a" +
          " minimum number of requests before it can be alerted, so one failed call is not" +
          " enough, and the daily alert is skipped when the 15-minute one has already gone out.",
        "Alerts arrive by email, by webhook, or both. A webhook address must be public, a test" +
          " button sends a sample alert, and every delivery is signed with a secret for your team" +
          " that can be regenerated.",
      ],
      docs: {
        label: "Alerts",
        href: "https://docs.lettr.com/learn/settings/alerts",
      },
    },
  ],

  improvements: [
    {
      title: "Separate Contact-Based Billing Tier For Audience",
      modules: ["audience", "platform"],
      tags: ["Billing"],
      lead:
        "Audience is billed on its own, by the number of contacts you keep, separately from the" +
        " plan for emails sent.",
      body: [
        "Adding an audience doesn't change what your current plan costs, and the first 500" +
          " contacts are free on every subscription. Moving to a smaller tier is refused while" +
          " you have more contacts than it allows, instead of removing contacts to fit.",
      ],
      docs: {
        label: "Billing",
        href: "https://docs.lettr.com/learn/settings/billing",
      },
    },
    {
      title: "Sending Domain Allow-List For API Keys",
      modules: ["transactional", "platform"],
      tags: ["API", "Security"],
      lead:
        "An API key can now be limited to a list of sending domains, and a send from any other" +
        " domain is rejected with a `domain_not_allowed` error.",
      body: [
        "A key with no domains listed can send from any domain, so existing keys work as" +
          " before. A leaked key that is limited this way can only send from the domains on its" +
          " list.",
      ],
      docs: {
        label: "API key permissions",
        href: "https://docs.lettr.com/learn/api-keys/permissions",
      },
    },
    {
      title: "Custom Headers Field For The Send Email Endpoint",
      modules: ["transactional"],
      tags: ["API"],
      lead:
        "`POST /api/emails` now accepts a `headers` object with up to 10 custom headers, each" +
        " value up to 998 characters.",
      body: [
        "Headers that decide where an email goes or how it is signed can't be set, including" +
          " `From`, `To`, `Reply-To`, `Subject`, `Date`, `Message-ID` and `DKIM-Signature`." +
          " `List-Unsubscribe` and `List-Unsubscribe-Post` can't be set either, because Lettr" +
          " adds them itself.",
      ],
      code: {
        lang: "bash",
        source: `curl -X POST https://app.lettr.com/api/emails \\
  -H "Authorization: Bearer $LETTR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "billing@example.com",
    "to": ["jane@example.com"],
    "template_slug": "invoice",
    "headers": {
      "X-Mailer": "acme-billing/2.1",
      "X-Entity-Ref-ID": "inv_88213"
    }
  }'`,
      },
      docs: {
        label: "Send an email",
        href: "https://docs.lettr.com/api-reference/emails/send-email",
      },
    },
    {
      title: "Optional Subject Field For Sends With A Template",
      modules: ["transactional"],
      tags: ["API", "Docs"],
      lead:
        "A send with `template_slug` and no `subject` now uses the subject saved on that email," +
        " or the email's name when it has no subject.",
      body: [
        "`subject` used to be required on every send. A `subject` in the request still takes" +
          " priority over the saved one, `GET /api/templates/html` now returns the saved subject" +
          " too, and the API reference no longer lists `subject` as required.",
      ],
      docs: {
        label: "Send an email",
        href: "https://docs.lettr.com/api-reference/emails/send-email",
      },
    },
    {
      title: "AI Content Chat In The HTML Email Editor",
      modules: ["transactional"],
      tags: ["AI", "UI/UX"],
      lead:
        "The HTML email editor now has an AI chat that changes the email from a description in" +
        " plain language.",
      body: [
        "Each change is saved as a new version of the email, so the previous version is still" +
          " there.",
      ],
    },
    {
      title: "Quick-Create Menu In The Top Bar And Refreshed App Design",
      modules: ["platform"],
      tags: ["UI/UX"],
      lead:
        "A “+” menu in the top bar now creates a sending domain, an API key, an email or a" +
        " teammate invitation from any page.",
      body: [
        "The sign-in and registration pages were redesigned at the same time, the team switcher" +
          " was rebuilt, and buttons, cards, inputs, tabs and dialogs got a refreshed look. The" +
          " Lettr logo, in light and dark versions, replaced the text label.",
      ],
    },
    {
      title: "Password Confirmation For Account Email Changes",
      modules: ["platform"],
      tags: ["Security", "UI/UX"],
      lead:
        "Changing the email address on your account now requires your current password, while" +
        " changing only your name does not.",
    },
    {
      title: "Dark Mode In The Topol Editor",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead: "The Topol editor in Lettr now has a dark mode.",
    },
    {
      title: "Templates HTML And Projects Endpoints Added To The API Reference",
      modules: ["transactional"],
      tags: ["Docs", "API"],
      lead:
        "The API reference now documents `GET /templates/html` and `GET /projects`, and no longer" +
        " lists an old request format that no endpoint used.",
      docs: {
        label: "API reference",
        href: "https://docs.lettr.com/api-reference/introduction",
      },
    },
  ],

  bugfixes: [
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "`reply_to` sent as an array or an object is now accepted, where it used to fail with" +
        " “must be a valid email address”. A one-item array is unwrapped, and an object's `email`" +
        " and `name` become `reply_to` and `reply_to_name`.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text: "Fixed emails with attachments sent over SMTP bouncing instead of being delivered.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Sign-in, registration and password reset forms now work when the CAPTCHA is slow to load" +
        " or times out, instead of failing.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "The password reset form no longer reveals whether an email address has a Lettr account," +
        " because both outcomes now show the same message.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed a tab left open during a Lettr update breaking on the next click; the page now" +
        " reloads onto the new version.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "The sign-in and registration pages are now served with their security response headers," +
        " which they used to be missing.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "The description line under the headings on the sign-in and registration screens is shown" +
        " again.",
    },
    {
      modules: ["platform"],
      tags: ["Docs"],
      text: "Fixed a mistake in the Laravel code example on the onboarding screen.",
    },
  ],
};
