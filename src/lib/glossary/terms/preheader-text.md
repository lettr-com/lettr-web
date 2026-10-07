---
term: Preheader Text
heading: "What is preheader text?"
description: "Preheader text is the preview snippet an inbox shows after the subject line. How mail clients pick it, how to set it with a hidden element, and Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [topol-email-editor, inbox-placement, dark-mode-email, marketing-email]
reading:
  - title: Topol Email Editor
    href: https://docs.lettr.com/learn/templates/topol-editor
---

**Preheader text** is the short line of text an inbox shows next to or below the subject line in the message list, before the email is opened. Mail clients take it from the start of the message body, so without a deliberate preheader the preview shows whatever text comes first, often a "View in browser" link or an image's alt text. A preheader written for the purpose extends the subject line and gives the recipient a second line of context.

## How preheader text works

**Mail clients build the preview from the first readable text in the email body.** They skip markup and read text in order, so the preview reflects the top of the HTML, whether that text was meant to be seen or not. Clients differ in how many characters they show, and the same message shows a longer preview on a wide desktop screen than on a phone, so no single length suits every client and the important words go first.

A deliberate preheader is a short text element at the very top of the body, hidden from the rendered email. Common techniques combine `display:none`, zero font size and height, and zero opacity, layered together because clients support different CSS. The text then reaches the inbox preview without appearing in the opened message.

When the preheader is shorter than the space a client offers, the client keeps reading and fills the rest of the preview with the next text in the body. Senders who want a clean preview add invisible spacer characters, such as zero-width non-joiners, after the preheader to push that text out of view.

Despite the name, a preheader is not an email header. It is body content, so it lives in the HTML like any other text.

## Why preheader text matters

**The preview is part of what recipients read before deciding to open.** Subject line and preheader work as a pair: the subject states the point, and the preheader adds a detail, a deadline or the next step instead of repeating it. A preview filled with navigation text or "Having trouble viewing this email" wastes that space.

Transactional mail benefits as well. An order confirmation whose preheader carries the order number and delivery date gives the recipient what they need from the inbox view alone.

The preview affects what happens once a message is in the inbox. Whether it gets there at all is a question of [inbox placement](/glossary/inbox-placement/), which depends on authentication, reputation and filtering, not on preview copy.

## Common problems with preheader text

- **Hidden text that shows:** a client that ignores one hiding style displays the preheader at the top of the message, which is why several styles are combined. Hiding by matching the text colour to the background fails in [dark mode](/glossary/dark-mode-email/), where clients can change either colour.
- **Accidental previews:** a template without a preheader shows alt text, a web-version link or legal copy in the inbox.
- **Repeated subject:** a preheader that restates the subject line uses the space without adding information.
- **Stale copy:** a preheader carried over from an earlier [marketing email](/glossary/marketing-email/) template no longer matches the new content, and because it is hidden, it is easy to miss in review.

## Preheader text in Lettr

**Lettr's visual editor has a Preview text setting** in its global template Settings panel, described as the preheader text shown in inbox previews alongside the subject line. The Settings panel configures template-wide defaults, and Preview text sits there next to settings such as template width, background color, font defaults and link color.

Templates built in the [Topol Email Editor](/glossary/topol-email-editor/) therefore carry their preheader as part of the template design. Emails sent with HTML written outside the editor include the preheader in that HTML, like any other body text. The [Topol Email Editor](https://docs.lettr.com/learn/templates/topol-editor) page lists every global template setting and how per-block overrides take precedence over them.
