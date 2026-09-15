---
term: Non-Delivery Report
fullName: NDR
question: What is
description: "A non-delivery report (NDR) is the bounce message a mail server returns when an email cannot be delivered. How it relates to a DSN and how Lettr handles it."
related: [dsn, bounce, enhanced-status-code, backscatter, return-path]
reading:
  - title: Bounce Codes Reference
    href: https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference
  - title: Bounces in Lettr
    href: https://docs.lettr.com/learn/suppressions/bounces
---

**A non-delivery report (NDR)** is the message a mail server sends back to a sender when an email cannot be delivered. The term is most closely tied to Microsoft Exchange and Microsoft 365, whose reports arrive with a subject starting "Undeliverable:", but it is widely used for any [bounce](/glossary/bounce/) message. The standard format behind most NDRs is the Delivery Status Notification defined in RFC 3464, and an NDR is the failure case of that format.

## How a non-delivery report works

A failure can be detected at two points, and the point decides which server writes the report. When the receiving server rejects a message during the SMTP session, the sending server keeps the error and generates the NDR itself. When the receiving server accepts the message and fails later, it generates the NDR and mails it back, which makes it an [out-of-band bounce](/glossary/out-of-band-bounce/). **In both cases the report goes to the envelope sender**, the [Return-Path](/glossary/return-path/) address, not to the From header the recipient saw.

An Exchange-style NDR is written for two audiences. The top of the message explains the failure in plain language, often with a suggested fix for the sender. A lower section for email administrators holds the technical detail: the server that reported the problem, its SMTP reply and an [enhanced status code](/glossary/enhanced-status-code/).

The status code carries the meaning. `5.1.1` marks a recipient address that does not exist, `5.7.1` a message refused by policy, and a leading `4` a temporary condition rather than a permanent one. Microsoft also adds detail values of its own, such as `5.7.708`, so the text that follows the code is worth reading alongside it.

## Non-delivery report vs DSN

**A [DSN](/glossary/dsn/) is the format, and an NDR is one use of it.** RFC 3464 defines a DSN as a `multipart/report` message with a human-readable explanation, a machine-readable delivery-status part and the original message or its headers. Its `Action` field can say `failed`, `delayed`, `delivered`, `relayed` or `expanded`. An NDR corresponds to `failed`, so a delay warning or a delivery confirmation is a DSN but not a non-delivery report.

The two names also differ in scope. Some servers still send free-text bounce messages without a delivery-status part, and people call those NDRs too. "NDR" is the name a sender sees in the inbox, whatever the structure, while "DSN" refers to the standard structure that software can parse reliably.

## Common problems with non-delivery reports

**NDRs for forged mail reach people who never sent it.** Spam often carries someone else's address as the envelope sender, and a server that accepts such a message before bouncing it mails the NDR to that innocent address. Those reports are [backscatter](/glossary/backscatter/), and servers avoid producing them by rejecting mail during the SMTP session instead.

Fake NDRs are a phishing format as well. Messages styled as "Undeliverable" notices link to a login page or carry an attachment. A genuine NDR refers to a message its recipient actually sent, which makes the sent folder the quickest check.

The code in an NDR also says where the problem sits. A report for an unknown user points at the address, while a `5.7.x` rejection for policy, authentication or a blocked sending IP points at the sending side, and removing the recipient does nothing to fix it.

## Non-delivery report in Lettr

By default, Lettr sets the Return-Path of outgoing mail to an address on Lettr's bounce-processing domain, so **NDRs for mail sent through Lettr reach Lettr instead of the sender's mailbox**. Lettr parses the bounce codes, classifies bounce types, updates the suppression list and surfaces the result in the dashboard and webhooks. With the **Use this sending domain as bounce domain** toggle enabled, bounce messages use the sending domain's Return-Path instead.

The parsed result reaches webhook endpoints as a `message.bounce` event with `bounce_class`, `error_code`, `reason` and `raw_reason`, the receiving server's full response, for example `550 5.1.1 The email account that you tried to reach does not exist`. Hard bounce classes `10`, `30` and `100` lead to automatic suppression, and class `60` marks an automatic reply that needs no action. Reports that arrive after the receiving server first accepted a message come as separate `message.out_of_band` events.

In the Events dashboard these appear as bounced or bounced (OOB) badges, and Message Details shows the recipient domain and mailbox provider. The [Bounce Codes Reference](https://docs.lettr.com/knowledge-base/fundamentals/bounce-codes-reference) lists common Outlook and Microsoft 365 responses, such as `550 5.1.1 User unknown`, with a recommended action for each.
