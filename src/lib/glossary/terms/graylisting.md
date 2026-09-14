---
term: Graylisting
question: What is
description: "Graylisting is an anti-spam method where a server temporarily rejects unknown senders and accepts the retry. How it works and how Lettr retries delays."
related: [deferral, soft-bounce, exponential-backoff, delivery-delay, verp]
reading:
  - title: Bounce Codes Reference
    href: https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference
  - title: Bounces and delayed delivery
    href: https://docs.lettr.com/learn/suppressions/bounces
---

**Graylisting** is an anti-spam technique in which a receiving mail server temporarily rejects a message from a sender it has not seen before and accepts the same message when the sending server tries again. Legitimate mail servers queue and retry temporary failures, as the SMTP standard expects, while spam software often does not retry. The cost for legitimate senders is a short delay on first contact, typically 5 to 30 minutes.

## How graylisting works

**Most graylisting keys on a triplet** of values from the SMTP conversation: the connecting IP address, the envelope sender given in `MAIL FROM` and the recipient given in `RCPT TO`. When a server sees a triplet for the first time, it answers with a temporary 4xx reply, often `451` with a request to try again later, and records the triplet with a timestamp.

The sending server treats that reply like any other [deferral](/glossary/deferral/). It keeps the message in its queue and retries after a delay. A retry that arrives after the graylisting server's minimum wait is accepted and the message is delivered. The server then remembers the triplet, so later messages with the same combination pass without a delay.

Spam sent from compromised machines or simple bulk scripts is often attempted once and never again. The temporary rejection alone filters that mail out without inspecting any content, which is what makes graylisting cheap for the receiving server.

## Graylisting vs soft bounce

A [soft bounce](/glossary/soft-bounce/) is any temporary delivery failure, such as a full mailbox or a server under load. **Graylisting produces the same kind of 4xx response on purpose**, as a test of the sender rather than a sign of trouble. For the sending server the handling is identical: keep the message, retry with [exponential backoff](/glossary/exponential-backoff/), and give up only if the failures continue past the retry window.

The meaning of the delay differs. A graylisting delay clears on an early retry and says nothing about the sender's reputation or the recipient's mailbox. A temporary failure that keeps repeating points to a real problem at the receiving side, or to throttling based on the sender's standing.

## Common problems with graylisting

**Changing IP addresses between attempts resets the triplet.** Large senders deliver from many IP addresses, and a retry that leaves from a different address than the first attempt looks like a new sender to the graylisting server. The wait starts again, which stretches the delay. Many graylisting implementations reduce the effect by matching on the network range instead of the exact address.

Changing envelope senders have the same effect. Bounce addresses that encode a per-message identifier, as [VERP](/glossary/verp/) does to match bounces to sends, give every message a different `MAIL FROM`, so each message forms a new triplet and meets the temporary rejection again.

Time-sensitive mail suffers most. Password resets, login codes and verification links can arrive after the recipient has given up or the code has expired, while the sender sees only a [delivery delay](/glossary/delivery-delay/) in its events. Graylisting is a choice made by the receiving server, so a sender cannot switch it off; consistent sending infrastructure and a stable envelope sender keep the delay short.

## Graylisting in Lettr

**Lettr retries temporary delivery delays automatically.** While a message is being retried, Lettr sends a `message.delay` webhook event, triggered when delivery is temporarily delayed. The payload carries `reason` with the receiving server's response, such as `421 Server temporarily unavailable`, and `num_retries`, next to `rcpt_to` and `sending_ip`.

In the Events dashboard a delay appears as a yellow delayed badge. A delayed email usually resolves on its own, and one that does not eventually becomes a bounce event. When the Message Details timeline shows a delayed event followed by a delivery event, the message was delivered after a temporary hiccup and needs no action. The Analytics dashboard counts these messages in the Delayed metric, emails that experienced a temporary delivery delay and are retried automatically.

The docs call for action only when delays persist, since that may indicate a delivery issue. The [Bounce Codes Reference](https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference) lists the temporary codes Lettr retries on its own and the permanent codes that end delivery.
