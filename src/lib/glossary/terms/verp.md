---
term: VERP
fullName: Variable Envelope Return Path
heading: "What is VERP?"
description: "VERP encodes each recipient's address in the envelope sender, so a bounce identifies the failed recipient by the address it returns to. How it works and why."
published: 2026-09-14
updated: 2026-09-14
related: [return-path, envelope-from, bounce, out-of-band-bounce, plus-addressing]
reading:
  - title: Custom Return-Path and MAIL FROM
    href: https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path
  - title: Bounces
    href: https://docs.lettr.com/learn/suppressions/bounces
---

**VERP (Variable Envelope Return Path)** is a technique for telling which recipient a bounce belongs to by giving each recipient of a mailing its own envelope sender address. The recipient's address is encoded into that return address, so a failure notice comes back addressed to a value that names the recipient who failed. The sender learns who bounced from the address the notice arrives at, without parsing the notice itself.

## How VERP works

Every SMTP transaction names an envelope sender in the `MAIL FROM` command, the [envelope from](/glossary/envelope-from/) address, and delivery failures are reported to it. **A mailing list without VERP uses one fixed address**, such as `bounces@lists.example.com`, for all recipients. With VERP, the list sends a separate copy to each recipient and rewrites the envelope sender every time: mail for `alice@example.org` goes out with `MAIL FROM:<bounces+alice=example.org@lists.example.com>`.

The `@` of the recipient's address is replaced, usually with `=`, so the result is still a valid address on the sender's own domain. The receiving server records it in the [Return-Path](/glossary/return-path/) header at final delivery. When delivery fails, during the SMTP session or later as an [out-of-band bounce](/glossary/out-of-band-bounce/), the notice goes to that address, and the bounce processor decodes the recipient from the part after the separator.

The sender's mail server has to accept every variant of the bounce address. That relies on subaddressing, the same mechanism as [plus addressing](/glossary/plus-addressing/), where everything after the separator is ignored when the mailbox is looked up and kept for the software that reads it.

## Why VERP exists

**Bounce notices are unreliable to parse.** A [bounce](/glossary/bounce/) arrives as a delivery status notification whose format varies between mail servers, and some notices omit the original recipient, report an address that forwarding has already rewritten, or quote only part of the original message. A mailing list that cannot tell which address failed cannot remove it, so it keeps mailing addresses that no longer exist.

VERP removes the parsing step. The information the sender needs sits in the one field every bounce must use, the address it is delivered to. The idea is generally credited to Daniel J. Bernstein, who built it into the qmail mail server in the 1990s, and mailing list managers and other mail servers, Postfix among them, later added support.

## VERP vs per-message tokens

Classic VERP encodes the readable recipient address. **Email service providers commonly use a variant** that puts an opaque token in the local part instead, as in `bounces+abc123@bounce.provider.example`, where the token maps to a message and recipient in the provider's database. The token keeps the recipient's address out of the envelope and can identify one specific send, not only a recipient.

Both forms share the cost of per-recipient envelopes. Each recipient needs its own SMTP transaction, which rules out delivering one copy to many recipients at the same domain in a single transaction. A changing `MAIL FROM` also affects [graylisting](/glossary/graylisting/) that remembers sender and recipient pairs, since every message looks like a first contact and can be deferred again.

## VERP in Lettr

**By default, Lettr sets the Return-Path to an address on Lettr's bounce-processing domain**, which lets Lettr receive bounce notifications automatically, parse the bounce codes, classify bounce types, update suppression lists and surface bounce data in the dashboard and webhooks. `Return-Path` is one of the headers Lettr manages itself, so it cannot be set through the `headers` field of a send request.

The application receives the result as events instead of raw notices. Each bounce reaches webhook endpoints as a `message.bounce` event carrying the recipient address, its bounce class and the receiving server's response, and bounces that arrive after the initial delivery attempt appeared successful are tracked as `message.out_of_band` events. Hard bounces are added to the suppression list automatically.

A sending domain's page has a **Bounce Domain** card with the toggle **Use this sending domain as bounce domain**, which makes bounce messages use that domain's Return-Path. The toggle stays disabled until the domain's CNAME record is verified. In templates, the built-in `env_from` field refers to the Return-Path or bounce address when the send context provides it, and `return_path` is a reserved word that cannot be used as a custom key. The [Custom Return-Path and MAIL FROM](https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path) page covers the bounce domain setup and SPF alignment.
