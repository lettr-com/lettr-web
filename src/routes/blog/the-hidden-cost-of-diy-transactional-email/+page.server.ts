import type { PageServerLoad } from "./$types";

import { highlightCode } from "$lib/server/highlight";

const phpExample = `use Lettr\\Laravel\\Facades\\Lettr;

Lettr::to($user->email)
    ->template('welcome')
    ->with(['name' => $user->name])
    ->send();`;

/** Highlights the post's code at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  code: {
    phpExample: await highlightCode(phpExample, "php"),
  },
});
