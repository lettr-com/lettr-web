---
term: Domain Reputation
question: What is
description: "Domain reputation is the trust mailbox providers place in a sending domain based on past mail. What shapes it, how it differs from IP reputation, and Lettr."
related: [sender-reputation, ip-reputation, google-postmaster-tools, warm-up, subdomain]
reading:
  - title: Sending Reputation
    href: https://docs.lettr.com/knowledge-base/best-practices/sending-reputation
  - title: IP and Domain Warm-Up Guide
    href: https://docs.lettr.com/knowledge-base/best-practices/ip-domain-warmup
  - title: Subdomain vs Root Domain
    href: https://docs.lettr.com/knowledge-base/fundamentals/subdomain-vs-root
---

**Domain reputation** is the trust a mailbox provider places in a sending domain, based on the mail it has received from that domain over time. Providers use it to decide whether new messages from the domain reach the inbox, go to spam or are rejected. It is tracked separately from [IP reputation](/glossary/ip-reputation/), and major providers, Gmail in particular, now give it more weight than the reputation of the sending IP address.

## How domain reputation works

A provider can only credit or blame a domain it can identify with confidence, so **authentication is what ties mail to a domain's reputation**. The DKIM signing domain, the SPF-checked Return-Path domain and the visible From domain are the identities a provider can attach behavior to once they pass authentication. Unauthenticated mail gives it much less to go on.

The behavior itself comes from a set of signals. Bounce rates show whether the sender mails addresses that exist. Complaint rates show how many recipients report the mail as spam. Spam trap hits reveal old or harvested lists, engagement shows whether recipients open, click and reply, and sending patterns show whether volume is steady or erratic. Each provider combines these in its own way and keeps the result private.

Subdomains carry reputations of their own. Mail from `news.example.com` builds a record separate from `mail.example.com`, although providers can also take the parent domain into account.

## Domain reputation vs IP reputation

**IP reputation stays with the address, and domain reputation follows the domain.** When a sender changes IP addresses or moves to another email service provider, its IP reputation starts over on the new addresses, but its domain reputation, good or bad, moves with it. Changing providers therefore does not repair a damaged domain.

On shared IP addresses, IP reputation is pooled with every other sender on the same infrastructure, while domain reputation reflects only the domain owner's own practices. That makes the domain the lever a sender controls directly. [Sender reputation](/glossary/sender-reputation/) is the umbrella term for both.

Providers do not publish a score, but some offer a view of it. [Google Postmaster Tools](/glossary/google-postmaster-tools/) shows the domain reputation Gmail assigns, together with spam rate and authentication results, for domains that send enough mail to Gmail.

## How to build and protect domain reputation

A new domain has no history, and providers treat unknown senders with caution. **A [warm-up](/glossary/warm-up/) builds that history deliberately**: low daily volume to the most engaged recipients first, then gradual increases while bounce and complaint rates stay healthy. A bounce rate below 2% is healthy, and Google recommends keeping the spam complaint rate below 0.1%.

Separating mail streams limits the damage any one of them can do. Marketing email draws more complaints than transactional email, so sending it from its own [subdomain](/glossary/subdomain/) keeps a reputation problem there away from password resets and receipts on another subdomain.

Recovery is slow. A damaged domain needs lower volume, a fixed root cause, a list cleaned of hard bounces, complainers and inactive recipients, and sending restricted to engaged recipients before volume rises again. Providers need to see sustained good behavior, so recovery takes weeks.

## Domain reputation in Lettr

**Lettr has no single reputation score**, and no API returns one. The Lettr docs point to the individual signals instead, read from the dashboard and webhook data. In Analytics, the breakdown table can group metrics by Sending Domain to compare the performance of several verified domains, or by Recipient Domain and Mailbox Provider to find a problem at one provider.

Lettr removes the most damaging signals automatically. Hard-bounced addresses go on the suppression list, and a recipient who reports an email as spam is suppressed immediately. Each subdomain used to separate mail streams is added in Lettr as its own sending domain, with its own DNS records, and messages are signed with a DKIM key whose `d=` value is that sending domain.

New sending domains also go through Lettr's approval scoring, which checks domain age, naming patterns and the associated website before the domain can send. That score is Lettr's own screening to protect its shared sending infrastructure, not a mailbox provider's reputation. The [Sending Reputation](https://docs.lettr.com/knowledge-base/best-practices/sending-reputation) page in the Lettr docs covers warm-up, subdomain strategy and recovery.
