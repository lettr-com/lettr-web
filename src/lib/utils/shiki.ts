import { createHighlighter, type Highlighter, type ThemeRegistration } from 'shiki';

const lettrTheme: ThemeRegistration = {
	name: 'lettr',
	type: 'dark',
	colors: {
		'editor.background': '#1a1a1a',
		'editor.foreground': '#e0e0e0'
	},
	settings: [
		{
			scope: [],
			settings: { foreground: '#e0e0e0' }
		},
		{
			scope: ['comment', 'punctuation.definition.comment'],
			settings: { foreground: '#555555' }
		},
		{
			scope: ['string', 'string.quoted'],
			settings: { foreground: '#f2728a' }
		},
		{
			scope: ['keyword', 'storage.type', 'storage.modifier'],
			settings: { foreground: '#EC104B' }
		},
		{
			scope: ['entity.name.function', 'support.function'],
			settings: { foreground: '#ffffff' }
		},
		{
			scope: ['variable', 'variable.other', 'variable.parameter'],
			settings: { foreground: '#d4d4d4' }
		},
		{
			scope: ['constant', 'constant.numeric', 'constant.language'],
			settings: { foreground: '#f4a0b3' }
		},
		{
			scope: ['entity.name.type', 'entity.name.class', 'support.class'],
			settings: { foreground: '#f2728a' }
		},
		{
			scope: ['punctuation', 'meta.brace'],
			settings: { foreground: '#888888' }
		},
		{
			scope: ['entity.name.tag'],
			settings: { foreground: '#EC104B' }
		},
		{
			scope: ['entity.other.attribute-name'],
			settings: { foreground: '#f4a0b3' }
		},
		{
			scope: ['support.type.property-name', 'meta.object-literal.key'],
			settings: { foreground: '#d4d4d4' }
		},
		{
			scope: ['keyword.operator', 'keyword.operator.assignment'],
			settings: { foreground: '#888888' }
		}
	]
};

let highlighter: Highlighter | null = null;

export async function getHighlighter(): Promise<Highlighter> {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: [lettrTheme],
			langs: ['php', 'javascript', 'python', 'go', 'ruby', 'bash', 'shell']
		});
	}
	return highlighter;
}

export interface CodeTab {
	label: string;
	lang: string;
	code: string;
}

export const codeTabs: CodeTab[] = [
	{
		label: 'Laravel',
		lang: 'php',
		code: `use Illuminate\\Support\\Facades\\Mail;

Mail::lettr()
    ->to('user@example.com')
    ->sendTemplate('welcome-email', [
        'name' => 'John',
        'company' => 'Acme Inc',
    ]);`
	},
	{
		label: 'PHP',
		lang: 'php',
		code: `$ch = curl_init('https://api.lettr.dev/v1/send');

curl_setopt_array($ch, [
    CURLOPT_POST       => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'from'    => 'hello@yourapp.com',
        'to'      => 'user@example.com',
        'subject' => 'Welcome to Lettr',
    ]),
]);

$response = curl_exec($ch);`
	},
	{
		label: 'Node.js',
		lang: 'javascript',
		code: `import { Lettr } from '@lettr/node';

const lettr = new Lettr(process.env.LETTR_API_KEY);

await lettr.emails.send({
  from: 'hello@yourapp.com',
  to: 'user@example.com',
  subject: 'Welcome to Lettr',
  html: '<h1>Hello!</h1>',
});`
	},
	{
		label: 'Python',
		lang: 'python',
		code: `import lettr

client = lettr.Client(api_key="your_api_key")

client.emails.send(
    from_email="hello@yourapp.com",
    to="user@example.com",
    subject="Welcome to Lettr",
    html="<h1>Hello!</h1>",
)`
	},
	{
		label: 'Go',
		lang: 'go',
		code: `package main

import "github.com/lettr/lettr-go"

func main() {
    client := lettr.NewClient("your_api_key")

    client.Emails.Send(&lettr.SendParams{
        From:    "hello@yourapp.com",
        To:      "user@example.com",
        Subject: "Welcome to Lettr",
        HTML:    "<h1>Hello!</h1>",
    })
}`
	},
	{
		label: 'Ruby',
		lang: 'ruby',
		code: `require 'lettr'

client = Lettr::Client.new(api_key: 'your_api_key')

client.emails.send(
  from: 'hello@yourapp.com',
  to: 'user@example.com',
  subject: 'Welcome to Lettr',
  html: '<h1>Hello!</h1>'
)`
	},
	{
		label: 'cURL',
		lang: 'bash',
		code: `curl -X POST https://api.lettr.dev/v1/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "hello@yourapp.com",
    "to": "user@example.com",
    "subject": "Welcome to Lettr",
    "html": "<h1>Hello!</h1>"
  }'`
	}
];
