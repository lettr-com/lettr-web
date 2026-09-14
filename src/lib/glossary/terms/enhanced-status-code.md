---
term: Enhanced Status Code
question: What is
description: "An enhanced status code like 5.1.1 adds detail to an SMTP reply code. How the class.subject.detail format reads and where Lettr shows it in bounce events."
related: [bounce, hard-bounce, soft-bounce, dsn, esmtp]
reading:
  - title: Bounce Codes Reference
    href: https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference
  - title: Bounces in Lettr
    href: https://docs.lettr.com/learn/suppressions/bounces
  - title: Bounce Diagnosis
    href: https://docs.lettr.com/knowledge-base/troubleshooting/bounce-diagnosis
---

**An enhanced status code** is a three-part code such as `5.1.1` that a mail server adds to its SMTP reply to say more precisely what happened. The basic three-digit reply code, such as `550`, only separates success from temporary and permanent failure. The enhanced code, defined in RFC 3463, also names the part of the system involved and the specific condition, which makes delivery failures far easier to diagnose.

## How enhanced status codes work

The format is `class.subject.detail`. **The class matches the first digit of the reply code**: `2` for success, `4` for a temporary failure and `5` for a permanent failure. The subject names the area the status relates to, and the detail narrows it down to a specific condition within that area. The subject values are defined in the standard:

- **0, other or undefined:** a status that fits no other category.
- **1, addressing:** a problem with the recipient or sender address.
- **2, mailbox:** the destination mailbox is full, disabled or unavailable.
- **3, mail system:** a problem with the destination mail system.
- **4, network and routing:** DNS, routing or connection trouble.
- **5, protocol:** a failure in the SMTP transaction itself.
- **6, content or media:** the message content or encoding caused the rejection.
- **7, security or policy:** authentication, encryption, blocklisting or another policy decision.

So `5.1.1` reads as a permanent failure (`5`) in addressing (`1`) with detail `1`, a mailbox that does not exist. `452 4.2.2` is a temporary mailbox problem, a full mailbox, and `421 4.7.0` is a temporary security or policy condition such as rate limiting.

A server that supports these codes advertises the `ENHANCEDSTATUSCODES` extension in its reply to EHLO, one of the [ESMTP](/glossary/esmtp/) extensions, and then puts the code at the start of the text of each reply. The same codes appear in the `Status` field of a [DSN](/glossary/dsn/), the bounce message a server mails back when delivery fails after the session has ended.

## Enhanced status code vs SMTP reply code

The two codes travel together and answer different questions. **The reply code decides what the sending server does next**: a 4xx reply means the message can be retried later, and a 5xx reply means it will not be accepted. The enhanced code explains why, and it is the part a person or a bounce parser reads to choose a response.

That difference matters because one reply code covers many causes. A `550` can mean an unknown user (`5.1.1`), a domain that does not exist (`5.1.2`), a disabled mailbox (`5.2.1`) or a policy rejection (`5.7.1`). Only the second code separates a bad address, which calls for removing the recipient, from a policy block, which points at the sender's content, authentication or reputation.

Both are also distinct from HTTP status codes returned by an email API. A `422` from an API call describes the request, while SMTP codes describe what the receiving mail server said during delivery.

## Common problems with enhanced status codes

**Mailbox providers extend the detail field with their own values.** Gmail uses `5.7.26` for mail rejected under the sending domain's DMARC policy and `4.7.28` for rate limiting, and the explanation lives in the text that follows the code rather than in the standard. Reading the full response, not just the numbers, avoids misclassifying these.

Not every server sends enhanced codes, and some send codes that do not match the reply code's class. A parser that relies only on the enhanced code misfiles those responses, so the reply code remains the authority on whether a failure is temporary or permanent.

A code also describes one moment. A [soft bounce](/glossary/soft-bounce/) such as a full mailbox can repeat across retries until the sending side treats it as permanent, and the final [hard bounce](/glossary/hard-bounce/) may carry a different code from the first attempt.

## Enhanced status code in Lettr

**A bounce reaches configured webhook endpoints as a `message.bounce` event** carrying the receiving server's response in three fields. `error_code` holds the basic reply code, such as `550`, `reason` holds a short description such as `User Unknown`, and `raw_reason` holds the full response with the enhanced code, for example `550 5.1.1 The email account that you tried to reach does not exist`.

Lettr also assigns each [bounce](/glossary/bounce/) a numeric `bounce_class`. Classes 10, 30 and 100 are hard bounces and add the address to the suppression list automatically, while soft bounces are retried automatically. Delivery that is only delayed arrives as a separate `message.delay` event while Lettr keeps retrying.

In the Events dashboard, the Message Details view for a bounce shows the recipient domain and mailbox provider. The [Bounce Codes Reference](https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference) lists common reply and enhanced codes with a recommended action for each.
