<script lang="ts">
	import { BlogPost, Lead, Heading, Paragraph, List, Callout } from '$lib/components/blog';
</script>

<BlogPost
	category="Fundamentals"
	title="How transactional email actually works"
	excerpt="A user clicks 'Reset Password,' waits, checks spam, gives up — and files a ticket about an email you didn't know was broken. If you're shipping your first signup or receipt flow, the transactional vs. marketing distinction matters."
	author={{ name: 'Erik Vlčák', role: 'Customer Success', avatar: '/images/authors/erik.jpg' }}
	date="February 4, 2026"
	datetime="2026-02-04"
	readTime="6 min read"
	slug="what-is-transactional-email"
>
	<Lead>
		When a user clicks "Reset Password," your system sends a one-time link to their inbox. They wait,
		check their spam folder, and try again. Nothing. The link expires, they get locked out, and a few
		minutes later, a support ticket lands in your queue about an email you probably didn't notice was
		broken.
	</Lead>

	<Paragraph>
		That email was transactional. If you're a backend developer about to ship your first signup,
		password reset, or receipt flow, the difference between transactional and marketing email
		matters. Get it wrong, and the same template can hit a 90% inbox rate on one provider and the spam
		folder on another.
	</Paragraph>

	<Callout variant="info" title="TL;DR">
		<List>
			<li>
				Transactional emails are sent in response to a specific user action, whereas marketing emails
				are sent on the sender's schedule. Inbox providers and regulators treat them differently.
			</li>
			<li>
				Mixing promotional content into a receipt is the fastest way to torch deliverability, and
				it's a common FTC enforcement target.
			</li>
			<li>
				Treat email outages like API outages: authenticate your domain, separate streams, monitor
				latency, and suppress dead addresses.
			</li>
		</List>
	</Callout>

	<Heading level={2}>What is transactional email?</Heading>

	<Paragraph>
		A transactional email is sent in direct response to a user action: an order confirmation, a login
		code, a password reset, or a dunning notice. There's a one-to-one link between the action and the
		message, and the user is usually waiting for it.
	</Paragraph>

	<Paragraph>
		Marketing emails work the other way around. The sender selects the audience, timing, and content,
		and pushes the message out on a schedule. No specific user action triggers any specific send.
		Gmail, spam filters, and privacy regulators all key off this distinction, so the same HTML
		template performs very differently depending on which bucket it lands in.
	</Paragraph>

	<Heading level={2}>Transactional vs. marketing: why inboxes treat them differently</Heading>

	<Paragraph>
		Open rates tell the first part of the story. Marketing emails average 20–25%, while transactional
		emails hover around
		<a href="https://www.mailgun.com/blog/email/email-open-rates-decoded/">80–85%</a>, roughly four
		times higher. A 2FA code is a gate: users refresh their inbox until it shows up. A receipt is
		expected but not a blocker. Either way, transactional messages get more attention per send than
		anything else you'll deliver, so rendering bugs, wrong details, or slow delivery are noticed
		immediately.
	</Paragraph>

	<Paragraph>
		Regulators draw the same line. CAN-SPAM defines a narrow set of "transactional or relationship
		messages" (receipts, account notices, etc.) that are exempt from the unsubscribe requirement.
		Under GDPR, sends that are genuinely necessary to perform a contract (like a receipt for a
		purchase the user just made) can rely on contractual necessity as the lawful basis instead of
		consent. "We updated our terms" emails are disputed. CASL has a similar carve-out. None of these
		exceptions are as broad as they sound, but they do exist.
	</Paragraph>

	<Paragraph>
		The combination of looser legal requirements and four times higher open rates is why teams are
		tempted to slip a promo banner into the order confirmation. That temptation is where most
		deliverability problems start.
	</Paragraph>

	<Heading level={2}>Mixing marketing into transactional is how you end up in spam</Heading>

	<Paragraph>
		The risk is reclassification. Once a "transactional" email contains enough promotional content,
		regulators or mailbox providers no longer treat it as transactional. Concretely: an order
		confirmation that includes a 30%-off coupon and three product recommendations is no longer a
		receipt but a marketing email with a receipt attached. The FTC has
		<a
			href="https://www.ftc.gov/legal-library/browse/cases-proceedings?search_api_fulltext=can-spam"
			>penalized companies under CAN-SPAM</a
		> for exactly this pattern when the resulting message lacked a working unsubscribe link.
	</Paragraph>

	<Callout variant="warning" title="Promo in a receipt can trigger FTC enforcement">
		An order confirmation that's mostly coupons and product recommendations can be reclassified as
		marketing — and if it lacks a working unsubscribe link, that's a CAN-SPAM violation regulators
		have actively pursued.
	</Callout>

	<Paragraph>
		Even when regulators don't get involved, Gmail does, and it doesn't send warning letters. Content
		signals, engagement patterns, and sender reputation all feed into spam classification. If your
		transactional templates look promotional or share infrastructure with your marketing campaigns,
		in the worst case, order confirmations can slide into Promotions and 2FA codes can land in spam.
		Once domain reputation drops, recovery typically takes weeks of clean sending.
	</Paragraph>

	<Paragraph>
		The rule is simple: keep transactional templates focused on a single purpose. If you want to
		cross-sell, send a separate marketing email with proper opt-in and an unsubscribe link.
	</Paragraph>

	<Heading level={2}>Delivery failures are outages</Heading>

	<Paragraph>
		Transactional email isn't a side channel; it's part of your product's critical path. A 2FA code
		that doesn't arrive blocks login. A verification email that bounces stalls signup. A receipt that
		goes to spam generates support tickets and, occasionally, chargebacks.
	</Paragraph>

	<Paragraph>Treat email like any other production dependency:</Paragraph>

	<List
		items={[
			'Track delivery rates by message type.',
			'Monitor bounces and spam complaints.',
			'Suppress addresses that repeatedly fail. Sending to dead mailboxes damages reputation, and inbox providers remember.',
			'Keep per-message logs so you can debug a specific failure instead of guessing from aggregates.'
		]}
	/>

	<Paragraph>
		Latency matters as much as deliverability. Users expect a 2FA code or verification link within
		seconds; after 10–15 seconds, they tend to hit "resend," leading to duplicates and confusion.
		Receipts and confirmations have more slack, so a minute or two is fine. Anything that blocks a
		user action (login codes, password resets, email verification) deserves an explicit SLA and an
		alert when it breaches.
	</Paragraph>

	<Paragraph>
		Once email is on your critical path, the same retry logic that keeps the rest of your queue
		reliable will start sending the same 2FA code two or three times. Pass an idempotency key on each
		send (the order ID, a hash of the user ID and template, whatever is stable for that event) and let
		your provider dedupe within a short window. The alternative is a worker that retries a transient
		SMTP failure and ships three copies of the password reset.
	</Paragraph>

	<Heading level={2}>Setting up the infrastructure</Heading>

	<Heading level={3}>Authenticate your domain (SPF, DKIM, DMARC)</Heading>

	<Paragraph>
		Domain authentication is the single biggest lever for deliverability, and it's the area most teams
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

	<Paragraph>
		Since February 2024, Gmail and Yahoo have required all three for bulk senders. Your provider, such
		as Lettr,
		<a href="https://docs.lettr.com/learn/domains/sending-domains"
			>generates and verifies these records for you</a
		>, but you still have to add them to your DNS. Skipping this step is the most common reason
		transactional emails end up in spam.
	</Paragraph>

	<Heading level={3}>Separate your sending streams</Heading>

	<Paragraph>
		Use different IPs (or, at a minimum, different subdomains) for transactional and marketing email.
		A spam complaint from a marketing campaign shouldn't be allowed to drag your password resets down
		with it. Teams that skip this end up untangling shared infrastructure after a marketing blast
		pushes login codes into spam folders.
	</Paragraph>

	<Heading level={3}>Be selective about tracking</Heading>

	<Paragraph>
		Open and click tracking confirm delivery and engagement, but routing a password-reset link
		through a tracking redirect adds latency and can trigger phishing warnings in some clients.
		Disable tracking on security-sensitive emails, and keep it enabled for receipts and notifications
		where engagement data is useful.
	</Paragraph>

	<Heading level={3}>Test in a sandbox before production</Heading>

	<Paragraph>
		Sandbox keys let you exercise the full send path, including templates, headers, and suppressions,
		without consuming quota or risking your sender reputation on a half-finished feature. Wire sandbox
		tests into CI so that a regression in your password reset email is caught before it reaches a real
		user. Production is a bad place to discover that your DKIM signature fails when a customer's name
		contains a non-ASCII character.
	</Paragraph>

	<Heading level={3}>Manage suppressions and bounces</Heading>

	<Paragraph>
		Permanent failures (hard bounces) and spam complaints should be suppressed immediately and never
		retried. Soft bounces (a temporarily full mailbox or a transient server error) can be retried on a
		backoff schedule. The rule: stop sending to addresses that have permanently failed, and monitor
		the suppression list as a leading indicator. If it's growing faster than expected, the problem is
		usually upstream, such as typo-prone signup forms, a missing email-validation step, or a list that
		was scraped rather than collected.
	</Paragraph>

	<Heading level={2}>When it breaks</Heading>

	<Paragraph>
		Transactional email tends to stay invisible until it breaks: a failed login, an abandoned signup,
		or a chargeback for a receipt that never arrived. By then, you're not fixing a bug; you're
		handling a production incident that began weeks earlier in your DNS records, your suppression
		list, or your shared sender reputation.
	</Paragraph>

	<Paragraph>
		If you'd rather not wire this up yourself, <a href="https://lettr.com">Lettr</a> handles it.
	</Paragraph>
</BlogPost>
