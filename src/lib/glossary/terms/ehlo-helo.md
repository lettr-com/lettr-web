---
term: EHLO / HELO
question: What are
description: "EHLO and HELO are the SMTP greetings a client sends to open a mail session. How they differ, why EHLO enables extensions and where they appear in Lettr."
related: [smtp, esmtp, starttls, reverse-dns, mta]
reading:
  - title: SMTP Protocol Basics
    href: https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics
  - title: SMTP Getting Started
    href: https://docs.lettr.com/quickstart/smtp/introduction
  - title: Sending via SMTP vs API
    href: https://docs.lettr.com/knowledge-base/best-practices/smtp-vs-api
---

**EHLO and HELO** are the commands an SMTP client sends to introduce itself at the start of a mail session. HELO comes from the original [SMTP](/glossary/smtp/) specification and simply identifies the sending host by name. EHLO (Extended HELO) does the same and also asks the server to list the extensions it supports, such as STARTTLS, AUTH and SIZE. Both carry the client's hostname as their argument, and nothing else in the session can happen until one of them succeeds.

## How EHLO and HELO work

**The greeting is the first command after the connection opens.** The client connects, the server answers with a `220` banner, and the client replies with `EHLO` followed by its fully qualified domain name, for example `EHLO mail.example.com`. A client without a proper hostname sends an address literal in square brackets instead.

The server answers EHLO with a multi-line `250` reply. The first line greets the client, and each following line names one supported extension, such as `250-STARTTLS`, `250-AUTH LOGIN PLAIN` or `250 8BITMIME`, with the final line marked by a space instead of a hyphen. The client reads that list and uses only the extensions the server advertised. After a successful greeting the session moves on to `MAIL FROM`, `RCPT TO` and `DATA`.

A session can contain more than one greeting. When the client upgrades the connection with STARTTLS, both sides discard what they learned before encryption, so the client sends EHLO again over the encrypted channel and receives a fresh extension list.

## EHLO vs HELO

**HELO returns no extension list**, so a session opened with HELO is limited to plain SMTP. That rules out [STARTTLS](/glossary/starttls/) encryption, SMTP authentication, size declarations and 8-bit content, because the client has no way to learn that the server supports them. EHLO is the entry point to [ESMTP](/glossary/esmtp/), the set of extensions that modern mail depends on.

RFC 5321 tells clients to use EHLO and requires servers to keep accepting HELO for compatibility. A client that sends EHLO to a server that does not recognize it gets an error reply and can fall back to HELO, although servers that support only HELO are now rare. In practice, HELO appears mostly in old scripts, embedded devices and manual tests.

## Common problems with EHLO and HELO

The hostname in the greeting is a reputation signal. **Receiving servers compare it with the connecting IP address**, and a name that does not resolve, or that does not match the IP's [reverse DNS](/glossary/reverse-dns/) record, counts against the sender. Greetings such as `localhost`, a bare internal name or a raw IP address look like a misconfigured or compromised machine and are common spam filter triggers.

The greeting name also has an authentication role. SPF can evaluate the HELO identity, and many `Authentication-Results` and `Received` headers record it, so a wrong name shows up in diagnostics long after the session ends.

Application mail libraries cause a separate class of failures. Many default to the machine's local hostname, which inside a container or cloud instance is often an internal name. Some older libraries send HELO instead of EHLO, which prevents STARTTLS and authentication and makes a relay that requires them reject the session. Sending `AUTH` before the STARTTLS upgrade and the second EHLO exposes credentials in plaintext.

## EHLO and HELO in Lettr

Every email sent through Lettr travels between servers over SMTP, whether it enters through the REST API or the SMTP relay. For API sends, **Lettr builds the message and runs the SMTP session with the recipient's mail server itself**, so the greeting on that hop is handled by Lettr's infrastructure. Lettr uses opportunistic TLS on that delivery, which depends on the extension list returned to EHLO.

With the SMTP relay, the application's mail client speaks SMTP directly to Lettr, and its greeting opens that session. Lettr's relay accepts implicit TLS connections, where encryption starts before any SMTP command, and STARTTLS connections, where the client upgrades after greeting. The quickstart's `swaks` test prints the whole SMTP conversation, which makes it a quick way to see the greeting and the advertised extensions.

The Laravel SMTP guide shows the default `config/mail.php`, whose SMTP mailer reads a `local_domain` value from the `MAIL_EHLO_DOMAIN` environment variable. The SMTP vs API guide notes that each message sent over SMTP carries protocol overhead (EHLO, AUTH, MAIL FROM, RCPT TO, DATA and QUIT) and that reusing a connection for several messages improves throughput. The [SMTP Protocol Basics](https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics) page walks through the full session.
