---
term: STARTTLS
question: What is
description: "STARTTLS is the SMTP command that upgrades a plaintext mail connection to an encrypted TLS session. How it works, downgrade risks, and STARTTLS in Lettr."
related: [tls, esmtp, smtp-relay, smtp, ehlo-helo]
reading:
  - title: SMTP Protocol Basics
    href: https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics
  - title: SMTP Getting Started
    href: https://docs.lettr.com/quickstart/smtp/introduction
  - title: How Email Delivery Works
    href: https://docs.lettr.com/knowledge-base/fundamentals/how-email-delivery-works
---

**STARTTLS** is an [SMTP](/glossary/smtp/) command that upgrades an existing plaintext connection to an encrypted one. The client and server begin a normal session, the server advertises support for the command, and the client asks to switch; both sides then run a [TLS](/glossary/tls/) handshake and continue over the encrypted channel. RFC 3207 defines it for SMTP, and it is the most widely used way to encrypt email in transit between servers.

## How STARTTLS works

**The upgrade happens inside the SMTP conversation.** The client connects, receives the `220` greeting and sends `EHLO`. When the server lists `STARTTLS` among its [ESMTP](/glossary/esmtp/) extensions, the client sends `STARTTLS`, the server answers with a `220` ready reply, and the TLS handshake follows on the same TCP connection.

After the handshake, both sides discard what they learned in plaintext. The client sends [EHLO](/glossary/ehlo-helo/) again and receives a fresh extension list over the encrypted channel, because the first list could have been altered by someone on the network path. Authentication with `AUTH` and the message transfer take place only after this second greeting.

STARTTLS is used on port 25 between mail servers and on port 587 for submission from applications and mail clients. Both ports start in plaintext, so the same port can serve clients that encrypt and, where the server permits it, clients that do not.

## STARTTLS vs implicit TLS

Implicit TLS starts encryption before any SMTP traffic. **On port 465 the TLS handshake is the first thing on the connection**, and the SMTP greeting arrives already encrypted, much as HTTPS works for web traffic. RFC 8314 recommends implicit TLS for submission, while STARTTLS remains the standard between mail servers on port 25, where no separate encrypted port exists.

For an application sending through an [SMTP relay](/glossary/smtp-relay/), both modes are secure when configured correctly, and the choice usually depends on the mail library and the network. The setting has to match the port. A client expecting implicit TLS on a STARTTLS port waits for a handshake the server never starts, and a client speaking plaintext to an implicit TLS port fails before the greeting.

## Common problems with STARTTLS

**Opportunistic STARTTLS can be stripped.** Most delivery between servers uses STARTTLS opportunistically: the sender encrypts when the receiver advertises support and falls back to plaintext when it does not. An attacker on the network path can remove the `STARTTLS` line from the EHLO reply, and a sender that accepts plaintext then delivers the message unencrypted, with no error on either side.

Opportunistic senders also rarely enforce certificate validation, since refusing delivery over a certificate mismatch would stop legitimate mail. That protects against passive eavesdropping but not against an active attacker impersonating the receiving server.

Enforced TLS closes these gaps at a cost. A sender configured to require TLS fails the delivery instead of falling back to plaintext. MTA-STS lets a receiving domain publish over HTTPS that it supports TLS and which MX hosts should present valid certificates, so compliant senders refuse to downgrade, and DANE offers a similar guarantee through DNSSEC-signed records. Support for both varies between providers.

Submission clients have a problem of their own: sending `AUTH` before the upgrade completes puts the credentials on the network in plaintext.

## STARTTLS in Lettr

**Lettr's SMTP relay at `smtp.lettr.com` accepts STARTTLS on ports 587 and 2587** and implicit TLS on ports 465 and 2465, with the 2xxx ports as alternates when a restrictive firewall blocks the standard ones. The relay authenticates with a Lettr API key. The SMTP Protocol Basics guide warns that an application sending `AUTH` before `STARTTLS` transmits its credentials in plaintext, and advises establishing TLS first.

The framework guides show how to select each mode. In Laravel, ports 587 and 2587 use `MAIL_ENCRYPTION=tls` and ports 465 and 2465 use `MAIL_ENCRYPTION=ssl`. PHPMailer uses `PHPMailer::ENCRYPTION_STARTTLS` for STARTTLS and `PHPMailer::ENCRYPTION_SMTPS` with port 465 for implicit TLS. For TLS or SSL handshake errors, the SMTP guide's troubleshooting points to a mismatch between the encryption setting and the port, outdated TLS libraries, or older clients that do not support modern TLS versions.

For delivery to recipients, Lettr negotiates TLS encryption with the receiving mail server when it is available, using opportunistic TLS for the widest possible delivery coverage. The [SMTP Protocol Basics](https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics) page explains STARTTLS, implicit TLS and the difference between opportunistic and enforced TLS.
