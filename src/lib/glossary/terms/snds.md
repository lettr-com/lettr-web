---
term: SNDS
fullName: Smart Network Data Services
question: What is
description: "SNDS is Microsoft's free service showing how Outlook.com sees mail from a sending IP address. What it reports, how to read it, and SNDS for Lettr senders."
related: [smartscreen, jmrp, google-postmaster-tools, ip-reputation, exchange-online-protection]
reading:
  - title: Outlook / Microsoft 365 Delivery Issues
    href: https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery
  - title: Filtering and Breakdowns
    href: https://docs.lettr.com/learn/analytics/filtering-and-breakdowns
---

**SNDS (Smart Network Data Services)** is a free Microsoft service that shows how Outlook.com treats mail arriving from specific IP addresses. Whoever controls an IP address, or someone they authorise, registers the address and then sees daily data on the mail it sent to Microsoft's consumer mail service. SNDS reports on IP addresses only, not on domains, which sets it apart from domain-based tools.

## How SNDS works

Access starts with a Microsoft account and a request for an IP address or range. **Microsoft confirms authority over the addresses before showing any data**, generally by sending an authorisation email to a contact associated with the range, such as an address from its WHOIS record. Once access is granted, the dashboard lists each address with its figures for each day.

The data describes mail that reached Outlook.com and the other consumer services:

- **Volume:** how much mail the IP sent during the day.
- **Filter result:** a Green, Yellow or Red rating of how much of the IP's mail Microsoft's spam filtering judged to be spam.
- **Complaint rate:** the share of messages that recipients reported as junk.
- **Trap hits:** mail sent to spam trap accounts Microsoft operates.

A separate view lists addresses that Microsoft currently blocks or flags, which is often the first place a sudden rise in rejections becomes explainable.

## SNDS vs Google Postmaster Tools

[Google Postmaster Tools](/glossary/google-postmaster-tools/) is the closest equivalent at Gmail, and the two differ in their unit. **Postmaster Tools reports per domain, SNDS reports per IP address.** A sender on shared infrastructure can usually set up Postmaster Tools for its own domain, while SNDS data for a shared address mixes many senders and needs cooperation from whoever operates the address.

The difference mirrors how the providers filter. Gmail relies heavily on domain reputation, while Microsoft still weights [IP reputation](/glossary/ip-reputation/) more strongly, so SNDS remains the most direct view of how Outlook.com judges the addresses that deliver a sender's mail.

## How to read SNDS data

**A shift from Green to Yellow is an early warning** that a meaningful share of the IP's mail is being filtered, and Red means most of it is. Filter results tend to move together with complaint rates and trap hits, so a colour change is best read alongside those figures for the same days.

SNDS is one of several Microsoft sender tools. [JMRP](/glossary/jmrp/) sends a report for each individual junk complaint, which identifies the recipients and campaigns behind a rising complaint rate. SNDS covers the consumer service, so the filtering decisions of individual Microsoft 365 organisations, made through [Exchange Online Protection](/glossary/exchange-online-protection/) and tenant policies, sit outside its view, as do the content verdicts of [SmartScreen](/glossary/smartscreen/) on any single message.

## SNDS in Lettr

The Lettr guide to Outlook and Microsoft 365 delivery describes **SNDS as the Microsoft equivalent of Google Postmaster Tools**, providing reputation data about sending IP addresses. Signing up means signing in to the SNDS site with a Microsoft account and requesting access to the IP addresses or CIDR range used to send the mail. Those addresses can be found in the `Received` headers of messages sent through Lettr, and senders on Lettr's shared IP pool can contact Lettr support for the current sending IP ranges.

The guide lists what SNDS shows: traffic volume per IP per day, a spam complaint rate covering trap hits and user complaints, and a Green, Yellow or Red filter result, where Red means Microsoft is actively filtering the email to junk or rejecting it. It recommends checking SNDS data at least weekly and acting on a shift from Green to Yellow before it reaches Red. For Microsoft's `421 4.7.0` throttling responses, which Lettr retries automatically, the guide lists checking SNDS for IP reputation issues among the steps if the problem persists.

Inside Lettr, the Message Details view shows the Sending IP from which Lettr delivered each email. Analytics can filter by Sending IP or by Mailbox Provider and break metrics down by either, so bounces, delays and complaints can be compared per address and for Outlook traffic specifically. Dedicated IPs are available as an add-on on the Business plan and on Enterprise. The [Outlook / Microsoft 365 Delivery Issues](https://docs.lettr.com/knowledge-base/troubleshooting/outlook-delivery) guide also covers JMRP enrolment and common Outlook blocks.
