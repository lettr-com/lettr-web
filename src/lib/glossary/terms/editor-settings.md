---
term: Editor Settings
question: What is
description: "Editor settings are the team-wide defaults of a visual email editor: fonts, brand colors and merge tags. How they work and what Lettr's three tabs control."
related: [topol-email-editor, merge-tag, loop-block, saved-block, premade-template]
reading:
  - title: Editor Settings
    href: https://docs.lettr.com/learn/templates/editor-settings
  - title: Email Editor Best Practices
    href: https://docs.lettr.com/knowledge-base/best-practices/email-editor-best-practices
  - title: Topol Email Editor
    href: https://docs.lettr.com/learn/templates/topol-editor
---

**Editor settings** are the configuration of a visual email editor itself, as opposed to the content of any single template. They decide what the editor offers everyone who designs in it: which fonts appear in the font picker, which colors sit in the color picker, which merge tags can be inserted and which language the interface uses. Setting these once gives every template the same building materials, which keeps a team's emails consistent with its brand.

## How editor settings work

A drag-and-drop editor such as the [Topol email editor](/glossary/topol-email-editor/) exposes its choices through pickers and dropdowns. **Editor settings fill those pickers.** A brand palette added in the settings shows up as quick-select swatches in every color control, a curated font list replaces the full catalogue, and a fixed list of font sizes becomes the type scale designers pick from.

Merge tags follow the same pattern. A [merge tag](/glossary/merge-tag/) is a placeholder that is replaced with real data at send time, and its exact spelling has to match the data the application sends. Defining the available tags in the editor settings turns them into a dropdown, so a designer inserts `{{ FIRST_NAME }}` from a menu instead of typing it by hand and risking a tag that never resolves.

Some tags represent a list rather than a single value, such as the line items of an order. Those are defined as loop tags with child properties, and they feed repeating content like a [loop block](/glossary/loop-block/) that renders once per item.

## Editor settings vs template settings

Visual editors usually configure design at three levels, and mixing them up is the most common source of confusion.

- **Editor settings:** apply to the editor for the whole team and control what is available, such as fonts, colors, merge tags and the interface language.
- **Template settings:** apply to one template and set its baseline design, such as content width, background color, default fonts and button styles.
- **Block settings:** apply to one element and override the template defaults for that element only.

**Editor settings do not restyle existing emails.** Adding a brand color makes it available in the picker, but a button that already uses another color keeps it until someone changes the button or the template default. Changes to editor settings shape future design work, while changes to template settings change the template they belong to.

## Best practices for editor settings

**Configure the settings before the first templates are built**, so designers start with the approved palette, fonts and tags instead of improvising and fixing emails later. Primary and secondary brand colors plus the common text colors cover most needs, and a short font list with a defined size scale prevents near-duplicate headings across templates.

Custom web fonts deserve caution. Many email clients do not load them and fall back to a system font, so they suit decorative text where the fallback is acceptable, not critical content. Pairing a custom font with a similar web-safe fallback keeps the layout stable.

Merge tag groups work best when they mirror the application's data model, for example a Customer group and an Order group. Reusable sections such as headers and footers belong in a [saved block](/glossary/saved-block/) instead, since editor settings define the materials and saved blocks define finished pieces of layout.

## Editor settings in Lettr

Lettr's Editor Settings are found under **Emails → Editor Settings** in the sidebar and **apply across the team to all templates**. The page has three tabs: **Appearance**, **Custom Fonts** and **Merge Tags**.

The Appearance tab sets the editor's interface language, with 20 languages supported and no effect on the language of email content. It also holds Custom Colors, entered as hex values that appear in the editor's color pickers, and Testing Emails, a list of addresses pre-filled when a team member clicks **Send Test** in the editor.

The Custom Fonts tab configures the font size list, which accepts values from 1px to 200px, removes duplicates, sorts them and offers a **Reset to default** link. It shows the 15 built-in fonts as toggleable cards, four web-safe fonts and eleven Google Fonts, which can be disabled but not removed. Custom web fonts are added in two steps, a font URL with a display label and then a font family detected from that URL.

The Merge Tags tab organizes tags into groups, each tag with a text, label and value. The value is generated from the text in uppercase with underscores, so "First Name" becomes `{{ FIRST_NAME }}`. Enabling **Is Loop Tag** adds child properties typed as `text`, `image`, `button` or `number`. Template-wide defaults such as template width and button styles live separately in the editor's Settings panel, described on the [Topol Email Editor](https://docs.lettr.com/learn/templates/topol-editor) page.
