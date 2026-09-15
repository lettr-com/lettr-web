---
term: Authentication-Results Header
heading: "What is the Authentication-Results header?"
description: "The Authentication-Results header records a receiving server's SPF, DKIM and DMARC verdicts on a message. How to read it and use it to check a Lettr domain."
published: 2026-09-14
updated: 2026-09-14
related: [spf, dkim, dmarc, email-header, arc]
reading:
  - title: Email Headers Explained
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-headers
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
  - title: Spam Placement Troubleshooting
    href: https://docs.lettr.com/knowledge-base/troubleshooting/spam-placement
---

**The Authentication-Results header** is an [email header](/glossary/email-header/) that a receiving mail server adds to record the outcome of its authentication checks. It lists the result of each method the server ran, usually SPF, DKIM and DMARC, along with the domains each check used. Defined in RFC 8601, it is the first place to look when a message lands in spam or fails authentication.

## How the Authentication-Results header works

The receiving server runs its checks when the message arrives and **adds the header with its own hostname as the first field**, the identifier of the service that performed the checks. Each result follows as `method=result`, with properties that name what was checked, as in `Authentication-Results: mx.google.com; dkim=pass header.d=example.com; spf=pass smtp.mailfrom=example.com; dmarc=pass header.from=example.com`.

- **[SPF](/glossary/spf/):** `smtp.mailfrom` gives the envelope sender domain that SPF evaluated.
- **[DKIM](/glossary/dkim/):** `header.d` gives the signing domain, and `header.s` the selector.
- **[DMARC](/glossary/dmarc/):** `header.from` gives the visible From domain, often with the published policy in parentheses.

Besides `pass`, results include `fail`, `softfail` for SPF, `neutral`, `none` when no record or signature exists, `temperror` for a temporary DNS problem and `permerror` for a record that cannot be evaluated. A comment in parentheses often explains the verdict, as in `dkim=fail (body hash did not verify)`.

## Why the Authentication-Results header matters

**The header shows what a real receiver concluded about a real message.** A DNS lookup confirms that an SPF, DKIM or DMARC record exists. The header shows whether a specific message passed against those records at the destination, after every relay and gateway on the way.

It also separates authentication from alignment. A message can show `spf=pass` and `dkim=pass` together with `dmarc=fail`, which means neither passing domain in `smtp.mailfrom` or `header.d` matches the domain in `header.from`. Comparing those three domains in one header usually identifies the problem.

## Common problems with the Authentication-Results header

**Only the header added by the recipient's own server is reliable.** Any server can write an Authentication-Results header, so a receiving server removes copies that claim its own identifier when they arrive from outside, and a reader should check the hostname at the start of the header before trusting the result. A header from an earlier hop describes that hop's view, which may differ from the final one.

Forwarded mail shows misleading results. The final server evaluates SPF against the forwarder's IP address, so SPF fails even for a correctly configured domain, and any change to the body produces a DKIM body hash failure. [ARC](/glossary/arc/) headers exist to preserve the results from before forwarding.

Most email clients hide headers. Gmail shows them under **Show original** in the message menu, Outlook on the web under View message source, and Apple Mail under View, Message, All Headers.

## Authentication-Results header in Lettr

**The Authentication-Results header is always written by the receiving mail server**, and it reports how that server judged the SPF, DKIM and DMARC setup of a Lettr sending domain. The Lettr docs use it as the end-to-end test: a test message sent to a Gmail account and opened with Show original should show `dkim=pass`, `spf=pass` and `dmarc=pass`.

Lettr signs each message with a DKIM key specific to the sending domain, so `header.d` shows that domain. With the sending domain enabled as the bounce domain, `smtp.mailfrom` shows it as well, and the header reads `spf=pass smtp.mailfrom=example.com`, `dkim=pass header.d=example.com` and `dmarc=pass header.from=example.com`.

The troubleshooting docs map failures in the header to fixes. `dkim=fail` with a body hash comment means the content was modified after signing, often by a forwarding service or a security gateway. A DKIM failure for a missing key points to a DKIM record that is missing or has a typo, which should be checked against the value in Lettr's domain settings. `dmarc=fail` means the From domain does not align with the DKIM signing domain.

The header covers individual messages, and domain verification covers DNS. The `POST /api/domains/{domain}/verify` endpoint reports `dkim_status`, `spf_status` and `dmarc_status` for the records themselves. The [Email Headers Explained page](https://docs.lettr.com/knowledge-base/fundamentals/email-headers) walks through a full passing header.
