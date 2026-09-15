---
term: Key Rotation
description: "Key rotation replaces a credential such as an API key or DKIM key on a schedule or after exposure. How it works without downtime, and rotation in Lettr."
related: [api-key, dkim-selector, dkim, webhook-signature, smtp-relay]
reading:
  - title: API Keys Introduction
    href: https://docs.lettr.com/learn/api-keys/introduction
  - title: Security Best Practices
    href: https://docs.lettr.com/knowledge-base/best-practices/security
---

**Key rotation** is the practice of replacing a secret credential with a new one and retiring the old one, either on a fixed schedule or as soon as the old one may have been exposed. In email, the credentials that get rotated are mainly [API keys](/glossary/api-key/), SMTP passwords, webhook signing secrets and the private keys behind [DKIM](/glossary/dkim/) signatures. Rotation limits how long a leaked or stolen credential stays useful to whoever holds it.

## How key rotation works

**Rotation without downtime depends on an overlap period** in which the old and the new credential are both valid. The new credential is created first, deployed to every system that uses the old one and confirmed working, and only then is the old one revoked. Revoking first breaks every service still configured with the old value.

API keys make the overlap straightforward, because most platforms allow several active keys on one account. Servers pick up the new key through an environment variable or a secrets manager, and the old key is deleted once no requests arrive with it.

Signing keys need a longer overlap, because a signature is checked some time after it is made. A DKIM key is rotated by publishing the new public key under a new [DKIM selector](/glossary/dkim-selector/), switching signing to that selector once the record resolves, and leaving the old record in DNS until mail signed with the old key has been delivered and checked. A [webhook signature](/glossary/webhook-signature/) secret is shared by the sender and the receiving endpoint, so both sides have to change it together.

## Why key rotation matters

**A credential works for whoever holds it, for as long as it stays valid.** Keys leak through committed `.env` files and build logs, and a leak is often discovered long after it happened. Scheduled rotation caps that window, since a key copied before the last rotation no longer works.

Rotation after a known exposure is the urgent case. A key committed to a Git repository stays in the history after the file is deleted, so removing the file is not enough and the key itself has to be replaced.

DKIM keys are rotated for a related reason. The M3AAWG best practice for DKIM key rotation recommends replacing keys at least every six months, which limits how much mail any single stolen or cracked private key could forge.

## Common problems with key rotation

- **Revoking before deploying:** deleting the old key while a background job or a staging server still uses it causes authentication failures the moment the key is gone.
- **Unknown usage:** a key shared by several services cannot be retired until every one of them has been found, which is why one key per service and environment keeps rotation routine.
- **Deleting the old DKIM record too early:** messages still in transit or waiting for a retry fail verification once their selector no longer resolves.
- **Checking DNS too soon:** [DNS propagation](/glossary/dns-propagation/) can take up to 48 hours, so a new selector record may not be visible everywhere right after it is published.

## Key rotation in Lettr

**Lettr's API key documentation recommends a rotation schedule**: create a new key, update the applications to use it, then revoke the old key. Keys are created under Settings > API Keys, and the full key is displayed only once, at creation. A key's value cannot be changed, so a new value always means a new key and the deletion of the old one. The Lettr security guidance recommends rotating keys every 90 days, and immediately when exposure is suspected or a key has been committed to Git.

Deleting a key is immediate and permanent, and any application still using it stops working at once. A request with a revoked key receives `401 Unauthorized` with the message "Invalid API key.", and `GET /api/auth/check` verifies a key's validity, which confirms the new key works before the old one is removed. Separate keys per environment mean a compromise in one environment only requires rotating that environment's key.

The [SMTP relay](/glossary/smtp-relay/) uses a Lettr API key as its password, so rotation covers SMTP integrations too. An SMTP client still configured with a revoked key fails with `535 Authentication credentials invalid` until its password setting is updated.

For DKIM, Lettr signs each message with the sending domain's private key and provides the selector and public key when the domain is added, with a 2048-bit key by default. The sender publishes a single DNS record and Lettr manages the cryptographic operations. The [API Keys page](https://docs.lettr.com/learn/api-keys/introduction) in the Lettr docs covers creating, restricting and revoking keys.
