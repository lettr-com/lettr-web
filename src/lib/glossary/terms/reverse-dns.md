---
term: Reverse DNS
heading: "What is reverse DNS?"
description: "Reverse DNS resolves an IP address back to a hostname. How the lookup works, how receiving mail servers use it to judge senders and how Lettr handles it."
published: 2026-09-14
updated: 2026-09-14
related: [ptr-record, ehlo-helo, ip-reputation, dns, mta]
reading:
  - title: "Google & Yahoo Sender Requirements"
    href: https://docs.lettr.com/knowledge-base/compliance/google-yahoo-requirements
  - title: Message Details
    href: https://docs.lettr.com/learn/events/message-details
---

**Reverse DNS** is a DNS lookup that starts from an IP address and returns the hostname assigned to it, the opposite of the usual lookup from a name to an address. Receiving mail servers run it on the address of every server that connects to them. A sending IP with no reverse DNS name, or with a name that does not point back to the same address, is a common reason for mail to be rejected or filtered.

## How reverse DNS works

[DNS](/glossary/dns/) handles reverse lookups through special domains. **An IPv4 address is written backwards under `in-addr.arpa`**, so a lookup for `192.0.2.25` asks for `25.2.0.192.in-addr.arpa`. IPv6 addresses are split into single hexadecimal digits, reversed and placed under `ip6.arpa`. The answer is a [PTR record](/glossary/ptr-record/) that names the hostname.

Reverse zones belong to whoever holds the IP address block: an internet service provider, a hosting company or an email service provider. Owning a domain gives no control over the reverse DNS of the addresses that send its mail.

A reverse lookup alone proves little, because the holder of a reverse zone can publish any hostname in it. **Forward-confirmed reverse DNS closes that gap.** The receiver takes the hostname from the PTR record, looks up that name's A or AAAA records, and checks that they include the original IP address. A match in both directions shows that the operator of the IP address also controls the hostname.

## How receiving servers use reverse DNS

Receiving servers treat reverse DNS as a basic test of whether a connection comes from a properly run mail server. The checks usually cover three points:

- **Existence:** many receiving servers reject or defer mail from addresses with no PTR record, and Google and Yahoo require valid forward and reverse DNS for sending IPs.
- **Consistency:** the hostname a server gives in its [EHLO or HELO](/glossary/ehlo-helo/) greeting is compared with the reverse DNS name, and a mismatch counts against the sender.
- **Hostname shape:** a generic name that embeds the IP address, such as `203-0-113-7.dynamic.isp.example`, looks like a residential or dynamic address range, which spam filters treat with suspicion.

The result feeds into [IP reputation](/glossary/ip-reputation/) and filtering along with authentication and sending history. The reverse DNS name also appears in the `Received` header the receiving server writes, which makes it visible when reading a message's raw source.

## Common problems with reverse DNS

**Cloud servers often start with a generic reverse DNS name.** A [mail transfer agent](/glossary/mta/) run on a virtual machine inherits the hosting provider's default, and a proper name has to be requested from the provider or set in its control panel.

Forward and reverse records easily fall out of step. After a migration to a new IP address, a hostname can keep pointing at the old address while the new address's PTR record names it, so forward confirmation fails. Publishing a PTR-style record in the domain's own DNS zone has no effect, since receivers query the reverse zone of the IP address.

IPv6 adds its own gaps. Senders that deliver over IPv6 frequently have reverse DNS only for their IPv4 addresses, and some mailbox providers apply stricter checks to IPv6 connections.

## Reverse DNS in Lettr

Google and Yahoo list valid forward and reverse DNS among their sender requirements, with proper PTR records on the sending IPs. For its sending IPs, **Lettr manages this automatically**.

To see which address delivered a particular email, the Message Details view shows the **Sending IP** in its Sender section, the IP address from which Lettr delivered the email to the recipient's mail server. Webhook message events such as bounces and spam complaints carry the same value in a `sending_ip` field, and the Analytics dashboard can filter and break down metrics by Sending IP. A reverse lookup on that address, for example with `dig -x`, shows the hostname published for it. The [Google & Yahoo Sender Requirements](https://docs.lettr.com/knowledge-base/compliance/google-yahoo-requirements) page lists the infrastructure requirements.
