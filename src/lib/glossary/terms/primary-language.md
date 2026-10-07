---
term: Primary Language
heading: "What is a primary language in email?"
description: "The primary language is the base version of a multilingual email and its fallback. What it does, how to choose it, and what switching it changes in Lettr."
published: 2026-09-18
updated: 2026-09-18
related: [multilingual-template, multilingual-campaign, language-code, communication-language]
reading:
  - title: How Template Languages Work
    href: https://docs.lettr.com/learn/multilingual-campaigns/how-template-languages-work
  - title: Contact Language
    href: https://docs.lettr.com/learn/multilingual-campaigns/contact-language
  - title: Multilingual Email Campaigns
    href: https://docs.lettr.com/knowledge-base/best-practices/multilingual-campaigns
---

**The primary language**, also called the default or fallback language, is the base version of a multilingual email that every other language version falls back to. It holds the complete content of the message, fills any gap a translation leaves, and is what a recipient gets when their own language cannot be matched. Every [multilingual template](/glossary/multilingual-template/) has exactly one.

## How the primary language works

The primary language has three jobs, and they are easier to reason about separately.

- **Base content:** it is the first language added to the template and takes over the content the template already had, which makes it the only version that is always complete.
- **Fallback inside the template:** any value a secondary language has not set, such as an untranslated paragraph or an unchanged button link, is read from the primary.
- **Fallback for contacts:** a recipient with no language value, or with a value that matches no version of the template, receives the primary version.

The third job means **nobody is skipped**. A [multilingual campaign](/glossary/multilingual-campaign/) sends an email to every recipient in its audience, and the recipients whose language cannot be resolved get the primary version instead of nothing.

## Primary language fallback vs property fallback value

Two different fallbacks exist in most email platforms, and they are easy to confuse. **The primary-language fallback decides which version of the email a contact receives.** A contact property's fallback value does something smaller: it fills a merge tag when the contact has no value for that property.

Setting a fallback value of `en` on the language property therefore does not route contacts to English. Routing reads only the value stored on the contact, which is the contact's [communication language](/glossary/communication-language/). A contact without one gets the primary version, whatever the property's fallback value says.

## How to choose a primary language

The usual candidates for a primary language are the language most of the audience reads and the language the template was first written in, and they are not always the same. **The safer choice is the language that causes the least harm when it is wrong**, because the primary is what every unmatched contact receives. For a Central European brand that is often English and not the home-market language.

Some contacts have no recorded preference, and the primary version reaches them without a problem, so a fallback count above zero is normal. The useful check is how many recipients will fall back and why. A large group with no value points at data collection, and a recurring unmatched value points at a form or an import that writes something other than a [language code](/glossary/language-code/).

## Primary language in Lettr

In Lettr, the first language added through the editor's **Create mutation** dropdown becomes the primary and takes over the template's existing content. It carries a primary badge in the **Language settings** panel and has no delete button. Deleting it requires making another language primary first.

**Set as primary** on a secondary language moves the role. The editor fills every value the new primary is missing with the old primary's value, and nothing is removed from either language. Blocks that were never translated in the new primary now hold text in the old primary's language, so the docs advise reading through the new primary after the switch. Other languages then fall back to the new primary, and contacts with no matching language receive it in campaigns scheduled from then on. A campaign that is already scheduled or sending is not affected, because its content is locked when it leaves Draft.

The switch also reaches draft campaigns. The main **Subject**, sender and **Reply-to** fields of a campaign always belong to whichever language is primary. After a switch, the old primary becomes an ordinary per-language row with no values of its own, and values entered earlier for the new primary are no longer used, so the subjects have to be rewritten.

Before a send, the **Multi-language send** panel on the Review & Send step shows the fallback in numbers, for example `85 of 97 recipients will get English (EN), the primary language`. It splits that count into contacts with no language value and contacts whose value matches no template language, with the most frequent unmatched values listed. Outside campaigns the primary is the only version that sends: an email sent through the Emails API with `template_slug` always uses it, and there is no language parameter.

The hosted preferences and unsubscribe pages do not use the template's primary language. They follow the contact's language when it is one of the 19 languages those pages support, then the team's **Default communication language** under **Settings** → **Team**, then English. The [How Template Languages Work](https://docs.lettr.com/learn/multilingual-campaigns/how-template-languages-work) page covers the fallback rules in full.
