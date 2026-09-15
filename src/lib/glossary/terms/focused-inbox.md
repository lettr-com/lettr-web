---
term: Focused Inbox
heading: "What is Outlook's Focused Inbox?"
description: "Focused Inbox is Outlook's split of the inbox into Focused and Other tabs. How Outlook sorts mail between them, how it differs from Junk and what Lettr reports."
published: 2026-09-14
updated: 2026-09-14
related: [promotions-tab, exchange-online-protection, inbox-placement, email-engagement, graymail]
reading:
  - title: Outlook / Microsoft 365 Delivery Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery
  - title: Event Types
    href: https://docs.lettr.com/learn/events/event-types
  - title: Message Details
    href: https://docs.lettr.com/learn/events/message-details
---

**Focused Inbox** is the Outlook feature that splits the inbox into two tabs: Focused, for the messages Outlook expects the recipient to care about, and Other, for everything else. It is available in Outlook.com and in the Outlook apps used with Microsoft 365. Mail sorted into Other is still delivered to the inbox, not to Junk, but it sits behind a tab the recipient has to open, so it gets noticeably less attention.

## How Focused Inbox works

Sorting happens after a message has passed spam filtering. **Outlook decides placement from the recipient's own behaviour and the message itself**: senders the recipient corresponds with, opens and replies to tend to land in Focused, while newsletters, automated notifications and bulk mail tend to land in Other. The decision is made per recipient, so the same message can sit in Focused for one person and Other for another.

Recipients train the sorting directly. Each message has a Move to Focused or Move to Other option, and choosing to always move a sender's mail sets a rule for that sender from then on. Recipients can also switch Focused Inbox off entirely, which returns the inbox to a single list.

In Microsoft 365 organizations, administrators have extra control. They can turn Focused Inbox on or off for the whole organization or for individual mailboxes, and a mail flow rule can mark messages from chosen senders to bypass the sorting, which companies use to keep internal announcements in Focused.

## Focused Inbox vs Junk and Gmail tabs

**The Other tab is not a spam verdict.** Junk placement comes from Microsoft's filtering in [Exchange Online Protection](/glossary/exchange-online-protection/) and SmartScreen, which judge reputation, authentication and content. Focused Inbox only reorders mail that already passed those checks, so a message in Other has been accepted and treated as legitimate.

Gmail takes a different approach. Its inbox can show several category tabs, including the [Promotions tab](/glossary/promotions-tab/), Social and Updates, and it assigns categories largely by the type of message. Outlook's two-tab model is simpler, and Microsoft's sorting is less aggressive than Gmail's tab placement.

Both models create the same measurement gap. A delivered message counts as delivered whether it lands in Focused or Other, so [inbox placement](/glossary/inbox-placement/) reports and delivery metrics say nothing about which tab it reached.

## Best practices for reaching Focused

**Engagement is the lever that matters most.** Recipients who open, click and reply teach Outlook that a sender belongs in Focused, and recipients who ignore messages teach it the opposite. Sending mail people asked for, at the frequency they expect, does more than any formatting trick. Low-value [graymail](/glossary/graymail/), messages recipients signed up for but rarely read, is exactly the kind of mail Other exists for.

A recognizable sender helps. A consistent From name and address, and a real reply address rather than one that bounces, let recipients identify the sender and respond, and replies are one of the strongest signals of a real relationship. Asking new subscribers in a welcome email to move the first message to Focused, or to add the address to their Safe Senders list, gives Outlook an explicit instruction.

Transactional mail starts with an advantage. A password reset or a receipt the recipient is waiting for gets opened quickly, while promotional content mixed into the same messages weakens that pattern. Testing on real Outlook accounts, including a fresh one with no history, shows where new recipients are likely to see the mail.

## Focused Inbox in Lettr

**A `message.delivery` event means the recipient's mail server accepted the email**, not that it reached the inbox. The same holds for Outlook's tabs: a delivered message may sit in either Focused or Other.

Engagement data is the closest signal Lettr provides. Tracked opens and clicks reach webhooks as `engagement.open` and `engagement.click` events, and appear in the Analytics dashboard as Unique Opens and Unique Clicked, which can be broken down by mailbox provider. The Message Details view for any message shows the recipient's mailbox provider, which separates Outlook recipients from others.

The `from_name` parameter sets the display name shown next to the sender address, and `reply_to` directs replies to a monitored address when the sending address is automated. Temporary deferrals from Microsoft's servers are retried automatically. The [Outlook / Microsoft 365 Delivery Issues](https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery) guide covers Microsoft filtering, SNDS and Safe Senders.
