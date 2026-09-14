---
term: Batch Sending
description: "Batch sending delivers one email to many recipients through a single API request. How batches work, where they go wrong and Lettr's 50-recipient limit."
related: [bulk-sender, substitution-data, rate-limiting, idempotency, merge-tag]
reading:
  - title: Batch Sending
    href: https://docs.lettr.com/learn/sending/batch-sending
  - title: Recipients
    href: https://docs.lettr.com/learn/sending/recipients
  - title: Email Usage & Quotas
    href: https://docs.lettr.com/learn/sending/usage-quotas
---

**Batch sending** is sending one email to many recipients through a single API request instead of making a separate request for each recipient. The request carries a list of addresses and the shared content, and the sending platform expands it into an individual message per recipient. Fewer requests mean less HTTP overhead, simpler sending code and higher throughput for applications that send the same email to many people.

## How batch sending works

A batch request looks like an ordinary send with a longer recipient list: one sender, one subject, one body or template, and an array of addresses. **The platform validates the whole request, then creates one message per recipient**, and from that point each copy is delivered, tracked and bounced on its own.

Personalization in a batch works through [substitution data](/glossary/substitution-data/). Values supplied with the request fill the [merge tags](/glossary/merge-tag/) in the content, so a shared variable such as a month or a campaign name needs no extra requests.

Every sending API caps how many recipients one request may hold. A list larger than the cap is split into chunks, and the chunks go out one after another or several at a time in parallel. The response to each request confirms how many recipients were taken, while delivery results arrive later as per-recipient events, usually through webhooks, since polling the status of every message in a large send is impractical.

## Batch sending vs bulk sending

Batching and bulk sending describe separate properties of a send. **Batching is about request structure**: how many recipients go into one API call. Bulk is about volume: a [bulk sender](/glossary/bulk-sender/) is defined by how much mail it sends per day, and Google and Yahoo apply extra requirements above that threshold.

A high-volume sender almost always batches, but batching does not change how mailbox providers count. Each copy is one message for reputation, complaint rates and sending quotas, whether it left in a batch of fifty or on its own.

## Common problems with batch sending

**Exceeding the per-request cap** is the most common error. Recipients in CC and BCC fields often count toward the same cap as the To field, so a request can pass a client-side check on `to` alone and still be rejected.

Batching reduces the number of requests, but parallel batches can still hit [rate limiting](/glossary/rate-limiting/). A `429` response needs a pause and a retry with backoff, not a resend of the whole list.

A batch can partially succeed, with some recipients accepted and others rejected. Logging the rejected addresses keeps them from silently dropping out of a send.

Retries carry a duplicate risk. A batch request that timed out may already have been accepted, and repeating it sends every recipient the email twice. [Idempotency](/glossary/idempotency/) keys, or recording which chunks succeeded before retrying, prevent that.

## Batch sending in Lettr

Lettr accepts **up to 50 recipients per API request, counted across `to`, `cc` and `bcc` combined**. A request with more than 50 addresses across the three fields is rejected with a `422` before anything is sent, so larger lists are split into batches of 50 or fewer and sent sequentially or in parallel. Lettr delivers a separate copy of the email to each recipient.

The `substitution_data` field supplies merge tag values that apply to every recipient in the batch. The response includes a `request_id` along with `accepted` and `rejected` counts, and the Batch Sending page recommends checking both counts and logging rejected addresses rather than dropping them.

Rate limits and quotas count a batch differently. A request with 50 recipients is one API request for rate limiting but 50 emails against the monthly quota, and every address in `to`, `cc` and `bcc` counts. Quota is enforced all-or-nothing: a request that would exceed the remaining allowance is rejected in full rather than delivered to the first few recipients.

For tracking, a `metadata` object such as a `batch_id` travels into webhook payloads, so `message.delivery`, `message.bounce` and `engagement.open` events can be tied back to the batch they came from. The SMTP relay does not keep BCC recipients private, and the SMTP docs recommend the HTTP API for sending the same content to many people. The [Batch Sending page](https://docs.lettr.com/learn/sending/batch-sending) has chunking examples in JavaScript.
