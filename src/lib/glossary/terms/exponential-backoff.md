---
term: Exponential Backoff
question: What is
description: "Exponential backoff is a retry strategy where each wait is longer than the last. How it works for SMTP, webhooks and API calls, and where Lettr applies it."
related: [webhook, soft-bounce, deferral, rate-limiting, idempotency]
reading:
  - title: Webhook Delivery Failures
    href: https://docs.lettr.com/knowledge-base/troubleshooting/webhook-failures
  - title: Errors and Retries
    href: https://docs.lettr.com/learn/sending/errors-retries
  - title: Rate Limit
    href: https://docs.lettr.com/api-reference/rate-limit
---

**Exponential backoff** is a retry strategy in which the wait before each new attempt grows by a constant factor, so retries start quickly and then spread further apart. A client that retries after 1 second, then 2, 4 and 8 seconds is backing off exponentially. The approach gives a struggling server room to recover instead of hitting it with a steady stream of repeats, and it is the standard way email systems retry temporary failures in SMTP delivery, webhook delivery and API calls.

## How exponential backoff works

The delay follows a simple formula: a base delay multiplied by a factor raised to the attempt number. **With a base of 1 second and a factor of 2**, the waits run 1, 2, 4, 8 and 16 seconds, and five retries cover about half a minute. Longer-running systems use larger steps, such as minutes growing into hours, so a single message or event can keep retrying through an outage of several hours without generating much traffic.

**Two refinements appear in almost every real implementation.** A cap sets a maximum delay, so the wait stops growing once it reaches a sensible ceiling. Jitter adds a random amount to each delay, which keeps many clients that failed at the same moment from retrying at the same moment too. A retry limit or a total time window finally ends the sequence, and the failure is recorded as permanent.

Mail servers apply the same idea to delivery. When a receiving server answers with a temporary 4xx reply, such as `421 4.7.0` for rate limiting or `452 4.2.2` for a full mailbox, the sending server queues the message as a [deferral](/glossary/deferral/) and tries again later with growing intervals. Only when the retry window runs out does the message become a bounce.

## Why exponential backoff matters

**Fixed-interval retries make an overload worse.** A server that is rejecting requests because it is busy receives the same volume again a few seconds later, and every client doing the same thing multiplies the load. Growing delays drop the retry traffic quickly, which is often what lets the server recover.

Receiving mail servers expect this behaviour. A sender that retries deferred mail too aggressively looks like a spammer to a mailbox provider applying [rate limiting](/glossary/rate-limiting/), and the provider may extend the deferral or block the sender. Backing off respects the limit the receiver signalled.

For the sender, backoff turns transient failures into eventual success without manual work. A short network problem, a deploy on the receiving side or a brief rate limit resolves within the first few retries, and later, longer retries cover a real outage.

## Best practices for exponential backoff

**Retry only failures that can succeed later.** A rate limit, a server error or a timeout is worth retrying. A validation error, an invalid API key or a missing resource returns the same result every time, and retrying it wastes attempts and delays the real fix.

A server-provided wait always beats a computed one. When a response carries a `Retry-After` header, the client should wait at least that long, and fall back to its own backoff only when the header is absent.

Retries also create duplicates. A request that succeeded but whose response was lost gets sent again, so the receiving side has to be safe to call twice. [Idempotency](/glossary/idempotency/) handling, such as recording that an email was already sent for an order or skipping an event that was already processed, turns a retry into a harmless no-op.

## Exponential backoff in Lettr

**Lettr retries failed webhook deliveries with exponential backoff.** A [webhook](/glossary/webhook/) delivery counts as successful only when the endpoint returns a 2xx status within 30 seconds, and 5xx responses, connection timeouts, DNS failures and TLS errors are all retried. Because an event can be delivered more than once, the docs recommend acknowledging with 200 immediately, processing asynchronously and handling duplicates idempotently.

On the delivery side, Lettr retries each [soft bounce](/glossary/soft-bounce/) automatically with exponential backoff, so temporary rejections such as a full mailbox need no resend from the application. A temporarily delayed delivery reaches webhook endpoints as a `message.delay` event while Lettr keeps retrying.

For API clients, the Lettr docs recommend exponential backoff on a `429` response, using the `Retry-After` header when present and a `2^attempt` delay otherwise. The Errors and Retries page marks `429`, `500` and `502`, `503` and `504` gateway errors as retryable, and `401`, `403`, `404` and `422` as errors that should be fixed rather than retried. The [Rate Limits](https://docs.lettr.com/api-reference/rate-limit) page includes a backoff example.
