---
term: No-Reply Address
question: What is
description: "A no-reply address such as noreply@ sends automated mail that nobody reads replies to. Why it frustrates recipients and how Lettr routes replies instead."
related:
  [
    reply-to-header,
    from-header,
    variable-reply-to-address,
    transactional-email,
    non-delivery-report,
  ]
reading:
  - title: Recipients
    href: https://docs.lettr.com/learn/sending/recipients
  - title: Reply Tracking
    href: https://docs.lettr.com/learn/inbound/reply-tracking
---

**A no-reply address** is a sender address, such as `noreply@example.com` or `do-not-reply@example.com`, that is not meant to receive replies. It usually sends automated mail like receipts, password resets and notifications, and its name tells the recipient that nobody reads what comes back. The label is a naming convention rather than a technical setting, so what happens to a reply depends on how the sender's domain handles mail for that address.

## How a no-reply address works

A reply goes to the address in the [From header](/glossary/from-header/) unless the message carries a [Reply-To header](/glossary/reply-to-header/). **Nothing in SMTP stops a recipient from replying to `noreply@`**, so the outcome is decided by the mail setup of the sender's own domain:

- **No mailbox:** the domain's mail server rejects the reply, and the person who replied receives a bounce message, a [non-delivery report](/glossary/non-delivery-report/) in Microsoft's terms.
- **Unread mailbox:** the address accepts mail, but its contents are deleted or never opened, so the reply is lost without any error.
- **Autoresponder:** an automatic message tells the person that the address is not monitored and points to another contact route.

Bounces for the original message are unaffected by any of these. Delivery failures go to the Return-Path address, not to the From address, so a no-reply sender still gets its bounce data.

## Why no-reply addresses cause problems

**Recipients treat Reply as the obvious way to answer an email**, and automated mail prompts plenty of answers: a question about an order, a disputed charge on an invoice, a setup problem after signing up. A no-reply address turns each of those into a dead end. The recipient either gets a bounce that reads like an error or hears nothing, and has to find a support page to try again.

Marketing mail adds opt-out requests to the list. Laws such as the [CAN-SPAM Act](/glossary/can-spam-act/) require a working opt-out mechanism, and an unsubscribe link meets that requirement, but a recipient who replies "unsubscribe" to an unread mailbox has asked for something nobody will act on.

Trust is part of the cost. A sender address that announces it will not read answers makes the message **one-way by design**, which sits badly with mail about a customer's own account or payment.

## No-reply address vs monitored Reply-To

The common alternative keeps the automated From address and adds a Reply-To that points at a staffed mailbox such as `support@example.com`. **The From address stays stable and recognisable while replies reach someone who can act on them.** Different kinds of mail can route to the team they concern, with billing questions going to `billing@` and order questions to `orders@`.

Replies that software should process work the same way with a generated address. A [variable reply-to address](/glossary/variable-reply-to-address/) encodes an identifier such as a ticket number, and an inbound mail setup delivers each reply to the application with that identifier in the recipient address.

A monitored address brings its own traffic. Out-of-office messages and other automatic replies arrive alongside real ones, and the `Auto-Submitted` header helps separate them. For [transactional email](/glossary/transactional-email/) that truly needs no answer, a no-reply sender can stay, with a support link in the footer and an autoresponder behind the address so a stray reply does not end in silence.

## No-reply address in Lettr

A Lettr send request sets the reply address in the `reply_to` field and its display name in `reply_to_name`. **The Recipients docs describe the standard pattern**: a message sent from `noreply@example.com` with replies directed to `support@example.com`, for mail whose sending address is automated but whose replies should reach a real team.

The Lettr use-case guides go further for mail that invites a response. The order confirmation guide lists sending from a no-reply address as a common mistake and recommends a monitored address like `orders@` or `support@`. The invoice guide recommends a monitored `billing@` address for payment questions, refund requests and disputes, and the welcome email guide advises a real reply-to address because new users often reply with questions.

For replies handled by an application, the Reply Tracking guide recommends variable addressing in the reply-to field on an inbound domain, such as `reply+ticket_123@mail.example.com`. A reply to that address reaches the application as a `relay.relay_delivery` webhook event carrying its subject, text and headers such as In-Reply-To and References. The [Reply Tracking](https://docs.lettr.com/learn/inbound/reply-tracking) page also shows how to detect auto-replies such as out-of-office messages.
