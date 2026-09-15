---
term: GDPR
fullName: General Data Protection Regulation
heading: "What is GDPR?"
description: "GDPR is the EU law on personal data, and an email address counts. Lawful bases, consent rules, recipient rights, and how Lettr acts as a data processor."
published: 2026-09-14
updated: 2026-09-14
related: [data-processing-agreement, express-consent, double-opt-in, data-minimization, casl]
reading:
  - title: GDPR and Email Sending
    href: https://docs.lettr.com/knowledge-base/compliance/gdpr-email
  - title: Data Privacy and Metadata
    href: https://docs.lettr.com/knowledge-base/compliance/data-privacy-metadata
  - title: Double Opt-In
    href: https://docs.lettr.com/learn/audience/double-opt-in
---

**GDPR (General Data Protection Regulation)** is the European Union's data protection law, in force since 25 May 2018. It governs how organizations collect, store and use personal data about people in the EU and the European Economic Area, wherever the organization itself is based. An email address is personal data, so sending email to a recipient in the EU or EEA, tracking what they do with it and keeping the delivery logs all count as processing under the regulation.

## How GDPR applies to email

**Every processing activity needs a lawful basis.** Article 6 lists six, and three of them cover almost all email. Consent is the usual basis for newsletters and promotional campaigns. Contractual necessity covers mail required to deliver a service the recipient signed up for, such as order confirmations, shipping notices and invoices. Legitimate interest can cover some relationship mail, such as account security alerts, but only after a balancing test against the recipient's rights.

The basis applies to more than the send itself. Collecting the address, storing it on a list, recording opens and clicks and keeping delivery history are all processing, and each belongs in the privacy notice shown where the address is collected.

Transactional email is not exempt, unlike under the US CAN-SPAM Act, although its basis is usually contractual necessity.

## Consent under GDPR

Consent for marketing email has to be freely given, specific, informed and unambiguous. **A pre-ticked box, silence or inactivity does not count**, because the person has to take a clear positive action. Consent is also requested per purpose, so one checkbox that bundles a newsletter, partner offers and data sharing fails the specificity test.

Withdrawing consent must be as easy as giving it, which in practice means a working unsubscribe link in every marketing message. The sender carries the burden of proof, so a consent record holds the timestamp, the source such as the form URL, the IP address and the exact text the person agreed to. [Double opt-in](/glossary/double-opt-in/) produces the strongest record, because the confirmation click shows both that the address works and that its owner asked for the mail.

Canada's [CASL](/glossary/casl/) accepts time-limited implied consent for some relationships, and the GDPR has no equivalent for marketing consent. Consent given under the GDPR, like [express consent](/glossary/express-consent/) under CASL, does not expire on a fixed clock, although regulators expect it to be refreshed when there is no ongoing relationship.

## Recipient rights and penalties

The GDPR gives each recipient rights over their data. **The right to object to direct marketing is absolute**: once someone objects, marketing mail stops, with no balancing test. The right of access entitles a person to a copy of their data, including sending history and engagement data, and the right to erasure lets them ask for deletion. Requests have to be answered within one month.

Erasure and suppression work together. Keeping the bare email address on a suppression list after an erasure request is permitted, because without it the address could be imported and mailed again. Retention is a separate duty tied to [data minimization](/glossary/data-minimization/): a sender defines how long it keeps recipient data, delivery logs and engagement events, and deletes what it no longer needs.

Enforcement sits with the national data protection authority in each member state. The most serious infringements carry fines of up to EUR 20 million or 4% of worldwide annual turnover, whichever is higher.

## GDPR in Lettr

**Lettr acts as a data processor** for email sent through it, and the customer remains the data controller responsible for lawful processing. The personal data Lettr processes on the customer's behalf covers recipient email addresses, email content, delivery and engagement events such as opens, clicks and bounces, and any custom data passed in the `metadata` parameter. As controller, the customer decides what data is collected, secures the lawful basis and responds to data subject requests, while Lettr processes data according to the customer's instructions.

The docs list maintaining a [data processing agreement](/glossary/data-processing-agreement/) as a responsibility of both parties and direct customers without one to request it from support@lettr.com. Much of the data needed to answer an access request can be retrieved from the Lettr dashboard or API.

The docs advise against placing sensitive personal data, such as health data, financial account numbers or government IDs, in `substitution_data` or `metadata`. Opaque identifiers work instead: a `customer_id` such as `usr_48291` in metadata, resolved to a name in the customer's own systems. For consent, Lettr's double opt-in flow is API-only and keeps a new contact at status `unverified` until they click the confirmation link, which the docs describe as a GDPR-friendly way to demonstrate explicit consent. The [GDPR and Email Sending](https://docs.lettr.com/knowledge-base/compliance/gdpr-email) page covers lawful bases, data subject rights and erasure requests.
