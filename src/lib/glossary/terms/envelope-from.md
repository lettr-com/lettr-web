---
term: Envelope From
fullName: Return-Path address
question: What is
description: "The envelope from is the hidden SMTP sender address that receives bounces and that SPF checks. How it differs from the From header and how Lettr sets it."
related: [return-path, mail-from, from-header, spf, custom-return-path]
reading:
  - title: Email Headers Explained
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-headers
  - title: Custom Return-Path and MAIL FROM
    href: https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path
  - title: SMTP Getting Started
    href: https://docs.lettr.com/quickstart/smtp/introduction
---

**The envelope from (Return-Path address)** is the sender address a mail server gives in the SMTP `MAIL FROM` command, before any of the message itself is sent. It tells receiving servers where to report delivery failures, and it is the domain that SPF checks. Recipients rarely see it, because email clients display the From header instead, and the two addresses are often different. It is also called the bounce address, the envelope sender or the [MAIL FROM](/glossary/mail-from/) address.

## How the envelope from works

An SMTP session carries two layers of addressing. **The envelope holds the routing addresses**: the sender given in `MAIL FROM` and the recipients given in `RCPT TO`. The message inside, sent after the `DATA` command, holds the headers and body a recipient reads, including the From header. Servers route and report on the envelope and do not need to read the headers to do it.

When the receiving server makes final delivery, it records the envelope sender by adding a [Return-Path](/glossary/return-path/) header at the top of the message, which is why the envelope from and the Return-Path are usually treated as the same address. Any later failure notice, such as a delivery status notification for a mailbox that turns out to be dead, goes to that address.

Email service providers usually put a unique token in the envelope address, as in `bounces+abc123@...`. Each bounce then comes back addressed to a value that identifies the original message and recipient, so it can be matched automatically. Bounce messages themselves are sent with an empty envelope sender, `MAIL FROM:<>`, which stops two servers from bouncing failures back and forth.

## Envelope from vs From header

The [From header](/glossary/from-header/) is the address the recipient sees and replies to. **The envelope from is the address mail servers act on.** The From header identifies the author to a person, while the envelope from decides where bounces go and which domain SPF authenticates.

Keeping them separate is normal practice. A message from `hello@example.com` sent through a provider typically leaves with an envelope address on the provider's bounce-processing domain, so the provider receives and processes every bounce without the sender's mailbox filling up with failure notices.

Changing the From address has no effect on the envelope. A sender that edits the visible From line to fix an authentication problem leaves SPF evaluating the same envelope domain as before.

## Why the envelope from matters

**[SPF](/glossary/spf/) is verified against the envelope from domain**, not the From header domain. The receiving server looks up the SPF record of the domain in `MAIL FROM` and checks whether the connecting IP address is authorized. When the envelope sender is empty, as it is for bounces, SPF falls back to the hostname from the HELO or EHLO greeting.

DMARC then asks whether that SPF-authenticated domain matches the From header domain. An envelope address on the provider's domain passes SPF but does not align, leaving DMARC to depend on DKIM alone. A [custom Return-Path](/glossary/custom-return-path/) moves the envelope onto the sender's own domain so SPF aligns as well, which keeps DMARC passing when forwarding or a modified message breaks the DKIM signature.

The envelope address also affects presentation. Some clients, notably Gmail, show a "via" label next to the sender when the Return-Path domain differs from the From domain.

## Envelope From in Lettr

**By default, Lettr sets the Return-Path to an address on Lettr's bounce-processing domain**, which lets it receive bounce notifications, parse the codes, classify each bounce as hard or soft and update suppression lists automatically. `Return-Path` is one of the headers Lettr manages itself, so it cannot be set through the `headers` field of a send request.

In that default setup, DMARC passes through DKIM alignment, because Lettr signs with `d=` set to the sending domain. To move the envelope onto the sending domain, the domain's detail page has a **Bounce Domain** card with the toggle **Use this sending domain as bounce domain**. The toggle stays disabled until the domain's CNAME record is valid, needs no extra DNS changes, and reverts to Lettr's default bounce domain when switched off. With it on, a test email's `Authentication-Results` header shows `spf=pass smtp.mailfrom=` followed by the sending domain.

Over the SMTP relay, Lettr validates the address in the `From:` header against the verified sending domains, not the envelope sender the client uses in `MAIL FROM`. Recipients are read from the envelope, so BCC addresses passed there are delivered as regular recipients. The [Custom Return-Path and MAIL FROM](https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path) page covers the header checks.
