---
term: Quoted-Printable Encoding
question: What is
description: "Quoted-printable encoding keeps mostly-ASCII email text readable by escaping other bytes as =XX codes. How it works, where it breaks and how Lettr decodes it."
related: [base64-encoding, mime, character-encoding, multipart-message, dkim]
reading:
  - title: Email Parsing
    href: https://docs.lettr.com/learn/inbound/parsing
  - title: "Email Content Types: HTML, Plain Text, and AMP"
    href: https://docs.lettr.com/knowledge-base/fundamentals/content-types
---

**Quoted-printable encoding** is a MIME content transfer encoding, defined in RFC 2045, that represents 8-bit data using only printable ASCII characters. Ordinary letters, digits and most punctuation pass through unchanged, and every other byte is written as an equals sign followed by two hexadecimal digits. The encoded text stays readable in a raw message source, which suits content that is mostly ASCII with the occasional accented letter or symbol.

## How quoted-printable encoding works

**Printable ASCII characters stay as they are**, with one exception: the equals sign itself becomes `=3D`, because `=` marks the start of an escape. Every other byte is replaced by `=` and its value in uppercase hexadecimal. In UTF-8 the letter `é` is the two bytes `C3 A9`, so `café` is encoded as `caf=C3=A9`. Spaces and tabs stay literal inside a line, but at the end of a line they are encoded as `=20` or `=09`, since mail servers may strip trailing whitespace.

Line length is the second rule. Encoded lines may be at most 76 characters long, and a longer line is split with a soft line break: an `=` as the last character of the line. The decoder removes that `=` together with the line ending and joins the two pieces back into one line. A real line break in the original text stays a normal CRLF. This is why HTML sent as quoted-printable shows lines ending in `=` and attributes written as `href=3D"...`.

A [MIME](/glossary/mime/) part declares the encoding in its headers with `Content-Transfer-Encoding: quoted-printable`, next to a `Content-Type` that names the charset. The transfer encoding only packs bytes into safe lines. The [character encoding](/glossary/character-encoding/) in the `charset` parameter still decides which characters those bytes represent, so a quoted-printable part declared as UTF-8 decodes to UTF-8 bytes.

Headers use a variant of the same idea. RFC 2047 encoded words marked with `Q` escape bytes as `=XX` in a subject or display name, and write a space as an underscore to keep the encoded word free of literal spaces.

## Quoted-printable vs Base64

[Base64](/glossary/base64-encoding/) is the other MIME transfer encoding, and the choice between the two depends on the content. **The size cost of quoted-printable varies with the text**: each escaped byte takes three characters, so English prose with a few accented letters grows very little, while text in a non-Latin script, where almost every byte needs escaping, can grow to roughly three times its size. Base64 adds a fixed third to everything, which makes it the smaller option for that kind of text.

Binary files such as images and PDFs travel as Base64. Quoted-printable is designed for line-oriented text, and its line rules make it a poor fit for arbitrary bytes.

## Common problems with quoted-printable encoding

**Most visible faults come from content that was never decoded.** Code that reads a raw message and skips the decoding step shows `=C3=A9` in place of accented letters, `=3D` in place of equals signs and stray `=` characters at the ends of lines. Links extracted from undecoded HTML are broken twice over, once by the soft line breaks that split long URLs and once by the escaped equals signs in their query strings.

Double encoding produces a similar mess. Text that is already quoted-printable and gets encoded again turns every `=3D` into `=3D3D`, and a single decode leaves the first layer of escapes behind.

Encoding changes in transit also affect authentication. A [DKIM](/glossary/dkim/) signature covers the body as it was sent, so a relay that converts an 8-bit body to quoted-printable along the way changes the signed bytes and the signature fails.

## Quoted-printable encoding in Lettr

A Lettr send request carries its content as plain strings in the `html` and `text` fields, so the transfer encoding is not part of the request. `Content-Transfer-Encoding` is among the headers Lettr manages itself, and it cannot be set through the `headers` field of a send.

**Inbound email is decoded to UTF-8.** When Lettr parses mail received on an inbound domain, it converts quoted-printable content, along with ISO-8859-1, Windows-1252 and base64-encoded UTF-8, so the text and subject reach the application as UTF-8 strings regardless of the original encoding. The complete raw MIME message is also available for parsing with a MIME library when the structured fields are not enough.

The test emails guide recommends sending templates with special characters and Unicode to catch encoding issues before a real send. The [Email Parsing](https://docs.lettr.com/learn/inbound/parsing) page in the Lettr docs covers how inbound content is decoded.
