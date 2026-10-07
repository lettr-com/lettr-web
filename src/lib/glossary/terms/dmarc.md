---
term: DMARC
fullName: Domain-based Message Authentication, Reporting & Conformance
heading: "What is DMARC?"
description: "DMARC tells receiving servers what to do with email that fails SPF and DKIM alignment and sends reports back. Policies, rollout, and DMARC setup in Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [spf, dkim, dmarc-alignment, dmarc-aggregate-report, bimi]
reading:
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc#dmarc-domain-based-message-authentication-reporting--conformance
  - title: DMARC records in Lettr
    href: https://docs.lettr.com/learn/domains/dmarc
---

**DMARC (Domain-based Message Authentication, Reporting & Conformance)** is an email authentication standard that lets a domain owner tell receiving servers what to do with mail that fails authentication. It builds on [SPF](/glossary/spf/) and [DKIM](/glossary/dkim/), adds the requirement that the authenticated domain matches the From address a recipient sees, and gives the owner reports on who is sending mail under the domain. Without DMARC, a failed SPF or DKIM check is only information, and each receiving server decides on its own what to do with the message.

## How DMARC works

A domain publishes its DMARC policy as a DNS TXT record at `_dmarc.example.com`, such as `v=DMARC1; p=none; rua=mailto:dmarc@example.com`. **The `p=` tag sets the policy**, `rua=` names the address for aggregate reports and `ruf=` the address for forensic reports. Optional tags refine it: `pct=` applies the policy to a percentage of failing mail, `adkim=` and `aspf=` set strict or relaxed alignment, and `sp=` sets a separate policy for subdomains.

When a message arrives, the receiving server checks SPF and DKIM, then looks up the DMARC record for the domain in the From header. The message passes when at least one of the two checks passes and its domain matches the From domain, a rule called [alignment](/glossary/dmarc-alignment/). A failing message is handled according to the policy:

- **`p=none`:** monitor only, and the message is delivered as usual.
- **`p=quarantine`:** the message goes to the spam or junk folder.
- **`p=reject`:** the message is blocked and never delivered.

Subdomains inherit the parent domain's policy unless the record sets `sp=` or the subdomain publishes a DMARC record of its own.

## Why DMARC matters

**DMARC is what stops exact-domain spoofing.** SPF and DKIM on their own can pass for a domain the attacker controls while the From line shows someone else's, and alignment closes that gap. An enforced policy tells receivers to quarantine or reject mail that forges the domain.

Reporting is the other half. [Aggregate reports](/glossary/dmarc-aggregate-report/) arrive as daily XML files listing the source IP addresses sending as the domain, their SPF and DKIM results, the policy applied and the message volume from each source. [Forensic reports](/glossary/dmarc-forensic-report/) describe individual failures, but many receivers do not send them because they can contain sensitive message data.

DMARC is also a prerequisite elsewhere. Google and Yahoo require SPF, DKIM and DMARC from bulk senders, and [BIMI](/glossary/bimi/) displays a brand logo only for domains with a DMARC policy at enforcement.

## How to set up DMARC

**A gradual rollout avoids blocking legitimate mail.** The first record uses `p=none` with an `rua` address, and the reports are reviewed for a few weeks to find every service that sends as the domain, such as marketing platforms, CRM tools and help desks. Each of those needs SPF and DKIM configured with its own alignment before enforcement begins.

The policy then moves to `p=quarantine` at a low percentage, for example `pct=10`, and the percentage rises as reports confirm that legitimate mail passes. The final step is `p=reject`. Jumping straight to reject is one of the most damaging mistakes, because any unauthenticated source, such as a ticketing system or a forwarding rule, is blocked silently.

Two record errors come up often. Only one DMARC record may exist at `_dmarc.example.com`, and duplicates cause unpredictable results. The record must sit at `_dmarc` and not at the bare domain or at `dmarc.example.com`, and `v=DMARC1` must be the first tag.

## DMARC in Lettr

The DNS records for a Lettr sending domain include a DMARC record: a TXT record named `_dmarc` with the starting value `v=DMARC1; p=none; rua=mailto:dmarc@example.com`. **Domain endpoints report its state as `dmarc_status`**, with the values `valid`, `unverified`, `invalid` for a record with syntax errors, `missing` and `not_applicable`. On the dashboard, the status appears on the domain's page under **Domains** → **Sending**.

Lettr signs every email with a DKIM key specific to the sending domain, with `d=` matching that domain, so DKIM alignment passes, and it supports both relaxed and strict alignment. SPF alignment comes from enabling the sending domain as the bounce domain. For mail sent through Lettr, DMARC passes once the sending domain is verified and a DMARC record exists at `_dmarc.example.com`.

Other services that send as the same domain need their own alignment, because a `p=reject` policy blocks every source that fails authentication, not only Lettr. Domain Connect for Cloudflare skips an existing valid DMARC record instead of adding a duplicate. The [DMARC records page](https://docs.lettr.com/learn/domains/dmarc) in the Lettr docs covers the rollout steps, subdomain policies and troubleshooting.
