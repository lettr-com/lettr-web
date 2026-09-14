---
term: Mailbox Provider
question: What is
description: "A mailbox provider runs the inboxes recipients read, such as Gmail, Outlook.com or Yahoo Mail, and decides where incoming mail lands. How providers filter mail."
related: [esp, inbox-placement, feedback-loop, google-postmaster-tools, snds]
reading:
  - title: What Is an Email Service Provider?
    href: https://docs.lettr.com/knowledge-base/concepts/email-service-provider
  - title: Filtering and Breakdowns
    href: https://docs.lettr.com/learn/analytics/filtering-and-breakdowns
  - title: Gmail-Specific Delivery Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/gmail-delivery
---

**A mailbox provider** is the service that operates the inboxes recipients read, such as Gmail, Outlook.com, Yahoo Mail and iCloud Mail. It accepts incoming mail for its users' addresses, filters out spam and decides whether each message lands in the inbox, a spam folder or nowhere. The email industry often calls mailbox providers ISPs, which is imprecise, since a service like Gmail provides no internet connection.

## How mailbox providers handle incoming mail

A domain's MX records point to its provider's mail servers, so **every message addressed to that domain arrives through the provider's filtering pipeline**. The receiving server first checks the connection, then verifies SPF, DKIM and DMARC, then scans the content and weighs the sender's reputation and the recipient's past engagement. Each provider runs its own proprietary filters, which is why the same message can behave differently at Gmail and at Outlook.com.

Acceptance and placement are separate decisions. A server that accepts a message during the SMTP session has only agreed to take responsibility for it, and the provider can still file it in spam or quarantine it afterwards, so a delivered message has not necessarily reached the inbox. [Inbox placement](/glossary/inbox-placement/) is the measure of where accepted mail actually lands, and a message refused outright comes back as a bounce.

Providers also weight signals differently. Microsoft leans more heavily on sending IP reputation than Gmail, which focuses more on domain reputation, and Gmail sorts mail into tabs while Outlook splits it into Focused and Other.

## Mailbox provider vs ESP

**An [ESP](/glossary/esp/) sends mail on behalf of businesses and applications**, handling authentication, reputation and bounce processing on the way out. A mailbox provider sits at the other end, receiving and storing mail for the people who read it. A single message typically passes from one to the other: an application hands it to its ESP, and the ESP delivers it to the recipient's mailbox provider.

The recipient's domain does not always reveal the provider. Mail to `@gmail.com` obviously goes to Google, but a company domain can be hosted on Google Workspace, Microsoft 365 or another service, and only its MX records show which one filters the mail. That matters when diagnosing a problem that appears across many business domains at once.

## Why mailbox providers matter to senders

**Mailbox providers set the rules senders have to meet.** Since February 2024, Google and Yahoo have enforced SPF, DKIM and DMARC authentication, one-click unsubscribe for bulk senders, and a spam complaint rate below 0.3%. Mail that misses those requirements is filtered or blocked, whatever its content.

Providers are also the main source of feedback. Some report individual complaints through a [feedback loop](/glossary/feedback-loop/), as Yahoo does and as Microsoft does through JMRP. Others publish aggregate data instead, such as [Google Postmaster Tools](/glossary/google-postmaster-tools/) for Gmail and [SNDS](/glossary/snds/) for Microsoft's view of sending IPs.

Because filtering is provider-specific, so are most delivery problems. A sender can have healthy results overall while one provider defers or blocks its mail, so troubleshooting starts by splitting delivery, bounce and complaint numbers by provider.

## Mailbox provider in Lettr

**The Message Details page names the recipient's mailbox provider** for each email, in the Recipient section as **Mailbox Provider**, next to **Mailbox Provider Region** and the routing domain. On the Analytics page, both fields are available as filters in the **Configure** modal and as dimensions in the **Break Down By** dropdown. The docs point out that a breakdown by Recipient Domain or Mailbox Provider surfaces a provider that is causing problems even when the overall bounce rate looks healthy.

A `message.delivery` webhook event means the recipient's mail server accepted the message, not that it reached the inbox, because the provider can still filter it to spam or quarantine it. Temporary delays are common with large providers that throttle incoming connections, and Lettr keeps retrying them automatically, reporting each one as a `message.delay` event.

Complaints that providers report through feedback loops arrive as `message.spam_complaint` events, and the address is suppressed automatically. The knowledge base has provider-specific guides, such as [Gmail-Specific Delivery Issues](https://docs.lettr.com/knowledge-base/troubleshooting/gmail-delivery) and a matching guide for Outlook and Microsoft 365.
