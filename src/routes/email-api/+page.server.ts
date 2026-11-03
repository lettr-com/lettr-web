import type { PageServerLoad } from "./$types";

import { highlightTabs } from "$lib/server/highlight";
import type { CodeTab } from "$lib/utils/shiki";

// Real send examples, verified against docs.lettr.com on 2026-08-19:
// POST https://app.lettr.com/api/emails, Node `lettr` package,
// Python `lettr.Lettr(...).emails.send(from_email=...)`, PHP
// `Lettr::client(...)->emails()->sendHtml(...)`.
const sendTabs: CodeTab[] = [
  {
    label: "cURL",
    lang: "bash",
    code: `curl -X POST https://app.lettr.com/api/emails \\
  -H "Authorization: Bearer $LETTR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "sender@yourdomain.com",
    "from_name": "Your App",
    "to": ["recipient@example.com"],
    "subject": "Hello from Lettr",
    "html": "<h1>Welcome!</h1><p>Thanks for signing up.</p>"
  }'`,
  },
  {
    label: "Node.js",
    lang: "javascript",
    code: `import { Lettr } from "lettr";

const client = new Lettr(process.env.LETTR_API_KEY);

const { data, error } = await client.emails.send({
  from: "sender@yourdomain.com",
  from_name: "Your App",
  to: ["recipient@example.com"],
  subject: "Hello from Lettr",
  html: "<h1>Welcome!</h1><p>Thanks for signing up.</p>",
});

if (error) console.error(error.message);
else console.log(data.request_id);`,
  },
  {
    label: "Python",
    lang: "python",
    code: `import os
import lettr

client = lettr.Lettr(os.environ["LETTR_API_KEY"])

response = client.emails.send(
    from_email="sender@yourdomain.com",
    from_name="Your App",
    to=["recipient@example.com"],
    subject="Hello from Lettr",
    html="<h1>Welcome!</h1><p>Thanks for signing up.</p>",
)

print(response.request_id)`,
  },
  {
    label: "PHP",
    lang: "php",
    code: `use Lettr\\Lettr;

$lettr = Lettr::client(getenv('LETTR_API_KEY'));

$response = $lettr->emails()->sendHtml(
    from: 'sender@yourdomain.com',
    to: 'recipient@example.com',
    subject: 'Hello from Lettr',
    html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
);`,
  },
  {
    label: "Laravel",
    lang: "php",
    code: `use Lettr\\Laravel\\Facades\\Lettr;

Lettr::emails()->sendHtml(
    from: 'sender@yourdomain.com',
    to: 'recipient@example.com',
    subject: 'Hello from Lettr',
    html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
);`,
  },
];

/** Highlights the send examples at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  sendTabs: await highlightTabs(sendTabs),
});
