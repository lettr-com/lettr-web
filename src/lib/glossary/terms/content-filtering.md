---
term: Content Filtering
question: What is
description: "Content filtering is how receiving mail servers scan subject lines, body text, links and images to catch spam. What filters check and how Lettr helps."
related: [spam-score, sender-reputation, inbox-placement, tracking-domain, phishing]
reading:
  - title: Emails Landing in Spam
    href: https://docs.lettr.com/knowledge-base/troubleshooting/spam-placement
  - title: Sending Best Practices
    href: https://docs.lettr.com/learn/sending/best-practices
---

**Content filtering** is the process by which receiving mail servers analyze the content of an email to decide whether it is spam. Filters examine the subject line, body text, HTML structure, links and images, and they combine machine learning, keyword analysis, URL reputation and sender history into a verdict. That verdict decides whether a message reaches the inbox, lands in the spam folder or is rejected outright.

## How content filtering works

Content is one of three factors behind spam placement, next to authentication gaps and reputation problems. **A content filter weighs many signals together** rather than blocking on a single rule, and the combined result is often expressed as a [spam score](/glossary/spam-score/) that the receiving system compares against its threshold.

The signals fall into a few groups. Text analysis looks at wording, capitalization and punctuation in the subject and body. Structural checks look at the HTML, the balance between text and images, and whether a plain text alternative exists. Link analysis checks the reputation of every domain the message links to or loads images from. Sender history tells the filter how past mail from the same domain was received, and new sending domains without history are treated with extra suspicion.

Filtering often happens after the receiving server has accepted the message. A successful delivery at the SMTP level therefore does not guarantee [inbox placement](/glossary/inbox-placement/), because the mailbox provider can still file the message as spam.

## What content filters check

These patterns are the most common content triggers:

- **Capital letters and punctuation:** ALL CAPS and runs like `!!!` match long-standing spam patterns.
- **Spam trigger words:** phrases such as "FREE", "ACT NOW" and "WINNER" in the subject or body.
- **Image-only emails:** filters cannot read text inside images, and spammers use images to evade text checks, so a text-to-image ratio of at least 60/40 is safer.
- **URL shorteners:** services such as bit.ly and tinyurl are heavily used in [phishing](/glossary/phishing/) and flagged automatically.
- **Misleading subject lines:** a subject that does not match the body.
- **HTML with no text alternative:** legitimate senders usually include both versions.
- **Too many links:** a high link count reads as promotional or spam content.

## Common problems with content filtering

**Link domains carry reputation that the sender does not always control.** A link rewritten through a shared tracking domain is associated with every other sender on that domain, and some filters treat unfamiliar third-party image hosts with lower confidence. A custom [tracking domain](/glossary/tracking-domain/) and a branded image domain keep both under the sender's own name.

Content fixes also have limits. Rewording a subject line does not help when DKIM or DMARC is failing or domain reputation is low, so authentication and reputation deserve a check before content. Filters differ between providers as well: Outlook filters emails with large images and little text more aggressively than Gmail, and it weighs recipient engagement heavily.

Spam placement produces no bounce and no error message, which makes content problems easy to miss. Low open rates are often the first sign.

## Content filtering in Lettr

**A `message.delivery` event in Lettr means the recipient's mail server accepted the email**, not that it reached the inbox, since the provider can still filter it to spam. A message rejected by a policy rule before delivery is attempted fires a `message.policy_rejection` event instead, which can be caused by content filtering, rate limits or a configuration issue. The Events dashboard shows it as an orange rejected badge.

Lettr's AI assistant, Adamko, can review a template before a big send. Among other checks, he flags shouting subject lines, image-only bodies, `http://` links, URL shorteners and a size that gets clipped by Gmail, each with a concrete fix.

Two domain settings cover the link and image signals. A custom tracking domain rewrites links through the sender's own subdomain instead of the shared default, and a storage domain serves template images from a branded URL. The [Emails Landing in Spam](https://docs.lettr.com/knowledge-base/troubleshooting/spam-placement) guide in the Lettr docs walks through authentication, reputation and content checks in order.
