---
term: MX Record
fullName: Mail Exchanger record
question: What is
description: "An MX record is a DNS record that names the mail servers accepting email for a domain, each with a priority. How MX lookups work and how Lettr uses them."
related: [dns, dns-propagation, subdomain, txt-record, spf]
reading:
  - title: Inbound Domains
    href: https://docs.lettr.com/learn/domains/inbound-domains
  - title: How Email Delivery Works
    href: https://docs.lettr.com/knowledge-base/fundamentals/how-email-delivery-works
---

**An MX record (Mail Exchanger record)** is a [DNS](/glossary/dns/) record that names the mail servers responsible for accepting email for a domain. Each record pairs a server hostname with a priority number, and a sending server looks these records up to decide where to deliver a message. MX records only govern incoming mail, so a domain can send without trouble and still be unable to receive.

## How MX records work

An MX record has a name, the domain it serves, and a value made of a priority and a target hostname, as in `example.com. MX 10 mx1.example.com.`. **A lower priority number means a more preferred server.** A domain usually publishes several records so mail still arrives when one server is down.

When a mail server has a message for `user@example.com`, it queries DNS for the MX records of `example.com`, sorts them by priority and connects to the preferred server first. If that server does not respond or refuses the connection, the sender moves on to the next priority. Records that share the same priority are tried in random order, which spreads incoming mail across those servers.

The target has to be a hostname with its own address records. RFC 5321 does not allow an IP address as the value, and the target should not be a CNAME alias. A domain that accepts no mail at all can say so explicitly with a null MX record, `MX 0 .`, defined in RFC 7505, so sending servers fail fast instead of retrying.

## MX records and sending

**Outbound mail does not use the sender's own MX records.** Authorization to send is expressed through other records, such as [SPF](/glossary/spf/), which is published as a [TXT record](/glossary/txt-record/), and DKIM keys. A sending domain can therefore point its MX records at one provider for its mailboxes and send application mail through a completely different service.

MX records still affect senders in two ways. Every delivery attempt starts with an MX lookup on the recipient's domain, so a recipient domain with broken DNS produces bounces. And some receiving servers reject mail whose envelope sender domain has neither MX nor address records, because a bounce to that domain could never be delivered.

Each [subdomain](/glossary/subdomain/) has its own MX records. The root domain can keep its records pointing at Google Workspace or Microsoft 365, while `mail.example.com` routes to a service that processes incoming mail programmatically.

## Common problems with MX records

**The host field is the most frequent source of errors.** Many DNS providers append the domain automatically, so entering `mail.example.com` as the name of a record in the `example.com` zone creates `mail.example.com.example.com`. Entering `@` for the root, or only `mail` for the subdomain, avoids the doubling.

Changing the root domain's MX records moves all of the company's incoming mail, which is rarely intended when a new service is added. Stale records from a previous provider cause a quieter failure: a leftover record with a lower priority number keeps pulling mail to the old servers. Conflicting records with mixed providers split delivery unpredictably.

Changes also take time to reach every resolver. Until [DNS propagation](/glossary/dns-propagation/) completes, some senders use the old records and some the new, and verification tools can report failures for records that are already correct.

## MX record in Lettr

**MX records apply to Lettr's inbound domains**, one of the four domain types Lettr supports alongside sending, tracking and storage domains. An inbound domain uses three MX records, all at priority 10: `rx1.sparkpostmail.com`, `rx2.sparkpostmail.com` and `rx3.sparkpostmail.com`. The host is `@` for the root domain or the subdomain name, such as `mail` for `mail.example.com`. Because all three share the same priority, sending servers distribute email across them, and if one is unavailable the others take over.

Inbound domains are added under **Domains → Inbound**, and the **Verify** action checks the records and moves the domain's status from `unverified` to `valid`. The docs recommend a subdomain for inbound mail, which keeps the root domain's MX records pointing to its regular email provider, such as Gmail or Microsoft 365. When verification fails, DNS changes can take up to 48 hours to propagate, and conflicting MX records are worth ruling out. For supported DNS providers, Domain Connect can apply the three records in one step, and every team has a sandbox inbox for testing inbound processing without MX records.

On the sending side, Lettr queries DNS for the recipient domain's MX records before opening the SMTP connection to the receiving server. The [Inbound Domains](https://docs.lettr.com/learn/domains/inbound-domains) page covers setup, verification and troubleshooting.
