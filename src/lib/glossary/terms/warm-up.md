---
term: Warm-Up
question: What is
description: "Warm-up is the gradual increase of sending volume from a new domain or IP address so mailbox providers can build trust. How it works and what Lettr advises."
related: [dedicated-ip, domain-reputation, ip-reputation, sender-reputation, throttling]
reading:
  - title: IP and Domain Warm-Up Guide
    href: https://docs.lettr.com/knowledge-base/best-practices/ip-domain-warmup
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
  - title: Best Practices
    href: https://docs.lettr.com/learn/sending/best-practices
---

**Warm-up** is the practice of starting to send from a new domain or IP address at low volume and raising it gradually, so mailbox providers can form a view of the sender before large volumes arrive. A new sender has no history, and providers treat unknown traffic with caution. Full volume on the first day matches the pattern spammers use with fresh domains and addresses, and it tends to end in spam filtering, deferrals or blocks.

## How warm-up works

Providers judge a sender by how its mail is received over time. **Early sends create that record**: how many messages bounce, how many recipients open, click or reply, and how many mark the mail as spam. Good results let a provider accept more, and the sender raises volume in steps that follow those results, gradually building [sender reputation](/glossary/sender-reputation/).

Three controls shape a warm-up plan:

- **Volume:** daily sending starts small and rises on a schedule, usually over several weeks.
- **Audience:** the first sends go to the most engaged recipients, people who opened or clicked recently, because their reactions are the most positive signal available.
- **Consistency:** mail goes out every day at a steady pace, since sporadic bursts followed by silence look suspicious.

The metrics set the pace more than the calendar does. Low bounce and complaint rates allow faster increases, and a rise in either is the signal to hold volume steady or step back.

## Domain warm-up vs IP warm-up

[IP reputation](/glossary/ip-reputation/) and [domain reputation](/glossary/domain-reputation/) are built separately. **A new [dedicated IP](/glossary/dedicated-ip/) always needs warming up**, because the address has never sent mail and providers have no data about it. A sender on shared IP addresses relies on the reputation of the shared pool and does not warm those addresses itself.

A new sending domain needs warming up either way. Providers weigh the domain heavily in filtering decisions, and a domain with no history is treated cautiously even when it sends from well-established IP addresses. Splitting mail streams onto new subdomains starts each subdomain's history from zero, so each one gets its own warm-up. Moving an existing sender onto new IP addresses resets the IP history, while a domain with a good record keeps it.

## Common problems with warm-up

- **Starting with the whole list:** old or unengaged addresses produce bounces, spam trap hits and complaints at the moment the sender has no reputation to absorb them.
- **Sending before authentication passes:** mail that fails SPF, DKIM or DMARC during warm-up builds a poor record from the first message.
- **Ignoring deferrals:** [throttling](/glossary/throttling/) is a provider's way of limiting a sender it does not trust yet, and pushing more volume at it prolongs the delays.
- **Stopping and starting:** a long pause lets a young reputation fade, and a return at full volume looks like a new sender again.

## Warm-up in Lettr

**The Lettr docs recommend ramping up gradually over several weeks** when sending from a new domain, so providers can observe sending patterns and build trust, and warn that sending high volumes immediately from a new domain can trigger spam filters and damage reputation.

The IP and Domain Warm-Up Guide starts its schedules with the most engaged recipients and widens the audience at later stages. It presents the schedules as guidelines rather than rigid rules: if bounce and complaint rates stay low, sending can accelerate, and if either metric rises sharply, sending should slow down immediately. The guide also calls for all DNS records to be verified and passing before the first warm-up send, and for sending every day instead of in occasional bursts.

Dedicated IP addresses are available as an add-on on the Business plan and as part of Enterprise. Lettr has no single reputation score and no API that returns one, so the docs recommend watching the individual signals through the dashboard and webhook data. New sending domains also go through Lettr's approval scoring, which screens a domain before it can send in order to protect shared infrastructure, a separate step from warming the domain up with mailbox providers. The [IP and Domain Warm-Up Guide](https://docs.lettr.com/knowledge-base/best-practices/ip-domain-warmup) covers monitoring during warm-up and recovery when it goes wrong.
