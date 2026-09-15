---
term: Custom Return-Path
heading: "What is a custom Return-Path?"
description: "A custom Return-Path swaps an ESP's default bounce domain for the sender's own, so SPF aligns for DMARC. How it works and how to enable it in Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [return-path, envelope-from, spf, dmarc-alignment, bounce]
reading:
  - title: Custom Return-Path and MAIL FROM
    href: https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path
  - title: Sending Domains
    href: https://docs.lettr.com/learn/domains/sending-domains
---

**A custom Return-Path** is a configuration that replaces an email service provider's default bounce domain with the sender's own domain in the [envelope from](/glossary/envelope-from/) address, also called the MAIL FROM address. The Return-Path is where bounce notifications go and the domain that SPF checks. With the sender's domain in it, SPF aligns with the visible From domain alongside DKIM, which gives DMARC two independent ways to pass.

## How a custom Return-Path works

Every email carries two sender addresses. The From header is the one recipients see. **The [Return-Path](/glossary/return-path/) is set during the SMTP `MAIL FROM` command** and stays hidden in the headers, and when a message bounces, the notification goes to the Return-Path rather than to the From address.

Email service providers set the Return-Path to an address on their own bounce-processing domain by default. That lets them receive every bounce, parse the codes, classify bounce types and update suppression lists without the sender's involvement. A message from `hello@yourapp.com` therefore leaves with a Return-Path on the provider's domain.

A custom Return-Path moves that address onto the sender's domain while keeping bounces flowing to the provider. The domain is delegated to the provider through a DNS record, so bounce handling works exactly as before and only the domain in the envelope changes.

## Why a custom Return-Path matters

[SPF](/glossary/spf/) is verified against the Return-Path domain, not the From domain. **With the default setup, SPF passes but does not align**: it authenticates the provider's bounce domain, which does not match `yourapp.com`. DMARC still passes as long as DKIM passes and aligns, but it depends on DKIM alone.

[DMARC alignment](/glossary/dmarc-alignment/) needs at least one of SPF or DKIM to pass and match the From domain. With a custom Return-Path both align, so if one fails, for example when a mailing list footer breaks the DKIM signature, the other can still satisfy DMARC. Some mailbox providers give a slight deliverability boost to messages aligned on both, and some email clients, notably Gmail, show a "via" label when the Return-Path domain differs from the From domain.

Alignment has two modes, set with the `aspf` tag in the DMARC record. Relaxed alignment (`aspf=r`), the default, requires only the organizational domains to match, so `mail.yourapp.com` aligns with `yourapp.com`. Strict alignment (`aspf=s`) requires an exact match.

## Common problems with a custom Return-Path

**Strict alignment is the most common reason SPF still fails to align.** A DMARC record with `aspf=s` combined with a Return-Path on `mail.yourapp.com` and a From address on `yourapp.com` does not align, because the domains are not identical. The fix is relaxed alignment or a DMARC record published at the subdomain level.

The From header and the Return-Path are easy to confuse. Changing the From address has no effect on SPF alignment, because only the Return-Path domain matters for SPF.

SPF records go stale during migrations. After a move between email service providers, the SPF record has to authorize the new provider's sending IPs, and an outdated `include:` directive causes SPF failures even with a custom Return-Path in place.

## Custom Return-Path in Lettr

**Lettr uses the sending domain itself as the bounce domain**, so there is no separate subdomain to configure. It is enabled on the domain's detail page under **Domains → Sending Domains**, in the **Bounce Domain** card, with the toggle labelled **Use this sending domain as bounce domain**.

The toggle stays disabled until the domain's CNAME record shows a `valid` status, with the warning "Verify the CNAME record before enabling." The same record is reported as `cname_status` by `POST /api/domains/{domain}/verify`, and no extra DNS changes are needed to turn the bounce domain on. Enabling it shows the confirmation "This domain is now used as the bounce domain." Turning the toggle off reverts the Return-Path to Lettr's default bounce domain.

Without the toggle, DMARC passes through DKIM alignment, because Lettr signs with `d=` set to the sending domain. With it enabled, a test email's `Authentication-Results` header shows `spf=pass` with `smtp.mailfrom` on the sending domain, next to `dkim=pass` and `dmarc=pass`. The [Custom Return-Path and MAIL FROM](https://docs.lettr.com/knowledge-base/fundamentals/custom-return-path) page in the Lettr docs covers the background and header checks.
