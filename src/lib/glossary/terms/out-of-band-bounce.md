---
term: Out of Band Bounce
question: What is
description: "An out-of-band bounce is a failure notice sent after the receiving server first accepted a message. How it differs from an SMTP rejection, and Lettr."
related: [bounce, hard-bounce, dsn, verp, envelope-from]
reading:
  - title: Event Types
    href: https://docs.lettr.com/learn/events/event-types
  - title: Bounces
    href: https://docs.lettr.com/learn/suppressions/bounces
  - title: Bounce Diagnosis
    href: https://docs.lettr.com/knowledge-base/troubleshooting/bounce-diagnosis
---

**An out-of-band bounce** is a delivery failure reported after the receiving server has already accepted the message. Instead of refusing the message during the SMTP session, the server takes it, finds out later that it cannot be delivered, and sends a separate failure notice back to the sender. The name refers to that separate channel: the failure arrives outside the conversation in which the message was handed over.

## How out-of-band bounces work

Most [bounces](/glossary/bounce/) happen in band. **The receiving server refuses the message with a 5xx or 4xx reply while the sending server is still connected**, so the sender learns the result at once and knows exactly which message and recipient failed.

An out-of-band bounce splits that into two steps. The receiving server answers the message with `250 OK`, which the sender records as a delivery, and processes it afterwards. When that later processing fails, the server generates a [DSN](/glossary/dsn/) (Delivery Status Notification), a new email addressed to the message's Return-Path, the [envelope from](/glossary/envelope-from/) address given in `MAIL FROM`.

Typical causes are gateways that accept mail for a whole organization and only then check whether the mailbox exists, quota or content checks that run after acceptance, and forwarding that fails at a later hop. The notice is an ordinary message, so it can itself be delayed or filtered, and some systems send no notice at all.

## Why out-of-band bounces are harder to handle

**The failure notice is detached from the original message.** An in-band rejection is tied to the connection that carried the message, while an out-of-band bounce has to be matched back to a message and recipient by reading the notice. DSN formats vary between servers, and some notices quote the original headers only in part or not at all.

Senders solve the matching problem through the envelope address. [VERP](/glossary/verp/) (Variable Envelope Return Path) puts a token identifying the message and recipient into the Return-Path, as in `bounces+abc123@...`, so every notice comes back addressed to a value that names the failed message.

Delivery data becomes less final as a result. A message recorded as delivered can still produce a bounce later, so a delivery event on its own does not prove the mailbox exists. Automatic replies that reach the bounce address, such as vacation notices, look similar and have to be told apart from real failures.

## Out-of-band bounce vs hard bounce

**"Out of band" describes when and how a failure is reported, while [hard bounce](/glossary/hard-bounce/) describes whether it is permanent.** An out-of-band notice for a mailbox that does not exist is a hard bounce and warrants the same handling as an immediate `550 5.1.1` rejection. A notice for a full mailbox is temporary, whichever way it arrives.

Accepting first and bouncing later also has a cost for everyone else. The notice goes to whatever Return-Path the message claimed, and when spam forges that address, the bounce lands on an innocent third party as [backscatter](/glossary/backscatter/). For that reason, receiving servers are generally expected to reject during the SMTP session wherever they can decide in time.

## Out-of-band bounce in Lettr

**Lettr reports out-of-band bounces as `message.out_of_band` webhook events**, separate from the `message.bounce` event. The event fires when the receiving server accepted the message initially, then later determined it could not be delivered and sent a separate bounce notification.

In the Events dashboard these appear with a red **Bounced (OOB)** badge, which the docs describe as less common but potentially harder to diagnose. The Message Details view lists every event recorded for a message in chronological order, so the out-of-band bounce can be read in the context of the events before it.

The Bounces page recommends handling out-of-band bounces the same way as regular bounces: updating records and suppressing hard bounces. The [Bounces](https://docs.lettr.com/learn/suppressions/bounces) page also shows an example `out_of_band` event payload and lists every bounce class.
