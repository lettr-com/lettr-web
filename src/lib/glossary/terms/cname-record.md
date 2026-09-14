---
term: CNAME Record
question: What is
description: "A CNAME record makes one DNS name an alias of another. How CNAMEs resolve, why they cannot sit at the root domain, and where Lettr uses them."
related: [dns, txt-record, subdomain, tracking-domain, dns-propagation]
reading:
  - title: Sending Domains
    href: https://docs.lettr.com/learn/domains/sending-domains
  - title: Tracking Domains
    href: https://docs.lettr.com/learn/domains/tracking-domains
---

**A CNAME record** (canonical name record) is a DNS record type that creates an alias from one domain name to another. A lookup for the alias returns the target name, and the resolver continues from there to find the target's addresses. Email services use CNAME records to point a subdomain the customer owns at the service's infrastructure, so the service can change its own servers without the customer editing DNS again.

## How CNAME records work

A CNAME record has two parts: the name, which is the alias, and the value, which is the canonical hostname it points to. **The value is always a hostname**, never an IP address or a full URL. A record such as `links.example.com` with the value `proxy.lettr-tracking.com` tells every resolver that asks about `links.example.com` to look up `proxy.lettr-tracking.com` instead.

The resolver follows the alias automatically. A browser asking for the address of `links.example.com` receives the CNAME, looks up the target, and gets the target's A or AAAA records, all in one resolution. The target's operator can change those addresses at any time and every alias follows. Aliases can point to other aliases, but each hop adds a lookup, so records normally point straight at the final hostname.

This is what separates a CNAME from the other records an email setup uses. An A record maps a name directly to an IPv4 address, and a [TXT record](/glossary/txt-record/) holds text that the querying server reads as data, such as an SPF policy or a verification token. A CNAME holds neither: it only redirects the lookup to another name in the [DNS](/glossary/dns/).

## CNAME records and the root domain

**DNS standards do not allow a CNAME record to coexist with other record types at the same name.** A root domain such as `example.com` almost always carries A, AAAA, MX and TXT records, so a CNAME cannot be added there without removing them. Many DNS providers reject a CNAME at the zone apex for this reason.

The same rule applies in the other direction. A name that holds a CNAME cannot also hold its own MX or TXT records, so a hostname used as an alias cannot double as a mail domain.

A [subdomain](/glossary/subdomain/) avoids the conflict entirely. A CNAME at `mail.example.com` or `links.example.com` has no effect on the records at `example.com`, which is why email services ask for CNAME records on subdomains. Some providers, Cloudflare among them, offer CNAME flattening, which resolves the alias at the apex and returns A records instead, but not every provider supports it.

## Common problems with CNAME records

**Proxy features hide the CNAME from the service that checks it.** A DNS provider that proxies traffic answers with its own A records rather than the alias, so a verification looking for the CNAME finds nothing. On Cloudflare the record has to be set to DNS only (grey cloud) for the target to stay visible.

The name field causes the next most frequent errors. Some DNS providers expect only the subdomain part, such as `links`, and append the zone automatically, while others require the full domain. Entering the full name in a provider that appends the zone produces an alias like `links.example.com.example.com`. A second record of another type at the same name also breaks the CNAME.

Timing is the last factor. [DNS propagation](/glossary/dns-propagation/) usually completes within minutes but can take up to 48 hours, so a check run right after publishing can fail even when the record is correct.

## CNAME record in Lettr

**Lettr uses CNAME records for subdomain sending domains, tracking domains and storage domains.** A sending domain on a subdomain needs DKIM, DMARC and a bounce CNAME, while a root domain needs SPF, DKIM and DMARC instead. For root domains the CNAME status is reported as `not_applicable`. The verify endpoint, `POST /api/domains/{domain}/verify`, returns `cname_status` next to `dkim_status`, `dmarc_status` and `spf_status`. A valid CNAME is also what unlocks the Bounce Domain toggle on the domain's settings page.

A [tracking domain](/glossary/tracking-domain/) needs a CNAME record pointing the chosen subdomain, such as `links`, to `proxy.lettr-tracking.com`, and its status reads `pending_cname` until that record verifies. If the record is proxied through Cloudflare, verification fails with a "hostname is returning A records instead of the required CNAME" error. A storage domain, which serves template images and hosted emails, uses a CNAME to `r2-proxy.uselettr.com`.

For domains whose DNS is managed by Cloudflare, Lettr can add the sending and tracking domain records automatically through Domain Connect, with the CNAME records created in DNS only mode. The [Sending Domains](https://docs.lettr.com/learn/domains/sending-domains) and [Tracking Domains](https://docs.lettr.com/learn/domains/tracking-domains) pages in the Lettr docs list each record.
