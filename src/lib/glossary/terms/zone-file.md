---
term: Zone File
heading: "What is a zone file?"
description: "A zone file is the text file that lists every DNS record in a zone, in the master file format from RFC 1035. Its syntax, common mistakes and Lettr records."
published: 2026-09-15
updated: 2026-09-15
related: [dns, zone-apex, domain-connect, dns-propagation, cname-record]
reading:
  - title: Domain Connect
    href: https://docs.lettr.com/learn/domains/domain-connect
  - title: Google Cloud DNS Guide
    href: https://docs.lettr.com/knowledge-base/dns-guides/google-cloud-dns
---

**A zone file** is a plain text file that lists every record in a DNS zone. Its syntax is the master file format defined in RFC 1035. BIND, the long-standing open source nameserver, loads its zones from files in this format, which is why it is often called the BIND format. Most domain owners never open one directly, because DNS hosts keep the same records behind a web panel or an API.

## How a zone file works

A zone file starts with directives that set defaults for the lines after them. **`$ORIGIN` sets the domain that relative names are completed with**, and `$TTL`, added to the format by RFC 2308, sets the time to live for records that do not state their own. The first record is the SOA (start of authority) record at the [zone apex](/glossary/zone-apex/), which names the primary nameserver, the administrator's mailbox and a serial number, followed by the NS records that list the zone's authoritative nameservers.

Every other line is a resource record with five fields: name, TTL, class, type and value. The line `example.com. 3600 IN MX 10 mx1.example.com.` publishes an MX record at `example.com` with a one-hour TTL, the `IN` (internet) class, a priority of 10 and a target server. The TTL and class can be left out, and the defaults then apply. The structure is the same for every record type in [DNS](/glossary/dns/); only the value field changes shape.

Names are either absolute or relative. **A name that ends in a dot is a fully qualified domain name** and is used exactly as written. A name without the final dot is relative, and the nameserver appends the current `$ORIGIN` to it, so in the zone for `example.com` the name `mail` means `mail.example.com.` and `@` stands for the origin itself.

## Zone file vs DNS provider panel

A DNS host's control panel is a front end to the same data. **Many DNS hosts can import and export zones in the master file format**, which makes the file a practical way to move a domain between providers or keep a copy of its records under version control. An imported file carries the old host's SOA and NS records, and the new host replaces them with its own.

## Common problems with zone files

**A value missing its final dot is read as relative.** A CNAME target written as `proxy.example.net` in the `example.com` zone becomes `proxy.example.net.example.com.`, which resolves nowhere. Control panels cause the reverse mistake in the name field: many append the zone automatically, so a full hostname typed there produces `mail.example.com.example.com`, the same doubling that breaks [DKIM selector](/glossary/dkim-selector/) records.

Hand edits on a self-hosted nameserver add one more step. Secondary nameservers compare the SOA serial number to decide whether to fetch a new copy of the zone, so an edit saved without a higher serial stays on the primary server. Any change, by file or by panel, still reaches resolvers only as their cached copies expire, which is [DNS propagation](/glossary/dns-propagation/) and can take up to 48 hours.

## Zone file in Lettr

Setting up a Lettr domain normally means copying its DNS records from the dashboard into the DNS provider's control panel. **Each domain's detail page shows every record the domain needs**, with its type, name and value. The Sending Domains page lists the DMARC record at `_dmarc` and the DKIM record at `{selector}._domainkey`, a tracking domain uses a CNAME at a label such as `links` pointing to `proxy.lettr-tracking.com`, and an inbound domain uses three MX records at priority 10 with `@` as the host for the root domain.

For domains whose DNS is hosted on Cloudflare, [Domain Connect](/glossary/domain-connect/) adds the records to the DNS zone without anyone typing or pasting a value. The **Configure with Cloudflare** button on the domain's detail page leads to a summary of the records that will be added to the zone, and nothing is applied until they are approved. CNAME records are created in DNS only mode, and valid DMARC or SPF records already in place are skipped. Domain Connect covers sending, tracking and inbound domains, so storage domain records are added manually.

The DNS provider guides cover how each panel treats names and trailing dots. In AWS Route 53, pasting the full hostname into the record name field creates a doubled name that fails verification. Google Cloud DNS appends the zone's domain and trailing period to the DNS name field but requires a trailing period added by hand on CNAME and MX target values, while Dynadot and DreamHost handle the trailing period on MX values automatically. The [Google Cloud DNS guide](https://docs.lettr.com/knowledge-base/dns-guides/google-cloud-dns) walks through each record field by field.
