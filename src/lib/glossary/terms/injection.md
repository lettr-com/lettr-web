---
term: Injection
question: What is
description: "Injection is when a sending platform accepts an email and queues it for delivery, the first event in its life. How it differs from delivery, and Lettr."
related: [delivery, bounce-rate, webhook, policy-rejection, inbox-placement]
reading:
  - title: Event Types in the Events dashboard
    href: https://docs.lettr.com/learn/events/event-types
  - title: Webhook Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
  - title: Reading the Analytics Dashboard
    href: https://docs.lettr.com/learn/analytics/reading-the-dashboard
---

**Injection** is the step in which a sending platform accepts a message from an application and places it in the queue for delivery. It is the first event in an email's life, recorded before any connection to the recipient's mail server is made. A successful injection means the message passed the platform's checks and entered the sending pipeline, and nothing more: the email has not reached anyone yet.

## How injection works

The word comes from mail transfer agent vocabulary, where a message is injected into the queue by a local program or an API instead of arriving from another server over SMTP. **Email APIs and relay services use the same step.** An application submits the message through an HTTP request or an SMTP session, the platform validates it, and an accepted message receives an identifier and a place in the queue. A request that fails validation is rejected instead and never counts as injected.

Everything after injection happens asynchronously. The API call returns once the message is queued, and delivery attempts, deferrals, bounces and engagement arrive later as separate events. That is why a send request can succeed while the message itself bounces or fails later.

## Injection vs delivery

**Injection is acceptance by the sending platform, and [delivery](/glossary/delivery/) is acceptance by the receiving server.** Between the two, the platform opens an SMTP connection to the recipient's mail server, which can accept the message, defer it for a later retry or refuse it with a bounce.

[Inbox placement](/glossary/inbox-placement/) is a third, later stage. A delivered message can still be filtered to spam, so the three stages answer different questions: whether the platform took the message, whether the recipient's server took it, and where the recipient's mailbox provider put it.

Injections are the usual starting point for sending health metrics. Delivery rate is commonly calculated as deliveries divided by injections, and [bounce rate](/glossary/bounce-rate/) as bounces divided by injections, so a change in either figure reads against the number of messages that actually entered the pipeline.

## Common problems around injection

**A message whose history stops at injection is still queued or stuck.** Normally a later event follows, such as a delivery, a delay or a bounce. When nothing follows, the message may still be in transit, may be held by throttling at the receiving side, or may have hit a processing problem inside the platform.

Counting at the wrong stage causes confusion too. Requests the platform turned away before queuing, such as those that failed validation, never become injections, and a message can still end in a [policy rejection](/glossary/policy-rejection/) instead of a delivery attempt, so the number of API calls an application made and the number of injections can differ. Comparing requested, injected and delivered counts shows where messages dropped out.

Treating the API response as the final outcome is the most common gap. An application that marks an email as sent on a successful response has recorded injection, not delivery, and needs [webhook](/glossary/webhook/) events to learn what happened next.

## Injection in Lettr

**`message.injection` is the first event in any Lettr email's lifecycle**, triggered when Lettr accepts an email and queues it for delivery. A successful send request returns the message "Email queued for delivery." together with a `request_id` that identifies the transmission. In the email history API, the `injection_time` field records when the email was queued for delivery.

In the Events dashboard an injection appears as a gray **Injection** badge. An injection event with nothing after it means the email may still be in transit or may have hit a processing issue downstream, and in the Message Details timeline a history that stops at **Injection** means the email is likely still being processed or has stalled.

The Analytics dashboard groups Targeted, Injected, Rejected, Policy Rejections, Generation Rejections and Generation Failures as injection metrics, where Injected counts emails successfully accepted into the sending pipeline and Rejected counts emails rejected before entering it. Campaign reports show an Injections metric, roughly the total recipient count, and calculate delivery rate as deliveries divided by injections, with 98% or more as the healthy range. The [Event Types](https://docs.lettr.com/learn/events/event-types) page describes every badge in an email's lifecycle.
