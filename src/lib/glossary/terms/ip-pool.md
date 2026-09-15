---
term: IP Pool
heading: "What is an IP pool?"
description: "An IP pool is a group of sending IP addresses an email provider uses together for a set of senders or traffic. Shared vs dedicated pools, and what Lettr shows."
published: 2026-09-14
updated: 2026-09-14
related: [shared-ip, dedicated-ip, ip-reputation, reputation-isolation, warm-up]
reading:
  - title: Dedicated vs Shared IPs
    href: https://docs.lettr.com/knowledge-base/concepts/dedicated-vs-shared-ips
  - title: How Email Delivery Works
    href: https://docs.lettr.com/knowledge-base/fundamentals/how-email-delivery-works
  - title: Billing
    href: https://docs.lettr.com/learn/settings/billing
---

**An IP pool** is a group of IP addresses that an email service provider uses together to send mail. Instead of tying each message to one fixed address, the provider distributes outgoing traffic across the addresses in a pool and manages their reputation as a group. Pools let a provider keep different groups of senders or kinds of mail apart, so the sending behaviour on one pool does not affect mail sent from another.

## How IP pools work

**Every outgoing message is assigned to a pool before delivery**, based on the sender's account, the type of mail or rules set by the provider. The delivery system then picks an address from that pool for its connections to receiving servers, which spreads volume across the addresses instead of loading it onto one.

Mailbox providers see individual IP addresses, not pools. Each address builds its own [IP reputation](/glossary/ip-reputation/) from the mail sent through it, so the health of a pool is the combined health of its addresses. Consistent volume and sending behaviour across the pool keeps those reputations close together.

Pool membership is a management decision on the provider's side. New addresses have no history and are brought into service gradually, while addresses that develop reputation problems can be taken out of rotation.

## Shared pools vs dedicated pools

**A shared pool carries mail from many senders.** Its addresses already have an established reputation from ongoing use, so a new sender can start without a warm-up, and the provider monitors the pool and removes bad actors. The reputation of each [shared IP](/glossary/shared-ip/) reflects everyone sending through it, so a poor sender can affect the others until the provider steps in.

A dedicated pool holds one or more [dedicated IPs](/glossary/dedicated-ip/) used by a single account. The sender's reputation on those addresses depends only on its own mail, which suits high and consistent volume. A new dedicated address needs a [warm-up](/glossary/warm-up/) over several weeks, and an address that sends too little or too irregularly can look inactive or suspicious to mailbox providers.

Reputable providers keep shared pools healthy through strict sending policies and abuse monitoring, so the value of a shared pool depends heavily on how strictly the provider enforces them.

## Why IP pools matter

**Pools are the IP-level tool for [reputation isolation](/glossary/reputation-isolation/).** Putting transactional mail such as password resets on a different pool from marketing campaigns keeps complaints about a promotion from affecting the delivery of time-sensitive messages. Providers apply the same idea between customers, keeping new or higher-risk senders away from established ones.

IP reputation is only part of the picture. Major mailbox providers, Gmail in particular, weigh the sending domain's reputation heavily, and a domain's reputation follows it across pools and across providers. A well-run pool supports a sender with good practices, but it does not repair a domain with a poor sending history.

## IP pool in Lettr

**Lettr maintains a pool of sending IPs with established reputations** and provides dedicated IP options for high-volume senders. On the billing page, dedicated IPs are available as an add-on on the Business plan and are listed among the features of the Enterprise plan, for which the page directs inquiries to info@lettr.com.

Each email's Message Details view shows the Sending IP, the IP address from which Lettr delivered the email to the recipient's mail server. The Analytics dashboard can filter metrics by Sending IP and break them down by the Lettr IP that delivered each email, and webhook payloads for events such as bounces include a `sending_ip` field. The Block Bounces metric counts bounces caused specifically by the recipient's server blocking the sending IP or domain. The [Dedicated vs Shared IPs](https://docs.lettr.com/knowledge-base/concepts/dedicated-vs-shared-ips) page covers when each option fits and a typical warm-up schedule.
