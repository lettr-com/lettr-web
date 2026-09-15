---
term: X-Header
description: "An X-header is a custom email header whose name starts with X-, such as X-Mailer. How X-headers work, why the prefix was deprecated, and X-headers in Lettr."
related: [email-header, list-unsubscribe-header, auto-submitted-header, spam-score, message-id]
reading:
  - title: Custom Headers in the API Reference
    href: https://docs.lettr.com/api-reference/introduction
  - title: Email Headers Explained
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-headers
---

**An X-header** is a custom [email header](/glossary/email-header/) whose name starts with `X-`, such as `X-Mailer` or `X-Campaign-ID`. It carries information that no standard field covers, like the program that composed a message, an internal order ID or a spam filter's verdict. Software that does not recognize an X-header ignores it, so any system can add one without affecting how the message is delivered.

## How X-headers work

An X-header has the same format as any other header field: a name, a colon and a value on its own line, such as `X-Order-ID: 8a3f2c`. **The `X-` prefix goes back to RFC 822**, the 1982 message format standard, which promised that no officially defined field name would ever begin with `X-`. That reserved the prefix for private use, so an application could invent a name without risking a clash with a future standard.

Sending software adds fields such as `X-Mailer`, which names the program that built the message, and `X-Priority`, a value from 1 (highest) to 5 (lowest) that some mail clients display as an importance flag. Receiving systems add their own. SpamAssassin writes its verdict into `X-Spam-Status`, and Microsoft records its filtering results in `X-Forefront-Antispam-Report`, so the raw message shows how filtering arrived at its [spam score](/glossary/spam-score/). Applications use X-headers to label mail with their own identifiers, which lets a copy of a message be traced back to the record that produced it.

No part of the delivery process depends on an X-header. Routing, authentication and threading all use standard fields, so an X-header changes how a message is handled only when a particular filter or client chooses to read it.

## X-header vs standard header

**RFC 6648, published in 2012, deprecated the `X-` convention** for new names across application protocols. Experimental names that became widely used could not drop the prefix without breaking the software that already relied on them, so the marker meant to signal "unofficial" became permanent. The RFC recommends descriptive names without a prefix instead.

The deprecation removed nothing. `X-Mailer`, `X-Priority` and `X-Spam-Status` remain in wide use, and applications still create new names with the prefix. Fields meant for every sender took the standards route instead: [List-Unsubscribe](/glossary/list-unsubscribe-header/) and [Auto-Submitted](/glossary/auto-submitted-header/) are defined in RFCs, so mailbox providers and autoresponders can rely on what they mean. An application-specific X-header carries meaning only for the systems that agreed on it.

## Common problems with X-headers

**X-headers are visible to anyone who opens the raw message.** Mail clients hide them from the normal view, but "Show original" or "View source" displays every field. An X-header should never carry an access token, a password or personal data the recipient is not meant to see, and an internal ID is safe only when it reveals nothing on its own.

The format rules for any header apply to X-headers too. A field name may contain only printable ASCII characters, with no spaces and no colon, a line may not exceed 998 characters, and non-ASCII text in a value needs the encoding defined in RFC 2047.

Custom headers also have little protection in transit. A DKIM signature covers only the headers listed in its `h=` tag, and custom headers are often left out, so a relay can alter or strip one without failing authentication. Replies do not copy them either: a reply is a new message that points to the original through `In-Reply-To` and `References`, which hold the original [Message-ID](/glossary/message-id/), and none of the original's X-headers come along.

## X-header in Lettr

**The send API sets custom headers through the `headers` object**, where each key is a header name and each value the header value, for example `"X-Campaign-ID": "spring-2026"`. Lettr accepts a maximum of 10 custom headers per email, with a maximum of 998 characters per header value.

Headers that Lettr manages automatically are blocked from the `headers` field. The docs list includes `From`, `To`, `Subject`, `Message-ID`, `DKIM-Signature`, `Return-Path` and `List-Unsubscribe`, among others.

Data that has to come back in webhook events belongs in the `metadata` object instead, whose key-value pairs are included in the webhook payloads for that email. Over SMTP, custom headers are part of the message itself, and the Lettr PHPMailer guide adds `X-Campaign-ID` and `X-Customer-ID` with `addCustomHeader`. The [API reference introduction](https://docs.lettr.com/api-reference/introduction) documents the custom header limits and the full list of blocked headers.
