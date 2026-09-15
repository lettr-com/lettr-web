---
term: Reputation Isolation
question: What is
description: "Reputation isolation sends each email stream from its own subdomain or IPs so a problem in one stays contained. How it works and how to set it up in Lettr."
related: [subdomain, domain-reputation, dedicated-ip, transactional-email, marketing-email]
reading:
  - title: Subdomain vs Root Domain for Sending
    href: https://docs.lettr.com/knowledge-base/fundamentals/subdomain-vs-root
  - title: Transactional vs Marketing Email
    href: https://docs.lettr.com/knowledge-base/best-practices/transactional-vs-marketing
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
---

**Reputation isolation** is the practice of sending different types of email from separate identities, usually separate subdomains and sometimes separate IP addresses, so that each stream builds its own reputation with mailbox providers. A problem in one stream, such as a campaign that draws complaints, then has much less effect on the others, above all on transactional mail like password resets and receipts.

## How reputation isolation works

Mailbox providers keep a reputation for the domains that send to them and for the IP addresses that deliver the mail. Isolation works on either level:

- **Domain separation:** each stream gets its own [subdomain](/glossary/subdomain/), such as `mail.example.com` for transactional email and `news.example.com` for newsletters. Each subdomain is authenticated separately and builds its own sending history.
- **IP separation:** each stream is delivered from its own set of addresses, typically [dedicated IPs](/glossary/dedicated-ip/) split into pools. On shared IPs the IP-level signal is pooled with other senders, so the domain is the part a sender separates.

**Domain separation is the lever most senders use**, because it needs only DNS records and no dedicated infrastructure. It is not absolute. Providers can also take the organizational domain into account, so a subdomain with a poor record can still weigh on its siblings to some degree.

Streams are usually defined by purpose. The common split is transactional and marketing, and larger senders add further streams for product notifications or system alerts.

## Why reputation isolation matters

[Marketing email](/glossary/marketing-email/) draws more complaints, unsubscribes and ignored messages than [transactional email](/glossary/transactional-email/), and its volume comes in large batches. **Filtering decisions for a shared domain reflect the combined behaviour of everything sent from it**, so when both streams share one domain, complaint-heavy campaigns lower the standing of order confirmations and login codes that recipients are waiting for.

Separation also protects the root domain. Employee mailboxes on `example.com` keep their own [domain reputation](/glossary/domain-reputation/) when product and marketing mail go out from subdomains. Diagnosis gets easier as well, since tools that report per domain show each stream's complaint and spam rates on their own.

## Best practices for reputation isolation

- **Keep each stream true to its purpose:** a promotion sent from the transactional subdomain brings marketing complaints into the stream the separation was meant to protect.
- **Warm up new subdomains:** a new subdomain starts without history, so volume should rise gradually instead of starting at full size.
- **Avoid splitting too finely:** every stream needs enough steady volume to hold a reputation, and a tiny stream on its own dedicated IP can perform worse than a shared one.
- **Cover subdomains with DMARC:** a DMARC record on the root domain also governs subdomains that publish none of their own, and its `sp` tag can set a separate subdomain policy.

## Reputation isolation in Lettr

**The Lettr docs describe separating transactional and marketing email on different sending domains or subdomains** as a common practice to protect transactional sender reputation. The Transactional vs Marketing guide uses `mail.yourdomain.com` for transactional email and `campaigns.yourdomain.com` for marketing, and each subdomain builds its own sender reputation independently. The Subdomain vs Root Domain guide recommends that most Lettr users start with a subdomain like `mail.yourdomain.com` for transactional email and add more subdomains later.

Templates follow the same split. Every Lettr template belongs to one of two modes, **Transactional** for sending through the API or SMTP and **Marketing** for campaigns. API sends can also carry a [`tag`](/glossary/tag/) of up to 64 characters to group related sends for analytics.

Lettr has no single reputation score, and the Sending Reputation guide recommends monitoring the individual signals through the dashboard and webhook data instead. Dedicated IPs, for IP-level separation, are available as an add-on on the Business plan and on Enterprise. The [Subdomain vs Root Domain for Sending](https://docs.lettr.com/knowledge-base/fundamentals/subdomain-vs-root) page walks through the trade-offs.
