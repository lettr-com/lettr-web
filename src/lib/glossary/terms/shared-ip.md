---
term: Shared IP
question: What is
description: "A shared IP is a sending IP address that carries mail for many senders at once. How shared IPs work, trade-offs against dedicated IPs, and Lettr."
related: [dedicated-ip, ip-pool, ip-reputation, domain-reputation, warm-up]
reading:
  - title: Dedicated vs Shared IPs
    href: https://docs.lettr.com/knowledge-base/concepts/dedicated-vs-shared-ips
  - title: Domain Approval Process
    href: https://docs.lettr.com/learn/domains/approval
  - title: Billing
    href: https://docs.lettr.com/learn/settings/billing
---

**A shared IP** is an IP address that an email service provider uses to send mail for many of its customers at the same time. Mailbox providers see one address and one history, so the reputation of a shared IP reflects the combined behaviour of every sender whose mail passes through it. Most senders start on shared addresses, because they need no warm-up and no minimum volume.

## How shared IPs work

The provider groups its sending addresses into an [IP pool](/glossary/ip-pool/) and distributes customer traffic across it. **Messages from different customers leave from the same addresses**, and a receiving server has no way to tell them apart at the IP level. It records the address's volume, complaints, bounces and spam trap hits as one history.

That history is established through constant use. A busy shared pool sends steady, high volume every day, which is the pattern mailbox providers trust, and a new customer benefits from it on the first send.

Keeping the pool healthy is the provider's job. Reputable providers vet new senders, enforce an acceptable use policy, watch complaint and bounce rates per customer and suspend accounts that put the pool at risk. The value of a shared IP depends heavily on how strictly the provider does this.

## Shared IP vs dedicated IP

A [dedicated IP](/glossary/dedicated-ip/) carries one sender's mail only. **The trade-off is shared exposure against full responsibility.** On a shared IP, another customer's poorly targeted campaign can affect everyone on the address until the provider acts, but a small or irregular sender also gets the stability of the pool's volume. On a dedicated IP, results depend only on the account's own practices, and the address needs a [warm-up](/glossary/warm-up/) and consistent daily volume to stay trusted.

Low-volume senders usually do better on shared addresses. An address that sends small batches with long gaps never builds a stable history, and mailbox providers treat that pattern with suspicion. Dedicated IPs make sense at high and steady volume, or when a sender needs to control and diagnose reputation at the IP level.

## Why domain reputation matters more on shared IPs

On shared infrastructure the IP-level signal is pooled, so **the sending domain is the part of reputation a single sender owns**. [Domain reputation](/glossary/domain-reputation/) follows the domain across addresses and providers, and major mailbox providers, Gmail in particular, weight it heavily. DKIM and DMARC tie each message to its domain, which lets a provider judge a well-behaved sender on its own record even when it shares addresses with others.

IP-based tools are less useful on shared addresses. Microsoft's SNDS and similar dashboards report per address, so their data for a shared IP mixes many senders, and access usually goes through the provider. A blocklist listing or another [IP reputation](/glossary/ip-reputation/) problem on a shared address is also the provider's to resolve.

## Shared IP in Lettr

**Lettr scores every new sending domain before it can send.** The Domain Approval Process page explains that email deliverability depends on shared infrastructure, where every domain on the platform affects the reputation of the IP addresses used for sending, and that screening domains keeps bad actors from degrading delivery for legitimate senders. A domain starts with 100 points, loses points for each risk signal, and is approved automatically at 50 or above or blocked and flagged for manual review below 50.

Lettr's Acceptable Use Policy lists the signals Lettr monitors to protect platform reputation: high bounce rates, high spam complaint rates, spam trap hits, sudden volume spikes and content pattern matching. Enforcement ranges from a warning and a sending throttle to suspension, and severe violations can end in account termination.

Dedicated IPs are available as an add-on on the Business plan and as part of Enterprise. To see which address delivered a given email, the Message Details view shows its Sending IP, and Analytics can filter by Sending IP or break metrics down by the Lettr IP that delivered each email.

The Outlook troubleshooting guide notes that sending IPs appear in the `Received` headers of messages sent through Lettr, and that senders on Lettr's shared IP pool can contact Lettr support for the current sending IP ranges when registering with SNDS. The [Dedicated vs Shared IPs](https://docs.lettr.com/knowledge-base/concepts/dedicated-vs-shared-ips) page compares both options.
