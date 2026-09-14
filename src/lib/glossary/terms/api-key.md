---
term: API Key
question: What is
description: "An API key is the secret token that authenticates requests to an API. How API keys work, how to keep them safe, and how Lettr scopes and restricts them."
related: [api-error-code, sandbox-mode, rate-limiting, webhook-signature, sender-reputation]
reading:
  - title: API Keys Introduction
    href: https://docs.lettr.com/learn/api-keys/introduction
  - title: Security Best Practices
    href: https://docs.lettr.com/knowledge-base/best-practices/security
  - title: API Key Permissions
    href: https://docs.lettr.com/learn/api-keys/permissions
---

**An API key** is a secret token that identifies and authenticates the caller of an API. The client sends it with every request, and the server uses it to decide which account the request belongs to and what that request may do. For an email API the key is the credential that sends mail from the account's domains, so anyone holding a leaked key can send under that name.

## How API keys work

**Most APIs expect the key in the `Authorization` header** with the Bearer scheme, as in `Authorization: Bearer <key>`. The server matches the key against the keys it has issued, rejects the request with `401 Unauthorized` when the key is missing or unknown, and otherwise applies the permissions attached to that key. A request outside those permissions gets `403 Forbidden`, usually with an [API error code](/glossary/api-error-code/) that names the reason.

Keys usually carry a recognizable prefix. The prefix lets secret scanners in code hosts detect a leaked key, and it lets a developer tell a test key from a production key at a glance. Servers often store only a hash of each key, which is why many platforms show the full value once at creation and never again.

## Why API key security matters

A key works for whoever holds it. **An exposed key can send email from the account's verified domains**, read recipient data or change configuration, depending on its permissions. Mail sent with a stolen key counts against the domain's [sender reputation](/glossary/sender-reputation/) exactly like the owner's own sends.

Keys belong on servers. Frontend JavaScript and mobile apps ship their code to user devices, where a key can be extracted. Server code reads the key from an environment variable, and the `.env` file that holds it stays out of version control.

## Best practices for API keys

**Least privilege limits the damage of a leak.** A service that only sends email gets a key that can only send, so a compromise of that service cannot touch templates, domains or webhooks. Separate keys per environment and per service keep revocation independent, so replacing the staging key leaves production running.

- **IP restrictions:** a production key limited to the servers' addresses is useless to anyone who copies it.
- **Rotation:** a new key deployed before the old one is revoked replaces a credential without downtime.
- **Git history:** a key committed once stays in the repository history after the file is deleted, so it has to be rotated, not only removed.
- **Descriptive names:** a name such as "Production Web Server" shows which system is affected when a key is revoked.

## API key in Lettr

Lettr keys are created under Settings > API Keys, and **the full key is displayed only once**, at creation. A live key starts with `lttr_` followed by a 64-character random string, and a sandbox key starts with `lttr_sandbox_`. Requests pass the key as a Bearer token in the `Authorization` header, and `GET /api/auth/check` confirms that a key is valid.

Each key has one of two dashboard permission levels. Full Access covers every endpoint, including templates, domains, webhooks and projects. Sending Only is limited to emails, SMS and WhatsApp, and any other endpoint returns `403` with the `insufficient_scope` error code. Keys can also be restricted to single IP addresses or CIDR ranges, and a request from any other address receives `403 Forbidden`.

[Sandbox](/glossary/sandbox-mode/) keys redirect every message to the email address of the user who created the key, rewrite the From domain to the pre-verified `dev.uselettr.com` and have no billing impact, so they work before any sending domain is verified. They have their own [rate limits](/glossary/rate-limiting/).

A key's name, permission level and IP restrictions can be edited, but the key value cannot. Replacing a value means creating a new key and deleting the old one, and deletion takes effect immediately for every application still using it. The [API Keys page](https://docs.lettr.com/learn/api-keys/introduction) in the Lettr docs covers creation, restrictions and the endpoints a key can reach.
