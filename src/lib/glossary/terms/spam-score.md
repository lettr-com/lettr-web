---
term: Spam Score
question: What is
description: "A spam score is the number a spam filter gives a message to decide whether it is junk. How filter scoring works, why scores mislead, and what Lettr checks."
related: [content-filtering, spam-complaint, inbox-placement, seed-list, sender-reputation]
reading:
  - title: Spam Filtering
    href: https://docs.lettr.com/learn/inbound/spam-filtering
  - title: Emails Landing in Spam
    href: https://docs.lettr.com/knowledge-base/troubleshooting/spam-placement
  - title: Templates & Campaigns
    href: https://docs.lettr.com/learn/ai-assistant/content-creation
---

**A spam score** is a number a spam filter assigns to an email to express how likely it is to be spam. The filter runs a set of tests on the message, adds or subtracts points for each test that matches, and compares the total with a threshold that decides whether the message is delivered normally, sent to a junk folder or rejected. The best-known scoring filter is Apache SpamAssassin, whose default configuration treats a message scoring 5 points or more as spam.

## How spam scoring works

**Rule-based filters add points per matching test.** SpamAssassin checks headers, body text, links, HTML structure and authentication results, and each rule carries a weight. A subject line in capitals, a link to a domain on a URI blocklist or a failed DKIM check adds points, while some rules, such as a valid signature from a trusted source, subtract them. The result is written into headers such as `X-Spam-Status` so that later systems in the delivery path can act on it.

Many scoring filters also consult outside data. DNS-based blocklists for sending IPs and linked domains, Bayesian classifiers trained on a site's own mail, and checksum databases of known spam all feed into the total.

Large mailbox providers work differently. Gmail, Outlook.com and Yahoo run proprietary systems that weigh [sender reputation](/glossary/sender-reputation/), recipient engagement and complaints alongside content, and they do not publish a score or its components. **No message has a single spam score**: each filter produces its own, on its own scale.

## Why spam scores are an incomplete picture

Pre-send checking tools run a message through SpamAssassin or a similar engine and report the result. A clean score shows that the content avoids known rule-based triggers, which is useful for catching broken HTML, missing headers or suspicious links. **It does not predict placement at the large providers**, whose decisions rest mostly on reputation and recipient behaviour that no pre-send tool can see.

The reverse holds too. A message with a mediocre test score can reach the inbox for a sender whose recipients open, reply and rarely complain, and a perfect score cannot rescue mail with a high [complaint](/glossary/spam-complaint/) rate. Measuring [inbox placement](/glossary/inbox-placement/) with a [seed list](/glossary/seed-list/) observes the outcome instead of estimating it, with limits of its own.

## Common content triggers

[Content filtering](/glossary/content-filtering/) rules differ between filters, but a handful of patterns raise scores almost everywhere:

- **Image-only messages:** a body that is one large image with little text resembles image spam and gives the filter nothing to read.
- **Shouting and spam vocabulary:** subject lines in capitals, strings of exclamation marks and phrases such as "act now" match long-standing rules.
- **Link problems:** URL shorteners, plain `http://` links and link text showing a different domain from the real destination.
- **Structural gaps:** malformed HTML and an HTML body with no plain text alternative trip structural rules.

## Spam score in Lettr

**Adamko, Lettr's AI assistant, reviews templates for spam triggers** before a big send. His template review checks for shouting subject lines, image-only bodies, `http://` links, URL shorteners and a size that gets clipped by Gmail, alongside broken merge tags, missing compliance elements such as an unsubscribe link and postal address on campaign templates, and layout risks such as missing alt text. Each finding comes with a concrete fix.

The Emails Landing in Spam guide lists content issues that trigger spam filters, including all caps, excessive punctuation, spam trigger words, image-only emails, URL shorteners, misleading subject lines and too many links, and places content review next to authentication, domain reputation and sending pattern checks. Test emails go through Lettr's full delivery pipeline to chosen addresses, with tracking disabled and analytics excluded, so a template can be checked in real mailboxes before the actual send.

A message rejected by a policy rule before delivery was attempted fires a `message.policy_rejection` webhook event, which the docs attribute to content filtering, rate limits or a configuration issue. A `message.delivery` event confirms only that the recipient's mail server accepted the email, not that it reached the inbox. The [Emails Landing in Spam](https://docs.lettr.com/knowledge-base/troubleshooting/spam-placement) guide walks through the full diagnosis in order.
