---
term: Dedicated IP
question: What is
description: "A dedicated IP is a sending IP address used by a single sender. How it differs from a shared IP, why it needs warm-up and volume, and how Lettr offers it."
related: [shared-ip, ip-reputation, warm-up, ip-pool, reputation-isolation]
reading:
  - title: Dedicated vs Shared IPs
    href: https://docs.lettr.com/knowledge-base/concepts/dedicated-vs-shared-ips
  - title: Billing
    href: https://docs.lettr.com/learn/settings/billing
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
---

**A dedicated IP** is an IP address that sends email for one sender only. Mailbox providers keep a reputation for every IP address that delivers mail to them, and on a dedicated address that reputation reflects a single sender's behavior. The alternative is a [shared IP](/glossary/shared-ip/), where many customers of the same email service provider send from a common set of addresses and their reputations are pooled.

## How a dedicated IP works

The email service provider assigns one or more IP addresses to an account, and all mail from that account leaves from those addresses. **No other sender's mail uses them**, so the reputation mailbox providers build for those addresses depends only on that account's sending practices. [IP reputation](/glossary/ip-reputation/) draws on bounce rates, complaint rates, spam trap hits, engagement and how consistent the volume is.

A new dedicated IP starts with no history, and mailbox providers treat unknown addresses cautiously. It needs a [warm-up](/glossary/warm-up/): daily volume starts low, goes first to the most engaged recipients and rises gradually over several weeks while bounce and complaint rates stay healthy. Sending full volume from an unknown address triggers spam filtering and rejections.

Volume stays a requirement after warm-up. A dedicated IP needs consistent daily sending to keep its reputation, and an address that sends only occasionally can look inactive or suspicious to mailbox providers. High-volume senders sometimes run several dedicated IPs, one per email stream, so that marketing complaints stay off the address that carries password resets and receipts. That is a form of [reputation isolation](/glossary/reputation-isolation/), and each address then needs its own warm-up and monitoring.

## Dedicated IP vs shared IP

A shared IP comes with reputation already established by ongoing use, so a sender can start at full volume on day one. The provider manages the pool, monitors its health and removes senders who abuse it, and the cost is included in standard pricing. The drawback is shared exposure: another sender's poor practices on the same addresses can affect everyone's deliverability.

A dedicated IP trades that exposure for control. **Deliverability on a dedicated IP depends only on the account's own behavior**, which also makes problems easier to trace. The costs are a warm-up period, the need for steady volume, an added fee in most pricing, and concentrated damage when the sender's own practices go wrong, with no pool to dilute it.

Neither option is better in general. A sender with low or irregular volume usually performs worse on a dedicated IP than on a well-managed shared pool, because the address cannot keep the steady pattern mailbox providers expect. A common rule of thumb puts shared IPs below about 50,000 emails a month and dedicated IPs above a consistent 100,000, with the range between depending on complaint risk and past problems.

## Why a dedicated IP does not replace domain reputation

IP reputation used to dominate filtering decisions, but **mailbox providers, Gmail in particular, now weight domain reputation more heavily**. [Domain reputation](/glossary/domain-reputation/) belongs to the sending domain and follows it across IP addresses and email service providers, while IP reputation stays with the address and does not transfer.

A dedicated IP therefore changes who shares the IP-level signal, but it does not change the domain-level one. Authentication with SPF, DKIM and DMARC, clean lists and healthy engagement matter as much on a dedicated address as on a shared one.

## Dedicated IP in Lettr

Lettr maintains a pool of sending IPs with established reputations and **provides dedicated IP options for high-volume senders**. On the billing page, dedicated IPs are listed as an add-on on the Business plan and as part of Enterprise, and senders who need them contact sales at info@lettr.com.

On shared infrastructure, Lettr scores every new sending domain before it can send, because each domain on the platform affects the reputation of the IP addresses used for sending. To see which address delivered a message, the Message Details view shows the Sending IP, and the Analytics breakdown table can group metrics by Sending IP, the Lettr IP that delivered the email. The [Dedicated vs Shared IPs](https://docs.lettr.com/knowledge-base/concepts/dedicated-vs-shared-ips) page in the Lettr docs covers the trade-offs and a sample warm-up plan.
