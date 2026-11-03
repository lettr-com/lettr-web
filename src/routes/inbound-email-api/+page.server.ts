import type { PageServerLoad } from "./$types";

import { highlightTabs } from "$lib/server/highlight";
import type { CodeTab } from "$lib/utils/shiki";

// What developers actually write — a webhook receiver that turns a parsed
// inbound email into a ticket. The parsed payload lands as JSON on `data`;
// every handler reads the same from / subject / text / attachments shape.
const handlerTabs: CodeTab[] = [
  {
    label: "Node.js",
    lang: "javascript",
    code: `import express from 'express';

const app = express();

// Lettr POSTs a parsed inbound email to your endpoint
app.post('/webhooks/inbound', express.json(), (req, res) => {
  const { from, to, subject, text, attachments } = req.body.data;

  // Turn the email into a ticket, reply, or workflow
  createTicket({ from, subject, body: text, attachments });

  // Respond 200 fast; dedupe on the message id
  res.sendStatus(200);
});`,
  },
  {
    label: "PHP",
    lang: "php",
    code: `// POST /webhooks/inbound
$payload = json_decode(file_get_contents('php://input'), true);
$email   = $payload['data'];

// Turn the parsed inbound email into a ticket
createTicket(
    from:        $email['from'],
    subject:     $email['subject'],
    body:        $email['text'],
    attachments: $email['attachments'],
);

// Respond 200 fast; dedupe on the message id
http_response_code(200);`,
  },
  {
    label: "Ruby",
    lang: "ruby",
    code: `# POST /webhooks/inbound
post '/webhooks/inbound' do
  email = JSON.parse(request.body.read)['data']

  Ticket.create!(
    from:    email['from'],
    subject: email['subject'],
    body:    email['text']
  )

  # Respond 200 fast; dedupe on the message id
  status 200
end`,
  },
  {
    label: "Go",
    lang: "go",
    code: `func inbound(w http.ResponseWriter, r *http.Request) {
    var payload struct {
        Data struct {
            From    string \`json:"from"\`
            Subject string \`json:"subject"\`
            Text    string \`json:"text"\`
        } \`json:"data"\`
    }
    json.NewDecoder(r.Body).Decode(&payload)

    // Turn the parsed inbound email into a ticket
    createTicket(payload.Data.From, payload.Data.Subject, payload.Data.Text)

    w.WriteHeader(http.StatusOK)
}`,
  },
];

/** Highlights the webhook handlers at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  handlerTabs: await highlightTabs(handlerTabs),
});
