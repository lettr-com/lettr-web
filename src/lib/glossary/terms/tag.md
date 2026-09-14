---
term: Tag
question: What is
description: "A tag is a short label attached to an email at send time to group similar messages in reports. How tags differ from metadata and how Lettr sets them."
related: [template-slug, email-engagement, batch-sending, transactional-email]
reading:
  - title: Email Tags
    href: https://docs.lettr.com/learn/sending/tags
  - title: Filtering and Breakdowns
    href: https://docs.lettr.com/learn/analytics/filtering-and-breakdowns
  - title: Metadata
    href: https://docs.lettr.com/learn/sending/metadata
---

**A tag** is a short text label attached to an email when it is sent, used to group messages of the same kind for reporting. A password reset might carry `password-reset` and a weekly digest `weekly-digest`, and the sending platform can then show delivery and engagement figures for each group. A tag describes what kind of email a message is, not who received it or which record in the application it belongs to.

## How tags work

The label travels with the send request and is stored with the message. **Reporting then aggregates on the label**: sent, delivered, bounced, opened and clicked counts are summed per tag, so a single view compares receipts with newsletters without listing individual messages. Many different messages share one tag, which is the point, since a label unique to each message would only produce groups of one.

Platforms differ in how many tags a message may carry. Some accept a list of labels, so a message can belong to several groups at once, and others allow exactly one. With a single tag every message sits in exactly one group and the totals across tags add up to the total volume. Multiple tags allow overlapping groups, at the cost of counting the same message in several of them.

Tags are usually plain strings with a length limit and a restricted character set, such as letters, digits, hyphens and underscores. The limits keep them usable as filter values and as row labels in reporting tables.

## Tags vs metadata

Both are attached at send time, and they are easy to confuse. **A tag is one label shared by many messages**, meant for grouping. Metadata is a set of key-value pairs specific to one message, such as an order ID or a customer ID, meant for linking an event back to a record in the application.

The difference shows in where each one is used. Tags feed dashboards, filters and breakdowns, where a small number of distinct values keeps reports readable. Metadata comes back in webhook payloads and API queries, where a unique value per message lets a handler find the right order without another lookup. An order number stored as a tag creates thousands of one-message groups, and a category stored only in metadata stays out of the reports that need it.

## Best practices for tags

- **Name the email type, not the send:** `order-confirmation` stays meaningful for years, while a tag with a date or campaign number splits one kind of email into many small groups.
- **Keep the set small:** a few dozen distinct values make a breakdown readable, and a tag per recipient or per request makes it useless.
- **Separate the streams:** giving [transactional email](/glossary/transactional-email/) and promotional mail different tags lets their bounce and complaint figures be read on their own.
- **Agree on one format:** a single convention, such as lowercase words joined by hyphens, stops `Welcome`, `welcome_email` and `welcome-email` from showing up as three groups.

Tags pair naturally with templates. A tag that matches the [template slug](/glossary/template-slug/) gives one reporting group per template, which is often the grouping a team wants when it compares [engagement](/glossary/email-engagement/) across its emails. A [batch sending](/glossary/batch-sending/) job that delivers one kind of email to many recipients usually applies the same tag to every message in it.

## Tag in Lettr

**A Lettr send request carries its tag in the `tag` field**, and the PHP SDK sets it with the `->tag()` method on the email builder. Each email can carry one tag of up to 64 characters, written as a plain string of letters, numbers, hyphens and underscores.

When an email is sent with a `template_slug`, Lettr sets the tag to the template slug on the server, so analytics are grouped by template without passing a tag at all. An explicit `tag` in the request takes priority over the automatic one. The same grouping gives each template in the Emails dashboard **Sent**, **Opened** and **Rate** columns.

The home dashboard includes an **Analytics by Tag** widget with Sent, Opened and Rate per tag for the last 30 days. Campaign sends are excluded from it, and emails sent without a tag are grouped in an **Untagged** row. On the Analytics page, Tag is one of the filter types in the **Configure** modal and one of the dimensions in the **Break Down By** dropdown below the chart.

For data about a single email, the docs point to `metadata` instead: key-value pairs with string values that appear in webhook payloads, API queries and the dashboard, suited to linking emails to orders, customers or internal IDs. The [Email Tags](https://docs.lettr.com/learn/sending/tags) page compares tags and metadata side by side.
