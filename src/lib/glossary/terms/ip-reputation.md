---
term: IP Reputation
heading: "What is IP reputation?"
description: "IP reputation is the trust mailbox providers give a sending IP address based on its mail history. What shapes it, domain vs IP reputation, and Lettr."
published: 2026-09-14
updated: 2026-09-15
related: [domain-reputation, sender-reputation, dedicated-ip, blocklist, ip-pool]
reading:
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
  - title: Dedicated vs Shared IPs
    href: https://docs.lettr.com/knowledge-base/concepts/dedicated-vs-shared-ips
  - title: Filtering and Breakdowns
    href: https://docs.lettr.com/learn/analytics/filtering-and-breakdowns
---

**IP reputation** is the standing that mailbox providers and filtering services assign to an IP address based on the mail sent from it. Every message a receiving server accepts, filters or rejects adds to the history of the address that delivered it. A good IP reputation lets mail through with little friction, while a poor one leads to throttling, spam placement or outright rejection.

## How IP reputation is built

The connecting IP address is the first thing a receiving server sees in the SMTP conversation. **Reputation is judged from the behaviour observed at that address over time:**

- **Bounce rate:** how often mail from the IP goes to addresses that do not exist.
- **Complaint rate:** how often recipients mark its mail as spam.
- **Spam trap hits:** mail sent to [spam trap](/glossary/spam-trap/) addresses that exist only to catch poor list practices.
- **Volume consistency:** whether sending follows a predictable pattern or arrives in erratic bursts.
- **Engagement:** whether recipients open, click and interact with the mail.

Technical setup counts as well. An address without matching reverse DNS, a [PTR record](/glossary/ptr-record/) that points to a hostname resolving back to the same IP, is treated with suspicion by many filters.

A new IP address starts with no history, and mailbox providers treat unknown addresses with caution. Building reputation means raising volume gradually over several weeks, beginning with the most engaged recipients.

## IP reputation vs domain reputation

**IP reputation belongs to the address, and [domain reputation](/glossary/domain-reputation/) belongs to the domain.** A domain carries its history to any IP address or email provider it moves to, while an IP's history stays with the address. DKIM signatures and DMARC alignment let providers attribute mail to a domain reliably, wherever it was sent from.

Major mailbox providers, Gmail in particular, have shifted heavily toward domain-based reputation, while IP data remains important elsewhere: Microsoft's SNDS, for example, reports data per IP address. Both feed the overall [sender reputation](/glossary/sender-reputation/) a provider forms, so a clean IP does not make up for a damaged domain, and a strong domain does not fully shield mail from a poorly regarded IP.

Who controls the reputation depends on the setup. On shared infrastructure an address's reputation reflects every sender using it, while a [dedicated IP](/glossary/dedicated-ip/) reflects only one sender's mail, which brings full control and full responsibility.

## Common problems with IP reputation

**A [blocklist](/glossary/blocklist/) listing is the most visible failure.** Services such as Spamhaus publish lists of IP addresses associated with spam, and many receiving servers refuse mail from listed addresses, often with an error that names the list. Spam trap hits and sudden jumps in volume are common reasons for a listing.

Low volume causes quieter damage. An address that sends too little or too irregularly never builds a stable history, which is why a small sender on a dedicated IP can see worse results than on a well-managed shared pool.

Recovery takes time. Fixing the cause, such as removing invalid addresses or stopping mail to people who never opted in, prevents further harm, but the address regains trust only through a sustained period of clean sending.

## IP reputation in Lettr

**Lettr maintains a pool of sending IPs with established reputations** and provides dedicated IP options for high-volume senders, with dedicated IPs listed as a Business plan add-on and as an Enterprise feature on the billing page. The docs state that Lettr has no single reputation score and recommend monitoring the individual signals through the dashboard and webhook data.

For IP-level signals, the Block Bounces metric in Analytics counts bounces caused by the recipient's server blocking the sending IP or domain. Analytics can filter by Sending IP and group metrics by the Lettr IP that delivered each email, which shows whether a problem follows one address. Each email's Message Details view shows its Sending IP, and bounce and delay webhook payloads include `sending_ip` next to the receiving server's response.

For the signals mailbox providers monitor, a bounce rate below 2% is healthy, and Google recommends keeping the spam complaint rate below 0.1%. The [Sending Reputation](https://docs.lettr.com/knowledge-base/best-practices/sending-reputation) guide covers domain and IP reputation and how to protect both.
