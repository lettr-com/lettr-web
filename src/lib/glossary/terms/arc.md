---
term: ARC
fullName: Authenticated Received Chain
heading: "What is ARC?"
description: "ARC records the authentication results a message had before a forwarder or mailing list changed it, so later receivers can still trust the original sender."
published: 2026-09-14
updated: 2026-09-14
related: [dkim, dmarc, spf, authentication-results-header, custom-return-path]
reading:
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
  - title: DKIM records in Lettr
    href: https://docs.lettr.com/learn/domains/dkim
---

**ARC (Authenticated Received Chain)** is an email authentication protocol, defined in RFC 8617, that preserves authentication results when a message passes through an intermediary such as a mailing list or a forwarding service. Each intermediary records the SPF, DKIM and DMARC results it saw on arrival and seals them with its own signature. A later receiver can then see that the message authenticated correctly before it was forwarded or modified, even when its own checks now fail.

## How ARC works

An intermediary that handles a message adds a set of three headers, **each set numbered with an instance tag** (`i=1` for the first intermediary, `i=2` for the next, and so on):

- **ARC-Authentication-Results:** a copy of the authentication results the intermediary saw, in the same format as the [Authentication-Results header](/glossary/authentication-results-header/).
- **ARC-Message-Signature:** a DKIM-style signature over the message as the intermediary passes it on, including any changes it made.
- **ARC-Seal:** a signature over the ARC headers so far, with a `cv=` tag recording the state of the chain it received (`none` on the first set, then `pass` or `fail`).

The next receiver validates the chain from the first set to the last. An intact chain shows which servers handled the message and what each of them saw, so the receiver can weigh the results from the first hop against its own failing checks.

## Why ARC matters

**Forwarding and mailing lists break the checks DMARC depends on.** A forwarding server sends from its own IP address, which is not authorized in the original domain's [SPF](/glossary/spf/) record. A mailing list that adds a subject tag or a footer changes the signed content, which invalidates the [DKIM](/glossary/dkim/) signature. With both checks failing, a domain that publishes `p=reject` has its legitimate mail rejected once a list redistributes it.

ARC gives the final receiver evidence to set that [DMARC](/glossary/dmarc/) failure aside. Gmail and Microsoft 365 both evaluate ARC headers on mail that arrives through intermediaries.

## Common problems with ARC

**A valid chain does not oblige a receiver to accept the message.** ARC proves what each intermediary claims it saw, and the receiver decides whether it trusts that intermediary. A chain sealed by an unknown or poorly reputed server carries little weight, and receivers keep their own lists of sealers they trust.

ARC headers come from intermediaries only, so the original sender's contribution is authentication that passes at the first hop. That result is what the first ARC set records. A message that already failed DKIM or DMARC before it reached the list has the failure preserved in the chain.

Chains also break. A later server that modifies the message without adding its own ARC set invalidates the most recent message signature, and a chain whose validation fails is recorded as `cv=fail` by the next sealer.

## ARC in Lettr

ARC sets are added by the forwarders and lists that handle a message after it leaves the sender, so **what a Lettr sender controls is the authentication the first ARC set records**. Lettr signs every message with a DKIM key specific to the sending domain and sets `d=` to that domain, so DKIM passes and aligns for DMARC when the message arrives unchanged.

That signature is also what survives plain forwarding. SPF breaks when a message is forwarded, while DKIM survives because the signature travels inside the message. Modification is the exception: mailing list software, forwarding services and anti-virus tools that alter content after signing break the signature, and the receiving server then reports a result such as `dkim=fail (body hash did not verify)`.

SPF alignment gives DMARC a second path at the first hop. Enabling the sending domain as the bounce domain puts the Return-Path on that domain, the same approach as a [custom Return-Path](/glossary/custom-return-path/), so SPF aligns alongside DKIM. A test message to a Gmail account confirms both before any forwarding is involved, with `dkim=pass` and `spf=pass` in its Authentication-Results header. The [Understanding SPF, DKIM, and DMARC](https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc) guide explains how the three checks combine.
