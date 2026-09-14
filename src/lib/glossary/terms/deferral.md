---
term: Deferral
question: What is
description: "A deferral is a temporary 4xx refusal that makes the sending server retry an email later. What causes deferrals, how they differ from soft bounces, and Lettr."
related: [soft-bounce, delivery-delay, throttling, graylisting, exponential-backoff]
reading:
  - title: How Email Delivery Works
    href: https://docs.lettr.com/knowledge-base/fundamentals/how-email-delivery-works
  - title: Bounce Codes Reference
    href: https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference
  - title: Webhook Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
---

**A deferral** is a temporary refusal from a receiving mail server. Instead of accepting a message, the server answers with a 4xx SMTP reply that means it cannot take the message right now, and the sending server keeps the message in its queue and tries again later. Most deferrals clear on a later attempt, and a deferred message becomes a bounce only when the sending server stops retrying.

## How a deferral works

A receiving server can defer at several points in the SMTP conversation: when the connection opens, after the `RCPT TO` command names a recipient, or after the message data is sent. **The first digit of the reply code marks the response as temporary**, and an enhanced status code starting with `4` confirms it. Common examples:

- `421 4.7.0` for a server that is temporarily unavailable or rate limiting the sender
- `450 4.2.1` for a mailbox that is temporarily unavailable or locked
- `451 4.3.0` for a configuration problem on the receiving side
- `452 4.2.2` for a mailbox that is full or over quota

Large mailbox providers add their own wording. Gmail uses `421 4.7.28` when it rate limits a sender, and Microsoft answers `451 4.7.500 Server busy. Please try again later`.

After a deferral the message stays queued and the sending server schedules another attempt. The wait between attempts usually grows each time, a pattern called [exponential backoff](/glossary/exponential-backoff/), which gives a busy receiver room to recover instead of hitting it again straight away.

## Common causes of deferrals

**Rate limits are the most frequent cause.** Receiving servers cap how many connections or messages they accept from one sender in a period, and mail over that cap is deferred instead of rejected. This [throttling](/glossary/throttling/) is routine at large providers and tightens for senders the provider does not yet trust.

Reputation drives many of the rest. New domains and IP addresses in warm-up see deferrals as providers watch how their mail performs, and a growing number of deferrals at one provider is often the first sign that it is losing trust in a sender. Pushing on at the same volume can escalate deferrals into blocks.

Some deferrals are deliberate filtering. [Graylisting](/glossary/graylisting/) defers the first attempt from an unfamiliar sender on purpose and accepts the retry, on the basis that many spam tools never retry. The remaining cases are ordinary problems on the receiving side: an overloaded server, a locked mailbox or one that is out of space.

## Deferral vs soft bounce

Both describe a temporary failure with a 4xx reply, and the terms are often used interchangeably. The difference lies in how the event is reported. A deferral describes the state of a message still in the retry queue, with its outcome open. A [soft bounce](/glossary/soft-bounce/) is recorded as a bounce event with a temporary classification, and a mailbox that stays full across repeated attempts may be reclassified as a hard bounce.

The practical rule follows from that. **Individual deferrals need no action** while the sending server keeps retrying. Patterns do: many deferrals at the same receiving domain point to throttling for reputation or volume, and repeated deferrals for one recipient across several sends point to a persistent problem on that server. A [delay](/glossary/delivery-delay/) that never resolves ends as a bounce.

## Deferral in Lettr

Lettr reports deferrals as `message.delay` webhook events. The event fires when delivery is temporarily delayed, and **Lettr continues retrying delivery automatically**, so a delayed message needs no manual resend. The payload's `reason` field carries the receiving server's response, such as `421 Server temporarily unavailable`, next to `rcpt_to` and a `num_retries` field.

The Bounce Codes Reference lists the deferral codes Lettr retries on its own, including Gmail's `421 4.7.28` rate limit and Microsoft's `451 4.7.500` busy response. Action is needed only when delays persist, which may indicate a delivery issue. In Analytics, breaking the metrics down by Recipient Domain or Mailbox Provider shows whether the delays concentrate at one provider. A deferral that never clears eventually appears as a bounce event instead. The [Bounce Codes Reference](https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference) in the Lettr docs lists temporary and permanent codes with the recommended action for each.
