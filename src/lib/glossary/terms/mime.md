---
term: MIME
fullName: Multipurpose Internet Mail Extensions
question: What is
description: "MIME is the standard that lets email carry HTML, attachments, non-ASCII text and multiple parts in one message. How MIME types and encodings work."
related: [multipart-message, base64-encoding, quoted-printable-encoding, character-encoding, cid]
reading:
  - title: Email Content Types
    href: https://docs.lettr.com/knowledge-base/fundamentals/content-types
  - title: Content Types
    href: https://docs.lettr.com/learn/sending/content-types
  - title: Attachments
    href: https://docs.lettr.com/learn/sending/attachments
---

**MIME (Multipurpose Internet Mail Extensions)** is the standard that extends email beyond plain ASCII text. The original message format carried only short lines of 7-bit text, so MIME adds headers that describe each piece of content, encodings that turn binary data into safe text, and a way to combine several pieces in one message. HTML email, attachments and text in languages other than English all depend on it.

## How MIME works

MIME describes content through headers. `MIME-Version: 1.0` marks a message as MIME. **`Content-Type` names the media type** of the content, such as `text/plain`, `text/html`, `image/png` or `application/pdf`, with parameters like `charset=UTF-8`. `Content-Transfer-Encoding` says how the body was encoded for transport, and `Content-Disposition` marks a part as inline or as an attachment and carries its filename.

Encodings make any content fit SMTP's text-based transport. [Base64](/glossary/base64-encoding/) handles binary files such as PDFs and images, at the cost of making them about a third larger. [Quoted-printable](/glossary/quoted-printable-encoding/) suits text that is mostly ASCII, since it leaves ordinary characters readable and escapes only the rest. The `charset` parameter declares the [character encoding](/glossary/character-encoding/) of text parts, and non-ASCII characters in headers such as the subject are carried as encoded words defined in RFC 2047.

Several pieces of content are combined with a multipart type. A `Content-Type` of `multipart/...` carries a `boundary` parameter, each part starts after a line of two hyphens followed by the boundary string, and a final boundary with two trailing hyphens closes the container. Every part has its own headers, and a part can itself be multipart, so containers nest.

## Common MIME types in email

Most messages are built from a handful of types:

- **`multipart/alternative`:** the same content in several formats, usually plain text and HTML, forming a [multipart message](/glossary/multipart-message/) from which the client displays one version.
- **`multipart/mixed`:** a message body together with attachments.
- **`multipart/related`:** HTML together with the resources it references, such as images addressed by [CID](/glossary/cid/).
- **`text/x-amp-html`:** the AMP version of an email, included as an extra part inside `multipart/alternative`.

A typical message with an attachment nests them: a `multipart/mixed` container holds a `multipart/alternative` part with the text and HTML versions, followed by the attachment as its own part.

## Common problems with MIME

**Charset errors are the most visible failure.** A text part sent without a `charset`, or with the wrong one, displays accented letters and symbols as garbled characters, and the fix is declaring UTF-8 and encoding the content to match.

Part order in `multipart/alternative` matters, because the parts run from least to most preferred and clients generally display the last one they support. HTML placed before plain text can lead a client to show the text version. Line length is another limit: SMTP caps lines at 1,000 characters including the line ending, so long HTML lines need an encoding such as quoted-printable or line breaks.

Hand-built MIME is fragile. A boundary string that also appears inside the content, a missing closing boundary or a wrong `Content-Transfer-Encoding` can make a message unreadable, which is why sending libraries and email platforms generate the structure instead of application code.

## MIME in Lettr

**Lettr encodes the body with MIME when it assembles each message**, to support HTML, plain text and attachments. A send request carries content in the `html`, `text` and `amp_html` fields, and Lettr packages HTML and plain text together as a multipart MIME message.

Attachments go in an `attachments` array, where each entry has a `name`, Base64-encoded `data` and a MIME `type` such as `application/pdf`. Lettr does not currently support inline images: a `cid:` reference in the HTML has nothing to bind to, because the image is delivered as a regular attachment with `Content-Disposition: attachment` and no `Content-ID`. The `MIME-Version`, `Content-Type` and `Content-Transfer-Encoding` headers are managed by Lettr and cannot be set through the `headers` field.

On the inbound side, Lettr handles SMTP reception, MIME parsing and attachment extraction, and delivers each email to the application as JSON with its plain text and HTML bodies, headers and attachment URLs. The [Email Content Types](https://docs.lettr.com/knowledge-base/fundamentals/content-types) page shows the `multipart/alternative` structure Lettr produces.
