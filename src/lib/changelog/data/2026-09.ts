import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-09",
  published: "2026-09-30",

  features: [
    {
      title: "Multilingual Campaigns",
      modules: ["campaigns", "audience"],
      lead:
        "Campaigns can now send each recipient the email in their own language, with its own" +
        " subject line and sender.",
      body: [
        "Each contact's language comes from a contact property you choose, in Audience →" +
          " Properties or through the API with `purpose: communication_language`. A value like" +
          " `de-AT` gets the German version when there is no Austrian one, and contacts with no" +
          " language, or one the email doesn't have, get the email's main language. Every" +
          " language has its own subject, sender and reply-to address, its own unsubscribe footer" +
          " and its own web version. A language can send from any of your verified sending" +
          " domains, or change only the domain and keep the part before the @.",
        "Before sending, Review & Send lists each language with its number of recipients and" +
          " the subject, sender and reply-to it will use. It warns when no contact property holds" +
          " a language. Test sends let you pick the language, and multilingual emails are marked" +
          " in the email lists and the campaign picker (`EN · SK +2`).",
        "The email is locked when the campaign is scheduled, so later edits don't change what" +
          " is sent. After sending, campaign activity shows which language each recipient" +
          " received.",
        "A new preview on the campaign page shows the email in any of its languages, or exactly" +
          " as a chosen contact will see it, with their details filled in. It works for every" +
          " campaign, not only multilingual ones, and replaces the old HTML preview.",
      ],
      docs: {
        label: "Multilingual campaigns",
        href: "https://docs.lettr.com/learn/multilingual-campaigns/introduction",
      },
    },
    {
      title: "WebAuthn Passkey Sign-In",
      modules: ["platform"],
      tags: ["Security"],
      lead:
        "Signing in to Lettr now works with a passkey (Touch ID, Windows Hello, a phone or a" +
        " security key) instead of a password.",
      body: [
        "Add, rename and remove passkeys in Settings → Two-Factor Auth. The login page has a" +
          " “Sign in with passkey” button, and a passkey counts as both sign-in steps, so there" +
          " is no second one. Passkeys also work on the “Confirm your identity” prompt and when" +
          " accepting a team invitation, and accounts that also use an authenticator app get a" +
          " “Use a passkey instead” option on the two-factor screen.",
        "A passkey does not turn on two-factor authentication, and it does not meet a team's" +
          " “require 2FA” rule. That rule still needs an authenticator app.",
      ],
    },
  ],

  improvements: [
    {
      title: "Scheduled Emails Are Queued In Lettr Until Send Time",
      modules: ["transactional"],
      tags: ["API", "Breaking"],
      lead:
        "Scheduled emails now stay in Lettr until their send time, which makes cancelling them" +
        " work again.",
      body: [
        "Cancelling with `DELETE /emails/scheduled/{id}` had stopped working for every" +
          " scheduled email. It now works up to the moment of sending, and a scheduled email" +
          " always shows its current status: `scheduled`, `sending`, `sent`, `cancelled` or" +
          " `failed`.",
        "The new `GET /emails/scheduled` lists your scheduled emails, and emails can now be" +
          " scheduled up to 30 days ahead instead of 3. Custom headers, which scheduled emails" +
          " used to leave out, are now included, and a scheduled email counts against your quota" +
          " on the day it is sent.",
        "Scheduling now returns a Lettr id that starts with `sch_`. The `transmission_id` field" +
          " stays `null` until the email is sent, so update any code that reads it from the" +
          " scheduling response. Old ids still work with `GET`.",
      ],
      docs: {
        label: "Schedule email",
        href: "https://docs.lettr.com/api-reference/emails/schedule-email",
      },
    },
    {
      title: "Stricter Validation Across Domain, Email, Webhook And Audience Endpoints",
      modules: ["transactional", "campaigns", "audience", "platform"],
      tags: ["API", "Breaking"],
      lead:
        "Several API endpoints now reject requests they used to accept, so check these changes" +
        " against your integration.",
      body: [
        "Adding a sending domain your team already has returns a 409 error instead of replacing" +
          " it and resetting its verification. `GET /emails` and `GET /emails/events` only search" +
          " the roughly 10 days of events that are kept: an earlier `from` is moved forward, the" +
          " response shows the dates actually searched, and a `to` before `from` is rejected." +
          " `next_cursor` should now be passed back exactly as received; old cursors still work," +
          " and an invalid one returns 422.",
        "Webhook names can be at most 24 characters, and a webhook update must change something" +
          " and send credentials together with `auth_type`. Contacts can only be added to lists" +
          " that belong to your team, a topic's `contacts_count` counts only subscribed contacts," +
          " and `POST /campaigns/{id}/unschedule` can now clear a send time saved on a draft.",
      ],
    },
    {
      title: "Remote MCP Server Expanded From 18 To 77 Tools",
      modules: ["platform"],
      tags: ["AI", "API", "Security"],
      lead:
        "The remote MCP server at `app.lettr.com/mcp` now has all 77 tools of the `lettr-mcp` npm" +
        " package, up from 18.",
      body: [
        "An AI assistant connected by signing in can now manage emails and folders, schedule" +
          " and cancel sends, set up sending domains and webhooks, run campaigns and manage your" +
          " whole audience. Each tool does exactly what the matching API endpoint does. Tools" +
          " that change data follow team roles and are marked as destructive, so the assistant" +
          " can ask you before using them.",
        "Desktop apps such as Claude Code and Cursor can now sign in to the remote server;" +
          " their sign-in used to be rejected. The same work closed a gap where the sign-in check" +
          " accepted addresses that only look local, such as `http://localhost:1@evil.com`.",
      ],
      docs: {
        label: "Remote server",
        href: "https://docs.lettr.com/learn/mcp/setup",
      },
    },
    {
      title: "Idempotency-Key Header For The Send Email Endpoint",
      modules: ["transactional"],
      tags: ["API"],
      lead:
        "`POST /emails` now accepts an `Idempotency-Key` header, so a retried request does not" +
        " send the same email twice.",
      body: [
        "A repeated request with the same key returns the original response with" +
          " `Idempotency-Replayed: true`, and the email is not sent or counted against your quota" +
          " again. Keys last 24 hours, belong to one API key, and can be up to 255 letters," +
          " digits, `.`, `_` or `-`.",
        "Reusing a key with a different request returns 409 `idempotency_key_conflict`, and" +
          " retrying while the first request is still running returns 409" +
          " `idempotency_in_progress` with `Retry-After: 1`. The usual checks still run first, so" +
          " a retry with no quota left still gets a 429. Scheduled sends (`POST" +
          " /emails/scheduled`) ignore the header.",
      ],
      docs: {
        label: "Idempotency",
        href: "https://docs.lettr.com/learn/sending/idempotency",
      },
    },
    {
      title: "Templates API Supports Campaign Imports, Folder Listing And Render Status",
      modules: ["transactional", "campaigns"],
      tags: ["API"],
      lead:
        "The Templates API can now import emails into the marketing module, list folders, and" +
        " report when an email is ready to send.",
      body: [
        "Set the new `purpose` field to `campaign` on `POST /templates` to import an email" +
          " straight into the marketing module and the campaign picker. Without a `folder_id` it" +
          " goes to that module's main folder, and a folder from the other module is rejected" +
          " with a 422. The new `GET /folders` lists your folders with their ids, and `GET" +
          " /templates` can filter by `purpose` and `folder_id`. `purpose` can't be changed later" +
          " with `PUT /templates/{slug}`.",
        "Imports are now checked: JSON that is not a Topol editor design is rejected with a" +
          " 422, where it used to be saved as an email that broke when opened. The HTML is now" +
          " created in the background, so large imports no longer time out and thumbnails no" +
          " longer stay blank.",
        "Every email now has a `preparation_status` (`pending`, `ready` or `failed`), so you" +
          " can check that an imported or updated email is ready before sending it.",
      ],
      docs: {
        label: "Create template",
        href: "https://docs.lettr.com/api-reference/templates/create-template",
      },
    },
    {
      title: "Inbound Domains Require A Verified Forwarding URL",
      modules: ["platform"],
      tags: ["Webhooks"],
      lead:
        "Creating an inbound domain now requires a forwarding URL, which Lettr tests before the" +
        " domain is created.",
      body: [
        "Inbound domains used to be created with nowhere to forward mail to, so incoming mail" +
          " was accepted and then lost while the domain still looked fine. The forwarding URL," +
          " with an optional auth token, is now tested when the domain is created. When the" +
          " endpoint rejects the test, for example because of a firewall, its response is shown" +
          " and the domain is not created.",
        "Existing inbound domains show a Mail Forwarding card for adding the missing URL." +
          " Domain pages now show one clear status, either “receiving mail” or what is missing," +
          " and a failed MX check shows where mail is actually going.",
      ],
      docs: {
        label: "Inbound email setup",
        href: "https://docs.lettr.com/learn/inbound/setup",
      },
    },
    {
      title: "Dedicated Rate Limits For Sandbox API Keys",
      modules: ["platform"],
      tags: ["API"],
      lead:
        "Sandbox API keys now allow 20 requests per second, 120 per minute and 2,000 per day, up" +
        " from 10 per minute and 100 per day.",
      body: [
        "They no longer share the team's limit of 3 requests per second, so CLI commands like" +
          " `lettr:init` and DTO generation no longer stall. New `X-Sandbox-RateLimit-Second-*`" +
          " headers show the sandbox limits, and the standard `X-RateLimit-*` headers keep" +
          " working with existing SDKs.",
      ],
      docs: {
        label: "Sandbox API keys",
        href: "https://docs.lettr.com/learn/api-keys/sandbox",
      },
    },
    {
      title: "Per-Message Open And Click Tracking Headers For SMTP",
      modules: ["transactional"],
      lead:
        "Open and click tracking can now be turned off for a single SMTP message with" +
        " `X-Lettr-Track-Opens: false` or `X-Lettr-Track-Clicks: false`.",
      body: [
        "The headers are removed before the email is delivered. An invalid value rejects the" +
          " message with `554 5.6.0` instead of sending it with tracking on.",
      ],
      docs: {
        label: "Tracking",
        href: "https://docs.lettr.com/learn/sending/tracking",
      },
    },
    {
      title: "Event Type Filter And Readable Out-Of-Band Reports On The Events Page",
      modules: ["transactional"],
      tags: ["UI/UX"],
      lead:
        "The Events page has a new event type filter (Injected, Delivered, Bounce and others)" +
        " that stays set as you page through results or switch to sandbox mode.",
      body: [
        "Reports that arrive separately from the original email, and can't be matched to it," +
          " used to show as rows of empty fields. They now explain what happened, with the reason" +
          " and optional technical details. Automatic and out-of-office replies are labelled" +
          " “Auto-reply”, with a note that the email did not fail.",
      ],
      docs: {
        label: "Event types",
        href: "https://docs.lettr.com/learn/events/event-types",
      },
    },
    {
      title: "Contact Properties In The Marketing Editor's Merge-Tag Menu",
      modules: ["campaigns", "audience"],
      tags: ["UI/UX"],
      lead:
        "The merge-tag menu in the marketing email editor has a new Audience group with the" +
        " recipient's email and all of your team's contact properties.",
      body: ["The unsubscribe and web version links are now always available in the menu too."],
    },
    {
      title: "Empty-Value Conditions For Segment Properties",
      modules: ["audience"],
      tags: ["API"],
      lead:
        "Segments can now match properties that are empty or not empty, for text, number," +
        " true/false, date and JSON properties, in the app and through the API.",
      docs: {
        label: "Segments",
        href: "https://docs.lettr.com/learn/audience/segments",
      },
    },
    {
      title: "Emails List Preserves Folder, Search And Sort Across Navigation",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "The email detail page has a new “← Emails” link that takes you back to the list with" +
        " your folder, search and email type still applied.",
      body: [
        "Deleting an email in a folder now keeps you in that folder, with the same view, search" +
          " and sort. It used to take you back to the top level, or from the campaign list to the" +
          " transactional list.",
      ],
    },
  ],

  bugfixes: [
    {
      modules: ["campaigns", "audience"],
      tags: ["API"],
      text:
        "A list that a segment is limited to can no longer be deleted, since deleting it made the" +
        " segment reach your whole audience. The app names the segments using the list, and the" +
        " API returns `409 list_in_use`.",
    },
    {
      modules: ["audience"],
      tags: ["API"],
      text:
        "Segments with an unsupported condition are now rejected when saved, and any already" +
        " saved match no contacts instead of possibly all of them.",
    },
    {
      modules: ["campaigns"],
      text:
        "Fixed campaign activity not being archived before the 30-day event window closed. For" +
        " campaigns whose events had already expired, the download now says there is no archive" +
        " instead of returning an empty CSV.",
    },
    {
      modules: ["transactional"],
      tags: ["Security"],
      text:
        "An edited pagination link on the sandbox Events page can no longer show other users'" +
        " sandbox email events.",
    },
    {
      modules: ["campaigns"],
      text:
        "The Reply-To address set on a campaign is now included in the sent email, so replies no" +
        " longer go to the from address.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability", "API"],
      text:
        "Re-adding a sending domain left over from an earlier, unfinished setup now works instead" +
        " of failing with “already registered”. Verifying a domain shows a clear message for a" +
        " conflict, and the API returns 409 instead of 500.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability"],
      text:
        "A sending domain with broken DNS, such as an expired parent domain, no longer makes its" +
        " page fail with an Internal Server Error.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability"],
      text: "Fixed deleting a sending domain sometimes leaving it stuck in the account.",
    },
    {
      modules: ["platform"],
      tags: ["Deliverability", "API"],
      text:
        "Fixed daily domain health checks stopping for a whole team because one of its domains" +
        " had no creation date. The API now marks `created_at` and `updated_at` as nullable.",
    },
    {
      modules: ["transactional"],
      text:
        "Emails sent over SMTP now show accented characters, older character sets such as" +
        " Windows-1250, and embedded `cid:` images correctly. A broken message now gets a" +
        " permanent `554` error, so mail clients stop retrying it.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "API sends whose HTML contains a `localhost` or local network link, common in local" +
        " development, are no longer rejected with a 403 error.",
    },
    {
      modules: ["platform"],
      tags: ["API"],
      text:
        "A temporary problem on our side now returns `503 auth_unavailable` with `Retry-After`," +
        " instead of rejecting a valid API key with `401 Invalid API key`.",
    },
    {
      modules: ["transactional"],
      tags: ["API"],
      text:
        "Fixed a team's first simultaneous API sends returning a 500 error for emails that were" +
        " sent, and the “first email sent” notice arriving more than once.",
    },
    {
      modules: ["campaigns"],
      text:
        "“Send a test email” on a draft campaign now sends what is currently in the editor," +
        " including unsaved changes, with merge tags filled from sample contact values.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "Saving an email twice in quick succession, for example with a double-click, no longer" +
        " fails and loses the change.",
    },
    {
      modules: ["transactional", "campaigns"],
      text:
        "Fixed social icons and other premade images becoming broken links after their stored" +
        " copy was deleted, for example in the file manager. Emails that broke before this fix" +
        " need the image added again once.",
    },
    {
      modules: ["transactional", "campaigns"],
      text:
        "Emails moved into a marketing or transactional folder now switch to that folder's type," +
        " so campaign emails no longer go missing from the marketing grid and campaign picker.",
    },
    {
      modules: ["transactional"],
      tags: ["UI/UX"],
      text:
        "The Events page now opens on the roughly 10 days of events that are kept, instead of 14," +
        " so it no longer looks like events are missing. Date pickers on Events, Logs and" +
        " Analytics no longer offer future days.",
    },
    {
      modules: ["platform"],
      tags: ["Billing"],
      text:
        "Free teams with a custom sending allowance now see that allowance on the dashboard and" +
        " usage page, instead of “3,000 emails per month”.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed the light-mode “Your HTML code” dialog in the editor's HTML block showing pink" +
        " text on a pink background. Lettr's own HTML editors now follow light and dark mode too.",
    },
  ],
};
