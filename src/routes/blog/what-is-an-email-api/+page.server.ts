import type { PageServerLoad } from "./$types";

import { highlightCode } from "$lib/server/highlight";

const sendExample = `curl -X POST https://app.lettr.com/api/emails \\
  -H "Authorization: Bearer lttr_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "orders@yourapp.com",
    "to": ["user@example.com"],
    "subject": "Your order shipped",
    "template_slug": "order-shipped",
    "substitution_data": { "tracking_number": "1Z999AA1" }
  }'`;

const responseExample = `{
  "request_id": "b7e2a1c4-93f0-4d2e-8a51-6c0f3d9e7b21",
  "accepted": 1,
  "rejected": 0
}`;

/** Highlights the post's code at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  code: {
    sendExample: await highlightCode(sendExample, "bash"),
    responseExample: await highlightCode(responseExample, "json"),
  },
});
