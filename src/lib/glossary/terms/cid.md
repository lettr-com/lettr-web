---
term: CID
fullName: Content-ID
heading: "What is CID?"
description: "CID (Content-ID) lets an email's HTML show an image embedded in the message through a cid: URL. How it works, its trade-offs, and where Lettr stands."
published: 2026-09-14
updated: 2026-09-14
related: [mime, multipart-message, base64-encoding, tracking-pixel]
reading:
  - title: Attachments
    href: https://docs.lettr.com/learn/sending/attachments
  - title: Image Storage
    href: https://docs.lettr.com/learn/templates/image-storage
---

**CID (Content-ID)** is a standard for referencing inline images and attachments inside a multipart email message. The image travels in the message as its own part with a `Content-ID` header, and the HTML points at it with a CID URI such as `<img src="cid:logo123">` instead of an external URL. Because the image is embedded in the email, the client does not have to fetch it from a remote server to display it.

## How CID works

**CID relies on the multipart structure of [MIME](/glossary/mime/).** An email with embedded images groups the HTML part and the images it references in a `multipart/related` container. Each image part carries its own headers: a `Content-Type` such as `image/png`, a `Content-Transfer-Encoding` of `base64`, and a `Content-ID` such as `<logo123>`, often with `Content-Disposition: inline`.

The `src` attribute in the HTML uses the same identifier without the angle brackets, prefixed with `cid:`. The client looks for a part in the same message whose `Content-ID` matches and renders that part where the `img` tag sits.

In a complete [multipart message](/glossary/multipart-message/), the `multipart/related` container usually sits inside a `multipart/alternative` part next to the plain text version. Regular file attachments go in an outer `multipart/mixed` container. The image data itself is [base64](/glossary/base64-encoding/) text, like any other binary part.

## CID vs hosted images

An email can show an image in two ways: embed it with CID or link to a copy hosted at a public URL. **Embedding removes the dependency on a remote server.** Many email clients block remote images by default and ask the recipient to display them, while an embedded image is already part of the message.

Hosting has its own advantages. The message stays small, because each recipient downloads the image only when the email is opened, and the same file serves every send. Open tracking also depends on remote loading, since a [tracking pixel](/glossary/tracking-pixel/) is a hosted image by design.

Embedding costs size. Base64 makes binary data about a third larger, and every embedded image is copied into every message sent. Large messages can affect deliverability and may be blocked by receiving servers, so CID suits a logo or a few small icons better than large images.

## Common problems with CID

**A reference that does not match its part is the most common failure.** The value after `cid:` has to equal the part's `Content-ID` exactly, and a typo or a missing part leaves a broken image placeholder.

The second failure is structural. An image attached with `Content-Disposition: attachment` and no `Content-ID` gives the `cid:` reference nothing to bind to, so the HTML shows a broken image while the file appears in the attachment list. Client support is also uneven: some clients show embedded images in the attachment list as well as inline, and behaviour differs between desktop, mobile and webmail clients.

An `alt` attribute keeps the message readable in every one of these cases, whether the image is missing, blocked or broken.

## CID in Lettr

**Lettr does not currently support inline (embedded) images.** Attachments are sent as base64 content in the `attachments` array, where each entry has a `name`, `data` and `type`. An image attached this way is delivered as a regular attachment, with `Content-Disposition: attachment` and no `Content-ID`, so an `<img src="cid:logo">` reference in the HTML does not display the image inline.

To show an image in the body of an email, the docs recommend hosting it at a public URL and referencing that URL directly in the `img` tag, with an `alt` attribute for clients that block remote images.

Templates built in the Topol email editor handle hosting automatically. Images uploaded through the File Manager are stored on the team's storage and served from Lettr's default domain or from a custom storage domain, which points a subdomain to `r2-proxy.uselettr.com` with a CNAME record. The [Attachments](https://docs.lettr.com/learn/sending/attachments) page in the Lettr docs covers the attachment format and limits.
