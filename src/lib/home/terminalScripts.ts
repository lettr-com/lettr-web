export type TerminalStep =
  /** A shell command, typed after the prompt. */
  | { kind: "cmd"; text: string; prompt?: string }
  /** A multi-line file typed into the terminal, shown under a filename. */
  | { kind: "file"; name: string; text: string }
  /** Output that appears line by line. */
  | { kind: "out"; text: string; tone?: "ok" | "muted" | "plain" };

export interface TerminalScript {
  id: string;
  label: string;
  title: string;
  steps: TerminalStep[];
}

/* Install lines and calls come from the live quickstarts at docs.lettr.com. */
export const terminalScripts: TerminalScript[] = [
  {
    id: "laravel",
    label: "Laravel",
    title: "my-app — zsh",
    steps: [
      { kind: "cmd", text: "composer require lettr/lettr-laravel" },
      { kind: "out", text: "✓ Installed lettr/lettr-laravel", tone: "ok" },
      { kind: "cmd", text: "php artisan lettr:init" },
      { kind: "out", text: "✓ API key saved to .env", tone: "ok" },
      { kind: "cmd", text: "php artisan tinker" },
      {
        kind: "cmd",
        prompt: ">>>",
        text: "Mail::lettr()->to('user@example.com')->sendTemplate('welcome-email');",
      },
      { kind: "out", text: "✓ Sent welcome-email to user@example.com", tone: "ok" },
    ],
  },
  {
    id: "php",
    label: "PHP",
    title: "my-app — zsh",
    steps: [
      { kind: "cmd", text: "composer require lettr/lettr-php" },
      { kind: "out", text: "✓ Installed lettr/lettr-php", tone: "ok" },
      {
        kind: "file",
        name: "send.php",
        text: `<?php
use Lettr\\Lettr;

$lettr = Lettr::client($_ENV['LETTR_API_KEY']);

$lettr->emails()->send(
    $lettr->emails()->create()
        ->from('hello@yourdomain.com', 'Your App')
        ->to(['user@example.com'])
        ->subject('Welcome aboard')
        ->html('<p>Glad you are here.</p>')
);`,
      },
      { kind: "cmd", text: "php send.php" },
      { kind: "out", text: "✓ Sent to user@example.com", tone: "ok" },
    ],
  },
  {
    id: "python",
    label: "Python",
    title: "my-app — zsh",
    steps: [
      { kind: "cmd", text: "pip install lettr" },
      { kind: "out", text: "✓ Installed lettr", tone: "ok" },
      {
        kind: "file",
        name: "send.py",
        text: `import os
import lettr

client = lettr.Lettr(os.environ["LETTR_API_KEY"])
client.emails.send(
    from_email="hello@yourdomain.com",
    to=["user@example.com"],
    subject="Welcome aboard",
    html="<p>Glad you are here.</p>",
)`,
      },
      { kind: "cmd", text: "python send.py" },
      { kind: "out", text: "✓ Sent to user@example.com", tone: "ok" },
    ],
  },
  {
    id: "node",
    label: "Node.js",
    title: "my-app — zsh",
    steps: [
      { kind: "cmd", text: "npm install lettr" },
      { kind: "out", text: "✓ Installed lettr", tone: "ok" },
      {
        kind: "file",
        name: "send.mjs",
        text: `import { Lettr } from "lettr";

const client = new Lettr(process.env.LETTR_API_KEY);
await client.emails.send({
  from: "hello@yourdomain.com",
  to: ["user@example.com"],
  subject: "Welcome aboard",
  html: "<p>Glad you are here.</p>",
});`,
      },
      { kind: "cmd", text: "node send.mjs" },
      { kind: "out", text: "✓ Sent to user@example.com", tone: "ok" },
    ],
  },
];

/** The first command of a script (the install line), which is all the Copy button copies. */
export function installCommand(script: TerminalScript): string {
  const first = script.steps.find((step) => step.kind === "cmd");
  return first?.kind === "cmd" ? first.text : "";
}
