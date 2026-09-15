---
term: SmartScreen
heading: "What is Microsoft SmartScreen?"
description: "SmartScreen is Microsoft's machine-learning content filter for email. How it judges messages, the patterns that raise risk, and what Lettr senders can check."
published: 2026-09-14
updated: 2026-09-14
related: [exchange-online-protection, focused-inbox, snds, jmrp, content-filtering]
reading:
  - title: Outlook / Microsoft 365 Delivery Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery
  - title: Emails Landing in Spam
    href: https://docs.lettr.com/knowledge-base/troubleshooting/spam-placement
  - title: Templates & Campaigns
    href: https://docs.lettr.com/learn/ai-assistant/content-creation
---

**SmartScreen** is the name Microsoft uses for its machine-learning filter that classifies email as legitimate or spam. It is one layer of the filtering applied to mail for Outlook.com and Microsoft 365, next to connection and authentication checks, user actions such as Junk reports and Safe Senders lists, and policies set by an organisation's administrators. Its job is a verdict on the message itself, where the other layers mostly judge the connection or apply a user's preferences.

## How SmartScreen works

**SmartScreen learns largely from user judgements.** Microsoft has described its models as trained on feedback from users who classify messages as junk or not junk, so the filter tends to reflect how real recipients treat mail with particular characteristics. Each incoming message gets a verdict, and mail judged likely to be spam is typically delivered to the Junk Email folder.

Microsoft does not publish the features or their weights. Like other [content filtering](/glossary/content-filtering/) systems, it is generally understood to look at the text and structure of the message, the links and where they lead, images and attachments, and the reputation of the domains and addresses involved.

The surrounding layers do different jobs. [Exchange Online Protection](/glossary/exchange-online-protection/) handles connection filtering and SPF, DKIM and DMARC checks for Microsoft 365, and a sender on a recipient's Safe Senders list bypasses junk filtering for that recipient. [Focused Inbox](/glossary/focused-inbox/) is separate again: it sorts mail that has already reached the inbox and is not a spam decision.

## Content patterns that raise risk

A few patterns make content filters such as SmartScreen noticeably more suspicious:

- **Images with little text:** a message that is mostly one large image gives the filter little to read and resembles image-based spam.
- **Redirects and shorteners:** links that pass through several redirects or public URL shorteners hide their destination.
- **Hidden text:** white text on a white background is a classic evasion technique.
- **Attachments from unfamiliar senders:** files from senders the recipient has no history with draw closer scrutiny.

None of these guarantees Junk placement, and avoiding them does not guarantee the inbox. Content signals combine with reputation, so a sender with a long record of wanted mail gets more tolerance than a new one.

## Why SmartScreen matters

**A message filtered to Junk was still accepted by the server**, so delivery logs show success and no bounce arrives. The evidence has to come from engagement at Microsoft domains and from Microsoft's sender programs: [SNDS](/glossary/snds/) reports a Green, Yellow or Red filter result for each registered IP address, and [JMRP](/glossary/jmrp/) sends a report whenever a user marks a message as junk.

User feedback feeds back into filtering. Junk reports teach the system that similar mail is unwanted, which is why a campaign with a high complaint rate among Outlook recipients can weigh on later mail from the same sender there.

## SmartScreen in Lettr

The Lettr guide to Outlook and Microsoft 365 delivery describes **SmartScreen as the content-based filtering layer** that uses machine learning, alongside Exchange Online Protection, user signals and organisational policies. It lists content patterns that trigger SmartScreen with a recommendation for each: large images with minimal text (keep at least a 60/40 text-to-image ratio), excessive red or large fonts, multiple URL redirects (link directly to the destination), shortened URLs (use full URLs or a custom tracking domain), hidden text, and attachments from unknown senders.

Adamko, Lettr's AI assistant, can review a template before a big send and flags related spam triggers, including image-only bodies, `http://` links and URL shorteners, each with a concrete fix. A `message.delivery` webhook event confirms that the recipient's mail server accepted the email, and the docs note that it does not guarantee the email reached the inbox.

For feedback from Microsoft, the guide walks through SNDS sign-up with the IP addresses that send the mail, which appear in the `Received` headers, and notes that senders on Lettr's shared IP pool can contact Lettr support for the current ranges. It also covers JMRP enrolment. Analytics can filter by Mailbox Provider and break metrics down by it, which separates Outlook traffic from other providers. The [Outlook / Microsoft 365 Delivery Issues](https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery) guide also covers delisting requests.
