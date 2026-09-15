---
term: Multipart Message
heading: "What is a multipart message?"
description: "A multipart message packs several parts of an email, such as plain text and HTML versions, into one MIME container. How it works and why senders include both."
published: 2026-09-14
updated: 2026-09-14
related: [mime, amp-for-email, cid, spam-score, mua]
reading:
  - title: Email Content Types
    href: https://docs.lettr.com/knowledge-base/fundamentals/content-types
  - title: Content Types
    href: https://docs.lettr.com/learn/sending/content-types
---

**A multipart message** is an email whose body is divided into several parts inside one [MIME](/glossary/mime/) container. The most common form holds the same content twice, as `text/plain` and `text/html` in a `multipart/alternative` container, and the recipient's email client displays the version it supports and prefers. Other multipart types combine a message body with attachments or with the images an HTML part references.

## How a multipart message works

The message's top-level header declares the container, for example `Content-Type: multipart/alternative; boundary="b1"`. **The boundary string separates the parts**: each part begins after a line containing two hyphens and the boundary, carries its own `Content-Type` and encoding headers, and holds its content. A final boundary followed by two more hyphens closes the container.

In `multipart/alternative`, the order of the parts carries meaning. They run from least to most preferred, so plain text comes first and HTML after it, and a client displays the last part it can render. A text-only client or a user who prefers plain text still gets a readable message, while every other client shows the HTML.

Containers nest. A message with an attachment usually has a `multipart/mixed` container at the top, holding a `multipart/alternative` part with the text and HTML versions, followed by the attachment. An HTML part with embedded images sits inside `multipart/related`, next to the image parts it references. [AMP for Email](/glossary/amp-for-email/) adds a third alternative, a `text/x-amp-html` part, which clients without AMP support skip in favor of the HTML version.

## Why send multipart messages

**Sending both plain text and HTML is standard practice**, and each part does a different job:

- **Compatibility:** clients that cannot render HTML, or users who switch it off, see the text version automatically.
- **Deliverability:** an HTML-only email with no text alternative is a common spam indicator, so the text part helps with filters that assign a [spam score](/glossary/spam-score/).
- **Accessibility:** screen readers and other assistive technologies often work better with the plain text part.

AMP makes the fallback mandatory. Only some clients support AMP, so an AMP part always travels with an HTML version, and the plain text part covers the clients that support neither.

## Common problems with multipart messages

**A text part that says nothing useful defeats the purpose.** An empty part, or one that only says to view the email in a browser, leaves text-only readers with no content and still reads as low quality to filters. The text version should carry the same core information as the HTML, without the formatting.

Versions drift apart over time. A template whose HTML is updated while the text part is left alone ends up sending different prices, dates or links in each version, and a merge tag added only to the HTML leaves the text version without that personalization.

Structure errors are less common but harder to spot. HTML placed before plain text in `multipart/alternative` can lead clients to display the text version, and an `<img src="cid:...">` reference only displays inline when the image travels in a `multipart/related` part with a matching [CID](/glossary/cid/). Most [mail clients](/glossary/mua/) show nothing wrong in these cases, so checking the raw source of a test message is the reliable way to confirm the structure.

## Multipart message in Lettr

**When a request includes both `html` and `text`, Lettr packages them as a multipart MIME message**, and the recipient's client displays whichever format it prefers. The docs recommend including both versions. With both parts present, Lettr wraps them in a `multipart/alternative` structure, and when AMP content is included the structure has three parts.

AMP content goes in the `amp_html` field, and every AMP send needs HTML fallback content. Merge tags work in plain text content as well as HTML, with one difference: values are HTML-escaped in HTML content and inserted as-is in plain text.

Lettr does not currently support inline images. An image attached to a send is delivered as a regular attachment without a `Content-ID`, so images shown in the body are hosted at a public URL and referenced from the HTML. On the inbound side, Lettr parses the MIME structure of received emails and delivers both the plain text and HTML bodies to the application. The [Email Content Types](https://docs.lettr.com/knowledge-base/fundamentals/content-types) page shows the MIME structure of a multipart send.
