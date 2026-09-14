---
term: Initial Open
question: What is
description: "An initial open is the first recorded open of an email by a recipient, counted apart from repeat opens. How it is tracked and Lettr's initial_open event."
related: [open-tracking, tracking-pixel, mail-privacy-protection, email-engagement, click-tracking]
reading:
  - title: Event Types in the Events dashboard
    href: https://docs.lettr.com/learn/events/event-types
  - title: Open and Click Tracking Accuracy
    href: https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy
  - title: Webhook Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
---

**An initial open** is the first time an open of a particular email is recorded for a recipient. Every later open of the same message by the same recipient counts as a repeat open. Separating the two turns a raw count of image loads into a count of people, which is what unique open rates are built on.

## How initial opens are tracked

[Open tracking](/glossary/open-tracking/) adds a [tracking pixel](/glossary/tracking-pixel/), a tiny invisible image with an address unique to the message and recipient, to the HTML part of an email. **When the mail client loads that image, the tracking server records an open.** The first load for a given message and recipient becomes the initial open, and each load after it becomes a repeat open.

A single message can load the pixel many times. Scrolling back to it, reopening it later or reading it on a second device all produce new requests. Forwarded messages carry the same pixel, so opens by the people an email was forwarded to are attributed to the original recipient.

Some opens are never recorded. Plain text email cannot carry a pixel, and clients that block images by default never request it, so readers in those clients produce no initial open at all.

## Initial opens vs total opens

**Total opens count every pixel load, while initial opens count recipients.** A newsletter opened five times by one subscriber adds five to total opens and one to initial opens. Unique open rate, the number of recipients who opened divided by the number of delivered messages, rests on initial opens and is what most people mean by open rate.

Total opens still carry some information. A high ratio of total to unique opens on one message suggests reference content that recipients return to, or a message passed around within a team. As a headline engagement figure, though, the total gives too much weight to a handful of readers who open the same email repeatedly.

## Common problems with initial open data

**Automated image loading creates opens nobody made.** [Mail Privacy Protection](/glossary/mail-privacy-protection/) in Apple Mail pre-fetches images regardless of whether the recipient reads the message, so the initial open often marks the moment Apple's proxy fetched the pixel instead of a person viewing the email. Preview panes and corporate security gateways that fetch images for scanning inflate opens the same way.

A prefetched initial open also hides the real one. When a proxy loads the pixel first, a genuine read later shows up as a repeat open, if it is recorded at all. First-open timestamps then describe mail infrastructure more than reader behaviour, which weakens any send-time analysis built on them.

The practical response is to read opens as a trend and give more weight to clicks, which require a deliberate action. Decisions based on [engagement](/glossary/email-engagement/), such as removing inactive subscribers, hold up better when they combine opens with clicks and other activity.

## Initial open in Lettr

**Lettr fires the `engagement.initial_open` webhook event on the first open of an email by a recipient**, and subsequent opens of the same email generate `engagement.open` events instead. AMP emails have the matching `engagement.amp_initial_open` event. In the Events dashboard both kinds are displayed as **Opened**, although Lettr tracks the initial open and later opens as separate events.

For open events, the Message Details view shows a **Prefetched** field, which indicates whether a mail client prefetching images triggered the open, and a **Pixel** field, which shows whether the tracking pixel was placed at the top or bottom of the email. Open tracking requires HTML content, and a request can switch it off for one email by setting `open_tracking` to `false` in its `options` object, which suits privacy-sensitive messages.

The Analytics dashboard reports Unique Opens, the number of unique recipients who opened an email at least once, and emails sent with tracking disabled do not contribute to it. Campaign reports list both Opens and Unique opens, and recommend unique opens for the open rate. Through Lettr's MCP server, the `browse_email_events` tool accepts `initial_open` as an event type filter. The [Tracking Accuracy](https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy) guide explains why Apple Mail Privacy Protection makes open rates for Apple Mail users unreliable.
