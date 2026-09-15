---
term: Delay
heading: "What is a delivery delay?"
description: "A delay means an email's delivery was postponed by a temporary refusal and will be retried. What causes delays, when to act, and how Lettr reports delay events."
published: 2026-09-14
updated: 2026-09-15
related: [deferral, soft-bounce, delivery, throttling, webhook]
reading:
  - title: Event Types
    href: https://docs.lettr.com/learn/events/event-types
  - title: Bounce Codes Reference
    href: https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference
  - title: Webhook Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
---

**A delay** is the status of an email whose delivery has been postponed but not abandoned. The receiving server has answered with a temporary 4xx response or has limited how fast it accepts mail, so the message waits in the sending queue for another attempt. A delayed message can still arrive: it counts as a failure only if the later attempts fail too and the sender stops retrying.

## How a delay happens

Every delivery attempt ends in one of three ways. The receiving server accepts the message, refuses it permanently, or refuses it for now. **A temporary refusal, known as a [deferral](/glossary/deferral/), is what produces a delay.** The sending platform records a delay event, keeps the message queued and schedules the next attempt, usually with a longer wait after each failure.

One message can therefore collect several delay events before it reaches a final outcome. Either a later attempt succeeds and the message is delivered, or retries run out and the delay ends as a bounce. Until one of those happens, the delay is an intermediate state, not a result.

## Why delays happen

Most delays come from the receiving side protecting itself. **Large mailbox providers throttle incoming connections**, accepting only so much mail from a sender in a given window and deferring the rest. That kind of [throttling](/glossary/throttling/) is routine and usually resolves on the next attempts.

Volume and reputation cause the rest. Sending too fast from a new domain during warm-up, or jumping from normal volume to a large campaign, invites delays while providers watch how the new mail performs. A provider that is growing cautious about a sender often delays its mail before it starts blocking it. Ordinary problems on the receiving server, such as heavy load or maintenance, produce short delays that clear without any change on the sending side.

## Delay vs soft bounce vs delivery

The three terms mark different points in a message's life. [Delivery](/glossary/delivery/) means the receiving server accepted the message, and nothing more needs to happen on the sending side. A delay means the message has not been accepted yet but is still being retried, so its outcome is open. A [soft bounce](/glossary/soft-bounce/) is recorded as a bounce event with a temporary classification, and it can be promoted to a hard bounce if the cause persists, such as a mailbox that stays full.

**A single delay needs no action.** Patterns are worth investigating. Many delays at one receiving domain suggest that domain is throttling the sender for reputation or volume. Repeated delays for the same recipient across several sends point to a persistent problem on that server. A sudden rise in delays overall is a reason to check for a recent jump in volume or a change in content or recipients.

Time-sensitive mail needs its own handling. A password reset or two-factor code that is delayed may arrive after it is useful, so applications that listen for delivery events over a [webhook](/glossary/webhook/) can let the user request a new code instead of waiting.

## Delay in Lettr

The Events dashboard shows a delay as a yellow delayed badge, the color reserved for temporary issues. Lettr continues retrying automatically, a delayed email usually resolves on its own, and one that does not will eventually become a bounce event. In Message Details, a timeline that shows a delayed event followed by a delivery event means the message hit a temporary problem and was delivered, with no action needed.

For integrations, Lettr sends a `message.delay` webhook event when delivery is temporarily delayed. The payload has `type` set to `delay`, the recipient in `rcpt_to`, the receiving server's response in `reason` and a `num_retries` field. Delayed emails are retried automatically, and the Lettr docs advise acting only when delays persist.

The Analytics dashboard counts these messages in its **Delayed** metric, next to Accepted and Bounces in the delivery metrics, and describes them as emails that were retried automatically and may eventually deliver. The `browse_email_events` tool on the remote MCP server accepts `delay` as an `event_type` filter, so an AI assistant can list delayed messages directly. The [Event Types](https://docs.lettr.com/learn/events/event-types) page in the Lettr docs explains every badge in the Events dashboard.
