---
term: Preference Center
question: What is
description: "A preference center is a page where recipients choose which emails they get instead of leaving entirely. How it works and Lettr's hosted preferences page."
related: [opt-out, list-unsubscribe, one-click-unsubscribe, sunset-policy, suppression-list]
reading:
  - title: Unsubscribe Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/unsubscribe-best-practices
  - title: Email Preferences Page
    href: https://docs.lettr.com/learn/audience/email-preferences
  - title: Subscription Topics
    href: https://docs.lettr.com/learn/audience/topics
---

**A preference center** is a web page where recipients manage which emails they receive from a sender, instead of choosing only between staying subscribed and leaving entirely. It typically lists subscription categories, such as product updates or a weekly digest, and may offer a temporary pause next to a full unsubscribe. The unsubscribe link in a marketing email usually leads to it.

## How a preference center works

**Each recipient reaches the page through a link unique to them**, so the page can show their current choices without a login. The recipient ticks or unticks categories and saves, and the sender's system updates the subscriptions that every later send reads. A campaign for a category then goes only to recipients who still hold it.

A full unsubscribe stays on the same page. Regulations require that a recipient can [opt out](/glossary/opt-out/) of all commercial email, not only individual categories, so a page offering only topic choices is not enough on its own.

Many preference centers also ask for a reason when someone leaves, and some list recent emails so the recipient can recognise what they are subscribed to. Both give the sender information that an unsubscribe count lacks.

## Preference center vs full unsubscribe

**A preference center turns some unsubscribes into partial ones.** A recipient tired of promotions but interested in product news can drop the first and keep the second, and a pause keeps a subscriber who is only busy for a while. Fewer full unsubscribes and fewer spam complaints are the main reasons senders build one.

The page only helps while leaving stays easy. A preference center that hides the unsubscribe option, asks for a login or takes several steps pushes recipients toward the spam button. Mail client buttons skip the page entirely: a [list unsubscribe](/glossary/list-unsubscribe/) made from the inbox, and in particular a [one-click unsubscribe](/glossary/one-click-unsubscribe/), removes the recipient without opening it.

## Best practices for preference centers

- **Categories that match real sends:** each option corresponds to a stream of mail the sender actually produces, named the way a recipient would recognise it.
- **Current state shown:** the page opens with the recipient's existing choices already set.
- **One step to save:** a single button applies the selection, and a full unsubscribe needs nothing more than an optional reason.
- **Choices applied everywhere:** every system that sends mail reads the same subscription data, so a topic dropped on the page is not re-added by a CRM sync.

A preference center works alongside a [sunset policy](/glossary/sunset-policy/). Recipients who state their interests keep getting the mail they want, while the sunset policy removes those who stopped engaging without ever visiting the page.

## Preference center in Lettr

**Lettr hosts a preference center, the Manage email preferences page**, which every `{{unsubscribe_link}}` in a campaign opens through a signed per-recipient URL. It applies to marketing campaigns only, and transactional emails sent through the API or SMTP are not affected by anything a recipient does there. The page shows the contact's status, one checkbox per public topic plus any private topic the contact already holds, a pause for 30, 60 or 90 days, and up to the ten most recent campaigns the contact received.

Unticking a topic changes only that subscription, and consent is re-checked when a campaign's recipients are resolved and again for every batch. Unticking every box unsubscribes the contact from all marketing email after an optional reason, sets the status to `unsubscribed` and fires the `unsubscribe.link_unsubscribe` webhook event. A pause keeps the contact `subscribed` with a `paused_until` date, and campaigns skip them until that date passes.

The `{{unsubscribe_link:redirect=...}}` form sends the recipient to the sender's own URL after a full unsubscribe, and a campaign without the tag gets a minimal fallback footer before the closing `</body>` tag. The one-click unsubscribe triggered through the `List-Unsubscribe` header bypasses the page and unsubscribes immediately. The [Subscription Topics](https://docs.lettr.com/learn/audience/topics) page explains how public and private topics decide what the page shows.
