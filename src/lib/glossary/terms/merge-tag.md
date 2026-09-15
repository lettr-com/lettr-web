---
term: Merge Tag
heading: "What is a merge tag?"
description: "A merge tag is a placeholder in an email template that is replaced with recipient-specific data at send time. How merge tags work and Lettr's template syntax."
published: 2026-09-14
updated: 2026-09-14
related: [substitution-data, loop-block, template-slug, editor-settings, click-tracking]
reading:
  - title: Personalization and Dynamic Content
    href: https://docs.lettr.com/knowledge-base/best-practices/personalization-dynamic-content
  - title: Template Language
    href: https://docs.lettr.com/learn/templates/template-language
  - title: Editor Settings
    href: https://docs.lettr.com/learn/templates/editor-settings
---

**A merge tag** is a placeholder in an email template, such as `{{ first_name }}` or `{{ order_id }}`, that is replaced with recipient-specific data when the email is sent. One template can then serve every recipient, with names, order numbers and links filled in for each message. The values come from data supplied with the send request, usually called [substitution data](/glossary/substitution-data/).

## How merge tags work

A template marks each placeholder with delimiters, and the email platform's renderer processes the template at send time. **For every tag, the renderer looks up the name in the data** and writes the value in its place. The delimiters vary between systems: double curly braces are common, used by Handlebars, Liquid and SparkPost-style template languages, while Mailchimp uses the `*|FNAME|*` form.

Most template languages go beyond plain substitution. A default value fills in when data is missing, so a greeting reads "Hello there" instead of "Hello ,". Conditionals render a section only when a value is true, and loops repeat markup for each item in an array, which visual editors expose as a [loop block](/glossary/loop-block/).

Escaping is the part that matters for security. In HTML content, an inserted value should be HTML-escaped, so a name that contains `<script>` is displayed as text instead of being executed as markup. Template languages usually offer a separate unescaped form for trusted HTML, such as a pre-rendered block produced by the application.

## Common problems with merge tags

**Missing data is the most visible failure.** A tag whose value is absent usually renders as an empty string, which leaves broken sentences like "Hi ," or an empty order number in a subject line. Defaults and conditionals catch the common cases, and test sends with realistic data catch the rest.

Name mismatches cause the same symptom without an error. Keys are generally case-sensitive, so a template that expects `FIRST_NAME` renders nothing when the data carries `first_name`. The template and the code that builds the data need a shared, written contract for field names.

Links deserve extra care. [Click tracking](/glossary/click-tracking/) rewrites the links it can recognize, and a URL whose protocol is stored inside the variable instead of written literally in the template may not be recognized or tracked. Values inserted into a URL also need URL encoding, which a template language usually applies automatically inside `href` attributes.

## Best practices for merge tags

**Give every tag that appears in visible copy a sensible default**, especially in greetings, subject lines and button labels. Keep naming consistent across templates, so `order_id` means the same thing in the confirmation, the shipping notice and the receipt.

Keep business logic in the application. Templates can compare and branch, but calculations and decisions belong in the code that prepares the data, where they can be tested. Reserve unescaped output for content the application produced itself, never for text a user typed.

## Merge tag in Lettr

**Lettr's template language uses double curly braces**, and whitespace inside them is ignored, so `{{first_name}}` and `{{ first_name }}` behave the same. Values come from the key-value pairs of the `substitution_data` object in the send request, with loop data passed as an array of objects, while the separate `metadata` object is not rendered in templates and is passed to webhooks instead.

The `or` operator supplies a default, as in `{{ first_name or 'Customer' }}`. In HTML content, double braces HTML-escape the value, and triple braces insert it unescaped, which the docs reserve for trusted content. Statements use the same braces, with `{{if}}` blocks closed by `{{end}}` and `{{each array}} ... {{end}}` loops. Keys may contain only US-ASCII letters, digits and underscores, cannot start with a digit, and words such as `email`, `address` and `each` are reserved.

In the Topol editor, merge tags come from team-wide [Editor Settings](/glossary/editor-settings/), where a tag's value is generated from its text in uppercase with underscores, so "First Name" becomes `{{ FIRST_NAME }}`. Campaigns add `{{unsubscribe_link}}` and `{{webversion_link}}`, which become signed per-recipient URLs at send time. The [Template Language](https://docs.lettr.com/learn/templates/template-language) page documents every operator and link behavior.
