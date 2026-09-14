---
term: ESMTP
fullName: Extended SMTP
question: What is
description: "ESMTP is the extension framework that adds encryption, authentication and size limits to SMTP. How EHLO negotiates it and how Lettr uses TLS and AUTH."
related: [smtp, ehlo-helo, starttls, tls, smtp-relay]
reading:
  - title: SMTP Protocol Basics
    href: https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics
  - title: SMTP Getting Started
    href: https://docs.lettr.com/quickstart/smtp/introduction
---

**ESMTP (Extended SMTP)** is the framework that lets SMTP servers and clients agree on optional features beyond the original protocol. Encryption with STARTTLS, client authentication, message size declarations and 8-bit content all arrive through it. A client negotiates ESMTP by opening the session with `EHLO` instead of the older `HELO`, and virtually every mail server on the internet supports it today.

## How ESMTP works

The original [SMTP](/glossary/smtp/) specification from 1982 had a fixed command set and no way to add features without breaking older servers. **ESMTP solved that with a discovery step.** The service extension mechanism, introduced in RFC 1869 and now part of RFC 5321, has the client announce itself with EHLO and the server answer with a list of the extensions it supports.

A typical reply looks like `250-SIZE 52428800`, `250-STARTTLS`, `250-AUTH LOGIN PLAIN` and `250 8BITMIME`, one keyword per line. The client uses only what the server advertised, so an old server that knows nothing about extensions still works with a new client, and a new server still accepts a client that never asks. The [EHLO and HELO](/glossary/ehlo-helo/) greeting is therefore the point where a session becomes ESMTP or stays plain SMTP.

Some extensions change the state of the session. After [STARTTLS](/glossary/starttls/) upgrades the connection to encryption, both sides forget the earlier negotiation and the client sends EHLO again, because a list received over plaintext could have been altered in transit.

## Common ESMTP extensions

Each extension has its own RFC and keyword. **A handful appear in almost every modern session**:

- **STARTTLS:** upgrades a plaintext connection to an encrypted [TLS](/glossary/tls/) session before any message data is sent.
- **AUTH:** lets a client log in with a mechanism such as PLAIN or LOGIN, which submission servers require before relaying mail.
- **SIZE:** lets the server state its maximum message size and the client declare the size up front, so an oversized message is refused before it is transferred.
- **8BITMIME:** allows 8-bit content in the message body instead of forcing everything into 7-bit encodings.
- **PIPELINING:** lets the client send several commands without waiting for each reply, which cuts round trips.
- **ENHANCEDSTATUSCODES:** adds [enhanced status codes](/glossary/enhanced-status-code/) such as `5.1.1` to replies, which explain failures in more detail than the three-digit reply code.

Others cover delivery status notifications, internationalized addresses and chunked transfer, and servers advertise only the ones they implement.

## Why ESMTP matters

**Encryption and authentication both depend on it.** Without STARTTLS, mail between servers travels in plaintext that anyone on the network path can read. Without AUTH, a submission server cannot tell a legitimate application from someone abusing it as an open relay, which is why [SMTP relay](/glossary/smtp-relay/) services require authenticated ESMTP sessions.

The negotiation leaves a record. Receiving servers note the protocol in the `Received` header, where `with ESMTP` marks an extended session and `with ESMTPS` marks one encrypted with TLS, so the headers of a delivered message show how each hop was handled.

ESMTP also has limits worth knowing. Opportunistic STARTTLS falls back to plaintext when the receiving server does not advertise it, and an attacker who strips the `STARTTLS` line from the EHLO reply can force that fallback. Enforced TLS policies close the gap at the cost of failing delivery to servers without encryption.

## ESMTP in Lettr

Every email sent through Lettr travels between servers over SMTP, whether it arrives through the REST API or the SMTP relay. **Lettr uses opportunistic TLS by default when delivering to recipient mail servers**, which gives the widest delivery coverage, and because the vast majority of major mailbox providers support TLS, most messages are encrypted in transit.

For applications that send over SMTP, Lettr's relay requires the client to authenticate before it accepts messages, with a Lettr API key as the credential. It accepts two connection types: implicit TLS, where the connection is encrypted before the first SMTP command, and STARTTLS, where the session starts in plaintext and upgrades after the greeting. The docs warn against sending the `AUTH` command before STARTTLS completes, because the credentials would then cross the network unencrypted.

The relay enforces limits through ordinary SMTP replies. A message with more than 50 recipients across to, cc and bcc is refused with `452 Too many recipients`, the same recipient limit as the HTTP API, and invalid credentials return a `535` error. The [SMTP Getting Started](https://docs.lettr.com/quickstart/smtp/introduction) guide covers the connection settings, a `swaks` test with `AUTH LOGIN` and framework setup.
