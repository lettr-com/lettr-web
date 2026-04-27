import { createHighlighter, type Highlighter, type ThemeRegistration } from "shiki";

const lettrTheme: ThemeRegistration = {
  name: "lettr",
  type: "dark",
  colors: {
    "editor.background": "#1a1a1a",
    "editor.foreground": "#e0e0e0",
  },
  settings: [
    {
      scope: [],
      settings: { foreground: "#f0f0f0" },
    },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#6b7280" },
    },
    {
      scope: ["string", "string.quoted"],
      settings: { foreground: "#f9a8b8" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: { foreground: "#f43f6b" },
    },
    {
      scope: ["entity.name.function", "support.function"],
      settings: { foreground: "#ffffff" },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter"],
      settings: { foreground: "#e8e8e8" },
    },
    {
      scope: ["constant", "constant.numeric", "constant.language"],
      settings: { foreground: "#f9c4d0" },
    },
    {
      scope: ["entity.name.type", "entity.name.class", "support.class"],
      settings: { foreground: "#f9a8b8" },
    },
    {
      scope: ["punctuation", "meta.brace"],
      settings: { foreground: "#a1a1aa" },
    },
    {
      scope: ["entity.name.tag"],
      settings: { foreground: "#f43f6b" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#f9c4d0" },
    },
    {
      scope: ["support.type.property-name", "meta.object-literal.key"],
      settings: { foreground: "#e8e8e8" },
    },
    {
      scope: ["keyword.operator", "keyword.operator.assignment"],
      settings: { foreground: "#a1a1aa" },
    },
  ],
};

let highlighter: Highlighter | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: [lettrTheme],
      langs: ["php", "javascript", "go", "ruby", "java", "bash", "shell"],
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
    label: "Laravel",
    lang: "php",
    code: `use Illuminate\\Support\\Facades\\Mail;

Mail::lettr()
    ->to('user@example.com')
    ->sendTemplate('welcome-email', [
        'name' => 'John',
        'company' => 'Acme Inc',
    ]);`,
  },
  {
    label: "PHP",
    lang: "php",
    code: `use Lettr\\Lettr;

$lettr = new Lettr(getenv('LETTR_API_KEY'));

$lettr->sendTemplate('welcome-email', [
    'to' => 'user@example.com',
    'name' => 'John',
    'company' => 'Acme Inc',
]);`,
  },
  {
    label: "Node.js",
    lang: "javascript",
    code: `import { Lettr } from '@lettr/node';

const lettr = new Lettr(process.env.LETTR_API_KEY);

await lettr.sendTemplate('welcome-email', {
  to: 'user@example.com',
  name: 'John',
  company: 'Acme Inc',
});`,
  },
  {
    label: "Go",
    lang: "go",
    code: `package main

import "github.com/lettr/lettr-go"

func main() {
    client := lettr.NewClient("your_api_key")

    client.SendTemplate("welcome-email", &lettr.Params{
        To:      "user@example.com",
        Name:    "John",
        Company: "Acme Inc",
    })
}`,
  },
  {
    label: "Ruby",
    lang: "ruby",
    code: `require 'lettr'

client = Lettr::Client.new(api_key: 'your_api_key')

client.send_template('welcome-email',
  to: 'user@example.com',
  name: 'John',
  company: 'Acme Inc'
)`,
  },
  {
    label: "cURL",
    lang: "bash",
    code: `curl -X POST https://api.lettr.dev/v1/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "template": "welcome-email",
    "to": "user@example.com",
    "name": "John",
    "company": "Acme Inc"
  }'`,
  },
  {
    label: "Java",
    lang: "java",
    code: `import com.lettr.Lettr;
import java.util.Map;

Lettr lettr = new Lettr(System.getenv("LETTR_API_KEY"));

lettr.sendTemplate("welcome-email", Map.of(
    "to", "user@example.com",
    "name", "John",
    "company", "Acme Inc"
));`,
  },
];
