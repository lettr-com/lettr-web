---
term: Single Opt-In
question: What is
description: "Single opt-in adds a subscriber to an email list as soon as they submit a signup form, with no confirmation email. Trade-offs, consent, and Lettr."
related: [double-opt-in, opt-in, express-consent, list-hygiene, gdpr]
reading:
  - title: Email Consent Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/email-consent
  - title: Contacts
    href: https://docs.lettr.com/learn/audience/contacts
  - title: Double Opt-In
    href: https://docs.lettr.com/learn/audience/double-opt-in
---

**Single opt-in** is a signup method in which an email address joins a mailing list the moment its owner submits a form or ticks a box, without a confirmation step. It is the simplest form of [opt-in](/glossary/opt-in/): the submission itself counts as the request to receive mail. The first message the subscriber gets is a welcome email or a regular send, not a confirmation link.

## How single opt-in works

The form posts an address to the application, which stores it as an active subscriber and makes it eligible for the next send. **Nothing checks that the address works or belongs to the person who typed it.** A format check in the form catches obvious typos, but a misspelled domain, someone else's address or a bot submission all go straight onto the list.

The consent record is correspondingly thin. What remains is the fact of the submission, ideally stored with a timestamp, the form or page it came from, the IP address and the exact wording shown next to the field. That evidence exists only if the sender's own systems log it.

## Single opt-in vs double opt-in

[Double opt-in](/glossary/double-opt-in/) sends a confirmation email and adds the address only after a click. **The trade-off is list growth against list quality.** Single opt-in converts more signups because nobody drops out at the confirmation step, while double opt-in commonly loses 10 to 30% of signups there. Many of those lost signups were typos, fake addresses and bots, so the gap in growth partly reflects the gap in quality.

The right choice depends on what the sender already knows about the address:

- **Public forms:** anyone can submit anything, so confirmation earns its cost.
- **Verified users:** a newsletter toggle inside an app, for accounts whose email was confirmed at registration, gains little from a second check.
- **Imports from trusted systems:** contacts already verified upstream do not need to confirm again, although the consent behind them still has to be real.

## Common problems with single opt-in

**Invalid addresses become hard bounces.** Typos such as `gmial.com` and addresses that never existed fail on the first send, which raises the bounce rate and weighs on the reputation of the whole list. Some misspelled domains are run as typo spam traps, which makes the damage worse.

Unwanted signups produce complaints. A person subscribed by someone else, or by a bot filling forms with real addresses, never asked for the mail and is likely to report it as spam.

Consent is harder to demonstrate. The GDPR requires a sender to be able to show that consent was given, and a bare form submission is weaker evidence than a confirmation click, although a clearly worded form can still collect [express consent](/glossary/express-consent/). [List hygiene](/glossary/list-hygiene/) matters more on single opt-in lists as a result, since bounce handling, complaint suppression and removal of inactive subscribers do the filtering that confirmation would have done at signup.

## Single opt-in in Lettr

**Single opt-in is the default path into a Lettr audience.** `subscribed` is the default status for newly added contacts, and only `subscribed` contacts are eligible to receive campaigns. A `POST /api/audience/contacts` call without the `double_opt_in` block creates the contact as `subscribed` immediately, which the docs call single opt-in. Contacts added manually also start as `subscribed`, and a CSV import brings contacts in as `subscribed` unless a column is mapped to status.

The `unverified` status marks contacts created through double opt-in who have not confirmed yet, and Lettr's double opt-in flow is API-only, with no built-in hosted signup form. New contacts are also subscribed automatically to every topic whose default is `opt_in`, on every creation path: manual entry, CSV import and the API. A topic set to `opt_out` requires contacts to join it themselves.

For imports, Adamko, Lettr's AI assistant, can review a sample of the file for invalid addresses and duplicates, and warns plainly when the file contains no consent signal. The Double Opt-In page compares the two methods: single opt-in brings a higher conversion rate but lower audience quality and a weaker GDPR posture, and for most public signup forms the docs consider double opt-in worth the conversion cost. The [Email Consent Best Practices](https://docs.lettr.com/knowledge-base/compliance/email-consent) guide covers what a consent record should store.
