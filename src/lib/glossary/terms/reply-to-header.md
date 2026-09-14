---
term: Reply-To Header
question: What is
description: "The Reply-To header tells mail clients where to send replies when that differs from the From address. How it works, how it is abused and how Lettr sets it."
related: [from-header, variable-reply-to-address, message-threading, email-header, plus-addressing]
reading:
  - title: Recipients
    href: https://docs.lettr.com/learn/sending/recipients
  - title: Reply Tracking
    href: https://docs.lettr.com/learn/inbound/reply-tracking
---

**The Reply-To header** is an email header that tells the recipient's mail client where to send a reply. Without it, a reply goes to the address in the From header. With it, a message can come from one address and collect replies at another, which is the usual setup for mail sent from an automated address.

## How the Reply-To header works

Reply-To is an optional originator field defined in RFC 5322, written like any address header: `Reply-To: Support Team <support@example.com>`. **When the recipient clicks Reply, the client fills the To line with the Reply-To address** instead of the From address. Reply-all behaviour varies between clients, and some add the From address as well.

The header affects replies and nothing else. Bounces and other delivery failures go to the envelope sender recorded in the Return-Path, not to Reply-To. Grouping a reply into a conversation is also a separate mechanism: [message threading](/glossary/message-threading/) relies on the Message-ID, In-Reply-To and References headers, whichever address the reply was sent to.

Like other [email headers](/glossary/email-header/), Reply-To is written by the sending application or platform and travels unchanged with the message. Mailing list software sometimes rewrites it to point at the list, so that replies reach every member instead of only the original author.

## Reply-To vs From header

The [From header](/glossary/from-header/) identifies who sent the message, and it is the address that DMARC authenticates. **Reply-To is only a routing instruction for replies**, and no authentication check covers it. A message can therefore pass SPF, DKIM and DMARC for its From domain while its Reply-To points at any address on any domain.

The common pattern pairs an automated From address, such as `noreply@example.com`, with a Reply-To on a staffed mailbox such as `support@example.com`. Receipts, notifications and account emails use this so that a recipient's reply reaches someone who can act on it.

## Common problems with the Reply-To header

**Phishing uses Reply-To to redirect the conversation.** Because DMARC does not check it, an attacker can send from a domain that passes authentication, or from a compromised account, and set Reply-To to a mailbox they control. Business email compromise often works this way: the message looks legitimate and the reply goes somewhere else. Some filters weigh a Reply-To domain that differs from the From domain as one signal among many.

The legitimate failure is quieter. A Reply-To that points at an unmonitored mailbox, or at a typo, loses every reply without any error on the sending side.

Static addresses also make replies hard to match. A single `support@` Reply-To collects replies from every message together, with nothing to say which email each one answers. A [variable reply-to address](/glossary/variable-reply-to-address/) solves this by encoding an identifier in the address itself, often with [plus addressing](/glossary/plus-addressing/) in the form `reply+ticket_123@mail.example.com`.

## Reply-To header in Lettr

A Lettr send request sets the header with two fields: **`reply_to` for the address** and `reply_to_name` for its display name. The Recipients docs show the typical case, a message from `noreply@example.com` with `reply_to` set to `support@example.com`. When `reply_to` is omitted, replies go to the From address.

`Reply-To` is one of the headers Lettr manages itself, so it cannot be set through the `headers` field of a send, which accepts custom headers only.

For reply tracking, the Lettr docs recommend a variable reply-to address on a configured inbound domain, such as `reply+ticket_123@mail.example.com`, where the part after the plus sign encodes the conversation. When the recipient replies, the application receives a `relay.relay_delivery` webhook event for the reply, including its subject, text and headers such as In-Reply-To and References. The [Reply Tracking](https://docs.lettr.com/learn/inbound/reply-tracking) page covers matching replies to the original send.
