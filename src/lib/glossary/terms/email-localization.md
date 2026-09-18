---
term: Email Localization
heading: "What is email localization?"
description: "Email localization adapts a message to a market, not just its language: subject, sender, links, images and legal text. What to localize and how Lettr helps."
published: 2026-09-18
updated: 2026-09-18
related: [multilingual-campaign, ai-translation, preheader-text, reply-to-header, from-header]
reading:
  - title: Multilingual Email Campaigns
    href: https://docs.lettr.com/knowledge-base/best-practices/multilingual-campaigns
  - title: Campaign Setup
    href: https://docs.lettr.com/learn/multilingual-campaigns/campaign-setup
  - title: Multilingual Newsletter
    href: https://docs.lettr.com/knowledge-base/use-cases/multilingual-newsletter
---

**Email localization** is the work of adapting an email to the language and market of each recipient, covering every part of the message that a recipient reads or clicks. Translation of the body text is one step of it, and the wider discipline is abbreviated l10n and spelled localisation in British English. The subject line, the sender, the links, the images, the formats of dates and prices, and the legal footer all carry language too, and a localized email gets each of them right.

## Email localization vs translation

Translation converts the words of the body from one language to another. **Localization covers everything around those words.** A translated paragraph still sits under a subject line, is signed by a sender, links to a web page and ends in an unsubscribe footer, and each of those is either in the recipient's language or not.

The most common half-finished result is a translated body under an English subject line. The recipient sees the subject, the sender name and the preview text in the inbox list before opening anything, so an untranslated subject is the first thing a recipient of a translated email reads.

## What to localize in an email

- **The inbox view:** the subject line, the name in the [From header](/glossary/from-header/) and the [preheader text](/glossary/preheader-text/) are read before the email is opened. The from name matters when a brand is spelled differently by market or a local team signs the email.
- **The reply path:** a [Reply-To header](/glossary/reply-to-header/) per language sends replies to someone who reads them. A French reply in an English-only support queue serves neither side.
- **Links as well as labels:** a button labelled "Zum Shop" has to point at the German store, which means the URL is translated content too.
- **Images:** language-neutral images need no work. An image with text baked into it has to be exported again for each language, and its alt text needs translating as well.
- **Formats:** dates, currency and number formats in merge values differ by market, even where a first name renders the same everywhere.
- **Legal parts:** consent wording, the sender's identity and the unsubscribe mechanism have to be understandable to the recipient, and several jurisdictions expect commercial email in a language the consumer understands.

## Common problems with email localization

**Text expansion breaks layouts.** German and Finnish run noticeably longer than English, so a button label that fits on one line in English can wrap in another language. The Lettr docs give the example of "Jetzt bestellen" translated as "Commander maintenant", which wrapped on mobile and was shortened to "Commander". Testing the longest language at mobile width catches this before the send.

Regional variants are a second problem. `en-US` and `en-GB` differ in spelling and date formats, and keeping two full versions of one language doubles its maintenance. Neutral English with the regional details carried in merge values avoids that.

Machine translation produces a draft. Brand names, product names and idioms are where it fails most often, so a speaker of the language should read each version. [AI email translation](/glossary/ai-translation/) covers what such tools translate and what they leave alone.

## Email localization in Lettr

Lettr splits localization between the template and the campaign. **A multilingual template stores the body per language**: text, button labels and link URLs, image files with their alt text, HTML block code and the preheader, while layout and styling stay shared across versions.

The subject and sender belong to the campaign. A [multilingual campaign](/glossary/multilingual-campaign/) has a **Per-language subject and sender** section with a subject, from email, from name and reply-to for each secondary language. Every field is optional, an empty one inherits the primary value, and a per-language from email must use a verified sending domain. The docs describe a translated subject with everything else inherited as the most common setup.

The parts Lettr generates follow the recipient's language. The automatic unsubscribe footer is translated into 19 languages and matches the version the recipient receives, with English for any other language. A footer built with the template's own `{{unsubscribe_link}}` tag is whatever was written in each language version, and Lettr adds nothing to it. The `{{webversion_link}}` tag opens the language that was sent, and the hosted preferences and unsubscribe pages exist in the same 19 languages.

A template holds one version per two-letter language code, so it cannot contain both British and American English. The docs suggest neutral English, with regional details kept in merge tags or in a conditional block on a `locale` contact property.

For checking the result, the test email box in the campaign has a language picker, so one test per language shows the subject, the from name, the body and the footer as a matching recipient would receive them. The [Multilingual Email Campaigns](https://docs.lettr.com/knowledge-base/best-practices/multilingual-campaigns) guide covers the practices above in more detail.
