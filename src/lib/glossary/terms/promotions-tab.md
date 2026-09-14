---
term: Promotions Tab
question: What is
description: "The Promotions tab is where Gmail files email it classifies as promotional. How tab placement works, why it differs from spam, and what Lettr can show."
related:
  [
    inbox-placement,
    marketing-email,
    transactional-email,
    google-postmaster-tools,
    list-unsubscribe-header,
  ]
reading:
  - title: Gmail-Specific Delivery Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/gmail-delivery
  - title: Transactional vs Marketing Email
    href: https://docs.lettr.com/knowledge-base/best-practices/transactional-vs-marketing
  - title: Filtering and Breakdowns
    href: https://docs.lettr.com/learn/analytics/filtering-and-breakdowns
---

**The Promotions tab** is one of the inbox tabs Gmail uses to sort incoming mail, and it holds messages Gmail classifies as marketing or promotional. Gmail's tabs are Primary, Promotions, Social, Updates and Forums. A message in Promotions has been delivered to the inbox, not to spam, but it sits outside the Primary view recipients check first, so it gets less attention.

## How Promotions tab placement works

**Gmail assigns a tab with a machine learning classifier**, not a fixed rule. The signals include the sender's relationship with the recipient, the style of the content, the presence of an unsubscribe header, the recipient's engagement history and the number of links and images. Bulk, HTML-heavy messages with images, calls to action and an unsubscribe header lean toward Promotions, while plain, conversational mail from someone the recipient corresponds with leans toward Primary.

Placement is also learned per user. When a recipient drags a message from Promotions to Primary, Gmail places later messages from that sender in Primary for that recipient, so two subscribers to the same newsletter can see it in different tabs.

The tabs belong to the Gmail interface and apply only where they are turned on. Recipients who disable tabs, or read the account in another mail client, see all non-spam mail in one inbox. Outlook's [Focused Inbox](/glossary/focused-inbox/) splits mail into Focused and Other along similar lines.

## Promotions tab vs spam folder

**Promotions placement is a successful delivery**, while the spam folder means Gmail judged the message unwanted or risky. [Inbox placement](/glossary/inbox-placement/) counts a message in Promotions as reaching the inbox. A move into spam calls for work on authentication, reputation or complaints, while Promotions is the expected place for a newsletter or any other [marketing email](/glossary/marketing-email/).

The tab matters most for mail that is not marketing. A [transactional email](/glossary/transactional-email/) such as a receipt, an alert or a password reset is expected in Primary, and a transactional template decorated with banners, upsells and social links can pull it into Promotions, where the recipient may not look.

## Common problems with Promotions tab placement

**Stripping unsubscribe headers from marketing email to escape Promotions backfires.** The header is one of the classifier's signals, but Google and Yahoo require one-click unsubscribe from bulk senders of marketing mail, so removing the [List-Unsubscribe header](/glossary/list-unsubscribe-header/) breaks those requirements and damages reputation.

For transactional mail that lands in Promotions, the fixes are structural. Simpler HTML with fewer images, no promotional banners or upsells, and a plain From name such as "Jane from Acme" all push messages toward Primary. Sending transactional email from a separate subdomain, such as `notify.example.com`, keeps its reputation apart from marketing sends as well.

Tab placement also has no reliable measurement from the sender's side. Open rates by mailbox provider hint at a change, but opens are distorted by image blocking and privacy features, so a drop in Gmail opens is a prompt to investigate, not proof of a tab move.

## Promotions tab in Lettr

**A delivery event in Lettr means the recipient's mail server accepted the email.** It does not guarantee the email reached the inbox, since the provider can still filter it to spam, and Gmail decides the tab after that acceptance.

The Analytics dashboard can filter by Mailbox Provider and break metrics down by Mailbox Provider, which isolates Gmail recipients when comparing opens, clicks or bounces between sends. The Message Details view shows the Mailbox Provider for each individual message.

Campaigns sent from the campaign builder carry the `List-Unsubscribe` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers. The Lettr docs note that separating transactional and marketing email on different sending domains or subdomains is a common practice to protect transactional sender reputation. The [Gmail-Specific Delivery Issues](https://docs.lettr.com/knowledge-base/troubleshooting/gmail-delivery) guide covers tab placement signals and setting up Google Postmaster Tools.
