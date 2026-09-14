---
term: Sandbox Mode
question: What is
description: "Sandbox mode lets developers test an email integration without reaching real recipients. How test modes work, their limits, and Lettr's sandbox keys."
related: [api-key, rate-limiting, smtp-relay, webhook]
reading:
  - title: Sandbox and Testing Mode
    href: https://docs.lettr.com/knowledge-base/troubleshooting/sandbox-testing
  - title: Sandbox API Keys
    href: https://docs.lettr.com/learn/api-keys/sandbox
  - title: Test Emails
    href: https://docs.lettr.com/learn/sending/test-emails
---

**Sandbox mode** is a testing setup in which an email API accepts real requests but keeps the resulting messages away from real recipients. Developers use it in local development, CI pipelines and staging environments to check request formats, error handling and rendering before production traffic starts. Providers implement it in different ways, and the design decides what a passing test actually proves.

## How sandbox mode works

Test modes follow a few common designs. **The strictest never delivers anything**: the API validates the request and returns a normal response, but the message is discarded or stored for inspection. That confirms the request is well formed, while rendering, authentication and delivery stay untested.

A second design delivers the message, but only to addresses the account controls. The provider rewrites the recipients to a fixed inbox or accepts only a list of approved test addresses, so a real email arrives and can be opened in several clients and inspected for headers.

A third design separates credentials instead of accounts. A test key and a live key call the same endpoints, and the key alone decides how the message is treated. **Switching environments then means changing one secret**, not code, so staging runs exactly the request production runs, with a different key in its environment variables.

## Why sandbox mode matters

Test mail sent to real addresses causes damage that is hard to undo. A staging job working on a copy of production data can email real customers, and test sends to invented addresses produce hard bounces that count against the sending domain like any other failure.

A sandbox also removes setup barriers. Domain verification, DNS propagation and account approval take time, and a mode that works before those steps lets development start at once.

The limits are part of the design. **A sandbox is not a deliverability test**: mail from a shared test domain says nothing about how mailbox providers treat the sender's own domain. Sandboxes also tend to carry tighter [rate limits](/glossary/rate-limiting/) than live sending, which load tests run into quickly.

## Common problems with sandbox mode

- **Sandbox credentials in production:** mail meant for customers is quietly redirected, so a distinct key prefix and a startup check on the environment catch the mistake early.
- **Webhook gaps:** sandbox traffic may be isolated from the account's event pipeline, so webhook handlers need their own test path.
- **Rewritten senders:** a sandbox that swaps the sender domain changes authentication results, so final checks of headers belong on the real domain.
- **Restricted endpoints:** test credentials often cannot create or change configuration, which breaks setup scripts that expect full access.

## Sandbox mode in Lettr

Lettr implements sandbox mode as a separate type of [API key](/glossary/api-key/). **A sandbox key starts with `lttr_sandbox_`**, while live keys start with `lttr_`, and it is created under **Settings** > **API Keys** by setting **Type** to **Sandbox**.

Every email sent with a sandbox key is redirected: all `to`, `cc` and `bcc` addresses are replaced with the email address of the user who created the key, and the `from` domain is rewritten to the pre-verified `dev.uselettr.com` while the local part stays the same. No domain verification is needed, sandbox sends are free and do not count toward the monthly sending quota or daily limits, and the traffic runs through a dedicated subaccount separated from live sending.

Sandbox keys can reach the email sending and read-only endpoints. Write operations on domains, webhooks and templates return `403` with the error code `sandbox_restricted`. The limits are 10 requests per minute and 100 per day, reported in `X-Sandbox-RateLimit-*` response headers, and a key over either limit receives `429` with a `Retry-After` header.

Because sandbox sends run on an isolated subaccount, they do not trigger the team's webhooks, and the **Sandbox** toggle on the Events page shows sandbox traffic instead. Sandbox keys also work with the [SMTP relay](/glossary/smtp-relay/), where the domain requirement is waived and every message is redirected in the same way.

Test emails are a separate tool: real sends from a verified domain to addresses of the sender's choosing, with tracking disabled and analytics excluded. The [Sandbox API Keys](https://docs.lettr.com/learn/api-keys/sandbox) page lists every allowed and blocked endpoint.
