---
term: SPF
fullName: Sender Policy Framework
question: What is
description: "SPF is a DNS record listing which servers may send email for a domain, checked against the envelope sender. How SPF works, where it breaks, and Lettr."
related: [dkim, dmarc, envelope-from, dmarc-alignment, txt-record]
reading:
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
  - title: SPF Records
    href: https://docs.lettr.com/learn/domains/spf
  - title: Sending Domains
    href: https://docs.lettr.com/learn/domains/sending-domains
---

**SPF (Sender Policy Framework)** is an email authentication standard that lets a domain owner publish which mail servers may send email using that domain. The list lives in a DNS [TXT record](/glossary/txt-record/) at the domain, and a receiving server compares the IP address of the server delivering a message against it. SPF is defined in RFC 7208 and is one of the three checks, with DKIM and DMARC, that major mailbox providers expect from bulk senders.

## How SPF works

**SPF checks the envelope sender, not the visible From address.** During the SMTP session the receiving server takes the domain from the `MAIL FROM` command, the [envelope from](/glossary/envelope-from/) address that is later recorded as the Return-Path header, and looks up that domain's TXT record beginning with `v=spf1`. When the envelope sender is empty, as it is for bounce messages, the check uses the domain from the HELO or EHLO greeting instead.

The record is a list of mechanisms read from left to right. `ip4:` and `ip6:` name addresses or ranges, `a` and `mx` authorise the addresses behind the domain's own A and MX records, and `include:` pulls in another domain's SPF record, which is how a domain authorises an email service provider. The closing `all` mechanism covers every other server, and its qualifier decides the result:

- **`-all` (fail):** servers not listed are not authorised, and the receiver may reject the message.
- **`~all` (softfail):** servers not listed are probably not authorised, and the message is usually accepted but treated with suspicion.
- **`?all` (neutral):** the record makes no statement about servers not listed.

The outcome, such as `pass`, `fail`, `softfail`, `none` or `permerror`, is recorded in the `Authentication-Results` header.

## SPF vs DKIM and DMARC

[DKIM](/glossary/dkim/) signs the message itself, so its result survives relaying, while SPF validates only the server that handed the message over. **Forwarding is where SPF breaks.** A forwarding server resends the message from its own IP address, which is not in the original domain's record, so SPF fails even though the mail is legitimate.

SPF alone also says nothing about the From address a recipient sees. [DMARC](/glossary/dmarc/) closes that gap with [alignment](/glossary/dmarc-alignment/): an SPF pass counts toward DMARC only when the envelope domain matches the From domain. A provider that uses its own bounce domain passes SPF for that domain, which leaves DMARC depending on DKIM unless the envelope is moved onto the sender's domain.

## Common problems with SPF

- **More than one record:** a domain may publish only one SPF record, and two `v=spf1` records produce a `permerror`, so every sending service has to be merged into a single record.
- **The 10-lookup limit:** mechanisms that trigger DNS queries, including `include:`, `a`, `mx` and nested includes, may add up to at most 10 lookups, and a record over the limit fails with `permerror`.
- **Wrong hostname:** SPF is not inherited, so a record at the root domain does not cover a subdomain used in the envelope sender.
- **Stale includes:** services that no longer send for the domain still use up lookups and widen the set of authorised servers.
- **Rushing to `-all`:** a hard fail published before every legitimate source is listed can get real mail rejected.

## SPF in Lettr

**Lettr's SPF Records page calls for a single SPF record per domain**, merging every email service into one TXT record, and warns that multiple SPF records cause authentication failures. It recommends `~all` while setting up and `-all` once all legitimate sending sources are included, and it notes the limit of 10 DNS lookups, suggesting the removal of unused services or an SPF flattening service when a record exceeds it.

Record requirements depend on the kind of sending domain: root domains need SPF, DKIM and DMARC, while subdomains need DKIM, DMARC and the bounce CNAME. When SPF does not verify, the troubleshooting table advises making sure the TXT record is on the root domain rather than a subdomain. The domain verification endpoint, `POST /api/domains/{domain}/verify`, returns `spf_status` alongside `dkim_status`, `cname_status` and `dmarc_status`, and the domain details response from `GET /api/domains/{domain}` includes `spf_status` as well.

For DMARC, Lettr signs emails with the sending domain so that DKIM alignment passes. SPF alignment comes from the **Bounce Domain** card on the sending domain's page: its toggle **Use this sending domain as bounce domain** stays disabled until the domain's CNAME record is valid, and once enabled, bounce messages use the sending domain's Return-Path, giving SPF alignment alongside DKIM. The [SPF Records](https://docs.lettr.com/learn/domains/spf) page covers merging records for common combinations of email services.
