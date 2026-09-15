---
term: Seed List
heading: "What is a seed list?"
description: "A seed list is a set of test mailboxes at major providers used to check where an email lands. What seed testing shows, its limits, and what Lettr offers."
published: 2026-09-14
updated: 2026-09-14
related: [inbox-placement, mailbox-provider, deliverability, spam-score]
reading:
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
  - title: Test Emails
    href: https://docs.lettr.com/learn/sending/test-emails
---

**A seed list** is a set of email addresses, owned by the sender or a testing service, spread across major mailbox providers such as Gmail, Outlook and Yahoo. A copy of an email goes to the seeds along with the real send, and each seed mailbox is then checked to see whether the message reached the inbox, a tab or the spam folder. The result is an estimate of [inbox placement](/glossary/inbox-placement/), which delivery data alone cannot show.

## How seed testing works

A delivery event only confirms that the receiving server accepted a message. **Placement is decided after acceptance**, inside the [mailbox provider](/glossary/mailbox-provider/), so the only direct way to observe it is to own a mailbox there and look. A seed list does that at scale, with mailboxes across consumer providers, business mail systems and regional providers.

Testing services automate the checking. They supply the seed addresses, receive the message, inspect each mailbox and report the folder it landed in, usually with the authentication results and headers each provider recorded. A manual version works too: a few accounts at the providers that matter most, checked by hand after a send.

Seeds are most useful as a comparison. The same message sent to the seeds before and after a change, such as a new sending domain, new content or a DNS fix, shows whether that change moved placement.

## Limits of seed lists

**Seed mailboxes have no engagement history.** Gmail and other large providers weigh how each recipient treats a sender, including opens, replies, deletions and spam reports, and a seed account that never interacts with mail is a poor stand-in for a subscriber who reads every issue. Placement at a seed can differ from placement for engaged recipients in either direction.

Other factors skew the results as well:

- **Sample size:** a handful of seeds per provider gives a coarse picture, and a single seed in spam may be noise.
- **Recognisable seeds:** providers can identify addresses that belong to testing services and treat them unlike ordinary users.
- **Business filters:** a corporate gateway applies policies set by its own administrators, which a consumer seed at the same provider does not reflect.
- **Tabs:** a message in Gmail's Promotions tab counts as an inbox delivery for some tools and as a problem for others.

Seed results are therefore one input into [deliverability](/glossary/deliverability/) diagnosis, read alongside complaint rates, bounce data and provider dashboards such as Google Postmaster Tools.

## Best practices for seed testing

**Send the real message, not a stripped-down copy.** Subject line, content, links, sending domain and sending infrastructure should match the production send, otherwise the test measures a different email.

Spread the seeds over the providers that dominate the actual list, and weight them accordingly. A B2B sender learns more from seeds behind Microsoft 365 and Google Workspace than from consumer webmail accounts. Repeating the same test over several sends shows a trend that a single run cannot, and a placement change that shows up in seeds and in engagement data at the same provider is far more convincing than either signal alone.

## Seed list in Lettr

The Lettr docs use a seed account as a diagnostic step. **When open rates drop sharply at one provider**, such as Gmail or Outlook, the Sending Reputation guide suggests sending to a seed account at that provider to confirm inbox placement.

Test emails are the Lettr tool for sending to such an account. A test email is a real send from a verified domain through the full delivery pipeline to addresses of the sender's choosing, with tracking disabled and analytics excluded, and one request can go to several addresses in different mail clients at once. Sandbox API keys do not reproduce a production send, because they redirect every message to the key creator's inbox and rewrite the sender domain to `dev.uselettr.com`.

To find the provider worth testing, the Analytics page can filter by Mailbox Provider and break metrics down by it. The docs describe the Mailbox Provider and Recipient Domain breakdowns as the way to surface a problem at a specific provider when the overall numbers look healthy. A `message.delivery` webhook event means the recipient's mail server accepted the email, and the docs note that it does not guarantee the email reached the inbox.

Adamko, Lettr's AI assistant, can review a template before a send and flags spam triggers such as image-only bodies and URL shorteners, each with a concrete fix. The [Sending Reputation](https://docs.lettr.com/knowledge-base/best-practices/sending-reputation) guide lists the warning signs that call for a closer look at one provider.
