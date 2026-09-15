---
term: Sender Reputation
heading: "What is sender reputation?"
description: "Sender reputation is how mailbox providers judge a sender from its past mail, across domain and IP. What shapes it, how it is read, and Lettr's signals."
published: 2026-09-14
updated: 2026-09-15
related: [domain-reputation, ip-reputation, spam-complaint, bounce-rate, spam-trap]
reading:
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
  - title: Filtering and Breakdowns
    href: https://docs.lettr.com/learn/analytics/filtering-and-breakdowns
  - title: Domain Approval Process
    href: https://docs.lettr.com/learn/domains/approval
---

**Sender reputation** is the assessment a mailbox provider forms about a sender from the mail it has received from that sender over time. It decides whether new messages reach the inbox, go to spam, are delayed or are rejected outright. The term covers two tracked identities, the sending domain and the sending IP address, and every provider keeps its own private view of both.

## How sender reputation works

Providers record how their users and systems respond to each sender's mail and turn that history into filtering decisions. **The main inputs are behavioural**:

- **Bounces:** a high share of addresses that do not exist marks a list as old or carelessly collected.
- **Complaints:** recipients pressing the spam button send the strongest negative signal, which is why the [complaint](/glossary/spam-complaint/) rate is watched so closely.
- **Spam traps:** mail to [spam trap](/glossary/spam-trap/) addresses shows that a list was bought, scraped or never cleaned.
- **Engagement:** opens, replies, messages moved out of spam and deletions without reading show whether recipients want the mail.
- **Consistency:** steady volume looks like an established sender, while sudden bursts resemble a compromised account.

Authentication makes those signals attributable. SPF, DKIM and DMARC let a provider tie a message to a domain with confidence, so good and bad behaviour lands on the right identity instead of on anyone who forges the name.

## Domain reputation vs IP reputation

[Domain reputation](/glossary/domain-reputation/) belongs to the sending domain and follows it to any IP address or email provider. [IP reputation](/glossary/ip-reputation/) belongs to the address that delivered the mail and stays with that address. **Sender reputation is the combination a provider acts on**, and the weighting differs by provider: Gmail leans heavily on the domain, while Microsoft still gives the sending IP considerable weight.

Who shapes each half depends on the infrastructure. On shared IP addresses the IP-level history reflects every sender using them, so the domain is the part a single sender controls fully. On dedicated IPs both halves reflect one sender's behaviour, for better and for worse.

## Why sender reputation matters

Reputation builds and falls at different speeds. **It grows slowly through consistent, wanted mail and drops quickly** after a burst of complaints or a send to a stale list. A damaged reputation affects every message from the identity, including password resets and receipts, which is why many senders split transactional and marketing mail across separate subdomains.

Providers publish no score, but some expose part of their view. Google Postmaster Tools shows the domain reputation Gmail assigns, and Microsoft's SNDS reports a filtering result per IP address. A [bounce rate](/glossary/bounce-rate/) below 2% is healthy, and Google recommends keeping the spam complaint rate below 0.1%.

## Sender reputation in Lettr

**Lettr has no single reputation score**, and no API returns one. The docs recommend monitoring the individual signals through the dashboard and webhook data instead.

The Analytics dashboard carries the metrics behind bounce and complaint rates, including Bounces, Block Bounces (bounces caused by the recipient's server blocking the sending IP or domain), Delayed and Spam Complaints. Its filters and **Break Down By** table split them by Sending Domain, Sending IP and Mailbox Provider, which shows whether a problem belongs to one domain, one address or one provider. Each email's Message Details view shows the Sending IP that delivered it.

Lettr removes the most damaging signals automatically. Hard bounces, spam complaints, list unsubscribes and link unsubscribes are suppressed permanently, while soft bounces are retried and the address is suppressed only after repeated failures.

New sending domains go through automated approval scoring, because every domain on the platform affects the reputation of the IP addresses used for sending, and a domain scoring below 50 is blocked and flagged for manual review. Dedicated IPs are available as an add-on on the Business plan and on Enterprise. The [Sending Reputation](https://docs.lettr.com/knowledge-base/best-practices/sending-reputation) guide covers warm-up, subdomain strategy and recovery.
