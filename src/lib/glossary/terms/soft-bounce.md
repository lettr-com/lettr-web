---
term: Soft Bounce
heading: "What is a soft bounce?"
description: "A soft bounce is a temporary delivery failure, such as a full mailbox or a busy server. How it differs from a hard bounce and how Lettr retries it."
published: 2026-09-14
updated: 2026-09-15
related: [hard-bounce, bounce, deferral, delivery-delay, exponential-backoff]
reading:
  - title: Bounce Diagnosis
    href: https://docs.lettr.com/knowledge-base/troubleshooting/bounce-diagnosis
  - title: Bounces in Lettr
    href: https://docs.lettr.com/learn/suppressions/bounces
  - title: Webhook Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
---

**A soft bounce** is a temporary delivery failure. The receiving mail server refused the message for a reason that may clear on its own, such as a full mailbox, a server under heavy load or a rate limit on the sender, so the same message can succeed on a later attempt. Sending systems retry soft bounces automatically instead of suppressing the address, and only persistent failures lead to removal.

## What causes a soft bounce

A [bounce](/glossary/bounce/) is any message the receiving side refuses to deliver. **The soft kind is usually signalled with a 4xx SMTP reply**, which RFC 5321 defines as a transient failure. The reply and the enhanced status code point to the cause:

- **Mailbox full:** `452 4.2.2`, a recipient over their storage quota.
- **Server unavailable or rate limiting:** `421 4.7.0`, a receiving server that is overloaded, restarting or throttling the sender's traffic.
- **Mailbox busy:** `450`, a mailbox that exists but is temporarily locked or in use.
- **DNS failure:** a recipient domain whose records could not be looked up at that moment.

Graylisting produces soft bounces on purpose. Some servers reject the first attempt from an unfamiliar sender with a 4xx reply and accept the retry, because legitimate mail servers retry and much spam software does not.

## Soft bounce vs hard bounce

A [hard bounce](/glossary/hard-bounce/) is permanent: the address does not exist or the domain cannot receive mail, and retrying cannot help. **The practical difference is the handling.** A hard bounce stops sending to the address at once, while a soft bounce earns further attempts over a period of hours or days.

The boundary is not fixed. A message that keeps soft bouncing until the sender stops retrying ends as a failure for that message, and an address that soft bounces on send after send is likely an abandoned account, so sending platforms eventually suppress it even though each individual reply was temporary.

Receiving servers also blur the line. Some return a 5xx code for a condition that is really temporary, or a 4xx code for one that is permanent, which is why classification looks at the enhanced status code and the response text as well as the first digit.

## Soft bounce vs deferral

A [deferral](/glossary/deferral/) and a soft bounce start from the same 4xx reply. **Deferral describes the message while it waits in the sender's queue** for another attempt, and the resulting [delay](/glossary/delivery-delay/) is often invisible to the recipient. The message either arrives on a later attempt or, once retries are exhausted, is reported as a bounce.

Retries follow [exponential backoff](/glossary/exponential-backoff/): the wait between attempts grows, so a server that was briefly unavailable gets a quick retry, while one that stays down is not flooded with connections. Throttling by large mailbox providers is the most common source of deferrals, and it usually eases when the sender's volume to that provider comes down.

## Soft bounce in Lettr

**Lettr retries soft bounces automatically with exponential backoff.** Soft bounces do not result in immediate suppression, and an address is suppressed only after repeated failures. The Bounces page lists a full mailbox, a temporarily unavailable server and rate limiting by the recipient server among the common causes.

Each bounce reaches the configured webhook endpoints as a `message.bounce` event, and its `bounce_class` field identifies the category. Class `22` is Mailbox Full, as in a `raw_reason` of `452 4.2.2 Mailbox full`, while class `20` marks a general temporary failure, `21` a DNS lookup that failed temporarily and `70` a transient infrastructure issue, all of which Lettr retries.

A delivery that is postponed but still being retried arrives as a `message.delay` event, with the receiving server's response in `reason` and a `num_retries` count. The Events dashboard shows it with a yellow delayed badge, and the docs note that a delayed email usually resolves on its own and otherwise eventually becomes a bounce event. Analytics counts these messages under the Delayed metric. Microsoft's `421 4.7.0` throttling is one of the temporary responses Lettr retries automatically. The [Bounces page](https://docs.lettr.com/learn/suppressions/bounces) lists every bounce class with its recommended action.
