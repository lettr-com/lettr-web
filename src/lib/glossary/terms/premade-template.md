---
term: Premade Template
heading: "What is a premade template?"
description: "A premade template is a ready-made email design used as a starting point instead of building from scratch. How premade designs work and Lettr's gallery."
published: 2026-09-14
updated: 2026-09-14
related: [topol-email-editor, template-version, saved-block, project, template-slug]
reading:
  - title: Premade Templates
    href: https://docs.lettr.com/learn/templates/premade-templates
  - title: Templates Introduction
    href: https://docs.lettr.com/learn/templates/introduction
  - title: Topol Email Editor
    href: https://docs.lettr.com/learn/templates/topol-editor
---

**A premade template** is a ready-made email design that a sending platform or email editor provides as a starting point. It comes with a tested layout, styles and placeholder content for a common kind of email, such as a welcome message, a receipt or a newsletter, and the sender replaces the content and branding to make it their own. Starting from one skips most of the layout work that HTML email requires.

## How premade templates work

**Using a premade template creates a copy.** The platform keeps a library of designs, and choosing one produces a new template in the sender's account, based on that design but independent of it. Edits to the copy leave the library design untouched, and later updates to the library do not change the copy.

The copy opens in an email editor, usually a drag-and-drop one such as the [Topol Email Editor](/glossary/topol-email-editor/), where it can be edited like a template built from scratch. Text, images, colours, links and layout can all change, and [merge tags](/glossary/merge-tag/) replace placeholder names and order details with per-recipient data.

Libraries are usually browsable by kind of email and by visual style, with a preview of each design before a copy is made.

## Why premade templates are useful

HTML email is harder to build than a web page. **Mail clients render the same code differently**, so a layout needs table-based structure, [inline CSS](/glossary/inline-css/) and testing in several clients before it looks right everywhere. A premade design has usually been built with those constraints in mind, including a responsive layout for phones, which gives a sender a working foundation instead of an empty template.

They suit teams without a dedicated email designer and emails that follow well-known patterns. A heavily customised brand or an unusual layout can be faster to build from scratch, since a design that matches none of the library options needs most of its structure replaced anyway.

## Best practices for premade templates

- **Brand first:** the colours, fonts, logo and footer are replaced before content is written, so the copy never ships with library defaults.
- **Placeholder sweep:** every sample text, stock image and example link is replaced, because a leftover placeholder is easy to miss in a long layout.
- **Shared parts saved once:** a header or footer finished on the first template is stored as a [saved block](/glossary/saved-block/) and reused, so templates started from different library designs still look like one brand.
- **Rendering test:** the finished template is tested in the major mail clients, since customisation can break what the original design handled.

A template started from a library design is a normal template from then on. Content changes over time belong in a new [template version](/glossary/template-version/) of that template, not in a fresh copy of the library design.

## Premade template in Lettr

**Lettr's template gallery opens from Emails and New Template** and shows all available premade templates alongside a Create from scratch option. Style and category dropdown filters narrow the list, and clicking a template shows a full preview of its design.

Clicking Create Template creates a new template in the account with the premade design and opens it in the visual editor. The new template is an independent copy, so changes to it do not affect the original premade template and library updates do not change the copy. It appears among the account's templates like any other, with full editing and versioning capabilities.

During onboarding, Lettr automatically populates the account's folders with premade templates that match the business type, ready to customise and send. Lettr's AI assistant, Adamko, can clone a premade template for a fast untouched copy, or adapt the closest premade design to described content and apply the brand's colours, fonts and footer automatically. The [Premade Templates](https://docs.lettr.com/learn/templates/premade-templates) page compares premade templates with starting from scratch.
