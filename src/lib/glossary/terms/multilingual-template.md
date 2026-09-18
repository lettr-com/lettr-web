---
term: Multilingual Template
heading: "What is a multilingual email template?"
description: "A multilingual email template holds several language versions of one design. What each language stores, what is shared, and how fallback works in Lettr."
published: 2026-09-18
updated: 2026-09-18
related: [primary-language, ai-translation, structure, saved-block, topol-email-editor]
reading:
  - title: Multilingual Templates
    href: https://docs.lettr.com/learn/multilingual-campaigns/template-languages
  - title: How Template Languages Work
    href: https://docs.lettr.com/learn/multilingual-campaigns/how-template-languages-work
  - title: Template Translation
    href: https://docs.lettr.com/learn/multilingual-campaigns/template-translation
---

**A multilingual email template** is a template that holds several language versions of the same message inside one design, so the layout is built once and only the content is translated. The layout and styling exist once, and each language stores only the content that differs, such as text, button labels, links and images. A sending platform can then pick the version that fits each recipient, which is what a [multilingual campaign](/glossary/multilingual-campaign/) does.

## How a multilingual template works

The model is **one design with a layer of translations on top**. Structures, columns, blocks, their order and their styling belong to the shared design. A language version is a set of overrides recorded while that language was selected in the editor: the text of one block, the link of one button. Every value a language has not set is left empty.

An empty value means "use the [primary language](/glossary/primary-language/)", the base version that is always complete. A newly added language is therefore an empty layer that looks identical to the primary, because it is showing the primary through. The fallback is evaluated every time the template is displayed or sent, so an untranslated block picks up later changes to the primary text, while a translated block keeps its translation.

Layout work affects every language, whichever one is selected. Moving a block moves it in all versions, a style change applies everywhere, and deleting a block removes its translations along with it.

## Multilingual template vs one template per language

The alternative to a multilingual template is a separate email template for each language. **Separate templates multiply every design change**: a new banner or a reordered section has to be repeated in each copy, and the copies stop matching once one of them is missed.

A single template with language layers keeps the layout in one place and leaves only the translatable content to maintain. The cost is a constraint: all versions share one structure, so a market that needs a different layout, and not only different words, still needs its own template.

## Common problems with multilingual templates

- **Untranslated blocks look finished:** a block nobody translated shows the primary text in the editor, the preview and the sent email, with nothing marking it. Blocks added to the layout after the translation pass are the usual cause.
- **Edits land in the wrong language:** the editor writes changes into whichever language is selected, so text typed while the primary is selected replaces the primary content.
- **The wrong language becomes the base:** the first language added takes over the template's existing content, which leaves German text labelled as English when English is added first.

## Multilingual template in Lettr

Lettr's multilingual templates are built in the [Topol email editor](/glossary/topol-email-editor/). The editor calls language versions **mutations**, and the Lettr docs call them language versions. **Everything is controlled from the globe dropdown** in the top bar next to **Preview**. It is labelled **Create mutation** until the template has a language, and from then on it shows the name of the language being edited, which is the only indicator of where edits go. Each language is identified by a two-letter [language code](/glossary/language-code/) picked from a built-in list.

Stored per language are text (with the links and merge tags inside it), button labels and link URLs, image files with their alt text and link, GIF and video URLs, HTML block code, social icon links and the preheader. Overrides are kept per value, so a German button with only its link changed keeps following the primary label. Always shared are the layout, all styling, and Divider, Spacer and Carousel blocks. Carousel content is the same in every language, so the docs advise keeping customer-facing text out of it.

A block added while a secondary language is selected stores its starting content for that language and the primary, which is why the docs recommend adding blocks with the primary selected. An inserted [saved block](/glossary/saved-block/) keeps the language versions it was saved with. Translations can be typed by hand or drafted with [AI email translation](/glossary/ai-translation/).

Language changes stay in the editing session until **Save** is clicked. The primary language and the last remaining language cannot be deleted, and a language cannot be renamed or given a different code. Saved templates with more than one language show a badge such as `EN · ES · FR` on their cards.

Only templates built in the visual editor can hold languages. Custom HTML templates are single-language, and a transactional template needs the **Copy to Marketing** action before a campaign can link it. Outside campaigns, including emails sent through the API with `template_slug`, a multilingual template always sends its primary version. The [How Template Languages Work](https://docs.lettr.com/learn/multilingual-campaigns/how-template-languages-work) page has the full table of what each block stores per language.
