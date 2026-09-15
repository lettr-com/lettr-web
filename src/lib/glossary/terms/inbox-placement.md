---
term: Inbox Placement
heading: "What is inbox placement?"
description: "Inbox placement is where a delivered email lands: the inbox, a tab or the spam folder. Why it differs from delivery rate, how it is measured, and Lettr."
published: 2026-09-14
updated: 2026-09-15
related: [delivery, seed-list, sender-reputation, promotions-tab, deliverability]
reading:
  - title: Emails Landing in Spam
    href: https://docs.lettr.com/knowledge-base/troubleshooting/spam-placement
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
---

**Inbox placement** is where an email lands after the receiving server accepts it: the primary inbox, a secondary tab or folder such as Promotions, or the spam folder. It is the last step of [deliverability](/glossary/deliverability/) and the one senders see least directly. A message can be delivered successfully in the SMTP sense and still go unseen, because the mailbox provider filtered it into spam.

## How inbox placement is decided

Placement is decided inside the mailbox provider after the SMTP transaction ends. **Filters weigh several signals together**: authentication results for SPF, DKIM and DMARC, the reputation of the sending domain and IP address, the recipient's history with the sender, and the content of the message.

Engagement makes placement personal. Providers such as Gmail adjust placement per recipient, so the same campaign can reach the inbox for readers who regularly open the sender's mail and the spam folder for readers who ignore it. A recipient who moves a message out of spam, or from one tab to another, tells the filter where that sender's mail belongs for them.

Tabs are a separate layer from spam filtering. Gmail's [Promotions tab](/glossary/promotions-tab/) and Outlook's Focused Inbox sort legitimate mail by type, so a marketing email in Promotions has reached the inbox in every technical sense but gets less attention than one in the primary view.

## Inbox placement vs delivery rate

**[Delivery](/glossary/delivery/) means the receiving server accepted the message**, and delivery rate is the share of sent mail accepted that way. The server confirms acceptance with a `250` reply at the end of the SMTP transaction, and that reply says nothing about the folder the message is later sorted into.

That gap makes delivery rate an incomplete measure. A delivery rate close to 100% is compatible with a large share of mail sitting in spam at one provider, and spam placement generates no bounce and no error. The signal appears only indirectly: open rates falling at one provider, clicks disappearing, or complaints rising.

## How inbox placement is measured

Mailbox providers do not report placement to senders, so senders estimate it. **A [seed list](/glossary/seed-list/) is the direct method**: test addresses at Gmail, Outlook, Yahoo and other providers receive each send, and a tool checks which folder the message reached at each one. Panel data from real users' mailboxes is a second source, and provider dashboards such as Google Postmaster Tools add aggregate spam rates for one provider's traffic.

Each method has limits. Seed accounts have no engagement history, so filters can treat them differently from real subscribers, and panel data covers only the users who share it. Engagement broken down by mailbox provider remains the most practical everyday check, because a placement problem at one provider shows up as a drop in opens and clicks there.

## Common problems with inbox placement

**Most placement problems trace back to [sender reputation](/glossary/sender-reputation/) or authentication.** Missing or failing DMARC, sudden volume increases from a new domain, high complaint rates and lists full of inactive addresses all push mail toward spam. Content still counts as well, and misleading subject lines, URL shorteners and image-heavy messages with little text are common triggers.

Transactional mail suffers when it shares a domain with marketing mail. A reputation problem caused by campaigns can move password resets and receipts into spam, which is why senders put the two kinds of mail on separate subdomains.

## Inbox placement in Lettr

**A delivery event in Lettr confirms acceptance, not inbox placement.** The `message.delivery` webhook event fires when the recipient's mail server accepted the email, and the docs note that it does not guarantee the email reached the inbox, since the provider could filter it to spam or quarantine it. The green delivery badge in the Events dashboard carries the same caveat.

Lettr offers no single reputation score, and the docs recommend monitoring the individual signals through the dashboard and webhook data instead. For mail landing in spam, the troubleshooting guide works through authentication, domain reputation and content, then the sending patterns in Analytics: sudden increases in volume, a bounce rate that should stay below 2% and a complaint rate below the 0.3% Google requires.

Breaking Analytics down by Mailbox Provider groups every metric by the recipient's email provider. The docs describe a sharp decline in open rates at a specific provider as a usual sign that mail is being routed to spam, and suggest a send to a seed account at that provider to confirm placement. Emails sent with open tracking disabled do not count toward the open metrics. The [Emails Landing in Spam](https://docs.lettr.com/knowledge-base/troubleshooting/spam-placement) guide covers the full diagnostic flow.
