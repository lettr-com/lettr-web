<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		Callout,
		Code
	} from '$lib/components/blog';

	const restTemplateExample = `POST /emails
{
  "to": "user@example.com",
  "template_id": "order-confirmation",
  "merge_data": {
    "name": "Alex",
    "order_id": "ORD-4821",
    "items": [
      { "name": "Widget Pro", "qty": 2, "price": "$24.00" }
    ]
  }
}`;

	const smtpPythonExample = `import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

msg = MIMEMultipart("alternative")
msg["From"] = "orders@yourapp.com"
msg["To"] = "user@example.com"
msg["Subject"] = "Your order ORD-4821"

# You built this HTML yourself, in your app code
html = render_template("order-confirmation.html", name="Alex", order_id="ORD-4821")
msg.attach(MIMEText(html, "html"))

with smtplib.SMTP("smtp.provider.com", 587) as server:
    server.starttls()
    server.login("apikey", "your-api-key")
    server.send_message(msg)`;

	const restErrorExample = `{
  "status": 422,
  "error": "invalid_recipient",
  "message": "The address user@invalid-domain.test could not be validated. Check the domain exists and has MX records."
}`;

	const smtpErrorExample = `550 5.1.1 The email account that you tried to reach does not exist.`;
</script>

<BlogPost
	category="Engineering"
	title="SMTP vs. REST API: how to choose and when to switch"
	excerpt="How SMTP and REST API email transports differ in practice (statefulness, serverless fit, templates, idempotency, error handling), when each is the right choice, and a step-by-step plan for migrating from SMTP to a REST API."
	metaDescription="How SMTP and REST API email transports differ in practice, when each is the right choice, and a step-by-step plan for migrating from SMTP to an API."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="March 18, 2026"
	datetime="2026-03-18"
	readTime="8 min read"
	slug="smtp-vs-rest-api-how-to-choose"
>
	<Lead>
		SMTP and a REST API are the two ways an application hands an email to a sending service. They
		differ in one fundamental way, and <strong>that difference decides which one fits modern
		infrastructure</strong>.
	</Lead>

	<Paragraph>
		The difference is how each one holds a connection, so that's the place to start.
	</Paragraph>

	<Paragraph>
		<strong>SMTP</strong> is a <strong>stateful, connection-oriented protocol</strong>. The application opens a TCP connection to the
		mail server, performs a multi-step handshake (<code>EHLO</code>, <code>MAIL FROM</code>,
		<code>RCPT TO</code>, <code>DATA</code>), transmits the message, and then either keeps the
		connection open for the next message or closes it. Reusing the connection reduces overhead across a
		batch, but a single email from a short-lived process pays the full cost of that handshake every
		time.
	</Paragraph>

	<Paragraph>
		A <strong>REST API</strong> call is <strong>stateless</strong>. The application sends an HTTP POST request with a JSON body, receives
		a response, and that's the entire interaction. There's no connection to manage and no session state
		to clean up.
	</Paragraph>

	<Heading level={2}>Why the difference matters in modern infrastructure</Heading>

	<Paragraph>
		In serverless environments like Lambda or Cloud Functions, functions spin up on demand and are
		frozen or killed when idle. An SMTP connection established in one invocation is usually dead by
		the next, leaving two options: reconnect on every send (slow) or write connection pooling logic
		that fights the execution model (fragile). <strong>A stateless HTTP request avoids the problem entirely</strong>
		because there's nothing to keep alive between invocations.
	</Paragraph>

	<Paragraph>
		Kubernetes and ECS face the same issue at different scales. Containers scale up and down, and an
		SMTP connection tied to a specific container becomes stale when that container is replaced.
		<strong>REST calls go through a load balancer and don't care which container they hit</strong>.
	</Paragraph>

	<Callout variant="tip" title="The one case where SMTP connection reuse pays off">
		A long-lived process on a traditional server is the one case where reusing SMTP connections can
		pay off, especially for high-volume sending. But once any part of your architecture is temporary,
		the connection overhead starts working against you.
	</Callout>

	<Paragraph>
		Some platforms, including <a href="https://lettr.com">Lettr</a>, <strong>support both protocols</strong>, which
		allows REST from a Node.js Lambda function and SMTP from a legacy CRM that can't be modified, with
		both flows feeding the same analytics and suppression list.
	</Paragraph>

	<Heading level={2}>What the API gives you that SMTP can't</Heading>

	<Paragraph>
		SMTP's job is to deliver a complete email message from one server to another. <strong>The protocol
		doesn't understand templates, metadata, scheduling, or structured errors</strong>, so anything beyond
		"here's a message, deliver it" becomes your problem to solve in application code.
	</Paragraph>

	<Paragraph>
		A REST API accepts structured data, which enables two features that materially change the
		integration: <strong>server-side templates</strong> and <strong>idempotency</strong>.
	</Paragraph>

	<Heading level={3}>1. Server-side templates</Heading>

	<Paragraph>
		The request carries a template ID and a set of merge variables instead of the full HTML, and the
		email service renders the final message. <strong>The application code never touches the email
		layout</strong>, and non-developers can edit templates without a code deploy.
	</Paragraph>

	<Code lang="javascript" code={restTemplateExample} />

	<Paragraph>
		The <strong>SMTP equivalent</strong> builds the HTML in application code before handing it to an SMTP library:
	</Paragraph>

	<Code lang="text" code={smtpPythonExample} />

	<Paragraph>
		Both approaches work. <strong>The REST version keeps email content on the email platform rather than
		tying it to your deployment cycle</strong>, so a copy change doesn't require a code change.
	</Paragraph>

	<Heading level={3}>2. Idempotency</Heading>

	<Paragraph>
		A timed-out network call leaves the outcome unknown: the server may or may not have processed the
		request. <strong>With an idempotency key, retrying is safe</strong>: the server recognizes the key
		from the first attempt and returns the original result instead of reprocessing. SMTP has no
		equivalent. A connection that drops after <code>DATA</code> but before the <code>250 OK</code>
		leaves the message in the same ambiguous state, and a naive retry can deliver it twice.
	</Paragraph>

	<Paragraph>
		For password resets, order confirmations, and other transactional flows where duplicates are
		visible to the user, <strong>that ambiguity matters</strong>. The API solution requires a single
		additional request header.
	</Paragraph>

	<Heading level={3}>Other features worth knowing about</Heading>

	<Paragraph>Two smaller things the API provides that are awkward or impossible over SMTP:</Paragraph>

	<List>
		<li>
			<strong>Structured metadata.</strong> Attach fields like <code>user_id</code>,
			<code>campaign_name</code>, or <code>environment</code> to a send, and they flow through to
			webhooks and analytics. The SMTP equivalent is custom <code>X-</code> headers that the provider
			may or may not parse.
		</li>
		<li>
			<strong>Scheduled sending.</strong> A <code>send_at</code> timestamp tells the platform to queue
			the message until the requested time. No cron job required.
		</li>
	</List>

	<Heading level={2}>Error handling</Heading>

	<Paragraph>
		How a transport reports failure decides how much error-handling code it needs, and this
		is where the two diverge most sharply. <strong>A failed API call returns a JSON response with a status
		code, an error type, and a readable message</strong>:
	</Paragraph>

	<Code lang="javascript" code={restErrorExample} />

	<Paragraph>
		Switch on the error type and route it to an alert channel. Same pattern as any other API in your
		codebase.
	</Paragraph>

	<Paragraph><strong>SMTP errors</strong> look like this:</Paragraph>

	<Code lang="text" code={smtpErrorExample} />

	<Paragraph>
		The first digit indicates the category (5xx is permanent, 4xx is temporary). The enhanced status
		code (<code>5.1.1</code>) carries additional detail, defined in the
		<a href="https://datatracker.ietf.org/doc/html/rfc3463">RFC 3463</a> table. The text that follows
		is freeform and varies by provider.
	</Paragraph>

	<Paragraph>
		Handling SMTP errors properly means parsing these text responses, mapping provider-specific
		messages to your own error categories, and handling the worst case: the connection drops
		mid-handshake with no response, leaving it unknown whether the server accepted the message. <strong>With a
		REST API, the result is unambiguous</strong>: either a <code>2xx</code> with a message ID, or a failure.
	</Paragraph>

	<Heading level={2}>When SMTP is the right choice</Heading>

	<Paragraph>
		SMTP isn't always wrong. Many teams are right to stick with it, and the most common reason is
		that <strong>they don't actually own the sending code</strong>.
	</Paragraph>

	<Paragraph>
		WordPress plugins, legacy CRMs, ERP systems, and network appliances that send alert emails
		typically expose only an SMTP configuration screen. <strong>When the sending code can't be changed,
		an SMTP relay is the only option</strong>. Lettr's relay (<code>smtp.lettr.com</code>) handles this case:
		set the host, port (465 recommended), and an API key as the password. The existing system then
		sends through Lettr without any code changes.
	</Paragraph>

	<Paragraph>
		The other reason to stay on SMTP is that <strong>migration risk doesn't always justify the cost</strong>. A tool
		that's already configured, sending low volumes, and working well is rarely worth the cost of
		building a custom integration. The same goes for monitoring: if your alerting is built around
		SMTP logs, connection metrics, or mail queue depth, switching to a REST API means rebuilding that
		observability layer.
	</Paragraph>

	<Paragraph>
		<strong>For anything new, the API is almost always the better starting point</strong>. When your stack spans both
		worlds, such as a WordPress site alongside a custom Node.js service, choosing a provider that
		supports both protocols keeps the analytics and suppression list unified.
	</Paragraph>

	<Heading level={2}>Making the decision</Heading>

	<Paragraph>
		<strong>New code should use the API; existing SMTP integrations that work should be left alone
		until a change forces the move</strong>. The forcing changes are connection problems in a
		serverless or container environment and the cost of maintaining templates in application code.
		When one hits, migrate one email type at a time and verify delivery before the next.
	</Paragraph>

	<Paragraph>
		<strong>The fundamentals of deliverability are independent of all of this.</strong>
		<a href="https://docs.lettr.com/learn/domains/sending-domains">Proper domain authentication</a>,
		bounce handling, and engagement monitoring are required whether you're using SMTP or REST. The protocol
		decision is about how your code communicates with the email service; what happens after the
		message leaves your application is the same in both cases.
	</Paragraph>

	<Paragraph>
		If you want both transports available from a single provider — a
		<a href="/smtp-relay/">drop-in SMTP relay</a> and a <a href="/email-api/">REST email API</a> —
		<a href="https://app.lettr.com/register">create a free Lettr account</a> and select the right one
		for each part of your stack.
	</Paragraph>
</BlogPost>
