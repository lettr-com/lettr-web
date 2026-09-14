---
term: Blocklist
fullName: Blacklist
description: "A blocklist is a database of IP addresses or domains flagged as spam sources that receiving servers check. How listings happen, how to delist and Lettr's view."
related: [sender-reputation, spam-trap, shared-ip, suppression-list, domain-reputation]
reading:
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
  - title: Emails Landing in Spam
    href: https://docs.lettr.com/knowledge-base/troubleshooting/spam-placement
  - title: Bounces in Lettr
    href: https://docs.lettr.com/learn/suppressions/bounces
---

**A blocklist (blacklist)** is a database of IP addresses or domains identified as sources of spam. Mailbox providers and spam filters check incoming mail against these lists and reject or filter messages from anything listed. Blacklist is the older name for the same thing, and the industry has largely switched to blocklist. A listing on a major blocklist such as Spamhaus, Barracuda or SORBS affects delivery to every receiver that consults it at once.

## How blocklists work

Most public blocklists are DNS-based. **The receiving server turns the connecting IP address into a DNS query** against the list's zone, reversing the address, so a check of `192.0.2.1` looks up `1.2.0.192` under the list's domain. An answer means the address is listed, and no answer means it is not. Domain blocklists work the same way for the sending domain and for the domains of links inside the message.

What happens next is the receiver's decision. Some servers reject a listed sender outright during the SMTP session, typically with a `550 5.7.1` reply that names the list. Others add the listing to a spam score, and some ignore smaller lists entirely. Large mailbox providers also keep private blocklists of their own, which are not queryable from outside.

Listings follow sending behavior. The usual triggers are hits on a [spam trap](/glossary/spam-trap/), a surge of complaints, sudden high volume from a source with no history, and a compromised account sending spam. Many lists remove an entry automatically once the activity stops, while others require a delisting request.

## Blocklist vs suppression list

The two lists point in opposite directions. **A blocklist is kept by third parties about senders**, and it decides whether their mail is accepted. A [suppression list](/glossary/suppression-list/) is kept by a sender about recipients, and it decides which addresses that sender will not mail, such as hard bounces, complaints and unsubscribes. Maintaining a suppression list is one of the ways a sender stays off blocklists.

## Common problems with blocklists

**Shared infrastructure spreads the effect of a listing.** On a [shared IP](/glossary/shared-ip/), an IP listing caused by one sender affects delivery for everyone on that address. That is part of why mailbox providers have moved toward judging [domain reputation](/glossary/domain-reputation/), and why a domain listing follows the domain to any IP it sends from.

Delisting without fixing the cause rarely lasts. A sender that requests removal and keeps mailing the same stale list is usually listed again.

Not every list carries the same weight. Checking tools such as MXToolbox and MultiRBL query dozens of lists, and a listing on an obscure one with few users matters far less than one on Spamhaus.

## How to recover from a blocklist listing

Recovery starts with finding which list the address or domain is on and what triggered the listing, since the list's own removal page usually explains its criteria. **The cause has to be fixed before delisting**: stop sending to purchased or scraped addresses, process bounces and complaints, and remove recipients who have not engaged in months. With that done, request removal through the list's own process. Microsoft, for example, handles its internal blocklist through a delisting form at sender.office.com.

After removal, volume should come back gradually, starting with the most engaged recipients, because the positive signals from that mail are what rebuild [sender reputation](/glossary/sender-reputation/).

## Blocklist in Lettr

There is **no single reputation score in Lettr**; the individual signals are monitored through the dashboard and webhook data.

A rejection caused by a block shows up as a bounce. Lettr's bounce classes include `50` (Mail Block, general), `51` (Mail Block, spam related) and `52` (Mail Block, content), with the receiving server's response in the `raw_reason` field of the `message.bounce` webhook event. In Analytics, the **Block Bounces** metric counts bounces caused by the recipient's server blocking the sending IP or domain, and a breakdown by Mailbox Provider or Recipient Domain shows where the blocks come from.

Lettr's own domain approval uses a **Blocked** status, which is unrelated to public blocklists: it means a newly added sending domain scored below 50 in the automated approval check and has been flagged for manual review.
