---
term: PTR Record
fullName: Pointer Record
question: What is
description: "A PTR record maps an IP address back to a hostname for reverse DNS lookups. How mail servers check it, who can set it, and how Lettr handles sending IPs."
related: [reverse-dns, dns, ip-reputation, dedicated-ip, ehlo-helo]
reading:
  - title: Google & Yahoo Sender Requirements
    href: https://docs.lettr.com/knowledge-base/compliance/google-yahoo-requirements
  - title: Message Details
    href: https://docs.lettr.com/learn/events/message-details
---

**A PTR record (Pointer Record)** is a DNS record that maps an IP address to a hostname, the reverse of the A and AAAA records that map hostnames to addresses. It is what a [reverse DNS](/glossary/reverse-dns/) lookup returns. Receiving mail servers look up the PTR record of the IP address that connects to them, and a sending IP without a valid one is a common reason for mail to be rejected or filtered.

## How a PTR record works

**PTR records live in special reverse zones of the [DNS](/glossary/dns/)**, not in the zone of the domain they name. For IPv4, the address is written backwards under `in-addr.arpa`, so the PTR record for `192.0.2.25` sits at `25.2.0.192.in-addr.arpa` and might hold `mail.example.com`. IPv6 uses `ip6.arpa`, with every hexadecimal digit of the address reversed and separated by dots.

The reverse zone belongs to whoever controls the IP address block, not to the owner of the hostname. Only the network operator, hosting provider or email service provider that holds the IP can set its PTR record, which is why the record cannot be added in a domain's own DNS settings.

An IP address normally carries a single PTR record. Several are allowed, but receivers may check only one, so one name per address is the dependable setup.

## PTR record vs A record

An A record answers "which address does this name use" and belongs to the domain owner. **A PTR record answers the reverse question and belongs to the IP owner**, so either side can publish a claim the other never agreed to. A PTR record on its own therefore proves little, since the owner of an IP block can point it at any name.

Mail servers close that gap with forward-confirmed reverse DNS (FCrDNS). They look up the PTR record for the connecting IP, resolve the returned hostname's A or AAAA record, and check that it leads back to the same IP address. The check passes only when both directions agree, which shows that the IP owner and the hostname's owner configured them together.

Receivers often compare the result with the hostname the server announced in its [EHLO or HELO](/glossary/ehlo-helo/) greeting. A mismatch there is not always fatal, but a generic name such as `192-0-2-25.dynamic.isp.example` looks like a residential connection, and many providers treat mail from such hosts as likely spam.

## Why PTR records matter

**Google and Yahoo require valid forward and reverse DNS for sending IPs**, and other large mailbox providers run similar checks. A missing record commonly produces an SMTP rejection that names reverse DNS as the reason, and a mismatched or generic record counts against a message even when it is accepted.

The record also shapes how an address is judged over time. [IP reputation](/glossary/ip-reputation/) attaches to the address, and a hostname that clearly belongs to an established mail operator reads as a purpose-built sending server, not a compromised machine. A [dedicated IP](/glossary/dedicated-ip/) has its own PTR record and reputation, while senders on shared addresses rely on the records their provider maintains.

## Common problems with PTR records

- **No record:** new servers and cloud instances often start without a PTR record, or with the hosting provider's generic name.
- **Forward mismatch:** the PTR hostname exists, but its A record points to a different IP, so FCrDNS fails.
- **Wrong zone:** a record added to the domain's own DNS zone has no effect, because the reverse zone belongs to the IP block owner.

## PTR record in Lettr

**Lettr manages PTR records for its sending IPs automatically**, which covers the Google and Yahoo requirement that sending IPs have valid forward and reverse DNS, so no PTR setup falls to the sender.

Dedicated IPs are available as an add-on on the Business plan and as part of Enterprise. For any sent email, the Message Details view shows the Sending IP, the IP address from which Lettr delivered the email to the recipient's mail server, which is the address a receiving server's reverse DNS lookup concerns. Analytics can also filter and break down metrics by Sending IP. The [Google & Yahoo Sender Requirements](https://docs.lettr.com/knowledge-base/compliance/google-yahoo-requirements) page lists the infrastructure requirements Lettr handles.
