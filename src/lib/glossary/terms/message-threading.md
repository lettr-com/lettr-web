---
term: Message Threading
question: What is
description: "Message threading groups an email and its replies into one conversation using the Message-ID, In-Reply-To and References headers. How Lettr supports it."
related: [message-id, variable-reply-to-address, reply-to-header, mua, email-header]
reading:
  - title: Reply Tracking
    href: https://docs.lettr.com/learn/inbound/reply-tracking
  - title: Email Headers Explained
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-headers
  - title: Inbound Introduction
    href: https://docs.lettr.com/learn/inbound/introduction
---

**Message threading** is how email clients group a message and its replies into a single conversation. It relies on three headers: `Message-ID`, which identifies each message, and `In-Reply-To` and `References`, which a reply uses to point back at the messages before it. A client that threads well shows a whole exchange as one entry instead of scattering the replies through the inbox.

## How message threading works

Every message carries a unique [Message-ID](/glossary/message-id/), set when it is created. **A reply records its place in the conversation with two headers.** `In-Reply-To` holds the Message-ID of the message being answered. `References` holds the parent's own `References` list with the parent's Message-ID appended, so it grows into the full chain of IDs from the first message to the latest.

The replying [mail client](/glossary/mua/) writes these headers automatically, and the receiving client rebuilds the conversation by following them. Because `References` carries the whole chain, a thread can still be assembled when one message in the middle is missing, for example when it was deleted or never received.

Clients add their own rules on top of the standard headers. Many also compare subjects after stripping prefixes such as `Re:` and `Fwd:`, and Gmail keeps messages in one conversation only while the subject stays the same. Outlook additionally uses Microsoft's `Thread-Index` and `Thread-Topic` headers, so threading can look different for the same exchange in different clients.

## Common problems with message threading

**Unrelated automated emails can end up in one thread.** Messages from the same sender with an identical subject, such as a recurring "Your verification code", may be grouped together by subject, which hides the newest code inside a collapsed conversation. A unique detail in the subject, such as an order number or a timestamp, keeps each message separate.

Threads also break in the other direction. A client that drops the reference headers, a recipient who forwards instead of replying, or a subject edited mid-conversation all start a new thread. Duplicate Message-IDs cause a subtler failure, because clients and archives that treat the ID as unique can merge different messages or discard one as a duplicate.

Threading is a separate question from where replies go. The [Reply-To header](/glossary/reply-to-header/) controls the address a reply is sent to, while the threading headers only control how messages are grouped once they arrive.

## Threading replies in an application

Support desks, CRMs and marketplaces rebuild threads on the server instead of relying on a mail client. **The header-based approach stores the Message-ID of every outgoing message**, then matches each incoming reply by its `In-Reply-To` value and falls back to the IDs in `References`.

A [variable reply-to address](/glossary/variable-reply-to-address/) is the more reliable alternative. The outgoing message's reply address encodes a conversation ID, as in `reply+ticket_123@mail.example.com`, so the reply identifies its conversation through the recipient address alone, even when a client strips or rewrites the headers. A token in the subject line, such as `[Ticket #123]`, is a third option, although recipients can edit it.

## Message threading in Lettr

**Lettr's inbound processing lets an application capture replies to its transactional emails and thread conversations.** The recommended matching strategy is a variable reply-to address, set in the send request's `reply_to` field on an address at a configured inbound domain, such as `reply+ticket_123@mail.example.com`.

When the recipient replies, the application receives a `relay.relay_delivery` webhook event, and its content includes the reply's subject, text and headers such as `In-Reply-To` and `References`. The Reply Tracking guide shows matching a reply by `In-Reply-To` first and then by each ID in `References`, and the inbound docs describe using `Message-ID`, `In-Reply-To` and `References` to build full conversation threads.

`Message-ID` is one of the headers Lettr manages, so it cannot be set through the `headers` field of the send API. Custom headers such as a conversation ID are allowed, although the docs note that custom headers may not always be preserved in replies. The [Reply Tracking](https://docs.lettr.com/learn/inbound/reply-tracking) guide also covers detecting auto-replies through headers such as `Auto-Submitted` and common out-of-office subject patterns.
