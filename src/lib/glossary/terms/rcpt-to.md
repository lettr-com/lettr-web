---
term: RCPT TO
heading: "What is RCPT TO?"
description: "RCPT TO is the SMTP command that names each envelope recipient of a message. How it differs from the To header, why BCC depends on it and how Lettr reads it."
published: 2026-09-14
updated: 2026-09-14
related: [mail-from, envelope-from, smtp, dsn, smtp-relay]
reading:
  - title: SMTP Protocol Basics
    href: https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics
  - title: SMTP Getting Started
    href: https://docs.lettr.com/quickstart/smtp/introduction
  - title: Recipients
    href: https://docs.lettr.com/learn/sending/recipients
---

**RCPT TO** is the SMTP command that names one recipient of a message during a mail transaction. It follows `MAIL FROM` and comes before `DATA`, and a message with several recipients carries one `RCPT TO` per address. The addresses given this way are the envelope recipients, which decide where the message is actually delivered, independent of the To and Cc lines a reader sees.

## How RCPT TO works

In an [SMTP](/glossary/smtp/) session, the [MAIL FROM](/glossary/mail-from/) command opens a transaction and names the sender. **The client then sends one `RCPT TO` for each recipient**, in the form `RCPT TO:<user@example.com>`, and the server answers each one separately. `250` accepts the recipient, a 5xx reply such as `550 5.1.1` rejects it permanently, and a 4xx reply such as `451` or `452` refuses it for now. After at least one recipient is accepted, the client sends `DATA` once and the message goes to every accepted address.

Rejections at this stage are selective. A transaction can continue with the accepted recipients while the rejected ones are dropped, and the sending server records the failure for each rejected address. A server that accepts a recipient at `RCPT TO` and later fails to deliver reports it differently, with a [DSN](/glossary/dsn/) sent to the envelope sender.

RFC 5321 requires servers to accept at least 100 recipients in one transaction, and servers may impose lower limits in practice. A server that has reached its limit answers `452` for the extra recipients, and the client sends them in a new transaction. Servers that support the DSN extension also accept parameters after the address, such as `NOTIFY=FAILURE,DELAY`, which sets when a delivery report should be generated for that recipient.

## RCPT TO vs the To header

The To and Cc headers are part of the message that `DATA` transfers. **Servers route by the envelope, not by the headers**, so the recipients a reader sees and the recipients a message is delivered to are separate lists that usually, but not always, match.

BCC depends on that separation. The sending client passes Bcc addresses as `RCPT TO` recipients and leaves them out of the headers it transmits, so each Bcc recipient receives the message without appearing in it. Mailing lists and forwarding use the same gap in the other direction: a message addressed to `team@example.com` reaches a list server, which sends it on with a new `RCPT TO` for each member while the To header still shows the list address. Some receiving servers record the envelope recipient in a header such as `Delivered-To`, which is the only trace of it in the delivered message.

The sender side of the envelope works the same way, with the [envelope from](/glossary/envelope-from/) address set by `MAIL FROM` and kept separate from the From header.

## Common problems with RCPT TO

**A `250` reply does not prove a mailbox exists.** Some domains accept every address at `RCPT TO` and bounce unknown ones afterwards, so a clean SMTP conversation can still end in a delayed bounce.

Recipient limits cause partial failures. A client that sends more recipients than the server allows gets `452` for the rest, and software that ignores that reply loses those recipients silently.

Relaying errors appear here too. A server asked to deliver to a domain it does not handle, without authentication, typically rejects the recipient with `550 5.7.1` and a "relaying denied" message.

## RCPT TO in Lettr

**Lettr's [SMTP relay](/glossary/smtp-relay/) reads recipients from the envelope**, so it cannot tell which ones were meant to be blind, and BCC addresses passed over SMTP are delivered as regular To recipients, visible to everyone else on the message. To keep recipients hidden from one another, the SMTP docs recommend sending a separate message to each one or using the HTTP API, which handles BCC correctly. A message can have at most 50 recipients across to, cc and bcc combined, and exceeding that over SMTP returns `452 Too many recipients`.

The HTTP API takes recipients in the `to`, `cc` and `bcc` arrays under the same 50-address cap, and a request above it is rejected with a `422` before anything is sent. Every address counts toward the quota, CC and BCC included.

Webhook message events identify the recipient in a `rcpt_to` field, for example in bounce and spam complaint events. In the Message Details view, the Recipient section shows the **Recipient Address** as it was specified at send time and the **Recipient Address (raw)**, the unprocessed address that may include additional routing information. The [SMTP Getting Started](https://docs.lettr.com/quickstart/smtp/introduction) page covers the BCC behaviour and limits.
