---
term: Return-Path
question: What is
description: "Return-Path is the header a receiving server adds to record the envelope sender, where bounces go. How it is set, how bounces use it and how Lettr manages it."
related: [envelope-from, mail-from, custom-return-path, verp, dsn]
reading:
  - title: Email Headers Explained
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-headers
  - title: Custom Return-Path and MAIL FROM
    href: https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path
---

**Return-Path** is the email header that records a message's envelope sender, the address to which delivery failures are reported. The receiving server adds it at final delivery, copying the address the sending server gave in the SMTP `MAIL FROM` command. It is the visible trace of the [envelope from](/glossary/envelope-from/) address, and in everyday use both names refer to the same value.

## How the Return-Path header works

The header is written at the end of the journey, not the start. **RFC 5321 has the server that makes final delivery insert it** at the top of the message, in the form `Return-Path: <bounces@example.com>`, using the reverse path from the [MAIL FROM](/glossary/mail-from/) command of the last SMTP transaction. Relays along the way do not add it. They pass the envelope sender on in their own `MAIL FROM`.

That order has a practical consequence. A message is not supposed to carry a Return-Path when it is sent, and one added by the sending application is typically removed or replaced at delivery. **Changing where bounces go means changing the envelope**, which the sending server or platform controls, not writing a header into the message.

Because only the final hop writes it, Return-Path reflects the envelope of that last transaction. A forwarding service that rewrites the envelope sender before passing a message on therefore shows its own address there, not the original sender's.

## How bounces use the Return-Path

A server that accepts a message and later fails to deliver it sends a [DSN](/glossary/dsn/) to the envelope sender, the address Return-Path records. Automatic responders are expected to use the same address: RFC 3834 directs out-of-office replies and similar messages to the Return-Path rather than to the From address.

**Bounces themselves travel with an empty envelope sender**, `MAIL FROM:<>`, and arrive with `Return-Path: <>`. The empty value tells every system that handles the message not to answer it with another bounce or an auto-reply, which stops failure notices from circling between servers.

## Return-Path and VERP

A fixed bounce address collects failures from every message in one mailbox, and matching a DSN to the recipient that failed means parsing report formats that vary by server. [VERP](/glossary/verp/), Variable Envelope Return Path, avoids that parsing by giving each message its own envelope sender with the recipient encoded in it, as in `bounces+alice=example.org@bounces.example.com`. The bounce comes back addressed to that value, so the failing recipient is known from the address alone.

Email service providers use the same idea with a per-message token in the Return-Path, which is why the address on a message sent through a provider looks like a random string on the provider's bounce domain. The domain in the Return-Path is also the one SPF checks, and a [custom Return-Path](/glossary/custom-return-path/) moves it onto the sender's own domain so SPF aligns for DMARC.

## Return-Path in Lettr

**By default, Lettr sets the Return-Path to an address on Lettr's bounce-processing domain.** That lets Lettr receive bounce notifications, parse the bounce codes, classify each bounce, update suppression lists and show bounce data in the dashboard and webhooks. `Return-Path` is one of the headers Lettr manages itself, so it cannot be set through the `headers` field of a send request.

To put the sending domain into the Return-Path, the domain's detail page has a **Bounce Domain** card with the toggle **Use this sending domain as bounce domain**. The toggle stays disabled until the domain's CNAME record is valid. Without it, DMARC passes through DKIM alignment, because Lettr signs with the sending domain.

In templates, the built-in `env_from` field refers to the Return-Path or bounce address when the send context provides it, and `return_path` is a reserved word that cannot be used as a custom key. The [Custom Return-Path and MAIL FROM](https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path) page covers the bounce domain setup and the header checks.
