---
term: Spam Trap
question: What is
description: "A spam trap is an email address that exists to catch senders with poor list practices. Pristine, recycled and typo traps, and how Lettr helps avoid them."
related: [list-hygiene, blocklist, role-based-address, sunset-policy, double-opt-in]
reading:
  - title: List Hygiene
    href: https://docs.lettr.com/knowledge-base/best-practices/list-hygiene
  - title: Acceptable Use Policy for Email
    href: https://docs.lettr.com/knowledge-base/compliance/acceptable-use-policy
  - title: Suppressions Introduction
    href: https://docs.lettr.com/learn/suppressions/introduction
---

**A spam trap** is an email address that mailbox providers and blocklist operators run to identify senders with poor list practices. A trap never signs up for anything and never sends mail, so every message it receives went to an address that should not have been on the list. Hits feed reputation systems and [blocklists](/glossary/blocklist/), and a sender that hits traps repeatedly sees its mail filtered or rejected.

## Types of spam traps

Trap operators keep their addresses secret, but the kinds of trap are well known:

- **Pristine traps:** addresses created only to be traps and never used by a person. They are exposed where address harvesters look, such as hidden text on web pages, so they reach lists only through scraping or bought data.
- **Recycled traps:** real addresses that were abandoned, returned bounces for a long period and were then reactivated by the provider as traps. A hit shows that a sender kept mailing an address long after it stopped working.
- **Typo traps:** addresses at misspelled domains such as `gmial.com`, or with common typing mistakes, which catch lists that accept addresses without confirming them.

**Pristine traps carry the heaviest weight**, because they can only come from harvesting or purchased lists, and a hit on a major blocklist operator's trap network can lead to a listing. Recycled and typo traps point to neglect rather than deliberate abuse, but they still damage reputation over time.

## Why spam traps matter

A trap hit is one of the few signals that exposes how a list was built. **Mailbox providers read it as evidence** that the list was collected without consent or is not maintained, and they apply that judgement to the sender's mail as a whole, including messages to real, engaged recipients.

Blocklists act on trap data as well. Spamhaus and other operators run trap networks, and a listing of a sending IP or domain leads many receiving servers to refuse the mail outright.

Traps also stay silent. They produce no bounce, no complaint and no reply, so a sender cannot pick the trap addresses out of its own list and has to rely on prevention.

## How to avoid spam traps

Since traps cannot be identified, avoidance comes down to list practice:

- **No bought, rented or scraped lists:** purchased data is the main source of pristine traps.
- **Confirmed signups:** [double opt-in](/glossary/double-opt-in/) keeps typo traps and fake addresses off the list, because a trap never clicks a confirmation link.
- **Immediate hard bounce suppression:** an address that bounces today may be recycled into a trap later.
- **Removal of inactive subscribers:** a [sunset policy](/glossary/sunset-policy/) drops addresses with no engagement before a provider can recycle them.
- **Re-permission for old lists:** a list that has not been mailed for a year or more needs confirmation before a normal campaign.

These practices are the core of [list hygiene](/glossary/list-hygiene/). [Role-based addresses](/glossary/role-based-address/) such as `info@` carry a related risk, since they belong to no single person who opted in.

## Spam trap in Lettr

**Lettr's Acceptable Use Policy prohibits purchased, rented, scraped or harvested email lists**, as well as sending to lists that have not been mailed in over 12 months without re-consent. Spam trap hits are among the signals Lettr monitors, listed as an indicator of purchased, scraped or stale lists, next to high bounce rates, high spam complaint rates and sudden volume spikes. Enforcement ranges from a warning to a sending suspension, and severe violations can lead to account termination. The policy warns that lists not mailed in 12 or more months are likely to contain invalid addresses, spam traps and disengaged recipients, and should be re-verified or re-consented before import.

Hard-bounced addresses are suppressed automatically and permanently, as are spam complaints, list unsubscribes and link unsubscribes. The Bounces page grades bounce rate as healthy below 2%, a warning between 2 and 5% that calls for a review of list hygiene, and critical above 5%.

Before a contact import, Adamko, Lettr's AI assistant, can review a sample of the file for invalid or empty addresses and duplicates, and warns plainly when the file shows no consent signal. The List Hygiene guide states that purchased lists frequently contain spam traps and that hitting one leads to immediate blocklisting, and it treats subscribers with no opens or clicks in 6 to 12 months as inactive. The [List Hygiene](https://docs.lettr.com/knowledge-base/best-practices/list-hygiene) guide includes a quarterly audit checklist.
