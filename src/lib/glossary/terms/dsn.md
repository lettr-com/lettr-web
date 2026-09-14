---
term: DSN
fullName: Delivery Status Notification
question: What is
description: "A DSN (Delivery Status Notification) is the standard machine-readable bounce message from RFC 3464. Its structure, how it is sent, and bounces in Lettr."
related: [bounce, out-of-band-bounce, enhanced-status-code, return-path, backscatter]
reading:
  - title: Bounce Codes Reference
    href: https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference
  - title: Bounce Diagnosis
    href: https://docs.lettr.com/knowledge-base/troubleshooting/bounce-diagnosis
  - title: Bounces in Lettr
    href: https://docs.lettr.com/learn/suppressions/bounces
---

**A DSN (Delivery Status Notification)** is a standardized email message that a mail server sends back to report what happened to a message it handled, most often that it could not be delivered. The format is defined in RFC 3464, and a companion SMTP extension in RFC 3461 lets the sender ask for notifications. DSNs are what most people call bounce messages, and their structured fields let software classify a [bounce](/glossary/bounce/) without guessing from free-form text.

## How a DSN is structured

A DSN is a MIME message of type `multipart/report` with `report-type=delivery-status`. **It has three parts.** The first is a human-readable explanation of the problem. The second is a `message/delivery-status` part holding the machine-readable data. The third is the original message, or only its headers, so the sender can tell which message failed.

The delivery-status part starts with fields about the whole report, such as `Reporting-MTA`, the server that generated it. A block of fields for each affected recipient follows, and these carry the meaning:

- **`Final-Recipient`:** the recipient address the report is about.
- **`Action`:** what happened, one of `failed`, `delayed`, `delivered`, `relayed` or `expanded`.
- **`Status`:** an [enhanced status code](/glossary/enhanced-status-code/) such as `5.1.1`, where the first digit separates permanent failures (`5`) from temporary ones (`4`).
- **`Diagnostic-Code`:** the remote server's actual reply, for example `smtp; 550 5.1.1 user unknown`.
- **`Remote-MTA`:** the receiving server that produced that reply.

## How a DSN is sent

A DSN goes to the envelope sender, the [Return-Path](/glossary/return-path/) address, not to the From header the recipient saw. **The DSN itself is sent with an empty envelope sender**, written `MAIL FROM:<>`, so that a notification that fails to deliver cannot trigger another notification and start a loop.

Notifications come from two places. A sending server generates one when a receiving server rejects a message during the SMTP session, or when a temporary failure keeps repeating until the server stops retrying. A receiving server generates one when it accepted the message first and only later found it could not deliver it; that late report is an [out-of-band bounce](/glossary/out-of-band-bounce/).

The RFC 3461 extension adds control on the sending side. A `NOTIFY` parameter on each recipient requests reports on failure, delay or success, and `RET` asks for the full original message or only its headers in the report. A `delayed` DSN is a warning that delivery is still being attempted, not a final result.

## Common problems with DSNs

Not every bounce follows the standard. **Some servers still send free-text bounce messages** without a delivery-status part, and the wording in `Diagnostic-Code` varies by provider even when the structure is correct. Bounce processing therefore reads the status code first and keeps the full text for cases the code does not explain.

Automatic replies arrive at the same Return-Path. Vacation and out-of-office messages are not DSNs and not delivery failures, and a message's [Auto-Submitted header](/glossary/auto-submitted-header/) helps tell them apart.

The accept-then-bounce pattern has a side effect. When spam forges someone else's address as the envelope sender, a server that accepts the message and bounces it later mails the DSN to the forged address. Those unwanted notifications are [backscatter](/glossary/backscatter/), and servers avoid producing them by rejecting mail during the SMTP session instead.

## DSN in Lettr

By default, Lettr sets the Return-Path of outgoing mail to an address on Lettr's own bounce-processing domain, so **bounce notifications reach Lettr instead of the sender's mailbox**. Lettr parses the bounce codes, classifies bounce types, updates the suppression list and surfaces the result in the dashboard and webhooks. With the **Use this sending domain as bounce domain** toggle enabled, bounce messages use the sending domain's Return-Path instead.

The parsed result reaches webhook endpoints as a `message.bounce` event with `bounce_class`, `error_code`, `reason` and `raw_reason`, the receiving server's full response. Hard bounce classes `10`, `30` and `100` lead to automatic suppression, and class `60` marks an automatic reply that needs no action. Notifications that arrive after the receiving server first accepted a message are reported separately as `message.out_of_band` events.

In the Events dashboard, these appear as **Bounced** or **Bounced (OOB)** badges, and Message Details gives the bounce reason and whether it was hard or soft. The [Bounces page](https://docs.lettr.com/learn/suppressions/bounces) in the Lettr docs lists every bounce class and its recommended action.
