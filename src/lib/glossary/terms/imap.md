---
term: IMAP
fullName: Internet Message Access Protocol
question: What is
description: "IMAP is the protocol mail clients use to read and sync email stored on a server. How it differs from POP3 and SMTP, and how Lettr handles inbound email."
related: [smtp, mua, mx-record, mime, email-relay]
reading:
  - title: SMTP Protocol Basics
    href: https://docs.lettr.com/knowledge-base/fundamentals/smtp-protocol-basics
  - title: Inbound Introduction
    href: https://docs.lettr.com/learn/inbound/introduction
---

**IMAP (Internet Message Access Protocol)** is the standard protocol mail clients use to read email stored on a mail server. Messages stay on the server, and every client connected to the same account, such as a phone app, a desktop client and webmail, sees the same folders, read states and flags. IMAP covers reading and organizing mail, while sending is the job of a different protocol, SMTP.

## How IMAP works

A [mail client](/glossary/mua/) connects to the IMAP server, usually on port 993 with TLS from the start or on port 143 upgraded with STARTTLS, and logs in to a mailbox. **The client works on the server's copy of the mail** instead of downloading and owning it. Commands select a folder, list messages, fetch headers or whole messages, set flags such as `\Seen` and `\Flagged`, and move or delete messages.

Because the state lives on the server, a message marked as read on one device shows as read on every other device. A client can fetch only the headers first and download the body or attachments when a message is opened, which keeps large mailboxes usable over slow connections. The IDLE extension holds a connection open so the server can announce new mail as it arrives, without the client polling.

The current version is IMAP4rev2, defined in RFC 9051, which updates IMAP4rev1 from RFC 3501.

## IMAP vs POP3

POP3 is the older retrieval protocol. **POP3 downloads messages to one device** and typically removes them from the server, so a second device sees nothing and the local copy is the only copy. It has no server-side folders and no read state shared between devices.

IMAP became the default for most accounts because people read mail on several devices. POP3 remains in setups that want mail stored locally or kept off the server, and many providers still offer both protocols.

## IMAP vs SMTP

[SMTP](/glossary/smtp/) moves mail from a client to its outgoing server and between servers. **IMAP only reads what has already arrived.** A typical message uses both: the sender's client submits it over SMTP, servers relay it over SMTP to the recipient's domain, found through that domain's [MX record](/glossary/mx-record/), and the recipient's client reads it over IMAP.

SMTP itself has no concept of a Sent folder. Clients that show sent mail upload a copy to the server with the IMAP `APPEND` command, unless the mailbox provider saves one automatically. Mail that an application sends through an email API or an SMTP relay service therefore sits in no mailbox on the sending side unless something copies it there.

Receiving mail programmatically has long meant logging in to a mailbox over IMAP, polling for new messages and parsing the raw [MIME](/glossary/mime/) content, including multipart bodies, encodings and attachments. That work sits inside the application and grows with every message format it has to handle.

## IMAP in Lettr

**Lettr accepts outgoing email through its REST API or over SMTP**, with the SMTP relay at `smtp.lettr.com` authenticating with a Lettr API key. The Lettr docs describe SMTP as a transmission protocol only, with reading email left to IMAP or POP3.

For incoming email, Lettr works with inbound domains and webhooks. An inbound domain's MX records route email to Lettr's mail servers, and Lettr parses each message and sends the structured data to the application's webhook. Lettr handles the SMTP reception, MIME parsing, attachment extraction and spam scoring, so the application receives JSON with the sender, recipients, subject, plain text and HTML body, headers and attachment URLs. Inbound domains are managed in the Lettr dashboard, and there is no public API endpoint for creating or managing them.

Inbound processing has its own webhook events: `relay.relay_injection` when an inbound email is received and queued for processing, and `relay.relay_delivery` when it is delivered to the configured endpoint. Replies can be matched to the original send with a variable reply-to address such as `reply+ticket_123@mail.example.com`, which routes the recipient's reply to the inbound domain. The [Inbound Introduction](https://docs.lettr.com/learn/inbound/introduction) covers setup and parsing.
