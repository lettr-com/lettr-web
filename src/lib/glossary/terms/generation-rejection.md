---
term: Generation Rejection
question: What is
description: "A generation rejection is a message the sending platform blocks while it is assembled, before delivery. How it differs from a failure or bounce, and Lettr."
related: [generation-failure, policy-rejection, bounce, webhook]
reading:
  - title: Webhook Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
  - title: Event Types in the Events dashboard
    href: https://docs.lettr.com/learn/events/event-types
  - title: Reading the Analytics Dashboard
    href: https://docs.lettr.com/learn/analytics/reading-the-dashboard
---

**A generation rejection** is a message that the sending platform blocks during the generation phase, the stage where an email is assembled and prepared for sending. A generation failure means the assembly went wrong; a rejection means the platform stopped the message on purpose. Because it happens before delivery, the recipient's mail server never receives anything.

## How generation rejections work

Generation sits between accepting a send request and handing a finished message to SMTP. **Checks can run at that point**, before any connection to a receiving server is opened. A message that does not pass them is stopped and recorded as rejected instead of moving on to the delivery queue.

The rules behind those checks are specific to each platform. They can concern the message, the request or the sending account, and a platform's documentation defines which ones it applies. What every generation rejection shares is the timing: the decision is made by the sender's own platform, so the result carries no SMTP reply code and no response text from a mailbox provider.

## Generation rejection vs generation failure

**The two outcomes share a phase but not a meaning.** A [generation failure](/glossary/generation-failure/) indicates that something went wrong while preparing the message. A generation rejection indicates the message was blocked while it was being prepared. Both stop the message before delivery, and neither involves the recipient's server.

The distinction guides the next step. A failure calls for finding out what broke in the pipeline. A rejection calls for finding out which rule blocked the message and whether the content, the configuration or the request has to change before sending again.

## Generation rejection vs policy rejection and bounce

A [policy rejection](/glossary/policy-rejection/) is the closest relative: a message rejected by a policy rule before delivery was attempted, for reasons such as content filtering, rate limits or a configuration issue. **A generation rejection pins the same idea to one stage.** Platforms that report both let a sender see whether a message was stopped while it was being assembled or by a policy applied around sending.

A [bounce](/glossary/bounce/) differs in kind. It comes from the receiving side after a delivery attempt, carries an SMTP code and says something about the recipient address or the sender's standing at that provider. A rejection before delivery says nothing about the address, so it is no reason to suppress the recipient, and it adds nothing to the bounce history mailbox providers keep.

## Common problems with generation rejections

**Rejections are easy to miss when monitoring stops at the API response.** A send request can be accepted and the message still stopped later in the pipeline, so an application that logs only a successful response keeps a record of a message that never left. Subscribing a [webhook](/glossary/webhook/) endpoint to rejection events closes that gap.

Grouping hides them too. A dashboard that folds every pre-delivery problem into one rejected count makes it hard to tell a content or configuration issue from a platform problem. Keeping generation rejections, generation failures and policy rejections as separate counts shows which kind is growing.

Retrying without a change is the other common mistake. A message blocked by a rule is likely to be blocked again when the identical request is repeated, so resending without a change mostly adds rejections to the logs.

## Generation rejection in Lettr

Lettr emits the `generation.generation_rejection` webhook event when a message is blocked during the generation phase, the point where the email is assembled and prepared for sending. It sits in the generation category next to `generation.generation_failure`, and both concern problems generating a message for delivery.

**In the Events dashboard a generation rejection shows as an orange badge.** The docs describe it as similar to a rejected event but specific to the generation phase, and group it with other events that occur before the email reaches the recipient's mail server. Orange marks a rejection to investigate, while a generation failure shows as a red failed badge instead.

The Analytics dashboard counts Generation Rejections as an injection metric, defined as emails rejected during the message generation phase, next to Rejected, Policy Rejections and Generation Failures. Lettr's webhook settings label the event generation rejection, and Lettr's MCP server can filter events by it: the `browse_email_events` tool accepts `generation_rejection` as an event type. The [Event Types](https://docs.lettr.com/learn/events/event-types) page explains what each dashboard badge and colour means.
