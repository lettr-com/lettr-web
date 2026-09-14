---
term: Variable Reply-To Address
question: What is
description: "A variable reply-to address encodes an identifier, such as a ticket number, in the Reply-To address so every reply can be matched to its conversation."
related: [plus-addressing, reply-to-header, message-threading, email-relay, mx-record]
reading:
  - title: Reply Tracking
    href: https://docs.lettr.com/learn/inbound/reply-tracking
  - title: Inbound Domains
    href: https://docs.lettr.com/learn/domains/inbound-domains
  - title: Inbound Introduction
    href: https://docs.lettr.com/learn/inbound/introduction
---

**A variable reply-to address** is a Reply-To address generated for each message, with an identifier for the conversation built into it, such as `reply+ticket_123@mail.example.com`. When the recipient replies, the reply is delivered to that exact address, and the application reads the identifier from it to attach the reply to the right ticket, order or thread. The technique lets software process replies automatically without guessing from subject lines or quoted text.

## How a variable reply-to address works

The sending application creates the address at send time. **The identifier sits after a separator in the local part**, most often a plus sign, the same pattern as [plus addressing](/glossary/plus-addressing/). The address goes into the [Reply-To header](/glossary/reply-to-header/), so the From address can stay a recognisable sender while replies are routed somewhere else.

The domain in the address has to accept mail for every variation of it. Its [MX records](/glossary/mx-record/) point at a server that receives mail for the whole domain and hands each message to the application, usually an inbound [email relay](/glossary/email-relay/) that parses the message and posts it to a webhook. The application then extracts the identifier from the recipient address with a simple pattern match.

Because the receiving domain belongs to the sender and its inbound processing keeps the full recipient address, the separator does not depend on any mailbox provider's subaddressing rules. The sender decides the format and parses it on its own side.

## Variable reply-to address vs threading headers

Mail clients link a reply to its original with the Message-ID, In-Reply-To and References headers, the mechanism behind [message threading](/glossary/message-threading/). **Those headers depend on the replying client** keeping them intact, and they identify a message rather than a business object, so the application needs a stored mapping from each Message-ID it sent to the conversation behind it.

A variable address carries the business identifier itself, and it arrives as the recipient address of the reply as long as the recipient answers the message instead of writing a new one. The two approaches combine well: the address identifies the conversation, and In-Reply-To identifies which message in it was answered. Tokens in the subject line, such as `[Ticket #123]`, are the weakest option, since recipients edit subjects.

## Best practices for variable reply-to addresses

- **Encode an opaque token:** a random or signed value reveals nothing about internal IDs and cannot be guessed to post a message into someone else's ticket.
- **Check who replied:** the token says which conversation a reply claims to belong to, and comparing the sender with the conversation's participants keeps strangers from adding messages.
- **Filter automatic replies:** out-of-office responses and delivery notifications reach the same address, and headers such as `Auto-Submitted` separate them from replies written by people.
- **Keep tokens valid:** recipients reply to old messages weeks later, so an identifier should resolve for as long as its conversation can be reopened.

A dedicated receiving subdomain, such as `mail.example.com`, keeps this automated traffic away from the MX records and staff mailboxes of the root domain.

## Variable reply-to address in Lettr

**The Lettr Reply Tracking guide names variable, or plus, addressing in the reply-to field as the most reliable way to track replies.** A send request sets the `reply_to` field, with `reply_to_name` for the display name, to an address such as `reply+ticket_123@mail.example.com` on an inbound domain. When the customer replies, the email goes to that inbound domain and the application receives a `relay.relay_delivery` webhook event, then extracts the conversation ID from the recipient address and matches the reply to the original email.

Inbound domains are managed under **Domains** → **Inbound** and need three MX records, all with priority 10, so incoming mail is spread across the three servers. Inbound webhook requests can be authenticated with Basic Auth or OAuth 2.0, and the docs advise verifying the credentials before processing incoming email.

The guide also shows auto-reply detection that checks the `Auto-Submitted`, `X-Auto-Response-Suppress` and `Precedence` headers and common subject patterns such as out-of-office replies. It lists custom headers, subject line tokens and Message-ID tracking as other matching strategies, and notes that custom headers may not always be preserved in replies. The [Reply Tracking](https://docs.lettr.com/learn/inbound/reply-tracking) page includes a complete support ticket example.
