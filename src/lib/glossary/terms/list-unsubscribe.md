---
term: List Unsubscribe
question: What is
description: "A list unsubscribe is an opt-out made with the mail client's own unsubscribe button instead of a link in the email. How it differs from a link unsubscribe."
related:
  [list-unsubscribe-header, one-click-unsubscribe, opt-out, preference-center, suppression-list]
reading:
  - title: Unsubscribe Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/unsubscribe-best-practices
  - title: Webhook Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
  - title: Email Preferences Page
    href: https://docs.lettr.com/learn/audience/email-preferences
---

**A list unsubscribe** is an opt-out the recipient makes through the mailbox provider's own interface, such as the Unsubscribe link Gmail shows next to the sender's name, instead of through a link inside the email. The client acts on the [List-Unsubscribe header](/glossary/list-unsubscribe-header/) in the message, usually with a one-click request. It is distinct from a link unsubscribe, which happens when the recipient clicks an unsubscribe link in the email body, and sending platforms report the two as separate events.

## How a list unsubscribe works

A mail client that finds a List-Unsubscribe header in a message can display its own unsubscribe control. **What happens on a click depends on the header's contents.** When the message also carries `List-Unsubscribe-Post: List-Unsubscribe=One-Click`, the client sends an HTTPS POST to the sender's URL, the [one-click unsubscribe](/glossary/one-click-unsubscribe/) defined in RFC 8058. When the header only offers a `mailto:` address, the client sends an unsubscribe email to it on the recipient's behalf.

Either way the recipient never visits the sender's website. Gmail, Yahoo Mail, Apple Mail and Outlook all support one-click unsubscribe, although each provider decides when to show the control, so a message that carries the header does not always display a button.

The request identifies the recipient through the URL or address in the header, which is why those values are unique per recipient. The sender's endpoint has to treat a valid request as final, since the client offers no way to confirm or explain the choice.

## List unsubscribe vs link unsubscribe

A link unsubscribe starts inside the message. **The recipient opens the email, clicks the link and lands on a page the sender controls**, often a [preference center](/glossary/preference-center/) where they can drop one topic, reduce frequency or leave entirely. That page can keep a partial subscription alive and can ask for a reason.

A list unsubscribe skips all of that. The recipient acts from the inbox view, and the request unsubscribes them without a page, so it works as a full [opt-out](/glossary/opt-out/) from the mail that carried the header. Tracking the two separately shows how many recipients prefer the client button, and a rising share can mean the body link is hard to find.

Both paths carry the same legal weight. CAN-SPAM allows up to 10 business days to process an unsubscribe, Google and Yahoo require bulk senders to honor one within 2 days, and in practice both kinds should take effect at once.

## Why list unsubscribes matter

**The client button is the alternative to the spam button.** Recipients who cannot find a quick way out mark mail as spam instead, and a complaint hurts sender reputation far more than an unsubscribe. A one-click control next to the sender's name makes the neutral option as easy as the damaging one, which is why Google and Yahoo have required it from bulk senders since February 2024.

The unsubscribe also has to reach every system that sends mail. A list unsubscribe processed by the sending platform but never copied into the application's own database lets a later import or CRM sync add the person back, and mailing someone who opted out invites the complaint the button was meant to prevent. Keeping an internal record of each opt-out, with its method and time, also gives an audit trail for compliance.

## List unsubscribe in Lettr

**Lettr reports the two methods as separate webhook events**: `unsubscribe.list_unsubscribe` for an unsubscribe through the List-Unsubscribe header and `unsubscribe.link_unsubscribe` for a click on an unsubscribe link in the email body. When a recipient uses the mail client's button, the List-Unsubscribe request goes directly to Lettr. Both kinds of unsubscribe add the address to the [suppression list](/glossary/suppression-list/) automatically, and the Analytics dashboard counts both under Unsubscribes.

Campaigns sent from the campaign builder carry the `List-Unsubscribe` header together with `List-Unsubscribe-Post: List-Unsubscribe=One-Click`. The one-click unsubscribe bypasses the hosted Manage email preferences page and unsubscribes immediately, while the `{{unsubscribe_link}}` in the campaign body opens that page, where the recipient can untick topics, pause marketing email for 30, 60 or 90 days, or unsubscribe from everything. A full unsubscribe from the page sets the contact's status to `unsubscribed` and fires `unsubscribe.link_unsubscribe`.

In-body unsubscribe links in API sends use the `data-msys-unsubscribe="1"` attribute, and click tracking must be enabled for them to generate unsubscribe events. The `transactional` option defaults to `true`, which bypasses unsubscribe suppression, so marketing-shaped API sends set it to `false`. The [Webhook Event Types](https://docs.lettr.com/learn/webhooks/event-types) page lists both unsubscribe events.
