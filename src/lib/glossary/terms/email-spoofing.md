---
term: Spoofing
question: What is
description: "Email spoofing forges the sender address so a message appears to come from someone else. How spoofing works, how DMARC stops it, and Lettr's safeguards."
related: [phishing, dmarc, bimi, from-header, dkim]
reading:
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
  - title: DMARC Records
    href: https://docs.lettr.com/learn/domains/dmarc
  - title: Acceptable Use Policy for Email
    href: https://docs.lettr.com/knowledge-base/compliance/acceptable-use-policy
---

**Spoofing** is the forging of sender information in an email so that a message appears to come from a domain or address the sender does not control. SMTP was designed without any check on the addresses a client claims, so any server can put any domain in the envelope and in the From header. Spoofing is the delivery method behind most [phishing](/glossary/phishing/) and business email compromise, and email authentication exists largely to stop it.

## How email spoofing works

An email carries sender identities in several places, and **each can be forged independently**:

- **From header:** the address shown in the mail client, and the most common target, since the [From header](/glossary/from-header/) is what recipients read.
- **Envelope sender:** the `MAIL FROM` address that receives bounces, which recipients rarely see.
- **Display name:** the name in front of the address, such as "IT Support", which can be set to anything without touching a domain.
- **Reply-To:** a separate reply address that routes answers to the attacker while the From line looks legitimate.

Attacks fall into three patterns. Exact-domain spoofing puts the real domain, as in `billing@example.com`, into the From header. Lookalike spoofing uses a separately registered domain that resembles the real one, and display-name spoofing pairs a trusted name with an unrelated address, relying on clients that show only the name. Authentication handles the three very differently.

## How authentication stops spoofing

SPF lets a domain list the servers allowed to send for it, and [DKIM](/glossary/dkim/) lets it sign messages with a key only it holds. **Neither check looks at the From header on its own.** SPF validates the envelope domain and DKIM validates the signing domain, so a forger can pass both for a domain the forger owns while displaying a different domain to the recipient.

[DMARC](/glossary/dmarc/) ties the checks to the visible sender. A message passes DMARC only when SPF or DKIM passes for a domain that aligns with the From header domain, and the domain's policy tells receivers what to do with failures: `p=none` only reports, `p=quarantine` sends failing mail to spam and `p=reject` refuses it. With an enforced policy, exact-domain spoofing of that domain stops reaching inboxes at receivers that apply DMARC. Aggregate reports sent to the `rua` address show which servers send mail using the domain, which reveals spoofing attempts as well as forgotten legitimate services.

Lookalike and display-name spoofing are outside DMARC's reach, because the attacker owns the lookalike domain or never uses the protected one. [BIMI](/glossary/bimi/) gives recipients a visual cue instead: a domain with an enforced DMARC policy can show its verified logo in supporting mail clients, which a lookalike domain cannot copy.

## Why spoofing matters for legitimate senders

**A spoofed brand loses trust through mail it never sent.** Recipients who receive fraudulent messages under a company's name grow wary of its real messages, and mailbox providers that see unauthenticated mail claiming a domain have reason to scrutinise everything from it.

Enforcement is the protection, and it needs a careful rollout. Every legitimate source of mail for the domain, including marketing tools, help desks and billing systems, has to pass SPF or DKIM with alignment before `p=reject` is published, which is why rollouts start at `p=none` and read the reports first.

## Spoofing in Lettr

**Lettr sends only from verified sending domains.** The `from` address of a send request must be on a verified domain, and a sender domain that is not configured or approved for sending is rejected with a `400` error and the code `unconfigured_domain`. The SMTP relay validates the `From:` header address against verified sending domains, and a message from an unverified domain is rejected when the client sends the message body.

New sending domains also pass through automated approval scoring before they can send, and a domain scoring below 50 is blocked and flagged for manual review. Lettr's Acceptable Use Policy prohibits phishing emails, messages impersonating other organizations and emails with false or misleading header information, and states that unauthenticated sending is not permitted.

For a sender's own domain, the DMARC Records page describes DMARC as the layer that instructs receiving servers to quarantine or reject unauthenticated email claiming to come from that domain. It recommends starting with `p=none`, reviewing the reports and moving to enforcement gradually, and it explains that subdomains inherit the parent policy unless `sp=` sets a different one. Lettr signs emails with the sending domain, which keeps DKIM aligned with the From domain. The [DMARC Records](https://docs.lettr.com/learn/domains/dmarc) page covers each policy stage and the report addresses.
