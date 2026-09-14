---
term: Data Processing Agreement
fullName: DPA
question: What is
description: "A Data Processing Agreement (DPA) is the GDPR contract between a data controller and a processor such as an ESP. What it covers and how to get one with Lettr."
related: [gdpr, data-minimization, esp, acceptable-use-policy]
reading:
  - title: GDPR and Email Sending
    href: https://docs.lettr.com/knowledge-base/compliance/gdpr-email
  - title: Data Retention and Deletion
    href: https://docs.lettr.com/knowledge-base/compliance/data-retention
---

**A Data Processing Agreement (DPA)** is the contract between a data controller and a data processor that sets out how the processor handles personal data on the controller's behalf. Under the [GDPR](/glossary/gdpr/), Article 28 requires such a contract whenever a controller uses a processor. An email service provider that stores recipient addresses and delivers messages for its customers is a processor, so every business sending email to people in the EU or EEA through one needs a DPA with it.

## How a data processing agreement works

The agreement rests on two roles. **The controller decides why and how personal data is processed**: for email, that is the company whose list it is and whose messages go out. The processor handles the data only on the controller's documented instructions. An [ESP](/glossary/esp/) that stores addresses, renders templates, delivers messages and records opens and clicks is acting as a processor.

Article 28(3) lists what the contract has to contain. It describes the subject matter, duration, nature and purpose of the processing, the types of personal data and the categories of people concerned. It then binds the processor to a set of obligations:

- **Instructions:** personal data is processed only on the controller's documented instructions.
- **Confidentiality and security:** staff with access are bound to confidentiality, and the processor applies appropriate technical and organizational security measures.
- **Sub-processors:** other vendors are engaged only with the controller's authorization and under the same data protection obligations.
- **Assistance:** the processor helps the controller answer data subject requests and meet its security and breach notification duties.
- **End of service:** personal data is deleted or returned when the service ends, and the processor provides the information needed to demonstrate compliance, including audits.

When processing involves transfers outside the EEA, the agreement also references a transfer mechanism, commonly the European Commission's Standard Contractual Clauses.

## Why a DPA matters

**Using a processor without a DPA is a GDPR problem in its own right**, regardless of how carefully that processor treats the data. The agreement is the controller's documented basis for trusting a third party with personal data, so it belongs in place before any EU recipient data reaches the provider.

A DPA does not move responsibility for compliance to the provider. The controller still needs a lawful basis for sending, still answers access and erasure requests, and still decides what personal data it hands over. Sending less, following the principle of [data minimization](/glossary/data-minimization/), keeps the processing described in the agreement narrow and easier to account for.

## Data processing agreement vs acceptable use policy

Email providers usually have both documents, and they govern opposite directions. An [acceptable use policy](/glossary/acceptable-use-policy/) sets rules for the customer: which mail the platform permits and which it prohibits, backed by the provider's right to suspend an account. A DPA sets rules for the provider: what it may do with the customer's personal data, how it protects that data and what happens to it at the end of the contract.

The two documents also answer to different parties. The acceptable use policy protects the provider's shared infrastructure and its other customers, while the DPA protects the recipients whose data flows through the platform.

## Data processing agreement in Lettr

When email is sent through Lettr, the sender is the **data controller** and Lettr is the data processor. The controller determines what data is collected and processed, ensures the lawful basis and responds to data subject requests, while Lettr processes data according to the controller's instructions. Implementing appropriate security measures and maintaining a DPA are listed as responsibilities of both parties.

The personal data Lettr processes for a sender covers recipient email addresses, email content, delivery and engagement events such as opens, clicks and bounces, and any custom data passed in the `metadata` parameter. A sender without a DPA in place can request one from support@lettr.com. The same address handles requests to delete a specific recipient's data from Lettr's systems. The [GDPR and Email Sending](https://docs.lettr.com/knowledge-base/compliance/gdpr-email) page in the Lettr docs covers lawful bases, consent requirements and the processing Lettr performs.
