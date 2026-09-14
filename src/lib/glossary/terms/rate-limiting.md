---
term: Rate Limiting
question: What is
description: "Rate limiting caps how many requests or messages a sender can submit in a time window. How API limits differ from sending quotas and how Lettr enforces both."
related: [throttling, exponential-backoff, api-error-code, batch-sending, idempotency]
reading:
  - title: Rate Limits
    href: https://docs.lettr.com/knowledge-base/troubleshooting/rate-limits
  - title: Rate Limit
    href: https://docs.lettr.com/api-reference/rate-limit
  - title: Email Usage & Quotas
    href: https://docs.lettr.com/learn/sending/usage-quotas
---

**Rate limiting** is a restriction on how many requests or messages a sender can submit within a period of time. Email involves it at two points: an email API caps how fast a client can call it, and receiving mail servers cap how much mail they accept from one sender. Both protect shared infrastructure, and both answer excess traffic with a temporary refusal rather than a permanent failure.

## How rate limiting works

An API counts requests per credential or per account over a time window. Implementations differ: a fixed window resets its counter at set intervals, a sliding window counts the requests of the last N seconds, and a token bucket allows short bursts while holding the average rate steady. **A request over the limit is refused with HTTP `429 Too Many Requests`**, the status defined in RFC 6585. The response may include a `Retry-After` header, defined in RFC 9110, with the number of seconds to wait, and many APIs also report the remaining budget in headers such as `X-RateLimit-Remaining`.

Receiving mail servers apply the same idea to SMTP traffic. Mailbox providers limit connections, messages per connection or messages per hour from one IP address or domain, and answer the excess with a temporary 4xx reply such as `421 4.7.0`. That receiving-side form is usually called [throttling](/glossary/throttling/). The sending server keeps the refused messages in its queue and delivers them later, so a throttled message arrives late instead of bouncing.

## Rate limits vs sending quotas

A rate limit controls speed. **A sending quota controls volume**: how many emails an account may send in a day or a billing month, however slowly it sends them. The two count differently. A single request with 50 recipients is one request for rate limiting and 50 emails for the quota.

They also recover differently. A rate limit clears after a short wait, so the same request succeeds once the window moves on. An exhausted quota keeps refusing every request until the counter resets or the plan changes. Both often return the same `429` status, which is why the [API error code](/glossary/api-error-code/) in the response body matters: a client that retries a quota error with backoff only burns attempts. [Batch sending](/glossary/batch-sending/) reduces the number of requests, but every recipient in a batch still counts toward the quota.

## Best practices for handling rate limits

- **Back off before retrying:** wait the time the response indicates, or use [exponential backoff](/glossary/exponential-backoff/) with random jitter so parallel workers do not retry in lockstep.
- **Never retry immediately:** retried requests count against the same limit, so a tight retry loop keeps the client over it for longer.
- **Pace large sends:** a job queue with a steady delay smooths out bursts that would otherwise hit the limit all at once.
- **Make retries safe:** a request that timed out may have succeeded on the server, and [idempotency](/glossary/idempotency/) keys stop the retry from sending the same email twice.
- **Replace polling with webhooks:** status checks spend request budget that event notifications do not.

## Rate limiting in Lettr

**Lettr treats API rate limits and email quotas as separate systems.** Rate limits control how often the API can be called, while quotas control total sending volume. When a client exceeds the rate limit, the API returns a `429` response with the error code `rate_limit_exceeded`. Quota errors use the same status with their own codes: `daily_quota_exceeded` for the free tier's daily quota and `quota_exceeded` for the monthly quota.

Quota counters count recipients, not requests, and every address in `to`, `cc` and `bcc` counts. Enforcement is all-or-nothing: a request that would push the account past its limit is rejected in full rather than partially delivered. Each API request accepts up to 50 recipients across the three fields. Authentication failures have their own limit of 5 failures in 5 minutes, after which requests are blocked for 15 minutes. Sandbox API keys are stricter still, with 10 requests per minute and 100 per day.

The docs recommend exponential backoff for `429` responses, falling back to a `2^attempt` delay when no wait time is given, and warn that continuing to send after a `429` may extend the cooldown. The [Rate Limit](https://docs.lettr.com/api-reference/rate-limit) reference in the Lettr docs lists the error codes and the quota headers.
