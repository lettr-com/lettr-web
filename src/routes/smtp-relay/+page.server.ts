import type { PageServerLoad } from "./$types";

import { highlightTabs } from "$lib/server/highlight";
import type { CodeTab } from "$lib/utils/shiki";

// Real, copy-paste SMTP relay configuration. Username is always the literal
// word "lettr"; the password is a Lettr API key (starts with "lttr_"). Host
// and ports are the live relay endpoints — 465 implicit TLS (recommended),
// 587 STARTTLS, with 2465 / 2587 as firewall-friendly alternates.
const smtpTabs: CodeTab[] = [
  {
    label: "SMTP settings",
    lang: "bash",
    code: `# Point any app, server, or framework at Lettr
SMTP_HOST=smtp.lettr.com
SMTP_PORT=465            # implicit TLS (587 STARTTLS; 2465/2587 alt)
SMTP_USERNAME=lettr      # always the literal word "lettr"
SMTP_PASSWORD=lttr_your_api_key_here       # your Lettr API key
SMTP_SECURE=true`,
  },
  {
    label: "Laravel",
    lang: "bash",
    code: `# .env — then run: php artisan config:clear
MAIL_MAILER=smtp
MAIL_HOST=smtp.lettr.com
MAIL_PORT=587                              # or 465 with MAIL_ENCRYPTION=ssl
MAIL_USERNAME=lettr                        # always the literal word "lettr"
MAIL_PASSWORD=lttr_your_api_key_here       # your Lettr API key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=you@yourdomain.com
MAIL_FROM_NAME="\${APP_NAME}"`,
  },
  {
    label: "Node.js",
    lang: "javascript",
    code: `import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.lettr.com',
  port: 465,
  secure: true,
  auth: { user: 'lettr', pass: process.env.LETTR_API_KEY }
});

await transport.sendMail({
  from: 'you@yourdomain.com',
  to: 'user@example.com',
  subject: 'Your login code',
  text: 'Your code is 123456'
});`,
  },
  {
    label: "PHP",
    lang: "php",
    code: `$mail = new PHPMailer(true);

$mail->isSMTP();
$mail->Host       = 'smtp.lettr.com';
$mail->Port       = 465;
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->SMTPAuth   = true;
$mail->Username   = 'lettr';
$mail->Password   = getenv('LETTR_API_KEY');

$mail->setFrom('you@yourdomain.com');
$mail->addAddress('user@example.com');
$mail->Subject = 'Your login code';
$mail->Body    = 'Your code is 123456';
$mail->send();`,
  },
  {
    label: "Ruby",
    lang: "ruby",
    code: `require 'mail'

Mail.defaults do
  delivery_method :smtp,
    address:   'smtp.lettr.com',
    port:      465,
    user_name: 'lettr',
    password:  ENV['LETTR_API_KEY'],
    tls:       true
end

Mail.deliver do
  from    'you@yourdomain.com'
  to      'user@example.com'
  subject 'Your login code'
  body    'Your code is 123456'
end`,
  },
  {
    label: "Go",
    lang: "go",
    code: `package main

import (
    "net/smtp"
    "os"
)

func main() {
    auth := smtp.PlainAuth("", "lettr",
        os.Getenv("LETTR_API_KEY"), "smtp.lettr.com")

    msg := []byte("To: user@example.com\\r\\n" +
        "Subject: Your login code\\r\\n\\r\\n" +
        "Your code is 123456\\r\\n")

    smtp.SendMail("smtp.lettr.com:587", auth,
        "you@yourdomain.com",
        []string{"user@example.com"}, msg)
}`,
  },
];

/** Highlights the relay configs at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  smtpTabs: await highlightTabs(smtpTabs),
});
