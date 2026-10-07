---
term: Open Tracking
heading: "What is open tracking?"
description: "Open tracking records when a recipient opens an email by loading an invisible tracking pixel. How it works, why open data is unreliable, and Lettr."
published: 2026-09-14
updated: 2026-09-15
related: [tracking-pixel, click-tracking, mail-privacy-protection, initial-open, unique-open]
reading:
  - title: Open & Click Tracking Accuracy
    href: https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy
  - title: Tracking
    href: https://docs.lettr.com/learn/sending/tracking
  - title: Webhook Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
---

**Open tracking** is a technique that records when a recipient opens an email. The sending platform adds a [tracking pixel](/glossary/tracking-pixel/), an invisible image with an address unique to the message and recipient, to the HTML of each message, and the request a mail client makes to load that image is logged as an open. The result is an approximation, because image blocking, privacy proxies and security scanners all change whether and when the pixel loads.

## How open tracking works

The pixel is added when the message is prepared for sending. **It is usually a 1x1 transparent image** whose URL points at the platform's tracking server and encodes the message and recipient it belongs to. When the recipient views the message and the client loads remote images, the client requests the image, and the tracking server records the open with a timestamp, the requesting IP address and the user agent before returning the image.

The first load for a message and recipient is the [initial open](/glossary/initial-open/), and every later load is a repeat open. Unique open counts, the basis of most open rates, rest on initial opens.

Open tracking only works in HTML email. A plain text message cannot carry an image, so opens of plain text email are never recorded.

## Why open data is unreliable

**Several mail client behaviours break the link between a pixel load and a person reading.** Three of them account for most of the error:

- **Image blocking:** clients that block remote images by default never request the pixel until the recipient allows images, so real reads go unrecorded and opens are undercounted.
- **Privacy prefetching:** Apple's [Mail Privacy Protection](/glossary/mail-privacy-protection/) loads images through proxy servers whether or not the recipient reads the message, which records an open for nearly every message to those users and replaces their location with the proxy's.
- **Security scanners:** corporate gateways that inspect messages can fetch images while scanning, recording opens nobody made.

The errors run in both directions, so the true open rate of a send cannot be recovered from pixel data alone. Trends within one audience over time say more than absolute numbers or comparisons with another sender's benchmark.

## Open tracking vs click tracking

[Click tracking](/glossary/click-tracking/) rewrites links to pass through a tracking server and records each click before redirecting. **A click requires a deliberate action**, and neither image blocking nor privacy prefetching affects it, so click data is the more reliable engagement signal. Scanners that follow every link can still inflate clicks, although those clicks tend to arrive within seconds of delivery and hit every link at once.

Opens still answer a question clicks cannot, such as whether a message with no links was seen at all. Decisions based on [engagement](/glossary/email-engagement/), such as removing inactive subscribers or picking a winning subject line, hold up better when opens are combined with clicks and activity outside the email.

Some messages are better left untracked. Password resets, security notifications and data exports gain nothing from open data and raise privacy concerns.

## Open tracking in Lettr

**Open tracking in Lettr requires HTML content**, and plain text emails cannot be tracked for opens. A request can switch it off for one email with `options.open_tracking: false`, which the docs suggest for privacy-sensitive emails such as password resets and data exports. Engagement webhook events require tracking to be enabled.

The first open of an email by a recipient fires `engagement.initial_open`, and subsequent opens fire `engagement.open`. The docs describe open rates as an approximation rather than an exact count, because some email clients block images by default or prefetch them automatically. In the Events dashboard both kinds appear as a blue opened badge.

For each open event, the Message Details view shows a **Prefetched** field, which indicates whether a mail client prefetching images triggered the open, and a Pixel field, which shows whether the tracking pixel was placed at the top or bottom of the email. User Agent, Geo IP and IP Address appear alongside them.

The Analytics dashboard reports Unique Opens, the number of unique recipients who opened an email at least once, and emails sent with tracking disabled do not contribute to engagement metrics. The [Open & Click Tracking Accuracy](https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy) guide lists the metrics that are harder to distort than opens.
