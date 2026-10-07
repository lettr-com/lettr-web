---
term: Communication Language
heading: "What is a communication language?"
description: "A communication language is the contact property that stores which language a recipient reads. How email platforms route on it and how Lettr designates it."
published: 2026-09-18
updated: 2026-09-18
related: [language-code, multilingual-campaign, primary-language, preference-center]
reading:
  - title: Contact Language
    href: https://docs.lettr.com/learn/multilingual-campaigns/contact-language
  - title: Multilingual Email Campaigns
    href: https://docs.lettr.com/knowledge-base/best-practices/multilingual-campaigns
  - title: Email Preferences
    href: https://docs.lettr.com/learn/audience/email-preferences
---

**A communication language**, also called a preferred language, is the language a contact wants to be written to, stored as a value on their contact record. CRMs and signup forms record the same thing as a language preference. An email platform reads it at send time to choose which language version of a message the contact receives, and often to set the language of the pages behind the unsubscribe link.

## How a communication language works

A communication language is ordinary contact data, written by a signup form, an import or an API call, and it usually holds a [language code](/glossary/language-code/) such as `de` or `fr`. **It does nothing until a send reads it.** In a [multilingual campaign](/glossary/multilingual-campaign/) the platform compares each recipient's value with the languages of the template and delivers the matching version.

A contact without a usable value still receives the email. They get the template's [primary language](/glossary/primary-language/), the version that acts as the fallback for every recipient who cannot be matched. The quality of the routing therefore depends on how many contacts have a value and how consistently those values are written.

## How to collect a contact's language

The most reliable value is one the contact supplied. **A language selector on the signup form**, defaulted to the language of the page, produces clean codes at no cost. Where a form cannot ask, the language of the page the person signed up on is the next best source, so a signup on `/de/` is stored as `de`.

The browser's `Accept-Language` header, with values such as `de-AT` or `en-GB`, works as a last resort. Country is a weaker signal, because Switzerland, Belgium and Canada each have several languages and expats read their own. A name, a phone prefix or a billing address is weaker still. A wrongly guessed language reads worse to the recipient than the primary language would have.

## Common problems with communication language data

- **Several competing properties:** a `lang` column from a CRM export, a `locale` from the application database and a `language` field from a newsletter form each cover part of the audience. The fix is to pick one, backfill it from the others and route on that one only.
- **Free-text values:** fields that accept typing collect `German`, `Deutsch`, `n/a` and typos next to proper codes. A review of the distinct values once a quarter shows which ones need cleaning.
- **More than one language per contact:** a value such as `de,en` is not a language, and routing treats it as unmatched.
- **Legal text left untranslated:** consent wording, the sender's identity and the unsubscribe mechanism have to be understandable to the recipient, and an English-only legal footer under a translated body undercuts that.

## Communication language in Lettr

In Lettr, the communication language is a contact property with a designation. **Ticking Use as communication language** on a property under **Audience** → **Properties** makes it the language source for campaigns, and the property then shows a communication language badge. One property per team can hold the role, and ticking a second property moves it. Through the API the same switch is the `purpose` field, set to `"communication_language"` when a property is created or updated.

When no property is designated, Lettr looks for the language by property name in a fixed order: `communication_language`, `communication_lang`, `language`, `lang`, `locale`. The lookup runs per contact and the first name that holds a value wins, so a CSV imported with a `lang` column routes without any setup. Deleting the designated property shows no warning, and Lettr goes back to this name lookup.

The property has to be of type `string`. The switch is offered for every type without an error, but values in `number`, `boolean`, `date` or `json` properties are ignored, which sends every recipient the primary language, and a property's type cannot be changed later. A value made only of spaces counts as empty at send time, although the segment operator **is empty** does not catch it, so the count in the campaign's review panel is the one to trust. An API write that uses a property key the team has not defined is rejected with `One or more property keys are not registered for your team.`

The same value sets the language of the hosted [preference center](/glossary/preference-center/), the **Manage email preferences** page, and of the unsubscribe page, both available in 19 languages. They use the contact's value when it is one of the 19, then the team's **Default communication language** under **Settings** → **Team**, then English. The web version of a campaign is separate and always shows the language that was sent.

When no contact property holds a language, a campaign shows an amber warning in the Audience step and in the review panel, stating that every recipient will get the primary language, with a **Set a language property** button. The [Contact Language](https://docs.lettr.com/learn/multilingual-campaigns/contact-language) page lists the full matching rules.
