---
term: List Hygiene
question: What is
description: "List hygiene keeps an email list clean by removing invalid, bounced, complaining and inactive addresses. Why it drives deliverability and what Lettr automates."
related: [bounce-rate, hard-bounce, sunset-policy, spam-trap, suppression-list]
reading:
  - title: List Hygiene
    href: https://docs.lettr.com/knowledge-base/best-practices/list-hygiene
  - title: Bounces
    href: https://docs.lettr.com/learn/suppressions/bounces
  - title: Contacts
    href: https://docs.lettr.com/learn/audience/contacts
---

**List hygiene** is the ongoing practice of keeping an email list limited to valid addresses that belong to people who want the mail. It covers validating addresses when they are collected, removing addresses that bounce, suppressing recipients who complain, and re-engaging or removing subscribers who have stopped reading. Poor list hygiene is the most common cause of deliverability problems, because mailbox providers judge a sender partly by the quality of the addresses it mails.

## Why list hygiene matters

Mailbox providers evaluate sending behavior continuously, and **list quality shows up in several of the signals they watch**:

- **Bounces:** a high share of addresses that do not exist marks a sender as careless.
- **Complaints:** recipients who report mail as spam lead providers to block it.
- **Engagement:** a list where most recipients ignore the mail gets its messages deprioritized.
- **Spam traps:** a [spam trap](/glossary/spam-trap/) on the list causes immediate reputation damage and can lead to blocklisting.

The damage is not limited to the bad addresses. Reputation belongs to the sending domain and IP as a whole, so once it drops, mail to valid and engaged recipients is filtered along with the rest. Reputation also builds slowly and falls quickly, which makes prevention far cheaper than recovery.

## How list hygiene works

**Validation at the point of collection** keeps bad addresses out in the first place. A format check catches typos but cannot confirm that an address exists. A confirmation email can, and double opt-in adds an address to the list only after its owner clicks the confirmation link, which proves both that the mailbox is real and that the person wants the mail.

Bounces need handling as they happen. A [hard bounce](/glossary/hard-bounce/) means the address is permanently invalid, so it leaves the list after the first failure. A soft bounce is temporary, such as a full mailbox, so it is retried and removed only after repeated failures.

Complaints call for stricter treatment. A recipient who marks mail as spam is removed immediately and stays removed, even if the same address later comes back through a signup form.

Inactive subscribers are the slowest problem to spot. A subscriber with no opens or clicks for several months is typically treated as inactive, with a shorter window for daily senders than for monthly ones. A re-engagement email gives them a chance to confirm their interest, and a [sunset policy](/glossary/sunset-policy/) then removes the ones who do not respond, automatically and on a schedule.

## Common problems with list hygiene

**Purchased and scraped lists undo every other practice.** The people on them never asked for the mail, so complaint rates run high, and such lists often contain spam traps and outdated addresses that hard bounce.

Suppressed addresses also creep back in. An import of an old spreadsheet or a sync from another system can re-add people who unsubscribed or complained, so the application's own records have to reflect suppressions as well as the sending platform's list. Role-based addresses such as `info@` and `support@` cause trouble of their own, since they often reach shared inboxes where someone who never signed up files a complaint.

Open-based inactivity rules have a blind spot too. Some mail clients load images automatically, so an address can register opens without anyone reading, and click activity is the more reliable basis for deciding who is still engaged.

## List hygiene in Lettr

**Lettr automates the suppression side of list hygiene.** Hard-bounced addresses are added to the [suppression list](/glossary/suppression-list/) automatically, so later sends skip them. Spam complaints, list unsubscribes and link unsubscribes are suppressed automatically as well, although API sends left at the default `transactional: true` skip unsubscribe suppression. Soft bounces are retried with exponential backoff, and the address may eventually be suppressed if delivery keeps failing.

The Bounces page grades [bounce rate](/glossary/bounce-rate/) as healthy below 2%, a warning between 2 and 5% that calls for a review of list hygiene, and critical above 5%, where the list needs cleaning immediately.

In the Audience, every contact has one of five statuses, and campaigns send only to `subscribed` contacts, skipping `unsubscribed`, `bounced`, `complained` and `unverified` ones automatically. Those contacts still count toward the marketing plan's contact limit, so the docs suggest deleting bounced or unsubscribed contacts that are no longer needed. Before an import, Adamko, Lettr's AI assistant, can review a sample of the file for invalid or empty addresses, duplicates and a missing consent signal. The [List Hygiene guide](https://docs.lettr.com/knowledge-base/best-practices/list-hygiene) covers a quarterly audit checklist.
