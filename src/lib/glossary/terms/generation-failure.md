---
term: Generation Failure
question: What is
description: "A generation failure is an error while a message is assembled for sending, before any delivery attempt. How it differs from a bounce and how Lettr reports it."
related: [generation-rejection, bounce, substitution-data, webhook, policy-rejection]
reading:
  - title: Webhook Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
  - title: Template Language
    href: https://docs.lettr.com/learn/templates/template-language
  - title: Event Types in the Events dashboard
    href: https://docs.lettr.com/learn/events/event-types
---

**A generation failure** is an error in the stage where an email platform assembles a message before sending it. The platform takes the send request, combines the content, the recipient details and any template data into a finished message, and only then hands it to the delivery system. When that assembly step goes wrong, the message is never completed, no delivery attempt follows, and the recipient's mail server never sees it.

## How the generation phase works

Platforms that accept structured send requests split the life of a message into two phases. **Generation turns a request into a deliverable message.** For a templated send, the template is rendered with the [substitution data](/glossary/substitution-data/) for each recipient, [merge tags](/glossary/merge-tag/) are replaced with values, and the headers, tracking links and the text and HTML parts are put together into a MIME message. Delivery then takes the finished message and transmits it over SMTP to the receiving server.

The split matters for diagnosis. Problems during delivery produce an SMTP response from the receiving side, such as a 4xx deferral or a 5xx rejection. Problems during generation do not, because no connection to a receiving server has been opened yet. The error comes from the sending platform itself and is reported only in that platform's events, logs and metrics.

Where the cause sits depends on the platform. It can lie in the request being rendered or in the platform's own processing, which is why the platform's event description and its documentation are the starting point for any investigation.

## Generation failure vs bounce

A [bounce](/glossary/bounce/) is a refusal from the recipient's side after a delivery attempt. **A generation failure happens entirely on the sending side.** There is no SMTP reply code, no bounce classification and no reason text from a mailbox provider.

That difference changes the handling. A bounce is information about the recipient address, and a hard bounce leads to suppression. A generation failure says nothing about whether the address is valid, so suppressing the recipient is the wrong response. Because no mailbox provider received the message, the failure also adds nothing to the bounce history that providers use to judge the sender.

A generation failure is also distinct from a [generation rejection](/glossary/generation-rejection/). Both stop a message in the same phase, but a failure means something went wrong while preparing the message, whereas a rejection means the message was blocked during preparation.

## Common problems with generation failures

**A successful API response can hide a failure that happens later.** Many platforms accept a send request, queue it and generate the message afterwards, so an application that treats the response as proof of sending never learns that a message was not built. Subscribing to the platform's generation events closes that gap.

Aggregate numbers can mislead as well. A dashboard that jumps from the number of requests straight to deliveries hides the messages lost in between, and a batch where some messages failed generation can look like a delivery problem at the receiving side. Comparing requested, generated and delivered counts shows which stage lost the messages.

Blind retries are the third trap. Resending a request without knowing why generation failed can fail the same way again, and an automatic retry loop that ignores the event type can repeat indefinitely. Recording the event, alerting on it and investigating before resending avoids that.

## Generation failure in Lettr

Lettr reports a generation failure as the `generation.generation_failure` webhook event, triggered when something goes wrong while preparing the message for delivery. **Generation events form their own webhook category**, covering problems with generating a message, meaning assembling and preparing it for delivery. The related `generation.generation_rejection` event fires when a message is blocked during the same phase.

In the Events dashboard a generation failure appears as a red **Failed** badge, in the group of rejection and failure events that occur before the email reaches the recipient's mail server. The Analytics dashboard counts Generation Failures among its injection metrics, next to Rejected, Policy Rejections and Generation Rejections.

The docs' error monitoring example alerts a team when a `generation.generation_failure` or `message.bounce` event arrives, as a way to catch failures that occur after the API accepts an email. Through Lettr's MCP server, the `browse_email_events` tool accepts `generation_failure` as an event type filter. The [Webhook Event Types](https://docs.lettr.com/learn/webhooks/event-types) page lists every event in the generation category.
