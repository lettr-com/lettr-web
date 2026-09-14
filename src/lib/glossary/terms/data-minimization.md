---
term: Data Minimization
question: What is
description: "Data minimization means collecting and keeping only the personal data a purpose needs. What it requires of email senders and how it applies in Lettr."
related: [gdpr, data-processing-agreement, suppression-list, substitution-data]
reading:
  - title: Data Retention and Deletion
    href: https://docs.lettr.com/knowledge-base/compliance/data-retention
  - title: Data Privacy in Email Metadata
    href: https://docs.lettr.com/knowledge-base/compliance/data-privacy-metadata
  - title: GDPR and Email Sending
    href: https://docs.lettr.com/knowledge-base/compliance/gdpr-email
---

**Data minimization** is the principle that personal data must be adequate, relevant and limited to what is necessary for the purpose it was collected for. It is one of the core principles of the [GDPR](/glossary/gdpr/), set out in Article 5(1)(c), and privacy laws in other jurisdictions carry similar rules. For email, it governs what a signup form asks for, which personal details travel with each send and how long delivery records are kept.

## How data minimization works

The principle applies wherever personal data enters or moves through a system. **Under the GDPR, an email address is personal data**, and collecting addresses, storing lists, sending messages, tracking opens and clicks and keeping delivery logs all count as processing. Each of those activities needs a purpose, and the data involved has to fit that purpose.

At collection, the test is whether each field serves a stated purpose. A newsletter signup needs an email address. A phone number or date of birth on the same form needs its own reason, and without one it should not be there.

During processing, the test extends to every system the data passes through. Details added to a send for convenience, such as a customer name copied into metadata, are copied into the email platform's logs, its dashboard and every webhook consumer.

Over time, minimization pairs with the storage limitation principle in Article 5(1)(e): data is kept only as long as the purpose requires. In practice that means a defined retention period for each kind of email data, not an archive kept indefinitely in case it becomes useful.

## Why data minimization matters

**Data that was never collected cannot leak** and needs no protection. It also never has to be found when a request arrives. Individuals can ask for a copy of everything held about them or ask for it to be erased, and GDPR sets one month to respond to an erasure request. Every extra field and every extra system holding personal data is one more place to search.

Responsibility follows the data. The sender is the data controller and decides what to collect, while the email service provider is a processor acting on the sender's instructions. Personal data the controller passes to a processor without need is still the controller's to account for, which is why a [data processing agreement](/glossary/data-processing-agreement/) describes the categories of data involved.

## Best practices for data minimization

**Opaque identifiers replace personal details** wherever the receiving system only needs a reference. Metadata attached to a send can carry `user_id` and `order_id` values that the application resolves in its own database, instead of a name or phone number. The same applies to tags and custom headers, which are easy to overlook as places that hold personal data.

Email content deserves the same care. Masked values such as "card ending in 4242" replace full account numbers, sensitive actions like password resets use time-limited single-use tokens, and government IDs, health data and financial details stay out of email bodies. Values merged into a template as [substitution data](/glossary/substitution-data/) are stored by the platform too, so they belong in the same review.

One piece of data survives an erasure request on purpose. Keeping the email address on a [suppression list](/glossary/suppression-list/) after deleting everything else is compatible with the GDPR, because that minimum record is what stops the person from being contacted again.

## Data minimization in Lettr

When email is sent through Lettr, the sender is the data controller and **Lettr is the data processor**. Lettr processes recipient email addresses, email content, delivery and engagement events, and any custom data passed in the `metadata` parameter.

Metadata and `substitution_data` are stored by Lettr and visible in the dashboard, so personal data placed in them becomes part of what access and deletion requests have to cover. Metadata also goes to every configured webhook endpoint. The Lettr docs recommend passing an internal identifier such as `"customer_id": "usr_48291"` in metadata instead of `"customer_name"` and resolving the name in the sender's own systems.

Suppression records for bounced, complained and unsubscribed addresses are kept separately from email history and remain in place when email data is deleted. To delete a specific recipient's data from Lettr's systems, the sender contacts support@lettr.com with the email address and the sending domains involved. The [Data Retention and Deletion](https://docs.lettr.com/knowledge-base/compliance/data-retention) page in the Lettr docs covers deletion requests, access requests and the controller's responsibilities.
