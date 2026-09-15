---
term: DMARC Aggregate Report (RUA)
heading: "What is a DMARC aggregate report (RUA)?"
description: "A DMARC aggregate report is the daily XML summary receivers send about mail using a domain. What RUA reports contain and how they fit a Lettr domain."
published: 2026-09-14
updated: 2026-09-14
related: [dmarc, dmarc-forensic-report, dmarc-alignment, spf, dkim]
reading:
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
  - title: DMARC records in Lettr
    href: https://docs.lettr.com/learn/domains/dmarc
---

**A DMARC aggregate report (RUA)** is an XML file that a receiving mail server sends to the address listed in a domain's DMARC record. It summarizes how mail claiming to come from that domain did against SPF, DKIM and DMARC, covering legitimate services and anyone forging the domain alike. Aggregate reports are the main way a domain owner learns which sources send as the domain before tightening its DMARC policy.

## How aggregate reports work

The `rua` tag in the [DMARC](/glossary/dmarc/) record names the destination, as in `v=DMARC1; p=none; rua=mailto:dmarc@example.com`. **Receivers that support reporting collect results over a reporting interval**, 24 hours by default, and then email a compressed XML file to that address. Each receiver sends its own report, so a domain that mails Gmail, Outlook.com and Yahoo users gets a separate file from each of them.

The file opens with metadata: the reporting organization, the date range and the policy the receiver found published. One record per sending source follows. A record groups messages by source IP address and gives the message count, the disposition the receiver applied (none, quarantine or reject), the [SPF](/glossary/spf/) and [DKIM](/glossary/dkim/) results, and whether each result aligned with the domain in the visible From header.

Aggregate reports contain no message content, subject lines or recipient addresses. Per-message detail belongs to the [forensic report](/glossary/dmarc-forensic-report/) (RUF), which fewer receivers send because of privacy concerns.

## Why aggregate reports matter

**A `p=reject` policy blocks every source that fails DMARC**, including legitimate ones that were never configured, such as a help desk, a CRM or a billing system sending as the domain. Aggregate reports reveal those sources while the policy is still `p=none`, so each one can be authenticated before enforcement starts. The usual rollout reads reports at `p=none`, moves to `p=quarantine`, and switches to `p=reject` once the reports show only authenticated mail.

Reports also expose spoofing. An unfamiliar source IP sending volume with SPF and DKIM both failing is either forged mail or a forgotten service, and the aggregate report is where it shows up first.

## Common problems with aggregate reports

Raw XML is hard to read at volume, **so most domain owners feed reports into a parsing service** instead of opening files by hand. A domain with steady traffic can receive many reports a day from different receivers.

Missing reports have a few common causes. A typo in the `rua` address sends reports nowhere, the destination mailbox may reject XML attachments or file them as spam, and some receivers skip reports for low-volume domains. When the `rua` address sits on a different domain from the one publishing the policy, the domain receiving the reports has to publish a DNS record authorizing it, or receivers do not send them.

[Alignment](/glossary/dmarc-alignment/) is the part most often misread. A source can show SPF and DKIM passing and still fail DMARC when neither passing domain matches the From domain, and the report records that as a failed policy evaluation next to the passing authentication results.

## Aggregate report in Lettr

Lettr's example DMARC record for a sending domain includes a `rua` tag, `v=DMARC1; p=none; rua=mailto:dmarc@example.com`, so reporting is part of the setup from the start. **A DMARC record is required for every sending domain**, root domains and subdomains alike, and domain verification reports it as `dmarc_status`, with values such as `valid`, `invalid` for a record with syntax errors, and `missing`.

Lettr signs every message with a DKIM key specific to the sending domain and sets the `d=` value to that domain, so DKIM alignment passes for mail sent from a verified domain. Sources from other services that send as the same domain need their own SPF and DKIM configuration, and the reports are where gaps in that configuration appear.

The Lettr DMARC guide recommends starting at `p=none` for 2 to 4 weeks while reviewing reports, then moving to `p=quarantine` with a low `pct` value and raising it before switching to `p=reject`. It also points to report analysis tools such as dmarcian and Postmark DMARC for reading the XML. The [DMARC records page](https://docs.lettr.com/learn/domains/dmarc) covers the full rollout and the report contents.
