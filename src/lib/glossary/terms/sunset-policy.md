---
term: Sunset Policy
heading: "What is a sunset policy?"
description: "A sunset policy stops email to subscribers who have not engaged for a set period. How to define inactivity, re-engage first, and apply the rule in Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [list-hygiene, graymail, email-engagement, suppression-list, spam-trap]
reading:
  - title: List Hygiene
    href: https://docs.lettr.com/knowledge-base/best-practices/list-hygiene
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
  - title: Segments
    href: https://docs.lettr.com/learn/audience/segments
---

**A sunset policy** is a standing rule that stops sending marketing email to subscribers who have not engaged for a defined period. Instead of mailing everyone who ever signed up, the sender removes or suppresses recipients with no opens or clicks within an inactivity window, usually after a last attempt to win them back. The rule runs on a schedule, so the list does not build up a long tail of people who ignore every message.

## How a sunset policy works

A sunset policy has three parts. **The inactivity window** defines who counts as unengaged, for example no opens or clicks in the past 6 to 12 months. A re-engagement step then sends that group one or two messages asking whether they still want the mail. The removal step stops mail to everyone who did not respond, by unsubscribing, suppressing or deleting them.

The window depends on how often the sender mails. A daily sender has many more chances to see engagement than a monthly one, so daily programmes use shorter windows. Recent subscribers need a grace period as well, since someone who joined a few weeks ago has not yet had the chance to engage.

Engagement data needs care. Apple's Mail Privacy Protection and some security scanners load images automatically, so an address can register opens without anyone reading, and clicks or activity outside the email are a more reliable basis for deciding who is still engaged.

## Why a sunset policy matters

**Mailbox providers watch how recipients treat a sender's mail.** A list full of people who never open it lowers [engagement](/glossary/email-engagement/) rates, and providers respond by filtering more of the sender's mail to spam, including messages to active readers. Mail that recipients neither read nor unsubscribe from, known as [graymail](/glossary/graymail/), also invites spam complaints from people who have forgotten signing up.

Old addresses carry a second risk. Mailbox providers deactivate abandoned accounts, and some later reactivate them as recycled [spam traps](/glossary/spam-trap/). A sunset policy takes those addresses off the list while they are still merely inactive.

## Best practices for sunset policies

- **Re-engagement before removal:** a clear subject line and a single button to stay subscribed recovers some readers and gives the rest an easy way out.
- **An automated schedule:** a monthly or quarterly job keeps the policy from depending on someone remembering it.
- **Suppression over deletion alone:** an address removed from the list can return through an old import or a CRM sync, so keeping it on a [suppression list](/glossary/suppression-list/) or in an unsubscribed state stops it from being mailed again.
- **Transactional mail left out:** receipts and password resets go to account holders whatever their marketing engagement.

A sunset policy is one part of [list hygiene](/glossary/list-hygiene/), which also covers bounces, complaints and address validation at signup.

## Sunset policy in Lettr

**The Lettr List Hygiene guide describes a sunset policy** as a standing rule that automatically removes subscribers after a defined period of inactivity, implemented as an automated process and run on a regular monthly or quarterly schedule. It considers a subscriber typically inactive after no opens or clicks in the past 6 to 12 months, with a recommended window of 3 to 6 months for daily senders, 6 to 9 months for weekly senders and 9 to 12 months for monthly senders. Before removal, it recommends a re-engagement email, a wait of 7 to 14 days and a final reminder.

In a Lettr audience, campaigns go only to contacts with status `subscribed`, and `unsubscribed`, `bounced`, `complained` and `unverified` contacts are excluded automatically. A contact's status can be changed from its profile, for example to mark it as unsubscribed, and contacts can be deleted individually or in bulk.

Segments target campaigns at contacts that match conditions, and the segment builder can filter on `email`, `status`, `created_at`, topics, lists and any custom property, with `before` and `after` operators for date values. A campaign evaluates its segments at the moment recipients are prepared for the send, so the audience reflects contact data as it stands then. Engagement reaches webhook endpoints as `engagement.open` and `engagement.click` events, which require open or click tracking to be enabled. The [List Hygiene](https://docs.lettr.com/knowledge-base/best-practices/list-hygiene) guide includes a sunset policy example and a quarterly audit checklist.
