---
term: Webhook
heading: "What is a webhook?"
description: "A webhook is an HTTP request a service sends to an application when an event happens, such as an email bounce. How webhooks work, what goes wrong, and Lettr."
published: 2026-09-14
updated: 2026-09-14
related: [webhook-signature, idempotency, exponential-backoff, api-key, bounce]
reading:
  - title: Webhooks
    href: https://docs.lettr.com/learn/webhooks/introduction
  - title: Event Types
    href: https://docs.lettr.com/learn/webhooks/event-types
  - title: Retries
    href: https://docs.lettr.com/learn/webhooks/retries
---

**A webhook** is an HTTP request that one system sends to another when an event happens, so the receiver learns about the event without having to ask. The receiving application exposes a URL and registers it with the service, and the service posts a description of each event to that URL as it occurs. In email, webhooks report what happens to messages after they are sent, such as deliveries, bounces, opens, clicks and unsubscribes.

## How webhooks work

**A webhook reverses the direction of an API call.** With an API, the application makes a request and the service answers. With a webhook, the service makes the request, typically an HTTP `POST` with a JSON body, and the application answers with a status code. A `2xx` response tells the service the event arrived, and any other status, or no response within a time limit, counts as a failed delivery.

A subscription usually has three parts: the endpoint URL, the event types it should receive and a way for the endpoint to confirm that requests really come from the service. That confirmation takes the form of credentials the service sends with every request, or a [webhook signature](/glossary/webhook-signature/) computed over the request body.

Failed deliveries are retried. The service sends the event again on a schedule, usually with [exponential backoff](/glossary/exponential-backoff/), so a short outage at the endpoint delays events instead of losing them.

## Webhooks vs polling

The alternative to a webhook is polling, calling an API at intervals to ask whether anything has changed. **Polling spends requests whether or not anything happened**, and it learns about events only as often as the loop runs. A webhook arrives shortly after the event and costs nothing while nothing happens, which makes it the usual way to track email events at volume.

Polling keeps a role as a backstop. An endpoint that stays down past the retry window misses events, and a periodic check against the API fills the gap. The credentials also point in opposite directions: the [API key](/glossary/api-key/) used for polling authenticates the application to the service, while webhook credentials authenticate the service to the application, and the two are separate secrets.

## Common problems with webhooks

- **Slow handlers:** processing an event before responding can run past the service's timeout, which triggers a retry of an event that was already handled. Acknowledging at once and processing from a queue avoids it.
- **Duplicate events:** retries and network errors mean the same event can arrive more than once, so handlers need [idempotency](/glossary/idempotency/), usually by recording each event ID and skipping repeats.
- **Assumed ordering:** events for one message can arrive out of sequence, so a status update should not depend on a fixed order of arrival.
- **Open endpoints:** a URL that accepts any request lets anyone post fake events, which is why authentication belongs on every production endpoint.
- **Treating one event as final:** a message recorded as delivered can still produce a later [bounce](/glossary/bounce/), so status models allow a later event to change an earlier result.

## Webhook in Lettr

**Lettr webhooks are created from Webhooks in the dashboard sidebar** with the **Create Webhook** button. Each one needs a publicly accessible HTTPS endpoint URL and a choice of events: all events, or specific event types from five categories, Message, Engagement, Generation, Unsubscribe and Relay. There are 22 event types in total, among them `message.delivery`, `message.bounce`, `engagement.click`, `unsubscribe.link_unsubscribe` and `relay.relay_delivery` for inbound email, and engagement events require open or click tracking to be enabled. A webhook can be disabled without deleting it, which keeps its configuration.

Each webhook also has an authentication type. With `none`, requests carry no credentials. With `basic`, Lettr sends an `Authorization: Basic` header with the username and password set on the webhook. With `oauth2`, Lettr obtains an access token using the client ID, client secret and token URL provided, and sends it as a Bearer token.

A delivery counts as successful when the endpoint returns a 2xx status within 30 seconds. Failed deliveries are retried automatically with exponential backoff, SSL and TLS errors included. The docs recommend responding quickly and processing asynchronously, verifying the authentication before processing, and using the event `id` to detect and skip duplicates. The [Webhooks](https://docs.lettr.com/learn/webhooks/introduction) page includes a handler example in Node.js.
