export interface TerminalLine {
  /** `cmd` is typed after the prompt and can be copied; the rest is output. */
  kind: "cmd" | "out" | "ok" | "dim" | "code";
  text: string;
}

export interface TerminalScript {
  id: string;
  label: string;
  title: string;
  lines: TerminalLine[];
}

/*
 * Only real output. Laravel's lines are the strings lettr-laravel's InitCommand
 * prints (trimmed); the other stacks run the SDK send snippets, which print the
 * request ID the API returns. Package managers' own install output is left out
 * rather than imitated.
 */
const requestId = "12345678901234567890";

export const terminalScripts: TerminalScript[] = [
  {
    id: "laravel",
    label: "Laravel",
    title: "my-app",
    lines: [
      { kind: "cmd", text: "composer require lettr/lettr-laravel" },
      { kind: "cmd", text: "php artisan lettr:init" },
      { kind: "dim", text: "Configuration saved to .env and config/lettr.php" },
      { kind: "ok", text: "Setup Complete" },
      { kind: "out", text: "Send emails using:" },
      {
        kind: "code",
        text: "Mail::lettr()->to($to)->sendTemplate('welcome', substitutionData: $data);",
      },
    ],
  },
  {
    id: "php",
    label: "PHP",
    title: "my-app",
    lines: [
      { kind: "cmd", text: "composer require lettr/lettr-php" },
      { kind: "cmd", text: "export LETTR_API_KEY=lttr_xxxxxxxxxxxx" },
      { kind: "cmd", text: "php send-welcome.php" },
      { kind: "out", text: requestId },
    ],
  },
  {
    id: "python",
    label: "Python",
    title: "my-app",
    lines: [
      { kind: "cmd", text: "pip install lettr" },
      { kind: "cmd", text: "export LETTR_API_KEY=lttr_xxxxxxxxxxxx" },
      { kind: "cmd", text: "python send_welcome.py" },
      { kind: "out", text: requestId },
    ],
  },
  {
    id: "node",
    label: "Node.js",
    title: "my-app",
    lines: [
      { kind: "cmd", text: "npm install lettr" },
      { kind: "cmd", text: "export LETTR_API_KEY=lttr_xxxxxxxxxxxx" },
      { kind: "cmd", text: "node send-welcome.mjs" },
      { kind: "out", text: requestId },
    ],
  },
];
