---
term: JMRP
fullName: Junk Mail Reporting Program
heading: "What is JMRP?"
description: "JMRP is Microsoft's feedback loop that reports junk complaints from Outlook.com and Hotmail users to senders. How it works and how Lettr handles complaints."
published: 2026-09-14
updated: 2026-09-15
related: [feedback-loop, snds, spam-complaint, arf, suppression-list]
reading:
  - title: Outlook / Microsoft 365 Delivery Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery
  - title: What Are Feedback Loops?
    href: https://docs.lettr.com/knowledge-base/concepts/feedback-loops
  - title: Complaints and Unsubscribes
    href: https://docs.lettr.com/learn/suppressions/complaints-unsubscribes
---

**JMRP (Junk Mail Reporting Program)** is Microsoft's [feedback loop](/glossary/feedback-loop/) for Outlook.com and Hotmail. When a user of those services marks a message as junk, Microsoft sends a complaint report to the address registered for the IP address that delivered it. Email service providers use the reports to stop mailing recipients who complained, which makes JMRP the Microsoft counterpart of the Yahoo and AOL programs.

## How JMRP works

**JMRP is registered per IP address**, not per domain. Enrollment runs through Microsoft's postmaster site with a Microsoft account. The applicant lists the sending IP addresses, and Microsoft forwards complaint notifications for them either to the abuse address in the IP's WHOIS record or to an address given during registration. A registration only covers the addresses listed in it, so mail from an IP that was never added produces no reports.

Each junk vote produces a report in [ARF](/glossary/arf/) (Abuse Reporting Format), the standard format for complaint messages. The report carries machine-readable fields that describe the complaint along with the original message or its headers, so the receiving system can connect it to a send. Providers often redact the recipient's address in the returned copy, which is why matching usually relies on identifiers the sender controls, such as the `Message-ID` or a custom header added at send time.

JMRP only reports on consumer mailboxes. Corporate Exchange and Microsoft 365 environments often handle junk reports internally, without sending anything back to the sender.

## JMRP vs SNDS

Microsoft runs a second sender program next to JMRP. [SNDS](/glossary/snds/) (Smart Network Data Services) reports on the sending IP addresses themselves: traffic volume per IP per day, a spam complaint rate that includes trap hits, and a filter result of green, yellow or red. **JMRP identifies individual complaints, while SNDS summarizes how Microsoft rates each IP.**

The two answer different questions and are read together. A red SNDS status means Microsoft is actively filtering an IP's mail to junk or rejecting it, and JMRP reports show which messages and recipients generated the complaints behind that rating. Gmail offers neither kind of per-message report and publishes aggregate complaint rates through Google Postmaster Tools instead.

## Why JMRP matters

**Microsoft weights sending IP reputation more heavily than Gmail does**, and a damaged reputation with Microsoft takes longer to recover. Complaints from Outlook recipients feed directly into that reputation. High complaint rates are one of the listed causes of the `550 5.7.1` block, where Microsoft refuses mail because the sending IP is on its internal block list, and lifting that block takes a delisting request.

A [spam complaint](/glossary/spam-complaint/) is far more damaging than an unsubscribe, because the recipient has told the provider the mail is unwanted. The expected response to a JMRP report is removing that recipient from the list at once. The reports also point at causes: complaints concentrated on one campaign, list source or template identify the mail that people did not expect, and tracking the counts over time shows whether changes to targeting or frequency are working.

## JMRP in Lettr

When a recipient complains, **the email provider's feedback report goes to Lettr**, the address is added to the [suppression list](/glossary/suppression-list/) automatically and a `message.spam_complaint` webhook event fires. The event carries `rcpt_to` with the recipient who complained, `message_id`, `timestamp`, `fbtype` with the feedback type (typically `abuse`) and `rcpt_meta` with the custom metadata from the original send.

A complaint appears as a spam event in the message timeline on the Message Details page. The Analytics page counts Spam Complaints, and its Configure modal can filter by Mailbox Provider, while the **Break Down By** dropdown groups metrics by the same field, which separates Outlook traffic from other providers.

The [Outlook / Microsoft 365 Delivery Issues](https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery) guide covers JMRP and SNDS along with the common Outlook block codes.
