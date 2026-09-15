---
term: Opt-Out
heading: "What is an opt-out?"
description: "An opt-out is a recipient withdrawing permission to receive email, usually by unsubscribing. Legal deadlines, common failures, and how Lettr handles it."
published: 2026-09-14
updated: 2026-09-14
related: [opt-in, list-unsubscribe, one-click-unsubscribe, preference-center, suppression-list]
reading:
  - title: Unsubscribe Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/unsubscribe-best-practices
  - title: Complaints & Unsubscribes
    href: https://docs.lettr.com/learn/suppressions/complaints-unsubscribes
  - title: Email Preferences Page
    href: https://docs.lettr.com/learn/audience/email-preferences
---

**An opt-out** is a recipient withdrawing permission to receive email from a sender, most often by clicking an unsubscribe link or using the unsubscribe button a mail client shows. It reverses an [opt-in](/glossary/opt-in/) for the kind of mail the recipient chose to stop. The term also names a consent model, used by the US CAN-SPAM Act, in which commercial email may be sent without prior permission as long as every recipient can opt out.

## How opt-outs work

**The most common route is an unsubscribe link in the email body**, which opens a page the sender controls and can either unsubscribe the recipient outright or offer narrower choices. The second route is the mail client's own button, driven by the List-Unsubscribe header, where a [one-click unsubscribe](/glossary/one-click-unsubscribe/) removes the recipient with a single request and no page. A reply asking to be removed counts as an opt-out too, although nothing processes it automatically.

Partial opt-outs are possible where the sender offers categories. A [preference center](/glossary/preference-center/) lets the recipient drop one topic while keeping others, with a full opt-out available on the same page, since recipients must be able to leave all commercial email.

A processed opt-out is recorded against the address, and the address is kept on a [suppression list](/glossary/suppression-list/) so later sends skip it. Deleting the address instead loses that record, and a later import can add it back.

## Legal deadlines for opt-outs

**CAN-SPAM requires opt-out requests to be honoured within 10 business days.** The mechanism must be free, must not require more than an email address and the recipient's preferences, and must keep working for at least 30 days after the message is sent. CASL also allows 10 business days to process an unsubscribe request.

Google and Yahoo set a stricter bar for bulk senders: unsubscribe requests must take effect within 2 days, and marketing mail must support one-click unsubscribe as well as a visible link in the body. Under the GDPR, a recipient can withdraw consent at any time, and withdrawing must be as easy as giving consent was. Automated systems apply an opt-out at once, which meets all of these deadlines.

## Common problems with opt-outs

**A hard-to-find unsubscribe link turns opt-outs into spam complaints.** A recipient who cannot leave quickly presses the spam button, and a complaint costs far more reputation than an unsubscribe. A small grey link at the end of a long footer, or a flow that requires logging in, produces that result.

Disconnected systems are the other frequent failure. An opt-out recorded by the sending platform but never copied into the CRM or application database lets a sync or import resubscribe the person, and mailing someone who opted out can breach CAN-SPAM, CASL or the GDPR as well as inviting a complaint.

Transactional messages are a separate case. Receipts and password resets can still go to someone who opted out of marketing, but a transactional message padded with promotional content can fall under the commercial email rules again.

## Opt-out in Lettr

**Lettr adds the address to the suppression list automatically for both kinds of unsubscribe.** It reports them as separate webhook events, `unsubscribe.list_unsubscribe` for an unsubscribe through the List-Unsubscribe header and `unsubscribe.link_unsubscribe` for a click on an unsubscribe link in the email body, and the Analytics dashboard counts both under Unsubscribes.

In campaigns, the `{{unsubscribe_link}}` merge tag becomes a signed per-recipient URL that opens the hosted Manage email preferences page, which applies to marketing campaigns only. There the recipient can untick topics, pause marketing email for 30, 60 or 90 days, or untick every box to unsubscribe from all marketing email, which sets the contact's status to `unsubscribed` and fires `unsubscribe.link_unsubscribe`. A pause is not an opt-out: the contact stays `subscribed` with a `paused_until` date. If a campaign lacks the tag, Lettr appends a minimal fallback footer before the closing `</body>` tag.

API sends default to `transactional: true`, which bypasses unsubscribe suppression, so a recipient who unsubscribed from marketing email still receives an API send left at that default. Marketing-shaped API sends set `transactional: false` so suppressions are honoured. The [Complaints & Unsubscribes](https://docs.lettr.com/learn/suppressions/complaints-unsubscribes) page documents both unsubscribe events.
