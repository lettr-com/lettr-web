---
term: Graymail
heading: "What is graymail?"
description: "Graymail is email a recipient once signed up for but no longer reads. Why it hurts engagement and inbox placement, and the Lettr features that reduce it."
published: 2026-09-14
updated: 2026-09-14
related: [email-engagement, sunset-policy, list-hygiene, preference-center, promotions-tab]
reading:
  - title: List Hygiene
    href: https://docs.lettr.com/knowledge-base/best-practices/list-hygiene
  - title: Email Preferences Page
    href: https://docs.lettr.com/learn/audience/email-preferences
---

**Graymail** is email a recipient agreed to receive but no longer wants: newsletters they signed up for and stopped reading, promotions from a shop they bought from once, notifications they never open. It is not spam, because consent exists and the sender is legitimate. It sits between wanted mail and spam, and mailbox providers treat it differently from both.

## How graymail differs from spam

**Spam is unsolicited, while graymail was solicited once.** Anti-spam laws and filters target mail sent without permission, and graymail usually passes those checks: the recipient opted in, the sender authenticates correctly and the unsubscribe link works. What changed is the recipient's interest, which faded after the opt-in.

The line is personal. The same weekly digest is wanted mail for one subscriber and graymail for another who has not opened it in a year. Graymail is therefore a property of the relationship between one sender and one recipient, not of the message content.

Recipients do not always leave graymail politely. Reporting a message as spam is often faster than finding the unsubscribe link, so some recipients use the spam button on mail they once asked for, and each of those reports counts as a full [spam complaint](/glossary/spam-complaint/) against the sender.

## Why graymail matters

Mailbox providers read [engagement](/glossary/email-engagement/) as a signal of whether mail is wanted. **A recipient who ignores a sender's messages teaches the provider to deprioritize them**, and a large share of such recipients lowers the sender's standing overall, which can affect placement for engaged subscribers too.

Providers also move graymail out of the main view. Gmail's [Promotions tab](/glossary/promotions-tab/) and Outlook's Focused Inbox sort bulk and promotional mail away from primary conversations, and some clients offer tools for clearing out mail a user rarely reads. Placement there is not spam, but the mail gets less attention.

The cost shows in a sender's own numbers. Open and click rates fall as the unengaged share grows, and list size overstates the audience that actually reads the mail.

## How to reduce graymail

**Letting recipients choose what they receive keeps many of them.** A [preference center](/glossary/preference-center/) with topics gives subscribers a way to drop the mail they no longer want while keeping the rest, and a pause option serves those who want a break rather than a full exit.

A [sunset policy](/glossary/sunset-policy/) handles subscribers who never act. A subscriber is typically considered inactive after 6 to 12 months without an open or a click. Inactive subscribers receive a re-engagement email asking whether they still want the mail, and those who do not respond are removed from the active list. That ties [list hygiene](/glossary/list-hygiene/) to behaviour instead of signup date.

Easy unsubscribing belongs to the same effort. A visible unsubscribe link and one-click unsubscribe support give recipients a better exit than the spam button, and an unsubscribe from a disengaged reader does less harm to the sender than a complaint or another ignored message.

## Graymail in Lettr

The Lettr docs do not use the term graymail, but several documented features address it. **Every `{{unsubscribe_link}}` in a campaign opens a hosted Manage Email Preferences page**, where recipients choose which topics they want and can pause marketing email for 30, 60 or 90 days. A paused contact stays `subscribed`, and campaigns skip them until the pause date passes. The page applies to marketing campaigns only, not to transactional email sent through the API or SMTP.

Unticking every topic unsubscribes the contact and fires the `unsubscribe.link_unsubscribe` webhook event. The reasons offered include "I get too many emails" and "I never read these emails", and the chosen reason lands in the contact's activity log together with the status change. One-click unsubscribes made in the mail client through the `List-Unsubscribe` header bypass the page and unsubscribe the recipient immediately.

Campaign reports show unique opens and unique clicks, the distinct recipients who opened or clicked at least once, and the docs recommend those figures for engagement rates. Emails sent with tracking disabled do not contribute to the engagement metrics in Analytics. The [List Hygiene](https://docs.lettr.com/knowledge-base/best-practices/list-hygiene) guide covers inactive subscribers, re-engagement and sunset policies.
