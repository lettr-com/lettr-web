---
term: MTA
fullName: Mail Transfer Agent
heading: "What is an MTA?"
description: "An MTA (mail transfer agent) is server software that relays email between servers over SMTP, like Postfix or Exchange. How MTAs queue, retry and deliver mail."
published: 2026-09-14
updated: 2026-09-14
related: [mua, smtp, mx-record, deferral, smtp-relay]
reading:
  - title: How Email Delivery Works
    href: https://docs.lettr.com/knowledge-base/fundamentals/how-email-delivery-works
  - title: SMTP Protocol Basics
    href: https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics
---

**An MTA (Mail Transfer Agent)** is server software that accepts email and moves it toward its destination over SMTP. Postfix, Sendmail, Exim and Microsoft Exchange are common examples. Each MTA along the way either delivers a message into local storage or relays it to the next server, and a message usually passes through at least two: one on the sending side and one run by the recipient's mailbox provider.

## How an MTA works

An MTA works as a store-and-forward system. **Every message it accepts goes into a queue first**, and the MTA then tries to pass it on. For each recipient domain, it looks up the domain's [MX records](/glossary/mx-record/) in DNS, orders the servers by priority and connects to the preferred one on port 25. It greets the server with EHLO, upgrades the connection with STARTTLS when the server offers it, and sends the envelope and message with `MAIL FROM`, `RCPT TO` and `DATA`.

The reply code decides what happens next. A `2xx` reply means the receiving server has taken responsibility for the message, and the sending MTA removes it from its queue. A `4xx` reply is temporary, so the message stays queued as a [deferral](/glossary/deferral/) and is retried at growing intervals, commonly for several days before the MTA gives up. A `5xx` reply is permanent, and the MTA generates a bounce.

On the receiving side, an MTA listens on port 25, applies its policies to each connection and message, and hands accepted mail to a delivery agent that files it in the recipient's mailbox. Every MTA that handles a message adds a `Received` header at the top, so the headers read from the bottom up form a trace of the route it took.

## MTA vs MUA

**An [MUA](/glossary/mua/) is the email client a person uses**, while an MTA works between servers without a person involved. A mail client submits outgoing mail to a submission server, normally on port 587 or 465 with authentication, and MTAs take over from there, relaying on port 25 until the message reaches the recipient's server.

The line blurs in products that combine roles. Microsoft Exchange acts as an MTA for delivery and as a mailbox server for Outlook, and an [SMTP relay](/glossary/smtp-relay/) is an MTA that accepts mail from authenticated applications and forwards it on their behalf. The distinction is about the job being done, not the brand of software.

## Common problems with MTAs

**A self-hosted MTA starts with no reputation.** Mail from a new server's IP address is treated with suspicion by mailbox providers, and the operator also has to parse bounces, maintain a suppression list and enroll in feedback loops, all of which an email service provider handles by default.

Configuration mistakes cause most outright rejections. An open relay, an MTA that forwards mail for anyone, is found and abused quickly and ends up on blocklists. A sending IP without matching [reverse DNS](/glossary/reverse-dns/), or a HELO hostname that does not resolve, gets mail refused by many receiving servers. Many cloud hosting providers also restrict outbound connections on port 25, so an MTA on a new virtual machine may be unable to deliver anything at all.

Queues hide problems. A receiving server that keeps deferring mail produces no error for the sender's application, only a growing queue and delayed messages, so queue length is worth monitoring.

## MTA in Lettr

**When an application sends email through Lettr, Lettr's MTA handles delivery to the recipient's MTA**, on sending infrastructure powered by SparkPost. As each message goes out, Lettr queries DNS for the recipient domain's MX records, opens an SMTP connection to the highest-priority receiving server and negotiates TLS encryption when it is available.

A `message.delivery` webhook event means the recipient's mail server accepted the email, which does not guarantee it reached the inbox. Temporary delivery delays generate `message.delay` events and Lettr keeps retrying automatically, while emails that cannot be delivered generate `message.bounce` events with the receiving server's response. The Message Details page shows the **Sending IP** that delivered each email to the recipient's mail server, and the Analytics page can filter and break down metrics by Sending IP.

Applications that already speak SMTP can hand mail to Lettr through its SMTP relay at `smtp.lettr.com`, where ports 465 and 2465 use implicit TLS and ports 587 and 2587 use STARTTLS. The relay reads recipients from the SMTP envelope, so BCC addresses given there are delivered as regular recipients. The [How Email Delivery Works](https://docs.lettr.com/knowledge-base/fundamentals/how-email-delivery-works) page walks through each stage of the delivery pipeline.
