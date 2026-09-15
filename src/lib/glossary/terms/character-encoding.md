---
term: Character Encoding
heading: "What is character encoding?"
description: "Character encoding maps text to bytes in an email. How UTF-8 and the charset parameter work, why mismatches garble text, and how Lettr decodes inbound mail."
published: 2026-09-14
updated: 2026-09-14
related: [mime, base64-encoding, quoted-printable-encoding, multipart-message, rendering-engine]
reading:
  - title: Email Parsing
    href: https://docs.lettr.com/learn/inbound/parsing
  - title: Rendering Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/rendering-issues
  - title: Email Content Types
    href: https://docs.lettr.com/knowledge-base/fundamentals/content-types
---

**Character encoding** is the method of representing text characters as bytes in email content. UTF-8 is the modern standard and covers every Unicode character, including emoji, non-Latin scripts and symbols. Older messages may use legacy encodings such as ISO-8859-1 (Latin-1) or Windows-1252. Each text part declares its encoding in the `Content-Type` header, for example `text/html; charset=utf-8`, and the receiving client relies on that declaration to turn the bytes back into readable text.

## How character encoding works in email

Email transport was built for plain ASCII, so a message with anything beyond it passes through two separate layers. **The character set maps characters to bytes**, and the `charset` parameter on `Content-Type` names it. The transfer encoding, declared in `Content-Transfer-Encoding`, then packs those bytes into lines that survive mail transport. [MIME](/glossary/mime/) defines both layers.

The two common transfer encodings suit different content. [Quoted-printable](/glossary/quoted-printable-encoding/) keeps ASCII readable and writes every other byte as `=` followed by two hex digits, which fits mostly-Latin text with a few accented letters. [Base64](/glossary/base64-encoding/) converts all bytes into ASCII characters, which fits text in non-Latin scripts and binary data. Neither changes the charset: a quoted-printable part declared as UTF-8 still decodes to UTF-8 bytes.

Headers need their own mechanism, because a Subject or display name cannot carry raw non-ASCII bytes. They use encoded words of the form `=?charset?encoding?text?=`, where `B` marks base64 and `Q` a quoted-printable variant. `=?UTF-8?B?SGVsbG8gV29ybGQ=?=` decodes to `Hello World`, and `=?ISO-8859-1?Q?=C4pfel?=` decodes to `Äpfel`.

An HTML part can also state its encoding with `<meta charset="utf-8">` in the document head. That tag should agree with the header, since clients differ in which declaration they trust.

## Common problems with character encoding

**Most garbled text comes from a declaration that does not match the bytes.** UTF-8 bytes read as ISO-8859-1 turn each accented letter into two or three wrong characters, so `é` shows as `Ã©`. Bytes in a legacy encoding read as UTF-8 fail to decode and appear as the replacement character `�`. A part with no charset at all leaves the client to guess, and guesses vary between clients.

Windows-1252 and ISO-8859-1 are often treated as the same encoding, but they differ in one byte range. Windows-1252 uses it for typographic quotation marks, dashes and the euro sign, so text labelled ISO-8859-1 can lose exactly those characters.

Mixed sources cause the rest. A template saved as UTF-8 can still receive merge data from a database or CSV export in another encoding, and the broken characters only appear once real data fills the template. Subject lines built by string concatenation, without encoded words, can arrive mangled even when the body renders correctly.

## Best practices for character encoding

**Use UTF-8 for every part of every message.** It covers all scripts, so there is no reason to pick a legacy charset for new content. Declare it in the `Content-Type` header and, for HTML, in the meta tag as well, so both declarations agree.

In a [multipart message](/glossary/multipart-message/), each part carries its own `charset`, so the plain text and HTML alternatives need the same declaration. Merge data should be converted to UTF-8 before it reaches the template, and test sends should include accented letters, emoji and at least one non-Latin script.

## Character encoding in Lettr

When a request carries both HTML and plain text, Lettr wraps them in a `multipart/alternative` structure, and the documented structure declares `charset="UTF-8"` on both the `text/plain` and the `text/html` part. The HTML examples in the sending docs include `<meta charset="utf-8">` in the head.

**Inbound email is normalized to UTF-8.** Lettr decodes ISO-8859-1, Windows-1252, base64-encoded UTF-8 and quoted-printable content, so the text and subject of an inbound message arrive as UTF-8 strings regardless of the original encoding. Subjects are decoded from MIME encoded words, and the complete raw message stays available for parsing with a MIME library.

The test emails guide recommends sending templates with special characters and Unicode to catch encoding issues before a real send. The [Email Parsing](https://docs.lettr.com/learn/inbound/parsing) page in the Lettr docs lists the inbound fields.
