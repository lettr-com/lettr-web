---
term: Zone Apex
description: "The zone apex is the root of a DNS zone, such as example.com, where SOA, NS and MX records live. Why a CNAME cannot sit there and Lettr's advice."
related: [cname-record, subdomain, dns, zone-file, reputation-isolation]
reading:
  - title: Subdomain vs Root Domain for Sending
    href: https://docs.lettr.com/knowledge-base/fundamentals/subdomain-vs-root
  - title: Domain Verification Failures
    href: https://docs.lettr.com/knowledge-base/troubleshooting/domain-verification
---

**The zone apex** is the top name of a DNS zone: the domain itself with no label in front of it, such as `example.com`. It is also called the root domain or the naked domain, and many DNS control panels and [zone files](/glossary/zone-file/) write it as `@`. The apex holds the records that define the zone and usually the records that route the company's own email.

## How the zone apex works

A DNS zone is the part of the namespace that one set of authoritative nameservers answers for. **Every zone must publish an SOA record and NS records at its apex.** The SOA (start of authority) record names the primary nameserver and carries the zone's serial number and timing values, and the NS records list the nameservers the parent zone delegates to. A subdomain such as `mail.example.com` can be delegated as a zone of its own, and it then has its own apex with its own SOA and NS records.

RFC 1034 does not allow a CNAME record to share a name with any other record. Because the apex always holds SOA and NS records, a CNAME there breaks the standard, and many DNS providers refuse to create one.

Providers work around it with non-standard record types. ALIAS and ANAME records, and Cloudflare's CNAME flattening, accept a hostname as the target but answer queries with that hostname's A and AAAA addresses. The answer is still an address, so a service checking for a CNAME at that name finds none.

## Why the zone apex matters for email

**Most of a domain's email records sit at the apex or directly under it.** [MX records](/glossary/mx-record/) at `example.com` route mail addressed to `user@example.com`, and the domain's SPF policy is a TXT record at the same name. A second `v=spf1` record there makes SPF evaluation fail, so every service authorized for the apex domain shares one record.

Other email records use names one or two labels below the apex. The [DMARC](/glossary/dmarc/) policy lives at `_dmarc.example.com` and DKIM keys at `selector._domainkey.example.com`. A DMARC record for the apex also covers subdomains that publish none of their own.

## Zone apex vs subdomain

A [subdomain](/glossary/subdomain/) is a separate name with its own record set, so a [CNAME record](/glossary/cname-record/) at `mail.example.com` does not conflict with anything at `example.com`. That is why a record that has to be a CNAME, such as a click tracking hostname, goes on a subdomain rather than at the apex.

**Reputation is the second reason senders keep application mail off the apex.** Mailbox providers keep a history for each sending domain, and a subdomain per mail stream is the basis of [reputation isolation](/glossary/reputation-isolation/): receipts on `mail.example.com` and newsletters on `news.example.com` build separate records. The separation is partial, since providers can still weigh the organizational domain.

## Common problems with the zone apex

- **Doubled names:** a panel that appends the zone turns a typed `example.com` into `example.com.example.com`, so the apex is entered as `@` or left blank, depending on the provider.
- **Replaced MX records:** changing the apex MX records to add a new service moves all of the domain's incoming mail.
- **Silent conversion:** some providers turn a CNAME entered at `@` into an ALIAS without an error, and the record list no longer shows a CNAME.

## Zone apex in Lettr

Lettr's Subdomain vs Root Domain guide names **the CNAME conflict at the zone apex as the most common technical reason to choose a subdomain**, and it recommends that most Lettr users start with a subdomain such as `mail.yourdomain.com` for transactional email.

The DNS provider guides repeat the rule for individual hosts. AWS Route 53, Google Cloud DNS, Gandi and Namecheap do not support CNAME records at the apex, Hostinger silently converts a CNAME at `@` into an ALIAS record, and each of those guides advises a subdomain instead. The tracking domain and storage domain pages also recommend a dedicated subdomain over the root domain.

Inbound domains can use either: the three MX records take `@` as the host for the root domain, or a label such as `mail` for `mail.example.com`. The docs recommend a subdomain, which keeps the root domain's MX records pointing at the regular email provider. For DMARC, the guide suggests a record on the root domain with relaxed alignment and a subdomain policy, which covers every subdomain without an individual record on each. The [Subdomain vs Root Domain for Sending](https://docs.lettr.com/knowledge-base/fundamentals/subdomain-vs-root) guide covers the trade-offs.
