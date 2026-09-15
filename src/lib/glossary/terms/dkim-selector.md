---
term: DKIM Selector
question: What is
description: "A DKIM selector names which public key verifies a DKIM signature, so one domain can publish several keys. How selectors work, rotation, and selectors in Lettr."
related: [dkim, dns, dns-propagation, dmarc-alignment, key-rotation]
reading:
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
  - title: DKIM records in Lettr
    href: https://docs.lettr.com/learn/domains/dkim
---

**A DKIM selector** is the label that tells a receiving server which public key to use when it verifies a [DKIM](/glossary/dkim/) signature. The selector travels in the `s=` tag of the `DKIM-Signature` header, and the receiver combines it with the signing domain to find the key in DNS at `selector._domainkey.example.com`. Because each key lives under its own selector, one domain can publish several keys at the same time.

## How a DKIM selector works

A signed message carries two tags that together point to its key. **The `d=` tag names the signing domain and the `s=` tag names the selector.** A signature with `d=example.com; s=scph0722` tells the receiver to look up `scph0722._domainkey.example.com`. The `_domainkey` label is fixed by the DKIM standard, while the selector in front of it is chosen by whoever signs the mail.

The receiver queries [DNS](/glossary/dns/) for that name and reads the record it finds: the key version (`v=DKIM1`), the key type (`k=rsa`) and the base64-encoded public key (`p=`). It uses that key to check the signature. A record with an empty `p=` value tells receivers the key has been revoked.

Receivers cannot list the selectors a domain has published. They only ever look up the one named in the signature, so a key published under any other name is invisible to them. Selector values are arbitrary labels, and providers use everything from short codes to date-based names.

## Why DKIM selectors matter

**Selectors let several senders sign for the same domain without conflict.** A company can send internal mail through its workspace provider, transactional mail through an email API and newsletters through a marketing tool, and each service signs with its own private key under its own selector. None of them needs access to another's key.

Selectors also make key rotation safe. A new key is published under a new selector first, signing switches to it once that record resolves, and the old record stays in DNS until messages signed with the old key have been delivered and checked. Replacing a key in place under the same selector would break verification for any message still in transit.

The selector plays no part in [DMARC alignment](/glossary/dmarc-alignment/). Alignment compares the `d=` domain with the visible From domain, so changing or adding selectors has no effect on whether DKIM aligns.

## Common problems with DKIM selectors

Most selector failures are publishing mistakes. **A record published under a bare `_domainkey` name, or with a typo in the selector**, leaves the receiver nothing to find, and the signature fails even though the key itself is correct. Many DNS control panels append the zone name automatically, so entering the full hostname in the name field produces `scph0722._domainkey.example.com.example.com`. Some DNS providers do not accept record names that start with an underscore at all, which blocks both `_domainkey` and `_dmarc` records unless an advanced editing mode allows them.

Rotation causes the rest. Deleting the old selector's record while mail signed with it is still being delivered makes those messages fail verification. Checking too early causes false alarms, because [DNS propagation](/glossary/dns-propagation/) can take up to 48 hours, so a lookup run right after publishing may not see a record that is correct.

## DKIM selector in Lettr

**The selector and public key are unique to each Lettr domain** and are provided when the domain is added. A selector looks like `scph0722`, which makes the full hostname `scph0722._domainkey.example.com`, and the values have to be copied exactly as shown. A domain created with `POST /api/domains` returns them in a `dkim` object with `public`, `selector` and `headers` fields, where `headers` is `from:to:subject:date`.

Messages sent through Lettr carry a `DKIM-Signature` header with `d=` set to the sending domain, `s=` set to the domain's selector and `h=from:to:subject:date`. Lettr generates the key and signs every message, so the only thing a sender publishes is the DNS record. The domain verification endpoint, `POST /api/domains/{domain}/verify`, reports `dkim_status`, one of `valid`, `unverified`, `invalid`, `missing` or `not_applicable`.

A test message sent to a Gmail account confirms the selector end to end: its `Authentication-Results` header shows `dkim=pass header.d=example.com header.s=scph0722`. The [DKIM records page](https://docs.lettr.com/learn/domains/dkim) in the Lettr docs lists the troubleshooting steps for a record that does not verify.
