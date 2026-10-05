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

/*
 * Package names for Laravel and Node come from the live docs. The PHP, Python
 * and React installs are placeholders until the matching SDKs are confirmed.
 */
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

$lettr = new Lettr(getenv('LETTR_API_KEY'));
$lettr->sendTemplate('welcome-email', [
    'to' => 'user@example.com',
]);`,
      },
      { kind: "cmd", text: "php send.php" },
      { kind: "out", text: "✓ Sent welcome-email to user@example.com", tone: "ok" },
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
from lettr import Lettr

client = Lettr(api_key=os.environ["LETTR_API_KEY"])
client.send_template(
    "welcome-email",
    to="user@example.com",
)`,
      },
      { kind: "cmd", text: "python send.py" },
      { kind: "out", text: "✓ Sent welcome-email to user@example.com", tone: "ok" },
    ],
  },
  {
    id: "react",
    label: "React",
    title: "my-app — zsh",
    steps: [
      { kind: "cmd", text: "npm install @lettr/node" },
      { kind: "out", text: "✓ Installed @lettr/node", tone: "ok" },
      {
        kind: "file",
        name: "app/actions.ts",
        text: `'use server';
import { Lettr } from '@lettr/node';

const lettr = new Lettr(process.env.LETTR_API_KEY);

export async function sendWelcome() {
  await lettr.sendTemplate('welcome-email', {
    to: 'user@example.com',
  });
}`,
      },
      { kind: "cmd", text: "npm run dev" },
      { kind: "out", text: "✓ Ready on http://localhost:3000", tone: "ok" },
    ],
  },
];

/** The first command of a script (the install line), which is all the Copy button copies. */
export function installCommand(script: TerminalScript): string {
  const first = script.steps.find((step) => step.kind === "cmd");
  return first?.kind === "cmd" ? first.text : "";
}
