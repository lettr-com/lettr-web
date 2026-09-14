---
term: Phishing
question: What is
description: "Phishing is email that impersonates a trusted sender to steal data or money. What SPF, DKIM and DMARC stop, what they miss, and Lettr's sending policy."
related: [email-spoofing, dmarc, bimi, acceptable-use-policy, content-filtering]
reading:
  - title: Acceptable Use Policy for Email
    href: https://docs.lettr.com/knowledge-base/compliance/acceptable-use-policy
  - title: DMARC Records
    href: https://docs.lettr.com/learn/domains/dmarc
---

**Phishing** is a social engineering attack in which an email impersonates a trusted sender, such as a bank, a supplier or a colleague, to trick the recipient into revealing credentials, sending money or opening malware. The message copies the sender's name, branding and tone, and typically links to a fake login page or carries a harmful attachment. Legitimate senders deal with phishing from two directions: attackers may abuse their brand, and mailbox providers screen all mail for the patterns phishing leaves.

## How phishing works

A phishing email has to look like it comes from someone the recipient trusts. **Impersonation takes three main forms**, and they differ in how hard they are to stop:

- **Exact-domain spoofing:** the From header uses the real domain, as in `security@bank.com`, without the domain owner's permission.
- **Lookalike domains:** a separately registered domain that resembles the real one, such as `bank-secure.com` or a name with one letter swapped.
- **Display-name spoofing:** a trusted name, such as "Bank Security", placed in front of an unrelated address, relying on clients that show the name and hide the address.

The rest of the message applies pressure: an account about to be locked, an unpaid invoice, a parcel that needs confirming. Spear phishing narrows the attack to one person or team using details gathered in advance, and business email compromise uses a real or impersonated executive or supplier account to request payments.

## What email authentication stops

**[DMARC](/glossary/dmarc/) is the control against exact-domain spoofing.** It checks that a message passing SPF or DKIM is authenticated for the same domain shown in the From header, and a domain with a `p=quarantine` or `p=reject` policy tells receivers to filter or refuse mail that fails. With that policy enforced, an attacker can no longer put the real domain in the From line and reach the inbox. The forgery techniques themselves are covered under [spoofing](/glossary/email-spoofing/).

Authentication has clear limits. A lookalike domain belongs to the attacker, who can publish valid SPF, DKIM and DMARC records for it, so its mail passes every check. Display-name spoofing never uses the protected domain at all. Both are left to receiving-side filters and to recipients checking the actual address.

[BIMI](/glossary/bimi/) adds a visual signal on top of DMARC. A domain with an enforced DMARC policy can have its logo shown next to its messages in supporting mail clients, often backed by a Verified Mark Certificate, and a lookalike domain cannot display the real brand's verified logo.

## Why phishing affects legitimate senders

**Mailbox providers look for phishing patterns in every message**, not only in attacks. [Content filtering](/glossary/content-filtering/) weighs links to unfamiliar domains, URL shorteners, link text that does not match its destination and requests for credentials, so legitimate mail that shares those traits is treated with suspicion. A login link pointing to a domain unrelated to the brand in the From header resembles exactly the attack filters are built to catch.

Sending platforms carry a related risk. Phishing sent through a platform harms the infrastructure other customers send from, which is why providers vet new senders and prohibit phishing in their [acceptable use policy](/glossary/acceptable-use-policy/).

## Phishing in Lettr

**Lettr's Acceptable Use Policy prohibits phishing emails and messages impersonating other organizations**, as well as messages with links to malware distribution or phishing sites. Unauthenticated sending is not permitted.

Lettr monitors sending activity to detect abuse, and one of the monitored signals is content pattern matching for phishing, scam or prohibited content. Enforcement ranges from a warning to a sending suspension, and for severe violations such as phishing or malware the account may be permanently terminated.

Screening also happens before a domain can send. The domain approval process analyses the website associated with a new sending domain, and its red flags include phishing-like content mimicking known brands. For a sender's own domain, the [DMARC Records](https://docs.lettr.com/learn/domains/dmarc) page explains how a DMARC policy instructs receiving servers to quarantine or reject unauthenticated email claiming to come from that domain.
