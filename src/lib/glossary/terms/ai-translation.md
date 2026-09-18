---
term: AI Email Translation
heading: "What is AI email translation?"
description: "AI email translation drafts language versions of a template with a language model. What it translates, what it skips, and how to review the result in Lettr."
published: 2026-09-18
updated: 2026-09-18
related: [multilingual-template, email-localization, merge-tag, saved-block, primary-language]
reading:
  - title: Template Translation
    href: https://docs.lettr.com/learn/multilingual-campaigns/template-translation
  - title: Multilingual Templates
    href: https://docs.lettr.com/learn/multilingual-campaigns/template-languages
---

**AI email translation** is machine translation of an email template's text by a language model, run inside the email editor so that the layout, links and merge tags stay intact. It produces a first draft of each language version, and the draft still needs a reader who knows the language before it is sent.

## How AI email translation works

The translation runs on a [multilingual template](/glossary/multilingual-template/), where each language version stores its own text on top of a shared layout. **The model receives the text of a source version and returns it in the target language**, and the editor stores the result in that language version. The source is normally the [primary language](/glossary/primary-language/), the complete base version of the template.

Only the words change. Styling and structure stay as they are, and a [merge tag](/glossary/merge-tag/) such as `{{first_name}}` has to come back exactly as written, because a translated or reformatted tag no longer matches the data at send time.

## AI translation vs human translation

Machine and human translation cover different parts of the job. **Machine translation gives speed and coverage**: every block in every language gets a draft at once, which shows the layout under real text lengths and leaves nothing blank. A human translator or a native-speaking colleague supplies what the model gets wrong.

The errors are predictable. Brand names and product names get translated when they should stay as they are, idioms come out literal, and the tone can shift between formal and informal address in languages that distinguish them. The workflow that follows is to finish the primary version, translate, have a speaker of the language review the result, preview it on desktop and mobile, and send one test per language.

## Common problems with AI email translation

- **Text in images stays untranslated:** a model translates text, and a banner or logo with words baked into the image file has to be replaced by hand in each language.
- **Links keep pointing at the original market:** a translated button label over an unchanged URL sends German readers to the English page, which is one of the gaps [email localization](/glossary/email-localization/) covers.
- **Longer text breaks the layout:** translated text is often longer than the original, so buttons and headings need a check at mobile width.
- **Re-running overwrites human edits:** a full re-translation replaces whatever a translator corrected since the last run.

## AI email translation in Lettr

Lettr's editor translates multilingual templates with the same AI as its other writing tools, and the translate controls appear only when the editor has AI features. **There are three scopes.** The AI menu on a text or button block has a **Translate to** option that names the language being edited, such as **Translate to Czech**, and changes only that block. The translate icon on a language row in the **Language settings** panel fills that language from the primary. **Translate all** in the panel header translates every secondary language from the primary in one run, after a **Translate all from primary** confirmation.

Once a template has more than one language, the row icon is a split button. Its arrow opens a **Translate from** menu for choosing a different source, and the docs give the example of translating Slovak from a finished Czech version, which usually gives a closer result than translating from English. Gaps in a partly translated source are read from the primary.

The row icon and **Translate all** cover text blocks, button labels, alt text, image titles, the preheader and the text inside HTML blocks, where the markup is kept and the docs advise a careful check. Image files, button, image and social links, and video URLs are not changed. Synced sections, the linked kind of [saved block](/glossary/saved-block/), are skipped with a **Synced structures cannot be translated** notice. The subject line, sender name and reply-to belong to the campaign and are translated there.

Both the row icon and **Translate all** overwrite translations that already exist, so the docs advise running them before a translator edits the text and using block translation for small updates afterwards. One language translation is one undo step, and **Translate all** is one step for all languages. A run that reports fewer languages than the template has, such as 2 of 3, keeps the languages that succeeded, and the failed one can be retried from its row. Very long templates are more likely to time out and are better translated block by block.

The **Primary** row has a translate button as well. It rewrites the primary content itself, and every untranslated block in the other languages follows, so the docs recommend **Undo** when it is clicked by mistake. Translations are not linked to the primary after they are made, which means a later change to primary text is not re-translated. The [Template Translation](https://docs.lettr.com/learn/multilingual-campaigns/template-translation) page covers the review steps.
