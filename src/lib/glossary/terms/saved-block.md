---
term: Saved Block
heading: "What is a saved block?"
description: "A saved block is a reusable email section, such as a header or footer, stored once and inserted into many templates. Saved vs synced sections in Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [structure, content-block, topol-email-editor, loop-block]
reading:
  - title: Saved Blocks
    href: https://docs.lettr.com/learn/templates/saved-blocks
  - title: Email Editor Best Practices
    href: https://docs.lettr.com/knowledge-base/best-practices/email-editor-best-practices
  - title: Topol Email Editor
    href: https://docs.lettr.com/learn/templates/topol-editor
---

**A saved block** is a section of an email template stored in a shared library so it can be inserted into other templates. Headers with the brand logo, footers with the company address and social links, legal disclaimers and promotional banners are the typical candidates, because they repeat across many emails. Visual editors offer two behaviours for a saved block: an independent copy, or a live link that keeps every template in step with the original.

## How saved blocks work

In a drag-and-drop editor a template is a stack of layout sections, and a saved block stores one of those sections with everything inside it. **The unit being saved is usually a whole [structure](/glossary/structure/)**: its columns, the [content blocks](/glossary/content-block/) they hold, and styling such as backgrounds, padding and borders. The block keeps the editor's own design definition rather than rendered HTML, so it stays editable after insertion.

Saving adds the section to a library under a name, often inside a folder. Inserting it places a copy or a linked instance at the chosen position in the target template, where it behaves like any other part of the canvas. Libraries are usually shared by a whole team, which makes saved blocks a practical way to keep brand elements consistent across the people who build emails.

## Saved sections vs synced sections

**The two kinds differ in what happens after insertion.** A saved section is inserted as an independent copy. Editing it in one template changes only that template, and later edits to the library version never reach templates that already contain it. It suits starting points that get customised per email, such as a promotional layout with different copy each time.

A synced section keeps a live link to its source. Editing the source updates every template that contains it, which is exactly what content that must be identical everywhere needs: a legal footer, a postal address, a header logo. The same property makes synced sections riskier, because one edit reaches every email that uses them, including [transactional](/glossary/transactional-email/) templates already live in production.

The choice comes down to whether consistency or flexibility matters more for that piece of content. Brand elements and compliance text lean synced; campaign-specific layouts lean saved.

## Best practices for saved blocks

- **Descriptive names:** "Primary header with logo" is easier to find than "Header 1", and marking synced blocks in the name warns editors before they change one.
- **Synced only for fixed content:** addresses, disclaimers and logos stay synced, while anything that varies per email stays a saved copy.
- **Preview before editing a synced block:** every template using it changes at once, so the affected emails deserve a look first.
- **Check usage before deleting:** a template that depends on a synced block loses that section when the source disappears.
- **Regular cleanup:** unused blocks make the library harder to search and invite reuse of outdated designs.

## Saved block in Lettr

Lettr's saved blocks live in the [Topol email editor](/glossary/topol-email-editor/). **Structures and their content can be saved as reusable blocks** and inserted into other templates from the **Saved Blocks** panel. The library belongs to the team: all team members can use and manage the blocks, and blocks cannot be shared across teams.

Both behaviours are available. A Saved Section inserts an independent copy whose changes affect only that template, and a Synced Section maintains a live link, so saving changes to it updates all templates using it. When a team member updates a synced section, a teammate who has an affected template open sees the updated content without refreshing. A synced section can be unlinked inside a template, which converts it into an independent copy, and any section in the editor can be saved as a new synced section.

Folders organise the library and can be nested inside other folders. In API responses each block carries a `type` of `saved_section`, `synced_section` or `folder`, and a `definition` with its design and content, stored in Topol editor JSON format. Deleting a synced block breaks the templates that use it, so the docs advise checking which templates contain it first. Saved blocks also support translations for multilingual templates.

The [Saved Blocks](https://docs.lettr.com/learn/templates/saved-blocks) page covers creating, editing and converting both types.
