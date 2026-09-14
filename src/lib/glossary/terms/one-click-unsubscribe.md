---
term: One-Click Unsubscribe
question: What is
description: "One-click unsubscribe lets a mail client remove a recipient with a single HTTPS POST, as RFC 8058 defines. How it works, who requires it, and Lettr."
related:
  [list-unsubscribe-header, list-unsubscribe, preference-center, suppression-list, bulk-sender]
reading:
  - title: Unsubscribe Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/unsubscribe-best-practices
  - title: Google & Yahoo Sender Requirements
    href: https://docs.lettr.com/knowledge-base/compliance/google-yahoo-requirements
  - title: Email Preferences Page
    href: https://docs.lettr.com/learn/audience/email-preferences
---

**One-click unsubscribe** is a method, defined in RFC 8058, that lets a mail client unsubscribe a recipient with a single request and no web page in between. The client shows its own unsubscribe control, and one press sends an HTTPS POST to a URL the sender supplied in the message headers. Google and Yahoo have required it from bulk senders of marketing and promotional mail since February 2024.

## How one-click unsubscribe works

The method relies on two headers. The [List-Unsubscribe header](/glossary/list-unsubscribe-header/) carries an HTTPS URL unique to the recipient, and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` signals that the URL accepts a one-click request. **A press of the client's button sends a POST to that URL with the body `List-Unsubscribe=One-Click`.** The endpoint identifies the recipient from the URL, removes them and returns a success response without asking for confirmation.

The POST requirement exists because of automated link fetching. Security gateways and link previews issue GET requests against URLs they find in a message, and an endpoint that unsubscribed on GET would remove people who never touched the email. Those systems do not send a POST with this specific body, so the endpoint can treat one as a real request.

RFC 8058 also requires both headers to be covered by a valid DKIM signature. The receiving provider can then trust that the URL was put there by the signing domain and not inserted along the way.

A one-click request is one form of [list unsubscribe](/glossary/list-unsubscribe/), the opt-out a recipient makes through the mail client instead of through a link in the email body.

## Why one-click unsubscribe matters

**Google and Yahoo made one-click unsubscribe part of their bulk sender rules in February 2024.** A [bulk sender](/glossary/bulk-sender/) is one that sends 5,000 or more messages per day to Gmail or Yahoo addresses, and its marketing mail must carry both headers, keep a visible unsubscribe link in the body and honour unsubscribe requests within 2 days. Purely transactional messages such as password resets are exempt, although promotional content inside a transactional message can bring it into scope.

The requirement also works in the sender's favour. A recipient who cannot find a quick way out tends to press the spam button instead, and a complaint harms sender reputation far more than an unsubscribe does. An unsubscribe control next to the sender's name makes the neutral option as easy as the damaging one.

## Common problems with one-click unsubscribe

**An endpoint that returns a confirmation page breaks the flow.** The POST has to complete the unsubscribe on its own, because the client never shows the response to the recipient. A handler that expects a second click leaves the person subscribed while they believe they have left.

Signing order causes a quieter failure. Headers added after the DKIM signature is applied, or left out of the signed header list, do not meet the RFC's signature requirement, and a provider may decline to show its button. Valid headers do not guarantee a button either, since each mailbox provider decides when to display one.

The unsubscribe also has to reach every system that mails the recipient. A request processed by the sending platform but never copied into the application's own database lets a later import or CRM sync add the address back.

## One-click unsubscribe in Lettr

**Campaigns sent from Lettr's campaign builder carry both headers**: `List-Unsubscribe: <{{unsubscribe_url}}>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`.

A one-click request bypasses the hosted Manage email preferences page and unsubscribes the recipient immediately, as the RFC requires. The `{{unsubscribe_link}}` in the campaign body opens that page instead, where the recipient can untick topics, pause marketing email for 30, 60 or 90 days, or unsubscribe from everything. Lettr reports an unsubscribe through the List-Unsubscribe header as the `unsubscribe.list_unsubscribe` webhook event, and both list and link unsubscribes add the address to the [suppression list](/glossary/suppression-list/) automatically.

API sends default to `transactional: true`, which bypasses unsubscribe suppression, so marketing-shaped API sends set `transactional: false` for suppressions to be honoured. The [Unsubscribe Best Practices](https://docs.lettr.com/knowledge-base/compliance/unsubscribe-best-practices) page covers unsubscribe link placement and footer design.
