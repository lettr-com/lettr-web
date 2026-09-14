---
term: Bulk Sender
description: "A bulk sender sends 5,000 or more emails a day to Gmail or Yahoo users and must meet their 2024 rules. The requirements, and what Lettr covers for them."
related: [dmarc, one-click-unsubscribe, spam-complaint, google-postmaster-tools, batch-sending]
reading:
  - title: Google & Yahoo Sender Requirements
    href: https://docs.lettr.com/knowledge-base/compliance/google-yahoo-requirements
  - title: Complaints & Unsubscribes
    href: https://docs.lettr.com/learn/suppressions/complaints-unsubscribes
  - title: DMARC Configuration
    href: https://docs.lettr.com/learn/domains/dmarc
---

**A bulk sender**, in the sense Google and Yahoo use for their 2024 sender requirements, is any sender that sends 5,000 or more emails per day to Gmail or Yahoo recipients. Crossing that threshold brings a stricter set of rules covering authentication, unsubscribing and spam complaints. The classification is about volume, not the kind of mail, so a high-volume transactional sender is a bulk sender too.

## How bulk sender status works

Google and Yahoo began enforcing the requirements in February 2024. **The threshold counts messages sent to the provider's own users in a day.** Google treats a sender that has crossed the threshold once as a bulk sender from then on.

Volume to other mailbox providers does not count toward the threshold, but the rules match what most receivers expect anyway. Following them below 5,000 messages a day is good practice, and it means nothing has to change when volume later crosses the threshold.

## Bulk sender requirements

The rules fall into four groups:

- **Authentication:** SPF and DKIM must pass for the sending domain, a [DMARC](/glossary/dmarc/) record must be published with at least `p=none`, and the domain in the From header must align with the domain SPF or DKIM authenticated.
- **Unsubscribing:** marketing and promotional mail must support [one-click unsubscribe](/glossary/one-click-unsubscribe/) through the `List-Unsubscribe` and `List-Unsubscribe-Post` headers, show a visible unsubscribe link in the body, and honor requests within 2 days. Purely transactional mail is exempt.
- **Spam complaints:** the [spam complaint](/glossary/spam-complaint/) rate must stay below 0.3%, with 0.1% as the target, measured through tools such as [Google Postmaster Tools](/glossary/google-postmaster-tools/).
- **Infrastructure:** sending IPs need valid forward and reverse DNS, mail must travel over TLS and follow RFC 5322, and the From header must not impersonate `@gmail.com`.

## Why bulk sender rules matter

**Non-compliance shows up directly as rejected and filtered mail.** Gmail and Yahoo reject mail that fails the authentication checks, often with a `550 5.7.26` reply, and those rejections count as bounces on the sending side. Mail that is accepted can still go to the spam folder when authentication is incomplete or complaints run high, and a sender close to the limits may see Gmail slow acceptance and defer messages.

A complaint rate that stays above 0.3% is the most serious case, because it can lead to the domain being blocked outright. Recovery then means fixing the cause, cutting volume and rebuilding reputation gradually.

## Bulk sender vs batch sending

**Bulk is about daily volume** to a provider's users. [Batch sending](/glossary/batch-sending/) is about request structure: putting many recipients in one API call. A bulk sender almost always batches, but every copy in a batch still counts as one message toward the 5,000 threshold and toward the complaint rate.

## Bulk sender in Lettr

Lettr covers **the parts of the requirements that sit in the sending infrastructure**. It signs every email with a DKIM key specific to the sending domain, with a `d=` value matching that domain, so DKIM alignment is in place once the domain is verified. Reverse DNS records for the sending IPs are managed by Lettr, and Lettr negotiates TLS with the recipient's server when available. The DMARC record is the domain owner's to add at `_dmarc.example.com`, and its state appears as `dmarc_status` when the domain is retrieved through the API.

Campaigns handle unsubscribing. Every campaign must include an unsubscribe mechanism, exposed as the `{{unsubscribe_link}}` merge tag, which becomes a signed per-recipient link to a hosted preferences page. If a marketing campaign's HTML has no unsubscribe tag, Lettr appends a default footer before sending. One-click unsubscribes through the `List-Unsubscribe` header skip the page and take effect immediately, and they arrive as `unsubscribe.list_unsubscribe` webhook events, with body link unsubscribes arriving as `unsubscribe.link_unsubscribe`.

Complaints arrive as `message.spam_complaint` events, and the complaining recipient is suppressed immediately. The [Complaints & Unsubscribes page](https://docs.lettr.com/learn/suppressions/complaints-unsubscribes) treats a complaint rate below 0.1% as healthy and 0.1% to 0.3% as a warning.
