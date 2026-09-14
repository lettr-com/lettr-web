---
term: Complaint
question: What is
description: "A complaint is recorded when a recipient marks an email as spam. How complaints reach senders through feedback loops, safe rates, and how Lettr handles them."
related: [feedback-loop, suppression-list, sender-reputation, arf, google-postmaster-tools]
reading:
  - title: List Hygiene
    href: https://docs.lettr.com/knowledge-base/best-practices/list-hygiene
  - title: Complaints and Unsubscribes
    href: https://docs.lettr.com/learn/suppressions/complaints-unsubscribes
  - title: What Are Feedback Loops
    href: https://docs.lettr.com/knowledge-base/concepts/feedback-loops
---

**A complaint** (spam complaint) is recorded when a recipient marks an email as spam or junk in their email client. The mailbox provider counts the report against the sender and, where it runs a [feedback loop](/glossary/feedback-loop/), sends it back to the sender or the sender's email service provider. Complaints are one of the most heavily weighted signals in sender reputation, which is why an address that complains should never receive mail from that sender again.

## How complaints work

A complaint starts with a button in the email client, labelled "Report Spam", "Mark as Junk" or similar. **Providers that run a feedback loop turn the click into a report**, usually in [ARF](/glossary/arf/) (Abuse Reporting Format, RFC 5965). The report carries the original message headers, or a redacted version, and a `Feedback-Type` such as `abuse` for a spam report or `fraud` for suspected phishing. It goes to the address registered in the provider's feedback loop program, which for most senders belongs to their email service provider.

Coverage differs between providers. Yahoo and AOL run one of the original feedback loops, with full message headers in each report. Outlook.com and Hotmail report through Microsoft's Junk Mail Reporting Program. Gmail offers no traditional feedback loop and instead exposes aggregate complaint data through [Google Postmaster Tools](/glossary/google-postmaster-tools/). Apple does not offer public enrollment, and many corporate mail systems handle complaints internally without reporting them outside.

As a result, not every complaint reaches the sender as an individual report. Some appear only as a rate in a provider's dashboard.

## Why complaints matter

**Complaint rate is the share of delivered emails that generate spam complaints**, and mailbox providers weigh it heavily in [sender reputation](/glossary/sender-reputation/). Google requires bulk senders to stay below 0.3% and recommends staying below 0.1%.

A complaint weighs more than a bounce. A bounce shows that an address is bad, while a complaint is a person telling their provider that the sender's mail is unwanted. It also weighs more than an unsubscribe, which is a neutral signal that the recipient used the proper way out. That difference makes an easy unsubscribe a deliverability measure, since every recipient who unsubscribes instead of complaining leaves the sender's reputation intact.

## Common causes of complaints

**Mail sent without clear consent causes the most complaints.** Purchased lists and addresses added without an opt-in reach people who never asked for the messages, and they have extremely high complaint rates. Double opt-in confirms both that an address works and that its owner wants the mail.

Broken expectations come next. Mail that exceeds the frequency promised at signup, or strays from the content the recipient chose, draws complaints. Segmenting the audience and sending each segment only what it signed up for keeps the mail relevant.

A hidden unsubscribe link turns opt-outs into complaints, because the spam button is always visible. One-click unsubscribe through the `List-Unsubscribe` header puts a proper exit next to it in supporting clients. Role-based addresses such as `info@` and `support@` generate complaints too, since they often go to shared inboxes read by people who never subscribed.

## Complaint in Lettr

**Lettr is enrolled in feedback loop programs with major mailbox providers** and processes complaint reports automatically. The complaining address is added to the [suppression list](/glossary/suppression-list/) immediately and permanently, which blocks later sends to it even when an application explicitly requests one.

Each complaint fires a `message.spam_complaint` webhook event. The payload includes `rcpt_to` for the recipient who complained, `fbtype` for the feedback type (typically `abuse`) and `rcpt_meta` with the custom metadata from the original send. In the Events dashboard a complaint shows as a red spam badge, and the Analytics dashboard tracks a Spam Complaints metric over time.

The Lettr docs recommend reviewing targeting and content when the complaint rate rises, and warn that high complaint rates can lead to sending being suspended. The [Complaints and Unsubscribes](https://docs.lettr.com/learn/suppressions/complaints-unsubscribes) page covers the webhook payload and suppression behaviour.
