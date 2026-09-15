---
term: Relay
heading: "What is email relay?"
description: "An email relay is a server passing a message on toward its destination. How relaying works, why open relays get blocked and how Lettr relays inbound mail."
published: 2026-09-14
updated: 2026-09-14
related: [smtp-relay, mx-record, webhook, variable-reply-to-address, mta]
reading:
  - title: Inbound Introduction
    href: https://docs.lettr.com/learn/inbound/introduction
  - title: Routing
    href: https://docs.lettr.com/learn/inbound/routing
  - title: Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
---

**Relay** is the act of a mail server accepting a message and passing it on toward its destination instead of storing it in a local mailbox. Almost every message is relayed at least once between the sender's application and the recipient's inbox. In an email platform the word also names inbound processing: the platform receives mail addressed to a customer's domain and relays it on to the customer's application.

## How email relaying works

A [mail transfer agent](/glossary/mta/) that receives a message over SMTP looks at the domain of each envelope recipient. **A domain the server is responsible for gets final delivery**, into a mailbox or a local program. Any other domain gets relayed: the server looks up the destination's [MX records](/glossary/mx-record/), opens a new SMTP connection to the server they name and hands the message over. Each server along the way adds a `Received` header, which is how the route shows up in the raw message.

Relaying servers take responsibility for the message once they answer `250`. A temporary failure further along keeps the message in the relaying server's queue for later attempts, and a permanent failure produces a bounce addressed to the envelope sender.

Typical relays sit in predictable places: the submission server of an email provider, a company's outbound gateway, a spam filtering service in front of a mailbox provider, and forwarding services that pass mail from one address to another.

## Open relays

A server decides whom it relays for. **Properly configured servers relay only for authenticated or trusted traffic**: clients that log in with SMTP AUTH, hosts on a trusted internal network, and incoming mail for the domains the server handles. Everything else is refused, usually with `550 5.7.1` and a "relaying denied" message.

An open relay accepts mail from anyone to anyone. Spammers scan for them because they hide the real origin of a message, and an open relay is found and abused quickly, which puts its IP address on blocklists and gets its legitimate mail rejected along with the spam. Authenticated sending services exist for the legitimate version of the same job: an [SMTP relay](/glossary/smtp-relay/) accepts mail from an application that logs in with credentials and delivers it on the application's behalf.

## Inbound relay

Inbound relay applies the same idea to receiving. A domain's MX records point at a provider's inbound servers, which accept mail for that domain as its final destination, parse the MIME structure and pass the content on to an application over HTTP. **The application receives each email as structured data** instead of reading a mailbox over IMAP.

This suits mail that software should act on: support requests that become tickets, replies to notifications, and messages that trigger a workflow. A dedicated subdomain such as `mail.example.com` keeps the inbound MX records apart from the root domain's regular mailboxes. Replies can be tied to the message that prompted them with a [variable reply-to address](/glossary/variable-reply-to-address/), which encodes a conversation ID in the address the recipient replies to.

## Relay in Lettr

Lettr's inbound processing receives email on a configured inbound domain and delivers it to the application through a [webhook](/glossary/webhook/). **Inbound domains are managed in the dashboard** under **Domains → Inbound**, and there is no public API endpoint for creating or managing them. The domain needs three MX records, all with priority 10: `rx1.sparkpostmail.com`, `rx2.sparkpostmail.com` and `rx3.sparkpostmail.com`. Equal priority spreads incoming mail across the three servers, and the others take over if one is unavailable.

Lettr handles SMTP reception, MIME parsing and attachment extraction, and the application receives JSON with the sender, recipients, subject, plain text and HTML bodies, headers and attachment URLs. Webhook credentials are configured with Basic Auth or OAuth 2.0 when the webhook is created in the dashboard.

Five webhook events track inbound processing. `relay.relay_injection` fires when an inbound email is received and queued, `relay.relay_delivery` when it is delivered to the configured endpoint, and `relay.relay_rejection` when it is rejected. `relay.relay_tempfail` marks a temporary failure to reach the endpoint, which Lettr retries automatically, and `relay.relay_permfail` a permanent failure after all retries are exhausted.

For reply tracking, a send can set `reply_to` to an address on the inbound domain, such as `reply+ticket_123@mail.example.com`, and the reply arrives as a `relay.relay_delivery` event. The Routing guide forwards a received email by sending a new message through the send API. The [Inbound Introduction](https://docs.lettr.com/learn/inbound/introduction) page covers setup.
