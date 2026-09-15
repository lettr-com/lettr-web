---
term: Rendering Engine
heading: "What is a rendering engine?"
description: "A rendering engine is the part of an email client that turns HTML and CSS into what the reader sees. Why engines differ and how Lettr helps test across them."
published: 2026-09-14
updated: 2026-09-14
related: [inline-css, dark-mode-email, mua, amp-for-email, email-clipping]
reading:
  - title: Email Rendering Across Clients
    href: https://docs.lettr.com/knowledge-base/fundamentals/email-rendering-clients
  - title: Email Content Rendering Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/rendering-issues
  - title: Content Types
    href: https://docs.lettr.com/learn/sending/content-types
---

**A rendering engine** is the part of an email client that interprets a message's HTML and CSS and draws the result on screen. Web browsers have converged on shared standards, but email clients use a mix of engines, one of them built for a word processor, and many clients also rewrite or remove code before it reaches the engine. Those differences are the main reason the same HTML email looks different from one inbox to the next.

## How rendering engines work in email

The engine depends on the kind of client. **Desktop and native apps bring their own engine**: Outlook for Windows uses Microsoft Word's HTML rendering engine, Apple Mail uses WebKit and Thunderbird uses Gecko, the engine behind Firefox. Mobile mail apps vary by platform and app, and many display messages in a system web view.

Webmail works in two steps. The message is drawn by the browser the recipient happens to use, but before that the webmail service sanitizes the HTML: it removes scripts, rewrites or prefixes class names and limits CSS so the email cannot break the surrounding interface. Gmail uses its own processing that limits and rewrites CSS, so what a Gmail reader sees depends on both that processing and the browser.

The [mail user agent](/glossary/mua/) makes one more set of changes on top. Clients apply their own [dark mode](/glossary/dark-mode-email/) color adjustments, block remote images until the reader allows them, and wrap the message in their own layout.

## Why rendering engines matter

Layout is where the differences show first. **Word's engine ignores much of modern CSS**, including flexbox and grid, and handles margins, padding and background images unreliably. Emails meant to hold their structure in Outlook for Windows are still built with nested HTML tables and fixed widths on table cells.

Styling is the second area. Some clients drop `<style>` blocks or parts of them, so class-based styles disappear while styles written on each element survive, which is why [inline CSS](/glossary/inline-css/) remains the default approach for email. Support for media queries, web fonts and properties such as `border-radius` varies by client, and features like [AMP for Email](/glossary/amp-for-email/) render only in the clients that support them, with the HTML version shown everywhere else.

Size interacts with rendering too. Gmail cuts off large messages behind a link, a behaviour known as [email clipping](/glossary/email-clipping/), and verbose markup written to satisfy older engines pushes an email toward that limit.

## Best practices for rendering across engines

- **Build for the weakest engine first:** a table-based layout with inline styles renders acceptably in Word's engine and improves in more capable ones.
- **Treat advanced CSS as an enhancement:** rounded corners, web fonts and animations should be optional, with the email still readable where they are ignored.
- **Target Outlook separately when needed:** conditional comments such as `<!--[if mso]>` let a template give Word's engine its own markup without affecting other clients.
- **Provide fallbacks:** a background color behind background images, alt text on every image and a system font stack after any web font.
- **Test in real clients:** previews and simulators approximate engines, and only a delivered message shows what a client actually does.

## Rendering engine in Lettr

The Lettr Content Types guide recommends **HTML tables for multi-column layouts**, because Outlook's Word-based rendering engine does not support `flexbox` or `grid`. For class-based styles, the `inline_css` option converts the rules in a `<style>` block into inline `style` attributes on each element.

The test emails guide recommends sending tests to Gmail on web and mobile, to Outlook, whose Windows version uses Word's rendering engine, to Apple Mail and to at least one mobile client, then checking layout, images, fonts and button styling on each. In Editor Settings, which apply across the team, a list of test email addresses is pre-populated whenever a team member clicks **Send Test** in the editor, and the docs suggest adding addresses on different clients.

Templates built in the Topol editor are responsive by default: multi-column structures stack vertically on mobile, and **Hide on desktop** and **Hide on mobile** toggles show content only on one viewport size. The editor's desktop and mobile previews approximate how a template renders, and the docs note they are not a substitute for testing in actual email clients. The [Email Rendering Across Clients](https://docs.lettr.com/knowledge-base/fundamentals/email-rendering-clients) page compares CSS support by client.
