---
term: Structure
heading: "What is a structure in an email template?"
description: "A structure is a horizontal layout section in a drag-and-drop email editor that holds columns and content. How structures work in Lettr's Topol editor."
published: 2026-09-14
updated: 2026-09-14
related: [content-block, saved-block, topol-email-editor, rendering-engine, email-clipping]
reading:
  - title: Topol Email Editor
    href: https://docs.lettr.com/learn/templates/topol-editor
  - title: Email Editor Best Practices
    href: https://docs.lettr.com/knowledge-base/best-practices/email-editor-best-practices
  - title: Saved Blocks
    href: https://docs.lettr.com/learn/templates/saved-blocks
---

**A structure** is a horizontal section of an email template in a drag-and-drop editor, the equivalent of a table row in hand-coded email HTML. It defines how many columns the section has and how those columns behave on desktop and mobile, and it holds the content placed inside them. A template is a vertical stack of structures, typically a header, a hero area, several content sections and a footer.

## How structures work

Email HTML relies on nested tables, because many clients, Outlook for Windows in particular, handle modern CSS layout poorly. **A structure generates that table scaffolding**, so the person building the template arranges sections and columns instead of writing markup. In the [Topol email editor](/glossary/topol-email-editor/) the structure is the top level of a three-part hierarchy, with columns inside it and [content blocks](/glossary/content-block/) inside the columns.

A structure carries section-level settings. The column count decides the grid, and the columns share the available width between them. Background color or image, borders, spacing above and below, and a narrow or full-width layout apply to the section as a whole, while each column keeps its own background, border and padding.

The order of work follows from the hierarchy. A content block cannot sit directly on the canvas, so building a template starts with placing structures and only then filling their columns.

## Structures and responsive layout

**Multi-column structures are where mobile layout is decided.** On a narrow screen, columns placed side by side become too cramped to read, so editors stack them vertically, the first column on top. Keeping related content together in one column, such as an image with its caption and button, keeps it together when the columns stack.

Stacking can be turned off for content that still reads well side by side at narrow widths, such as two small icons. Turning it off for text-heavy columns is the most common cause of broken mobile layouts.

Visibility toggles add a second tool. A structure can be hidden on desktop or on mobile, which allows a different version of a section for each device class inside one template. The hidden version remains in the HTML and is hidden with CSS, so it still adds to the message size and brings the email closer to [clipping](/glossary/email-clipping/) in Gmail. How any of this finally looks depends on each client's [rendering engine](/glossary/rendering-engine/), so previews in the editor are an approximation.

## Best practices for structures

- **One section, one structure:** a hero area built as a single structure stays easy to edit, and splitting a section across several structures pays off only when parts need different backgrounds or spacing.
- **Several small structures over one large one:** separate structures stack cleanly on mobile and are easier to rearrange.
- **Layout before content:** placing the skeleton of structures first avoids rebuilding sections after the blocks are in.
- **Reusable recurring sections:** headers and footers stored as a [saved block](/glossary/saved-block/) stay consistent across templates.

## Structure in Lettr

Lettr's visual template editor is the Topol email editor, where **templates are built from a hierarchy of structures, columns and content blocks**. Each structure holds one or more columns and has settings for background (solid color or background image), width (narrow and centered, or full-width), borders, top and bottom margins with internal padding, and mobile stacking, which starts out enabled. Columns share the structure's available width, and each column has its own background color, border, padding and margins.

Stacking can be disabled per structure when side-by-side rendering is required at all viewport sizes. Individual structures can be limited to one device class with the **Hide on desktop** and **Hide on mobile** toggles. Hidden content is still rendered in the HTML and hidden with CSS, so it counts toward the total email size, and the **Show hidden** toolbar button reveals it for editing.

Structures can be moved, duplicated, deleted or saved as reusable Saved Blocks, either as Saved Sections that insert independent copies or as Synced Sections that keep a live link to the source. In a multilingual template every language version shares the same structural layout, so adding, removing or rearranging structures in one language applies to all versions, and only the text inside blocks differs per language. Converting a custom HTML template to the visual editor parses the HTML into the structure, column and block model, and complex or non-standard HTML may need manual adjustment afterwards.

The [Email Editor Best Practices](https://docs.lettr.com/knowledge-base/best-practices/email-editor-best-practices) guide covers working with structures and columns in detail.
