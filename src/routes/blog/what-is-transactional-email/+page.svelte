<script lang="ts">
	import { BlogPost, Lead, Heading, Paragraph, List, Callout } from '$lib/components/blog';
</script>

<BlogPost
	category="Fundamentals"
	title="How transactional email actually works"
	excerpt="What separates transactional email from marketing email, why inbox providers and regulators treat them differently, and how to keep these messages reliable in production."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="February 4, 2026"
	datetime="2026-02-04"
	readTime="6 min read"
	slug="what-is-transactional-email"
>
	<Lead>
		A transactional email is a message sent to one person in response to something they did: a
		password reset, a login code, an order confirmation. Almost every app and online store sends them,
		and they work differently from the marketing emails a company sends to its whole audience.
	</Lead>

	<Paragraph>
		That difference matters more than it first appears. Inbox providers and regulators <strong>treat the two
		kinds of email by separate rules</strong>, so the same message can reliably reach the inbox or quietly land
		in spam depending on how it's set up.
	</Paragraph>

	<Callout variant="info" title="TL;DR">
		<List>
			<li>
				<strong>Transactional emails</strong> are sent in response to a specific user action, whereas <strong>marketing emails</strong>
				are sent on the sender's schedule. Inbox providers and regulators treat them differently.
			</li>
			<li>
				Mixing promotional content into a receipt <strong>damages deliverability</strong>, and it's a common FTC
				enforcement target.
			</li>
			<li>
				Treat email outages like API outages: authenticate your domain, separate streams, monitor
				latency, and suppress dead addresses.
			</li>
		</List>
	</Callout>

	<Heading level={2}>What is transactional email?</Heading>

	<Paragraph>
		A <strong>transactional email</strong> is sent in <strong>direct response to a user action</strong>: an order confirmation, a login
		code, a password reset, or a dunning notice. There's a <strong>one-to-one link</strong> between the action and the
		message, and the user is usually waiting for it.
	</Paragraph>

	<Paragraph>
		<strong>Marketing emails</strong> work the other way around. The sender selects the audience, timing, and content,
		and pushes the message out <strong>in bulk to all contacts</strong>. No specific user action triggers any specific send.
	</Paragraph>

	<Paragraph>
This distinction matters because Gmail, spam filters, and privacy regulators all depend on it, so the same HTML template can behave very differently depending on its category.
	</Paragraph>

	<Heading level={2}>Why inboxes treat them differently</Heading>

	<Paragraph>
		It comes down to one thing: a <strong>transactional</strong> email is mail the recipient is <strong>actively expecting</strong>. The
		user just asked for the reset or placed the order, so it's wanted by definition. <strong>Marketing</strong> email
		arrives <strong>unrequested</strong> and has to earn its place in the inbox.
	</Paragraph>

	<Paragraph>
		Recipients prove the point by opening transactional email
		<a href="https://www.mailgun.com/blog/email/email-open-rates-decoded/">80–85% of the time</a>,
		against 20–25% for marketing. Inbox
		providers like Gmail <strong>trust mail that people reliably open</strong>, which is part of why a well-run
		transactional stream lands in the inbox so consistently. Regulators follow the same logic: anti-spam
		laws target unwanted bulk mail, so a receipt under CAN-SPAM or a purchase confirmation under GDPR is
		largely exempt from the rules a promotion has to follow.
	</Paragraph>

	<Paragraph>
		That extra trust is exactly what makes transactional email <strong>tempting to abuse</strong>. It reaches the inbox
		more reliably and carries fewer legal strings, so slipping a promotional banner into an order
		confirmation is an easy way to reach people who would ignore a normal campaign. That shortcut is where
		<strong>most deliverability problems start</strong>.
	</Paragraph>

	<Heading level={2}>Mixing them makes you end up in spam</Heading>

	<Paragraph>
	The key point is that the exemption applies only as long as the email is <strong>purely transactional</strong>. If you include enough promotional content, regulators and inbox providers stop viewing it as a transaction. For example, an order confirmation with a 30%-off coupon and three product recommendations is no longer just a receipt; it becomes a marketing email with a receipt attached. This means it must include the unsubscribe link, which a receipt normally does not require.
	</Paragraph>

	<Paragraph>
		Gmail reaches the same conclusion more quickly and without warning. It analyzes the content, engagement, and sender reputation <strong>behind each message</strong>. A transactional template that appears promotional or shares infrastructure with campaigns can seriously <strong>harm your sender score</strong>. Once your domain reputation drops, it can take weeks of consistent, clean sending to recover.
	</Paragraph>

	<Paragraph>
		The fix follows from the cause: <strong>keep each transactional template to a single purpose</strong>. When there's
		something to cross-sell, that's a separate marketing email, with its own opt-in and unsubscribe
		link.
	</Paragraph>

	<Heading level={2}>Setting up the infrastructure</Heading>

	<Paragraph>
		Because the recipient is waiting on it, a transactional email sits on the product's critical path,
		so a delivery failure is closer to an <strong>outage</strong> than a missed message. That's why the setup is
		worth getting right.
	</Paragraph>

	<Paragraph>
		<strong>Domain authentication</strong> is the single biggest lever for deliverability, and it's the area most teams
		get wrong. Three DNS records do the work:
	</Paragraph>

	<List>
		<li>
			<strong>SPF</strong> lists the IPs allowed to send for your domain. It tells receivers, "this server
			is authorized to send as me."
		</li>
		<li>
			<strong>DKIM</strong> signs each message with a private key. The receiver checks the signature against
			a public key in your DNS, proving the message wasn't tampered with in transit.
		</li>
		<li>
			<strong>DMARC</strong> ties SPF and DKIM together and tells receivers what to do when a message fails:
			quarantine, reject, or just report it. DMARC is the one most teams misconfigure: setting
			<code>p=none</code> and forgetting to ratchet it up to <code>quarantine</code> or
			<code>reject</code> leaves the policy effectively off.
		</li>
	</List>

	<Paragraph>With authentication in place, a few more practices keep the stream healthy:</Paragraph>

	<List>
		<li>
			<strong>Separate your sending streams.</strong> Use different IPs, or at least different subdomains, for
			transactional and marketing email, so a spam complaint from a campaign can't drag your password resets
			down with it.
		</li>
		<li>
			<strong>Be selective about tracking.</strong> A tracking redirect on a password-reset link adds latency
			and can trigger phishing warnings, so disable tracking on security-sensitive emails and keep it for
			receipts and notifications where engagement data is useful.
		</li>
		<li>
			<strong>Test in a sandbox first.</strong> Sandbox keys exercise the full send path without spending quota
			or risking reputation, and wiring them into CI catches a regression before it reaches a real inbox.
		</li>
		<li>
			<strong>Manage suppressions and bounces.</strong> Suppress hard bounces and spam complaints permanently
			and retry only soft bounces on a backoff. A suppression list that grows faster than expected usually
			points to a problem upstream, like a signup form with no email validation.
		</li>
	</List>

	<Heading level={2}>To sum up</Heading>

	<Paragraph>
		If there's one idea to carry away, it's that transactional email earns trust by being exactly
        what the recipient asked for, and loses that trust the moment it tries to be anything more. Let each message do its one job well, and most of the rest
        tends to take care of itself.
	</Paragraph>

	<Paragraph>
		<a href="https://lettr.com">Lettr</a> is built to handle that groundwork, from domain authentication
		to separate sending streams and per-message logs, so transactional email stays one less thing to run
		yourself.
	</Paragraph>
</BlogPost>
