import type { PageServerLoad } from "./$types";

import { highlightCode } from "$lib/server/highlight";

const restTemplateExample = `POST /emails
{
  "to": "user@example.com",
  "template_id": "order-confirmation",
  "merge_data": {
    "name": "Alex",
    "order_id": "ORD-4821",
    "items": [
      { "name": "Widget Pro", "qty": 2, "price": "$24.00" }
    ]
  }
}`;

const restErrorExample = `{
  "status": 422,
  "error": "invalid_recipient",
  "message": "The address user@invalid-domain.test could not be validated. Check the domain exists and has MX records."
}`;

/** Highlights the post's code at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  code: {
    restTemplateExample: await highlightCode(restTemplateExample, "javascript"),
    restErrorExample: await highlightCode(restErrorExample, "javascript"),
  },
});
