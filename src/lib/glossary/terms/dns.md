---
term: DNS
fullName: Domain Name System
heading: "What is DNS?"
description: "DNS is the internet's directory that maps domain names to servers and stores the records email routing and authentication depend on. How it works and Lettr DNS."
published: 2026-09-14
updated: 2026-09-15
related: [mx-record, txt-record, cname-record, dns-propagation, zone-file]
reading:
  - title: Domains Introduction
    href: https://docs.lettr.com/learn/domains/introduction
  - title: Domain Verification Failures
    href: https://docs.lettr.com/knowledge-base/troubleshooting/domain-verification
---

**DNS (Domain Name System)** is the internet's distributed directory. It maps domain names to the information needed to use them, such as the IP address of a web server or the mail servers that accept email for a domain. Email depends on it at every step: sending servers use DNS to find where to deliver a message, and receiving servers use it to check whether the sender was authorized to send it.

## How DNS works

DNS is a hierarchy of servers. **The authoritative nameservers for a domain hold its records**, and the domain's registrar points the rest of the internet to them. Those nameservers are usually run by the registrar itself or by a DNS host such as Cloudflare or Amazon Route 53.

A lookup starts at a recursive resolver, typically run by an internet provider, a company network or a public service. The resolver follows the chain from the root servers to the servers for the top-level domain, such as `.com`, and then to the domain's authoritative nameservers, which return the answer. The resolver caches that answer for the number of seconds set in the record's TTL (time to live), so repeated lookups do not travel the whole chain again.

Every record has a name, a type, a value and a TTL. The name can be the domain itself or a hostname under it, such as `_dmarc.example.com`, and the type decides what the value means.

## DNS records email relies on

Several record types carry the information mail systems need:

- **[MX records](/glossary/mx-record/):** the mail servers that accept email for a domain, each with a priority.
- **[TXT records](/glossary/txt-record/):** free-form text, used for the SPF policy at the domain and the DMARC policy at `_dmarc`.
- **[CNAME records](/glossary/cname-record/):** an alias from one hostname to another, often used to delegate a hostname to a service provider.
- **A and AAAA records:** the IPv4 and IPv6 addresses behind a hostname.
- **[PTR records](/glossary/ptr-record/):** reverse DNS, mapping an IP address back to a hostname, which receiving servers compare with the name the sending server uses.

DKIM public keys are published in DNS too, under names of the form `selector._domainkey.example.com`. PTR records are the exception to domain ownership: they are controlled by whoever owns the IP address, which for most senders is their email service provider.

## Common problems with DNS for email

**Most DNS failures in email setup are entry mistakes.** A domain can have only one SPF record, and adding a second one when configuring a new service breaks SPF validation. A CNAME record cannot share its name with any other record type, so a CNAME at a name that already has A, MX or TXT records conflicts with them. Many control panels append the zone name automatically, which turns a pasted full hostname into `mail.example.com.example.com`.

Provider behavior causes the next group. Cloudflare's proxy mode rewrites DNS responses and makes CNAME verification fail unless the record is set to DNS only. Some DNS interfaces truncate long TXT values, and some providers do not accept record names that start with an underscore, which both `_domainkey` and `_dmarc` require.

Timing is the last factor. Resolvers keep serving cached answers until the TTL expires, so [DNS propagation](/glossary/dns-propagation/) can take up to 48 hours, and a check run straight after a change can fail even when the record is correct.

## DNS in Lettr

Lettr uses DNS records to establish that a sender owns a domain and has authorized Lettr to send, track and receive email on its behalf. **Lettr supports four domain types**, sending, tracking, inbound and storage, and the domain's detail page always shows the full set of record types, names and values it needs. Root sending domains need SPF, DKIM and DMARC records, while subdomains need DKIM, DMARC and a bounce CNAME. An inbound domain needs three MX records, all at priority 10.

Each DNS record has its own verification status: `valid`, `unverified`, `invalid`, `missing` or `not_applicable`, the last for a record the domain type does not require. The domain API response includes a `dns_provider` field. For domains hosted on Cloudflare, Domain Connect adds the records in one step, and the knowledge base has step-by-step DNS guides for other providers.

After verification, a daily DNS health check watches every verified domain. When a record that used to work stops resolving, Lettr shows a red **Not working** badge next to the domain and can alert by email or deliver a `domain_dns_regression` webhook event. The check is informational and never stops sending. The [Domain Verification Failures](https://docs.lettr.com/knowledge-base/troubleshooting/domain-verification) page in the Lettr docs covers the common record mistakes and provider-specific issues.
