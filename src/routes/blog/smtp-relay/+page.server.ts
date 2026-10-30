import type { PageServerLoad } from "./$types";

import { highlightCode } from "$lib/server/highlight";

const nodemailerExample = `import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.lettr.com',
  port: 465,
  secure: true, // implicit TLS on 465
  auth: {
    user: 'lettr',
    pass: process.env.LETTR_API_KEY
  }
});

await transport.sendMail({
  from: 'orders@yourapp.com',
  to: 'user@example.com',
  subject: 'Your order shipped',
  html: '<p>Tracking number: 1Z999AA1</p>'
});`;

/** Highlights the post's code at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  code: {
    nodemailerExample: await highlightCode(nodemailerExample, "javascript"),
  },
});
