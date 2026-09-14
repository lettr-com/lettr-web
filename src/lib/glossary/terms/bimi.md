---
term: BIMI
fullName: Brand Indicators for Message Identification
description: "BIMI shows a brand's logo next to its emails in supporting inboxes. The DMARC, logo and certificate requirements, and how BIMI fits with a Lettr domain."
related: [dmarc, verified-mark-certificate, dkim, email-spoofing, txt-record]
reading:
  - title: "BIMI: Brand Indicators for Message Identification"
    href: https://docs.lettr.com/knowledge-base/fundamentals/bimi
  - title: BIMI Records
    href: https://docs.lettr.com/learn/domains/bimi
  - title: DMARC Configuration
    href: https://docs.lettr.com/learn/domains/dmarc
---

**BIMI (Brand Indicators for Message Identification)** is an email standard that lets a sender's brand logo appear next to its messages in supporting inboxes, in place of a generic avatar or the sender's initials. The domain publishes a DNS record that points to its logo, and the mailbox provider shows that logo only for mail that passes DMARC under an enforced policy. BIMI adds no authentication of its own; it builds on authentication the domain already has.

## How BIMI works

BIMI starts after the usual checks. The receiving server authenticates the message with SPF, DKIM and [DMARC](/glossary/dmarc/), and **BIMI applies only when DMARC passes with a policy of `p=quarantine` or `p=reject`**. A domain at `p=none` never gets its BIMI record looked up.

The server then queries DNS for a [TXT record](/glossary/txt-record/) at `default._bimi.example.com`. A typical record reads `v=BIMI1; l=https://example.com/logo.svg; a=https://example.com/vmc.pem`. The `v=` tag is the version, `l=` is the HTTPS address of the logo file, and `a=` points to a [Verified Mark Certificate](/glossary/verified-mark-certificate/) in PEM format. The `default` part is a selector, and other selectors can publish a different logo for a separate mail stream, though that is rarely done.

With the record found, the server fetches the logo, validates the certificate where one is provided, and the client displays the logo alongside the message. Gmail shows it as the sender avatar.

## Requirements for BIMI

A working setup needs three things in place:

- **DMARC enforcement:** a published DMARC policy of `p=quarantine` or `p=reject`, with mail from the domain consistently passing.
- **An SVG Tiny PS logo:** a restricted SVG profile with no scripts, animations or external references, square with a solid background, under 32 KB and hosted at a public HTTPS URL.
- **A Verified Mark Certificate:** a certificate proving the logo is a registered trademark, issued by an authorized certificate authority such as DigiCert or Entrust and typically valid for one year. Gmail requires one; support without a certificate varies by provider.

## Why BIMI matters

**A consistent logo helps recipients tell genuine mail from impersonation.** Because BIMI demands DMARC enforcement, a forged message using the domain fails authentication before any logo lookup happens, so the logo appears only on mail the domain actually authorized. That makes BIMI a practical reason to finish the move to enforcement, which in turn protects the domain against [spoofing](/glossary/email-spoofing/) whether or not a logo ever shows.

Display is not guaranteed. Mailbox providers also weigh sender reputation and engagement, a new domain may not show its logo straight away, and after a record is published it can take days or weeks before logos appear consistently.

## Common problems with BIMI

**Most BIMI failures trace back to DMARC** still being at `p=none`, or to mail that does not pass DMARC consistently. The next most common cause is the logo file: a standard SVG exported from a design tool is not SVG Tiny PS and has to be converted, and a logo that is not square and centered gets clipped by the circular frame most providers use.

Record placement is another trap. The record belongs at `default._bimi.example.com`, not at `_bimi.example.com`, and the logo URL must use HTTPS.

Certificates expire. When a Verified Mark Certificate lapses, providers that require it stop showing the logo, so renewal needs to start ahead of the expiry date. If the renewed PEM file replaces the old one at the same URL, the DNS record does not have to change.

## BIMI in Lettr

**BIMI is configured entirely through DNS**, and there is no BIMI setting in the Lettr dashboard or API. The logo, the certificate and the `default._bimi` record all live with the domain owner, and email clients look the record up on their own once DMARC enforcement is in place.

Lettr's part is the authentication BIMI depends on. Lettr signs every email with a [DKIM](/glossary/dkim/) key specific to the sending domain, with a `d=` value that matches that domain, so DKIM alignment for DMARC is handled once the domain is verified. The DMARC record itself is added by the domain owner at `_dmarc.example.com`. Its state appears as a DMARC status indicator on the domain under **Domains** then **Sending**, and as the `dmarc_status` field when the domain is retrieved through the API, with `valid` meaning the record was found and parses correctly.

The [DMARC configuration page](https://docs.lettr.com/learn/domains/dmarc) recommends starting at `p=none` with aggregate reports to confirm every service sending as the domain passes, since a `p=reject` policy blocks any source that fails authentication, not only mail from Lettr.
