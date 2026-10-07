---
term: Idempotency
heading: "What is idempotency?"
description: "Idempotency means repeating a request has the same effect as sending it once. How idempotency keys stop duplicate emails, and Lettr's Idempotency-Key header."
published: 2026-09-14
updated: 2026-09-14
related: [api-error-code, webhook, exponential-backoff, spam-complaint]
reading:
  - title: Idempotency
    href: https://docs.lettr.com/learn/sending/idempotency
  - title: SMTP vs API
    href: https://docs.lettr.com/knowledge-base/best-practices/smtp-vs-api
  - title: Webhook Retries
    href: https://docs.lettr.com/learn/webhooks/retries
---

**Idempotency** is the property of an operation that produces the same result whether it runs once or several times. For an email API it means that a send request retried after a timeout or a network error results in one email, not two. Retries are unavoidable in networked systems, and idempotency is what makes them safe for operations with side effects, such as putting a message in someone's inbox.

## How idempotency works

Some operations are idempotent by nature. **Reading a resource, or setting it to a fixed state, gives the same outcome on every repeat**, which is why HTTP defines GET, PUT and DELETE as idempotent methods. Creating something with POST, such as sending an email, is not: each identical request normally creates a new message.

An idempotency key makes a request of that kind safe to repeat. The client generates a unique key for one logical operation, such as the confirmation email for one order, and sends it with the request, usually in an `Idempotency-Key` HTTP header. The server stores the key together with the outcome of the first request. A later request that carries a key the server has already seen gets the stored result back instead of triggering the operation again.

Two edge cases need defined behaviour. A request that reuses a key with a different payload is almost always a bug, so servers reject it instead of guessing which version was meant. A request that arrives while the first one with the same key is still running has no stored result to return yet, so the server tells the client to retry shortly.

## Why idempotency matters for email

**A timeout does not mean the request failed.** The connection can drop after the server has accepted the email but before the response reaches the client. On the client's side a lost response and a failed request look identical, and a plain retry after a lost response sends a duplicate.

Duplicates cost more in email than in many other systems, because a sent message cannot be recalled. A second password reset or order confirmation confuses recipients, and repeated marketing messages invite unsubscribes and [spam complaints](/glossary/spam-complaint/). Idempotency lets a client pair automatic retries and [exponential backoff](/glossary/exponential-backoff/) with one email per logical send.

## Common problems with idempotency

**A key has to identify the operation, not the attempt.** A key generated fresh for each retry, for example from a random value or the current time, defeats the purpose, because every attempt looks new to the server. Keys built from the business event, such as `order-confirmation-1234` or `password-reset-{user_id}-{token}`, stay the same across retries and cannot collide with a different kind of email.

Idempotency at the API does not cover every duplicate. Two workers that pick up the same job can both reach the send step, so a database flag or a distributed lock around the send is still needed in systems with concurrent workers. A network timeout also leaves the outcome unknown until the client checks its own records or retries with the same key.

The receiving side needs the same care. [Webhooks](/glossary/webhook/) are retried when a delivery is not acknowledged, so a handler can receive the same event more than once and has to deduplicate it before acting on it.

## Idempotency in Lettr

**The Lettr send endpoint accepts an `Idempotency-Key` header**, which prevents duplicate emails when a request is retried after a network error. Idempotency keys are available through the REST API and not through SMTP. A key must be 1 to 255 characters long and use only letters, digits, periods, hyphens or the `_` character, and any other value returns a validation error.

Reusing a key with a different request payload returns HTTP `409` with the [API error code](/glossary/api-error-code/) `idempotency_key_conflict`. A request whose key is still being processed returns `409` with `idempotency_in_progress` and a `Retry-After: 1` header, and the message asks the client to retry with the same key. A response replayed for a repeated key carries the `Idempotency-Replayed: true` header.

Every successful send also returns a `request_id` that identifies the transmission and can be stored with the business record. The [Idempotency page](https://docs.lettr.com/learn/sending/idempotency) in the Lettr docs adds application-level patterns: checking a database flag before sending, carrying an idempotency key in `metadata`, and a shared cache or database lock for distributed workers. For webhooks, the docs recommend using the event `id` to detect and skip duplicate deliveries, because retries can deliver the same event more than once.
