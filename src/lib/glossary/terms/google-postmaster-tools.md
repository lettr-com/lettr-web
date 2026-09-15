---
term: Google Postmaster Tools
heading: "What is Google Postmaster Tools?"
description: "Google Postmaster Tools is Google's free dashboard of Gmail data for a sending domain, such as spam rate. What it reports and how to use it with Lettr."
published: 2026-09-14
updated: 2026-09-15
related: [feedback-loop, spam-complaint, bulk-sender, domain-reputation, dmarc]
reading:
  - title: Gmail-Specific Delivery Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/gmail-delivery
  - title: Google and Yahoo Sender Requirements
    href: https://docs.lettr.com/knowledge-base/compliance/google-yahoo-requirements
---

**Google Postmaster Tools** is a free service from Google that shows senders how Gmail sees the mail coming from their domain. Once a sender verifies that it owns a domain, it can view data Gmail collects about that domain's traffic, including the rate of messages users report as spam, authentication results and delivery errors. The data covers Gmail recipients only and is not available from any other source, which makes the tool the main diagnostic for Gmail deliverability.

## How Google Postmaster Tools works

**Access is granted per domain.** A sender signs in with a Google account, adds the domain it sends from and proves ownership by publishing a TXT record in DNS. From then on, Google shows aggregate data about mail from that domain to Gmail users, never individual messages or recipients.

Data appears only when a domain sends a sufficient volume of mail to Gmail, so a new or low-volume domain can show empty reports even when the setup is correct. The figures are also reported after the fact, which means a change in sending practice shows up in the data with a delay.

Google has rebuilt Postmaster Tools, and some dashboards from the original version were retired or changed along the way. Older guides that describe specific reputation dashboards may no longer match what the tool shows today.

## What Google Postmaster Tools reports

The data falls into a few areas:

- **Spam rate:** the share of mail that Gmail users reported as spam, the figure Gmail's sender requirements are measured against.
- **Authentication:** how much of the domain's traffic passed SPF, DKIM and DMARC.
- **Encryption and delivery errors:** whether mail arrived over TLS, and the temporary and permanent errors Gmail returned.
- **Compliance:** whether the domain meets Gmail's requirements for senders.

**Spam rate is the number most senders watch.** Gmail does not run a traditional [feedback loop](/glossary/feedback-loop/) that reports individual complaints back to the sender, so Postmaster Tools is where Gmail complaint data becomes visible, as an aggregate rate for the domain.

## Why Google Postmaster Tools matters

Gmail enforces requirements for senders, and the strictest apply to [bulk senders](/glossary/bulk-sender/): SPF and DKIM authentication, a published [DMARC](/glossary/dmarc/) record, one-click unsubscribe for marketing mail and a low user-reported spam rate. **The spam rate target is below 0.1%, and the rate must stay under 0.3%.** Senders above that limit face throttling, spam folder placement and rejections at Gmail.

Much of what goes wrong at Gmail leaves no trace in a sending platform's own data. Mail filtered to spam still counts as delivered, because Gmail's servers accepted it, and a [spam complaint](/glossary/spam-complaint/) from a Gmail user produces no individual report. A rising spam rate or a new class of delivery errors in Postmaster Tools is often the first sign of a problem that delivery rates do not show.

The tool reports symptoms rather than fixes. Improving [domain reputation](/glossary/domain-reputation/) still comes down to consent, list quality and authentication, and Postmaster Tools shows whether those changes are working.

## Common problems with Google Postmaster Tools

**Empty dashboards are the most frequent complaint.** Data depends on sending volume to Gmail, so a domain that sends little mail to Gmail users can stay empty for a long time. The domain registered in the tool also has to be the one that actually appears in the mail, which matters for senders that use a subdomain for sending.

Verification is the other early obstacle. The TXT record has to resolve before Google accepts it, and DNS changes can take up to 48 hours to propagate, so a verification attempt right after publishing the record may fail.

## Google Postmaster Tools in Lettr

**Postmaster Tools is set up at Google, outside Lettr**, using the exact domain the mail is sent from in Lettr, including the subdomain where one is used. Google provides a TXT record to add at the DNS provider, and propagation can take up to 48 hours.

The Lettr docs use Google's thresholds for spam complaints: a target below 0.1% and a hard limit that must stay under 0.3%. Inside Lettr, a recipient marking an email as spam triggers the `message.spam_complaint` webhook event, which appears as a red spam badge in the Events dashboard and is counted by the Spam Complaints metric in Analytics. Gmail sends no traditional feedback loop reports and expects senders to watch its aggregate data instead, so the two sources are read together. Filtering Analytics by Mailbox Provider, or breaking metrics down by it, separates Gmail traffic for that comparison.

For Gmail's temporary `421-4.7.28` rate limiting errors, Lettr retries automatically, and the docs point to Postmaster Tools when a high spam complaint rate is the cause. The [Gmail-Specific Delivery Issues](https://docs.lettr.com/knowledge-base/troubleshooting/gmail-delivery) page covers setup and common Gmail blocks.
