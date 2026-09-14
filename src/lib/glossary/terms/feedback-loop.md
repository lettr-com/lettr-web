---
term: Feedback Loop (FBL)
question: What is
description: "A feedback loop (FBL) is how a mailbox provider reports spam complaints back to the sender. How FBLs work, which providers run them and how Lettr acts on them."
related: [spam-complaint, arf, jmrp, suppression-list, google-postmaster-tools]
reading:
  - title: What Are Feedback Loops?
    href: https://docs.lettr.com/knowledge-base/concepts/feedback-loops
  - title: Complaints and Unsubscribes
    href: https://docs.lettr.com/learn/suppressions/complaints-unsubscribes
---

**A feedback loop (FBL)** is a service a mailbox provider runs to tell senders when recipients mark their email as spam. When a user clicks "Report spam" or "Mark as junk", the provider sends a complaint report to the address registered for the sending IP or domain, which for most senders belongs to their email service provider. The report lets the sender stop mailing that person immediately, before further complaints damage its reputation.

## How feedback loops work

**Enrollment comes first.** A sender or its email service provider registers with each provider's program, proving control of the sending IP addresses or the signing domain, and names an address to receive reports. Microsoft's [JMRP](/glossary/jmrp/) is registered per IP address, while Yahoo's program identifies the sender by the domain in its DKIM signature.

From then on, each complaint produces a report. The provider builds it in [ARF](/glossary/arf/) (Abuse Reporting Format, RFC 5965), a MIME message with a human-readable summary, machine-readable fields such as `Feedback-Type`, and the original message or its headers. The receiving system parses the report, matches it to the original send and records the complaint.

Matching is the tricky part, because providers often redact the recipient's address in the returned copy. Senders therefore rely on identifiers they control, such as the `Message-ID` or a custom header added at send time, to connect a report to a recipient.

## Which providers run feedback loops

**Coverage is uneven.** Yahoo and AOL run one of the original programs, with ARF reports that include full message headers. Outlook.com and Hotmail report through Microsoft's Junk Mail Reporting Program, and Microsoft's Smart Network Data Services add IP-level reputation data alongside it.

Gmail does not offer a traditional feedback loop. It publishes complaint data in aggregate through [Google Postmaster Tools](/glossary/google-postmaster-tools/), so a sender sees a complaint rate for its domain rather than individual reports, and Google requires a `List-Unsubscribe` header from bulk senders so recipients have an alternative to the spam button. Apple processes complaints without a public enrollment program, and many corporate mail systems handle complaints internally and never report them outside.

A complaint count built only from FBL reports therefore misses part of the picture, and provider dashboards such as Postmaster Tools cover some of the rest.

## Why feedback loops matter

**A [spam complaint](/glossary/spam-complaint/) is one of the most heavily weighted signals in sender reputation**, and a complaint carries far more weight than an unsubscribe. A feedback loop is often the only way a sender learns about individual complaints, which makes it the basis for stopping mail to people who do not want it.

The expected response is immediate suppression. Every further message to a recipient who complained invites another complaint and pushes the complaint rate up, and Google requires bulk senders to keep that rate below 0.3%.

Feedback loop data also points at causes. A cluster of complaints tied to one campaign, list source or template usually means mail went to people without clear consent, arrived more often than promised, or hid the unsubscribe link so the spam button was the easier way out.

## Feedback loop in Lettr

For email sent through Lettr, **complaint reports go to Lettr's feedback loop processing infrastructure**, so ARF reports never need parsing in the application. Lettr identifies the original message and recipient, records the event and adds the address to the [suppression list](/glossary/suppression-list/) automatically, which blocks later sends to it even when an application explicitly requests one.

Each complaint fires a `message.spam_complaint` webhook event. Its payload carries `rcpt_to` with the recipient who complained, `message_id`, `timestamp`, `fbtype` with the feedback type (typically `abuse`) and `rcpt_meta` with the custom metadata from the original send, which links the complaint back to the application's own records.

In the Events dashboard a complaint appears as a red **Spam** event, and the Analytics dashboard counts Spam Complaints over time. Audience contacts who complain get the status `complained` and are excluded from campaigns. The Lettr docs treat a complaint rate below 0.1% as healthy and 0.1% to 0.3% as a warning. The [Complaints and Unsubscribes](https://docs.lettr.com/learn/suppressions/complaints-unsubscribes) page documents the payload.
