---
term: Multilingual Campaign
heading: "What is a multilingual email campaign?"
description: "A multilingual email campaign sends one message in several languages, each contact getting their own. How language routing works and how Lettr handles it."
published: 2026-09-18
updated: 2026-09-18
related:
  [
    multilingual-template,
    communication-language,
    primary-language,
    email-localization,
    marketing-email,
  ]
reading:
  - title: Multilingual Campaigns
    href: https://docs.lettr.com/learn/multilingual-campaigns/introduction
  - title: Sending and Results
    href: https://docs.lettr.com/learn/multilingual-campaigns/sending-and-results
  - title: Multilingual Newsletter
    href: https://docs.lettr.com/knowledge-base/use-cases/multilingual-newsletter
  - title: Multilingual campaigns in Lettr
    href: /platform/multilingual-campaigns/
---

**A multilingual email campaign**, also called a multi-language campaign, is a single campaign that goes out in more than one language, with each recipient receiving the version written in their own. One template holds the language versions, one audience is selected, and the sending platform decides per recipient which version to deliver. It replaces the older practice of running a separate campaign for each language.

## How a multilingual campaign works

Language routing needs three things. **The first is a [multilingual template](/glossary/multilingual-template/)**, one email design that stores its text, links and images once per language. The second is a language value on each contact, usually a contact property known as the [communication language](/glossary/communication-language/). The third is a fallback for contacts whose value is missing or matches no version, which is the role of the template's [primary language](/glossary/primary-language/).

The routing decision is made per recipient at send time. The platform reads each contact's language value, compares it with the languages the template has, and groups recipients by the version they will receive.

The inbox view of the message can vary by language as well as the body. A translated subject line is the minimum, and the sender name and the reply-to address can differ per language when a local team signs the email or handles its replies. That wider job is [email localization](/glossary/email-localization/).

## Multilingual campaign vs separate campaigns per language

Without a multilingual campaign, each language runs as its own campaign with its own list or segment. **Every list and every send is a separate thing to maintain**: a contact has to be on the right list, each campaign is built and scheduled on its own, and the results arrive as several reports. Contacts who fit no list get whichever language the sender picks for them, and that group is not counted anywhere.

A multilingual campaign uses one audience and one schedule, so all languages go out together and the send is reported once. The fallback group becomes a number that can be inspected before sending. The trade-off is a shared layout, because all language versions of a template use the same design.

## Common problems with multilingual campaigns

- **Language data is the weak point:** a contact receives German only when the value in their record says so, and that value came from a form, an import or a manual edit that may not be reliable.
- **A translated body under an untranslated subject:** the subject line and the sender belong to the campaign, so translating the template does not translate them.
- **One test covers one language:** each version has its own content, subject and footer, so each needs its own test send.

## Multilingual campaign in Lettr

Multilingual campaigns in Lettr are automatic. **A campaign whose linked template has more than one language is multilingual**, with no switch to turn on, and it uses the normal four-step builder: Compose, Audience, Schedule, Review & Send. As [marketing email](/glossary/marketing-email/), it links marketing templates built in the visual editor, and custom HTML content stays single-language.

In the Compose step the main **Subject**, **From email**, **From name** and **Reply-to** fields belong to the primary language. A **Per-language subject and sender** section adds one row per secondary language with the same four fields. Every field is optional, and an empty one inherits the primary value. A per-language from email must use a verified sending domain. Lettr checks this on save and again on **Send** or **Schedule**, and the campaign does not start when a domain is no longer verified. The values are stored on the campaign draft and appear in the Campaigns API as `language_overrides`, keyed by language code.

The **Multi-language send** panel on Review & Send names the property the language is read from. It lists the recipient count, subject, From and Reply-to for each language, and a fallback block that separates contacts with no value from contacts with an unmatched value. The test email box has a language picker, and abuse screening checks every language version that has at least one recipient.

When a campaign leaves Draft, Lettr stores a snapshot of the template in every language, so later edits, an added language or a deleted template do not change the send. Each recipient gets the unsubscribe footer in the language of the version they receive, and `{{webversion_link}}` opens that same language. Opens, clicks and bounces are aggregated for the whole campaign. Recipients of a secondary language carry a badge such as `DE` in the activity feed, and per-language rates need the engagement events API combined with the sender's own contact data.

Only campaigns route by language. The Emails API always sends a template's primary version and has no language parameter, so transactional email in several languages still needs one template per language, chosen in the sender's code. The [Sending and Results](https://docs.lettr.com/learn/multilingual-campaigns/sending-and-results) page covers content locking and the API in detail.
