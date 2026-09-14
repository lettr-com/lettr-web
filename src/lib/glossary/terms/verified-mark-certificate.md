---
term: Verified Mark Certificate
fullName: VMC
question: What is
description: "A Verified Mark Certificate (VMC) proves that a brand owns the trademarked logo it shows through BIMI. How VMCs are issued, validated and renewed."
related: [bimi, dmarc, email-spoofing]
reading:
  - title: "BIMI: Brand Indicators for Message Identification"
    href: https://docs.lettr.com/knowledge-base/fundamentals/bimi
  - title: BIMI Records
    href: https://docs.lettr.com/learn/domains/bimi
---

**A Verified Mark Certificate (VMC)** is a digital certificate that proves an organization owns the registered trademark for a logo. It is used with [BIMI](/glossary/bimi/), the standard that displays a brand's logo next to authenticated email, and it lets a mailbox provider trust that the logo named in a domain's BIMI record belongs to the owner of that domain. Without such a certificate, anyone who controls a domain could publish another company's logo.

## How a Verified Mark Certificate works

A VMC is an X.509 certificate, the same format that secures websites, extended to carry a logo. **The certificate embeds the SVG logo itself**, together with the domain names it covers and details of the trademark registration. A certificate authority issues it only after checking the trademark, the applicant's identity and control of the domains.

The domain owner hosts the certificate as a PEM file at a public HTTPS URL and references it in the `a=` tag of the BIMI record at `default._bimi.example.com`, next to the logo URL in the `l=` tag. When a message passes [DMARC](/glossary/dmarc/) under an enforced policy, a provider that checks certificates fetches the PEM file, validates its chain back to an authorized issuer and confirms that the logo matches the one embedded in the certificate. The logo appears only when those checks succeed.

## Requirements for a Verified Mark Certificate

- **A registered trademark:** the logo must be registered with a recognized trademark office, and the registered mark has to match the image in the certificate.
- **Organization verification:** the certificate authority confirms that the applicant is a real, legally registered organization.
- **Domain control:** the applicant proves it controls every domain the certificate covers.
- **A compliant logo:** the image must use the SVG Tiny PS profile that BIMI requires.

Only a small number of certificate authorities issue VMCs, and each certificate is a paid product with a limited validity period, so renewal is a recurring task. **An expired certificate stops the logo** at providers that require one, even though the DNS record and the logo file are unchanged.

## Verified Mark Certificate vs Common Mark Certificate

The BIMI ecosystem also has a newer type of certificate, the Common Mark Certificate (CMC). **A CMC does not require a registered trademark.** Issuers instead verify that the domain has already displayed the logo publicly for a period, generally at least a year, using archived evidence, which opens BIMI to organizations without a trademark.

The two are not interchangeable everywhere. Support for CMCs varies between mailbox providers, and visual extras such as a verified checkmark next to the sender name are generally tied to a VMC. A brand that holds a registered trademark usually gets the widest display from a VMC.

## Why a Verified Mark Certificate matters

**The certificate turns a BIMI logo into a trust signal.** An impersonator can register a lookalike domain and even authenticate it correctly, but cannot obtain a certificate for a trademark it does not own, so the verified logo helps recipients tell a brand's genuine mail from [spoofing](/glossary/email-spoofing/). Where a provider requires a VMC, a BIMI record without one displays nothing, however well the rest of the setup is configured.

## Verified Mark Certificate in Lettr

**The Lettr BIMI docs state that Gmail requires a VMC to display a BIMI logo.** They list DigiCert and Entrust as VMC providers, and obtaining a certificate requires a logo registered with a recognized trademark office, proof of domain ownership and verification of the organization's identity. The VMC is provided as a PEM file that is hosted at an HTTPS URL and referenced from the `a=` tag of the BIMI record.

VMCs are typically valid for one year. The docs recommend tracking the expiration date, starting renewal at least 2 weeks before expiry because certificate authorities can take several business days to reissue, and replacing the PEM file at the same hosted URL after renewal, in which case the BIMI DNS record does not need to change. When a VMC lapses, Gmail stops displaying the logo, and the docs suggest sending test emails to Gmail after replacing the certificate to confirm the logo still appears.

BIMI is configured entirely through DNS records, and there is no BIMI configuration in the Lettr dashboard or API. Email clients look up the record and display the logo once the BIMI record is in place and DMARC enforcement is set up. The [BIMI Records](https://docs.lettr.com/learn/domains/bimi) page covers the record format and the DMARC policy the logo depends on.
