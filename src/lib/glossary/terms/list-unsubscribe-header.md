---
term: List-Unsubscribe Header
heading: "What is the List-Unsubscribe header?"
description: "The List-Unsubscribe header gives mail clients a machine-readable way to unsubscribe a recipient. How it works with RFC 8058 one-click and how Lettr sets it."
published: 2026-09-14
updated: 2026-09-14
related: [one-click-unsubscribe, list-unsubscribe, bulk-sender, email-header, spam-complaint]
reading:
  - title: Unsubscribe Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/unsubscribe-best-practices
  - title: Google & Yahoo Sender Requirements
    href: https://docs.lettr.com/knowledge-base/compliance/google-yahoo-requirements
  - title: Complaints and Unsubscribes
    href: https://docs.lettr.com/learn/suppressions/complaints-unsubscribes
---

**The List-Unsubscribe header** is an [email header](/glossary/email-header/) that tells mail clients how to unsubscribe a recipient without the recipient opening a web page. Clients that recognize it show their own unsubscribe control near the sender's name, and the header supplies the address or URL that control uses. It was defined in RFC 2369, extended for one-click use by RFC 8058, and is now required of bulk senders by Gmail and Yahoo.

## How the List-Unsubscribe header works

The header holds one or more URIs in angle brackets, separated by commas. **A `mailto:` URI asks the client to send an unsubscribe email**, and an `https:` URI points to an endpoint on the sender's side. A typical value is `List-Unsubscribe: <mailto:unsub@example.com>, <https://example.com/unsub/abc123>`, with the last path segment identifying the recipient.

A plain HTTPS link leaves a gap, because security scanners and link previews fetch URLs automatically, and an endpoint that unsubscribes on any request would remove people who never asked. [One-click unsubscribe](/glossary/one-click-unsubscribe/), defined in RFC 8058, closes that gap with a second header, `List-Unsubscribe-Post: List-Unsubscribe=One-Click`. With both headers present, the client sends an HTTPS POST carrying that body to the URL, and the endpoint unsubscribes the recipient without a confirmation page or login.

RFC 8058 also expects both headers to be covered by the message's DKIM signature. A receiver can then trust that the URL came from the signing domain and was not inserted along the way.

## List-Unsubscribe header vs unsubscribe link

The header and the unsubscribe link in the email body do the same job through different routes. **The body link opens a page the sender controls**, which can offer topic choices, a pause or a full unsubscribe. The header works inside the mail client, and a one-click request unsubscribes the recipient straight away with no page in between.

Mailbox providers treat the two as complements, not alternatives. Google and Yahoo require bulk senders to support the header and to keep a visible unsubscribe link in the body, and a recipient who uses the client button produces a [list unsubscribe](/glossary/list-unsubscribe/), reported separately from a click on the body link.

## Why the List-Unsubscribe header matters

Since February 2024, Google and Yahoo have required **one-click unsubscribe through `List-Unsubscribe` and `List-Unsubscribe-Post`** for marketing and promotional mail from any [bulk sender](/glossary/bulk-sender/), meaning a domain that sends 5,000 or more messages per day to their users. Unsubscribe requests must be honored within 2 days, much faster than the 10 business days CAN-SPAM allows. Purely transactional mail, such as password resets and order confirmations, is exempt, although promotional content can pull a transactional message into scope.

The header also protects reputation. A recipient who cannot find a quick way out reaches for the spam button, and a [spam complaint](/glossary/spam-complaint/) damages reputation far more than an unsubscribe does. A visible unsubscribe control next to the sender's name turns some of those complaints into neutral opt-outs.

## Common problems with the List-Unsubscribe header

**An endpoint that asks for confirmation breaks one-click.** The POST from the client must complete the unsubscribe on its own, so a handler that returns a "please confirm" page leaves the recipient subscribed. The opposite mistake, unsubscribing on a GET request, lets link scanners remove people at random.

Unsigned headers are a quieter failure. A header added after DKIM signing, or left out of the signed header list, may be ignored by providers that check it. Mail sent through several systems can also end up without the header on one stream, so every marketing send is worth checking in the raw message source.

## List-Unsubscribe header in Lettr

**Campaigns sent from Lettr's campaign builder carry both headers**: `List-Unsubscribe: <{{unsubscribe_url}}>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`. A one-click unsubscribe from the mail client's button sends a request directly to Lettr, which generates an `unsubscribe.list_unsubscribe` webhook event and suppresses the address automatically. That path bypasses the hosted email preferences page and unsubscribes the recipient immediately, as the RFC requires.

API sends default to `transactional: true`, and that default bypasses unsubscribe suppression, so marketing-shaped API sends set `transactional: false` for unsubscribes to be honored. The [Complaints and Unsubscribes](https://docs.lettr.com/learn/suppressions/complaints-unsubscribes) page documents both unsubscribe events.
