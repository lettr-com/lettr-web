---
term: ESP
fullName: Email Service Provider
heading: "What is an ESP?"
description: "An ESP is a platform that sends email on a sender's behalf and handles delivery, authentication and bounces. How ESPs work and what Lettr takes care of."
published: 2026-09-14
updated: 2026-09-14
related: [mailbox-provider, transactional-email, marketing-email, feedback-loop, sender-reputation]
reading:
  - title: What Is an Email Service Provider?
    href: https://docs.lettr.com/knowledge-base/concepts/email-service-provider
  - title: Sending Introduction
    href: https://docs.lettr.com/learn/sending/introduction
  - title: Suppressions
    href: https://docs.lettr.com/learn/suppressions/introduction
---

**An ESP (Email Service Provider)** is a platform that sends email on behalf of businesses and applications. Instead of running its own mail servers, a sender hands messages to the ESP through an API or an SMTP relay, and the ESP delivers them and deals with everything around delivery: authentication, reputation, bounce and complaint processing, and the compliance tooling that commercial email needs. Sending email to real users at scale without one is possible but rarely practical.

## How an ESP works

**An application submits a message, and the ESP turns it into a delivered email.** The provider assembles the full message with proper headers, signs it with DKIM, looks up the recipient domain's MX records and hands the message to the receiving server over an encrypted SMTP connection. It then watches what comes back: acceptances, temporary deferrals to retry, bounces to classify, and complaints reported through feedback loops.

Everything the ESP learns is fed back to the sender. Bounced and complaining addresses go onto a suppression list so later sends skip them, and delivery, bounce, open, click, complaint and unsubscribe events reach the sender through dashboards and webhooks.

ESPs are often grouped by the mail they focus on. Some are built for [transactional email](/glossary/transactional-email/), the one-to-one messages an application triggers, such as password resets and receipts, and prioritize API design, delivery speed and per-message events. Others are built for [marketing email](/glossary/marketing-email/) sent to a list, and prioritize audience management, campaign scheduling and aggregate analytics. Many platforms cover both, and the usual advice is to send each stream from its own sending domain.

## ESP vs mailbox provider

The two sit at opposite ends of a delivery. **An ESP sends mail; a [mailbox provider](/glossary/mailbox-provider/) receives and stores it** for the people who read it. Gmail, Outlook.com and Yahoo Mail are mailbox providers, and they decide whether a message from an ESP lands in the inbox or the spam folder, or is rejected outright.

The industry often calls mailbox providers ISPs, even though Gmail is not an internet service provider in any strict sense. The shorthand is common in deliverability writing, so "ISP" in a guide about inbox placement almost always means the receiving mailbox provider rather than a connectivity company.

## Why senders use an ESP

Sending directly from an application server runs into the same problems every time. **A new server has an IP address with no sending history**, and mailbox providers treat unknown IPs with suspicion, filtering or rejecting their mail until reputation is built through weeks of careful volume ramp-up. An ESP sends from IP addresses that already have a history.

Authentication is the second burden. A self-run server needs DKIM keys generated, published and rotated, plus SPF and DMARC records kept correct, and a mistake in any of them sends mail to spam. Processing failures is the third. Bounce replies arrive in many formats and have to be classified as hard or soft, complaints only arrive through [feedback loop](/glossary/feedback-loop/) programs a sender has to be enrolled in, and both have to update a suppression list before the next send.

Company mailboxes are no substitute. Google Workspace and Microsoft 365 are built for person-to-person mail, have strict sending limits and rate-limit application traffic quickly. Using an ESP moves all of this to a provider, but the sender's own [sender reputation](/glossary/sender-reputation/) still depends on list quality, consent and content, which no provider can supply.

## ESP in Lettr

**Lettr accepts email through its REST API and its SMTP relay** and delivers each message to the recipient's mail server over SMTP. The REST API is the recommended route for new integrations, since it gives access to templates, merge tags and event metadata, while the relay suits applications that already speak SMTP. Transactional email goes to the recipients named in each API call, and campaigns go from the dashboard to contacts collected in the Audience.

Lettr handles DKIM key generation and signing automatically, and authentication works once the DNS records Lettr provides are published on the sending domain. Addresses that hard bounce, file a spam complaint or unsubscribe through List-Unsubscribe are added to the suppression list automatically, although API sends left at the default `transactional: true` skip unsubscribe suppression.

Events reach the sender through webhooks covering 22 event types, from `message.injection` and `message.delivery` to bounces, complaints, engagement and inbound relay events. Lettr also receives inbound email on configured inbound domains, parses it and delivers it to the application by webhook. The [email service provider guide](https://docs.lettr.com/knowledge-base/concepts/email-service-provider) in the Lettr docs compares sending through an ESP with running a mail server.
