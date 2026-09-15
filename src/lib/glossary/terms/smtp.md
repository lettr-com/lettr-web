---
term: SMTP
fullName: Simple Mail Transfer Protocol
heading: "What is SMTP?"
description: "SMTP is the protocol mail servers use to send email to each other. How an SMTP session works, ports and reply codes, SMTP vs API sending, and Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [ehlo-helo, esmtp, smtp-relay, mta, starttls]
reading:
  - title: SMTP Protocol Basics
    href: https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics
  - title: Sending via SMTP vs API
    href: https://docs.lettr.com/knowledge-base/best-practices/smtp-vs-api
  - title: SMTP Getting Started
    href: https://docs.lettr.com/quickstart/smtp/introduction
---

**SMTP (Simple Mail Transfer Protocol)** is the standard protocol for transferring email between servers. A client opens a TCP connection to a mail server, exchanges a short sequence of text commands and numeric replies with it, and hands over the message. SMTP was first specified in 1982, and its current definition, RFC 5321, still describes the same command-and-reply conversation, extended over the years with encryption, authentication and other features.

## How an SMTP session works

**Every session follows the same order.** The server greets the client with a `220` banner, and the client identifies itself with [EHLO](/glossary/ehlo-helo/). The client then names the envelope sender with [MAIL FROM](/glossary/mail-from/) and each recipient with [RCPT TO](/glossary/rcpt-to/), and sends `DATA`. The headers and body follow, and a line containing a single period ends the message. `QUIT` closes the connection, or the client starts another message in the same session.

The server answers every command with a three-digit reply code, and the first digit carries the meaning. `2xx` means success, `3xx` asks for more input, as after `DATA`, `4xx` is a temporary failure that the client should retry later, and `5xx` is a permanent failure. Most servers add an enhanced status code such as `5.1.1` that narrows down the reason.

The envelope and the message are separate layers. Servers route mail and report failures using the envelope addresses from `MAIL FROM` and `RCPT TO`, while the From and To headers inside the message are what the recipient's mail client displays. The two sets of addresses often differ, which is normal for mail sent through a provider.

## SMTP ports and extensions

Three ports carry most SMTP traffic. **Port 25 is for relay between mail servers**, where one server delivers to another, and many ISPs and cloud providers block outbound connections on it from ordinary hosts. Port 587 is the submission port for applications and mail clients handing mail to their provider, normally upgraded to encryption with [STARTTLS](/glossary/starttls/). Port 465 is submission with implicit TLS, where the connection is encrypted before the first command.

Modern sessions are [ESMTP](/glossary/esmtp/) sessions. The server lists its supported extensions in the reply to EHLO, and the client uses the ones it needs, such as STARTTLS for encryption, AUTH for login, SIZE for declaring message size and PIPELINING for sending several commands without waiting for each reply.

## SMTP vs API sending

An application can hand mail to an email provider in two ways: over SMTP to an [SMTP relay](/glossary/smtp-relay/), or through an HTTP API. **SMTP works with nearly any existing software**, from framework mailers and CMS plugins to monitoring tools, and switching providers means changing a host name, a port and credentials. The client builds the complete MIME message itself, and errors come back as reply codes with free text.

An HTTP API takes structured JSON and returns structured errors, which suits new integrations and serverless functions that cannot hold connections open. It also exposes provider features that plain SMTP has no place for, such as stored templates rendered with data sent at request time. Each SMTP message carries several protocol round trips as well, which reusing a connection for many messages reduces but does not remove.

## SMTP in Lettr

Every email sent through Lettr travels to the recipient's mail server over SMTP, whether it enters through the REST API or the SMTP relay. **For API sends, Lettr builds the message and runs the SMTP session with the receiving server itself**: it signs the message with DKIM, queries DNS for the recipient domain's MX records, opens an SMTP connection to the highest-priority server and negotiates TLS encryption when available.

For applications that already speak SMTP, Lettr's relay accepts mail at `smtp.lettr.com` and authenticates with a Lettr API key. It offers implicit TLS on ports 465 and 2465 and STARTTLS on ports 587 and 2587, with 2465 and 2587 as alternates for restrictive firewalls. The address in the message's `From:` header must belong to a verified sending domain.

The SMTP Getting Started guide suggests the HTTP API or an SDK for new applications and compares the two methods. Over SMTP, Lettr templates are not supported, BCC recipients are not private, and errors arrive as SMTP status codes, while the API returns detailed JSON error responses. The SMTP vs API guide adds that reusing an SMTP connection to send several messages improves throughput, and that each message sent over SMTP carries protocol overhead for EHLO, AUTH, MAIL FROM, RCPT TO, DATA and QUIT. The [SMTP Protocol Basics](https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics) page walks through a full session with example commands and replies.
