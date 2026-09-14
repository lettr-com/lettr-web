---
term: Transactional Email
question: What is
description: "Transactional email is sent in response to a user action or account event, such as a password reset or receipt. How it differs from marketing mail, and Lettr."
related: [marketing-email, reputation-isolation, list-unsubscribe, can-spam-act, template-slug]
reading:
  - title: What Is Transactional Email?
    href: https://docs.lettr.com/knowledge-base/concepts/transactional-email
  - title: Transactional vs Marketing Email
    href: https://docs.lettr.com/knowledge-base/best-practices/transactional-vs-marketing
  - title: Sending Introduction
    href: https://docs.lettr.com/learn/sending/introduction
---

**Transactional email** is email sent to one recipient because of something that person did or something that happened to their account. Password resets, order confirmations, shipping notices, receipts, login codes and security alerts are the typical examples. The recipient expects the message and often needs it to finish a task, which gives transactional email different legal, technical and deliverability requirements from promotional mail.

## What makes an email transactional

**The trigger and the purpose define the category.** A transactional message is sent in response to an event, such as a purchase, a signup or a password request, and its main content is the information that event calls for. The event sets the timing, and the content concerns one person and one transaction.

Content decides the category, whichever tool sends the message. A receipt that adds product recommendations or a discount offer can come to look promotional, and once promotion becomes the main purpose the message is treated as [marketing email](/glossary/marketing-email/). Under the [CAN-SPAM Act](/glossary/can-spam-act/), a message whose primary purpose is transactional or relationship content is exempt from most of the commercial rules, although its header information still has to be accurate and not misleading.

## Why transactional email needs its own handling

**Speed matters more than for any other kind of mail.** A login code that arrives after it expires has failed even though it was delivered, so transactional systems send the moment the event happens, retry temporary failures promptly and watch delivery events for individual messages.

Reliability follows from that. Transactional mail usually has low complaint rates and high engagement, because recipients asked for it, and senders protect that record by keeping promotional traffic out of the same stream. Sending the two from separate subdomains, known as [reputation isolation](/glossary/reputation-isolation/), keeps complaints about campaigns from affecting the domain that carries password resets.

Opting out works differently too. A recipient cannot meaningfully unsubscribe from an order confirmation or a security alert, so purely transactional messages generally carry no [list unsubscribe](/glossary/list-unsubscribe/) mechanism, and suppressing them after a marketing unsubscribe would withhold messages the recipient still needs. The one-click unsubscribe rules that Google and Yahoo apply to bulk senders are likewise aimed at marketing and subscription mail.

## Best practices for transactional email

- **Keep promotion secondary:** a short, relevant line is acceptable, while a receipt built around offers risks being treated as marketing.
- **Send from a dedicated stream:** a subdomain such as `mail.example.com` used only for transactional mail keeps its reputation independent of campaigns.
- **Keep templates out of the code:** a template referenced by its [template slug](/glossary/template-slug/) lets content change without a deployment, while the application supplies the per-recipient data.
- **Include a plain text part:** some recipients and clients read plain text, and a text alternative avoids an HTML-only message.
- **Skip tracking where it adds nothing:** password resets and security notices gain little from open data and carry privacy concerns.

## Transactional email in Lettr

**Lettr's send API treats every email as transactional unless told otherwise**: the `options.transactional` field defaults to `true`, and marketing emails set it to `false`. Because of that default, every API send bypasses unsubscribe suppression unless the option is set to `false`, so a recipient who unsubscribed from marketing email still receives an API send that leaves it unchanged. The docs recommend `transactional: false` on marketing-shaped API sends such as newsletters, promotions and product announcements.

Templates follow the same split. Every Lettr template belongs to one of two modes, **Transactional** for sending through the API or SMTP and **Marketing** for campaigns, and folders are scoped to a mode as well.

Billing keeps the streams apart. Campaign sends are counted in a separate pool, so they do not use the transactional email allowance or cause transactional overage, and transactional email is priced per email while marketing is priced per contact. The docs describe separating transactional and marketing email on different sending domains or subdomains as a common practice to protect transactional sender reputation. The [transactional email guide](https://docs.lettr.com/knowledge-base/concepts/transactional-email) in the Lettr knowledge base covers the common types and sending through the API or SMTP.
