---
term: Suppression List
question: What is
description: "A suppression list holds addresses a sender must not email, such as hard bounces, complainers and unsubscribes. How suppression works and what Lettr automates."
related: [hard-bounce, spam-complaint, list-unsubscribe, transactional-email, soft-bounce]
reading:
  - title: Understanding Suppression Lists
    href: https://docs.lettr.com/knowledge-base/fundamentals/suppression-lists
  - title: Suppressions Introduction
    href: https://docs.lettr.com/learn/suppressions/introduction
  - title: Complaints & Unsubscribes
    href: https://docs.lettr.com/learn/suppressions/complaints-unsubscribes
---

**A suppression list** is a list of email addresses that a sending system will not send to, whatever a send request says. Addresses land on it because mail to them is known to fail or is not wanted: they bounced permanently, their owners reported mail as spam, or they unsubscribed. Every send is checked against the list before delivery, so an application that still holds a bad address in its own database cannot mail it by mistake.

## How a suppression list works

**The check happens between the send request and delivery.** As a message is prepared, each recipient is compared with the suppression list, and a match stops that recipient's copy before any connection to a receiving mail server.

Events add the entries. A [hard bounce](/glossary/hard-bounce/) adds the address after the first permanent failure, a [spam complaint](/glossary/spam-complaint/) arriving through a feedback loop adds the person who complained, and an unsubscribe through a link or the [list unsubscribe](/glossary/list-unsubscribe/) mechanism adds the subscriber. A [soft bounce](/glossary/soft-bounce/) is temporary and does not add an address straight away; only repeated failures do.

Platforms differ in scope. Some keep one list per account, some keep separate lists per stream or sending domain, and many record the reason for each entry, so that an unsubscribe can block marketing mail while a password reset still goes through.

## Why suppression lists matter

Every message to a known-bad address has a cost. **Repeated sends to hard-bounced addresses and complainers are among the clearest signs of a careless sender**, and mailbox providers answer with filtering and blocks that affect mail to every recipient, not only the bad addresses.

Unsubscribes add a legal side. The CAN-SPAM Act requires opt-out requests to be honoured within 10 business days, the GDPR requires marketing to stop once consent is withdrawn, and Gmail and Yahoo expect bulk senders to process unsubscribes within 2 days.

Suppression also guards against the sender's own systems. Imports of old spreadsheets, CRM syncs and restored backups can bring back addresses that left long ago, and a list enforced by the sending platform catches them where application logic would not.

## Suppression and transactional email

Not every reason for suppression should block every message. **A complaint or an unsubscribe usually concerns marketing**, while [transactional email](/glossary/transactional-email/) such as receipts, security alerts and password resets is mail the recipient needs regardless. Many platforms therefore apply unsubscribe suppression only to marketing sends, while a hard bounce blocks everything, because the address cannot receive mail at all.

The distinction depends on each send being labelled correctly. A newsletter sent as transactional bypasses the unsubscribe check and reaches people who opted out, which creates complaints and compliance risk at the same time.

## Suppression list in Lettr

**Lettr suppresses addresses automatically and permanently** after a hard bounce, a spam complaint, a list unsubscribe or a link unsubscribe. Soft bounces do not result in immediate suppression: delivery is retried automatically, and the address is suppressed only after repeated failures. Among the bounce classes, `10`, `30` and `100` are the hard bounces that lead to automatic suppression.

A webhook event arrives for the underlying event, as `message.bounce`, `message.spam_complaint`, `unsubscribe.list_unsubscribe` or `unsubscribe.link_unsubscribe`, so an application can update its own records. Adamko, Lettr's AI assistant, can check whether a specific address is suppressed and explain why and when. Suppression records are retained separately from email history and are kept even when email data is deleted.

The `transactional` send option defaults to `true`, and such API sends bypass unsubscribe suppression, so a recipient who unsubscribed from marketing email still receives an API send that leaves the option at its default. The docs therefore advise setting `transactional: false` on marketing-shaped API sends such as newsletters, promotions and product announcements so that suppressions are honoured.

In the Audience, campaigns go only to contacts with status `subscribed`, skipping `unsubscribed`, `bounced` and `complained` contacts automatically. The [Suppressions Introduction](https://docs.lettr.com/learn/suppressions/introduction) page shows how to handle each suppression event in a webhook.
