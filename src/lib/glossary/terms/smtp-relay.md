---
term: SMTP Relay
heading: "What is an SMTP relay?"
description: "An SMTP relay is a mail server that accepts authenticated mail from an application and delivers it onward. How relays work, common problems, and Lettr's relay."
published: 2026-09-14
updated: 2026-09-14
related: [smtp, email-relay, starttls, api-key, rcpt-to]
reading:
  - title: Sending via SMTP vs API
    href: https://docs.lettr.com/knowledge-base/best-practices/smtp-vs-api
  - title: SMTP Getting Started
    href: https://docs.lettr.com/quickstart/smtp/introduction
  - title: SMTP Protocol Basics
    href: https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics
---

**An SMTP relay** is a mail server that accepts outgoing email from an application or device over SMTP and delivers it to the recipients' mail servers on the sender's behalf. The application logs in, hands over a finished message and leaves queuing, retries, bounce handling and signing to the relay. Email service providers run relays so that existing software can send through them by changing only its SMTP settings.

## How an SMTP relay works

**Submission is the first hop, delivery is the second.** On the first hop the application connects to the relay's submission port, encrypts the connection and authenticates. The relay reads the envelope sender from `MAIL FROM` and the recipients from [RCPT TO](/glossary/rcpt-to/), receives the message after `DATA` and answers `250` once it has accepted responsibility for it. On the second hop the relay looks up each recipient domain's MX records and opens its own [SMTP](/glossary/smtp/) connection to the receiving servers.

Between the two hops, a provider's relay does most of the work that makes mail deliverable. It signs the message with DKIM for the sender's domain, queues it, retries temporary failures, processes bounces and records events for reporting.

Authentication is what separates a relay from an open relay. **A relay accepts mail for arbitrary recipients only from clients that have logged in**, usually with SMTP AUTH over an encrypted session. The credentials are therefore the gatekeeper and deserve the same protection as an [API key](/glossary/api-key/): stored in environment variables or a secrets manager, never in source control.

## SMTP relay vs inbound relay

Email platforms use the word relay in a second sense. An [inbound relay](/glossary/email-relay/) receives mail addressed to a customer's domain through MX records and passes it on to the customer's application, typically as a webhook. **An SMTP relay runs in the opposite direction**, taking mail from the application and delivering it to the outside world.

The setups share no configuration. An SMTP relay needs credentials in the application and a verified sending domain, while an inbound relay needs MX records that point the domain's incoming mail at the provider.

## Common problems with SMTP relays

- **Encryption mismatch:** implicit TLS ports expect a TLS handshake before any SMTP command, and STARTTLS ports expect plaintext first, so the wrong setting for a port fails at connection time.
- **Blocked ports:** many cloud hosts and residential ISPs block outbound port 25, which shows up as a connection timeout rather than an error message.
- **Unverified sender domain:** relays check the sender against the domains the account has verified, and a message can be refused even after a successful login.
- **BCC exposure:** blind copies travel only in the envelope, and a relay that cannot tell them from other recipients may deliver them as visible recipients.
- **Credentials in plaintext:** sending `AUTH` before [STARTTLS](/glossary/starttls/) completes exposes the login on the network.

## SMTP relay in Lettr

**Lettr's SMTP relay runs at `smtp.lettr.com` and authenticates with a Lettr API key.** Implicit TLS is available on ports 465 and 2465 and STARTTLS on ports 587 and 2587, and the docs suggest 2465 and 2587 when a restrictive firewall blocks the standard ports. Sandbox API keys work over SMTP too, waiving the domain requirement and redirecting every message to the key owner's inbox.

The relay validates the address in the `From:` header against the account's verified sending domains, not the envelope sender the client uses in `MAIL FROM`. A message from an unverified domain still authenticates and is rejected when the client sends the message body, and errors at that stage return `451` with the reason. Recipients are read from the envelope, so BCC addresses are delivered as regular `To` recipients, and the docs recommend a separate message per recipient or the HTTP API when recipients must stay hidden.

A message can carry at most 50 recipients across to, cc and bcc, and exceeding the limit returns `452 Too many recipients`. Five failed authentication attempts within five minutes block the client's IP address for 15 minutes on every port. Invalid credentials return `535 Authentication credentials invalid`, and a key restricted to other IP addresses returns `535 Access denied. Your IP address is not allowed.`

Sends through the relay are recorded in the dashboard alongside API sends. Lettr templates are not supported over SMTP and require the HTTP API. The [SMTP Getting Started](https://docs.lettr.com/quickstart/smtp/introduction) guide includes a `swaks` connection test and setup guides for Laravel, PHPMailer and Supabase.
