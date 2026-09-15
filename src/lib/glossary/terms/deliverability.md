---
term: Deliverability
heading: "What is deliverability?"
description: "Deliverability is an email's ability to reach the inbox, not just the receiving server. The factors behind it, how to measure it and what Lettr shows about it."
published: 2026-09-14
updated: 2026-09-14
related: [delivery, inbox-placement, sender-reputation, list-hygiene, email-engagement]
reading:
  - title: What Is Email Deliverability?
    href: https://docs.lettr.com/knowledge-base/concepts/email-deliverability
  - title: Deliverability Best Practices
    href: https://docs.lettr.com/knowledge-base/best-practices/deliverability
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
---

**Deliverability** is the ability of an email to reach the recipient's inbox instead of the spam folder, a promotions tab or quarantine, and to avoid being rejected outright. It is a stricter measure than [delivery](/glossary/delivery/), which only records that the receiving server accepted the message. A sender can have near-perfect delivery and poor deliverability at the same time, because accepted mail can still be filtered out of sight.

## How deliverability is decided

Every mailbox provider runs its own filtering, and the exact rules are not public. The signals they weigh fall into the same few groups, and a weakness in any one of them can send mail to spam.

**Authentication comes first.** SPF, DKIM and DMARC show that the sending domain authorized the message and that it was not altered in transit. Since February 2024, Google and Yahoo require all three from bulk senders, and mail that fails authentication is likely to be rejected or filtered immediately.

[Sender reputation](/glossary/sender-reputation/) is the provider's memory of how a domain and its sending IP addresses have behaved: bounce rates, complaint rates, spam trap hits and how steady the volume is. List quality feeds directly into it, since mailing addresses that no longer exist or never opted in produces the negative signals that damage reputation.

Content is scanned for spam patterns such as misleading subject lines, image-only bodies, URL shorteners and missing unsubscribe links. [Engagement](/glossary/email-engagement/) completes the picture: opens, clicks, replies and messages moved out of spam count in the sender's favor, and a spam report is the strongest signal against it. The final placement is made per recipient, so the same message can reach one person's inbox and another person's spam folder.

## Why deliverability is hard to measure

Mailbox providers do not tell senders where a message was placed. Spam placement produces no error and no bounce, so deliverability has to be inferred from other numbers. **Delivery rate shows acceptance, not placement.** Bounce rate and spam complaint rate show list quality and recipient reaction. Open rate hints at inbox placement but is unreliable, because Apple Mail Privacy Protection pre-fetches tracking pixels and corporate proxies do the same, so click rate is the steadier engagement signal.

A sharp drop in open rate at one provider, while other providers look normal, usually means that provider has started routing mail to spam. [Inbox placement](/glossary/inbox-placement/) tests confirm it directly by sending to seed accounts at the affected provider and checking which folder the message lands in.

## Common problems with deliverability

The most common mistake is treating a high delivery rate as success, when a large share of accepted mail can still sit in spam. Sending to purchased or scraped lists is the most damaging, because those lists contain spam traps and recipients who never asked for the mail. Sudden jumps in volume trigger filtering even for senders with clean lists, which is why new domains and new IP addresses are warmed up gradually.

Mixing streams causes quieter damage. Marketing email naturally draws lower engagement and more complaints than transactional email, and when both share one sending domain, marketing problems can push password resets and receipts into spam. Separate subdomains keep the reputations apart, and regular [list hygiene](/glossary/list-hygiene/), such as removing hard bounces, complainers and long-inactive subscribers, keeps the signals from each stream healthy.

## Deliverability in Lettr

Lettr has **no single reputation score and no API that returns one**. Deliverability is read from the individual signals instead. The Analytics dashboard reports delivery metrics such as Accepted, Bounces, Block Bounces and Delayed, next to engagement metrics including Unique Opens, Unique Clicked and Spam Complaints. The breakdown table can group those metrics by Recipient Domain or Mailbox Provider, which surfaces a problem at a single provider when the overall numbers look healthy.

Several protections run automatically. Hard-bounced addresses are added to the suppression list, recipients who report an email as spam are suppressed immediately, and every message is signed with a DKIM key for the sending domain. New sending domains are scored before they can send, which keeps bad actors from damaging the IP addresses shared by legitimate senders. The Lettr docs also recommend separate subdomains for marketing and transactional mail. The [Deliverability Best Practices](https://docs.lettr.com/knowledge-base/best-practices/deliverability) page in the Lettr docs covers authentication, warm-up and list maintenance.
