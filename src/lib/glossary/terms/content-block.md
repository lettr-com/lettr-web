---
term: Content Block
question: What is
description: "A content block is one element of a drag-and-drop email template, such as text, an image or a button. The block types in Lettr's Topol editor, explained."
related: [topol-email-editor, structure, saved-block, loop-block, merge-tag]
reading:
  - title: Topol Email Editor
    href: https://docs.lettr.com/learn/templates/topol-editor
  - title: Saved Blocks
    href: https://docs.lettr.com/learn/templates/saved-blocks
  - title: Loop Blocks
    href: https://docs.lettr.com/learn/templates/loop-blocks
---

**A content block** is a discrete element of a drag-and-drop email template, such as a paragraph of text, an image, a button or a divider. Visual email editors build a template from layout containers and fill those containers with blocks, and each block type has its own settings for alignment, padding, colors and fonts. The editor converts the arrangement into email HTML, so the person building the template never writes table markup by hand.

## How content blocks work

Email HTML depends on table-based layouts to render consistently across clients, Outlook desktop in particular. **A visual editor hides that layer** behind a simple hierarchy. In the [Topol email editor](/glossary/topol-email-editor/), a template is a stack of [structures](/glossary/structure/), each structure is split into columns, and content blocks sit inside the columns as the smallest unit of the template.

A structure is a horizontal section of the email with 1 to 8 columns, and on mobile its columns stack vertically by default. A column is a container with its own background, border and padding. The content block holds the actual content, and selecting one on the canvas opens a configuration panel with the settings for that block type.

Blocks inherit template-wide defaults from the Settings panel, such as fonts, link color and button styles. A value set on an individual block overrides the default for that block only, so exceptions do not change the template's baseline.

## Types of content blocks

The Topol editor supports ten content block types:

- **Text:** inline editing with a formatting toolbar and merge tag insertion.
- **Image:** a single image from the File Manager or an external URL, with alignment, width, alt text and an optional link.
- **GIF:** an animated GIF from an external URL, with built-in Giphy search.
- **Button:** a call-to-action link with label, URL, colors, font, corner rounding, padding and width.
- **Spacer:** adjustable vertical space between elements.
- **Divider:** a horizontal line that is solid, dashed or dotted, with color, thickness and width.
- **Social:** a row of icons linking to social profiles.
- **Video:** a clickable thumbnail linking to an externally hosted video, since most email clients cannot play video inline.
- **HTML:** raw HTML in a code editor with syntax validation.
- **Product:** a composite block filled from an XML product feed with image, name, description, price and a button.

**The HTML block is the one exception to the editor's rendering guarantees.** Custom markup bypasses the cross-client output the other blocks produce, so it needs testing in the target email clients before production use.

## Content blocks vs saved blocks

A content block is a single element, while a [saved block](/glossary/saved-block/) is a whole section kept for reuse. **Saved blocks store a structure together with its content** and insert it into other templates. A saved section becomes an independent copy once inserted, and a synced section keeps a live link to the source, so an edit updates every template that uses it.

A [loop block](/glossary/loop-block/) is different again. It renders a section repeatedly for each item in an array of data supplied at send time, which suits product listings and order summaries.

## Content block in Lettr

Lettr's visual template editor is the Topol email editor, and every block type above is available in it. **All blocks share the move, duplicate, save and delete actions**, and each block has its own padding and margin settings. Images uploaded through the File Manager are stored on the team's storage and served from the team's storage domain, so an image used in one template is available in all of them.

[Merge tags](/glossary/merge-tag/) can be placed in text blocks, link URLs, image alt text and button labels, and their values come from `substitution_data` in the send request. When the editor is opened from the campaign builder, text blocks also offer `{{unsubscribe_link}}` and `{{webversion_link}}`.

Individual blocks can be hidden on desktop or on mobile. Hidden content is still rendered in the HTML and hidden with CSS, so it counts toward the email's size. A visual template can be converted to custom HTML from the **More** menu, after which the structure and block model is no longer maintained. The [Topol Email Editor](https://docs.lettr.com/learn/templates/topol-editor) page in the Lettr docs documents every block setting.
