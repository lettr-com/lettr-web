---
term: DMARC Alignment
heading: "What is DMARC alignment?"
description: "DMARC alignment requires the domain that passed SPF or DKIM to match the visible From domain. Strict and relaxed modes, common failures, and Lettr's setup."
published: 2026-09-14
updated: 2026-09-15
related: [dmarc, spf, dkim, return-path, custom-return-path]
reading:
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc#alignment
  - title: DMARC records in Lettr
    href: https://docs.lettr.com/learn/domains/dmarc
  - title: Custom Return-Path and MAIL FROM
    href: https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path
---

**DMARC alignment** is the rule that ties email authentication to the address a recipient actually sees. A message passes DMARC only when SPF or DKIM passes and the domain that check authenticated matches the domain in the visible From header. Without that rule, a forger could pass SPF with a domain of their own while putting someone else's domain in the From line.

## How DMARC alignment works

[DMARC](/glossary/dmarc/) compares two identifiers with the From domain. **For [SPF](/glossary/spf/), the compared domain is the envelope sender**, the [Return-Path](/glossary/return-path/) address used during SMTP delivery and the address bounces go to. For [DKIM](/glossary/dkim/), it is the signing domain in the `d=` tag of the `DKIM-Signature` header. A message needs only one aligned pass: SPF passing and aligned, or DKIM passing and aligned.

Each identifier has its own mode, set in the DMARC record. **Relaxed mode**, the default, accepts a match on the organizational domain, so `mail.example.com` aligns with `example.com`. Strict mode requires the two domains to be identical. The `adkim` tag sets the DKIM mode and `aspf` the SPF mode, each taking `r` for relaxed or `s` for strict, as in `v=DMARC1; p=reject; adkim=s; aspf=s`.

## Why alignment matters

**Passing SPF or DKIM on its own says nothing about the From address.** SPF validates whichever domain appears in the envelope, and DKIM validates whichever domain signed the message, and both can belong to a third party. Alignment connects those checks to the domain the recipient reads, which is what allows DMARC to stop mail that forges an exact domain.

Alignment also explains a result that shows up often in DMARC reports: SPF and DKIM both pass, yet DMARC fails. That combination means the passing domains belong to the sending service rather than to the From domain.

## Common problems with alignment

The typical failure involves a third-party sender. **A service that signs with its own domain and uses its own bounce domain** produces passing SPF and DKIM results that do not align with the customer's From domain, so DMARC fails. The fix is to have the service sign with the customer's domain and, where the service supports it, use a [custom Return-Path](/glossary/custom-return-path/) on that domain.

Forwarding breaks SPF alignment, because the forwarding server's IP address is not in the original domain's SPF record. DKIM alignment survives forwarding as long as the signed content stays intact, which is why configuring both gives DMARC a fallback.

Strict mode causes failures that relaxed mode would not. A message with a From address on `example.com` that is signed with `d=mail.example.com` aligns under relaxed rules and fails under strict ones, so strict mode suits only domains where every sending identifier matches exactly.

## Alignment in Lettr

**Lettr signs every message with a DKIM key specific to the sending domain**, and the `d=` value matches that domain. A message from `hello@example.com` carries `d=example.com`, so DKIM alignment passes without extra configuration. Lettr supports both relaxed and strict alignment.

SPF alignment depends on the Return-Path domain. The domain detail page has a Bounce Domain card with a toggle labeled "Use this sending domain as bounce domain", and enabling it puts the Return-Path on the sending domain, which adds SPF alignment next to DKIM. A test message then shows `spf=pass smtp.mailfrom=example.com`, `dkim=pass header.d=example.com` and `dmarc=pass header.from=example.com` in its Authentication-Results header.

For mail sent through Lettr, DMARC passes once the sending domain is verified and a DMARC record exists at `_dmarc.example.com`. Other services that send as the same domain need their own alignment, because a `p=reject` policy blocks every source that fails authentication, not only the misconfigured one. The [DMARC records page](https://docs.lettr.com/learn/domains/dmarc) in the Lettr docs covers the `adkim` and `aspf` tags and troubleshooting for alignment failures.
