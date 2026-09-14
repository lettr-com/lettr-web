---
term: Express Consent
question: What is
description: "Express consent is an explicit, affirmative opt-in to receive email that stays valid until withdrawn. What makes it valid, how to record it and Lettr's tools."
related: [casl, implied-consent, double-opt-in, gdpr, opt-in]
reading:
  - title: CASL (Canadian Anti-Spam Law)
    href: https://docs.lettr.com/knowledge-base/compliance/casl
  - title: Email Consent Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/email-consent
  - title: Double Opt-In
    href: https://docs.lettr.com/learn/audience/double-opt-in
---

**Express consent** is permission to send commercial email that a recipient gives through a clear, affirmative action, such as ticking an unticked checkbox or confirming a subscription by email. The term comes from Canada's [CASL](/glossary/casl/), where express consent is one of the two legal bases for sending a commercial electronic message. Under CASL it does not expire and stays valid until the recipient withdraws it, which makes it the form of consent a sender wants to hold.

## How express consent works

**The recipient has to act, and has to know what they are agreeing to.** Under CASL, a valid request for express consent discloses who is asking (the person or organization name), why (the purpose of the messages), how to reach the requester (a mailing address plus a phone number, email address or web address) and a statement that the recipient can unsubscribe at any time. The request can be made in writing or orally, but the sender must be able to prove it was given.

Silence and inaction do not count. A pre-checked box, a consent line buried in terms of service or an address collected for another purpose is not express consent, because the recipient did nothing to opt in to the messages.

The [GDPR](/glossary/gdpr/) sets a comparable bar for marketing email sent on the basis of consent. Consent there must be freely given, specific, informed and unambiguous, given through a clear positive action, requested separately for each purpose, and as easy to withdraw as it was to give. A single checkbox that bundles newsletters, partner offers and data sharing fails the specificity test.

## Express consent vs implied consent

CASL also recognizes [implied consent](/glossary/implied-consent/), which arises from a relationship rather than an opt-in. **Implied consent is time-limited**: an existing business relationship supports commercial email for 2 years after the last purchase, contract or transaction, and an inquiry or application for 6 months. An address conspicuously published, for example on a company website, can be emailed about matters relevant to the person's role.

The practical difference is durability. Express consent lasts until withdrawn, while implied consent runs out on a fixed clock, after which the sender can no longer email that person. Senders therefore use the implied consent window to ask for express consent, with a clear opt-in option in each message sent under it.

Other laws draw the line differently. The US CAN-SPAM Act follows an opt-out model and requires no prior consent at all, which is why CAN-SPAM compliance says nothing about whether mail to Canadian or EU recipients is lawful.

## How to record express consent

**The burden of proof sits with the sender.** A sender that cannot show when and how consent was obtained effectively has no valid consent if a regulator or recipient challenges it. A complete record for each address holds:

- **Timestamp:** when consent was given, ideally in ISO 8601 format.
- **Source:** where it was collected, such as the form URL or event name.
- **Method:** how it was collected, such as a checkbox or a double opt-in confirmation click.
- **IP address:** the address of the person who submitted the form.
- **Consent text and form version:** the exact wording shown and the version of the form it appeared on.

[Double opt-in](/glossary/double-opt-in/) gives the strongest evidence, because the confirmation click proves both that the address works and that its owner asked for the mail. Records need to survive as long as the consent is used, and a withdrawal has to be honoured promptly. Under CASL, unsubscribe requests must be processed within 10 business days.

## Express consent in Lettr

**Lettr's double opt-in flow is API-only** and built for a sender's own sign-up form. A call to `POST /api/audience/contacts` with a `double_opt_in` block creates the contact with status `unverified` and sends a confirmation email containing `{{confirmation_url}}`. The contact becomes `subscribed` only after clicking it, and unverified contacts never receive campaigns. The docs describe the flow as a GDPR-friendly way to demonstrate explicit consent.

Contacts added by manual entry start as `subscribed`, and CSV imports use `subscribed` unless a status column is mapped, so a `subscribed` status on its own does not show how consent was obtained. When reviewing an import, Lettr's AI assistant, Adamko, flags a file with no consent signal at all and warns that purchased or scraped lists violate consent requirements.

Subscription topics let consent follow purpose. A topic with an `opt_out` default leaves new contacts unsubscribed until they actively join, while an `opt_in` topic subscribes every new contact automatically. Opt-outs made on the hosted email preferences page suppress sends, with consent re-checked when a campaign's recipients are resolved and again for every batch. The [Email Consent Best Practices](https://docs.lettr.com/knowledge-base/compliance/email-consent) page covers consent forms and record keeping.
