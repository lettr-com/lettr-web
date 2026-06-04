<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		Quote,
		Callout,
		Code,
		Divider
	} from '$lib/components/blog';

	const rfcMessage = `From: notifications@yourapp.com
To: user@gmail.com
Subject: Verify your email address
Date: Tue, 04 Mar 2026 10:30:00 -0500
Message-ID: <abc123@yourapp.com>
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="boundary123"

--boundary123
Content-Type: text/plain; charset=UTF-8

Click here to verify: https://yourapp.com/verify?token=xyz

--boundary123
Content-Type: text/html; charset=UTF-8

<html><body><a href="https://yourapp.com/verify?token=xyz">Verify</a></body></html>
--boundary123--`;

	const smtpHandshake = `Sending server: EHLO mail.yourprovider.com
Receiving server: 250-smtp.gmail.com at your service
Sending server: MAIL FROM:<notifications@yourapp.com>
Receiving server: 250 OK
Sending server: RCPT TO:<user@gmail.com>
Receiving server: 250 OK
Sending server: DATA
Receiving server: 354 Start mail input
Sending server: [the full RFC 5322 message from step 2]
Sending server: .
Receiving server: 250 2.0.0 OK`;
</script>

<BlogPost
	category="Engineering"
	title="The journey of an email: from API call to inbox"
	excerpt="You POST /emails, get a 200 OK, and assume it went through. Fifteen minutes later: 'I never received my verification email.' Here's everything that happens between your API call and the recipient's inbox."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="February 18, 2026"
	datetime="2026-02-18"
	readTime="11 min read"
	slug="the-journey-of-an-email"
>
	<Lead>
		You send a <code>POST /emails</code> request with a JSON body, receive a <code>200 OK</code>, and
		assume everything went through. Fifteen minutes later, a support ticket arrives: "I never
		received my verification email."
	</Lead>

	<Paragraph>
		The API accepted your request, and the email was sent. But "sent" and "arrived in someone's
		inbox" are two very different things, separated by DNS lookups, cryptographic signatures,
		reputation checks, and content filters that most developers never consider until something
		breaks. Here's what actually happens from your API call to the moment a recipient sees your
		message.
	</Paragraph>

	<Heading level={2}>Step 1: Submission and validation</Heading>

	<Paragraph>
		Your email begins as structured data: a <code>from</code> address, a <code>to</code> address, a subject
		line, an HTML body, and possibly attachments. Before accepting the message, the email service validates
		every part of it.
	</Paragraph>

	<Paragraph>
		There's more here than you might expect. The <code>from</code> address must be from a domain you've
		verified. Attachments are checked for size limits and prohibited file types. If you're using a template,
		the service resolves it and merges your substitution data.
	</Paragraph>

	<Paragraph>
		Recipient addresses are checked against a suppression list. Addresses that previously hard-bounced
		or filed spam complaints are blocked because resending to them would damage your sender
		reputation. This list is typically managed for you. Lettr, for example, <a
			href="https://docs.lettr.com/learn/suppressions/introduction">maintains it automatically</a
		> and blocks redelivery to addresses that previously caused bounces or complaints. Only after all
		of this passes does the service respond with success and queue the message for assembly.
	</Paragraph>

	<Heading level={2}>Step 2: Message assembly</Heading>

	<Paragraph>
		Your raw API data must now be formatted as an email message that complies with <a
			href="https://datatracker.ietf.org/doc/html/rfc5322">RFC 5322</a
		>. The format dates back to <a href="https://datatracker.ietf.org/doc/html/rfc822">RFC 822</a> in
		1982 and has remained essentially stable for over forty years. Every email you've ever received uses
		the same structure.
	</Paragraph>

	<Paragraph>
		That means creating headers: <code>From</code>, <code>To</code>, <code>Subject</code>,
		<code>Date</code>, <code>Message-ID</code>, <code>MIME-Version</code>, and others. Special
		characters are encoded per <a href="https://datatracker.ietf.org/doc/html/rfc2047">RFC 2047</a>,
		which specifies how to represent non-ASCII text (accented characters, non-Latin scripts) in
		headers using encoded words such as <code>=?UTF-8?B?...?=</code>.
	</Paragraph>

	<Paragraph>
		If the email includes both HTML and plaintext versions (it should, since some clients display
		only plaintext), the body is wrapped in a MIME multipart structure. Each part has its own <code
			>Content-Type</code
		> and is separated by a unique boundary string. The receiving client chooses which to display: a
		text-only client shows <code>text/plain</code>, while a modern client renders
		<code>text/html</code>. Attachments are encoded as Base64 MIME parts.
	</Paragraph>

	<Paragraph>The result is a plaintext document that looks something like this:</Paragraph>

	<Code lang="text" code={rfcMessage} />

	<Paragraph>
		This is the actual document transmitted over the wire. Strip away the clients, the apps, and the
		rich rendering, and what flows between mail servers is plain text like this.
	</Paragraph>

	<Heading level={2}>Step 3: DKIM signing</Heading>

	<Paragraph>
		Before the message leaves the sending infrastructure, it receives a cryptographic signature. This
		is <a href="https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail">DKIM</a>, or DomainKeys
		Identified Mail. The sending server creates a hash of specific headers (usually <code>From</code>,
		<code>To</code>, <code>Subject</code>, <code>Date</code>) and the message body, then signs the
		hash with a private key. The signature is placed in a <code>DKIM-Signature</code> header, and the
		public key is stored in a DNS TXT record on the sender's domain so any receiving server can fetch
		it and verify.
	</Paragraph>

	<Paragraph>
		If anyone modifies the message in transit (altering the body, changing a header, injecting
		content), the signature won't match when the receiver verifies it. It's a tamper-detection
		mechanism and one of the three pillars of modern email authentication, alongside SPF and DMARC.
	</Paragraph>

	<Paragraph>
		Most email providers automatically handle key generation and signing. You just add the DNS
		records they provide. Lettr generates these records and <a
			href="https://docs.lettr.com/learn/domains/dkim">verifies them during domain setup</a
		>.
	</Paragraph>

	<Heading level={2}>Step 4: DNS lookups and routing</Heading>

	<Paragraph>
		Once the message is assembled and signed, the sending server has to figure out where to deliver
		it. That begins with a DNS lookup for the recipient's domain. The server looks up <a
			href="https://www.cloudflare.com/learning/dns/dns-records/dns-mx-record/">MX (Mail Exchange) records</a
		>, which specify which hosts handle incoming mail for that domain. A domain can have multiple MX
		records with different priority values. The server tries the lowest-numbered record first (lower
		= higher priority, confusingly), and falls back to the others if it's unavailable.
	</Paragraph>

	<Paragraph>
		If the MX lookup fails (the domain doesn't exist or has no MX records), the message bounces
		immediately. The address is simply unroutable.
	</Paragraph>

	<Heading level={2}>Step 5: The SMTP handshake</Heading>

	<Paragraph>
		The sending server opens a TCP connection to the recipient's mail server and talks SMTP (Simple
		Mail Transfer Protocol). Despite the name, the conversation is structured:
	</Paragraph>

	<Code lang="text" code={smtpHandshake} />

	<Paragraph>
		That final <code>250</code> is what "delivered" means in email. The receiving server has accepted
		the message and taken responsibility for it. But here's what most people miss: <a
			href="https://support.sparkpost.com/docs/faq/after-receiving-a-250-ok-why-are-messages-being-rejected"
			>that 250 doesn't mean the email is in the inbox</a
		>. It means the receiver has accepted it for processing. Everything that happens next is on their
		side, and the sender has no visibility into it.
	</Paragraph>

	<Paragraph>
		This is the <a href="https://www.litmus.com/blog/the-difference-between-deliverability-and-delivery-rate"
			>delivery vs. deliverability</a
		> distinction that trips up many developers. Delivery means the server accepted the message. Deliverability
		means it actually reached the inbox. You can have a 99% delivery rate and still have half your emails
		in spam.
	</Paragraph>

	<Heading level={2}>Step 6: Authentication checks</Heading>

	<Paragraph>
		Once the receiver accepts the message, it verifies the sender's identity. Three checks work
		together:
	</Paragraph>

	<Paragraph>
		<strong>SPF (Sender Policy Framework).</strong> The receiver looks up the SPF record in the sender's
		domain's DNS. This TXT record lists the IP addresses authorized to send on behalf of that domain.
		If the sending server's IP isn't listed in the SPF record, SPF fails.
	</Paragraph>

	<Paragraph>
		<strong>DKIM verification.</strong> The receiver retrieves the <code>DKIM-Signature</code> header,
		fetches the public key from DNS, and verifies the cryptographic signature. If the message was altered
		in transit or the signature doesn't match, DKIM verification fails.
	</Paragraph>

	<Paragraph>
		<strong>DMARC (Domain-based Message Authentication, Reporting & Conformance).</strong> The policy
		layer. The domain owner publishes a DMARC record that tells receivers what to do when SPF or DKIM
		fail: <code>none</code> (do nothing, just report), <code>quarantine</code> (send it to spam), or
		<code>reject</code> (drop the message). DMARC also requires "alignment": the domain in the
		<code>From</code> header must match the domain that passed SPF or DKIM.
	</Paragraph>

	<Paragraph>
		Since February 2024, <a href="https://support.google.com/a/answer/81126?hl=en"
			>Gmail requires all three</a
		> for bulk senders (anyone sending 5,000+ messages per day). Even if you're not a bulk sender, missing
		authentication makes your messages look suspicious. Most teams slip up by failing to get all three
		configured correctly and to keep them in sync. Lettr <a
			href="https://docs.lettr.com/learn/domains/sending-domains">verifies SPF, DKIM, and DMARC alignment</a
		> during domain setup, so misconfigurations are caught before you send a single message rather than
		appearing as mysterious placement failures weeks later.
	</Paragraph>

	<Heading level={2}>Step 7: Content filtering</Heading>

	<Paragraph>
		Authentication tells the receiver who sent the message. Content filtering decides whether the
		message is wanted. Spam filters are proprietary; Google, Microsoft, and Yahoo don't publish how
		their systems work, for obvious reasons. But the general principles are known, and they reinforce
		each other in a specific order.
	</Paragraph>

	<Paragraph>
		<strong>Reputation comes first.</strong> Your sending domain has a score, and almost everything else
		is evaluated in light of it. A domain that consistently sends mail that people open and engage with
		builds a good reputation. A domain that attracts spam complaints or hits invalid addresses builds
		a bad one. IP reputation still matters, but less than it used to, as providers are shifting toward
		domain-based signals.
	</Paragraph>

	<Paragraph>
		<strong>Engagement is what builds that reputation.</strong> Gmail, in particular, tracks how recipients
		treat your messages. Opens, replies, moves out of spam, and deletes without reading - every interaction
		nudges the score. This creates a feedback loop: good engagement earns better placement, which in turn
		drives more engagement. Bad engagement does the inverse, and recovery is much slower than the damage.
	</Paragraph>

	<Paragraph>
		<strong>Content analysis is the tiebreaker.</strong> The filter scans the body for spam patterns:
		excessive capitalization, deceptive links, known phishing phrases, and suspicious image-to-text ratios.
		A legitimate order confirmation and a phishing email can look very similar to a naive content filter,
		which is exactly why reputation carries so much weight when the content is ambiguous.
	</Paragraph>

	<Paragraph>
		<strong>Recipient-level signals override the domain score.</strong> Even with a clean reputation,
		placement can vary by recipient. If a specific user has never opened your emails, Gmail may route
		them to spam for that user alone, while everyone else still sees them in the primary inbox.
	</Paragraph>

	<Heading level={2}>Step 8: Placement</Heading>

	<Paragraph>
		After authentication and content filtering, the receiver makes the final call. The email goes to
		one of three places:
	</Paragraph>

	<Paragraph>
		<strong>Inbox.</strong> The message lands in the primary inbox. In Gmail, it might end up in Promotions
		or Updates instead, which is still technically "inbox" but with much less visibility.
	</Paragraph>

	<Paragraph>
		<strong>Spam/Junk.</strong> The message is accepted but filtered out. The user can technically find
		it, but almost no one regularly checks their spam folder. Your delivery rate looks fine, your open
		rate bombed, and you have no idea why, until someone mentions they found your emails buried in the
		junk folder.
	</Paragraph>

	<Paragraph>
		<strong>Out-of-band rejection.</strong> The receiver accepted the message during the SMTP conversation
		(returning a 250) but later decided not to deliver it. This results in a bounce notification minutes
		or hours later. These are particularly hard to diagnose because, from the sender's perspective, delivery
		already appeared successful.
	</Paragraph>

	<Paragraph>
		There's no standard signal for spam placement. If your email lands in spam, you won't receive an
		error code or a webhook. You'll notice it indirectly through declining open rates, which is why
		tracking engagement matters. Lettr's <a href="https://docs.lettr.com/learn/events/introduction"
			>events API</a
		> surfaces open and click data for each message, so a sudden drop in a particular email type is visible
		before it becomes a support ticket.
	</Paragraph>

	<Heading level={2}>The feedback loop</Heading>

	<Paragraph>
		The story doesn't end with placement. Signals flow back from the recipient's mail server to the
		sender, and how you handle them directly affects your future deliverability.
	</Paragraph>

	<Paragraph>
		<strong>Bounces</strong> come in two types. Hard bounces (5xx SMTP codes like
		<code>550 5.1.1 User Unknown</code>) indicate the address is permanently invalid: it doesn't
		exist, the domain is gone, or the mailbox is disabled. Soft bounces (4xx codes like
		<code>421 Try again later</code>) are temporary: the server is overloaded, the mailbox is full,
		or you're being rate-limited. Hard bounces should trigger immediate suppression. Soft bounces can
		be retried, but if they keep failing, suppress them too.
	</Paragraph>

	<Paragraph>
		<strong>Spam complaints</strong> happen when a recipient clicks "Report Spam" or "Mark as Junk." Major
		mailbox providers use <a href="https://en.wikipedia.org/wiki/Feedback_loop_(email)"
			>feedback loops (FBLs)</a
		> to notify the sender. Above roughly <a href="https://support.google.com/a/answer/81126">0.3%</a
		> (Gmail's published threshold), you're in serious trouble. Anything over 0.1% already deserves investigation.
	</Paragraph>

	<Paragraph>
		<strong>Opens and clicks</strong> are tracked using invisible pixel images and redirect links embedded
		in the HTML body. They're not perfect, as image blocking, privacy tools like Apple's Mail Privacy
		Protection, and plaintext rendering all distort the numbers. But they're the closest thing to engagement
		data senders have. A sudden drop in open rates on a previously healthy domain usually indicates that
		placement has gotten worse.
	</Paragraph>

	<Paragraph>
		Lettr reports all of these (deliveries, bounces, opens, clicks, complaints) via <a
			href="https://docs.lettr.com/learn/webhooks/introduction">webhooks</a
		> and the <a href="https://docs.lettr.com/learn/events/introduction">events API</a>, allowing you
		to respond to delivery issues automatically rather than waiting for support tickets.
	</Paragraph>

	<Heading level={2}>Where things break</Heading>

	<Paragraph>
		Each stage in this pipeline has its own failure modes, and the symptoms aren't always obvious.
	</Paragraph>

	<Paragraph>
		<strong>DNS misconfigurations</strong> are the most common root cause. These include a missing SPF
		record, a DKIM key that was rotated but never updated in DNS, and a DMARC policy set to
		<code>reject</code> before all your legitimate senders pass authentication. These issues are silent.
		Emails start disappearing or landing in spam, and nothing alerts you unless you're watching.
	</Paragraph>

	<Paragraph>
		<strong>Reputation damage</strong> accumulates gradually. Sending to a purchased list (don't), neglecting
		bounce handling, or letting complaint rates creep up all erode reputation over time. The frustrating
		part is the lag: you can damage your reputation today and not see the impact on inbox placement for
		days or weeks.
	</Paragraph>

	<Paragraph>
		<strong>Content-filter false positives</strong> happen when legitimate transactional emails are flagged
		as spam. Password reset emails with links can look like phishing. Order confirmations with many product
		images can look like promotional spam. The fix is usually to keep transactional emails simple: one
		message, one purpose.
	</Paragraph>

	<Paragraph>
		<strong>Shared infrastructure risks</strong> can catch people off guard. If your email provider uses
		shared IP addresses (most do for smaller senders), another customer's poor sending practices can
		drag down your deliverability. Domain authentication (SPF, DKIM, DMARC) helps by tying your reputation
		to your domain rather than to a shared IP address.
	</Paragraph>

	<Paragraph>
		These failure modes compound. A DNS misconfiguration lets spam through, which damages reputation,
		which tightens content filters against you, which depresses engagement, which further damages
		reputation. The pipeline is resilient by design, but when it breaks, it tends to break in several
		places at once, and each broken piece pulls the others down with it.
	</Paragraph>

	<Heading level={2}>What you can actually control</Heading>

	<Paragraph>
		You can't control spam filters or guarantee inbox placement. What you can do is remove the things
		that get in the way:
	</Paragraph>

	<Paragraph>
		<strong>Authenticate everything.</strong> Set up SPF, DKIM, and DMARC for every sending domain. Non-negotiable
		in 2026. With <a href="https://docs.lettr.com/learn/domains/sending-domains">Lettr</a>, the DNS records
		are generated and verified for you. You just paste them into your DNS provider.
	</Paragraph>

	<Paragraph>
		<strong>Handle bounces and complaints.</strong> Suppress hard bounces immediately. Investigate complaint
		spikes. Stop retrying addresses that repeatedly fail. This is the single highest-leverage action you
		can take for long-term deliverability. Lettr surfaces bounce and complaint events via <a
			href="https://docs.lettr.com/learn/webhooks/introduction">webhooks</a
		> in real time, so your app can respond immediately rather than discovering the damage days later.
	</Paragraph>

	<Paragraph>
		<strong>Warm up new domains gradually.</strong> A brand-new domain has no reputation, and mailbox
		providers treat it with suspicion, even with perfect authentication. Start small with your most engaged
		recipients, then scale up over days or weeks. Skipping warmup is one of the most common reasons a
		new integration looks great in testing but falls apart in production.
	</Paragraph>

	<Paragraph>
		<strong>Separate your sending streams.</strong> Transactional and marketing emails should use different
		subdomains, at a minimum. A marketing campaign that triggers complaints shouldn't jeopardize your
		password reset delivery.
	</Paragraph>

	<Paragraph>
		<strong>Monitor signals, not just delivery rates.</strong> A 99% delivery rate means nothing if your
		open rate is 2%. Track opens, clicks, bounces, and complaints <em>by email type</em>. Aggregate numbers
		hide the failures that matter most.
	</Paragraph>

	<Paragraph>
		<strong>Keep transactional emails focused.</strong> One email, one purpose. Don't include product
		recommendations in a password reset. Mailbox providers will notice and reclassify your messages.
	</Paragraph>

	<Heading level={2}>The gap between "sent" and "received"</Heading>

	<Paragraph>
		Most developers think of email as a simple input-output system: call an API, and someone receives
		a message. But between those two events, your message passes through DNS resolution, cryptographic
		verification, reputation scoring, and content analysis. Each step can silently drop or misroute
		it. The sender's only confirmation is a <code>250 OK</code>, which means "I'll take it from here"
		with no promise of what happens next.
	</Paragraph>

	<Paragraph>
		Once you see the full pipeline, you stop treating email as fire-and-forget. It's a distributed
		system where authentication, reputation, and feedback loops feed into one another, and it fails in
		ways that don't show up in your error logs but do show up in support tickets.
	</Paragraph>

	<Divider />

	<Paragraph>
		If you're building an app that sends email and would rather not spend the next month debugging
		DKIM alignment and processing feedback loops yourself, <a href="https://lettr.com"
			>give Lettr a try</a
		>.
	</Paragraph>
</BlogPost>
