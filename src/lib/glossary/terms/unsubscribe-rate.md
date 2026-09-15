---
term: Unsubscribe Rate
heading: "What is unsubscribe rate?"
description: "Unsubscribe rate is the share of delivered emails that lead a recipient to opt out. How it is calculated, how it links to complaints, and where Lettr shows it."
published: 2026-09-15
updated: 2026-09-15
related:
  [spam-complaint, one-click-unsubscribe, list-unsubscribe, suppression-list, preference-center]
reading:
  - title: Campaign Analytics & Reporting
    href: https://docs.lettr.com/learn/campaigns/analytics-and-reporting
  - title: Complaints and Unsubscribes
    href: https://docs.lettr.com/learn/suppressions/complaints-unsubscribes
---

**Unsubscribe rate** is the percentage of delivered emails that lead a recipient to opt out of a sender's mail, calculated as `(unsubscribes / delivered emails) x 100`. It shows how closely a mailing matches what recipients signed up for. An unsubscribe is a neutral exit rather than a penalty, so the rate is most useful read next to the complaint rate and compared with the sender's own earlier sends.

## How unsubscribe rate is calculated

**The numerator counts every recipient who opted out through the message**, whether through a link in the email body or through the mail client's own unsubscribe button. The second path is a [list unsubscribe](/glossary/list-unsubscribe/), and a report that counts only body links undercounts the rate for audiences whose clients show the button.

The denominator varies between tools. Delivered emails is the common choice, since a recipient whose message bounced never had a chance to unsubscribe, but some reports divide by sent emails or by recipients. As an example of the arithmetic, 7 unsubscribes from 2,000 delivered messages is an unsubscribe rate of 0.35%.

The rate is usually reported per send or per campaign. An unsubscribe does not depend on a tracking pixel, so image blocking and Apple's Mail Privacy Protection, which distort open rates, leave it untouched.

## Why unsubscribe rate matters

**An unsubscribe is a recipient using the proper way out.** It removes someone who no longer wants the mail without the reputation cost of a [spam complaint](/glossary/spam-complaint/), and the list that remains is more engaged for it. A small, steady number of unsubscribes is a normal part of mailing any list.

A rate well above the sender's usual level on a single send points at that send, usually content that did not match what subscribers expected or recipients who were added without clear consent. Comparing each campaign with the sender's own history reveals that kind of outlier, which a single absolute figure cannot.

Unsubscribes and complaints are linked. **Recipients who cannot find a quick way out press the spam button instead**, and a complaint weighs far more in [sender reputation](/glossary/sender-reputation/) than an unsubscribe does. Google requires bulk senders to keep their complaint rate below 0.3% and recommends staying below 0.1%. A low unsubscribe rate paired with a rising complaint rate usually means the unsubscribe option is hard to find.

## Best practices for unsubscribe rate

**Make leaving as easy as complaining.** [One-click unsubscribe](/glossary/one-click-unsubscribe/) puts an unsubscribe control next to the sender's name in supporting clients, and Google and Yahoo have required it from bulk senders of marketing mail since February 2024. A visible link in the body covers every other client. Hiding the link or putting it behind a login lowers the unsubscribe rate only by moving those recipients to the spam button.

A [preference center](/glossary/preference-center/) gives recipients options short of leaving entirely, such as dropping one topic or receiving less mail. Opt-outs also belong in the application's own database, so that a later import or CRM sync does not add unsubscribed people back, since mailing someone who opted out invites the complaint the unsubscribe was meant to prevent.

## Unsubscribe rate in Lettr

**Lettr counts both unsubscribe methods.** The Analytics dashboard has an Unsubscribes metric for recipients who opted out via List-Unsubscribe or an unsubscribe link. Each campaign's Show page has an Unsubscribes tile and an unsubscribe summary, and the Analytics & Reporting docs define unsubscribe rate as unsubscribes divided by deliveries. In Marketing mode, the delivery metrics on the main Dashboard include click and unsubscribe rates.

Webhooks report the two methods as separate events: `unsubscribe.list_unsubscribe` for the List-Unsubscribe header and `unsubscribe.link_unsubscribe` for a link in the email body. Both add the address to the [suppression list](/glossary/suppression-list/) automatically. When a recipient unsubscribes from a campaign, the contact's status changes to `unsubscribed` and the contact is excluded from all future campaigns.

API sends default to `transactional: true`, which bypasses unsubscribe suppression, so marketing-shaped API sends set `transactional: false` for suppressions to be honoured. The [Complaints and Unsubscribes](https://docs.lettr.com/learn/suppressions/complaints-unsubscribes) page covers the unsubscribe webhook payloads.
