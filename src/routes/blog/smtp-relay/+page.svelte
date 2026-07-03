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

	const relayEnvExample = `SMTP_HOST=smtp.lettr.com
SMTP_PORT=465            # implicit TLS (587 STARTTLS; 2465/2587 alt)
SMTP_USERNAME=lettr      # always the literal word "lettr"
SMTP_PASSWORD=lttr_your_api_key_here   # your Lettr API key`;

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

	const authFailureExample = `535 5.7.8 Authentication credentials invalid`;
</script>

<BlogPost
	category="Engineering"
	title="SMTP relay: what it is and how to set one up"
	excerpt="What an SMTP relay is, how it differs from a mailbox SMTP server, how relay authentication and the TLS ports (465, 587, 2525) work, a step-by-step setup you can copy, and how a relay compares to IMAP and to a REST email API."
	metaDescription="What an SMTP relay is, how relay authentication and the TLS ports work, a copy-paste setup, and how a relay compares to IMAP and a REST email API."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="July 3, 2026"
	datetime="2026-07-03"
	readTime="9 min read"
	slug="smtp-relay"
>
	<Lead>
		An SMTP relay is a mail server that accepts a message from your application and forwards it on to
		the recipient's mail server on your behalf. It authenticates the sender, applies the sending
		domain's reputation and authentication records, and hands the message to the destination over the
		public internet. That relaying step is what separates sending mail at scale from running your own
		mail server, and it is the piece a transactional email provider replaces.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>A relay forwards outbound mail; a mailbox server stores incoming mail.</strong> The
				relay's whole job is to accept an authenticated message and deliver it onward, which is why it
				pairs with IMAP rather than competing with it.
			</li>
			<li>
				<strong>Authentication plus TLS is the entire setup.</strong> A username, an API key or
				password, a host, and an encrypted port (465 or 587) are all a relay needs to accept mail from
				your code.
			</li>
			<li>
				<strong>A managed relay is a drop-in for code you can't change.</strong> Any system with an SMTP
				configuration screen, a legacy CRM, a WordPress plugin, a network appliance, points at the relay
				host and sends without a code change.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What an SMTP relay actually does</Heading>

	<Paragraph>
		SMTP (Simple Mail Transfer Protocol) is the protocol mail servers use to pass messages between
		each other. <strong>A relay is a server that speaks SMTP on both sides</strong>: it accepts a
		message from an authenticated sender, then opens its own SMTP connection to the recipient's mail
		server and delivers the message there. The application never talks to the recipient's server
		directly.
	</Paragraph>

	<Paragraph>
		The reason to route mail through a relay instead of connecting to each recipient server directly
		is reputation and reach. <strong>Inbox providers judge mail by the IP and domain it came
		from</strong>, and a relay run by a sending provider maintains warmed IPs, published authentication
		records, and feedback loops with the major mailbox providers. A message sent from a random server
		IP with no sending history usually lands in spam or is refused outright.
	</Paragraph>

	<Callout variant="tip" title="Relay vs. gateway">
		The terms <strong>SMTP relay</strong> and <strong>SMTP gateway</strong> are often used
		interchangeably. When a distinction is drawn, a gateway sits at the boundary of a network and
		filters or routes mail in both directions, while a relay specifically forwards outbound mail to
		its destination. For sending application mail, the service is a relay.
	</Callout>

	<Heading level={2}>Relay vs. a mailbox SMTP server</Heading>

	<Paragraph>
		A single machine can run SMTP for two different purposes, and the confusion between them is
		common. <strong>A mailbox server receives mail addressed to its own users and stores it</strong>;
		a relay accepts mail from authenticated senders and forwards it elsewhere. The provider you use to
		read your inbox runs the first kind. The service that sends your app's password resets runs the
		second.
	</Paragraph>

	<Paragraph>
		This is also why a relay does not replace <strong>IMAP</strong>. IMAP is the protocol a mail
		client uses to read and manage messages already sitting in a mailbox, so it handles the receiving
		and storage side. SMTP handles sending. A full email account uses both: SMTP (through a relay) to
		send, IMAP to read. They cover opposite halves of the same round trip.
	</Paragraph>

	<Heading level={2}>How relay authentication works</Heading>

	<Paragraph>
		An open relay that forwards mail from anyone is a spam engine, so <strong>every usable relay
		requires the sender to authenticate</strong>. The standard mechanism is SMTP AUTH: after opening
		the connection, the client presents a username and a secret, and the relay refuses the
		<code>MAIL FROM</code> command until they check out.
	</Paragraph>

	<Paragraph>
		For a managed provider the secret is <strong>an API key rather than a mailbox password</strong>.
		Lettr's relay uses the literal word <code>lettr</code> as the username and a Lettr API key
		(prefixed <code>lttr_</code>) as the password. An API key can be scoped and revoked without
		touching the rest of the account, which a shared mailbox password cannot.
	</Paragraph>

	<Paragraph>
		When authentication fails, the relay returns a <code>535</code> reply and rejects the message
		before it is ever queued:
	</Paragraph>

	<Code lang="text" code={authFailureExample} />

	<Paragraph>
		The <code>5.7.8</code> enhanced status code specifically means the credentials were rejected,
		distinct from a <code>530</code> that means no authentication was attempted at all.
		<strong>A bad API key or the wrong username is the first thing to check</strong> when a previously
		working relay starts refusing mail.
	</Paragraph>

	<Heading level={2}>The ports and TLS</Heading>

	<Paragraph>
		A relay listens on a small set of ports, and the choice between them is about how TLS encryption
		starts, not about the mail itself. <strong>Two ports carry almost all modern relay
		traffic</strong>:
	</Paragraph>

	<List>
		<li>
			<strong>Port 465 (implicit TLS).</strong> The connection is encrypted from the first byte. This
			is the recommended default because there is no unencrypted phase to misconfigure.
		</li>
		<li>
			<strong>Port 587 (STARTTLS).</strong> The connection opens in plaintext, then the client issues a
			<code>STARTTLS</code> command to upgrade to an encrypted channel before authenticating. It works
			everywhere but depends on the client actually requesting the upgrade.
		</li>
	</List>

	<Paragraph>
		Port <strong>25</strong> is the original SMTP port and still carries server-to-server delivery, but
		most networks and cloud providers block outbound 25 to limit spam, so it is not used for
		application relay. When a firewall also blocks 465 and 587, providers often expose alternates such
		as <strong>2465 and 2587</strong> (Lettr) or <strong>2525</strong> (a common industry fallback)
		that behave identically on a non-standard number.
	</Paragraph>

	<Callout variant="warning" title="SSL vs. TLS naming">
		Documentation frequently labels port 465 the <strong>SSL port</strong> and port 587 the
		<strong>TLS port</strong>. The names are historical. Both ports use modern TLS today; SSL is the
		deprecated predecessor. Read "SSL port" as "the implicit-TLS port" and configure it the same way.
	</Callout>

	<Heading level={2}>Setting up a relay, step by step</Heading>

	<Paragraph>
		A relay needs four values: the host, the port, the username, and the secret. <strong>Everything
		below is the complete configuration</strong> for the Lettr relay, and the shape is identical for
		any provider, only the values change.
	</Paragraph>

	<Heading level={3}>1. Get the four connection values</Heading>

	<Paragraph>
		Create a free account, verify a sending domain so the relay can apply its authentication records,
		and generate an API key. The four values then read as follows:
	</Paragraph>

	<Code lang="text" code={relayEnvExample} />

	<Heading level={3}>2. Point your application at the relay</Heading>

	<Paragraph>
		Any SMTP-capable code path uses the same four values. In an application that sends through a
		library, they go into the transport config. <strong>Nodemailer with implicit TLS on 465 looks
		like this</strong>:
	</Paragraph>

	<Code lang="javascript" code={nodemailerExample} />

	<Paragraph>
		For an off-the-shelf system without a code path, the same values go into its SMTP settings screen.
		<strong>A WordPress plugin, a CRM, or a network appliance needs only the host, port, username, and
		API key</strong>, entered once, and it sends through the relay from then on. This is the case a
		relay exists for, since the sending code cannot be modified.
	</Paragraph>

	<Heading level={3}>3. Send a test and read the reply</Heading>

	<Paragraph>
		A successful relay accepts the message with a <code>250</code> reply and a queued message ID. Any
		other reply is worth reading in full before sending real traffic. <strong>A
		<code>535</code> means the credentials are wrong, a <code>5xx</code> on the recipient address means
		the address was rejected, and a timeout usually means the chosen port is blocked</strong> and
		another (587 or an alternate) should be tried.
	</Paragraph>

	<Callout variant="info" title="Where deliverability comes from">
		<TldrList>
			<li>
				<strong>The relay applies authentication; the domain owner still publishes it.</strong> SPF,
				DKIM, and DMARC records live in the sending domain's DNS, and a relay can only sign for a domain
				it has been authorized on.
			</li>
			<li>
				<strong>Reputation is per-domain and per-IP.</strong> A new domain sending through a shared
				warmed relay still builds its own reputation, so a sudden volume spike from a cold domain can
				land in spam regardless of the relay.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>When a relay is the right tool</Heading>

	<Paragraph>
		A relay is the correct choice whenever the sending code speaks SMTP and cannot be rewritten.
		<strong>Legacy CRMs, ERP systems, WordPress and other CMS plugins, and appliances that email
		alerts</strong> typically expose an SMTP configuration screen and nothing else. Pointing that
		screen at a managed relay upgrades the deliverability of the whole system without a single line of
		new code.
	</Paragraph>

	<Paragraph>
		For new application code, the tradeoff is different. A relay moves a message but does not
		understand it, so server-side templates, idempotency keys, structured metadata, and scheduled
		sending are not part of the protocol. <strong>A REST email API exposes those features because it
		accepts structured data</strong> rather than a finished message. The
		<a href="/blog/smtp-vs-rest-api-how-to-choose/">full SMTP vs. REST API comparison</a> covers when
		to pick each and how to migrate.
	</Paragraph>

	<Paragraph>
		Choosing a provider that offers both keeps a mixed stack unified. A serverless function sends over
		the API while a legacy plugin sends over the relay, and <strong>both flows feed the same analytics
		and suppression list</strong> instead of splitting the sending history in two.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="What is the difference between an SMTP relay and an SMTP server?">
			<strong>A relay forwards outbound mail to its destination; a mailbox SMTP server receives mail
			for its own users and stores it.</strong> Both speak SMTP, but a relay's job is to accept an
			authenticated message and deliver it onward, while a mailbox server is the endpoint that mail is
			delivered to. Sending application mail uses a relay.
		</FaqItem>

		<FaqItem question="Which port should an SMTP relay use, 465 or 587?">
			<strong>Prefer 465, which encrypts the connection with implicit TLS from the first byte.</strong>
			Port 587 uses STARTTLS, which opens in plaintext and upgrades to TLS on request, and it works
			everywhere but depends on the client issuing the upgrade. When a firewall blocks both, providers
			expose alternates such as 2465, 2587, or 2525. Port 25 is blocked on most networks and is not used
			for application relay.
		</FaqItem>

		<FaqItem question="Is port 465 the SSL port or the TLS port?">
			<strong>Port 465 is commonly called the SSL port, but it uses modern TLS today.</strong> The SSL
			label is historical from when the protocol was named SSL rather than TLS. Configure 465 as the
			implicit-TLS port, meaning the connection is encrypted immediately without a STARTTLS step.
		</FaqItem>

		<FaqItem question="How does SMTP relay authentication work?">
			<strong>The client presents a username and a secret over SMTP AUTH, and the relay refuses to
			accept mail until they are validated.</strong> For a managed provider the secret is an API key
			rather than a mailbox password, so it can be scoped and revoked independently. Rejected credentials
			return a 535 reply and the message is never queued.
		</FaqItem>

		<FaqItem question="What is the difference between SMTP and IMAP?">
			<strong>SMTP sends mail; IMAP reads mail already stored in a mailbox.</strong> A relay handles the
			SMTP side, forwarding outbound messages, while IMAP is the protocol a mail client uses to fetch and
			manage received messages. They cover opposite halves of an email account and are used together, not
			as alternatives.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		<strong>A relay is the right choice for any SMTP-speaking system you can point at a host but
		can't rewrite.</strong> Setup is four values, a host, a port, a username, and an API key, over an
		encrypted port, and the deliverability comes from the provider's warmed IPs and the sending
		domain's own authentication records. For new code that can send structured requests, a REST API
		adds templates, idempotency, and scheduling that the relay protocol cannot.
	</Paragraph>

	<Paragraph>
		For both transports from a single provider (a <a href="/smtp-relay/">drop-in SMTP relay</a> and a
		<a href="/email-api/">REST email API</a>),
		<a href="https://app.lettr.com/register">create a free Lettr account</a> and point each part of
		your stack at the one that fits.
	</Paragraph>
</BlogPost>
