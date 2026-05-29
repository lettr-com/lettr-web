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
	excerpt="Most developers reach for the email transport they've used before — until they're debugging a recycled SMTP connection in a serverless function at 2 AM. Here's how to pick the right one and switch if you picked wrong."
	author={{ name: 'Erik Vlčák', role: 'Customer Success', avatar: '/images/authors/erik.jpg' }}
	date="March 18, 2026"
	datetime="2026-03-18"
	readTime="8 min read"
	slug="smtp-vs-rest-api-how-to-choose"
>
	<Lead>
		When you add email to a new service, you have two transport options: connect to an SMTP relay or
		call a REST API. Most developers reach for what they've used before, and that works fine until
		you're troubleshooting a timeout in a serverless function at 2 AM because your SMTP connection
		was recycled mid-handshake.
	</Lead>

	<Paragraph>
		The two protocols have different shapes, and one of them fits modern infrastructure better. This
		article covers how to pick the right one and how to switch if you've already picked the wrong
		one.
	</Paragraph>

	<Heading level={2}>How the two protocols actually work</Heading>

	<Paragraph>
		SMTP is a stateful, connection-oriented protocol. Your application opens a TCP connection to the
		mail server, performs a multi-step handshake (<code>EHLO</code>, <code>MAIL FROM</code>,
		<code>RCPT TO</code>, <code>DATA</code>), transmits the message, and then either keeps the
		connection open for the next message or closes it. If you're sending a batch, reusing the
		connection reduces overhead. If you're sending a single email from a short-lived process, you pay
		the full cost of that handshake every time.
	</Paragraph>

	<Paragraph>
		A REST API call is stateless. You send an HTTP POST request with a JSON body, receive a response,
		and that's the entire interaction. There's no connection to manage and no session state to clean
		up.
	</Paragraph>

	<Paragraph>The stateful-versus-stateless split drives most of the other differences below.</Paragraph>

	<Heading level={2}>Why the difference matters in modern infrastructure</Heading>

	<Paragraph>
		In serverless environments like Lambda or Cloud Functions, functions spin up on demand and are
		frozen or killed when idle. An SMTP connection established in one invocation is usually dead by
		the next, so you either reconnect on every send (slow) or write connection pooling logic that
		fights the execution model (fragile). A stateless HTTP request avoids the problem entirely
		because there's nothing to keep alive between invocations.
	</Paragraph>

	<Paragraph>
		Kubernetes and ECS face the same issue at different scales. Containers scale up and down, and an
		SMTP connection tied to a specific container becomes stale when that container is replaced. REST
		calls go through a load balancer and don't care which container they hit.
	</Paragraph>

	<Callout variant="tip" title="The one case where SMTP connection reuse pays off">
		A long-lived process on a traditional server is the one case where reusing SMTP connections can
		pay off, especially for high-volume sending. But once any part of your architecture is temporary,
		the connection overhead starts working against you.
	</Callout>

	<Paragraph>
		Some platforms, including <a href="https://lettr.com">Lettr</a>, support both protocols, so you
		can use REST from your Node.js Lambda functions and SMTP from a legacy CRM that can't be modified,
		with both flows feeding the same analytics and suppression list.
	</Paragraph>

	<Heading level={2}>What the API gives you that SMTP can't</Heading>

	<Paragraph>
		SMTP's job is to deliver a complete email message from one server to another. The protocol
		doesn't understand templates, metadata, scheduling, or structured errors, so anything beyond
		"here's a message, deliver it" becomes your problem to solve in application code.
	</Paragraph>

	<Paragraph>
		A REST API accepts structured data, which enables two features that materially change the
		integration: server-side templates and idempotency.
	</Paragraph>

	<Heading level={3}>Server-side templates</Heading>

	<Paragraph>
		Instead of building the full HTML on your end, you send a template ID and a set of merge
		variables. The email service renders the final message. Your application code never touches the
		email layout, and non-developers can edit templates without a code deploy.
	</Paragraph>

	<Code lang="javascript" code={restTemplateExample} />

	<Paragraph>
		Compare that to building the HTML yourself before passing it to an SMTP library:
	</Paragraph>

	<Code lang="text" code={smtpPythonExample} />

	<Paragraph>
		Both approaches work. The REST version keeps email content on the email platform rather than
		tying it to your deployment cycle, so a copy change doesn't require a code change. With Lettr's
		<a href="https://docs.lettr.com/learn/templates/introduction">template system</a>, your marketing
		team can edit content directly without involving the engineers.
	</Paragraph>

	<Heading level={3}>Idempotency</Heading>

	<Paragraph>
		If a network call times out, you don't know whether the server processed the request. With an
		idempotency key, retrying is safe: the server recognizes the key from the first attempt and
		returns the original result instead of reprocessing. SMTP has no equivalent. If your connection
		drops after <code>DATA</code> but before you receive the <code>250 OK</code>, the message may or
		may not have been accepted, and a naive retry can result in the recipient receiving the same
		email twice.
	</Paragraph>

	<Paragraph>
		For password resets, order confirmations, and other transactional flows where duplicates are
		visible to the user, that ambiguity matters. The API solution requires a single additional
		request header.
	</Paragraph>

	<Heading level={3}>Other features worth knowing about</Heading>

	<Paragraph>A few smaller things the API provides for free:</Paragraph>

	<List>
		<li>
			<strong>Batch sending with personalization.</strong> One request, many recipients, each with
			their own merge data. SMTP supports multiple recipients on a single connection, but they all
			receive the same body.
		</li>
		<li>
			<strong>Structured metadata.</strong> You can attach fields like <code>user_id</code>,
			<code>campaign_name</code>, or <code>environment</code> to a send, and they flow through to
			webhooks and analytics. Over SMTP, you'd cram the same data into custom <code>X-</code> headers
			and hope the provider parses them. Lettr surfaces metadata in
			<a href="https://docs.lettr.com/learn/webhooks/introduction">webhook events</a> and the
			analytics dashboard.
		</li>
		<li>
			<strong>Scheduled sending.</strong> A <code>send_at</code> timestamp tells the platform to queue
			the message until the requested time. No cron job required.
		</li>
		<li>
			<strong>Message IDs available immediately.</strong> A successful API response includes a unique
			ID you can use to track delivery events. SMTP returns a queue acknowledgment, and the ID is embedded
			in the message's headers.
		</li>
	</List>

	<Heading level={2}>Error handling</Heading>

	<Paragraph>
		When an API call fails, you receive a JSON response that includes a status code, an error type,
		and a readable message:
	</Paragraph>

	<Code lang="javascript" code={restErrorExample} />

	<Paragraph>
		You can switch on the error type, show the user a message, or route it to an alert channel. Same
		pattern as any other API in your codebase.
	</Paragraph>

	<Paragraph>SMTP errors look like this:</Paragraph>

	<Code lang="text" code={smtpErrorExample} />

	<Paragraph>
		The first digit indicates the category (5xx is permanent, 4xx is temporary). The enhanced status
		code (<code>5.1.1</code>) provides additional detail when you look it up in the
		<a href="https://datatracker.ietf.org/doc/html/rfc3463">RFC 3463</a> table. The text that follows
		is freeform and varies by provider. Gmail's error messages look nothing like Microsoft's.
	</Paragraph>

	<Paragraph>
		Handling SMTP errors properly means parsing these text responses, mapping provider-specific
		messages to your own error categories, and handling the worst case: the connection drops
		mid-handshake with no response. Did the server accept the message before the drop? You don't
		know. With a REST API, you either get a <code>2xx</code> and a message ID, or you don't.
	</Paragraph>

	<Heading level={2}>When SMTP is the right choice</Heading>

	<Paragraph>
		SMTP isn't always wrong. Many teams are right to stick with it, and the most common reason is
		that they don't actually own the sending code.
	</Paragraph>

	<Paragraph>
		WordPress plugins, legacy CRMs, ERP systems, and network appliances that send alert emails
		typically expose only an SMTP configuration screen. If you can't change how the system sends, an
		SMTP relay is your only option. Lettr's relay (<code>smtp.lettr.com</code>) handles this case:
		set the host, port (465 recommended), and your API key as the password. The existing system then
		sends through Lettr without any code changes.
	</Paragraph>

	<Paragraph>
		The other reason to stay on SMTP is that migration risk doesn't always justify the cost. A tool
		that's already configured, sending low volumes, and working well is rarely worth the cost of
		building a custom integration. The same goes for monitoring: if your alerting is built around
		SMTP logs, connection metrics, or mail queue depth, switching to a REST API means rebuilding that
		observability layer.
	</Paragraph>

	<Paragraph>
		For anything new, the API is almost always the better starting point. When your stack spans both
		worlds, such as a WordPress site alongside a custom Node.js service, choosing a provider that
		supports both protocols keeps the analytics and suppression list unified.
	</Paragraph>

	<Heading level={2}>Migrating from SMTP to REST API</Heading>

	<Paragraph>If you've decided to switch, don't do it all at once.</Paragraph>

	<Heading level={3}>1. Audit your current SMTP usage</Heading>

	<Paragraph>
		Before making any changes, identify every system that sends email through your SMTP relay. This
		is usually more than you expect. Review application code, infrastructure tools, scheduled jobs,
		and third-party integrations. For each one, record the volume, its criticality, and whether you
		control the sending code.
	</Paragraph>

	<Heading level={3}>2. Start with low-risk messages</Heading>

	<Paragraph>
		Pick an email type that's easy to test and not mission-critical. Internal notifications or
		development environment emails work well. Implement the REST API integration for that one type
		only. Verify your client setup, error handling, and webhook processing before touching
		production.
	</Paragraph>

	<Heading level={3}>3. Run both in parallel</Heading>

	<Paragraph>
		For your first production migration, run both transports side by side for a short period. Use a
		flag or environment variable to control which one delivers to real users, and route the other to
		a logging endpoint. Compare delivery, latency, and error rates between the two. It may feel
		wasteful, but it's the fastest way to catch differences before you cut over.
	</Paragraph>

	<Heading level={3}>4. Move templates to the platform</Heading>

	<Paragraph>
		Removing templates from your application code is one of the bigger payoffs of the migration, but
		it's also the part most likely to surface rendering bugs. Move one template at a time, verify it
		renders correctly across the email clients your users actually use, and build up from there. With
		Lettr's <a href="https://docs.lettr.com/learn/templates/introduction">template API</a>, templates
		live entirely outside your deployment cycle.
	</Paragraph>

	<Heading level={3}>5. Rebuild monitoring around webhooks</Heading>

	<Paragraph>
		Your SMTP-era dashboards likely monitor connection metrics and mail queue depth. None of that
		applies to an API. Switch your alerts to
		<a href="https://docs.lettr.com/learn/webhooks/introduction">webhook events</a> (<code>bounce</code>,
		<code>delivery</code>, <code>complaint</code>) before you rely on the new transport for anything
		important.
	</Paragraph>

	<Heading level={3}>6. Plan your rollback</Heading>

	<Paragraph>
		Keep your SMTP configuration intact and thoroughly tested until you're confident the API
		integration is stable in production. This may mean maintaining both code paths for a few weeks, a
		reasonable cost compared with discovering a bug in the new integration with no fallback path.
	</Paragraph>

	<Heading level={3}>7. Decommission SMTP</Heading>

	<Paragraph>
		Once you've migrated all email types and confirmed stable delivery for a few weeks, remove the
		SMTP code paths and credentials. Don't leave them around "just in case." Stale credentials pose a
		security risk, and dead code paths confuse whoever touches the codebase next.
	</Paragraph>

	<Heading level={2}>Making the decision</Heading>

	<Paragraph>
		The decision usually comes down to one question: are you integrating with an existing system that
		already speaks SMTP, or building something new?
	</Paragraph>

	<Paragraph>
		For new code, use the API. Sending email becomes another API call in your codebase. The features
		that come with it (templates, metadata, idempotency, structured errors) are useful, and the
		request shape aligns with the serverless or containerized infrastructure most new services run
		on.
	</Paragraph>

	<Paragraph>
		For existing SMTP integrations that work, leave them alone until a change is forced. The two
		common triggers are connection problems in a serverless or container environment and the cost of
		maintaining email templates in application code. When the time comes, migrate one email type at a
		time and verify delivery before moving to the next.
	</Paragraph>

	<Paragraph>
		The fundamentals of deliverability are independent of all of this. You still need
		<a href="https://docs.lettr.com/learn/domains/sending-domains">proper domain authentication</a>,
		bounce handling, and engagement monitoring whether you're using SMTP or REST. The protocol
		decision is about how your code communicates with the email service; what happens after the
		message leaves your application is the same in both cases.
	</Paragraph>

	<Paragraph>
		If you want both transports available from a single provider,
		<a href="https://app.lettr.com/register">create a free Lettr account</a> and select the right one
		for each part of your stack.
	</Paragraph>
</BlogPost>
