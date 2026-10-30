import type { PageServerLoad } from "./$types";

import { highlightCode } from "$lib/server/highlight";

const installCommands = `composer require lettr/lettr-laravel
php artisan lettr:init`;

const mailableExample = `use App\\Mail\\WelcomeEmail;
use Illuminate\\Support\\Facades\\Mail;

Mail::to('user@example.com')->queue(new WelcomeEmail());`;

/** Highlights the post's code at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  code: {
    installCommands: await highlightCode(installCommands, "bash"),
    mailableExample: await highlightCode(mailableExample, "php"),
  },
});
