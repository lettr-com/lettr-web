---
term: MUA
fullName: Mail User Agent
heading: "What is an MUA?"
description: "An MUA (mail user agent) is the email client people use to read and send mail, like Outlook, Apple Mail or Gmail. How it works and how it differs from an MTA."
published: 2026-09-14
updated: 2026-09-14
related: [mta, imap, smtp, rendering-engine, mail-privacy-protection]
reading:
  - title: How Email Delivery Works
    href: https://docs.lettr.com/knowledge-base/fundamentals/how-email-delivery-works
  - title: Email Rendering Across Clients
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-rendering-clients
---

**An MUA (Mail User Agent)** is the software a person uses to read, write and send email. Desktop and mobile apps such as Outlook, Apple Mail and Thunderbird are MUAs, and so are webmail interfaces such as Gmail in a browser. The MUA is the part of the email system people actually see: it talks to mail servers on the user's behalf and displays messages, while servers handle the routing between them.

## How an MUA works

An MUA has two jobs, sending and reading, and it uses different protocols for each. **Outgoing mail goes to a submission server over [SMTP](/glossary/smtp/)**, normally on port 587 or 465, after the client logs in with the user's credentials. From there, servers take over delivery.

Reading works in the other direction. The MUA connects to the server that stores the user's mailbox and retrieves messages, most often over [IMAP](/glossary/imap/), which keeps folders, read status and flags synchronized on the server so several devices see the same state. The older POP3 protocol downloads messages to one device instead. Webmail changes the arrangement: the interface runs in a browser, and the provider's own servers handle storage and sending behind it.

The MUA also builds and interprets messages. When sending, it writes headers such as From, To, Subject and Date, often generates the Message-ID, and assembles the MIME structure for HTML and attachments. When reading, it parses that structure, chooses which version of a multipart message to display, renders HTML with its [rendering engine](/glossary/rendering-engine/), and groups replies into threads.

## MUA vs MTA

**An [MTA](/glossary/mta/) is server software that moves mail between servers**, while an MUA sits at either end of the journey with a person in front of it. Postfix, Exim and Microsoft Exchange are MTAs, and Outlook is an MUA, even though Outlook usually connects to Exchange.

A message typically passes through both kinds. The sender's MUA submits it to a submission server, MTAs relay it over SMTP on port 25 to the recipient's mail server, a delivery agent files it in the mailbox, and the recipient's MUA retrieves and displays it. Applications that send email take the MUA's place at the start of that chain, handing messages to an email service provider through an API or SMTP.

## Why MUAs matter to senders

**Rendering differs from client to client.** Each MUA has its own rendering engine and its own CSS support: Outlook on Windows renders HTML with a Word-based engine that ignores flexbox and grid, and many clients strip `<style>` blocks from the head. That is why email HTML still relies on tables and inline styles, and why a design needs testing in several clients before it goes out.

Engagement data depends on the MUA too. An open is recorded only when the client loads images, so clients that block images by default undercount opens, and Apple Mail with [Mail Privacy Protection](/glossary/mail-privacy-protection/) pre-fetches images and inflates them.

Many sender-facing features are implemented by MUAs, not by servers. The unsubscribe button next to the sender's name, AMP support, dark mode, conversation threading and the "via" label that flags a mismatched sending domain all depend on the client, so the same message can look and behave differently from one inbox to the next.

## MUA in Lettr

For open and click events, **the Message Details page shows a User Agent field** identifying the email client or system that triggered the event. Open tracking depends on the client loading images: some clients, notably Outlook, block images by default, and Apple Mail Privacy Protection pre-fetches them, so the docs treat open rates as an approximation.

When a request includes both `html` and `text`, Lettr packages them as a multipart MIME message, and the recipient's client displays whichever format it prefers. The `inline_css` option converts `<style>` rules into inline `style` attributes, because many email clients strip or rewrite `<style>` blocks in the head. The docs recommend sending test emails to accounts on Gmail, Outlook, Apple Mail and mobile clients, and the Testing Emails list in Editor Settings pre-fills those addresses when a team member sends a test from the editor.

Mail clients' native unsubscribe buttons reach Lettr as List-Unsubscribe requests that generate `unsubscribe.list_unsubscribe` events. Applications that already speak SMTP, such as framework mail functions, can connect to Lettr's SMTP relay at `smtp.lettr.com` and authenticate with a Lettr API key. The [Email Rendering Across Clients](https://docs.lettr.com/knowledge-base/fundamentals/email-rendering-clients) page compares how major clients handle HTML and CSS.
