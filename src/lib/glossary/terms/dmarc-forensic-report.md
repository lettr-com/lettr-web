---
term: Forensic Report (RUF)
question: What is
description: "A DMARC forensic report (RUF) is a per-message failure report with headers of mail that failed DMARC. What it holds, why few receivers send it, and Lettr."
related: [dmarc, dmarc-aggregate-report, dmarc-alignment, arf, email-spoofing]
reading:
  - title: DMARC records in Lettr
    href: https://docs.lettr.com/learn/domains/dmarc
  - title: Understanding SPF, DKIM, and DMARC
    href: https://docs.lettr.com/knowledge-base/fundamentals/spf-dkim-dmarc
---

**A DMARC forensic report (RUF)** is a report about a single message that failed DMARC authentication, sent by the receiving mail server to the address in the `ruf` tag of the domain's DMARC record. Unlike an aggregate report, which summarizes a day of traffic, it describes one message: its headers or full content, where it came from and which checks failed. Forensic reports are also called failure reports, and they are much harder to come by than aggregate reports because many receivers do not send them.

## How forensic reports work

The domain owner requests them in the [DMARC](/glossary/dmarc/) record. **The `ruf` tag names one or more `mailto:` destinations**, as in `v=DMARC1; p=none; rua=mailto:dmarc@example.com; ruf=mailto:dmarc-forensic@example.com`. The optional `fo` tag chooses which failures trigger a report: `0`, the default, reports when both SPF and DKIM fail to produce an aligned pass, `1` reports when either one fails to produce an aligned pass, `d` reports any DKIM signature failure and `s` reports any SPF failure.

A receiver that supports failure reporting sends a report for each qualifying message, close to the time it arrives, instead of batching results into a daily file. The report uses the [ARF](/glossary/arf/) format with a `Feedback-Type` of `auth-failure`, as defined in RFC 6591. Its machine-readable part names the reported domain, the source IP address and the authentication results, and the attached copy holds the original headers and sometimes the complete message.

When the destination address is on a different domain from the one publishing the policy, the receiving domain has to publish a DNS record authorizing it to receive reports, the same rule that applies to aggregate reports.

## Forensic report vs aggregate report

The two report types answer different questions. **An [aggregate report](/glossary/dmarc-aggregate-report/) shows the pattern**: every source IP sending as the domain, message counts, SPF and DKIM results, and the disposition applied, with no message content and no recipient addresses. It is the report used to find legitimate senders and plan a move from `p=none` to enforcement.

A forensic report shows the individual case. Headers such as From, Subject, Message-ID and Received make it possible to identify exactly which system produced a failing message, whether a misconfigured internal service or a phishing run forging the domain. That detail helps investigate [email spoofing](/glossary/email-spoofing/) and pinpoint a broken signing configuration faster than aggregate numbers can.

In practice the aggregate report is the dependable one. Most large mailbox providers send it, while few send forensic reports, so a DMARC rollout is planned around aggregate data and uses forensic reports as supporting evidence when they exist.

## Common problems with forensic reports

**Privacy is the main reason forensic reports are scarce.** A failure report can contain the recipient's address, the subject line and message content, which is personal data under laws such as the GDPR. Many large mailbox providers, Gmail among them, do not send forensic reports at all, and receivers that do send them often redact personal fields or limit the report to headers.

The address in `ruf` also receives sensitive data from third parties. Reports about phishing sent in the domain's name contain real recipients' details, so the destination mailbox needs the same access controls as any other store of personal data, and some organizations decide not to request forensic reports for that reason.

Volume can be a problem in the other direction. A domain under a large spoofing attack, with `fo=1` set, can receive a report for every failing message from receivers that do send them, which floods a mailbox that is not filtered or processed by a reporting service.

## Forensic report in Lettr

Lettr's DMARC guide lists `ruf=` as an optional parameter holding the email address for forensic reports, next to the required `v=DMARC1` and `p=` tags. **Its basic example record includes only a `rua` address**, `v=DMARC1; p=none; rua=mailto:dmarc@example.com`, and its best practices recommend relying on aggregate reports because they are more useful and more widely sent than forensic reports.

The guide describes forensic reports as individual failure reports containing the original email headers, the authentication failure details, and timestamp and recipient information. It notes that they may contain sensitive information and that many receivers do not send them because of privacy concerns.

For mail sent through Lettr, messages are signed with a DKIM key specific to the sending domain, with the `d=` value set to that domain, so [DMARC alignment](/glossary/dmarc-alignment/) passes through DKIM for a verified domain. Domain verification reports the DMARC record as `dmarc_status`, with values such as `valid`, `invalid` for a record with syntax errors, and `missing`. The [DMARC records page](https://docs.lettr.com/learn/domains/dmarc) covers the record tags and the rollout from `p=none` to `p=reject`.
