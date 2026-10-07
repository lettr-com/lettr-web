---
term: TXT Record
heading: "What is a TXT record?"
description: "A TXT record is a DNS record that holds text, used in email to publish SPF, DMARC and BIMI policies and domain verification tokens. Common errors and Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [spf, dmarc, cname-record, dns, bimi]
reading:
  - title: SPF Records
    href: https://docs.lettr.com/learn/domains/spf
  - title: Sending Domains
    href: https://docs.lettr.com/learn/domains/sending-domains
---

**A TXT record** is a type of DNS record that stores arbitrary text at a domain name. It was defined as a general-purpose record in the original [DNS](/glossary/dns/) specification, and email standards later adopted it as the place to publish policies that receiving servers look up. A mail server evaluating a message queries the TXT records at a known name and parses the text according to the standard it is applying.

## How TXT records work

A TXT record has a name, such as `example.com` or `_dmarc.example.com`, and a value made of one or more strings of text. **DNS itself never interprets the text**, so the meaning comes from the application that reads it. Email standards therefore begin the value with a version tag, such as `v=spf1` or `v=DMARC1`, which lets a reader pick its own record out of the others at the same name.

A single name can hold several TXT records. That is normal at a root domain, which often carries a policy next to verification tokens for several services, and a lookup returns all of them for the reader to filter. Standards that need a dedicated location use names with an underscore label, such as `_dmarc`, which cannot clash with ordinary hostnames.

Each string inside a TXT record is limited to 255 characters. A longer value is split into several quoted strings within the same record, and the reading application joins them back together. Many DNS providers split long values automatically, and some expect them entered already split and quoted.

## Why TXT records matter for email

- **SPF:** a record starting `v=spf1` lists the servers allowed to send mail for the domain, and [SPF](/glossary/spf/) permits only one such record per name.
- **DMARC:** a record at `_dmarc.example.com` starting `v=DMARC1` tells receivers how to handle mail that fails [DMARC](/glossary/dmarc/) checks and where to send reports.
- **BIMI:** a record at `default._bimi.example.com` starting `v=BIMI1` points to the logo, and optionally the certificate, that [BIMI](/glossary/bimi/) displays.
- **Verification tokens:** mailbox tools and service providers ask for a TXT record with a unique value to prove control of a domain.

## TXT record vs CNAME record

A [CNAME record](/glossary/cname-record/) is an alias that sends the lookup on to another name, while a TXT record answers the lookup with data. **A CNAME cannot share its name with any other record**, so a hostname that already holds a CNAME cannot also hold a TXT record.

Services choose between the two for a reason. A TXT value lives in the customer's DNS, so changing it means editing DNS again. A CNAME hands the answer to a name the service controls, which lets the service change the underlying records on its own side.

## Common problems with TXT records

**Most TXT failures come from formatting mistakes.** A second `v=spf1` record at the same name makes SPF evaluation fail, so the entries for several sending services are merged into one record. Quoting varies between DNS providers: some add quotes automatically and others require them, and a value pasted with extra or missing quotes is stored incorrectly.

The name field causes the rest. A provider that appends the zone to every name turns `_dmarc.example.com` into `_dmarc.example.com.example.com` when the full name is entered, and the receiver then finds nothing at the name it queries. New records also take time to appear everywhere, so a lookup run immediately after publishing can fail even when the record is correct.

## TXT record in Lettr

**Lettr's DNS instructions depend on the kind of sending domain.** A root sending domain needs SPF, DKIM and DMARC records, while a subdomain needs DKIM, DMARC and a bounce CNAME. The DMARC record is a TXT record named `_dmarc` with the starting value `v=DMARC1; p=none; rua=mailto:dmarc@example.com`. The SPF docs note that a domain can have only one SPF record and that multiple services must be merged into a single TXT record.

The verification endpoint, `POST /api/domains/{domain}/verify`, returns `spf_status` and `dmarc_status` next to `dkim_status` and `cname_status`. Verification can take up to 48 hours. BIMI uses a TXT record at `default._bimi` and is configured entirely through DNS, with no BIMI configuration in the Lettr dashboard or API.

Lettr's DNS provider guides cover the formatting quirks. AWS Route 53 requires TXT values to be enclosed in double quotes, and several values for the same name go on separate lines of one record set. Google Cloud DNS does not split values longer than 255 characters automatically, so they are entered as quoted 255-character segments in a single record. The [Sending Domains](https://docs.lettr.com/learn/domains/sending-domains) page lists the records each domain type needs.
