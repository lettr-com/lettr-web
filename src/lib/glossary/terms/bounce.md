---
term: Bounce
heading: "What is a bounce?"
description: "A bounce is an email that could not be delivered and was reported back to the sender. How bounces happen, how to read them and how Lettr classifies them."
published: 2026-09-14
updated: 2026-09-15
related: [hard-bounce, soft-bounce, bounce-rate, out-of-band-bounce, suppression-list]
reading:
  - title: Bounce Codes Reference
    href: https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference
  - title: Bounce Diagnosis
    href: https://docs.lettr.com/knowledge-base/troubleshooting/bounce-diagnosis
  - title: Bounces in Lettr
    href: https://docs.lettr.com/learn/suppressions/bounces
---

**A bounce** is an email that could not be delivered to its recipient and was reported back as a failure. The report comes either from the receiving mail server or from the sending server after it gives up, and it carries an SMTP reply code plus a text reason. Bounces fall into two kinds, permanent and temporary, and the kind decides what happens to the address next.

## How a bounce happens

Most bounces happen during the delivery attempt itself. **The receiving server answers the SMTP conversation with an error reply**, often to the `RCPT TO` command when the mailbox does not exist, and the sending server records the failure straight away.

Some arrive later. A receiving server can accept a message with a `250` reply, then discover it cannot deliver it, for example because a forwarding address is dead. It then mails a separate delivery status notification to the message's Return-Path address. These are [out-of-band bounces](/glossary/out-of-band-bounce/), and they mean the same thing as an immediate rejection. A third case is the sending server itself: when a temporary failure keeps repeating, it eventually stops retrying and records a bounce.

## How to read a bounce

The reply code carries the meaning. **The first digit separates temporary from permanent**: a 4xx code means try again later, and a 5xx code means the server will not accept the message. An enhanced status code follows in the form `class.subject.detail`, so `5.1.1` reads as a permanent failure (`5`) in addressing (`1`) with detail `1`, a mailbox that does not exist. The text after the codes is written by the receiving server and varies by provider, which is why the full response is worth keeping alongside the code.

That split maps onto the two types. A [hard bounce](/glossary/hard-bounce/) is permanent, such as `550 5.1.1` for an unknown user or `550 5.1.2` for a domain that does not exist, and the address is suppressed after the first one. A [soft bounce](/glossary/soft-bounce/) is temporary, such as `452 4.2.2` for a full mailbox or `421 4.7.0` for a busy server, and it is retried with exponential backoff before anything else happens.

## Bounce vs deferral

Not every delivery problem is a bounce. A [deferral](/glossary/deferral/) is a delay: the receiving server asked for the message to be tried again later, and the sending server is still retrying. It becomes a bounce only if the retries run out. Mail filtered to the spam folder is not a bounce either, because the server accepted it and no failure is reported. Automatic replies such as vacation messages reach the Return-Path address too, but they are not delivery failures.

## Why bounces matter

**Mailbox providers read bounces as a signal of list quality.** A sender whose mail keeps bouncing off addresses that do not exist looks like one mailing an old or badly collected list, and the [bounce rate](/glossary/bounce-rate/) is the number that captures it. A rate below 2% is healthy, and a rate consistently above 5% can get mail blocked or filtered to spam.

The reason matters as much as the count. A bounce for an unknown user points at the list, while a rejection for policy, content or a blocked sending IP points at the sending side, and removing the address does nothing to fix it.

## Bounce in Lettr

Lettr **adds hard-bounced addresses to the [suppression list](/glossary/suppression-list/) automatically** and retries soft bounces with exponential backoff. Each bounce carries a numeric `bounce_class`: `10`, `30` and `100` are the hard classes that trigger suppression, classes such as `20`, `21` and `22` cover temporary failures like DNS problems and full mailboxes, `50` to `52` are mail blocks that call for investigation, and `60` marks an automatic reply that needs no action.

Bounces reach configured webhook endpoints in real time as `message.bounce` events, with `bounce_class`, `error_code` and `raw_reason` holding the receiving server's full response. Out-of-band bounces arrive as `message.out_of_band` events, and delays are reported separately as `message.delay`.

In the Events dashboard a bounce shows as a red bounced badge, or a bounced (OOB) badge for an out-of-band bounce, and its Message Details view shows the recipient domain and mailbox provider. The Analytics dashboard counts hard and soft bounces together in its **Bounces** metric and reports **Block Bounces** separately. The [Bounces page](https://docs.lettr.com/learn/suppressions/bounces) lists every bounce class with its recommended action.
