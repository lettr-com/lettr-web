---
term: Dark Mode
fullName: Dark Mode in Email
question: What is
description: "Dark mode in email recolors messages for dark backgrounds. How email clients apply it, what breaks, how to design defensively and how Lettr helps test it."
related: [rendering-engine, inline-css, wcag, topol-email-editor]
reading:
  - title: Dark Mode Email Design
    href: https://docs.lettr.com/knowledge-base/best-practices/dark-mode-design
  - title: Test Emails
    href: https://docs.lettr.com/learn/sending/test-emails
  - title: Campaign Content and Design
    href: https://docs.lettr.com/learn/campaigns/content-and-design
---

**Dark mode in email** is a display setting in email clients that shows messages as light text on dark backgrounds. When a reader turns it on, the client decides how to treat each incoming message: leave it as coded, recolor part of it or invert its colors entirely. The sender does not choose which of these happens, so an email built only for light backgrounds can show unreadable text, logos that lose their contrast or buttons that blend into the page.

## How dark mode works in email clients

Email clients use three strategies. **No change** renders the message exactly as coded, even when the rest of the client is dark. Partial inversion darkens light backgrounds and adjusts some text colors while keeping others. Full inversion flips every color, so light backgrounds turn dark and dark text turns light. The strategy depends on the client and the platform, and the same mail service can behave differently in its web, desktop and mobile apps.

Some clients let the email handle dark mode itself. The `color-scheme` and `supported-color-schemes` meta tags declare that the message is dark-mode aware, and a `@media (prefers-color-scheme: dark)` block in the `<style>` element supplies the dark palette. Many clients strip `<style>` blocks, so these rules are a progressive enhancement on top of a design that already reads acceptably without them.

The variation comes from the [rendering engine](/glossary/rendering-engine/) behind each client. Each engine supports a different subset of HTML and CSS, and each vendor applies its own color transformation on top of that.

## Common problems with dark mode

**Missing text colors cause the most failures.** When a text element has no explicit color, the client picks one, and in dark mode it may pick white while leaving a white background that the sender set untouched. The result is white text on a white background. Outlook desktop reads the `bgcolor` HTML attribute while other clients read the CSS `background-color` property, so a table cell that sets only one of them gets inconsistent treatment.

Images are the next weak point. A dark logo that depends on the light email background around it loses its contrast once the client darkens that background, and hero images with no clear edge blend into the page. Buttons fail in a similar way: a button whose shape comes only from its fill color loses its outline when that color is changed.

The meta tag carries a trap of its own. Declaring `color-scheme: light dark` without matching dark styles tells the client that the email handles dark mode, so the client may skip its own adjustments and leave the message unreadable.

## Best practices for dark mode

The approach is defensive: one message that reads acceptably under all three strategies instead of a design tuned for a single client.

- **Explicit colors:** text and background colors set on every element as [inline CSS](/glossary/inline-css/), with `bgcolor` next to `background-color` on table cells.
- **Softer extremes:** near-white backgrounds and near-black text instead of pure `#ffffff` and `#000000`, which adapt better when a client transforms them.
- **Contrast inside images:** logos and banners designed to stay legible on both light and dark backgrounds.
- **Bordered buttons:** a border in the same color as the button fill, which keeps the shape visible if the fill is inverted, and white text on the colored fill.

Contrast guidance from [WCAG](/glossary/wcag/) helps in both modes, because text that meets a contrast ratio against its own background does not depend on the page color around it. Dark mode behavior cannot be predicted from code alone, so testing across at least three clients is part of the process.

## Dark mode in Lettr

The visual editor for Lettr campaigns is a drag-and-drop builder powered by the [Topol email editor](/glossary/topol-email-editor/), and **it handles responsive design, dark-mode rendering and email-safe HTML output**. For hand-coded designs, the raw HTML editor gives fine control over inline styles and dark-mode CSS.

Test emails are real sends from a verified domain to chosen addresses, with tracking disabled and the sends excluded from analytics. They use the same rendering pipeline as production sends, and the Lettr dark mode guide recommends checking both light and dark mode every time a template changes. Before a big send, Adamko, Lettr's AI assistant, can review a template and flag layout risks, including custom HTML without dark-mode handling.

For recipients whose client still renders a campaign poorly, the optional `{{webversion_link}}` merge tag links to a hosted, in-browser version of the email. At send time Lettr replaces it with a unique signed URL for each recipient, and nothing is added when the tag is left out. The [Dark Mode Email Design](https://docs.lettr.com/knowledge-base/best-practices/dark-mode-design) guide in the Lettr docs covers meta tags, CSS overrides and a client testing checklist.
