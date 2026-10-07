---
term: Domain Connect
heading: "What is Domain Connect?"
description: "Domain Connect is an open protocol that applies a service's DNS records through one signed link. How it works, its limits, and Lettr's Cloudflare setup."
published: 2026-09-14
updated: 2026-09-14
related: [dns, dns-propagation, cname-record, spf, dmarc]
reading:
  - title: Domains Introduction
    href: https://docs.lettr.com/learn/domains/introduction
  - title: Domain Connect
    href: https://docs.lettr.com/learn/domains/domain-connect
  - title: Cloudflare DNS Guide
    href: https://docs.lettr.com/knowledge-base/dns-guides/cloudflare
---

**Domain Connect** is an open protocol that lets an online service configure the DNS records it needs at a customer's DNS provider through a single signed link. Instead of copying record types, names and values into a control panel by hand, the customer follows the link, reviews the proposed changes at the DNS provider and approves them in one step. For email, it replaces the most error-prone part of setting up a sending domain.

## How Domain Connect works

The protocol has two sides. **The service provider**, such as an email platform, defines the records it needs in a template that the DNS provider knows about in advance. The DNS provider hosts the domain's zone and applies templates on the customer's behalf.

To start, the service checks whether the domain's DNS host supports the protocol, which it discovers through a `_domainconnect` record on the domain. It then builds a URL that names the template and fills in the values specific to this customer, such as a DKIM public key, and signs that URL with its private key. The DNS provider verifies the signature against the service's published public key, so nobody can change the records in transit.

The customer signs in at the DNS provider, sees a summary of every record that will be added and clicks to apply. The provider writes the records through its own systems and redirects the browser back to the service, which can then check that the records resolve. In this synchronous flow the service never receives standing access to the DNS zone; each change needs the customer's approval.

## Why Domain Connect matters

**Manual DNS entry is where most domain setup problems start.** A wrong record type, a DKIM key truncated by a narrow input field, a hostname doubled because the panel appended the zone name, or a CNAME left in proxy mode each cause a verification failure that can take time to diagnose. With Domain Connect, the values come straight from the service and the DNS provider handles the details of its own interface.

The review step keeps the customer in control. Every record is shown before it is written, and the signature proves the proposed records came from the service and were not altered. That combination makes one-click setup safer than pasting values from an email or a chat message.

## Limitations of Domain Connect

Support depends on the DNS host, not the registrar. **A domain registered at one company but hosted on another company's nameservers** can use Domain Connect only if the DNS host supports it and has the service's template, and otherwise the records are still added manually.

Existing records need care. Applying a template on top of a partly configured domain can create duplicates, and some duplicates break things: a domain with two SPF records fails SPF validation, and two [DMARC](/glossary/dmarc/) records produce unpredictable results. Well-behaved implementations check the current zone before applying.

Domain Connect speeds up writing the records, not resolving them. [DNS propagation](/glossary/dns-propagation/) still applies, so a verification run immediately after applying can fail briefly while external resolvers catch up.

## Domain Connect in Lettr

Domain Connect in Lettr is **currently available for domains whose DNS is managed by Cloudflare**. For those domains, the domain's detail page shows a **Configure with Cloudflare** button, and the flow works for sending, tracking and inbound domains. Lettr generates a cryptographically signed URL containing every record the domain needs, Cloudflare verifies the signature and shows the records for review, and after **Apply** Cloudflare redirects back to the domain's detail page in Lettr for verification.

The records depend on the domain. A root sending domain gets [SPF](/glossary/spf/), DKIM and DMARC records, while a sending subdomain gets a [CNAME record](/glossary/cname-record/) with DKIM and DMARC, and an inbound domain gets three MX records. Domain Connect checks the existing configuration first and skips valid DMARC or SPF records already in place, so it can be used on a partly configured domain. CNAME records are created in DNS only mode, which avoids the proxy-mode verification failure.

After the records are applied, a failed first check can be repeated after a minute or two. Domains on other [DNS](/glossary/dns/) providers are configured manually from the values on the domain's detail page, with provider-specific DNS guides in the knowledge base. The [Domain Connect page](https://docs.lettr.com/learn/domains/domain-connect) in the Lettr docs lists the records each domain type receives.
