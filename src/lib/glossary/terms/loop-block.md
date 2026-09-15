---
term: Loop Block
heading: "What is a loop block?"
description: "A loop block is a visual email editor element that repeats its layout for each item in an array, such as order line items. How Lettr's Loop Blocks are set up."
published: 2026-09-14
updated: 2026-09-14
related: [merge-tag, content-block, substitution-data, editor-settings, topol-email-editor]
reading:
  - title: Loop Blocks
    href: https://docs.lettr.com/learn/templates/loop-blocks
  - title: Template Language
    href: https://docs.lettr.com/learn/templates/template-language
  - title: Editor Settings
    href: https://docs.lettr.com/learn/templates/editor-settings
---

**A loop block** is an element in a drag-and-drop email editor that renders its content once for every item in a list of data. The layout of a single item is designed once, for example a product image with a name and a price, and at send time the block expands into as many copies as the data contains. Loop blocks let order confirmations, invoices and digests show a variable number of rows from a single template.

## How loop blocks work

A loop block is a container. Like any section of a visual template, it holds ordinary [content blocks](/glossary/content-block/) such as text, images and buttons, but **the whole container is bound to an array** in the data sent with the email. Each dynamic field inside the block is a placeholder for one property of the current item.

At send time the renderer walks through the array and outputs one copy of the block per item, filling the placeholders from that item's properties. An array with three products produces three product cards, and an empty array produces none. Single values elsewhere in the template, such as the customer's name or the order total, still come from regular [merge tags](/glossary/merge-tag/), so one send request carries both kinds of data side by side.

The binding depends on names. The editor records which array the block reads and which fields each item offers, and the data has to use exactly those names. A field that is missing from an item, or spelled differently, renders as an empty value instead of raising an error.

## Loop blocks vs code loops

Template languages offer the same repetition as a statement wrapped around HTML, where a loop opens before the markup for one item and closes after it. **The difference is who maintains the template.** A loop block lives on the editor canvas, needs no template code and keeps the editor's responsive behavior, so designers and other non-developers can build and change repeating sections safely.

A code loop gives full control over the generated markup and can nest, for example categories that each contain a list of products. It suits developers writing raw HTML templates, conditional formatting based on the item's position, and layouts the visual editor cannot express. Many teams use both, with visual loop blocks for standard card and list layouts and code loops in custom HTML sections that need more control.

## Best practices for loop blocks

**Keep every item in the array the same shape.** Each object should carry the same fields, so no card renders with a blank name or a broken image link. When the array might be empty, a conditional section around the block can show a fallback message instead of a gap.

Design for variable length. The layout should look right with one item and with ten, and multi-column item layouts stack on mobile, so the stacking order needs checking with real data. Compact item cards keep a long order from turning into a very tall email.

Large arrays cost size. Every iteration repeats the block's HTML and images, so a very long list makes the message heavier and brings it closer to [email clipping](/glossary/email-clipping/) in Gmail. For long lists, showing the first few items and linking to a web page keeps the email readable.

## Loop block in Lettr

**Lettr's Loop Block is an element of the [Topol email editor](/glossary/topol-email-editor/).** It is dragged onto the canvas from the content blocks panel and linked to a Loop Merge Tag in the block's properties panel, which decides the array that provides the data and the fields available inside the block.

Loop Merge Tags are configured for the whole team in [Editor Settings](/glossary/editor-settings/), on the Merge Tags tab, by enabling **Is Loop Tag** on a merge tag and adding child properties with a text, label, value and a type of `text`, `image`, `button` or `number`. New teams start with a default "Invoice Items" loop, `{{INVOICE_ITEMS}}`, with children for item name, description, quantity, unit price and total.

The [substitution data](/glossary/substitution-data/) in the send request must include an array whose key matches the Loop Merge Tag value without the braces, so a `{{PRODUCTS}}` loop reads a `PRODUCTS` array, and each item's keys match the child values, also without braces. Field names are case-sensitive, and renaming or removing fields in a Loop Merge Tag after templates use it makes those templates render empty values for the affected fields.

A Loop Block supports a single nesting level. Nested lists use the template language's `{{each array}} ... {{end}}` statement instead, which works in custom HTML blocks and can sit in the same template as Loop Blocks. The [Loop Blocks](https://docs.lettr.com/learn/templates/loop-blocks) page compares the two approaches.
