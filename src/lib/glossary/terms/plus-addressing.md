---
term: Plus Addressing
question: What is
description: "Plus addressing adds a tag after a + sign in an email address while mail still reaches the base mailbox. How subaddressing works and how Lettr uses it."
related: [variable-reply-to-address, reply-to-header, email-relay, list-hygiene]
reading:
  - title: Email Address Anatomy
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-address-anatomy
  - title: Reply Tracking
    href: https://docs.lettr.com/learn/inbound/reply-tracking
  - title: Routing
    href: https://docs.lettr.com/learn/inbound/routing
---

**Plus addressing** is a convention in which a tag is added to the local part of an email address after a `+` sign, as in `jane+newsletter@example.com`, while mail still reaches the base mailbox `jane@example.com`. It is also called subaddressing, and RFC 5233 describes it for use in mail filtering. Recipients use it to sort incoming mail and to see where an address was shared, and applications use it to encode data in the addresses they receive mail on.

## How plus addressing works

**The receiving mail server decides what the `+` means.** When a message arrives for `jane+newsletter@example.com`, a server that supports subaddressing ignores everything from the separator to the `@` when it looks up the mailbox, delivers the message to `jane`, and keeps the full address available to filters. The sending side does nothing special, since every other server treats the tagged address as an ordinary, distinct address.

Support is decided per provider and per server. Many large mailbox providers accept the `+` separator, some mail systems use a different character such as a hyphen, and some treat the `+` as a literal part of the local part, in which case the tagged address does not exist. A plus address that works at one domain can hard bounce at another.

The `+` is a valid character in an address, but some signup forms still reject it. Those forms turn away recipients who rely on tags.

## Why plus addressing is used

**A unique tag per service shows which sender shared or leaked an address.** Recipients give each signup its own tag and set mail rules that file everything sent to that tag into a folder. A tagged address that starts attracting spam can be filtered out without changing the main address.

Applications use the same mechanism in reverse. A system that receives email can issue addresses such as `reply+ticket_123@mail.example.com`, where the tag identifies a ticket, order or conversation. Incoming mail then carries its own routing data in the recipient address, with no need to parse the subject line or quoted text. A [variable Reply-To address](/glossary/variable-reply-to-address/) set in the [Reply-To header](/glossary/reply-to-header/) is the usual way to direct replies to such an address.

## Common problems with plus addressing

**One mailbox can appear on a list several times.** `jane@example.com`, `jane+news@example.com` and `jane+promo@example.com` are different strings, so deduplication by exact address counts one person as three. Normalizing them is a judgment call, because stripping tags can break the recipient's own filters and the separator differs between providers.

Tags also appear in abuse. Some signups use them to claim a free trial or referral bonus repeatedly with one mailbox. Rules that block `+` outright catch real users as well, so products that limit one account per person usually compare base addresses only where the provider's separator is known.

For [list hygiene](/glossary/list-hygiene/), a tagged address follows the same rules as any other. One that hard bounces because its provider does not support tags is removed like any invalid address.

## Plus addressing in Lettr

**Lettr's reply tracking uses variable, or plus, addressing in the reply-to field.** A send request sets `reply_to` to an address on the sender's inbound domain that encodes the conversation, such as `reply+ticket_123@mail.example.com`. When the recipient replies, the reply goes to that inbound domain and Lettr sends a `relay.relay_delivery` webhook event, so the application can extract the conversation ID from the recipient address and match the reply to the original email.

Inbound [email relay](/glossary/email-relay/) routing builds on the same pattern. The Lettr routing guide shows a webhook handler that parses `reply+{ticketId}@` addresses and lists other common variable address patterns, such as `order+{orderId}@` for order communications and `confirm+{token}@` for email confirmations. The [Reply Tracking](https://docs.lettr.com/learn/inbound/reply-tracking) page covers matching replies to the original send.
