---
term: AMP for Email
question: What is
description: "AMP for Email adds interactive components such as forms and carousels to a message. How AMP email works, where it renders, and how Lettr sends it."
related: [multipart-message, mime, open-tracking, click-tracking, rendering-engine]
reading:
  - title: Email Content Types
    href: https://docs.lettr.com/knowledge-base/fundamentals/content-types
  - title: Content types in Lettr
    href: https://docs.lettr.com/learn/sending/content-types
---

**AMP for Email** is a format for interactive email built on the AMP component framework. An AMP message carries a restricted HTML document with components such as forms, carousels and accordions that work inside the inbox, so the recipient can act without opening a website. It travels as an extra [MIME](/glossary/mime/) part next to the regular HTML and plain text versions, and clients that do not support AMP display one of those instead.

## How AMP for Email works

**An AMP email adds a `text/x-amp-html` part** to a [multipart message](/glossary/multipart-message/) of type `multipart/alternative`, alongside `text/html` and `text/plain`. A client that supports AMP renders that part, and every other client picks the HTML or text version. Some clients render only the last alternative part, so the AMP part conventionally comes before the HTML part.

The document follows strict rules. It declares itself with the `amp4email` attribute on the `html` tag, loads the AMP runtime script and includes the `amp4email-boilerplate` style. Custom JavaScript is not allowed, and interactivity comes only from approved components such as `amp-form`, `amp-carousel`, `amp-accordion` and `amp-list`. Forms submit through `action-xhr` to an endpoint that returns JSON.

Live content is the main difference from static HTML. The `amp-list` component fetches data when the message is opened, so an order status or a stock count shows the value at open time rather than at send time.

## Why AMP for Email matters

**Actions that normally need a click-through can happen inside the message**: an RSVP, a survey answer, a product carousel or a form submission. The recipient completes them without a page load or a login on another site, and the sender's endpoint receives the result directly.

The trade-off is reach. Gmail and Yahoo Mail are the main clients that render AMP, while Outlook, Apple Mail and Thunderbird do not. AMP makes sense when a large share of recipients read mail in a supporting client, and always as an addition to HTML rather than a replacement for it.

## Common problems with AMP for Email

**Gmail renders AMP only from registered senders.** A sender has to register with Google and pass SPF, DKIM and DMARC, and until registration is approved, Gmail recipients see the HTML part.

AMP content also expires. The AMP version stops rendering 30 days after the message is received, and the HTML fallback is shown from then on, so the HTML part has to carry the complete message by itself.

Invalid AMP fails without an error. A document that breaks the AMP for Email specification, for example with a disallowed tag or attribute, is not rendered, and the recipient sees the HTML version instead. Running the document through the AMP validator before sending catches these errors, since the send itself reports nothing.

Remote requests follow their own rules. An endpoint behind `amp-list` or `action-xhr` has to return the CORS headers the AMP for Email specification requires, or the component fails to load its data. Gmail may also cache AMP emails and serve them from Google's servers.

## AMP for Email in Lettr

The send request takes AMP content in the `amp_html` field, next to `html` and `text`, and **Lettr packages the parts into one multipart MIME message**. The docs require an HTML fallback with every AMP send.

Templates handle AMP as well. Values inserted with `{{ ... }}` are HTML-escaped in AMP HTML content, as they are in HTML, and a `dynamic_amp_html` object in the substitution data holds AMP chunks that render through `render_dynamic_content()`.

Engagement with the AMP version is reported separately from the HTML version. Webhooks deliver `engagement.amp_open`, `engagement.amp_initial_open` and `engagement.amp_click` events alongside the regular [open tracking](/glossary/open-tracking/) and [click tracking](/glossary/click-tracking/) events, and the Events dashboard shows them as AMP opened and AMP clicked badges.

Sandbox API keys accept AMP content like live keys, so test requests can exercise the same payloads. On the Logs page, the AMP HTML body of a request is truncated after 200 characters. The [Email Content Types page](https://docs.lettr.com/knowledge-base/fundamentals/content-types) compares AMP with HTML and plain text.
