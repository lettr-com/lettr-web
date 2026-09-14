---
term: Substitution Data
question: What is
description: "Substitution data is the set of values sent with an email request to fill a template's merge tags. How it works, common pitfalls, and Lettr's format."
related: [merge-tag, loop-block, template-slug, template-version, batch-sending]
reading:
  - title: Template Language
    href: https://docs.lettr.com/learn/templates/template-language
  - title: Personalization and Dynamic Content
    href: https://docs.lettr.com/knowledge-base/best-practices/personalization-dynamic-content
  - title: Batch Sending
    href: https://docs.lettr.com/learn/sending/batch-sending
---

**Substitution data** is the set of values an application sends with an email request so that a template's placeholders can be filled in at send time. The template contains [merge tags](/glossary/merge-tag/) such as `{{ first_name }}` or `{{ order_id }}`, and the substitution data supplies the name, order number or link that replaces each one. Keeping values apart from the design lets one stored template serve every recipient while the application sends only data.

## How substitution data works

Substitution data is usually a JSON object whose keys match the names used in the template. **The renderer resolves every tag against that object** as the message is generated. A plain key produces a value, a nested object is reached with dot notation such as `{{ address.city }}`, and an array feeds a loop that repeats a piece of markup once per item. Conditionals read booleans and numbers to decide whether a section appears at all.

Platforms differ in where data can be attached. Some accept values only for the whole request, and others also accept values per recipient, with the recipient's values taking priority on conflict. Where only request-level data exists, giving different people different values means sending them in separate requests.

Substitution data is also distinct from metadata. **Metadata travels with the message for reporting** and comes back in webhook events and logs, but it is never rendered into the content. An internal user ID belongs in metadata, while the customer's first name belongs in substitution data.

## Why substitution data matters

Substitution data is the boundary between code and content. Designers and marketers change a template's wording and layout without a deploy, and developers change which data is sent without touching HTML. A stable [template slug](/glossary/template-slug/) together with a documented set of keys forms the contract between the two sides.

Arrays make variable-length content possible. A [loop block](/glossary/loop-block/) in a visual editor, or a loop statement in custom HTML, renders one row per item, so an order confirmation with one product and one with twenty come from the same template.

## Common problems with substitution data

- **Key mismatches:** keys are usually case-sensitive, so `FIRST_NAME` in the template and `first_name` in the data leave the tag empty without raising an error.
- **Missing values:** a tag without data leaves gaps such as "Hi ," unless the template defines a fallback.
- **Unescaped HTML:** values inserted into HTML should be escaped, and raw output belongs only to markup the application generated itself.
- **Sensitive values:** passwords and full card numbers do not belong in substitution data, because they are written into rendered emails and often into logs.
- **Version mismatch:** a new [template version](/glossary/template-version/) that expects a new key renders incomplete emails for code that still sends the old set.

## Substitution data in Lettr

In Lettr, substitution data is the **`substitution_data` object in the send request**, which holds the variables for template substitution. It can contain strings, numbers, booleans, nested objects accessed with dot notation and arrays for looping. All values are converted to strings when rendered, while numbers and booleans still work in conditionals, and array indexes in bracket notation start at `1`. The separate `metadata` object is not used in templates and is available in webhooks instead.

The values apply to all recipients in the request. A request accepts up to 50 recipients, and the Batch Sending page describes `substitution_data` as merge tag values shared by everyone in a [batch](/glossary/batch-sending/), suited to variables like campaign names or dates. Keys may contain only US-ASCII letters, digits and underscores, cannot start with a digit, and must avoid reserved words such as `email`, `address`, `each` and `if`.

In HTML content, double braces HTML-escape a value and triple braces insert it unescaped, for trusted HTML. The `or` keyword supplies a fallback, as in `{{ first_name or 'Customer' }}`, and arrays are looped with `{{each array}} ... {{end}}`. A Loop Block in the Topol editor reads the array whose key matches its Loop Merge Tag value without the braces.

The `GET /api/templates/{slug}/merge-tags` endpoint returns the merge tags found in a template's active version, or in a version chosen with the `version` query parameter, which shows the `substitution_data` keys the template expects. Test emails accept `substitution_data` as well, and the docs recommend testing with both minimal and complete data to check conditionals, loops and defaults. For signed or single-use URLs, the docs advise passing them through `substitution_data` and disabling click tracking on those links. The [Template Language](https://docs.lettr.com/learn/templates/template-language) page documents every operator.
