---
term: Acceptable Use Policy
fullName: AUP
question: What is
description: "An acceptable use policy sets the rules for what email a sending platform allows. What an AUP covers, how it is enforced, and what Lettr's policy requires."
related: [spam-trap, spam-complaint, suppression-list, sender-reputation, shared-ip]
reading:
  - title: Acceptable Use Policy for Email
    href: https://docs.lettr.com/knowledge-base/compliance/acceptable-use-policy
  - title: Complaints and Unsubscribes
    href: https://docs.lettr.com/learn/suppressions/complaints-unsubscribes
---

**An Acceptable Use Policy (AUP)** is the set of rules an email service provider publishes to define which email its platform permits and which it prohibits. Senders on the same provider share IP addresses and sending infrastructure, so one account that sends spam or phishing damages delivery for every other account on those addresses. The AUP is the agreement that lets the provider act on that risk, up to suspending the account.

## How an acceptable use policy works

An AUP usually has three parts. **The first defines permitted mail**, typically transactional messages such as receipts and password resets, marketing sent with consent, and operational notices. The second lists prohibited content: unsolicited bulk mail, phishing and impersonation, malware, and content that is illegal where the sender or the recipient lives. The third sets sending practices that apply even to permitted mail, such as domain authentication, consent and bounce handling.

Most policies also tie compliance to the law. Commercial email has to meet the rules that apply to its sender and recipients, such as the [CAN-SPAM Act](/glossary/can-spam-act/) in the United States, [GDPR](/glossary/gdpr/) in the EU and CASL in Canada. An AUP makes those legal requirements a condition of using the platform, so a breach of the law is also a breach of the policy.

## Why an AUP matters

**Mailbox providers judge mail by the reputation of the IP addresses and domains that send it.** On a [shared IP](/glossary/shared-ip/), the complaints and bounces of one sender count against every sender on that address. A written policy gives the provider grounds to stop an abusive account before the damage to [sender reputation](/glossary/sender-reputation/) reaches everyone else.

Policy thresholds also track what mailbox providers require. Google requires bulk senders to keep their spam complaint rate below 0.3% and recommends staying below 0.1%, and a platform whose customers exceed those numbers risks filtering for all of its traffic. An AUP turns those external limits into rules each account has to meet.

## Common problems with acceptable use policies

Most violations come from list quality rather than intent. **Purchased, rented or scraped lists** are prohibited under nearly every AUP, and they are also the usual source of [spam traps](/glossary/spam-trap/), invalid addresses and complaints. Old lists carry the same risk, because addresses that have not been mailed in a long time include abandoned mailboxes and recipients who no longer remember signing up.

Transactional mail is not exempt. A receipt or an account alert still has to go to a valid address and must not contain deceptive content, and adding marketing content to it brings in the consent and unsubscribe requirements of commercial email.

Working around suppression is treated as a serious violation. Re-adding an address that hard bounced or filed a complaint removes the protection the [suppression list](/glossary/suppression-list/) exists to provide, for the recipient and for the sender.

## Acceptable use policy in Lettr

Lettr's policy permits transactional, marketing, relationship and operational email, and **prohibits unsolicited mail, purchased or harvested lists, deceptive or fraudulent content, malware and illegal content**. Lists that have not been mailed in over 12 months cannot be used without re-consent. A violation of the prohibited content rules can lead to immediate account suspension without prior notice.

The sending practice requirements are specific. Sending domains must be authenticated, and unauthenticated sending is not permitted. Commercial messages need a working unsubscribe mechanism, accurate sender identification and a physical address. The spam complaint rate has to stay below 0.1%, with a hard limit of 0.3%, and the hard bounce rate below 2%.

Lettr adds hard bounces and spam complaints to the suppression list automatically, and re-adding those addresses to get around suppression is a policy violation. Monitoring covers bounce rate, complaint rate, spam trap hits, sudden volume spikes and content patterns that match phishing or scams. Enforcement depends on severity and ranges from a warning and a temporary sending throttle to a sending suspension, with permanent termination reserved for severe cases such as phishing, malware or repeated violations.

A flagged account receives an email that explains the issue, and reinstatement goes through support@lettr.com once the root cause is fixed. The [Acceptable Use Policy page](https://docs.lettr.com/knowledge-base/compliance/acceptable-use-policy) in the Lettr docs lists the full rules.
