---
term: ARF
fullName: Abuse Reporting Format
heading: "What is ARF?"
description: "ARF is the standard format mailbox providers use to send spam complaint reports back to senders. What an ARF report contains and how Lettr processes it."
published: 2026-09-14
updated: 2026-09-15
related: [feedback-loop, spam-complaint, suppression-list, jmrp, sender-reputation]
reading:
  - title: What Are Feedback Loops
    href: https://docs.lettr.com/knowledge-base/concepts/feedback-loops
  - title: Complaints and Unsubscribes
    href: https://docs.lettr.com/learn/suppressions/complaints-unsubscribes
---

**ARF (Abuse Reporting Format)** is the standard message format, defined in RFC 5965, that mailbox providers use to report spam complaints back to senders. When a recipient clicks "Report spam" or "Mark as junk", the provider generates an ARF report and sends it to the address registered in its [feedback loop](/glossary/feedback-loop/) program. The format is machine-readable, so a sending platform can process complaints automatically at any volume.

## How ARF works

An ARF report is **a MIME multipart message with three parts**:

- **Human-readable description:** a plain text summary of the complaint.
- **Machine-readable report:** structured fields such as `Feedback-Type`, `User-Agent`, `Version` and `Arrival-Date`.
- **Original message:** the reported email, either complete or reduced to its headers.

The `Feedback-Type` field says what kind of report it is. `abuse` means the recipient reported the message as spam, `fraud` marks suspected phishing, `not-spam` records a recipient marking a message as legitimate, which is rare, and `other` covers the rest.

The sender matches a report to the original send using the returned headers. Some providers return a redacted version of the original message, so senders usually rely on an identifier they control, such as the `Message-ID` or a custom header added at send time, rather than on the recipient address.

## Why ARF matters

**A [spam complaint](/glossary/spam-complaint/) is one of the most heavily weighted signals in [sender reputation](/glossary/sender-reputation/)**, and it is far more damaging than an unsubscribe. ARF turns the recipient's click into data the sender can act on. A shared format means a sending platform parses reports from every participating provider with the same code.

The standard response to an ARF report is suppression. A recipient who complained should receive nothing further, because each additional message to that address risks another complaint and pushes the complaint rate higher.

## Common problems with ARF

**Not every mailbox provider sends ARF reports.** Yahoo and AOL run one of the original feedback loop programs with ARF reports that include full message headers, and Microsoft sends ARF reports for Outlook.com and Hotmail through its [JMRP](/glossary/jmrp/) program. Gmail does not offer a traditional feedback loop and publishes complaint data in aggregate through Google Postmaster Tools instead, so Gmail complaints never arrive as individual reports.

Apple processes complaints without a public feedback loop enrollment program, and many corporate mail systems handle complaints internally without generating external reports. A complaint count built only from ARF reports therefore misses part of the picture, and provider dashboards such as Postmaster Tools cover the rest.

## ARF in Lettr

For email sent through Lettr, **complaint reports go to Lettr's feedback loop processing**, and ARF reports never need parsing by hand. Lettr identifies the original message and recipient, adds the address to the [suppression list](/glossary/suppression-list/) immediately and records the event, so later sends skip that address even when an application requests them.

Each complaint reaches the configured webhook endpoints as a `message.spam_complaint` event. The payload carries `rcpt_to` with the recipient who complained, `message_id`, `timestamp`, `fbtype` with the type of feedback (typically `abuse`) and `rcpt_meta` with the custom metadata from the original send, which lets an application link the complaint back to its own records.

In the Events dashboard a complaint appears as a red spam event. Lettr's acceptable use policy requires a spam complaint rate below 0.1%, with a hard limit of 0.3%, and re-adding a complained address to get around suppression is a policy violation. The [Complaints and Unsubscribes page](https://docs.lettr.com/learn/suppressions/complaints-unsubscribes) in the Lettr docs documents the event fields and complaint rate guidelines.
