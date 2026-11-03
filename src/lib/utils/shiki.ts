import type { ThemeRegistration } from "shiki";

export const lettrTheme: ThemeRegistration = {
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
      scope: ["property.value.dotenv"],
      settings: { foreground: "#f9a8b8" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: { foreground: "#ff6b8f" },
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
      settings: { foreground: "#ff6b8f" },
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

/**
 * Rose & Mint, from the code lab: crimson keywords, brand-green strings and
 * pink types, with neutrals for structure, so the values a reader edits stand
 * apart from the syntax. Tuned for the slate panel (#1c2434).
 */
export const lettrMintTheme: ThemeRegistration = {
  name: "lettr-mint",
  type: "dark",
  colors: {
    "editor.background": "#1c2434",
    "editor.foreground": "#e8e3e6",
  },
  settings: [
    { scope: [], settings: { foreground: "#e8e3e6" } },
    {
      scope: [
        "keyword",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.other.use",
        "keyword.other.new",
      ],
      settings: { foreground: "#ff6b8f" },
    },
    {
      scope: ["string", "string.quoted", "string.template", "punctuation.definition.string"],
      settings: { foreground: "#8ee3b5" },
    },
    {
      scope: ["entity.name.function", "support.function", "variable.function"],
      settings: { foreground: "#ffffff" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "support.class",
        "entity.name.namespace",
        "support.other.namespace",
        "support.type",
      ],
      settings: { foreground: "#f9a8b8" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character.escape"],
      settings: { foreground: "#f5c38e" },
    },
    {
      scope: [
        "support.type.property-name",
        "meta.object-literal.key",
        "variable.other.property",
        "variable.other.object.property",
        "entity.name.variable.parameter",
      ],
      settings: { foreground: "#cdd2db" },
    },
    {
      scope: [
        "punctuation",
        "meta.brace",
        "keyword.operator",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.accessor",
      ],
      settings: { foreground: "#8b93a3" },
    },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#7c8494" } },
    {
      scope: [
        "variable",
        "variable.other",
        "variable.parameter",
        "variable.other.php",
        "punctuation.definition.variable",
        "string.unquoted.argument.shell",
      ],
      settings: { foreground: "#e8e3e6" },
    },
    { scope: ["constant.other.option"], settings: { foreground: "#b5bcc8" } },
  ],
};

export interface CodeTab {
  label: string;
  lang: string;
  code: string;
}

/** A tab with its code highlighted at prerender time by `$lib/server/highlight`. */
export interface HighlightedTab extends CodeTab {
  html: string;
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
