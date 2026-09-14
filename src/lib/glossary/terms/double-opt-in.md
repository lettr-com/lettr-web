---
term: Double Opt-In
question: What is
description: "Double opt-in confirms a new subscriber's address with a click in a confirmation email before they join a list. Trade-offs, consent, and the Lettr API flow."
related: [single-opt-in, opt-in, express-consent, gdpr, list-hygiene]
reading:
  - title: Email Consent Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/email-consent
  - title: GDPR and Email Sending
    href: https://docs.lettr.com/knowledge-base/compliance/gdpr-email
  - title: Double Opt-In in Lettr
    href: https://docs.lettr.com/learn/audience/double-opt-in
---

**Double opt-in** is a signup process in which a new subscriber confirms their email address by clicking a link in a confirmation email before they are added to a mailing list. Submitting the form is the first opt-in, and the click is the second. The extra step proves that the address works and that its owner asked for the mail, and the click itself becomes a record of consent.

## How double opt-in works

The flow starts when someone submits a signup form. **The address is stored as unconfirmed**, together with a unique token, and the sending system immediately emails a confirmation message with a link that carries that token. The confirmation email is short and exists only to get the link clicked: it says what the person signed up for and that they can ignore the message if they did not.

When the recipient clicks, the system checks the token, marks the address as confirmed and sends the browser to a thank-you page. Addresses that are never confirmed receive nothing else. A token works once, so a second click on the same link does not confirm anything again.

The confirmed state is what the mailing list uses. Campaigns and newsletters go only to confirmed addresses, while unconfirmed ones stay out of every send until the click happens.

## Double opt-in vs single opt-in

[Single opt-in](/glossary/single-opt-in/) adds an address to the list the moment the form is submitted, with no confirmation step. **The trade-off is conversion against quality.** Single opt-in converts more signups, because nobody drops out at the confirmation step. Double opt-in typically loses 10 to 30% of signups at that step, and most of those are typos, fake addresses and bot submissions that would have hurt the list anyway.

The quality difference compounds over time. A single opt-in list collects mistyped addresses that hard bounce, addresses entered by someone other than their owner, and recycled or trap addresses that damage reputation. A double opt-in list starts with addresses that are known to work and people who have shown they want the mail, which means fewer bounces and fewer spam complaints.

The choice depends on where contacts come from. Public forms that anyone can submit benefit most from confirmation. Contacts from an in-app toggle for users who already verified their email at account creation, or a list imported from a trusted system, usually do not need a second check.

## Why double opt-in matters

**It is the clearest evidence of consent.** The [GDPR](/glossary/gdpr/) requires a sender to be able to demonstrate that consent was given, and a confirmation click tied to a timestamp is hard to dispute. Consent records are strongest when they also store the signup source, the IP address and the exact text the person agreed to. For EU and Canadian recipients, double opt-in is strongly recommended as proof of [express consent](/glossary/express-consent/).

Deliverability is the other benefit. Invalid addresses never reach the list, so the first campaign does not produce a burst of hard bounces, and recipients who confirmed are less likely to report the mail as spam. That makes double opt-in the first step of [list hygiene](/glossary/list-hygiene/) instead of a cleanup job after the damage.

## Double opt-in in Lettr

Lettr's double opt-in flow is **API-only** and designed to be wired into the sender's own signup form, with no built-in hosted form. The form's server calls `POST /api/audience/contacts` with the visitor's email and a `double_opt_in` block that sets `from`, `from_name`, `subject`, `template_slug` and `redirect_url`. The `from` address has to be on a verified sending domain, or the confirmation email fails to send.

Lettr creates the contact with status `unverified` and a unique confirmation token, then sends a confirmation email using the chosen template, which includes the link through the `{{confirmation_url}}` merge tag. Any `properties` or `list_id` passed in the same call are attached right away. When the contact clicks, Lettr verifies the token, switches the status to `subscribed` and redirects to the `redirect_url`. An already confirmed contact or an invalid token gets an error instead, with no redirect.

Unverified contacts are excluded from campaigns until they confirm, and the status change appears in the contact's activity log. A call without the `double_opt_in` block creates the contact as `subscribed` immediately, which is single opt-in. The [Double Opt-In page](https://docs.lettr.com/learn/audience/double-opt-in) in the Lettr docs covers the confirmation template, the `double_opt_in` fields and best practices for the flow.
