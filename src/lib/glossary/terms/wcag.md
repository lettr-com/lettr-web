---
term: WCAG
fullName: Web Content Accessibility Guidelines
question: What is
description: "WCAG is the W3C standard for accessible web content, including HTML email. Its levels, what it asks of email, and how Lettr's docs and editor apply it."
related: [dark-mode-email, multipart-message, rendering-engine, content-block]
reading:
  - title: Email Accessibility
    href: https://docs.lettr.com/knowledge-base/best-practices/email-accessibility
  - title: Topol Email Editor
    href: https://docs.lettr.com/learn/templates/topol-editor
---

**WCAG (Web Content Accessibility Guidelines)** is the W3C standard for making web content usable by people with disabilities, including people who rely on screen readers, screen magnification, keyboard navigation or high contrast. It is written for web pages, but an HTML email is web content rendered inside a mail client, so the same criteria serve as the reference for accessible email. Accessibility laws and procurement rules in many countries point to WCAG as the measure of compliance.

## How WCAG is organized

WCAG groups its requirements under four principles: content must be perceivable, operable and understandable, and it must work reliably with browsers and assistive technologies. **Each principle breaks down into testable success criteria**, such as providing a text alternative for non-text content or keeping a minimum contrast ratio between text and its background. Every criterion is assigned one of three conformance levels.

- **Level A:** removes the most basic barriers, such as images with no text alternative.
- **Level AA:** adds requirements such as minimum contrast, and is the level most organizations and regulations target.
- **Level AAA:** the strictest level, rarely required for a whole site or email program.

The guidelines are versioned. WCAG 2.2 is the current recommendation and builds on 2.0 and 2.1, so content that meets 2.2 at a level generally meets the earlier versions too.

## What WCAG means for email

**Text alternatives come first.** Every image needs an `alt` attribute that describes its content or its action, and decorative images get an empty `alt=""` so screen readers skip them. Contrast comes next: at Level AA, normal text needs a contrast ratio of at least 4.5:1 against its background and large text at least 3:1.

Structure carries the rest. Real heading tags and list markup let screen reader users jump through a message, and layout tables are commonly marked with `role="presentation"` so their rows and cells are not announced as data. A `lang` attribute on the outer element tells a screen reader which pronunciation rules to use, and link text such as "View your invoice" makes sense out of context where "Click here" does not.

Email adds constraints that web pages do not have. Mail clients strip or rewrite parts of the markup, so the [rendering engine](/glossary/rendering-engine/) of each client decides how much semantic structure survives. Images are often blocked until the reader allows them, which makes live text a requirement for anything critical. [Dark mode](/glossary/dark-mode-email/) adjusts colors on the recipient's side and can undo contrast that passed in the original design.

## Common problems with email accessibility

- **Image-only emails:** a message built as one large image gives a screen reader nothing to read and shows nothing when images are blocked.
- **Missing alt attributes:** without `alt`, screen readers often announce the image filename instead.
- **Color as the only signal:** a status shown only as a red or green dot is lost on recipients with color vision deficiencies.
- **HTML with no text part:** a [multipart message](/glossary/multipart-message/) with a plain text alternative serves recipients whose clients or preferences favour plain text.

## WCAG in Lettr

**The Lettr Email Accessibility guide applies WCAG contrast ratios to email**: 4.5:1 for body text, and 3:1 for large text, meaning 18px or larger or 14px bold, and for UI components such as buttons and links. It recommends descriptive alt text for content images and an empty `alt=""` for decorative ones, `role="presentation"` on every layout table, heading tags for hierarchy, a `lang` attribute on the outer HTML element, and body text of at least 14px with 16px preferred.

For emails sent through the API, the guide says to include both the `html` and `text` fields, so every email carries a plain text version next to the HTML.

In the Topol editor, the image and GIF [content blocks](/glossary/content-block/) include an alt text setting, and merge tags can be placed in image alt text. When asked to review a template, Lettr's AI assistant, Adamko, flags missing alt text among its layout risks, together with fixed widths that break on mobile and custom HTML without dark-mode handling. The [Email Accessibility](https://docs.lettr.com/knowledge-base/best-practices/email-accessibility) guide includes a checklist covering each of these points.
