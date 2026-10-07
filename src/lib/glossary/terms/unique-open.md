---
term: Unique Open
heading: "What is a unique open?"
description: "A unique open counts each recipient who opened an email once, however often they reopened it. How it differs from total opens and where Lettr reports it."
published: 2026-09-15
updated: 2026-09-15
related: [initial-open, open-tracking, mail-privacy-protection, click-tracking, email-engagement]
reading:
  - title: Reading the Dashboard
    href: https://docs.lettr.com/learn/analytics/reading-the-dashboard
  - title: Campaign Analytics & Reporting
    href: https://docs.lettr.com/learn/campaigns/analytics-and-reporting
---

**A unique open** is a recipient who opened an email at least once, counted a single time however often they came back to it. Total opens count every recorded open, so a subscriber who reads a newsletter three times adds three to total opens and one to unique opens. Unique opens are the basis of the open rate most reports show, because they measure how many people opened a message rather than how many times its tracking image loaded.

## How unique opens are counted

[Open tracking](/glossary/open-tracking/) records an open when a mail client loads a [tracking pixel](/glossary/tracking-pixel/), an invisible image whose address is unique to the message and recipient. **Because the pixel identifies the recipient, the tracking server can separate a first open from a repeat.** The first load for a message and recipient is the [initial open](/glossary/initial-open/), every later load is a repeat open, and the unique open count for a message is the number of recipients with an initial open.

Repeat loads come from ordinary reading habits, such as reopening the message later or reading it on a second device. Forwarded copies carry the original pixel, so opens by the people an email was forwarded to are attributed to the original recipient and add to total opens without adding a unique open.

The unique open rate divides unique opens by delivered emails. As an example of the arithmetic, 540 unique opens from 2,000 delivered messages is a unique open rate of 27%. Some tools divide by sent emails instead, which lowers the rate whenever messages bounce, so rates are only comparable within one tool.

## Unique opens vs total opens

**Unique opens count people, while total opens count pixel loads.** The gap between the two shows how often readers return to a message. A high ratio of total to unique opens on one send suggests reference content that recipients keep coming back to, or a message passed around within a team.

As a headline figure the total is misleading, because a handful of readers who open the same email many times can outweigh everyone who opened it once. Comparing sends by unique opens keeps each recipient's weight equal. Click metrics follow the same split: unique clicks count recipients who clicked at least once, and click-to-open rate divides unique clicks by unique opens to show how many of the people who opened went on to act.

## Common problems with unique open data

**Deduplication removes repeat opens, but it cannot tell whether a person made the first one.** [Mail Privacy Protection](/glossary/mail-privacy-protection/) in Apple Mail pre-fetches images whether or not the recipient reads the message, so nearly every message to those users records an open, and each of those recipients becomes a unique open. Preview panes and corporate security gateways that fetch images for scanning inflate unique opens the same way.

The error also runs in the other direction. Clients that block images by default never request the pixel until the reader allows images, and plain text email carries no pixel at all, so recipients who read in those conditions never appear as unique opens.

With inflation and undercounting mixed together, a unique open rate works best as a trend within one audience over time. Decisions based on [engagement](/glossary/email-engagement/), such as removing inactive subscribers, hold up better when they combine opens with [click tracking](/glossary/click-tracking/) data and activity outside the email.

## Unique open in Lettr

The Analytics dashboard reports **Unique Opens**, the number of unique recipients who opened the email at least once, and it is one of the four metrics shown by default next to Targeted, Accepted and Bounces. Emails sent with open tracking disabled do not contribute to it. The breakdown table can split the metric by dimensions such as Recipient Domain or Mailbox Provider.

Each campaign's Show page lists Opens, where one recipient opening twice counts as two, next to Unique opens, the distinct recipients who opened at least once. The Analytics & Reporting docs recommend unique opens for engagement rates and define open rate as unique opens divided by deliveries. They also note that clients which block images by default show as non-opens even when the email was read, so open rates tend to slightly undercount. The Campaigns API returns each campaign with embedded engagement stats, including `unique_opens`.

On the webhook side, `engagement.initial_open` fires on the first open of an email by a recipient, and subsequent opens fire `engagement.open`. The [Open & Click Tracking Accuracy](https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy) guide lists Apple Mail Privacy Protection among the factors that inflate open counts.
