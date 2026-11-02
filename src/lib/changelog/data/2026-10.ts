import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-10",
  published: "2026-11-02",

  features: [
    {
      title: "Comments In The Email Editor",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "Teammates can now comment on an email in the Topol editor, with each comment thread" +
        " pinned to a block or section.",
      body: [
        "A thread supports replies, thumbs-up and thumbs-down reactions, and read or unread" +
          " status, and it can be resolved and reopened. Only a comment's author can edit or" +
          " delete it. The comments panel lists every thread by date or with unread threads" +
          " first, and hides resolved threads by default.",
        "New comments and changes appear for teammates who have the same email open, without a" +
          " reload. Teammates you @mention in a new comment get an email, and mentions only reach" +
          " members of your team. Deleting an email deletes its comments. Comments are available" +
          " to every team.",
      ],
      docs: {
        label: "Comments",
        href: "https://docs.lettr.com/learn/templates/comments",
      },
    },
  ],

  improvements: [
    {
      title: "Create Campaign Endpoint With Idempotency-Key Support",
      modules: ["campaigns"],
      tags: ["API"],
      lead:
        "The new `POST /campaigns` endpoint creates a draft campaign, so a campaign can now be" +
        " created, sent and scheduled entirely through the API.",
      body: [
        "The content is either `html_content`, optionally with the Topol editor's" +
          " `json_content`, or a `template_id`, whose HTML is copied onto the campaign. The" +
          " request can also set the name or just the subject, the sender fields, `reply_to`, the" +
          " audience in `audience_config` (`all_contacts`, `list_ids`, `segment_ids`, `topic_id`)" +
          " and `language_overrides` for the secondary languages of a multilingual email. Every" +
          " email, list, segment and topic must belong to your team. Unknown `audience_config`" +
          " keys return a 422, as does a language override for anything other than the email's" +
          " secondary languages, and that error lists the allowed ones. The endpoint needs the" +
          " `campaigns:write` scope, which full-access keys include, and sandbox keys can't use" +
          " it.",
        "An optional `Idempotency-Key` header works as it does on `POST /emails`. Repeating the" +
          " request with the same key and payload within 24 hours returns the original draft with" +
          " `Idempotency-Replayed: true`, whatever the order of the fields. A different payload" +
          " returns 409 `idempotency_key_conflict`, and a retry while the first request is still" +
          " running returns 409 `idempotency_in_progress` with `Retry-After: 1`. Sending and" +
          " scheduling stay on the existing `/send` and `/schedule` endpoints.",
        "The endpoint answers 201 with the same body as `GET /campaigns/{id}`. Campaign" +
          " responses now also include `audience_config` and `template_id`, and the campaign" +
          " detail adds `json_content`, so you can read back what you created.",
      ],
      docs: {
        label: "Create a campaign",
        href: "https://docs.lettr.com/api-reference/campaigns/create-a-campaign",
      },
    },
    {
      title: "Stricter Checks When Sending Or Scheduling Campaigns",
      modules: ["campaigns"],
      tags: ["API", "Breaking"],
      lead:
        "Campaign send and schedule requests now refuse a campaign that can't go out instead of" +
        " accepting it, so check these changes against your integration.",
      body: [
        "Send and schedule return 422 `campaign_not_sendable` with an explanation when the main" +
          " sender's domain isn't verified for your team, when the audience has no subscribed" +
          " contacts, or when your team has more contacts than its marketing plan allows. The" +
          " first two used to be accepted everywhere and then fail during sending; the contact" +
          " limit used to apply only in the web app, so API and MCP sends ignored it. Campaigns" +
          " still don't count against your monthly sending quota. A scheduled campaign that is no" +
          " longer sendable when it comes due is marked failed instead of being sent.",
        "API keys limited to certain sending domains now apply that limit to campaigns too." +
          " Creating, sending or scheduling a campaign from any other domain, including a" +
          " language's own sender, returns 403 `domain_not_allowed`, and the MCP tools return an" +
          " error naming the domain.",
        "Campaigns can now be scheduled at most one year ahead, in the API, MCP and the web" +
          " app; later dates used to be accepted or fail with a 500. Unexpected errors on" +
          " creating, sending or scheduling a campaign now return the error code `internal_error`" +
          " instead of `send_error`.",
      ],
      docs: {
        label: "Send a campaign",
        href: "https://docs.lettr.com/api-reference/campaigns/send-a-campaign-now",
      },
    },
    {
      title: "Automatic Plain-Text Part For Template Sends And Campaigns",
      modules: ["transactional", "campaigns"],
      tags: ["Deliverability"],
      lead:
        "Emails sent with `template_slug`, including double opt-in confirmations, and all" +
        " campaigns now go out with a plain-text version that Lettr generates from their HTML.",
      body: [
        "They used to be HTML only, which spam filters can count against an email and which" +
          " leaves text-only mail clients with nothing to show. The text is generated for every" +
          " campaign language and for test emails too. Merge tags survive the conversion," +
          " including inside links, the hidden preview text is left out, and sections set to show" +
          " only on mobile are kept. If the conversion can't produce usable text, the email goes" +
          " out HTML-only rather than failing.",
        "A `text` field passed on an API send still takes precedence, and emails sent with your" +
          " own `html` are unchanged. There is no setting to turn it off. The email page has a" +
          " new Plain text preview tab, next to Desktop and Mobile, that shows the text that will" +
          " be sent.",
      ],
      docs: {
        label: "Automatic plain text",
        href: "https://docs.lettr.com/learn/sending/content-types",
      },
    },
    {
      title: "Email Editor Upgraded To Topol Email Editor v4",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "The email editor in Lettr now runs Topol Email Editor v4 for every team, with a new" +
        " interface and the same features as before.",
      body: [
        "The editor shows which teammates have the same email open. It doesn't merge their" +
          " edits, so two people saving the same email can still overwrite each other's changes." +
          " The version in the editor's address (`?version=`) is now the version number shown on" +
          " the email page, and after a save the address follows the version just saved, so a" +
          " reload no longer reopens an older version and saving from there no longer writes old" +
          " content over the new.",
        "A new email made with “Create from scratch” now opens on the editor's start screen" +
          " until it is first edited, and its “Start from predefined template” option offers" +
          " Lettr's own premade library. The premade folders work as the category filter, and you" +
          " can search by name. Synced sections in a picked premade come in as plain sections, as" +
          " they do when you create an email from a premade.",
        "A failed editor sign-in now shows an error instead of loading forever, reloading after" +
          " a save in the custom HTML editor no longer shows an error page, and the “Sign in" +
          " again” button on the expired-session banner is now readable.",
      ],
      docs: {
        label: "Topol Email Editor",
        href: "https://docs.lettr.com/learn/templates/topol-editor",
      },
    },
    {
      title: "Passkeys As A Standalone Two-Factor Method",
      modules: ["platform"],
      tags: ["Security"],
      lead:
        "A new Passkeys switch in Settings → Two-Factor Auth makes sign-ins with a password," +
        " Google or GitHub ask for a passkey as the second step, even without an authenticator" +
        " app.",
      body: [
        "With both an authenticator app and the switch on, either one works, and the challenge" +
          " screen offers a recovery code as the fallback. Both methods share one set of recovery" +
          " codes, and turning the switch on signs you out on your other devices.",
        "Unlike a passkey on its own, the switch meets a team's “require 2FA” rule, so members" +
          " held back by that rule can turn it on to comply. Under that rule, your last passkey" +
          " can't be removed while it is your only two-factor method.",
        "Adding a passkey or turning the switch on now needs your password or an existing" +
          " passkey. An emailed code is accepted only for the first passkey of an account that" +
          " signs in with Google or GitHub.",
      ],
      docs: {
        label: "Security",
        href: "https://docs.lettr.com/learn/settings/security",
      },
    },
    {
      title: "Sent Column With A Live Countdown On The Campaigns List",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead: "The Campaigns list has a new Sent column with the date and time each campaign went out.",
      body: [
        "Scheduled campaigns show their send time in blue with a countdown, such as “in 40 min”" +
          " or “in 6 days”, and “Sending any moment” once the time has passed; hovering shows the" +
          " full date and time zone. The list is now ordered by creation date, newest first, so" +
          " editing an old campaign no longer moves it to the top.",
      ],
    },
    {
      title: "Adamko Guided Tours For Multilingual Campaigns",
      modules: ["campaigns", "audience"],
      tags: ["AI"],
      lead:
        "Adamko can now guide you through setting up multilingual campaigns step by step in the" +
        " app.",
      body: [
        "He offers four “Guide me” tours: choosing the contact property that holds each" +
          " contact's language, building a multilingual campaign, setting your team's default" +
          " communication language, and multilingual emails. He also answers questions about how" +
          " languages are matched and which language a contact gets when theirs isn't available.",
      ],
      docs: {
        label: "Multilingual campaigns",
        href: "https://docs.lettr.com/learn/multilingual-campaigns/introduction",
      },
    },
    {
      title: "Single Password Field On The Signup Form",
      modules: ["platform"],
      tags: ["UI/UX"],
      lead: "The signup form now asks for your password once, without a “Confirm password” field.",
      body: ["Password reset and changing your password in Settings still ask for it twice."],
    },
  ],

  bugfixes: [
    {
      modules: ["campaigns"],
      tags: ["API"],
      text:
        "Sending or scheduling the same campaign twice at once, for example with a double click" +
        " or a retried API call, no longer marks it as failed.",
    },
    {
      modules: ["campaigns"],
      text:
        "Fixed an error in one scheduled campaign holding back the other campaigns due at the" +
        " same time. A campaign that keeps failing is retried every minute and marked failed" +
        " after an hour.",
    },
    {
      modules: ["campaigns"],
      tags: ["Deliverability"],
      text:
        "Recipients in a campaign batch the provider refused are now sent on retry instead of" +
        " being dropped, and a campaign refused on every attempt is marked failed instead of" +
        " sent.",
    },
    {
      modules: ["audience", "campaigns"],
      text:
        "A contact property's Fallback value is now used in campaigns, web versions and previews" +
        " when a contact has no value for it, instead of leaving a gap.",
    },
    {
      modules: ["audience"],
      tags: ["API"],
      text:
        "Fixed contacts added over the API with `double_opt_in` getting stuck unconfirmed when" +
        " the sender's domain wasn't verified or allowed. The request now returns the send" +
        " endpoints' domain errors and creates nothing.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability"],
      text:
        "The Domains form and onboarding now reject invalid domains, such as `mycompany`," +
        " `https://foo.com` or gmail.com, with a clear message, and no longer fail on another" +
        " account's domain.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability"],
      text:
        "Errors for an unverified tracking domain, a sending domain that is also your inbound" +
        " domain, and an unreachable forwarding URL now explain the problem.",
    },
    {
      modules: ["transactional"],
      text:
        "The Analytics page no longer fails for ranges longer than 30 days with hourly precision," +
        " and outside UTC a range now covers exactly the days you picked.",
    },
    {
      modules: ["transactional"],
      tags: ["UI/UX"],
      text:
        "Fixed the Analytics chart tooltip breaking when the precision changed while you were" +
        " hovering over the chart.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "When Adamko looks up email events, an unknown event type now gets the list of valid" +
        " types instead of an error.",
    },
    {
      modules: ["transactional", "campaigns"],
      text:
        "“Send test email” in the editor no longer fails for large emails, such as ones with" +
        " inlined images, and a failed send shows the editor's usual error.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "`POST /emails` and scheduled sends now include an error message with `502" +
        " transmission_failed` when the provider is down, instead of an empty one.",
    },
    {
      modules: ["campaigns", "audience"],
      tags: ["API"],
      text:
        "Duplicate topic names and a stale or forged `cursor` on `GET /campaigns/{id}/events` now" +
        " return a 422 instead of a 500 error.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed duplicating an email with a double click failing with an error. The same fix" +
        " covers copying and moving emails between projects or teams.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "The Create Email dialog no longer flashes the grid or makes two emails on a double" +
        " click, and its columns now go from two to three to four.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["API"],
      text:
        "An imported email whose preparation failed no longer jumps to the top of the Emails" +
        " list.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability"],
      text:
        "Fixed every row of the dashboard's Domain health card drawing the team's total sends" +
        " instead of that domain's own daily sends.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "The Full access and Sending access descriptions in the Create API key dialog are" +
        " readable again in light and dark mode.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed “Sign in with passkey” showing a JSON error on a login tab that had already signed" +
        " in from another tab; it now opens the dashboard.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Error messages on Settings → Team, such as when inviting someone or changing a role, now" +
        " show in full instead of only their first letter.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "After a deploy, an outdated page now reloads once instead of crashing, and a request" +
        " that gets no response shows a “Connection problem” message.",
    },
  ],
};
