---
term: Backscatter
heading: "What is backscatter?"
description: "Backscatter is bounce mail sent to an innocent address that spammers forged as the sender. How it happens, how to prevent it and how Lettr handles bounces."
published: 2026-09-14
updated: 2026-09-15
related: [return-path, out-of-band-bounce, dmarc, email-spoofing, dsn]
reading:
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
  - title: Bounces in Lettr
    href: https://docs.lettr.com/learn/suppressions/bounces
---

**Backscatter** is bounce mail delivered to an innocent third party whose email address was forged as the sender of spam. The spammer puts someone else's address in the message, and every server that cannot deliver the spam sends its failure notice to that address. The owner receives bounces, auto-replies and challenge messages for mail it never sent.

## How backscatter works

Every message carries two sender addresses. The From header is what the recipient sees, and the envelope sender, also called the [Return-Path](/glossary/return-path/), is where delivery failures go. **SMTP does not verify the envelope sender on its own**, so a spammer can set it to any address, usually one on a real domain that will pass basic checks.

What decides whether backscatter appears is when the receiving server refuses the message. A server that rejects mail during the SMTP session, with a 5xx reply to an unknown recipient, returns the error to the connecting machine, which is the spammer's own server, and nothing reaches the forged address. A server that accepts the message first and only later finds it cannot deliver it has no connection left to answer, so it generates a separate [delivery status notification](/glossary/dsn/) and mails it to the envelope sender. That notice is the backscatter.

Accept-then-bounce setups are the usual source: gateways that queue mail before checking whether the mailbox exists, content filters that run after acceptance, and forwarding servers that relay to a dead address. Vacation auto-replies and challenge-response filters produce the same effect, because they also reply to whatever sender address the message claims.

## Backscatter vs out-of-band bounce

An [out-of-band bounce](/glossary/out-of-band-bounce/) uses the same mechanism: the receiving server accepts a message and bounces it later. **The difference is whether the envelope sender was genuine.** A late bounce for a message the sender really sent is useful delivery data and should be processed like any other bounce. A bounce for a message the sender has no record of is backscatter, and the only thing it proves is that someone forged the address.

That distinction matters for anyone parsing bounces automatically. Backscatter quotes spam the domain never sent, so treating it as real delivery data would mark valid subscribers as failed or trigger alerts for a problem that does not exist on the sending side.

## Why backscatter matters

For the forged domain, backscatter is a flood of unwanted mail from legitimate servers. It is hard to filter because the bounces come from real mail systems and pass authentication, and it can bury genuine bounces and replies in the same mailbox. It also means the domain is being used for [spoofing](/glossary/email-spoofing/), which puts its reputation with recipients at risk.

For the server that produces it, backscatter counts as unsolicited mail to people who never wrote to it. Some blocklists list servers that send backscatter, which can hurt delivery of that server's ordinary mail.

## How to prevent backscatter

Prevention sits on both ends. **A domain owner protects its addresses with authentication**: SPF, DKIM and a [DMARC](/glossary/dmarc/) policy of `p=quarantine` or `p=reject` give receiving servers a published rule for rejecting forged mail, ideally during the SMTP session, before any bounce is generated. DMARC reports also show which sources are sending mail under the domain's name.

A mail server operator stops producing backscatter by validating recipients at SMTP time, rejecting rather than bouncing whenever a decision can be made during the session, and not sending auto-replies to messages that fail authentication.

## Backscatter in Lettr

**Lettr sends only from domains that have been added, verified and approved.** The `from` address in a send request must be on a verified domain, and a request from a domain whose [status](/glossary/domain-status/) is still pending or has been blocked returns an error, so the platform does not send mail under a domain its owner has not set up. Every message is signed with a DKIM key specific to the sending domain, with a `d=` value that matches it. The DMARC record stays with the domain owner, and the [DMARC setup page](https://docs.lettr.com/learn/domains/dmarc) recommends starting at `p=none` with aggregate reporting before moving to enforcement.

Bounces for mail sent through Lettr go to a Return-Path address that Lettr processes, not to the From mailbox. Lettr parses the bounce codes, classifies each bounce and reports it as a `message.bounce` webhook event, with late bounces arriving as `message.out_of_band`. Automatic replies such as vacation messages get their own bounce class, `60`, which needs no action.
