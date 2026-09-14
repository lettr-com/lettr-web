---
term: DKIM
fullName: DomainKeys Identified Mail
question: What is
description: "DKIM signs outgoing email with a domain-owned private key so receiving servers can verify it was not altered in transit, and how Lettr manages the keys."
related: [spf, dmarc, dkim-selector, dmarc-alignment]
reading:
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
  - title: DKIM records in Lettr
    href: https://docs.lettr.com/learn/domains/dkim
---

**DKIM (DomainKeys Identified Mail)** is an email authentication standard that attaches a cryptographic signature to each outgoing message. The sending server signs with a private key that only it holds, and the matching public key is published in the sending domain's DNS. A receiving server fetches that public key and checks the signature, which proves the domain owner authorized the message and that the signed content was not changed in transit.

## How DKIM works

Signing happens on the sending server once the message is composed. **The server hashes the body and a chosen set of headers**, typically From, To, Subject and Date, and signs the result with the private key. The output goes into a `DKIM-Signature` header that travels with the message. Its tags record the signing domain (`d=`), the algorithm (`a=`), the list of signed headers (`h=`), the body hash (`bh=`) and the signature itself (`b=`).

The `s=` tag names a [DKIM selector](/glossary/dkim-selector/), a label that lets one domain publish several keys side by side. The receiving server combines the selector and the signing domain into a DNS name of the form `selector._domainkey.example.com` and looks up the public key there. The DNS record holds the key version (`v=DKIM1`), the key type (`k=rsa`) and the base64-encoded public key (`p=`).

With the key in hand, the receiver recomputes the hashes and compares them with the signature. A match means the message is authentic and unmodified. A mismatch means the signed content changed after signing or the signature was not made with the domain's private key, and the receiver records `dkim=fail` in the `Authentication-Results` header.

## DKIM vs SPF

[SPF](/glossary/spf/) and DKIM answer different questions. **SPF checks the sending IP address** against a list the domain publishes, so it validates the server that handed over the message. DKIM checks the message itself, so it validates the content and the domain that signed it, whichever server delivered it.

The difference matters most for forwarded mail. A forwarding server sends the message from its own IP address, which is not in the original domain's SPF record, so SPF fails. The DKIM signature travels inside the message and still verifies as long as the signed content is left intact.

[DMARC](/glossary/dmarc/) builds on both. It passes when SPF or DKIM passes and the authenticated domain matches the domain in the visible From header, a rule called [alignment](/glossary/dmarc-alignment/). For DKIM, the `d=` domain must match the From domain or be a subdomain of it. Configuring both protocols gives DMARC a second path when one of them fails.

## Common problems with DKIM

Most DKIM failures come from the DNS record rather than the signing. **The record has to sit at the exact selector hostname** the sending service provides. Publishing it under a bare `_domainkey` name, or with a typo in the selector, leaves the receiver nothing to look up. A truncated key value or stray quotes added by a DNS provider break the record too. DNS changes can take up to 48 hours to propagate, so a check run right after publishing may fail even when the record is correct.

Key length is a separate concern. Keys shorter than 1024 bits are considered insecure and some receiving servers reject them, and 2048 bits is the recommended standard.

Changes made after signing are the hardest failures to spot. Mailing list software that appends a footer and anti-virus gateways that rewrite content both invalidate the body hash, so the signature fails even though the sender configured everything correctly.

Key rotation carries its own risk. A new key belongs under a new selector, and signing should switch to it only after that record resolves. Deleting the old record while messages signed with it are still being delivered makes those messages fail verification.

## DKIM in Lettr

**Lettr signs the content and selected headers of each message it sends** with the sending domain's private key and adds the `DKIM-Signature` header before delivery. The selector and public key are unique to each domain and are provided when the domain is added, with a 2048-bit key by default. A selector looks like `scph0722`, which makes the full hostname `scph0722._domainkey.example.com`, and the DKIM record has to be copied exactly as Lettr shows it.

The signature's `d=` tag carries the sending domain, so a message from `hello@example.com` is signed with `d=example.com` and DKIM alignment for DMARC passes without extra configuration. The domain verification endpoint, `POST /api/domains/{domain}/verify`, reports `dkim_status` next to the SPF and DMARC results. A test message sent to a Gmail account confirms signing end to end: its `Authentication-Results` header shows `dkim=pass` with the domain and selector. The [DKIM records page](https://docs.lettr.com/learn/domains/dkim) in the Lettr docs covers the record fields and troubleshooting.
