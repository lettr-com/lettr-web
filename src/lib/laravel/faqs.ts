import type { FaqEntry } from "$lib/utils/pageJsonLd";

export interface LaravelFaq extends FaqEntry {
  /** Shown on the page instead of `answer` when a code block carries the details. */
  lead?: string;
  /** A highlighted block from the page load to show under the answer. */
  code?: "smtpEnv";
}

/*
 * Answers checked against lettr/lettr-laravel 2.8.0, docs.lettr.com and the
 * pricing data. `answer` goes into the FAQPage JSON-LD and the Markdown twin.
 */
export const laravelFaqs: LaravelFaq[] = [
  {
    question: "I am on PHP 8.3. Can I still use Lettr?",
    answer:
      "The package needs PHP 8.4. Until you upgrade, point Laravel's SMTP mailer at Lettr with your API key as the password: MAIL_HOST=smtp.lettr.com, MAIL_PORT=587, MAIL_USERNAME=lettr. Mailables and queues keep working, and you can switch to the package later without touching them.",
    lead: "The package needs PHP 8.4. Until you upgrade, point Laravel's SMTP mailer at Lettr with your API key as the password. Mailables and queues keep working, and you can switch to the package later without touching them.",
    code: "smtpEnv",
  },
  {
    question: "Does Lettr replace Laravel's mail system?",
    answer:
      "No. The package registers a lettr mail transport, so Mailables, Mail::to(), queued mail and Mail::fake() work as before. It adds Mail::lettr() and the LettrMailable base class for sending templates stored in Lettr.",
  },
  {
    question: "Do notifications go through Lettr?",
    answer:
      "Yes, on the mail channel. With MAIL_MAILER=lettr, mail notifications are delivered by Lettr like any other Mailable. The package does not add a notification channel of its own.",
  },
  {
    question: "How do I receive bounce and delivery webhooks?",
    answer:
      "Add a webhook endpoint in Lettr, or with Lettr::webhooks() from your app, and point it at a route you own. Lettr posts delivery, open, click, bounce and spam events to it, and can send Basic auth or OAuth 2.0 credentials with each request. The package does not ship a webhook controller, so you handle the request in your own route.",
  },
  {
    question: "How do I move from Mailgun, Postmark, Resend or SES?",
    answer:
      "Install the package and send one email type at a time with Mail::mailer('lettr') while your current mailer stays the default. When you are happy, set MAIL_MAILER=lettr. Your Mailables do not change.",
  },
  {
    question: "Can I test without verifying a domain?",
    answer:
      "Yes. Sandbox API keys send to your own inbox without any DNS setup and are not billed. In your test suite, Mail::fake() works as usual.",
  },
  {
    question: "Is there a rate limit?",
    answer:
      "The API accepts 3 requests per second per team, and the free plan sends up to 100 emails a day. Queue your sends: a RateLimitException carries retryAfter, so a job can wait and try again.",
  },
  {
    question: "Where is my data stored?",
    answer: "In the EU. Lettr is EU-hosted and compliant with GDPR and CCPA.",
  },
];
