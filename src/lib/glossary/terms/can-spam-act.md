---
term: CAN-SPAM Act
question: What is
description: "The CAN-SPAM Act is the US law for commercial email: honest headers, a postal address and a working opt-out. What it requires and how Lettr handles it."
related: [casl, gdpr, transactional-email, marketing-email, suppression-list]
reading:
  - title: CAN-SPAM Requirements
    href: https://docs.lettr.com/knowledge-base/compliance/can-spam
  - title: Unsubscribe Best Practices
    href: https://docs.lettr.com/knowledge-base/compliance/unsubscribe-best-practices
  - title: Campaign Content and Design
    href: https://docs.lettr.com/learn/campaigns/content-and-design
---

**The CAN-SPAM Act** is a United States federal law, enacted in 2003, that sets the rules for commercial email. The name stands for Controlling the Assault of Non-Solicited Pornography And Marketing. The Federal Trade Commission (FTC) enforces it, and it gives recipients the right to stop receiving commercial messages. It applies to any commercial email sent to recipients in the US, wherever the sender is located.

## How the CAN-SPAM Act works

The law covers commercial electronic mail messages, meaning email whose primary purpose is to advertise or promote a product or service. Marketing emails and newsletters with commercial content fall under it, and so do transactional emails that carry significant commercial content beyond the transaction. **Every commercial message has to meet seven requirements:**

- **Accurate header information:** the From, To, Reply-To and routing information identify the person or business that initiated the message.
- **Honest subject line:** the subject reflects what the message contains.
- **Ad disclosure:** a promotional message is clearly and conspicuously identified as an advertisement.
- **Physical postal address:** a street address, a PO Box registered with the US Postal Service, or a private mailbox registered with a commercial mail receiving agency.
- **Opt-out mechanism:** clear, conspicuous and working for at least 30 days after the message is sent.
- **Prompt opt-out handling:** requests are honored within 10 business days, with no fee, no information required beyond an email address, and no step other than a reply email or a visit to a single web page.
- **Oversight of third parties:** a company that hires another company to send its email stays legally responsible for compliance.

[Transactional emails](/glossary/transactional-email/) such as order confirmations, shipping notifications and password resets carry lighter obligations. They still need accurate headers and an honest subject line, but not the ad disclosure, the postal address or the opt-out. Fines apply to each non-compliant email, both the promoted company and the sender can be held liable, and severe cases can bring criminal penalties.

## CAN-SPAM Act vs CASL and GDPR

**CAN-SPAM follows an opt-out model.** It does not require prior consent, so a sender may email a recipient until that recipient unsubscribes. Canada's [CASL](/glossary/casl/) and the EU's [GDPR](/glossary/gdpr/) both require consent before the first commercial message, which means a program that satisfies CAN-SPAM alone can still break either law.

GDPR also requires records that prove valid consent, which CAN-SPAM does not. For a sender with recipients in both the US and the EU, applying GDPR's rules to every recipient is the simpler path, since they are stricter and cover what CAN-SPAM asks for.

## Common problems with CAN-SPAM compliance

**The unsubscribe link is the most frequent weak point.** A link that is tiny, low in contrast or buried in dense text fails the clear and conspicuous standard, even when it technically works. A manual opt-out process can also miss the 10 business day window.

The postal address is one of the most commonly overlooked requirements, and it has to be present in every commercial send. Subject lines that start with "Re:" or "Fwd:" on messages that are not replies or forwards count as deceptive, as does implied urgency or personal familiarity that does not exist.

Sending to a purchased list can technically comply with CAN-SPAM, but such lists tend to contain invalid addresses, [spam traps](/glossary/spam-trap/) and unengaged recipients. They damage deliverability even when every message meets the law.

## CAN-SPAM Act in Lettr

**Marketing campaigns built in Lettr must contain the `{{unsubscribe_link}}` merge tag.** At send time it becomes a signed, per-recipient URL to the hosted Manage email preferences page, where the recipient can untick topics, pause marketing email for 30, 60 or 90 days, or unsubscribe from everything. If the campaign HTML has no unsubscribe tag, Lettr appends a minimal default footer before the closing `</body>` tag, and the same fallback applies to test emails.

For emails sent through the API, an unsubscribe link marked with the `data-msys-unsubscribe="1"` attribute is handled by Lettr. A click adds the recipient to the [suppression list](/glossary/suppression-list/) and fires an `unsubscribe.link_unsubscribe` webhook event, and API sends need `options.transactional: false` for that suppression to apply. The opt-out is processed immediately, well inside the 10 business day limit. Click tracking must be enabled for the unsubscribe event to be generated.

The postal address and ad disclosure belong in the template footer, and sending from a verified domain that belongs to the organization keeps the From header accurate. Lettr's AI assistant, Adamko, can review a campaign template before a send and flags a missing unsubscribe link or postal address. The [CAN-SPAM Requirements](https://docs.lettr.com/knowledge-base/compliance/can-spam) page in the Lettr docs covers each rule with footer examples.
