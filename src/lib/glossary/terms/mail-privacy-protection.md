---
term: Mail Privacy Protection
fullName: MPP
question: What is
description: "Mail Privacy Protection is Apple Mail's feature that pre-fetches remote images, tracking pixels included, and inflates opens. How it affects tracking in Lettr."
related: [open-tracking, tracking-pixel, click-tracking, email-engagement, initial-open]
reading:
  - title: Open & Click Tracking Accuracy
    href: https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy
  - title: Email Rendering Across Clients
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-rendering-clients
  - title: Message Details
    href: https://docs.lettr.com/learn/events/message-details
---

**Mail Privacy Protection (MPP)** is a privacy feature in Apple Mail that loads a message's remote content through Apple's proxy servers instead of from the recipient's device. Apple downloads the images in each message in the background, tracking pixels included, typically around the time the message is delivered and whether or not the recipient ever reads it. Senders therefore record an open for nearly every message sent to an MPP user, which makes open data meaningless for that part of the audience.

## How Mail Privacy Protection works

Apple introduced MPP in 2021 with iOS 15, iPadOS 15 and macOS Monterey. **It works at the level of the Apple Mail app**, so it covers every account read in Apple Mail, a Gmail or Outlook.com account included, and does not apply when the same account is read in another client. Users choose whether to turn it on when Apple Mail first asks.

With the feature on, two things change for senders. Remote content is fetched through proxy servers that hide the recipient's IP address, so location data derived from the request reflects the proxy's region instead of the person. The content is also pre-fetched: Apple loads the images on its own schedule, so the request for a [tracking pixel](/glossary/tracking-pixel/) says nothing about whether, or when, anyone looked at the message.

MPP does not block anything. The email renders normally and links work as usual, so clicks still come from the recipient.

## Why Mail Privacy Protection matters

**[Open tracking](/glossary/open-tracking/) depends on a pixel request meaning a person opened the email**, and MPP breaks that link. Open rates rise for any audience with many Apple Mail users, and the time, device and location attached to those opens stop describing real behavior.

Anything built on opens inherits the error. A subject line test that picks a winner by open rate may be measuring Apple's proxy. A resend to non-openers skips people who never saw the first email. An inactivity rule that removes subscribers with no opens keeps MPP users on the list indefinitely, because their mail always registers as opened.

MPP is the largest distortion but not the only one. Clients that block images by default undercount opens, plain text emails cannot record them at all, and preview panes and corporate security gateways can trigger the pixel without anyone reading. Open data was always an approximation, and MPP makes the gap large enough to change decisions.

## Best practices under Mail Privacy Protection

**Treat clicks as the primary engagement signal.** [Click tracking](/glossary/click-tracking/) records a deliberate action, although security scanners that pre-click every link can inflate it too, usually with very fast clicks on all links at once.

Measure outcomes beyond the email where possible, such as site visits, logins, purchases or replies. For list maintenance, define inactivity by clicks and those downstream actions rather than by opens alone. When opens are still reported, compare them as a trend within the same audience over time, not as an absolute number or against another sender's benchmark. Tests that pick a winning variant are more reliable when scored on clicks or conversions.

## Mail Privacy Protection in Lettr

**Open tracking in Lettr requires HTML content**, and open and click tracking can each be switched off per email with `open_tracking: false` or `click_tracking: false` in the request's `options` object. The docs' tracking accuracy guide lists Apple Mail Privacy Protection as a factor that inflates opens and notes that it affects Apple Mail users on iOS 15+, macOS Monterey+ and iPadOS 15+.

For each open event, the Message Details page shows a **Prefetched** field, which indicates whether the open was triggered by a mail client prefetching images rather than the recipient actively viewing the email. A **Pixel** field shows whether the tracking pixel was placed at the top or bottom of the message.

Webhooks report the first open of an email by a recipient as an [initial open](/glossary/initial-open/), the `engagement.initial_open` event, and subsequent opens as `engagement.open`. The docs describe click data, delivered as `engagement.click`, as generally more reliable than open data because a click requires deliberate action. Emails sent with tracking disabled do not contribute to the corresponding metrics on the Analytics dashboard. The [Open & Click Tracking Accuracy](https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy) guide covers identifying bot clicks.
