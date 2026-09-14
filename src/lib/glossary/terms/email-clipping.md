---
term: Email Clipping
question: What is
description: "Email clipping is when Gmail cuts off a large message behind a View entire message link. What triggers it, what it hides and how Lettr catches it."
related: [open-tracking, tracking-pixel, inline-css, rendering-engine, can-spam-act]
reading:
  - title: Email Content Rendering Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/rendering-issues
  - title: Email Rendering Across Clients
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-rendering-clients
  - title: Templates and Campaigns with Adamko
    href: https://docs.lettr.com/learn/ai-assistant/content-creation
---

**Email clipping** is what an email client does with a message that is larger than it will display in full: it renders the top of the message and hides the rest behind a link. Gmail is the client known for it. It clips messages whose HTML exceeds roughly 102 KB and shows a "[Message clipped] View entire message" link where the content stops. The message is delivered in full, but the hidden part stays unrendered until the recipient opens the complete version.

## How email clipping works

**Gmail counts the size of the HTML, not the size of the images it references.** An image hosted on a server and loaded by URL adds only the length of its tag, while every character of markup counts: table structure, inline styles, comments, whitespace and content hidden with CSS. A short email can therefore clip, and a long one with lean markup can stay under the limit.

Everything past the threshold is cut. The recipient sees the upper part of the email followed by the clip notice, and the link opens the full message in a separate view. Clipping is a display decision made by the client after delivery, so the sending side receives no error or bounce when it happens.

## Why email clipping matters

**The content clipping hides is usually the content at the bottom.** Footers carry the unsubscribe link, the sender's postal address and legal text, and a clipped message hides all of them from a recipient who does not click through. Laws such as the [CAN-SPAM Act](/glossary/can-spam-act/) expect a visible opt-out, and a recipient who cannot find one is more likely to use the spam button instead.

Clipping also distorts measurement. [Open tracking](/glossary/open-tracking/) depends on a [tracking pixel](/glossary/tracking-pixel/), a tiny image that records an open when the client loads it. A pixel placed near the end of the HTML is cut off with the rest of a clipped message, so the open is never recorded and open rates read lower than they are.

Anything else placed low in a long message is affected the same way. Order details, a secondary call to action or a link the recipient needs stay hidden unless the recipient expands the message, and many recipients do not.

## Common causes of email clipping

Most clipped emails are not long to read. **Bloated markup is the usual cause**:

- **Duplicated inline styles:** some builders write the same CSS onto every element, which multiplies the size of the HTML. [Inline CSS](/glossary/inline-css/) is still needed, because Gmail strips `<style>` blocks, so the fix is fewer duplicates rather than no inlining.
- **Nested tables and empty elements:** table layouts nest quickly, and empty cells and spacer rows add bytes without adding content.
- **Hidden content:** blocks hidden with CSS still ship in the HTML and count toward the size.
- **Pasted custom HTML:** markup copied from another tool often brings comments, unused classes and editor-specific attributes with it.

## How to prevent email clipping

**The size of the final HTML is the number to check**, measured after merge tags and styles are applied, for example with `wc -c` on the exported file. The Lettr docs recommend staying well under 102 KB and treating 80 KB as the point to start trimming. Removing whitespace and comments, collapsing duplicated styles and simplifying nested tables usually brings a template back under the limit.

A real inbox is the final check. The [rendering engine](/glossary/rendering-engine/) of each client treats the same HTML differently, and a test message opened in Gmail shows directly whether the clip notice appears and what sits above it.

## Email clipping in Lettr

**Lettr's AI assistant, Adamko, checks for size that gets clipped by Gmail** when asked to review a template, alongside broken merge tags, a missing unsubscribe link and spam triggers such as URL shorteners, and each finding comes with a concrete fix. The review reads the actual template content, so it catches markup that has grown past the threshold before a large send.

Lettr records opens by inserting an invisible tracking pixel into HTML emails. In the Message Details view, each open event has a **Pixel** field that shows whether the pixel was placed at the top or the bottom of the email, which helps explain missing opens from a template that clips.

The send API's `inline_css` option converts `<style>` rules into inline `style` attributes, which keeps styling in clients that strip style blocks and also adds those attributes to every matching element. Test emails go through the same rendering pipeline as production sends, with tracking disabled and analytics excluded, so a test to a Gmail address shows what recipients will see. The [rendering issues guide](https://docs.lettr.com/knowledge-base/troubleshooting/rendering-issues) covers the clipping threshold and size reduction in detail.
