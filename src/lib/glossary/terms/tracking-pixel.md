---
term: Tracking Pixel
question: What is
description: "A tracking pixel is a tiny invisible image in an HTML email whose loading signals an open. How it is placed, what blocks it, and what Lettr records."
related: [open-tracking, mail-privacy-protection, initial-open, email-clipping, click-tracking]
reading:
  - title: Open & Click Tracking Accuracy
    href: https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy
  - title: Tracking
    href: https://docs.lettr.com/learn/sending/tracking
  - title: Message Details
    href: https://docs.lettr.com/learn/events/message-details
---

**A tracking pixel** is a tiny, invisible image embedded in the HTML of an email so that the sender can tell when the message is displayed. Its address is unique to the message and recipient, and the request a mail client makes to load it is recorded on the sender's tracking server. Tracking pixels are the mechanism behind [open tracking](/glossary/open-tracking/), and web pages use the same technique under the name web beacon.

## How a tracking pixel works

The pixel is an ordinary `<img>` element, typically 1x1 pixel in size and transparent, so it takes up no visible space. **Its image URL does the work**: the URL points at the tracking server and carries an identifier for the message and recipient, so a request for it tells the server exactly which email was loaded. The server logs the request with its time, IP address and user agent, then returns the image.

Nothing in the email runs code. The pixel depends entirely on the mail client fetching remote images, so a message displayed without images produces no request, and a message whose images are fetched by something other than the reader produces one anyway. Plain text email has no way to carry an image, which limits the technique to the HTML part of a message.

## How pixel placement affects opens

A pixel can sit near the top of the HTML, just after the opening `<body>` tag, or at the bottom, just before the closing one. **Placement decides which failures the pixel is exposed to.** A pixel at the bottom is only requested once the client renders that far, and a client that stops part way never loads it. The common case is [email clipping](/glossary/email-clipping/): Gmail hides the part of a message beyond its size threshold, and a pixel in the hidden part does not load until the recipient opens the full message.

A pixel at the top loads as soon as rendering starts, which avoids the clipping problem. It also records a load when the recipient glances at the message and moves on, so neither position turns a pixel request into proof of reading.

## Common problems with tracking pixels

- **Image blocking:** clients that hold back remote images until the reader allows them never request the pixel, so real reads go unrecorded.
- **Proxies and prefetching:** Apple [Mail Privacy Protection](/glossary/mail-privacy-protection/) loads images through proxy servers whether or not the message is read, and Gmail fetches images through its own image proxy, which hides the reader's IP address and device.
- **Security scanners:** corporate gateways that inspect inbound mail can load images while scanning, before any person sees the message.
- **Repeat loads:** reopening a message, scrolling back to it or reading it on a second device requests the pixel again, which is why platforms separate the [initial open](/glossary/initial-open/) from later ones.

## Why tracking pixels raise privacy concerns

**A pixel reports activity the recipient cannot see**: roughly when a message was displayed and, without a proxy in the way, an IP address that reveals an approximate location. Some data protection authorities treat email tracking pixels like cookies, which can bring consent requirements, and mail clients have added image proxies and image blocking partly in response.

[Click tracking](/glossary/click-tracking/) records a deliberate action and avoids most of these distortions, while emails such as password resets and security notices gain little from pixel data. Those messages are common candidates for sending with open tracking turned off.

## Tracking pixel in Lettr

**Lettr inserts a tiny invisible image into HTML emails** and records an open when the recipient's email client loads images. Open tracking requires HTML content, plain text emails cannot be tracked for opens, and the docs note that clients which block images may cause under-reported open rates. A request can leave open tracking out of a single email with `options.open_tracking: false`, which the docs suggest for privacy-sensitive emails such as password resets or data exports.

With a custom tracking domain, the pixel is served from that domain on an `/o/` path, as an image with a width and height of 1, for example `https://links.example.com/o/xyz789`.

For every open event, the Message Details view shows a **Prefetched** field, which indicates whether the open was triggered by a mail client prefetching images rather than the recipient actively viewing the email, and a **Pixel** field, which shows whether the tracking pixel was placed at the top or bottom of the email.

The first open of an email by a recipient fires the `engagement.initial_open` webhook event and later opens fire `engagement.open`, and engagement events require tracking to be enabled. The [Open & Click Tracking Accuracy](https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy) guide lists the factors that inflate and deflate open counts.
