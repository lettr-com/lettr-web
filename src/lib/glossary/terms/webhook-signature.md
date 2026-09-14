---
term: Webhook Signature
question: What is
description: "A webhook signature is an HMAC of the request body proving a webhook came from the expected sender unaltered. How to verify it, and how Lettr secures webhooks."
related: [webhook, api-key, base64-encoding, idempotency]
reading:
  - title: Authorization
    href: https://docs.lettr.com/learn/webhooks/authorization
  - title: Monitoring & Alerts
    href: https://docs.lettr.com/learn/settings/alerts
  - title: Webhooks
    href: https://docs.lettr.com/learn/webhooks/introduction
---

**A webhook signature** is a cryptographic value that a service attaches to each [webhook](/glossary/webhook/) request so the receiving endpoint can confirm that the request came from that service and that its body was not changed along the way. The service computes it from the request body and a secret shared with the receiver, most often with HMAC-SHA256, and sends the result in a header. The endpoint repeats the calculation and accepts the request only when the two values match.

## How a webhook signature works

Signing starts with a shared secret, a random value the service generates and the receiver stores when the webhook is set up. **The service runs HMAC over the exact bytes of the request body** using that secret and places the result, encoded as hex or [Base64](/glossary/base64-encoding/), in a request header. Many schemes also include a timestamp in the signed data and send it in a header alongside the signature.

The receiver takes the raw body, computes the HMAC with its own copy of the secret and compares the result with the header value. A match proves two things: the sender knew the secret, and the body is byte for byte what was signed. Anyone without the secret can still send requests to the URL, but cannot produce a signature that matches.

## Why webhook signatures matter

**A webhook URL cannot be treated as a secret.** It sits in configuration files, logs and dashboards, and an unverified endpoint accepts any well-formed request as a real event. A forged bounce or unsubscribe event can change application state, suppress a real customer or trigger follow-up emails.

A signature adds two protections that HTTPS alone does not. HTTPS encrypts the request in transit, while the signature proves who created the body. A signed timestamp also limits replay: a captured request cannot be resent later, because the receiver rejects timestamps outside a short tolerance window, often a few minutes.

## Common problems with webhook signatures

- **Parsing before verifying:** a framework that parses JSON and serializes it again changes whitespace or key order, so the recomputed HMAC no longer matches. Verification needs the raw body exactly as received.
- **Plain string comparison:** an ordinary equality check can leak timing information about how much of the signature matched, so verification uses a constant-time comparison function.
- **Encoding and secret mix-ups:** hex compared against Base64, a secret copied with trailing whitespace or the secret from another environment all produce mismatches that look like forgeries.
- **Signatures without deduplication:** a valid, recent request can still be a retry of one already processed, so signature checks work together with [idempotency](/glossary/idempotency/) based on event IDs.
- **Secrets in source code:** a signing secret committed to a repository is as exposed as an [API key](/glossary/api-key/) in the same place, and rotating it means updating both sides.

## Webhook signatures vs credential-based authentication

Some services authenticate webhooks with credentials instead of signatures. **HTTP Basic Auth sends a username and password** in the `Authorization` header, and OAuth 2.0 client credentials have the service fetch a token from the receiver's authorization server and send it as a Bearer token. Credentials prove the sender holds a secret but are not tied to the body, so integrity rests on HTTPS, while a signature covers the body itself. Either approach only helps when the endpoint rejects every request that fails the check.

## Webhook signature in Lettr

**Lettr's event webhooks authenticate with credentials configured on each webhook.** The authentication type is `none`, `basic` or `oauth2`. With `basic`, Lettr includes an `Authorization: Basic` header carrying the username and password entered when the webhook was created. With `oauth2`, Lettr obtains an access token from the customer's OAuth server before each delivery, using the client ID, client secret and token URL provided, and includes it as a Bearer token. The docs recommend verifying these credentials in the handler before processing events and storing them in environment variables or a secrets manager, never in source code.

HMAC signing appears in Lettr's alert webhooks. When the daily DNS health check finds that a verified domain's record has stopped working, a configured alert webhook receives a `domain_dns_regression` event with the affected domain, its type and the failing records, and webhook alerts are HMAC-signed when a signing secret is configured. Alert webhook URLs must be publicly accessible HTTPS endpoints.

The Authorization page also describes IP allowlisting, with Lettr's current IP addresses available from support, and a hard-to-guess URL path, which it calls an extra barrier and no substitute for authentication. The [Authorization](https://docs.lettr.com/learn/webhooks/authorization) page has verification examples for Node.js, Laravel and Python.
