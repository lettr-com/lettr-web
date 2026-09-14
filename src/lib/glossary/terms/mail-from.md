---
term: MAIL FROM
question: What is
description: "MAIL FROM is the SMTP command that names the envelope sender, the address that receives bounces and that SPF checks. How it works and how Lettr sets it."
related: [envelope-from, return-path, rcpt-to, spf, custom-return-path]
reading:
  - title: Custom Return-Path and MAIL FROM
    href: https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path
  - title: SMTP Protocol Basics
    href: https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics
---

**MAIL FROM** is the SMTP command a sending server uses to name the sender at the start of each mail transaction, before any recipients or content are transferred. The address it carries is the envelope sender: bounce notifications go there, and SPF checks its domain. It often differs from the From header the recipient sees, which is written separately inside the message.

## How MAIL FROM works

An SMTP session opens with a greeting, [EHLO or HELO](/glossary/ehlo-helo/), in which the client names itself. **`MAIL FROM` then starts a transaction**, in the form `MAIL FROM:<bounces@example.com>`, and the server answers `250` to accept the sender or with an error to refuse it. One [RCPT TO](/glossary/rcpt-to/) command follows for each recipient, and `DATA` transfers the headers and body. A single connection can carry several messages, each beginning with its own `MAIL FROM`.

Servers that support ESMTP accept parameters after the address. `SIZE=` declares the message size so the server can refuse an oversized message before any of it is sent, and `BODY=8BITMIME` announces 8-bit content.

The address can also be empty. Bounce notifications and other automatic replies are sent with `MAIL FROM:<>`, a null sender, so a failure notice that cannot be delivered is dropped instead of generating another bounce, which stops two servers from bouncing failures back and forth.

## MAIL FROM vs the From header

`MAIL FROM` belongs to the envelope, the routing information servers act on. **The From header belongs to the message**, and it is what the recipient's client displays. Neither is derived from the other, so a message from `hello@example.com` can travel with an envelope sender on a completely different domain.

When the receiving server makes final delivery, it records the envelope sender in a [Return-Path](/glossary/return-path/) header at the top of the message, which is how the `MAIL FROM` address becomes visible in the raw source. The address itself goes by several names, including envelope sender, bounce address and [envelope from](/glossary/envelope-from/), and they all refer to the value given in this command.

Editing the From line changes nothing about the envelope. Bounce routing and SPF keep using the `MAIL FROM` domain regardless of what the recipient sees.

## Why MAIL FROM matters

**[SPF](/glossary/spf/) is evaluated against the `MAIL FROM` domain.** The receiving server looks up that domain's SPF record and checks whether the connecting IP address is allowed to send for it. When the command carries a null sender, SPF falls back to the hostname given in the HELO or EHLO greeting.

DMARC adds alignment on top of that result. SPF only counts toward DMARC when the `MAIL FROM` domain matches the From header domain, either exactly or at the organizational level under relaxed alignment. Email service providers usually put their own bounce-processing domain in `MAIL FROM`, so SPF passes without aligning and DMARC depends on DKIM alone. A [custom Return-Path](/glossary/custom-return-path/) moves the envelope onto the sender's domain so SPF aligns as well.

The command is also an early checkpoint. A receiving server can reject a transaction at `MAIL FROM`, before any content arrives, for example when the sender domain does not resolve or appears on a blocklist.

## MAIL FROM in Lettr

**By default, Lettr sets the Return-Path to an address on Lettr's bounce-processing domain**, which lets it receive bounce notifications, parse the codes, classify bounces and update suppression lists automatically. `Return-Path` is one of the headers Lettr manages itself, so it cannot be set through the `headers` field of the send API. In the default configuration, DKIM handles DMARC alignment, because Lettr signs with the sending domain.

To put the sending domain into the envelope, the domain's detail page has a **Bounce Domain** card with the toggle **Use this sending domain as bounce domain**. The toggle stays disabled until the domain's `cname_status` is valid, and it needs no additional DNS changes. With it enabled, a test email's `Authentication-Results` header shows `spf=pass smtp.mailfrom=` followed by the sending domain. Templates can reference the Return-Path address through the built-in `env_from` field when the send context provides it, and `return_path` is reserved as a key name.

Over the SMTP relay, Lettr validates the address in the `From:` header against the verified sending domains, not the envelope sender the client gives in `MAIL FROM`. A `From:` address outside a verified domain still passes authentication and is rejected afterwards, when the client sends the message body. The [Custom Return-Path and MAIL FROM](https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path) page covers the header checks.
