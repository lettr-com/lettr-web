---
term: Role-Based Address
heading: "What is a role-based address?"
description: "A role-based address like info@ or support@ belongs to a function, not a person. Why it raises complaint risk on marketing lists and how to handle it in Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [list-hygiene, spam-complaint, opt-in, suppression-list, spam-trap]
reading:
  - title: List Hygiene
    href: https://docs.lettr.com/knowledge-base/best-practices/list-hygiene
  - title: Contacts
    href: https://docs.lettr.com/learn/audience/contacts
---

**A role-based address** is an email address tied to a function or department rather than to one person, such as `info@`, `support@`, `sales@` or `admin@`. Mail sent to it usually lands in a shared inbox or is passed on to several people. That makes it the right way to reach an organization, and a poor fit for marketing lists, where consent and engagement belong to an individual.

## How role-based addresses work

Some role addresses are defined by standards. **RFC 5321 requires every domain that accepts mail to have a `postmaster@` address**, and RFC 2142 lists further mailbox names for common functions, including `abuse@` for abuse reports, `hostmaster@` for DNS and `webmaster@` for websites. Others, such as `info@`, `hello@` or `billing@`, are conventions each organization chooses for itself.

Behind the address sits a distribution list, a shared mailbox, a help desk that turns each message into a ticket, or a forward to whoever currently holds the role. **The group of readers changes independently of the person who gave out the address.** A colleague who signed `sales@` up for a newsletter may leave, while everyone else on the alias keeps receiving it.

## Why role-based addresses matter for senders

Consent is the first issue. The person who submitted a role address agreed to receive mail, but the other readers of the shared inbox did not, so the [opt-in](/glossary/opt-in/) behind the address covers only part of its audience.

**Complaint risk rises with every extra reader.** Any member of the group can mark a message as spam, and a reader who never asked for it is the most likely to do so. Each [spam complaint](/glossary/spam-complaint/) counts against the sender's reputation in the same way as one from a personal address.

Engagement suffers too. Opens and clicks are spread across several readers or are missing entirely when the address feeds a ticketing system, and a help desk that auto-replies or files a ticket for every campaign adds noise on both sides. Role addresses published on websites are also harvested by list scrapers, so a list full of them is often a sign that addresses were collected without consent, and abandoned role addresses can become [spam traps](/glossary/spam-trap/).

## Best practices for role-based addresses

- **Separate transactional from marketing use:** an invoice sent to `billing@` at a customer's request is legitimate, while a newsletter to the same address reaches readers who never asked for it.
- **Confirm before adding to a list:** double opt-in shows that someone with access to the address wants the mail, even when the address is shared.
- **Ask for a personal address at signup:** a short hint on a signup form steers people away from `info@` without blocking business users who have no alternative.
- **Review lists regularly:** role addresses belong in routine [list hygiene](/glossary/list-hygiene/), and `abuse@` and `postmaster@` should never be on a marketing list.

## Role-based address in Lettr

The Lettr List Hygiene guide includes role-based addresses in its quarterly review checklist: **remove or suppress addresses like `info@`, `admin@` and `support@`**, because they often go to shared inboxes and generate complaints.

Campaign eligibility in Lettr depends on contact status. Every contact has one of five statuses, `subscribed`, `unsubscribed`, `bounced`, `complained` or `unverified`, and only contacts with status `subscribed` receive campaigns, a filter Lettr applies automatically when a campaign is sent. To stop mail to a contact from the sender's side, the docs say to change their status.

Some cases are handled without manual work. A spam complaint or a hard bounce adds the address to the [suppression list](/glossary/suppression-list/) permanently, so a role address that complains once is not mailed again. Contacts created through double opt-in stay `unverified` and are excluded from campaigns until they click their confirmation link, which confirms that someone with access to the address asked for the mail. The [List Hygiene](https://docs.lettr.com/knowledge-base/best-practices/list-hygiene) page covers the full review checklist.
