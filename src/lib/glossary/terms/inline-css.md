---
term: Inline CSS
heading: "What is inline CSS?"
description: "Inline CSS puts styles in each HTML element's style attribute, the most dependable way to style email across clients. Trade-offs, and Lettr's inline_css."
published: 2026-09-14
updated: 2026-09-14
related: [rendering-engine, dark-mode-email, email-clipping, topol-email-editor, cid]
reading:
  - title: Email Content Rendering Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/rendering-issues
  - title: Email Rendering Across Clients
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-rendering-clients
  - title: Content Types
    href: https://docs.lettr.com/learn/sending/content-types
---

**Inline CSS** is styling written directly on each HTML element through its `style` attribute, as in `<p style="color: #333333;">`, instead of in a `<style>` block or an external stylesheet. It is the most dependable way to style HTML email, because mail clients differ widely in how much CSS they accept from a `<style>` block, while inline styles work in every major client. Most email workflows keep styles in a stylesheet while building and convert them to inline styles as a final step.

## How inline CSS works in email

Each mail client renders HTML with its own [rendering engine](/glossary/rendering-engine/), and those engines are far less consistent than web browsers. **Some clients and contexts strip or rewrite `<style>` blocks**, and desktop Outlook renders HTML with the Microsoft Word engine, which ignores much of modern CSS. A declaration attached to the element itself is the form every client applies.

An inliner automates the conversion. It parses the stylesheet, works out which rules match each element using normal CSS specificity, and writes the resulting declarations into each element's `style` attribute. A rule such as `.button { background-color: #0066cc; }` becomes `style="background-color: #0066cc;"` on every element with that class.

Some CSS has no inline form, because it does not apply to a single element at a single moment. Media queries for mobile layouts, `:hover` states and `prefers-color-scheme` rules for [dark mode](/glossary/dark-mode-email/) have to stay in a `<style>` block. A typical email therefore carries both: inline styles for the baseline design and a small `<style>` block for enhancements in the clients that support it.

## Why inline CSS matters

**A layout built on class-based styles falls apart in a client that drops the stylesheet.** The message arrives as unstyled text with default fonts and missing button backgrounds, while the same email looks correct in clients that keep the `<style>` block. A test in one client therefore says little about the others.

Webmail adds a second reason. Webmail clients display the message inside their own page, and styles in a `<style>` block can be rewritten or prefixed so they do not affect the surrounding interface, which changes how those rules match. Styles on the element avoid that rewriting step.

## Common problems with inline CSS

**Inlining makes messages larger.** Every element repeats its declarations, and a long email with many table cells grows accordingly. Gmail clips messages larger than about 102 KB of HTML behind a "View entire message" link, so heavy inlining can push an email into [clipping](/glossary/email-clipping/). Removing unused rules and whitespace before inlining keeps the size down.

Hand-written inline styles are hard to maintain. Changing a brand colour means editing every element that uses it, which is why inlining belongs in a build step or an editor's export rather than in the source templates.

The cascade can also surprise. An inliner resolves specificity once, when it runs, so `!important` declarations, selectors the inliner does not support and rules that depended on source order can produce results that differ from the browser preview.

## Inline CSS in Lettr

**The Lettr send API has an `inline_css` option** in the request's `options` object. When enabled, Lettr converts the rules in a message's `<style>` block into inline `style` attributes on each element, so a `.header` rule becomes a `style` attribute on the `<h1>` that carries the class. The option is a boolean and is off unless the request sets it to `true`.

Lettr's rendering guide states that the [Topol editor](/glossary/topol-email-editor/) inlines CSS automatically when a template is exported. Inline styling is separate from inline images: Lettr does not currently support embedded images referenced through a [CID](/glossary/cid/) URL such as `cid:logo`, and such an image is delivered as a regular attachment rather than displayed in the body. The [Email Rendering Across Clients](https://docs.lettr.com/knowledge-base/fundamentals/email-rendering-clients) page covers client-by-client CSS support, table layouts and dark mode.
