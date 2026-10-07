---
term: Base64 Encoding
heading: "What is Base64 encoding?"
description: "Base64 encoding turns binary data such as attachments into plain ASCII text so it can travel through email. How it works, its overhead and its use in Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [mime, quoted-printable-encoding, multipart-message, character-encoding, cid]
reading:
  - title: Attachments
    href: https://docs.lettr.com/learn/sending/attachments
  - title: Content Types
    href: https://docs.lettr.com/learn/sending/content-types
---

**Base64 encoding** is a method for representing binary data as plain ASCII text using a 64-character alphabet: `A` to `Z`, `a` to `z`, `0` to `9`, `+` and `/`. Email depends on it because SMTP was designed for 7-bit text, so files such as PDFs and images have to be converted to text before they can travel safely through every server on the path. The cost is size: encoded data is about a third larger than the original.

## How Base64 encoding works

The encoder reads the input three bytes at a time. **Those 24 bits are split into four 6-bit groups**, and each group, a number from 0 to 63, maps to one character of the alphabet. Three bytes in, four characters out, which is where the 33% overhead comes from. When the input length is not a multiple of three, the output is padded with one or two `=` characters so decoders know where the data ends.

In a message, Base64 is declared per [MIME](/glossary/mime/) part with the header `Content-Transfer-Encoding: base64`. The receiving client reads that header and decodes the part back to its original bytes. MIME also limits encoded lines to 76 characters, so Base64 inside a raw message appears as a block of short, wrapped lines.

## Where Base64 appears in email

Base64 turns up in more places than attachments:

- **Attachments:** each file in a [multipart message](/glossary/multipart-message/) is normally its own Base64-encoded part, with its filename and MIME type in the part headers.
- **Body text:** HTML or plain text dominated by non-Latin characters is often sent as Base64, since escaping it byte by byte would be larger.
- **Headers:** a subject line with non-ASCII characters uses the encoded-word form `=?UTF-8?B?...?=`, where `B` stands for Base64.
- **Authentication data:** a DKIM public key (`p=`) and signature (`b=`) are Base64 strings, and SMTP `AUTH PLAIN` sends credentials Base64-encoded.

## Base64 vs quoted-printable

[Quoted-printable encoding](/glossary/quoted-printable-encoding/) is the other MIME transfer encoding. It leaves ordinary ASCII readable and escapes only other bytes as `=XX` hexadecimal codes, which makes it compact for text that is mostly English with the occasional accented letter. **Base64 has a fixed overhead regardless of content**, so it wins for binary files and for text made mostly of non-ASCII characters, and loses for plain English prose. Mail libraries usually choose between the two per part, based on what the content contains.

## Common problems with Base64

**Base64 is an encoding, not encryption.** Anyone can decode it, so credentials sent with `AUTH PLAIN` or an HTTP Basic `Authorization` header are only protected when the connection uses TLS.

The size increase is easy to forget. Receiving servers enforce message size limits on the encoded message, so a file that fits under a limit on disk can exceed it once encoded.

Formatting trips up API integrations. Some libraries wrap Base64 output at 76 characters with line breaks, which suits a raw MIME message but breaks a JSON field that expects one unbroken string. Pasting a data URL prefix such as `data:application/pdf;base64,` into the field, or using the URL-safe base64url variant with `-` and `_`, produces a string that standard decoders reject.

## Base64 encoding in Lettr

Lettr's send API carries **attachments as Base64 content inside the JSON request**. Each entry in the `attachments` array has three fields: `name`, the filename the recipient sees (up to 255 characters); `data`, the file content encoded as Base64; and `type`, the MIME type, for example `application/pdf`. The `data` value must not contain `\r\n` characters, so line-wrapped output needs the breaks stripped before sending. An attachment that fails validation returns a `validation_error` response, such as "The attachments.0.data field must be a valid base64 string.", and the email is not sent.

Lettr does not currently embed inline images. An `<img src="cid:logo">` reference has no [Content-ID](/glossary/cid/) to bind to, because the file is delivered as a regular attachment, so images shown in the body are hosted at a public URL and referenced from the HTML. The SMTP relay takes attachments as standard MIME parts instead of Base64 in JSON.

Base64 also appears on the receiving side of webhooks: with basic authentication configured, Lettr sends an `Authorization: Basic` header whose credentials the endpoint decodes from Base64. The [Attachments page](https://docs.lettr.com/learn/sending/attachments) covers the field format and common MIME types.
