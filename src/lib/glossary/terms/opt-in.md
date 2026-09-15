---
term: Opt-In
heading: "What is opt-in?"
description: "Opt-in is a recipient's permission to receive email, given through single or double opt-in. How the two differ, what consent laws expect, and Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [single-opt-in, double-opt-in, express-consent, implied-consent, opt-out]
reading:
  - title: Email Consent Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/email-consent
  - title: Double Opt-In
    href: https://docs.lettr.com/learn/audience/double-opt-in
  - title: Subscription Topics
    href: https://docs.lettr.com/learn/audience/topics
---

**Opt-in** is the act of a recipient giving a sender permission to email them, usually by submitting a signup form or ticking a checkbox. It can be single, where the address is subscribed as soon as the form is submitted, or double, where the recipient first confirms by clicking a link in a verification email. Opt-in is the consent model behind most marketing email, and consent laws such as CASL and the GDPR build on it.

## How opt-in works

A signup form collects the address together with the recipient's agreement to receive a described kind of mail. **The agreement has to come from an action the recipient takes**, such as ticking an unticked box or pressing a subscribe button next to a clear description of the emails. A pre-ticked box or a consent line buried in terms of service is not an opt-in.

With [single opt-in](/glossary/single-opt-in/), the address joins the list immediately. With [double opt-in](/glossary/double-opt-in/), the address is held as unconfirmed while a confirmation email goes out, and it joins the list only after the link is clicked. Addresses that never confirm receive nothing further.

Each opt-in is worth recording when it happens: the timestamp, the form or source, the method, the IP address and the exact consent text shown. That record is what lets a sender demonstrate consent later.

## Single vs double opt-in

**Single opt-in converts more signups, and double opt-in produces a cleaner list.** Every address submitted to a single opt-in form is subscribed, typos, fake entries and bot submissions included. Those addresses hard bounce or sit unused, and some of them turn out to be recycled addresses or spam traps that damage reputation.

Double opt-in filters them out, because only a working address whose owner wants the mail can confirm. It loses some genuine signups at the confirmation step, which is the cost of the check. Public forms that anyone can submit benefit most from confirmation, while an in-app toggle for users who verified their address at account creation usually needs no second check.

## Opt-in and consent law

Consent rules differ by jurisdiction. **Canada's CASL requires consent before a commercial email is sent**, either [express consent](/glossary/express-consent/) from an affirmative opt-in or [implied consent](/glossary/implied-consent/) from a relationship, such as a purchase within the last 2 years or an inquiry or application within the last 6 months. Express consent lasts until the recipient withdraws it, while consent implied by a purchase or an inquiry expires.

In the EU, marketing email generally needs consent under the GDPR and the ePrivacy rules, and that consent must be freely given, specific, informed and unambiguous. A narrow soft opt-in lets a sender email existing customers about similar products or services, provided they could refuse when their details were collected and can opt out in every message.

The US CAN-SPAM Act follows an opt-out model instead. It requires no prior consent, only a working unsubscribe mechanism, so CAN-SPAM compliance says nothing about whether mail to Canadian or EU recipients is lawful. Under every model, an [opt-out](/glossary/opt-out/) withdraws the permission to send.

## Opt-in in Lettr

**Lettr's double opt-in flow is API-only** and designed to be wired into the sender's own signup form. The form's server calls `POST /api/audience/contacts` with the visitor's email and a `double_opt_in` block describing the confirmation email. Lettr creates the contact with status `unverified` and sends a confirmation email containing the `{{confirmation_url}}` link, and when the contact clicks it, the status switches to `subscribed`. Unverified contacts are excluded from campaigns until they confirm.

`subscribed` is the default status for newly added contacts, and only contacts with that status are eligible to receive campaigns.

Subscription topics add opt-in at the level of individual categories. A topic's default subscription decides where new contacts start: `opt_in` means every newly added contact is subscribed to the topic automatically, and `opt_out` means new contacts start unsubscribed and have to join the topic themselves. The default applies to manual entry, CSV imports and the API alike, and changing it later only affects contacts added afterwards. The [Double Opt-In](https://docs.lettr.com/learn/audience/double-opt-in) page covers the confirmation template, the verified sending domain and the redirect URL the flow needs.
