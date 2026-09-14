---
term: DNS Propagation
question: What is
description: "DNS propagation is the delay before a DNS change reaches every resolver, caused by cached records. Why it happens, how to plan for it, and Lettr verification."
related: [dns, mx-record, dkim-selector, domain-connect, cname-record]
reading:
  - title: Domain Verification Failures
    href: https://docs.lettr.com/knowledge-base/troubleshooting/domain-verification
  - title: Sending Domains
    href: https://docs.lettr.com/learn/domains/sending-domains
  - title: Domain Connect
    href: https://docs.lettr.com/learn/domains/domain-connect
---

**DNS propagation** is the period between a change to a domain's DNS records and the moment every resolver on the internet returns the new value. Despite the name, nothing is pushed outward. Resolvers keep cached copies of records and fetch fresh ones only when those copies expire, so for a while some lookups return the old record, some return the new one and some return nothing. That is why a record can verify from one network and fail from another in the same hour.

## How DNS propagation works

A change takes effect at the domain's authoritative nameservers as soon as the DNS provider publishes it. **What delays it everywhere else is caching.** Every record carries a TTL (time to live) in seconds, and a resolver that fetched the old record keeps answering with it until that TTL runs out. A resolver that has never looked up the name sees the new value straight away.

Two cases take longer than the record's own TTL suggests. A lookup that found no record is cached as well, for a period set in the zone's SOA record, so querying a hostname before its record exists can delay the new record for resolvers that asked too early. Changing a domain's nameservers is slower still, because the delegation records at the top-level domain carry long TTLs, commonly 48 hours for `.com`.

The widely quoted upper bound for propagation is 48 hours. Most individual record changes are visible much sooner, and the actual wait depends on the TTL values involved and on when each resolver last looked.

## Why DNS propagation matters for email

The sending platform that verifies a domain sees whatever its own resolvers return, so **a verification run straight after publishing can fail even when the record is correct**. Receiving mail servers see the same inconsistency, which matters most for authentication records. A new SPF include or a [DKIM selector](/glossary/dkim-selector/) that some receivers cannot resolve yet causes authentication failures for part of the mail sent during the window.

Mail routing is exposed too. When a domain's [MX records](/glossary/mx-record/) move to new servers, some senders keep delivering to the old servers until their cached records expire. The old servers therefore need to keep accepting mail until the previous TTL has passed.

## How to work with DNS propagation

**Lowering the TTL ahead of a planned change** shortens the window. Dropping it to a few minutes a day before a migration means resolvers pick up the new value quickly, and the TTL can go back up once the change has settled. The old value's TTL is what counts, so lowering it at the same moment as the change does not help.

Checking the source separates propagation from mistakes. A `dig` query sent directly to the domain's authoritative nameserver shows what the provider is serving. If that server already returns the correct record, the remaining work is waiting. If it returns nothing or the wrong value, the record was created incorrectly, and no amount of waiting will fix it. A record that is still not visible after 48 hours points to a configuration problem, not propagation.

Repeated edits make things worse. Deleting and recreating a record while resolvers are still caching earlier versions produces a mix of answers that is hard to diagnose. Proxy features can also mimic a propagation delay: Cloudflare's proxy mode rewrites DNS responses, so a proxied [CNAME record](/glossary/cname-record/) fails verification however long it has been published.

## DNS propagation in Lettr

The Lettr docs state that **domain verification can take up to 48 hours** because of DNS propagation. A failed check can simply be run again: the **Verify** action in the dashboard or `POST /api/domains/{domain}/verify` re-checks the records and returns a status for each one, such as `dkim_status` and `dmarc_status`, with values including `valid`, `invalid` and `missing`.

With [Domain Connect](/glossary/domain-connect/) on Cloudflare, if verification fails immediately after the records are applied, the docs advise waiting a minute or two and trying again, because Cloudflare applies records instantly but external DNS queries can take a short time to see them.

Waiting on DNS does not have to block development. A sandbox API key sends from a pre-verified sandbox domain to the account's own inbox, so an integration can be tested before propagation or domain approval completes. Adamko, Lettr's AI assistant, can diagnose a record that will not validate with live DNS lookups. The [Domain Verification Failures](https://docs.lettr.com/knowledge-base/troubleshooting/domain-verification) page in the Lettr docs lists the checks to run before verifying again.
