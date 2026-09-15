---
term: Domain Status
heading: "What is domain status?"
description: "Domain status shows whether a sending domain may send. How approval differs from DNS verification, and what pending, approved and blocked mean in Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [dns, dkim, domain-reputation, acceptable-use-policy]
reading:
  - title: Domains Introduction
    href: https://docs.lettr.com/learn/domains/introduction
  - title: Domain Approval Process
    href: https://docs.lettr.com/learn/domains/approval
  - title: Sending Domains
    href: https://docs.lettr.com/learn/domains/sending-domains
---

**Domain status** is the state an email service provider records for a sending domain to show whether mail from it is allowed to go out. Providers keep it because every domain on shared sending infrastructure affects the reputation of the IP addresses it sends from, so a new domain is screened before it can send. In Lettr, domain status is the approval state of a sending domain, and it takes one of three values: `pending`, `approved` or `blocked`.

## How domain status works

A provider makes two separate decisions about a sending domain. The first is technical: whether the customer controls the domain and has published the records the provider needs in [DNS](/glossary/dns/). The second is a policy decision about **whether the provider is willing to send mail for the domain at all**, and domain status records that decision.

Screening is typically automated and based on risk signals that correlate with abuse. Domain age is one of the strongest, because spammers register domains in bulk and abandon them once they are blocklisted, so a domain registered last week carries far less trust than one with years of history. Naming patterns, the top-level domain and whether the domain hosts a real business website add further evidence.

Screening at the start is not the only control. Providers also enforce an [acceptable use policy](/glossary/acceptable-use-policy/) against accounts that are already sending. Screening new domains is the earlier line of defense, keeping bad actors from degrading delivery for legitimate senders who share the same addresses.

## Domain status vs DNS verification status

The two statuses are independent, and confusing them explains many domains that look ready but cannot send. **DNS verification tracks each record separately**: whether the SPF, [DKIM](/glossary/dkim/), DMARC or CNAME record the provider expects is published and correct. Domain status tracks the provider's approval of the domain as a whole.

A domain can have every record verified and still be unable to send, because approval has not been granted. A domain can also be approved while one of its records is broken, and then its mail fails authentication at the receiving end.
Domain status is also different from [domain reputation](/glossary/domain-reputation/). Reputation is what mailbox providers such as Gmail think of a domain based on the mail they receive from it. Domain status is the sending platform's own decision, made before and apart from any mailbox provider's judgment.

## Common problems with domain status

**Very new domains are one of the most common reasons a domain is not approved.** A domain registered in the last few weeks looks like the throwaway domains used for spam and phishing. A domain with no website content, or only a placeholder page, gives an automated check no evidence of a real business. Uncommon or newer top-level domains carry less inherent trust than established ones.

Naming causes the rest. Long random strings, runs of digits, repeated hyphens and promotional prefixes such as `free-` or `cheap-` match patterns common in spam campaigns and count heavily against a domain.

## Domain status in Lettr

A Lettr sending domain has one of three approval statuses: `pending`, `approved` or `blocked`. Lettr scores each new domain automatically, **starting at 100 points and deducting points for risk signals**: suspicious naming patterns, domain name characteristics such as an uncommon TLD, domain age from a WHOIS lookup and an AI analysis of the associated website. A score from 50 to 100 is approved automatically, while a score below 50 sets the domain to Blocked and flags it for manual review. Pending means scoring is still in progress, which typically finishes within a few minutes.

Only Approved domains can send. A send from a domain that is still pending or has been blocked returns an error saying the domain is not configured or approved for sending. The domain API returns the approval state in `status`, a readable `status_label` (`Pending Review`, `Approved` or `Blocked`) and a `can_send` boolean, while DNS records report their own statuses in fields such as `dkim_status` and `spf_status`.

For a blocked domain, the owner can email support@lettr.com to request a manual review with details about the business and what it plans to send, and the Lettr team can approve the domain manually. The [Domain Approval Process](https://docs.lettr.com/learn/domains/approval) page in the Lettr docs lists every scoring check and its point deduction.
