---
term: Tracking Domain
heading: "What is a tracking domain?"
description: "A tracking domain is the hostname used in tracked links and open pixels. Why a custom tracking domain helps, what can break it, and how Lettr sets one up."
published: 2026-09-14
updated: 2026-09-14
related: [click-tracking, open-tracking, cname-record, tracking-pixel, subdomain]
reading:
  - title: Tracking Domains
    href: https://docs.lettr.com/learn/domains/tracking-domains
  - title: Tracking
    href: https://docs.lettr.com/learn/sending/tracking
  - title: Monitoring & Alerts
    href: https://docs.lettr.com/learn/settings/alerts
---

**A tracking domain** is the hostname that appears in the rewritten links and open-tracking images of an email. A sending platform needs every click and image load to reach its tracking servers, so it replaces each link with an address on a tracking domain and serves the tracking image from the same host. Without configuration that host belongs to the platform, and a custom tracking domain puts a subdomain of the sender's own domain, such as `links.example.com`, in its place.

## How a tracking domain works

**A custom tracking domain is an alias for the platform's tracking servers.** The sender picks a [subdomain](/glossary/subdomain/) and points it at the platform with a [CNAME record](/glossary/cname-record/), so a request to `links.example.com` reaches the same servers as the platform's own hostname. The platform then uses that hostname whenever it prepares a message for the sender.

[Click tracking](/glossary/click-tracking/) replaces a link such as `https://example.com/offer` with a URL like `https://links.example.com/c/abc123`, which records the click and redirects the recipient to the original address. [Open tracking](/glossary/open-tracking/) inserts a [tracking pixel](/glossary/tracking-pixel/) whose image URL sits on the same domain. The unique part of each URL tells the tracking server which message, recipient and link it belongs to.

Tracked links open in browsers, so the domain needs a valid certificate for HTTPS. Platforms usually issue and renew that certificate on the sender's behalf once DNS is in place, which is why setup can include extra records used only to validate the certificate.

## Why a custom tracking domain matters

**Links on a shared tracking domain carry the reputation of every sender using it.** Spam filters inspect the domains that links point to, and a shared hostname that also appears in other senders' abusive mail can count against a legitimate message. A custom domain builds its own reputation, tied to the sender.

Consistency is the second reason. A message from `example.com` whose links all point to an unrelated domain looks less trustworthy to filters and to recipients who hover over a link before clicking. Links on a subdomain of the sender's own domain match the From address and the brand in the message.

The domain also outlives the send. Every tracked link in a delivered message depends on that hostname for as long as recipients keep the email, so the tracking domain needs to stay in place for years after a campaign ends.

## Common problems with tracking domains

- **Proxied DNS records:** a DNS provider that proxies traffic answers with its own addresses instead of the CNAME, so the platform cannot see the alias and verification fails.
- **Certificates that never issue:** a missing or mistyped validation record leaves the domain without HTTPS, and tracking cannot move to it until the certificate is active.
- **Records removed later:** a CNAME deleted or repointed during a DNS cleanup breaks click redirects and open tracking without any error at send time.
- **Deleting the domain:** links in mail already delivered stop resolving, so a tracking domain in use is retired only when its old links no longer matter.

## Tracking domain in Lettr

**Lettr tracking domains are added under Domains → Tracking** and managed in the dashboard, since there are no API endpoints for them. The setup needs a CNAME record pointing the chosen subdomain to `proxy.lettr-tracking.com`, and with Cloudflare DNS that record must be set to DNS only (grey cloud), or verification fails because the hostname returns A records instead of the CNAME. Lettr provisions and renews the SSL certificate for the domain automatically, so tracking links use HTTPS.

The domain's status reads `pending_cname` while the CNAME waits for verification, `pending_ssl` while the certificate is pending and `active` once both are complete. A tracking domain is linked to a sending domain by selecting it on that sending domain's page under **Domains** → **Sending**. Only emails sent after the change use the custom domain, and deleting a tracking domain makes the tracking links in previously sent emails stop working.

After verification, Lettr's daily DNS health check confirms that the tracking CNAME still points at Lettr's tracking origin. When it breaks, Lettr shows a notification and a red **Not working** badge in the app, and can also alert by email or by webhook. The check is informational and never disables a domain or stops sending. The [Tracking Domains](https://docs.lettr.com/learn/domains/tracking-domains) page covers the setup, certificate states and troubleshooting.
