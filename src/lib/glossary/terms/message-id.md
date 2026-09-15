---
term: Message-ID
heading: "What is the Message-ID header?"
description: "Message-ID is the header that gives each email a unique identifier used for threading, deduplication and troubleshooting. How it works and how Lettr sets it."
published: 2026-09-14
updated: 2026-09-14
related: [message-threading, email-header, idempotency, dkim, mta]
reading:
  - title: Email Headers Explained
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-headers
  - title: Idempotency
    href: https://docs.lettr.com/learn/sending/idempotency
  - title: Reply Tracking
    href: https://docs.lettr.com/learn/inbound/reply-tracking
---

**Message-ID** is an [email header](/glossary/email-header/) that carries a unique identifier for a single message, written in the form `<unique-string@domain>`. The sending system generates it once, and the message keeps the same value as it passes from server to server. Mail clients use it to thread replies, receiving systems use it to spot duplicates, and administrators use it to trace one message through their logs.

## How Message-ID works

RFC 5322 defines the header and expects every message to carry exactly one. **The value has two halves around an `@` sign.** The left side is a string that must never repeat, typically built from a timestamp, a random value or a counter, and the right side is a domain name belonging to the system that generated it. A header looks like `Message-ID: <20260914.8f3a2c91@mail.example.com>`.

The originating system normally creates the value. That is usually the mail client or the sending application, and if a message arrives at a submission server without one, the server may add it. Once set, the value is not supposed to change, so the Message-ID seen in the recipient's mailbox matches the one in the sender's logs.

Other headers refer to it. A reply lists the original's Message-ID in `In-Reply-To` and `References`, which is the basis of [message threading](/glossary/message-threading/). Email platforms also keep their own internal identifiers for API requests and events, and those are separate values with their own formats.

## Why Message-ID matters

**The header is the one identifier every system along the path shares.** A recipient's administrator can find a message in a mail server log, a quarantine or a message trace by its Message-ID, which makes it the most useful value to include in a support ticket about a specific email.

Deduplication depends on it too. Mailing list software, archives and some mailbox providers treat a repeated Message-ID as the same message, so two different emails that share a value can be merged or one of them can be silently dropped. The header is also commonly among those covered by a [DKIM](/glossary/dkim/) signature, which protects it from being changed in transit.

Its presence is a basic quality signal as well. Gmail rejects messages that lack a valid Message-ID header, and spam filters score malformed values, such as a right-hand side of `localhost`, as a sign of misconfigured sending software.

## Common problems with Message-ID

**Reusing a Message-ID across messages is the most damaging mistake.** Software that builds the value from a template, a per-campaign constant or a timestamp with too little precision can produce collisions, and the result is threading errors and missing messages that are hard to trace back to the cause.

Retries create the opposite problem. When an application times out and sends again, the second attempt is a new message with a new Message-ID, so the recipient gets two copies and nothing downstream can tell they were meant to be one. Preventing that requires [idempotency](/glossary/idempotency/) at the point where the application submits the email, before any Message-ID exists.

Relays sometimes rewrite the header. A server or gateway that replaces the value breaks the link between the sender's logs and the delivered message, and invalidates a DKIM signature that covered it.

## Message-ID in Lettr

**Lettr builds the RFC 5322 headers, `Message-ID` included, when it assembles each message**, alongside From, To, Subject and Date, then signs the message with DKIM. `Message-ID` is on the list of headers that the send API's `headers` field blocks because Lettr manages them, so a request cannot override it.

Custom identifiers go into custom headers instead, with a maximum of 10 custom headers per email and 998 characters per header value. Every successful send also returns a `request_id`, which the docs recommend storing with the business record to trace the email through delivery, webhooks and the dashboard, and the [Idempotency](https://docs.lettr.com/learn/sending/idempotency) page covers patterns for preventing duplicate sends.

On the inbound side, emails reach the application with their headers parsed into structured data. The Reply Tracking guide reads the `Message-ID`, `In-Reply-To` and `References` headers from incoming replies to match them to existing conversations.
