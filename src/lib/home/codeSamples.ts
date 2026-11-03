import type { CodeTab } from "$lib/utils/shiki";

export interface SwitcherTab extends CodeTab {
  id: string;
}

/*
 * The homepage "Dev integrate." samples. Each is copied from the official SDK
 * send snippets (lettr-app resources/ai/snippets) and, for cURL, from the API
 * reference: POST https://app.lettr.com/api/emails. Placeholders only.
 */
export const homeCodeTabs: SwitcherTab[] = [
  {
    id: "laravel",
    label: "Laravel",
    lang: "php",
    code: `use Illuminate\\Support\\Facades\\Mail;

Mail::lettr()
    ->to($user->email)
    ->sendTemplate('welcome', substitutionData: [
        'first_name' => $user->first_name,
    ]);`,
  },
  {
    id: "node",
    label: "Node.js",
    lang: "typescript",
    code: `import { Lettr } from 'lettr';

const client = new Lettr(process.env.LETTR_API_KEY!);

await client.emails.send({
    from: 'hello@yourdomain.com',
    to: [user.email],
    subject: 'Welcome to Acme',
    templateId: 'welcome',
    substitutionData: { first_name: user.firstName },
});`,
  },
  {
    id: "python",
    label: "Python",
    lang: "python",
    code: `import os
import lettr

client = lettr.Lettr(os.environ["LETTR_API_KEY"])

client.emails.send(
    from_email="hello@yourdomain.com",
    to=[user.email],
    subject="Welcome to Acme",
    template_id="welcome",
    substitution_data={"first_name": user.first_name},
)`,
  },
  {
    id: "php",
    label: "PHP",
    lang: "php",
    code: `use Lettr\\Lettr;

$lettr = Lettr::client(getenv('LETTR_API_KEY'));

$lettr->emails()->send(
    $lettr->emails()->create()
        ->from('hello@yourdomain.com', 'Acme')
        ->to([$user->email])
        ->subject('Welcome to Acme')
        ->templateId('welcome')
        ->substitutionData(['first_name' => $user->firstName])
);`,
  },
  {
    id: "curl",
    label: "cURL",
    lang: "bash",
    code: `curl -X POST https://app.lettr.com/api/emails \\
  -H "Authorization: Bearer $LETTR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "hello@yourdomain.com",
    "to": ["clara@example.com"],
    "template_slug": "welcome",
    "substitution_data": { "first_name": "Clara" }
  }'`,
  },
];
