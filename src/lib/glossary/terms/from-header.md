---
term: From Header
question: What is
description: "The From header is the sender address a recipient sees, and the domain DMARC checks. How it differs from the envelope from and how Lettr's from field sets it."
related: [envelope-from, reply-to-header, dmarc-alignment, email-spoofing, bimi]
reading:
  - title: Email Headers Explained
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-headers
  - title: Recipients
    href: https://docs.lettr.com/learn/sending/recipients
---

**The From header** is the message header that names the sender, and it is the address an email client displays in the inbox, as in `From: Acme Support <support@acme.com>`. It identifies who the message is from to the person reading it. Because it is also the identity recipients trust, DMARC checks its domain, which makes the From header the anchor of email authentication as well as of the sender's brand.

## How the From header works

The header is part of the message content defined by RFC 5322, written after the SMTP `DATA` command along with Subject, To and the body. **Every message must carry exactly one From header.** It holds a mailbox address and usually a display name, the friendly text shown in place of the address, such as `Acme Support`.

Mail servers do not route on it. Delivery uses the envelope addresses given during the SMTP session, so the From header can name any address the sending software chooses. That freedom is why the header was easy to forge before authentication existed, and why receivers now verify it indirectly.

Replies normally go to the From address. A [Reply-To header](/glossary/reply-to-header/) overrides that, which lets a message come from an automated address such as `noreply@example.com` while replies reach a staffed mailbox.

## From header vs envelope from

**The From header is for people; the [envelope from](/glossary/envelope-from/) is for servers.** The envelope from, set in the SMTP `MAIL FROM` command and recorded as the Return-Path, receives bounces and is the domain SPF checks. The From header is what the recipient reads and the domain DMARC protects.

The two often differ. An email service provider usually puts its own bounce-processing address in the envelope while the From header carries the customer's address, and some clients, notably Gmail, show a "via" label when the domains do not match.

[DMARC alignment](/glossary/dmarc-alignment/) connects them. A message passes DMARC only when SPF or DKIM passes for a domain that matches the From domain, either exactly under strict mode or at the organizational domain level under relaxed mode. Changing the From address never fixes SPF, because SPF looks only at the envelope domain.

## Common problems with the From header

**Sending from a domain the sender does not control fails authentication.** A From address on a free mailbox domain such as `yahoo.com`, sent through a third-party service, cannot align with SPF or DKIM, and domains that publish `p=reject` tell receivers to refuse it. Google and Yahoo require bulk senders to authenticate the From domain with DMARC, so the From address belongs on the sender's own domain or a subdomain of it.

Display names cause a subtler problem. Attackers set a trusted name, such as a bank or an executive, next to an unrelated address, and many mobile clients show only the name. Receivers and security tools therefore weigh mismatches between display name and domain, and legitimate senders avoid display names that look like another brand. This is a common form of [email spoofing](/glossary/email-spoofing/) that DMARC alone does not stop, since the domain in the address itself may be authentic.

Inconsistency hurts recognition. Changing the From name or address between messages makes mail harder to identify and can affect engagement. Brand indicators such as [BIMI](/glossary/bimi/) logos are also tied to the From domain, and display only when that domain passes DMARC at an enforcement policy.

## From header in Lettr

**Every send request requires a `from` address on a verified sending domain**, and the optional `from_name` parameter sets the display name, so `from: 'notifications@example.com'` with `from_name: 'Acme Inc'` reaches the recipient as `Acme Inc <notifications@example.com>`. A `from` address on a domain that is not configured or approved for sending is rejected with a `400` error and the code `unconfigured_domain`.

`From` is one of the headers Lettr manages itself, so it cannot be overridden through the `headers` field. Replies go to a different address through the `reply_to` and `reply_to_name` parameters. Over the SMTP relay, Lettr validates the address in the `From:` header rather than the envelope sender in `MAIL FROM`, and a message from an unverified domain is rejected when the client sends the message body.

Lettr signs each message with a DKIM key whose `d=` value is the sending domain, so DKIM aligns with the From domain for DMARC without extra configuration. The Message Details view shows the From address as it appeared in the email, display name included. The [Recipients](https://docs.lettr.com/learn/sending/recipients) page covers sender names and Reply-To.
