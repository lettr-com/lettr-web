---
term: Policy Rejection
question: What is
description: "A policy rejection is an email refused under a rule rather than for a bad address, by the sending platform or the receiving server. How Lettr reports each."
related: [content-filtering, bounce, blocklist, dmarc, acceptable-use-policy]
reading:
  - title: Event Types
    href: https://docs.lettr.com/learn/events/event-types
  - title: Bounce Diagnosis
    href: https://docs.lettr.com/knowledge-base/troubleshooting/bounce-diagnosis
  - title: Reading the Dashboard
    href: https://docs.lettr.com/learn/analytics/reading-the-dashboard
---

**A policy rejection** is an email refused because it breaks a rule, not because the address or mailbox is invalid. The rule can belong to either end of the path. A sending platform can stop a message before any delivery attempt, for example because of its content or a rate limit, and a receiving server can refuse mail from a valid sender to a valid mailbox because of an authentication failure, a blocklist listing or its own filtering rules. The two cases are reported in different places.

## How policy rejections work

**On the sending side, the check runs before the message leaves the platform.** The platform evaluates it against its own rules, such as content filters, sending rate limits and account or configuration requirements, and a message that fails is never handed to the recipient's mail server. The receiving provider never sees it.

On the receiving side, the check runs during the SMTP session. The receiving server looks at the connecting IP address, the sending domain's authentication and the message itself, and refuses with a 5xx reply when a policy applies. Typical causes are a failed [DMARC](/glossary/dmarc/) check on a domain with a `p=reject` policy, a sending IP or domain listed on a [blocklist](/glossary/blocklist/), and content that local rules refuse. Enhanced status codes in the `5.7.x` range usually mark these security and policy refusals, as in Gmail's `550 5.7.26` for unauthenticated mail.

## Policy rejection vs hard bounce

A hard bounce means the recipient cannot receive mail, because the address does not exist or the domain has no mail server. **A policy rejection means the recipient could receive mail, but not this message from this sender.** Suppressing the address after a receiving-side policy rejection addresses the wrong problem, because the same block usually applies to every recipient at that provider.

Receiving-side policy rejections still arrive as [bounces](/glossary/bounce/), so the reply text is what tells them apart. The enhanced status code and the server's message separate "user unknown" from "blocked", and a rise in blocks at one provider points to a reputation or authentication problem on the sending side.

## Common causes of policy rejections

- **Authentication failures:** missing or misaligned SPF or DKIM, or a DMARC policy the mail does not pass. Correcting the DNS records clears these.
- **Reputation blocks:** a listed IP or domain, or complaint rates the provider will not accept. The listing needs investigating, and the list or content problem behind it fixed, before a delisting request has a chance.
- **Content rules:** [content filtering](/glossary/content-filtering/) that refuses specific links, attachments or patterns, which can happen on either side of the path.
- **Platform rules:** the sending platform's own rate limits and its [acceptable use policy](/glossary/acceptable-use-policy/), which block prohibited content before it is sent.

## Policy rejection in Lettr

**In Lettr, a policy rejection means the message was stopped before delivery was attempted.** The `message.policy_rejection` webhook event fires when an email is rejected due to a policy rule before delivery was attempted, which could be due to content filtering, rate limits or a configuration issue.

The Events dashboard shows it with an orange **Rejected** badge, meaning rejected by Lettr's infrastructure or by a policy rule before delivery was attempted.

The Analytics dashboard counts these under Policy Rejections, an injection metric for emails rejected due to a policy rule such as a content or rate policy. Refusals by the recipient's server show up as bounces instead. The Block Bounces delivery metric counts bounces caused by the recipient's server blocking the sending IP or domain, and Lettr's bounce classes include mail blocks by the receiving server, with separate classes for general, spam-related and content blocks.

The [Bounce Diagnosis](https://docs.lettr.com/knowledge-base/troubleshooting/bounce-diagnosis) guide covers the SMTP response codes behind receiving-side refusals.
