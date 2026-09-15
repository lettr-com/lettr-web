---
term: Marketing Email
heading: "What is marketing email?"
description: "Marketing email promotes a product, service or offer and needs consent and an unsubscribe link. How it differs from transactional email and how Lettr sends it."
published: 2026-09-14
updated: 2026-09-14
related:
  [
    transactional-email,
    can-spam-act,
    express-consent,
    list-unsubscribe-header,
    reputation-isolation,
  ]
reading:
  - title: Transactional vs Marketing Email
    href: https://docs.lettr.com/knowledge-base/best-practices/transactional-vs-marketing
  - title: Campaigns
    href: https://docs.lettr.com/learn/campaigns/introduction
  - title: Sending Introduction
    href: https://docs.lettr.com/learn/sending/introduction
---

**Marketing email** is email sent to promote a product, service or offer, such as newsletters, product announcements and sales promotions. The recipient did not trigger it with an action, so it requires consent, a working unsubscribe mechanism and, under laws such as CAN-SPAM, the sender's physical address. Marketing mail is normally kept separate from transactional mail, so that its higher complaint rates do not affect the delivery of password resets and receipts.

## Marketing email vs transactional email

[Transactional email](/glossary/transactional-email/) is triggered by a user action or a system event and carries information the recipient needs, such as a password reset, an order confirmation or an account alert. It usually goes to one or a few recipients at a time. **Marketing email is sent on the sender's schedule** to a list or segment built in advance, and its purpose is to promote.

The content decides the category, not the tool that sends it. A receipt padded with product recommendations or upsells may be classified as commercial and become subject to the rules for marketing email, including unsubscribe requirements. Purely transactional messages are generally exempt from CAN-SPAM's unsubscribe requirement and from the one-click unsubscribe rule that Google and Yahoo apply to bulk senders.

The distinction also shapes reputation. Recipients expect transactional mail and rarely complain about it, while promotional mail draws more complaints and unsubscribes, so the two streams build very different sending histories.

## Rules that apply to marketing email

**Consent requirements depend on the recipient's jurisdiction.** In the EU and UK, marketing email generally needs consent before it is sent, which in practice means [express consent](/glossary/express-consent/) given through a clear opt-in, with a narrow soft opt-in for existing customers buying similar products. Canada's CASL accepts express or implied consent.

The US [CAN-SPAM Act](/glossary/can-spam-act/) follows an opt-out model instead. It does not require prior consent, but every commercial message needs accurate header information, a non-deceptive subject line, the sender's physical postal address and a working unsubscribe mechanism, and opt-out requests have to be honored within 10 business days.

Mailbox providers add requirements of their own. Google and Yahoo expect bulk senders to support one-click unsubscribe through the [List-Unsubscribe header](/glossary/list-unsubscribe-header/), to honor unsubscribes within 2 days and to keep spam complaint rates below 0.3%.

## Best practices for marketing email

**Send marketing and transactional mail from separate streams.** A dedicated subdomain for marketing, such as `news.example.com`, gives each stream its own reputation, so a campaign that draws complaints does not push password resets into spam. The practice is known as [reputation isolation](/glossary/reputation-isolation/).

Set expectations at signup about what kind of email arrives and how often, then keep to them, since unexpected frequency is a common source of complaints. Keep the unsubscribe link visible in the footer, because a recipient who cannot find it uses the spam button instead. Remove subscribers who have stopped engaging, and never mail purchased or scraped lists, which carry high complaint rates and spam traps.

## Marketing email in Lettr

**Lettr sends marketing email as campaigns and as API sends marked as marketing.** A campaign is a one-time bulk send to contacts in the Audience, chosen as all contacts, lists or segments, and only contacts with the status `subscribed` receive it. Every campaign must include the `{{unsubscribe_link}}` merge tag, which opens the hosted preferences page, and Lettr appends a default footer when the campaign HTML does not contain the merge tag. Campaigns sent from the builder also carry the `List-Unsubscribe` and `List-Unsubscribe-Post` headers.

On the API, the `transactional` option defaults to `true` and is set to `false` for marketing email. Leaving the default on a marketing-shaped send bypasses unsubscribe suppression, so a recipient who unsubscribed from marketing email still receives it. The docs describe separating transactional and marketing email on different sending domains or subdomains as a common practice to protect transactional sender reputation.

Billing keeps the two products apart as well. Campaign sends are counted in a separate pool and do not use the transactional email allowance, marketing is priced per contact instead of per email, and every account includes a free tier of 500 contacts. The [Campaigns](https://docs.lettr.com/learn/campaigns/introduction) page covers the campaign lifecycle from draft to sent.
