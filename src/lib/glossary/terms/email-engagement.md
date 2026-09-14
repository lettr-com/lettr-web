---
term: Engagement
question: What is
description: "Email engagement is how recipients interact with messages: opens, clicks, replies and spam reports. How providers use it and how Lettr tracks opens and clicks."
related: [open-tracking, click-tracking, mail-privacy-protection, inbox-placement, sunset-policy]
reading:
  - title: Open and Click Tracking Accuracy
    href: https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy
  - title: Tracking
    href: https://docs.lettr.com/learn/sending/tracking
  - title: What Is Email Deliverability?
    href: https://docs.lettr.com/knowledge-base/concepts/email-deliverability
---

**Engagement** is the way recipients interact with the email they receive: opening it, clicking its links, replying, forwarding, moving it out of the spam folder or reporting it as spam. Senders measure part of it to judge how their messages perform. Mailbox providers measure more of it and use the result to decide where future mail from the same sender lands.

## How engagement is measured

Two parties see engagement, and they see different things. **Mailbox providers observe behaviour inside the inbox**: whether a message was opened and read, how long it stayed on screen, whether the recipient replied, rescued it from spam, deleted it unread or pressed the spam button. None of that is reported to the sender directly, apart from complaints that flow back through feedback loops.

Senders rely on instrumentation added to the message. [Open tracking](/glossary/open-tracking/) embeds a tiny invisible image, and an open is recorded when the client loads it. [Click tracking](/glossary/click-tracking/) rewrites each link to pass through a tracking server, which records the click and redirects the recipient to the original URL. Both work only for HTML email, and open tracking needs the client to load images.

From those events come the familiar metrics: unique opens, total and unique clicks, click-to-open rate, and unsubscribe and complaint rates as the negative signals.

## Why engagement matters

**Engagement history is one of the inputs providers use to place each message.** Gmail in particular weighs it heavily. Recipients who open and interact with a sender's mail teach the provider to trust that sender, while recipients who ignore or delete it teach the provider to deprioritize it. Marking a message as spam is the strongest negative signal of all.

The judgement is made per sender and per recipient. A recipient who never engages sees that sender's mail filtered more over time, even when other recipients engage well, and a large block of inactive addresses pulls down the sender's aggregate standing too. That is why a [sunset policy](/glossary/sunset-policy/) removes or re-engages subscribers who have not opened or clicked in 6 to 12 months, and why warm-up plans start with the most engaged recipients.

Engagement ties closely to [inbox placement](/glossary/inbox-placement/). Authentication and reputation decide whether mail is accepted, and engagement shapes whether it reaches the inbox, the spam folder or a secondary tab.

## Common problems with engagement data

**Open rates are the least reliable engagement number.** [Mail Privacy Protection](/glossary/mail-privacy-protection/) in Apple Mail on iOS 15 and later, iPadOS 15 and later and macOS Monterey and later pre-fetches every image, so a message counts as opened whether or not the recipient read it. Preview panes and corporate proxies inflate opens in the same way, while clients that block images by default and plain text messages record no open at all.

Clicks are more dependable because they require an action, but they are not clean either. Corporate security gateways often follow every link in a message to scan for malware, and some clients prefetch links. Bot clicks tend to arrive within seconds of delivery, hit every link in the message and lead to no activity on the destination site.

The practical response is to weight the signals by reliability. Unique clicks, conversions on the destination site, unsubscribes and complaints are harder to distort than raw opens, and opens are best read as a trend rather than an exact count.

## Engagement in Lettr

**Lettr tracks opens and clicks for all emails by default**, as long as the message has HTML content. Opens are recorded through an invisible tracking pixel, and clicks through links rewritten to pass through Lettr's tracking servers or through a custom tracking domain when one is set up in the domain settings. Either can be turned off per email with `open_tracking: false` or `click_tracking: false` in the request's `options` object, which suits privacy-sensitive messages such as data exports.

Engagement reaches webhook endpoints as `engagement.open`, `engagement.initial_open` for the first open of an email by a recipient, and `engagement.click`. In the Events dashboard, first and later opens both show as **Opened** and clicks as **Clicked**. The Message Details view adds the user agent and a **Prefetched** field that marks opens triggered by a mail client prefetching images.

The Analytics dashboard reports Unique Opens, Clicked and Unique Clicked next to Unsubscribes and Spam Complaints. Emails sent with tracking disabled do not contribute to those metrics, and test emails are excluded from analytics entirely. The [Tracking page](https://docs.lettr.com/learn/sending/tracking) covers the options and webhook payloads.
