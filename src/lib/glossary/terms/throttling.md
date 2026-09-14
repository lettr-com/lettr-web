---
term: Throttling
question: What is
description: "Throttling is a mailbox provider limiting how fast it accepts mail from a sender and deferring the rest with 4xx replies. Causes, handling and Lettr."
related: [deferral, rate-limiting, warm-up, exponential-backoff, graylisting]
reading:
  - title: Bounce Codes Reference
    href: https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference
  - title: Batch and Bulk Sending
    href: https://docs.lettr.com/knowledge-base/best-practices/batch-bulk-sending
  - title: Outlook / Microsoft 365 Delivery Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery
---

**Throttling** is a receiving mail server's practice of limiting how quickly it accepts email from one sender. Mail over the limit is not rejected for good: the server answers with a temporary 4xx reply, and the sending server holds the message and tries again later. Mailbox providers throttle to protect their own infrastructure and to slow down senders they do not yet trust, so throttled mail arrives late instead of bouncing.

## How throttling works

A receiving server counts traffic per sender, usually by connecting IP address, by sending domain or by both. **Limits can apply to several things at once**: simultaneous connections, messages per connection, recipients per message and messages per hour. A sender that crosses one of them gets a temporary reply such as `421 4.7.0` or a `451` code, sometimes when the connection opens and sometimes after a `RCPT TO` command.

Each refusal is a [deferral](/glossary/deferral/). The sending server keeps the message in its queue and schedules another attempt, normally with [exponential backoff](/glossary/exponential-backoff/) so that retries spread out instead of arriving in a burst. Once the provider's window resets or the sender's pace drops, the queued mail goes through.

Providers do not publish their limits, and the limits are not fixed. They are adjusted per sender based on reputation and recent behaviour, so two senders with the same volume can meet very different limits at the same provider.

## Why throttling happens

**Volume that departs from a sender's history is the most common trigger.** A domain or IP address that normally sends a few messages an hour and then sends a large campaign resembles a compromised account or a spam run. New domains and IP addresses have no history at all, which is why a [warm-up](/glossary/warm-up/) raises volume gradually.

Reputation is the second trigger. Rising complaint rates, bounces from addresses that do not exist and low engagement all lead providers to accept mail more slowly while they judge the sender. Throttling of this kind often comes before outright blocking, so persistent deferrals at one provider are an early warning worth acting on.

## Throttling vs rate limiting and graylisting

The terms overlap. [Rate limiting](/glossary/rate-limiting/) is the general idea of capping requests in a time window, and in email it most often refers to the limits an email API puts on its clients. **Throttling is the receiving-side form**, applied by mailbox providers to SMTP traffic from sending servers.

[Graylisting](/glossary/graylisting/) produces the same 4xx replies for a different reason. It defers the first attempt from an unfamiliar sender on purpose and accepts the retry, whatever the volume. Throttling responds to how much a sender sends and how the provider regards that sender, so it keeps deferring until the pace or the reputation changes.

## Best practices for handling throttling

- **Retry, never resend:** a deferred message is still queued, and sending it again from the application creates a duplicate.
- **Spread large sends:** pacing a campaign over hours keeps the volume at any one provider close to its usual level.
- **Group recipients by domain:** per-provider batches show which provider is deferring and let the rest of the send continue normally.
- **Read the reply text:** providers often explain the reason after the code, which separates a plain volume limit from a reputation problem.

## Throttling in Lettr

**Lettr retries throttled deliveries automatically**, so a deferred message needs no resend from the application. Microsoft's `421 4.7.0` response, which reports an unusual rate of unsolicited mail and temporarily defers messages from the sending IP, is retried by Lettr, and the docs suggest reducing volume to Microsoft domains and checking SNDS if the issue persists. Gmail throttles senders who exceed its internal rate limits or whose reputation dips, with replies such as `421-4.7.28`, and the docs describe these as temporary blocks that resolve on their own but signal a problem.

While Lettr keeps retrying, it sends a `message.delay` webhook event, and the Events dashboard shows the message with a yellow delayed badge. The docs note that delays are common with large mail providers that throttle incoming connections, that a delayed email usually resolves on its own and that one that does not eventually becomes a bounce event.

The Batch and Bulk Sending guide suggests grouping large sends by recipient domain, so that deliverability can be monitored per provider and a provider that starts throttling is noticed early. In Analytics, breaking metrics down by Recipient Domain or Mailbox Provider shows whether problems concentrate at one provider. The [Bounce Codes Reference](https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference) lists the temporary codes Lettr retries and the providers that use them.
