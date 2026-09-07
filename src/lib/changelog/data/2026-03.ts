import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-03",

  features: [
    {
      title: "Audience: Contacts, Lists, Segments And Topics",
      modules: ["audience"],
      tags: ["API", "UI/UX"],
      lead:
        "Lettr gained a place to keep the people you send to, rather than treating a recipient" +
        " as an address that exists only inside one request.",
      body: [
        "It is built from four ideas. `Contacts` are people: an email address, a status, and any" +
          " number of properties your team defines. Properties are typed and each carries an" +
          " optional fallback, so a merge tag that lands on someone who never filled the field in" +
          " still renders something.",
        "`Lists` are deliberate groupings, filled by hand, by import or over the API. `Segments`" +
          " store a condition instead of a membership and are evaluated when read, so a segment" +
          " for contacts in Germany who opened something last month describes different people" +
          " next week without anyone touching its definition. Sixteen operators are offered," +
          " narrowed to what each field type can actually do, and a segment can be scoped to a" +
          " single list. There is a natural-language route too: describe the audience you want in" +
          " a sentence and it is turned into a condition tree you can then edit.",
        "`Topics` record what someone agreed to receive. Dropping one topic leaves the others" +
          " intact, which is the whole argument for topics over a single global unsubscribe that" +
          " throws away information you cannot get back.",
        "Importing is a three-step flow — upload, map your columns, then a queued job that works" +
          " through the file in chunks and emails you when it is done. Two assists sit in the" +
          " middle of it: one decides whether your first row is a header row and invents headers" +
          " when it is not, the other proposes which column belongs to which property. On a" +
          " re-import you choose the duplicate strategy explicitly, skipping existing contacts or" +
          " merging the row's properties into them. Either way an import never duplicates" +
          " somebody: rows are matched on a lowercased email. Rows with a missing or invalid" +
          " address are counted and reported rather than failing the file.",
        "Contacts created over the API can go through double opt-in — Lettr sends a confirmation" +
          " email from a template you name, and a public confirm endpoint marks the contact and" +
          " redirects wherever you say.",
      ],
      docs: {
        label: "Audience",
        href: "https://docs.lettr.com/learn/audience/introduction",
      },
    },
    {
      title: "Marketing Billing Is A Separate Line",
      modules: ["audience", "platform"],
      tags: ["Billing"],
      lead:
        "Audience bills on its own meter, priced on how many contacts you keep, entirely separate" +
        " from the email-volume tier you already pay for.",
      body: [
        "Adding an audience therefore does not change what your existing plan costs. The first" +
          " 500 contacts are included at no charge on every subscription. Moving down a tier is" +
          " refused while you still hold more contacts than the smaller tier allows, rather than" +
          " silently dropping people.",
      ],
      docs: {
        label: "Billing",
        href: "https://docs.lettr.com/learn/settings/billing",
      },
    },
    {
      title: "Alerts When Your API Error Rate Climbs",
      modules: ["platform", "transactional"],
      tags: ["Webhooks", "Deliverability"],
      lead:
        "A new Alerts page watches the failure rate of your API calls and tells you when it goes" +
        " up.",
      body: [
        "Two checks run: a fifteen-minute one for sudden breakage and a daily one for the slow" +
          " kind. Crossing your threshold notifies the team owner, subject to a cooldown you set," +
          " a minimum request volume so one failed call on a quiet account cannot alert, and a" +
          " rule that suppresses the daily alert when the fifteen-minute one has already fired.",
        "Alerts arrive by email, by webhook, or both. A webhook target has to be a genuinely" +
          " public URL, there is a test-send button, and every delivery is signed with a per-team" +
          " secret you can regenerate.",
      ],
      docs: {
        label: "Alerts",
        href: "https://docs.lettr.com/learn/settings/alerts",
      },
    },
    {
      title: "Restrict An API Key To Specific Sending Domains",
      modules: ["transactional", "platform"],
      tags: ["API", "Security"],
      lead:
        "A key can now carry an allow-list of sending domains, and a send whose `from` domain is" +
        " not on it is rejected instead of going out.",
      body: [
        "A key with an empty list stays unrestricted, so nothing changes for keys you already" +
          " issued. It makes a leaked key considerably less useful to whoever leaked it.",
      ],
      docs: {
        label: "API key permissions",
        href: "https://docs.lettr.com/learn/api-keys/permissions",
      },
    },
    {
      title: "Custom Headers On A Send",
      modules: ["transactional"],
      tags: ["API"],
      lead:
        "`POST /api/emails` accepts a `headers` object — up to ten of them, each value at most" +
        " 998 characters.",
      body: [
        "Headers that decide where a message goes or how it is signed are refused by name, `From`," +
          " `To`, `Reply-To`, `Subject`, `Date`, `Message-ID` and `DKIM-Signature` among them, as" +
          " are `List-Unsubscribe` and `List-Unsubscribe-Post`, because Lettr manages those" +
          " itself.",
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
  ],

  improvements: [
    {
      title: "Subject Is Optional When You Send With A Template",
      modules: ["transactional"],
      tags: ["API", "Docs"],
      lead:
        "Send with `template_slug` and no `subject` and the email now takes the subject stored on" +
        " the template, falling back to the template's name.",
      body: [
        "Passing a subject alongside a template still overrides it. `GET /api/templates/html`" +
          " returns the template's subject too, so a caller can read it rather than keep its own" +
          " copy in step. The specification was corrected to match: `subject` is no longer" +
          " required.",
      ],
      docs: {
        label: "Send an email",
        href: "https://docs.lettr.com/api-reference/emails/send-email",
      },
    },
    {
      title: "A Quick-Create Menu, And A Visual Pass Over The App",
      modules: ["platform"],
      tags: ["UI/UX"],
      lead:
        "A “+” menu in the top bar creates a sending domain, an API key, an email or a teammate" +
        " invitation from anywhere.",
      body: [
        "It arrived with a broader tidy-up: redesigned sign-in and registration screens, a" +
          " rebuilt team switcher, refreshed radii and surfaces across buttons, cards, badges," +
          " inputs, selects, tabs and dialogs, and the proper Lettr logo in place of a wordmark," +
          " with separate light and dark artwork.",
      ],
    },
    {
      title: "Describe A Change And The Email Editor Makes It",
      modules: ["transactional"],
      tags: ["AI", "UI/UX"],
      lead:
        "The AI content chat came to the standalone HTML email editor, not only to the campaign" +
        " composer.",
      body: [
        "Describe what you want changed in plain language and the rewritten HTML comes back and" +
          " is saved as a new version, so the previous one is still there if you preferred it.",
      ],
    },
    {
      title: "Changing Your Email Address Requires Your Password",
      modules: ["platform"],
      tags: ["Security", "UI/UX"],
      lead: "Changing only your name does not.",
    },
    {
      title: "Dark Mode In The Drag-And-Drop Editor",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead: "The Topol editor follows a dark appearance now.",
    },
    {
      title: "The API Reference Got An Audit",
      modules: ["transactional"],
      tags: ["Docs", "API"],
      lead:
        "`GET /templates/html` and `GET /projects` are documented for the first time, and a" +
        " legacy request shape that no endpoint used any more was removed.",
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
        "Fixed `reply_to` being rejected when it arrives as an array or an object rather than a" +
        ' string. Vendor-locked applications that send `["a@b.com"]` or' +
        ' `{"email": …, "name": …}` failed validation with “must be a valid email address” and' +
        " could not send at all. A single-element array is now unwrapped, an object's `email` and" +
        " `name` become `reply_to` and `reply_to_name`, a plain string is unaffected, and a" +
        " genuinely invalid address inside either shape is still rejected.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "Fixed three ways the SMTP proxy built a request the API would refuse, which was bouncing" +
        " every SMTP email that carried an attachment: `Reply-To` went out as an array rather" +
        " than a string, attachment fields used the wrong names and omitted the content type, and" +
        " parts that were already base64 kept their line breaks and failed the encoding check.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed sign-in, registration, forgotten-password and password reset failing outright when" +
        " the CAPTCHA was slow to load or timed out. The form now continues instead of throwing.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed the password-reset form revealing whether an address has a Lettr account — the" +
        " success and failure responses could be told apart. Both now say the same thing.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed a tab left open across a deployment breaking on the next click, by asking for" +
        " JavaScript that the new build no longer had. It now reloads onto the fresh build" +
        " instead of erroring.",
    },
    {
      modules: ["platform"],
      tags: ["Docs"],
      text: "Fixed the Laravel example on the onboarding screen.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed the sign-in and registration pages being served without their security response" +
        " headers, and restored the missing description line under the headings on those screens.",
    },
  ],
};
