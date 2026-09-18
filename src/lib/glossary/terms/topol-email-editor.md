---
term: Topol Email Editor
heading: "What is the Topol Email Editor?"
description: "The Topol Email Editor is a drag-and-drop tool for building responsive HTML email without code. How visual email editors work and how Lettr uses Topol."
published: 2026-09-14
updated: 2026-09-18
related: [content-block, structure, saved-block, editor-settings, merge-tag]
reading:
  - title: Topol Email Editor
    href: https://docs.lettr.com/learn/templates/topol-editor
  - title: Email Editor Best Practices
    href: https://docs.lettr.com/knowledge-base/best-practices/email-editor-best-practices
  - title: Saved Blocks
    href: https://docs.lettr.com/learn/templates/saved-blocks
---

**The Topol Email Editor** is a drag-and-drop editor for building responsive HTML email templates without writing code. It belongs to the category of visual email editors, which let a designer assemble an email from sections and elements on a canvas while the editor generates the HTML that mail clients need. Topol is a product in its own right, with its own support center, and it is integrated into Lettr as the visual editor for templates.

## How visual email editors work

HTML email is built with nested tables, inline styles and client-specific workarounds, because many mail clients ignore modern layout CSS. **A visual editor keeps that markup out of sight.** The designer works with a layout model on a canvas, the editor stores the design as structured data, and on export it generates HTML intended to render consistently across clients.

Topol's layout model has three levels. A [structure](/glossary/structure/) is a horizontal section of the email split into columns, each column is a container, and a [content block](/glossary/content-block/) such as text, an image or a button is the smallest unit placed inside a column. Selecting an element opens the settings for that level, and a global settings panel holds the template's defaults, such as width, fonts, link color and button styles.

Responsive behaviour is built into the generated code, so the designer does not write it. Multi-column sections stack on narrow screens, and individual elements can be shown only on desktop or only on mobile, so one template serves both.

## Why visual editors matter

**They separate email design from application code.** Designers, marketers and support staff change copy and layout in the editor, while the application only names the template and supplies the data. Content changes then ship without a code deployment.

They also cut down on rendering bugs and inconsistency. Hand-written email HTML tends to break in one client or another, while an editor's output is built from components designed for cross-client rendering. A header or footer kept as a [saved block](/glossary/saved-block/) is built once and inserted into every template, and team-wide [editor settings](/glossary/editor-settings/) give everyone the same fonts, colors and [merge tags](/glossary/merge-tag/) to work with.

## Common problems with visual editors

- **Custom HTML blocks:** raw markup inserted into a visual template sits outside the editor's rendering guarantees and needs testing in real mail clients.
- **Round trips between code and canvas:** turning a visual template into hand-edited HTML ends the structured design, and importing arbitrary HTML into the visual model often needs manual fixes afterwards.
- **Hidden content:** an element hidden on one viewport is usually still present in the HTML, so it adds to the message size.
- **Trusting the preview:** desktop and mobile previews approximate the layout, and only test sends show what real clients do with it.

## Topol Email Editor in Lettr

**Lettr's visual templates are built in the Topol editor** from structures, columns and 10 content block types. Columns stack vertically on mobile unless stacking is turned off for the structure, and structures and blocks have **Hide on desktop** and **Hide on mobile** toggles. The **Settings** panel holds template-wide defaults, including **Preview text**, the preheader shown next to the subject line in inbox previews.

The toolbar adds **Multilingual**, which turns a template into a [multilingual template](/glossary/multilingual-template/) that keeps several language versions with a shared structure and independent text, and **Autosave history**, where timestamped autosaves can be browsed and restored. Images uploaded through the **File Manager** are available to all team members across all templates. Structures can be saved as Saved Blocks, and merge tags can be placed in text blocks, link URLs, image alt text and button labels, with their values supplied in `substitution_data` in the send request.

Fonts, colors and the merge tag list come from Editor Settings, which apply across the team to all templates. A template can be converted to custom HTML from the **More** menu, which exports the generated HTML and stops maintaining the visual structure. Converting custom HTML back to the visual editor parses it into structures, columns and blocks, and complex or non-standard markup may need manual adjustment afterwards. The [Topol Email Editor](https://docs.lettr.com/learn/templates/topol-editor) page documents every block type and setting.
