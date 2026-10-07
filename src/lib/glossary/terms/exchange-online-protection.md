---
term: Exchange Online Protection
fullName: EOP
heading: "What is Exchange Online Protection?"
description: "Exchange Online Protection is Microsoft's first filtering layer for Outlook and Microsoft 365 mail. What EOP checks, why mail gets junked and Lettr's part."
published: 2026-09-14
updated: 2026-09-14
related: [smartscreen, snds, ip-reputation, dmarc, focused-inbox]
reading:
  - title: Outlook / Microsoft 365 Delivery Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
  - title: Bounce Codes Reference
    href: https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference
---

**Exchange Online Protection (EOP)** is Microsoft's cloud email filtering service, the first layer of defence for mail sent to Microsoft 365, Outlook.com and Hotmail mailboxes. It checks each incoming connection and message for sender reputation, authentication and malware before content-level spam filtering decides where the message goes. A message that EOP rejects or scores as spam never reaches the recipient's inbox, so EOP largely determines deliverability to Microsoft recipients.

## How Exchange Online Protection works

EOP evaluates a message in stages, starting before the content is read. **Connection filtering looks at the sending IP address first**, checking it against Microsoft's reputation data and any allow or block lists. A poorly rated IP can be deferred or blocked at this point, which is why [IP reputation](/glossary/ip-reputation/) carries more weight with Microsoft than with Gmail, where domain reputation dominates.

Messages that pass the connection stage are checked for malware and for authentication. EOP validates SPF, DKIM and [DMARC](/glossary/dmarc/) and combines the results into a composite authentication verdict, which also catches mail that spoofs a domain without publishing a DMARC policy. Organizations using Microsoft 365 can add their own mail flow rules on top, and those rules can override the default filtering.

Content filtering then assigns a spam confidence level (SCL) and, for bulk mail, a bulk complaint level (BCL). Microsoft's [SmartScreen](/glossary/smartscreen/) technology handles this content analysis using machine learning. The resulting verdict decides whether a message is delivered to the inbox, moved to the Junk Email folder or quarantined. Recipient actions feed back in: marking mail as Junk or Not Junk, and Safe Senders lists, which let a recipient bypass junk filtering for a sender entirely.

## Common problems with Exchange Online Protection

**Most Microsoft delivery problems show up as IP-level blocks or deferrals.** A permanent rejection such as `550 5.7.1` with a note that part of the sender's network is on a block list means Microsoft has blocked the sending IP, typically after high complaint rates from Outlook users or spam trap hits. A temporary `421 4.7.0` means Microsoft is deferring mail because of an unusual rate of unsolicited messages from that IP.

Reputation is slow to repair. Recovery with Microsoft takes longer than with Gmail, and a delisting request only lasts if the underlying cause is fixed. Microsoft also recycles abandoned addresses as spam traps, so lists that keep long-inactive Outlook and Hotmail addresses hit them.

Headers help pin down the cause. EOP stamps its verdict into the `X-Forefront-Antispam-Report` header, including the SCL, and writes authentication results into `Authentication-Results`, so a junked test message shows whether reputation, authentication or content triggered the filter.

## Best practices for Exchange Online Protection

**Authentication has to pass in full.** Microsoft enforces SPF, DKIM and DMARC strictly, and mail that fails any of them starts at a disadvantage in EOP's scoring. Headers of a test message sent to an Outlook address confirm the `pass` results before volume increases.

Volume changes deserve care. Microsoft is particularly sensitive to sudden jumps, so a new domain or IP should start with low volume to Microsoft recipients and ramp up over two to four weeks. [SNDS](/glossary/snds/), Microsoft's Smart Network Data Services, shows per-IP traffic, complaint rates and a Green, Yellow or Red filter result, and a shift from Green to Yellow is the early warning to act on.

Complaint rates below 0.3% keep mail out of complaint-based filtering, and removing recipients who have not engaged in six months or more avoids recycled spam traps. For mail that passes EOP, placement in the [Focused Inbox](/glossary/focused-inbox/) or the Other tab is a separate decision based on how recipients interact with the sender.

## Exchange Online Protection in Lettr

**Lettr retries Microsoft's temporary deferrals automatically**, including `421 4.7.0` rate limiting and `451 4.7.500 Server busy`, so those need no resend from the application. Permanent rejections arrive as `message.bounce` webhook events, with Microsoft's full response text in the `raw_reason` field, and the Message Details view records the recipient's mailbox provider.

Lettr signs every message with a DKIM key for the sending domain, and the domain's verification status for SPF, DKIM and DMARC is shown on the Domains page. The sending IPs used for a message appear in its `Received` headers, which is what SNDS asks for when registering IP ranges, and senders on Lettr's shared IP pool can get the current ranges from Lettr support.

A `message.delivery` event confirms that Microsoft's servers accepted the message, not that EOP placed it in the inbox rather than Junk. The [Outlook / Microsoft 365 Delivery Issues](https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery) guide covers SNDS, common Microsoft errors and delisting requests.
