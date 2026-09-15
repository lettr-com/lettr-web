---
term: Header
heading: "What is an email header?"
description: "An email header is the block of fields at the top of a message, such as From and Message-ID. What headers do, header vs envelope, and headers in Lettr."
published: 2026-09-14
updated: 2026-09-15
related: [from-header, message-id, envelope-from, authentication-results-header, x-header]
reading:
  - title: Email Headers Explained
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-headers
  - title: Custom Headers in the API Reference
    href: https://docs.lettr.com/api-reference/introduction
  - title: Sending Emails
    href: https://docs.lettr.com/learn/sending/introduction
---

**An email header** is the set of fields at the top of an email message that describe it: who sent it, who it is for, the subject, the date, a unique identifier, and records of the route it took and whether it passed authentication. Each field is a line with a name, a colon and a value, such as `Subject: Order 1234 confirmed`, and a blank line separates the header section from the body. Mail clients display a few fields and hide the rest, which stay available through options such as "Show original" or "View source".

## How email headers work

**Headers are written by several parties at different stages.** The sending application supplies fields such as From, To, Subject and Reply-To. The sending platform adds Date, [Message-ID](/glossary/message-id/), MIME-Version and Content-Type, and signs selected fields in a `DKIM-Signature`. Every server that relays the message adds a `Received` line, and the receiving server adds its SPF, DKIM and DMARC verdicts in [Authentication-Results](/glossary/authentication-results-header/).

The format is defined in RFC 5322. A line may not exceed 998 characters, and long values are folded onto continuation lines that start with whitespace. Non-ASCII text, such as an accented display name or subject, is encoded as described in RFC 2047 so it passes through servers that only handle ASCII.

Order carries information too. Trace fields such as `Received` are added at the top as the message moves, so reading them from bottom to top follows the path from the sender to the recipient.

## Header vs envelope

The header is part of the message. **The envelope belongs to the SMTP conversation** that carries it: the `MAIL FROM` address, also called the [envelope from](/glossary/envelope-from/) or Return-Path address, and the `RCPT TO` recipients. Servers use the envelope to route the message and return bounces, while people read the header.

The two can legitimately differ. A message's [From header](/glossary/from-header/) can show `hello@example.com` while its envelope sender is a bounce address run by the sending platform, and a Bcc recipient appears in the envelope but in none of the visible address fields. On final delivery the receiving server records the envelope sender in a `Return-Path` header, which is why that field shows up in the received copy.

## Common types of email headers

- **Display fields:** From, To, Cc, Reply-To, Subject and Date, which the mail client shows or uses to build replies.
- **Identification and threading:** Message-ID, In-Reply-To and References, which let clients group replies into conversations.
- **Trace and authentication:** Received, DKIM-Signature and Authentication-Results, which record the route and the verification results.
- **List and automation:** [List-Unsubscribe](/glossary/list-unsubscribe-header/) and List-Unsubscribe-Post for one-click unsubscribe, and Auto-Submitted to mark automated mail.
- **Custom fields:** names defined by an application, often with an `X-` prefix, used for internal IDs and routing.

**Headers are the first place to look when diagnosing delivery.** Authentication-Results shows which check failed and for which domain, and the timestamps in Received lines show at which hop a message was held up.

## Header in Lettr

**Standard headers are set through dedicated fields of the send API** rather than written by hand, including `from`, `from_name`, `to`, `subject`, `cc`, `bcc` and `reply_to`. Additional headers go in the `headers` object, where each key is a header name and each value the header value. Lettr accepts a maximum of 10 custom headers per email, with a maximum of 998 characters per header value.

Some headers are blocked from the `headers` field because Lettr manages them automatically. The docs list includes `From`, `To`, `Subject`, `Date`, `Message-ID`, `DKIM-Signature`, `Return-Path` and `Received`, among others.

For a sent email, the Message Details view in the Events dashboard shows the Friendly From as it appeared to the recipient, including the display name, and the raw From header value as Message From. For incoming mail on an inbound domain, Lettr parses each email and delivers structured JSON to a webhook, with the sender, recipients, subject, plain text and HTML body, headers and attachment URLs. The [API reference introduction](https://docs.lettr.com/api-reference/introduction) documents the custom header limits and the headers Lettr blocks.
