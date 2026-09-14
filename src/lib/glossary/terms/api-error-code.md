---
term: API Error Code
question: What is
description: "An API error code is a stable, machine-readable string naming why a request failed. How error codes work with HTTP status codes, and the codes Lettr returns."
related: [api-key, rate-limiting, exponential-backoff, idempotency, sandbox-mode]
reading:
  - title: API Reference Introduction
    href: https://docs.lettr.com/api-reference/introduction
  - title: Errors and Retries
    href: https://docs.lettr.com/learn/sending/errors-retries
  - title: Rate Limits
    href: https://docs.lettr.com/api-reference/rate-limit
---

**An API error code** is a short, machine-readable string in an error response that names the specific reason a request failed, such as `validation_error` or `quota_exceeded`. It sits next to the HTTP status code and a human-readable message. Client code can branch on the error code without parsing the message text, which is written for people and may change wording over time.

## How API error codes work

**The HTTP status code gives the class of failure, and the error code narrows it down.** A `429` status says a request was refused for volume reasons. The error code says which reason: a rate limit clears after a short wait, while an exhausted monthly quota blocks every retry until the plan changes.

Error codes are part of an API's contract. A message such as "The sender domain is not configured" can be reworded in a later release, but a code like `unconfigured_domain` stays fixed so integrations can match on it. Validation failures usually add a field map that pairs each invalid field with its messages, which lets a client show the problem next to the input that caused it.

## Retryable vs non-retryable errors

The most useful thing an error code tells a client is whether **the same request can succeed later**. Throttling and server-side failures are temporary. [Rate limiting](/glossary/rate-limiting/) responses clear after a wait, and upstream or gateway errors often resolve on their own, so these requests are retried with [exponential backoff](/glossary/exponential-backoff/), using the `Retry-After` header as the delay when the response includes one.

Client errors are permanent for the request as sent. A missing field, an invalid [API key](/glossary/api-key/), a missing permission or an unknown resource returns the same result on every attempt, so retrying only adds load. The fix is a change to the request, the key or the account.

Retries of send requests carry one more risk. A request that timed out may still have been processed, and repeating it can deliver the same email twice, which is the problem [idempotency](/glossary/idempotency/) addresses.

## Common problems with API error codes

**Handling errors by status code alone** misses the distinctions the codes exist for. A handler that treats every `429` as a rate limit keeps retrying a request blocked by a quota, and a handler written only for `422` validation failures lets errors that use other status codes fall through to a generic branch.

Logging only the message loses the detail needed later. Logging the error code, the status and the request context together makes failures searchable and lets alerts key on specific codes. Batch endpoints add a second level, since a request can succeed overall while individual rows fail with their own codes.

## API error code in Lettr

Lettr API errors return JSON with a `message` and an `error_code`, and **validation failures add an `errors` object** that maps each field to its messages. The documented codes include:

- **Validation:** `validation_error` (422), with field-specific messages in `errors`.
- **Domain setup:** `unconfigured_domain` and `invalid_domain` (400), both about the sender domain.
- **Templates:** `template_not_found` (404) for a template slug that does not exist.
- **Limits:** `rate_limit_exceeded`, `daily_quota_exceeded` and `quota_exceeded` (429), covering request rate, the free tier's daily quota and the monthly quota.
- **Upstream:** `transmission_failed` (502) when transmission to the upstream provider fails.
- **Permissions:** `insufficient_scope` (403) when the key's permission level does not cover the endpoint.

Domain errors return `400` rather than `422`, so a handler scoped to validation errors misses the most common first-send failure. The errors guide treats `429`, `500` and `502` to `504` as retryable with backoff, and `401`, `403`, `404` and `422` as not retryable. A [sandbox](/glossary/sandbox-mode/) key calling a blocked endpoint receives `sandbox_restricted`, and the bulk contact import reports per-row codes such as `invalid_email` and `unknown_list`.

The Node.js SDK returns errors instead of throwing them, with `error.type` set to `validation`, `api` or `network` and `error.error_code` available for finer handling. The [API Reference introduction](https://docs.lettr.com/api-reference/introduction) lists the codes with their HTTP statuses.
