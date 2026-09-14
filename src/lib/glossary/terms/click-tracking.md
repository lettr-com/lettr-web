---
term: Click Tracking
question: What is
description: "Click tracking records link clicks by routing each link through a redirect server. How it works, why it beats open tracking, and how Lettr tracks clicks."
related: [open-tracking, tracking-domain, tracking-pixel, mail-privacy-protection, email-engagement]
reading:
  - title: Tracking Accuracy
    href: https://docs.lettr.com/knowledge-base/troubleshooting/tracking-accuracy
  - title: Tracking in Lettr
    href: https://docs.lettr.com/learn/sending/tracking
  - title: Tracking Domains
    href: https://docs.lettr.com/learn/domains/tracking-domains
---

**Click tracking** is a technique that detects when a recipient clicks a link in an email. The sending platform rewrites each link to pass through a tracking server, which records the click and then redirects the recipient to the original destination. It gives more reliable engagement data than [open tracking](/glossary/open-tracking/), because a click requires deliberate action and is not affected by image blocking or privacy proxies.

## How click tracking works

**Links are rewritten when the message is prepared for sending.** An original link such as `https://example.com/product` is replaced with a unique URL on the tracking domain, for example `https://links.example.com/c/abc123`. The unique part identifies the message, the recipient and the destination, so the tracking server knows what to record and where to send the visitor.

A click sends the recipient's browser to the tracking server first. The server logs the click with a timestamp and the link URL, then answers with an immediate redirect to the original address. For the recipient the extra hop is invisible, apart from the tracking URL that shows up when hovering over a link.

The domain in those URLs is either the platform's shared default or a [tracking domain](/glossary/tracking-domain/) owned by the sender, usually a subdomain pointed at the platform with a DNS record. Individual links can be excluded from rewriting, which suits links where a redirect is unwanted.

## Click tracking vs open tracking

Open tracking depends on a [tracking pixel](/glossary/tracking-pixel/), a tiny image that records an open only when the email client loads it. **Several client behaviours distort that signal.** Apple [Mail Privacy Protection](/glossary/mail-privacy-protection/) pre-fetches images whether or not the recipient reads the message, which inflates opens. Clients that block images by default, notably Outlook, never load the pixel, and plain text emails cannot carry one at all.

A click survives all of these, because it happens only when a person or program follows the link. That makes click rate the better primary engagement signal, with unique clicks and click-to-open rate as steadier variants. Conversions measured on the destination site remain the most reliable measure of intent, since only a real visitor can complete them.

## Common problems with click tracking

**Security scanners are the largest source of false clicks.** Corporate email gateways such as Barracuda, Mimecast and Proofpoint often follow every link in a message to check it for malicious content, which registers clicks the recipient never made. B2B senders see the effect most. Scanner clicks tend to arrive within seconds of delivery, hit every link in the message, carry identifiable user agents and produce no activity on the destination site.

Link prefetching by some email clients and browsers creates the same kind of noise on a smaller scale. Filtering these patterns out before analysis keeps engagement data honest, especially when unengaged recipients are removed based on clicks.

The tracking domain itself carries reputation. Links rewritten through a shared default domain are associated with every sender using it, while a custom domain builds reputation under the sender's own brand. Some messages should not be tracked at all, such as password resets, data exports and security notifications.

## Click tracking in Lettr

**Lettr records clicks by rewriting the links in an email.** A send request can turn click tracking off per email with `options.click_tracking: false`, and a single link can opt out with the `data-msys-clicktrack="0"` attribute. Rewritten links route through Lettr's tracking servers, which record the click with its timestamp and URL and redirect the recipient immediately.

Each click fires an `engagement.click` webhook event, and the Events dashboard shows it as an indigo clicked badge along with the URL that was clicked. Unsubscribe links marked with `data-msys-unsubscribe="1"` depend on click tracking: without it, Lettr cannot detect the click and no unsubscribe event is generated.

A custom tracking domain is added under **Domains → Tracking** and needs a CNAME record pointing the chosen subdomain to `proxy.lettr-tracking.com`. With Cloudflare DNS, that record must be set to DNS only. Once verified, the tracking domain is linked to a sending domain, and only emails sent after that use it. The [Tracking Domains](https://docs.lettr.com/learn/domains/tracking-domains) page in the Lettr docs covers the setup and SSL status.
