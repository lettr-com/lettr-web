import type { PageServerLoad } from "./$types";

import { highlightCode } from "$lib/server/highlight";

const sendTemplate = `import { Lettr } from 'lettr';

const lettr = new Lettr(process.env.LETTR_API_KEY);

const result = await lettr.emails.send({
  from: 'onboarding@yourapp.com',
  to: [user.email],
  template_slug: 'welcome',
  substitution_data: {
    first_name: user.firstName,
    product: 'Acme',
    first_action: 'import your first contact list'
  }
});`;

const scheduleSend = `// Step 2 of the sequence: a setup nudge, three days later.
const sendAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

await lettr.emails.schedule({
  from: 'onboarding@yourapp.com',
  to: [user.email],
  template_slug: 'finish-setup',
  substitution_data: { first_name: user.firstName },
  scheduled_at: sendAt.toISOString()
});`;

/** Highlights the post's code at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  code: {
    sendTemplate: await highlightCode(sendTemplate, "javascript"),
    scheduleSend: await highlightCode(scheduleSend, "javascript"),
  },
});
