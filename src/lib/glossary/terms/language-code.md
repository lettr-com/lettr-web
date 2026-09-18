---
term: Language Code
heading: "What is a language code?"
description: "A language code such as en or de identifies a language in email data. ISO 639-1 codes, regional tags like de-AT, and how Lettr matches messy contact values."
published: 2026-09-18
updated: 2026-09-18
related: [communication-language, primary-language, multilingual-template, character-encoding]
reading:
  - title: Contact Language
    href: https://docs.lettr.com/learn/multilingual-campaigns/contact-language
  - title: How Template Languages Work
    href: https://docs.lettr.com/learn/multilingual-campaigns/how-template-languages-work
---

**A language code** is a short standardized identifier for a language, such as `en` for English or `de` for German, most often the two-letter form defined by ISO 639-1. Email platforms use language codes in two places: to label the language versions of a template, and to record on each contact which language that person reads. Sending the right version to the right contact comes down to comparing those two codes.

## How language codes work

The common standard is **ISO 639-1, which assigns a two-letter code to each major language**: `en`, `de`, `fr`, `es`, `cs`. The related standards ISO 639-2 and ISO 639-3 define three-letter codes, and a few languages have two of them, which is why German appears as both `deu` and `ger`. Two-letter codes are the form most web and email software expects.

A language code identifies the language only. It is a separate thing from [character encoding](/glossary/character-encoding/), which decides how the letters of that language are stored as bytes, and a message in any language is normally encoded as UTF-8.

## Language codes vs locales

A locale adds a region to the language. **The tag `de-AT` means German as used in Austria**, `en-GB` means British English, and `pt-BR` means Brazilian Portuguese. The combined form is called a language tag and is defined by BCP 47 (RFC 5646), the standard behind the browser's `Accept-Language` header and the HTML `lang` attribute. Software locales often write the same thing with an underscore, as in `de_DE` or `en_US`.

The region matters for formatting: dates, decimal separators, currency and some spelling. It matters much less for choosing a language version of an email, because a reader in Vienna and a reader in Berlin both read a German email. Routing by language therefore usually reduces a locale to its base language, and the regional part is kept only where formatting depends on it.

## How to store language codes

Contact data collects language values from many sources, and each source writes them differently. One import has `de`, another has `de_DE`, a signup form wrote `German`, and someone typed `Deutsch` by hand. **A single consistent format is easier to segment, export and debug** than a mix that happens to work.

The practical rule is to store the same codes the templates use, which for most platforms means two-letter ISO 639-1 codes. Values are best cleaned on the way in: `Français` and `french` mapped to `fr` in the CSV before an import, and forms that offer a fixed list instead of a free-text field. A periodic review of the distinct values in the language property finds what slipped through.

## Language code in Lettr

Each language version of a Lettr [multilingual template](/glossary/multilingual-template/) is identified by a two-letter ISO 639-1 code. **The code comes from the editor's built-in language list and cannot be typed**, so a template cannot hold two regional variants of one language, such as British and American English.

Contact values do not have to be that exact. At send time Lettr compares each recipient's [communication language](/glossary/communication-language/) with the template's languages under three rules, strictest first, and the first rule that matches wins:

1. **Same tag:** case, surrounding spaces and `_` versus `-` are ignored, so `DE`, `De` and `de` with a trailing space all match `de`.
2. **Same base language:** the region is dropped in both directions, so `de-AT` and `de_ch` match `de`, and `pt-BR` and `pt-PT` both reach the `pt` version.
3. **Same language by name:** a case-insensitive alias table maps spellings to codes, so `german`, `Deutsch` and `ger` match `de`, and `Français` and `french` match `fr`.

The alias table covers 19 languages: Chinese, Czech, Dutch, English, Finnish, French, German, Italian, Japanese, Korean, Polish, Portuguese, Romanian, Russian, Slovak, Spanish, Swedish, Turkish and Vietnamese. It includes less obvious forms such as `cz` for Czech, `jp` for Japanese, `flemish` for Dutch, `brazilian` for Portuguese and `castellano` for Spanish, along with native-script names such as `中文`, `日本語` and `한국어`. The same 19 languages are the ones the automatic unsubscribe footer and the hosted preferences and unsubscribe pages are translated into.

Languages outside the table still route under the first two rules. A template with a `hu` version reaches contacts stored as `hu` or `hu-HU`, and only a name such as `hungarian` is not recognised. A value that matches nothing, such as `it` when the template has no Italian version or a typo like `germn`, gets the [primary language](/glossary/primary-language/). A list such as `de,en` also matches nothing, because each contact has one language. The campaign's review panel lists the unmatched values with their counts before the send.

The docs still recommend clean codes. A template language `de` and contacts stored as `de` match on the strictest rule, which leaves nothing to debug. The [Contact Language](https://docs.lettr.com/learn/multilingual-campaigns/contact-language) page has the full table of accepted spellings.
