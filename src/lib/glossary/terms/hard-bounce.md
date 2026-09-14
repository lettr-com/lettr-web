---
term: Hard Bounce
question: What is
description: "A hard bounce is a permanent delivery failure, such as an address that does not exist. How it differs from a soft bounce and how Lettr suppresses it."
related: [soft-bounce, bounce, suppression-list, bounce-rate]
reading:
  - title: Bounce Diagnosis
    href: https://docs.lettr.com/knowledge-base/troubleshooting/bounce-diagnosis
  - title: Bounces in Lettr
    href: https://docs.lettr.com/learn/suppressions/bounces
  - title: Bounce Codes Reference
    href: https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference
---

**A hard bounce** is a permanent delivery failure. The receiving mail server has rejected the message for a reason that will not change, such as an address that does not exist, so retrying the same address cannot succeed. The standard response is to stop sending to that address after the first hard bounce, which is why sending platforms suppress it automatically.

## What causes a hard bounce

A [bounce](/glossary/bounce/) is any message the receiving side refuses to deliver. **A hard bounce is the permanent kind**, and the receiving server usually signals it with a 5xx SMTP reply during the delivery attempt. The enhanced status code after the reply code narrows down the cause:

- **Address does not exist:** `550 5.1.1`, reported as "user unknown", typically a typo at signup or a deleted account.
- **Domain does not exist:** `550 5.1.2`, a domain that does not resolve or has no MX records.
- **Mailbox disabled:** `550 5.2.1`, an account the mailbox provider has deactivated.
- **Invalid address syntax:** `553 5.1.3`, an address that is malformed.

A receiving server can also refuse mail because the recipient or the server has blocked the sender. That rejection is permanent for the address, but a block tied to reputation or authentication points to a problem on the sending side and deserves investigation.

Some hard bounces arrive late. The receiving server accepts the message at first, then determines it cannot be delivered and sends a separate bounce notification. These out-of-band bounces mean the same thing as an immediate rejection and get the same handling.

## Hard bounce vs soft bounce

A [soft bounce](/glossary/soft-bounce/) is a temporary failure. **A 4xx reply code is the usual marker**: `452 4.2.2` for a full mailbox, or `421 4.7.0` for a server that is temporarily unavailable or rate limiting the sender. The cause may clear on its own, so soft bounces are retried automatically with exponential backoff instead of being suppressed.

The line between the two is not fixed. A mailbox that stays full across repeated attempts may be reclassified as a hard bounce, and an address that soft bounces again and again over time may eventually be suppressed as well. The practical difference lies in the handling: a hard bounce stops sending at once, while a soft bounce earns more attempts first.

## Why hard bounces matter

**Mailbox providers read hard bounces as a signal of list quality.** A sender that keeps mailing addresses that do not exist looks like one working from an old or poorly maintained list, and that pattern damages [sender reputation](/glossary/sender-reputation/). Lower reputation means more mail filtered to spam or blocked outright, including mail to valid recipients.

[Bounce rate](/glossary/bounce-rate/) is the number that captures this. A rate below 2% is healthy, and a rate consistently above 5% can get mail blocked or filtered to spam. [List hygiene](/glossary/list-hygiene/) keeps it down: double opt-in confirms an address is real before it joins a list, and removing subscribers who have not engaged in 6 to 12 months clears out addresses likely to go dead.

## Hard bounce in Lettr

Lettr classifies bounces as hard or soft and **adds hard-bounced addresses to the [suppression list](/glossary/suppression-list/) automatically**, so later sends skip them. Soft bounces are retried with exponential backoff, and addresses that keep soft bouncing may eventually be suppressed too.

Each bounce reaches the configured webhook endpoints in real time as a `message.bounce` event. The `bounce_class` field carries the classification: hard bounces use classes 10 (invalid recipient), 30 (generic bounce with no valid recipient) and 100 (relay denied). The event also includes `error_code` and `raw_reason` with the receiving server's response, for example `550 5.1.1 The email account that you tried to reach does not exist`. Out-of-band bounces arrive as separate `message.out_of_band` events.

In the Events dashboard a bounce shows as a red bounced badge, and the Message Details view shows the recipient domain and mailbox provider. The [Bounces page](https://docs.lettr.com/learn/suppressions/bounces) in the Lettr docs lists every bounce class and its recommended action.
