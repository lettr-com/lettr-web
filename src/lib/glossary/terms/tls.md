---
term: TLS
fullName: Transport Layer Security
heading: "What is TLS?"
description: "TLS encrypts the connection between mail servers so messages cannot be read in transit. Opportunistic vs enforced TLS, its limits, and how Lettr uses it."
published: 2026-09-14
updated: 2026-09-14
related: [starttls, smtp, esmtp, smtp-relay]
reading:
  - title: SMTP Protocol Basics
    href: https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics
  - title: SMTP Getting Started
    href: https://docs.lettr.com/quickstart/smtp/introduction
---

**TLS (Transport Layer Security)** is a cryptographic protocol that encrypts a network connection between two systems. In email it protects each SMTP connection a message travels over, from the sending application to its mail server and from one mail server to the next, so the message and any login credentials cannot be read or altered by someone watching the traffic. It is the same protocol that secures HTTPS, and it replaced the older SSL, whose name is still often used for it.

## How TLS works in email

Every TLS session starts with a handshake. **The server presents a certificate**, the two sides agree on a cipher and exchange keys, and everything sent afterwards is encrypted. SMTP reaches that point in one of two ways. With [STARTTLS](/glossary/starttls/), the connection opens in plaintext, the server advertises the extension in its reply to EHLO, and the client sends the `STARTTLS` command to upgrade the session. With implicit TLS, the client negotiates TLS the moment it connects, before any SMTP command is exchanged.

STARTTLS is an [ESMTP](/glossary/esmtp/) extension, so it is only available when both servers speak extended [SMTP](/glossary/smtp/). Applications that submit mail usually connect on port 587 with STARTTLS or on port 465 with implicit TLS, while delivery between mail servers on port 25 relies on STARTTLS.

## Opportunistic vs enforced TLS

Between mail servers, TLS is usually opportunistic. **The sending server tries STARTTLS and falls back to plaintext** when the receiving server does not offer it or the handshake fails. Certificates are often not validated in this mode, because rejecting a self-signed or mismatched certificate would stop mail that could otherwise be delivered. Opportunistic TLS defeats passive eavesdropping, but an attacker who can modify traffic can remove the STARTTLS offer and force a plaintext session.

Enforced TLS closes that gap by refusing to deliver without an encrypted, validated connection. Standards such as MTA-STS and DANE let a receiving domain publish that it supports TLS and which certificates to expect, so a sending server that honours them refuses to fall back. Support varies between providers, and many domains publish neither.

## TLS vs end-to-end encryption

**TLS protects a connection, not the message.** Each server along the path decrypts the message on arrival, keeps it in its queue or mailbox in whatever form it stores mail, and opens a new connection for the next hop. A hop without TLS carries the message in plaintext, and the operator of every server along the path can read it. Keeping content private from end to end takes message-level encryption such as S/MIME or OpenPGP, which few recipients use.

TLS also says nothing about who wrote a message. Authenticating the sender is the job of SPF, DKIM and DMARC, which work the same way whether or not the connection was encrypted.

Outside SMTP, email depends on TLS in the form of HTTPS. Tracked links and tracking images load over HTTPS from a tracking domain, and webhook requests reach their endpoints over HTTPS, so a missing or expired certificate breaks those features even while mail delivery keeps working.

## TLS in Lettr

**Lettr negotiates TLS with the recipient's mail server when it is available.** The docs describe this as opportunistic TLS when delivering to recipient mail servers, chosen for the widest delivery coverage, and note that the vast majority of major mailbox providers support TLS, so most messages are encrypted in transit.

The [SMTP relay](/glossary/smtp-relay/) at `smtp.lettr.com` accepts implicit TLS on ports 465 and 2465 and STARTTLS on ports 587 and 2587, with 2465 and 2587 as alternates that often work behind restrictive firewalls. The docs warn that an application sending the `AUTH` command before issuing `STARTTLS` transmits its credentials in plaintext, and recommend establishing TLS first.

Custom tracking domains get SSL certificates that Lettr provisions and renews automatically, so tracking links use HTTPS. Event webhooks are sent to HTTPS endpoints, and an SSL or TLS error such as a certificate or handshake problem counts as a failed delivery that Lettr retries. The [SMTP Protocol Basics](https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics) page compares STARTTLS, implicit TLS and the opportunistic and enforced modes.
