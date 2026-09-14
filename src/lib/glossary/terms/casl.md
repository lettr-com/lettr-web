---
term: CASL
fullName: Canadian Anti-Spam Legislation
question: What is
description: "CASL is Canada's anti-spam law, which requires consent before any commercial email is sent. Express vs implied consent, sender ID rules and CASL in Lettr."
related: [can-spam-act, express-consent, implied-consent, double-opt-in, gdpr]
reading:
  - title: CASL (Canadian Anti-Spam Law)
    href: https://docs.lettr.com/knowledge-base/compliance/casl
  - title: Email Consent Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/email-consent
  - title: Double Opt-In
    href: https://docs.lettr.com/learn/audience/double-opt-in
---

**CASL (Canadian Anti-Spam Legislation)** is a Canadian federal law that took effect on July 1, 2014 and regulates commercial electronic messages (CEMs) sent to or from Canadian computer systems. It applies to any commercial message sent to a recipient in Canada or routed through a Canadian computer system, regardless of where the sender is located. Unlike the US [CAN-SPAM Act](/glossary/can-spam-act/), CASL requires consent before a commercial message is sent, which makes it one of the strictest anti-spam laws in the world.

## How CASL works

A commercial electronic message is any electronic message that encourages participation in a commercial activity. Marketing emails, newsletters that promote products, messages with offers or discounts, and messages that direct recipients to a commercial website all qualify. The law also covers SMS and social media messages, while transactional email is largely exempt. Three regulators share enforcement: the Canadian Radio-television and Telecommunications Commission (CRTC), the Competition Bureau and the Office of the Privacy Commissioner of Canada.

**Every CEM has to meet three requirements.** The sender needs valid consent before sending. The message has to identify the sender by name (or the name of the person on whose behalf it is sent), a mailing address, and a phone number, email address or web URL. It also has to carry an unsubscribe mechanism that is free, easy to use and working for at least 60 days after sending, and unsubscribe requests have to be processed within 10 business days.

Penalties reach $1 million per violation for individuals and $10 million per violation for organizations, and directors and officers can be held personally liable.

## Express vs implied consent

CASL recognizes two types of consent. [Express consent](/glossary/express-consent/) is an affirmative opt-in, and **it does not expire** until the recipient withdraws it. A valid request discloses who is asking, why, how to contact the requester, and that the recipient can unsubscribe at any time. A pre-checked box does not count, because the recipient has to take the action.

[Implied consent](/glossary/implied-consent/) arises from certain relationships without an explicit opt-in, and it is time-limited:

- **Existing business relationship:** 2 years from the last purchase, contract or transaction.
- **Inquiry or application:** 6 months from the inquiry or application.
- **Conspicuous publication:** an address listed on a business website or directory, with no fixed expiry, as long as the message is relevant to the recipient's role.

Implied consent works best as a window for asking the recipient for express consent, with an opt-in option in every message sent under it.

## Common problems with CASL

**The burden of proof sits with the sender.** A sender that cannot show valid consent at the time of sending is presumed non-compliant, so missing timestamps, form versions or disclosure text turn a legitimate list into a liability.

Implied consent causes the next most common failures. It expires 2 years after the last transaction or 6 months after an inquiry, and a recipient who has not given express consent by then can no longer be emailed. Purchased lists almost never include valid CASL consent, and mailing them is a direct violation.

Two assumptions also cause trouble. CAN-SPAM compliance does not cover Canada, since one law is opt-out and the other opt-in. A message with valid consent and a working unsubscribe link still breaks the law if it lacks sender identification, which counts as a separate violation.

## CASL in Lettr

**An unsubscribe link marked with `data-msys-unsubscribe="1"` is processed by Lettr immediately**, which is well within CASL's 10 business day limit. The click adds the address to the suppression list and fires an `unsubscribe.link_unsubscribe` webhook event. Click tracking must be enabled for that event to be generated.

For consent records, the docs recommend storing the date and time of consent, the method, the exact disclosure text and the source. That context can travel with each send in the request's `metadata` object, for example a consent type, date and source. Metadata values must be strings, and the object appears in webhook payloads and the dashboard.

The [double opt-in](/glossary/double-opt-in/) flow gives the strongest evidence of express consent. It is API-only: a call to `POST /api/audience/contacts` with a `double_opt_in` block creates a contact with status `unverified` and sends a confirmation email containing `{{confirmation_url}}`. The contact becomes `subscribed` only after clicking that link, and unverified contacts never receive campaigns. Topic changes made through the API are logged as Topic opted in and Topic opted out events, which keeps each contact's consent history complete. The [CASL page](https://docs.lettr.com/knowledge-base/compliance/casl) in the Lettr docs compares CASL with CAN-SPAM and GDPR.
