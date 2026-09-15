---
term: Implied Consent
heading: "What is implied consent?"
description: "Implied consent lets a sender email people it has a business relationship with, for a limited time, under CASL. How long it lasts and tracking it in Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [express-consent, casl, gdpr, double-opt-in, can-spam-act]
reading:
  - title: CASL (Canadian Anti-Spam Law)
    href: https://docs.lettr.com/knowledge-base/compliance/casl
  - title: Email Consent Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/email-consent
  - title: Contacts
    href: https://docs.lettr.com/learn/audience/contacts
---

**Implied consent** is permission to send commercial email that the law infers from an existing relationship, without the recipient having explicitly opted in. The term is defined in Canada's [CASL](/glossary/casl/), which requires either express or implied consent before a commercial electronic message is sent to a Canadian recipient. Implied consent is time-limited, so it serves as a window for turning a customer or prospect into someone who has given [express consent](/glossary/express-consent/).

## How implied consent works

CASL recognizes several relationships that imply consent. **Three forms matter most for email, and two of them run on a fixed clock:**

- **Purchase or contract:** an existing business relationship lasts 2 years from the recipient's last purchase, contract or transaction with the sender, so a customer who bought something 18 months ago is still inside the window.
- **Inquiry or application:** a prospect who asked about a product or applied for something, for example through a contact form, gives implied consent for 6 months from that inquiry.
- **Conspicuous publication:** an address published on a business website or in a directory, with no fixed expiry, but only for messages relevant to the person's role.

The business relationship window is measured from the last transaction, not the first. A customer who buys again starts a new 2-year period from that purchase, so the date to record is the most recent one.

**The burden of proof sits with the sender.** A sender relying on implied consent has to be able to show the relationship and its date if challenged, and once the window closes it needs express consent to keep emailing that person. CASL's maximum penalties reach $10 million per violation for organizations.

## Implied consent vs express consent

Express consent comes from an affirmative act, such as ticking an unticked checkbox or confirming a subscription, and stays valid until the recipient withdraws it. Implied consent comes from a relationship and ends on its own schedule.

**Senders use implied consent as a bridge.** Every message sent under it carries a clear way to opt in, so recipients who want to keep hearing from the sender convert before the deadline, and those who do not simply age out of the list.

Purely transactional messages, such as receipts and account notices, are largely exempt from CASL's consent requirement, so the distinction matters for marketing and other commercial mail.

## Implied consent under other laws

**The GDPR has no equivalent for marketing consent.** Consent under the [GDPR](/glossary/gdpr/) has to be explicit, and a purchase history on its own does not supply it. For existing customers in Europe, senders look instead at the soft opt-in that the EU ePrivacy Directive and the UK's PECR allow for marketing similar products or services, on condition that the recipient could refuse at collection and can opt out in every message.

The US [CAN-SPAM Act](/glossary/can-spam-act/) takes a different approach again. It requires no prior consent at all, only a working opt-out, so the difference between implied and express consent carries no legal weight there. CASL still applies to messages sent to Canadian recipients regardless of where the sender is located, which is why a list that mixes countries is managed to the strictest rule.

## Implied consent in Lettr

**None of Lettr's five contact statuses records the basis of consent.** A contact is `subscribed`, `unsubscribed`, `bounced`, `complained` or `unverified`, and `subscribed` is the default for newly added contacts. The dates behind an implied consent window can be kept as contact properties instead: the `date` property type is intended for values such as sign-up dates and last purchase dates. Segments filter date properties with `before` and `after` conditions against a given date, and segment membership updates automatically as contact data changes.

For individual API sends, the CASL guide's example records `consent_type`, `consent_date` and `consent_source` in the request's `metadata`, next to the recommendation to store the date, method, disclosure text and source of consent. Converting implied consent to express consent can use Lettr's [double opt-in](/glossary/double-opt-in/) flow, which is API-only: a new contact stays `unverified`, and excluded from campaigns, until they click the link in the confirmation email. The [CASL page](https://docs.lettr.com/knowledge-base/compliance/casl) in the Lettr docs lists the implied consent durations and compares CASL with CAN-SPAM and the GDPR.
