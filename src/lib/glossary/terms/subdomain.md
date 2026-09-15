---
term: Subdomain
question: What is
description: "A subdomain is a named section of a domain, such as mail.example.com, often used for sending email. How subdomains affect DNS, DMARC and setup in Lettr."
related: [reputation-isolation, dmarc, cname-record, zone-apex, tracking-domain]
reading:
  - title: Subdomain vs Root Domain for Sending
    href: https://docs.lettr.com/knowledge-base/fundamentals/subdomain-vs-root
  - title: Sending Domains
    href: https://docs.lettr.com/learn/domains/sending-domains
  - title: DMARC Records
    href: https://docs.lettr.com/learn/domains/dmarc
---

**A subdomain** is a domain name nested under another domain, formed by adding a label in front of it: `mail.example.com` and `news.example.com` are subdomains of `example.com`. In DNS each subdomain can carry its own records, so it can have its own mail servers, authentication records and hosting independent of the root domain. Email senders use subdomains to separate kinds of mail from each other and from the company's own mailboxes.

## How subdomains work in email

**DNS treats every subdomain as a name of its own.** A lookup for `mail.example.com` returns the records published at that exact name, not those at `example.com`, so MX and SPF records at the root do not apply to a subdomain. A subdomain used for sending needs its own authentication setup, including a DKIM key published for it.

DMARC is the exception. A receiver looks for a DMARC record at the exact From domain first and, when none exists, falls back to the record of the organisational domain, so a policy at `example.com` covers subdomains that publish none of their own. The `sp` tag in that root record can set a separate policy for those subdomains, and a subdomain can publish its own record to override both.

Subdomains also play into [DMARC](/glossary/dmarc/) alignment. Under relaxed alignment, which is the default, `mail.example.com` and `example.com` count as aligned because they share an organisational domain. Strict alignment requires an exact match.

## Why subdomains matter for sending

**Separate subdomains let separate mail streams keep separate histories** with mailbox providers, which is the basis of [reputation isolation](/glossary/reputation-isolation/). Transactional mail on one subdomain and marketing on another means that complaints about a campaign weigh less on password resets and receipts. Providers can still take the organisational domain into account, so the separation is partial.

Subdomains also keep email infrastructure away from the root domain's everyday mail. Records for a sending service, a bounce domain, inbound processing or link tracking can sit on subdomains without touching the MX records that route employee mailboxes, and a problem with a sending subdomain leaves the root's [domain reputation](/glossary/domain-reputation/) less exposed.

A new subdomain starts without any sending history, so its volume should rise gradually. Recipients see the subdomain in the From address as well, which makes plain names such as `mail` or `news` a better choice than internal codes.

## Common problems with subdomains

- **Record placement:** a [CNAME record](/glossary/cname-record/) cannot share a name with other records, which rules out many service records at a root domain but rarely affects a dedicated subdomain.
- **Inherited DMARC policy:** a subdomain without its own record inherits the root policy, including `p=reject`, which can block a new service that is not yet aligned.
- **Host field mistakes:** DNS providers that append the zone automatically turn a fully typed `mail.example.com` into `mail.example.com.example.com`.
- **Too many streams:** every subdomain needs steady volume to build a reputation, and very small streams stay unknown to providers.

## Subdomain in Lettr

**Lettr's DNS requirements differ for root domains and subdomains.** Root domains need SPF, DKIM and DMARC, while subdomains need DKIM, DMARC and the bounce CNAME. Each subdomain used to separate email types is added in Lettr as a separate sending domain, and the Subdomain vs Root Domain guide considers subdomain sending best for most senders, especially those sending both marketing and transactional email.

The DMARC Records page explains that subdomains inherit the parent domain's policy, that `sp=` applies a different policy to subdomains, and that a subdomain can have its own record, such as one at `_dmarc.mail.example.com`. It also notes that relaxed alignment allows subdomains to match, so `mail.yourcompany.com` aligns with `yourcompany.com`.

Other domain types follow the same pattern. The docs recommend a subdomain for inbound email, which lets the root domain's MX records keep pointing to the regular email provider, and they note that a domain or subdomain can have only one set of MX records. A [tracking domain](/glossary/tracking-domain/) is a custom subdomain used for click tracking links and open tracking pixels, added under **Domains** → **Tracking** in the dashboard.

The [Subdomain vs Root Domain for Sending](https://docs.lettr.com/knowledge-base/fundamentals/subdomain-vs-root) guide walks through the trade-offs of each approach.
