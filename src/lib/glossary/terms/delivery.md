---
term: Delivery
question: What is
description: "Delivery means a receiving mail server accepted an email, which is not the same as reaching the inbox. How delivery works and how Lettr reports delivery events."
related: [deliverability, delivery-delay, bounce, smtp, inbox-placement]
reading:
  - title: How Email Delivery Works
    href: https://docs.lettr.com/knowledge-base/fundamentals/how-email-delivery-works
  - title: Event Types
    href: https://docs.lettr.com/learn/events/event-types
  - title: Webhook Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
---

**Delivery** is the point at which a receiving mail server accepts an email. The server answers the message transfer with a success reply, normally `250`, and takes over responsibility for the message from the sending server. Delivery says nothing about where the message goes next: an accepted email can land in the inbox, the spam folder, a promotions tab or a quarantine queue.

## How delivery works

Before anything reaches a recipient, the sending server has to find the right destination. **It looks up the MX records of the recipient's domain**, which list the mail servers that accept email for that domain and their priority order. If the domain has no MX records, delivery cannot proceed.

The sending server then opens an [SMTP](/glossary/smtp/) connection to the highest-priority server, the two servers negotiate TLS encryption when it is available, and the sender transmits the envelope and the message. The receiving server checks SPF, DKIM and DMARC and scans the content before answering with one of three outcomes:

- **Accepted:** a `2xx` reply, usually `250`, and the message is delivered.
- **Temporarily refused:** a `4xx` reply, which puts the message back in the queue for another attempt, reported as a [delay](/glossary/delivery-delay/).
- **Permanently refused:** a `5xx` reply, which ends the attempt as a [bounce](/glossary/bounce/).

A `251` reply is a success variant meaning the user is not local and the server will forward the message. Acceptance is not always final either. A server can accept a message and only later find it cannot deliver it, for example because a forwarding address is dead, and then send a separate bounce notification known as an out-of-band bounce.

## Delivery vs deliverability

The two words are easy to confuse. Delivery is a technical outcome: the server took the message. **[Deliverability](/glossary/deliverability/) is a quality outcome**: the message reached the inbox. A 100% delivery rate does not mean a 100% inbox placement rate, because the placement decision happens after acceptance and is invisible to the sender.

Mailbox providers often accept mail they consider suspicious and file it in spam instead of rejecting it. That filtering produces no error and no bounce, so the sending side sees a normal delivery. Knowing where accepted mail was placed takes other signals, such as engagement rates or [inbox placement](/glossary/inbox-placement/) tests with seed accounts.

## Why delivery rate still matters

Delivery rate, the share of sent messages the receiving servers accepted, is the first number to check even though it is not the last. **A falling delivery rate points to a problem that stops mail before filtering even starts**, such as addresses that no longer exist, a domain with broken authentication or a sending IP on a blocklist.

The reasons behind failed deliveries separate those cases. Bounces for unknown users point at list quality, while rejections for policy or blocked IP addresses point at the sender's reputation or configuration. Temporary refusals sit in between: they do not count against delivery while retries continue, but a steady rise in them often shows a provider becoming cautious before it starts rejecting mail.

## Delivery in Lettr

Lettr tracks each message from the moment it enters the pipeline. **The Injection event marks the email as accepted by Lettr and queued**, and the Delivery event follows when the recipient's mail server accepts it, shown in the Events dashboard as a green badge. For integrations, the matching webhook is `message.delivery`, triggered when an email is successfully delivered to the recipient's mail server. The Lettr docs note that a delivery event does not guarantee the email reached the inbox, because it could still be filtered to spam or quarantined.

A timeline in Message Details that stops at Injection with nothing after it means the message is still being processed or has stalled. Message Details also shows the Mailbox Provider, the Routing Domain the message was delivered to and the Sending IP that Lettr delivered it from.

In the Analytics dashboard, the **Accepted** metric counts emails successfully delivered to the recipient's mail server and is described as the primary success metric, with Delivered the same as Accepted in most cases. The [How Email Delivery Works](https://docs.lettr.com/knowledge-base/fundamentals/how-email-delivery-works) page in the Lettr docs walks through each stage from API request to inbox.
