---
term: Bounce Rate
description: "Bounce rate is the percentage of sent emails that bounce. How to calculate it, what counts as healthy, what drives it up and where Lettr reports it."
related: [bounce, hard-bounce, list-hygiene, sender-reputation, double-opt-in]
reading:
  - title: Bounce Diagnosis
    href: https://docs.lettr.com/knowledge-base/troubleshooting/bounce-diagnosis
  - title: Bounces in Lettr
    href: https://docs.lettr.com/learn/suppressions/bounces
  - title: Campaign Analytics & Reporting
    href: https://docs.lettr.com/learn/campaigns/analytics-and-reporting
---

**Bounce rate** is the percentage of sent emails that bounce, calculated as `(bounced emails / sent emails) x 100`. It is one of the main measures of list quality, and mailbox providers watch it closely because a sender with many undeliverable addresses looks like one that does not maintain its list. A bounce rate below 2% is considered healthy.

## How bounce rate is calculated

The formula is simple, but **the inputs vary between tools**. The denominator can be emails targeted, emails accepted into the sending pipeline, or delivery attempts, and the numerator can count every [bounce](/glossary/bounce/) or only permanent ones. Two dashboards reporting different rates for the same send are often just using different definitions, so a comparison should always be made within one tool.

As an example of the arithmetic, 30 bounces out of 2,000 sent emails is a bounce rate of 1.5%. The rate can also move after a send finishes, because out-of-band bounces arrive after the message was first accepted.

A single overall figure can hide a local problem. A list with a healthy total rate can still have one mailbox provider rejecting most of its messages, which only shows up when the rate is broken down by recipient domain or provider.

## What a good bounce rate is

A bounce rate below 2% is healthy, and a rate consistently above 5% can get mail blocked or filtered to spam. A rising rate deserves a review for stale or unvalidated addresses and a look at [list hygiene](/glossary/list-hygiene/) around recent imports, and sending to unverified segments should stop until the source of bad addresses is found.

## Why bounce rate matters

**Mailbox providers treat a high bounce rate as evidence of a poorly kept list**, and that judgment feeds [sender reputation](/glossary/sender-reputation/). Lower reputation means more filtering and blocking for the sender's mail as a whole, including mail to valid recipients.

[Hard bounces](/glossary/hard-bounce/) weigh most, because they show a sender mailing addresses that do not exist. [Soft bounces](/glossary/soft-bounce/) matter less individually, but an address that keeps failing adds to the rate on every send until it is removed.

## Common causes of a high bounce rate

**Old or unconfirmed addresses cause most high bounce rates.** Importing a list that has not been mailed in a long time brings in addresses that have since been abandoned or deleted. Signup forms without confirmation let typos such as `gmial.com` straight onto the list, and purchased or scraped lists combine both problems with no consent.

Missing bounce processing makes it worse over time, because the same failed addresses are mailed again on every send. A sudden jump across a single provider is a different case: that pattern points to a block on the sending side rather than a list problem.

The fixes follow the causes. [Double opt-in](/glossary/double-opt-in/) confirms an address is real before it joins a list, validation at signup catches typos and disposable domains, removing subscribers who have not engaged in 6 to 12 months clears out addresses likely to go dead, and processing bounce events as they arrive keeps failed addresses from being mailed twice.

## Bounce rate in Lettr

Lettr's Analytics dashboard shows **Targeted**, **Accepted**, **Bounces** and **Unique Opens** by default, and the Bounces metric counts hard and soft bounces together. Breaking the view down by **Recipient Domain** or **Mailbox Provider** shows when one provider is behind a rate that looks healthy overall.

For campaigns, the Show page reports each campaign's metrics, and the Analytics & Reporting docs define bounce rate there as bounces divided by injections, with under 2% healthy. **Campaigns with a high bounce rate are highlighted with a visible warning** on the Show page, as a signal to audit the audience before sending more.

Hard-bounced addresses are added to the suppression list automatically, so later sends skip them instead of bouncing again. For a custom calculation, `message.bounce` and `message.out_of_band` webhook events deliver each bounce in real time with its `bounce_class`. The [Bounces page](https://docs.lettr.com/learn/suppressions/bounces) lists the bounce rate guidelines alongside every bounce class.
