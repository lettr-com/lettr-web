<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		TldrList,
		Callout,
		Code,
		Faq,
		FaqItem
	} from '$lib/components/blog';

	const sendExample = `curl -X POST https://app.lettr.com/api/emails \\
  -H "Authorization: Bearer lttr_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "orders@yourapp.com",
    "to": ["user@example.com"],
    "subject": "Your order shipped",
    "template_slug": "order-shipped",
    "substitution_data": { "tracking_number": "1Z999AA1" }
  }'`;

	const responseExample = `{
  "request_id": "b7e2a1c4-93f0-4d2e-8a51-6c0f3d9e7b21",
  "accepted": 1,
  "rejected": 0
}`;
</script>

<BlogPost
	category="Engineering"
	title="Email API: what it is and how to choose one"
	excerpt="What an email API is and how it works: the request and response shape, how it differs from an SMTP relay and from mailbox APIs like the Gmail API, what an SMTP API means, the criteria that matter when choosing one, and the free tiers available in 2026."
	metaDescription="What an email API is, how it differs from SMTP and the Gmail API, the criteria for choosing one, and the free email API tiers available in 2026."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="July 10, 2026"
	datetime="2026-07-10"
	readTime="8 min read"
	slug="what-is-an-email-api"
>
	<Lead>
		An email API is an HTTP interface to an email provider's sending infrastructure. The request
		is a JSON object describing a message (sender, recipients, content or a template reference),
		the immediate response is an ID for tracking it, and everything that happens afterward
		(delivery, bounce, open, complaint) comes back as events. It is the standard way applications
		send email today, and this guide covers how it works, what separates it from SMTP and from
		mailbox APIs like the Gmail API, and what to evaluate when picking one.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>An email API accepts a JSON message and returns an ID; delivery is
				asynchronous.</strong> A 200-class response means accepted for sending, not delivered,
				and webhooks carry the actual outcome.
			</li>
			<li>
				<strong>The Gmail API is not this.</strong> Mailbox APIs automate a human mailbox over
				OAuth and are capped at personal-correspondence scale (2,000 messages a day on a
				Workspace account); application email needs a transactional email API.
			</li>
			<li>
				<strong>Choose on the operational features, not the send endpoint.</strong> Every
				provider can POST an email; webhooks, idempotency, template hosting, data retention, and
				suppression handling are where they differ.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What an email API is and what it returns</Heading>

	<Paragraph>
		The mechanics fit in one request. The application authenticates with an API key and POSTs a
		JSON body; the provider validates it, queues the message, signs it with the sending domain's
		DKIM key, and delivers it over SMTP to each recipient's mail server. <strong>The provider
		owns the hard part</strong>: warmed sending IPs, authentication, retries against greylisting,
		and bounce processing. A complete send through Lettr's API looks like this:
	</Paragraph>

	<Code lang="bash" code={sendExample} />

	<Paragraph>The response arrives in milliseconds:</Paragraph>

	<Code lang="json" code={responseExample} />

	<Paragraph>
		The <code>request_id</code> is the handle for everything that follows.
		<strong>A successful response means the message was accepted for sending, not that it was
		delivered</strong>; SendGrid's API makes the semantics explicit by returning
		<code>202 Accepted</code>. The delivery outcome arrives asynchronously through webhooks,
		where the standard event set across providers is delivered, bounced, deferred, opened,
		clicked, complained, and unsubscribed. The
		<a href="/blog/the-journey-of-an-email/">journey of an email</a> traces what happens between
		those two moments.
	</Paragraph>

	<Heading level={2}>Email API vs. SMTP relay</Heading>

	<Paragraph>
		The alternative transport for the same job is an <a href="/blog/smtp-relay/">SMTP relay</a>:
		the application speaks the SMTP protocol to a provider host, which forwards the finished
		message onward. The relay reaches the same infrastructure, so <strong>deliverability is
		identical; the difference is what the protocol can express</strong>. SMTP moves a fully
		assembled message and nothing else, while an API accepts structured data, which is what makes
		server-hosted templates, idempotency keys, scheduled sending, and useful error responses
		possible. SMTP remains the right transport for legacy systems that only expose an SMTP
		settings screen; the <a href="/blog/smtp-vs-rest-api-how-to-choose/">SMTP vs. REST API
		guide</a> covers the decision in detail.
	</Paragraph>

	<Heading level={2}>Email API vs. mailbox APIs (Gmail API, Microsoft Graph)</Heading>

	<Paragraph>
		A search for "email API" also surfaces the Gmail API and Microsoft Graph, and the naming
		hides a category difference. Those are <strong>mailbox APIs: programmatic access to one
		person's mailbox</strong>, authorized per user over OAuth. Google's own description is
		access to Gmail mailboxes for use cases like mail extraction, backup, and organization.
		Sending exists, but it sends as that user, from that mailbox, under that mailbox's limits.
	</Paragraph>

	<Paragraph>
		The limits are the clearest evidence of intended scale. A Google Workspace account allows
		<strong>2,000 messages a day</strong>, the Gmail API caps a message at 500 recipients and its
		quota arithmetic works out to roughly 60 sends a minute per user, and Exchange Online (which
		Microsoft Graph sends through) enforces 30 messages a minute and 10,000 recipients a day.
		Beyond volume, a mailbox API has no bounce webhooks, no suppression list, and no way to
		isolate the sending reputation from the rest of the mailbox. Mailbox APIs are the right tool
		for building an email client or automating a personal inbox; <strong>application email
		belongs on a transactional email API</strong>.
	</Paragraph>

	<Heading level={2}>What "SMTP API" means</Heading>

	<Paragraph>
		The term shows up with two meanings. In most current usage, a provider's "SMTP API" is simply
		its <strong>authenticated SMTP relay offered alongside the HTTP API</strong>, the same sending
		account reached over a different protocol. The second meaning is historical and literal:
		SendGrid's <code>X-SMTPAPI</code> header, a JSON object carried in an SMTP message's
		headers to express per-recipient substitutions, scheduling, and category tags over a protocol
		that has no fields for them. It still works and remains documented, but it is a workaround
		for SMTP's limits; the modern equivalent of everything it does is a JSON body on the HTTP
		endpoint.
	</Paragraph>

	<Heading level={2}>How to choose an email API</Heading>

	<Paragraph>
		Sending is the commodity; the operational surface around it is the product. Six criteria
		separate the providers in practice:
	</Paragraph>

	<List>
		<li>
			<strong>Webhooks.</strong> Which events exist, and how failed deliveries retry. The event
			set is where analytics and suppression logic hang; a provider without a complaint event,
			for example, leaves spam reports invisible.
		</li>
		<li>
			<strong>Idempotency.</strong> A network timeout on a send leaves the outcome unknown, and a
			naive retry can email a customer twice. An idempotency key makes the retry safe (Resend,
			for instance, honors an <code>Idempotency-Key</code> header for 24 hours).
		</li>
		<li>
			<strong>Template hosting and language.</strong> Server-side templates mean copy changes
			without a deploy. The language's power varies widely, from bare variable substitution to
			conditionals, loops, and reusable snippets; SendGrid uses a subset of Handlebars, Lettr
			ships a full template language behind a visual editor.
		</li>
		<li>
			<strong>Analytics granularity and retention.</strong> Per-email event history versus
			aggregate counters, and for how long: Postmark keeps message activity 45 days by default,
			MailerSend's free tier keeps 24 hours, Lettr stores per-email statistics as a core feature.
			Retention limits how far back a delivery dispute can be investigated.
		</li>
		<li>
			<strong>Sandbox and onboarding friction.</strong> Amazon SES starts every account in a
			sandbox limited to 200 messages a day until production access is approved; other providers
			apply manual account review. Worth knowing before a launch deadline.
		</li>
		<li>
			<strong>Suppression handling and data residency.</strong> How bounces and complaints are
			suppressed and whether suppressions can be audited (Postmark, notably, never deletes a
			spam-complaint suppression), plus EU hosting where residency is a requirement (Mailgun
			runs a separate EU region).
		</li>
	</List>

	<Paragraph>
		A useful tiebreaker is whether the provider offers <strong>both the API and an SMTP
		relay on the same account</strong>, so a legacy CRM and a new serverless function share one
		suppression list and one set of analytics.
	</Paragraph>

	<Heading level={2}>Free email API tiers in 2026</Heading>

	<Paragraph>
		Most providers keep a free tier large enough to develop against and run a small product on.
		The figures below were checked in July 2026 and <strong>this is the most volatile corner of
		the market</strong>: SendGrid retired its free plan entirely in 2025, and MailerSend cut its
		from 3,000 emails to 500 the same year.
	</Paragraph>

	<table>
		<thead>
			<tr>
				<th>Provider</th>
				<th>Free tier</th>
				<th>Limits</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Lettr</td>
				<td>3,000 emails/month</td>
				<td>No expiry</td>
			</tr>
			<tr>
				<td>Resend</td>
				<td>3,000 emails/month</td>
				<td>100/day cap, 1 domain</td>
			</tr>
			<tr>
				<td>Brevo</td>
				<td>300 emails/day</td>
				<td>Brevo branding on emails</td>
			</tr>
			<tr>
				<td>Amazon SES</td>
				<td>3,000 messages/month</td>
				<td>First 12 months only, then $0.10/1,000</td>
			</tr>
			<tr>
				<td>SMTP2GO</td>
				<td>1,000 emails/month</td>
				<td>200/day, 5-day reporting</td>
			</tr>
			<tr>
				<td>MailerSend</td>
				<td>500 emails/month</td>
				<td>100/day, 24-hour activity retention</td>
			</tr>
			<tr>
				<td>SendGrid</td>
				<td>None</td>
				<td>60-day trial, 100/day</td>
			</tr>
		</tbody>
	</table>

	<Paragraph>
		The <a href="/blog/best-transactional-email-services/">full provider comparison</a> covers
		paid pricing and the tradeoffs behind these numbers, and the
		<a href="/free-email-api/">free email API page</a> details what Lettr's tier includes.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="What does an email API do?">
			<strong>It lets an application send email over HTTP instead of running a mail
			server.</strong> The application POSTs a JSON message to the provider, receives an ID
			immediately, and the provider handles DKIM signing, delivery, retries, and bounce
			processing, reporting each outcome back through webhooks.
		</FaqItem>

		<FaqItem question="Is the Gmail API an email API?">
			<strong>Technically yes, but it is a mailbox API, not a sending platform.</strong> It
			automates one person's Gmail mailbox over OAuth and inherits that mailbox's limits (2,000
			messages a day on Workspace, roughly 60 sends a minute). It has no bounce webhooks or
			suppression lists, so it is the wrong architecture for application email.
		</FaqItem>

		<FaqItem question="What is an SMTP API?">
			<strong>Usually it means a provider's authenticated SMTP relay offered alongside its HTTP
			API.</strong> The term also refers to SendGrid's X-SMTPAPI header, a JSON object embedded
			in a message's SMTP headers to carry substitutions and settings that the SMTP protocol has
			no fields for.
		</FaqItem>

		<FaqItem question="Is there a free email API?">
			<strong>Yes. Lettr and Resend each offer 3,000 emails a month free, Brevo 300 a day, and
			SMTP2GO 1,000 a month.</strong> Amazon SES gives 3,000 messages a month for the first 12
			months only. Free tiers change often (SendGrid removed its plan in 2025), so verify on the
			pricing page before building.
		</FaqItem>

		<FaqItem question="Is an email API better than SMTP?">
			<strong>For new application code, usually yes; for legacy systems, SMTP is the point.</strong>
			Both reach the same delivery infrastructure. The API adds hosted templates, structured
			errors, idempotent retries, and scheduling; SMTP works with anything that has an SMTP
			settings screen and needs no code changes.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		An email API is a JSON endpoint in front of managed sending infrastructure: one POST to send,
		an ID back, and webhooks for the truth about delivery. Evaluate providers on the operational
		layer (webhooks, idempotency, templates, retention, suppressions) rather than the send call,
		and rule out mailbox APIs for anything an application sends at scale.
	</Paragraph>

	<Paragraph>
		The fastest way to evaluate any of this is a real request.
		<a href="https://app.lettr.com/register">Create a free Lettr account</a> (3,000 emails a
		month included), copy the curl example above with a real API key, and the first message with
		full per-email analytics takes about two minutes.
	</Paragraph>
</BlogPost>
