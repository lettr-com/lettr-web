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
	excerpt="A step-by-step walkthrough of what happens to an email between your API call and the recipient's inbox: validation, message assembly, DKIM signing, DNS routing, the SMTP handshake, authentication, content filtering, and placement."
	metaDescription="A step-by-step walkthrough of what happens between your API call and the inbox: validation, DKIM signing, DNS routing, the SMTP handshake, and placement."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="February 18, 2026"
	datetime="2026-02-18"
	readTime="11 min read"
	slug="the-journey-of-an-email"
>
	<Lead>
		Sending an email looks like one line of code: a <code>POST /emails</code> request, then a
		<code>200 OK</code> a few milliseconds later. It looks instant and simple, but behind that single
		call the message is validated, assembled into a standard format, cryptographically signed, routed
		through DNS, and checked for reputation and spam before a mail server decides where it lands.
		A lot has to happen before that message reaches a real inbox, and each stage hides
		a failure that can drop or misroute it.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>A 200 OK means the message passed validation, not that it was delivered.</strong> The
				API success only confirms the send was accepted and queued; everything that decides placement happens
				afterward.
			</li>
			<li>
				<strong>Delivery and deliverability are different things.</strong> A <code>250</code> from the
				receiving server means it accepted the message; whether the message reaches the inbox is a separate
				question decided by authentication, reputation, and content.
			</li>
			<li>
				<strong>Spam placement is silent.</strong> No error code and no webhook fire when a message is
				filtered, so a falling open rate is often the only signal that mail has stopped landing in the inbox.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>Step 1: Submission and validation</Heading>

	<Paragraph>
		The email starts as <strong>structured data</strong>: a <code>from</code> address, a <code>to</code> address, a
		subject line, an HTML body, and maybe attachments. Before accepting any of it, the service checks
		that the <code>from</code> address belongs to a verified domain, that attachments are within size
		limits and use allowed file types, and that any template resolves and merges its data cleanly.
	</Paragraph>

	<Paragraph>
		The most important check happens against the <strong>suppression list</strong>. Addresses that previously
		hard-bounced or filed spam complaints are blocked outright, because resending to them would damage
		the sender's reputation. Only once everything passes does the API return success and queue the
		message for assembly.
	</Paragraph>

	<Callout variant="info">
		The takeaway: a successful response means the message survived validation, not that it was
		delivered. The riskiest sends are stopped here, before they ever leave.
	</Callout>

	<Heading level={2}>Step 2: Message assembly</Heading>

	<Paragraph>
		The raw API data is now <strong>formatted into a standard email message</strong>: a set of headers
		(<code>From</code>, <code>To</code>, <code>Subject</code>, <code>Date</code>,
		<code>Message-ID</code>, and others) followed by the body. The structure is defined by <a
			href="https://datatracker.ietf.org/doc/html/rfc5322">RFC 5322</a
		> and has barely changed since the early 1980s.
	</Paragraph>

	<Paragraph>
		The body is usually wrapped in a <strong>MIME</strong> multipart structure carrying both an HTML and a plaintext version, separated by a boundary string, so each receiving client can render whichever it supports. Attachments ride along as Base64-encoded parts. Once assembled, it all becomes a single plain-text document like this:
	</Paragraph>

	<Code lang="text" code={rfcMessage} />

	<Callout variant="info">
		The takeaway: however rich it looks in a client, an email travels the wire as one plain-text RFC
		5322 document.
	</Callout>

	<Heading level={2}>Step 3: DKIM signing</Heading>

	<Paragraph>
		Before the message leaves, it gets a <strong>cryptographic signature</strong> called <a
			href="https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail">DKIM</a
		> (DomainKeys Identified Mail). The sending server hashes key headers and the body, signs that hash
		with a private key, and adds it as a <code>DKIM-Signature</code> header. The matching public key
		lives in a DNS record on the sender's domain, so any receiver can fetch it and check the
		signature. If anything in the message changed along the way, the check fails.
	</Paragraph>

	<Paragraph>
		Providers usually handle key generation and signing for you. Lettr generates the DNS records and <a
			href="https://docs.lettr.com/learn/domains/dkim">verifies them during domain setup</a
		>.
	</Paragraph>

	<Callout variant="info">
		The takeaway: DKIM is tamper-proofing. The signature lets the receiver confirm the message arrived
		exactly as it was sent, and it is one of the three authentication checks covered in Step 6.
	</Callout>

	<Heading level={2}>Step 4: DNS lookups and routing</Heading>

	<Paragraph>
		With the message assembled and signed, the sending server needs to <strong>find where it goes</strong>. It looks up
		the recipient domain's <a
			href="https://www.cloudflare.com/learning/dns/dns-records/dns-mx-record/">MX (Mail Exchange)
			records</a
		>, which name the hosts that accept mail for that domain. When several exist, the server tries the
		lowest-numbered one first (lower means higher priority) and falls back to the rest. If the lookup
		turns up nothing, the message bounces immediately as unroutable.
	</Paragraph>

	<Callout variant="info">
		The takeaway: MX records are the address book for email. They tell the sender which server to hand
		the message to, and a domain with no MX records cannot receive mail at all.
	</Callout>

	<Heading level={2}>Step 5: The SMTP handshake</Heading>

	<Paragraph>
		The sending server opens a <strong>TCP connection</strong> to the recipient's mail server and talks <strong>SMTP</strong> (Simple
		Mail Transfer Protocol). Despite the name, the conversation is structured:
	</Paragraph>

	<Code lang="text" code={smtpHandshake} />

	<Paragraph>
		That final <code>250</code> is what "delivered" means in email: the receiving server has accepted
		the message and taken responsibility for it. What it does <em>not</em> mean is that the message <a
			href="https://support.sparkpost.com/docs/faq/after-receiving-a-250-ok-why-are-messages-being-rejected"
			>reached the inbox</a
		>. Everything after the handoff happens on the receiver's side, where the sender has no visibility.
	</Paragraph>

	<Callout variant="info">
		The takeaway, and the single most important idea in this article: a <code>250</code> is the <a
			href="https://www.litmus.com/blog/the-difference-between-deliverability-and-delivery-rate"
			>delivery vs. deliverability</a
		> gap. Delivery means the server accepted the message; deliverability means it reached the inbox. A
		99% delivery rate can still leave half the mail in spam.
	</Callout>

	<Heading level={2}>Step 6: Authentication checks</Heading>

	<Paragraph>
		Once the receiver accepts the message, it <strong>verifies the sender's identity</strong> using three checks that
		work together:
	</Paragraph>

	<List>
		<li>
			<strong>SPF</strong> (Sender Policy Framework) checks whether the sending server's IP is on the
			list of addresses the domain authorizes to send for it, published as a DNS record.
		</li>
		<li>
			<strong>DKIM</strong> verifies the signature from Step 3: the receiver fetches the public key
			from DNS and confirms the message was not altered in transit.
		</li>
		<li>
			<strong>DMARC</strong> is the policy layer. It tells receivers what to do when SPF or DKIM fail
			(<code>none</code>, <code>quarantine</code>, or <code>reject</code>) and requires that the <code
				>From</code
			> domain match the one that passed SPF or DKIM.
		</li>
	</List>

	<Paragraph> Lettr <a
			href="https://docs.lettr.com/learn/domains/sending-domains">verifies SPF, DKIM, and DMARC
			alignment</a
		> during domain setup, so misconfigurations surface before the first send rather than as mysterious
		placement failures weeks later.
	</Paragraph>

	<Callout variant="info">
		The takeaway: SPF, DKIM, and DMARC together answer one question for the receiver, "is this sender
		who it claims to be?" All three are mandatory, and they have to stay in sync.
	</Callout>

	<Heading level={2}>Step 7: Content filtering</Heading>

	<Paragraph>
		<strong>Authentication</strong> tells the receiver <strong>who sent the message</strong>; <strong>content filtering</strong> decides <strong>whether it is wanted</strong>. The exact rules are proprietary, but the priority order is well understood, with reputation at the top. The <strong>sending domain</strong> carries a score based on how recipients treat its mail: opens, replies, and moves out of spam boost it, while complaints and invalid addresses drag it down.

	</Paragraph>

	<Paragraph>
		<strong>Content analysis</strong> is only a tiebreaker. The filter scans for spam patterns (excessive capitalization, deceptive links, known phishing phrases, suspicious image-to-text ratios), but a legitimate receipt and a phishing email can look nearly identical, which is why reputation carries the weight when the content is ambiguous. Reputation is not even uniform across <strong>recipients</strong>: if one user never opens a sender's mail, Gmail may route it to spam for that user alone, while everyone else sees it in their inbox.

	</Paragraph>

	<Callout variant="info">
		The takeaway: placement is decided by reputation far more than by content, and reputation is earned
		through engagement. Clean authentication gets a message considered, but a history of people
		actually wanting the mail is what lands it in the inbox.
	</Callout>

	<Heading level={2}>Step 8: Placement</Heading>

	<Paragraph>
		After authentication and content filtering, <strong>the receiver makes the final call</strong>, and the message
		lands in one of three places:
	</Paragraph>

	<List>
		<li>
			<strong>Inbox</strong> is the goal, though in Gmail it may sit in Promotions or Updates with much
			less visibility.
		</li>
		<li>
			<strong>Spam/Junk</strong> means the message was accepted but hidden where almost no one looks.
		</li>
		<li>
			<strong>Out-of-band rejection</strong> is the trickiest: the server returned a <code>250</code>
			during the handshake, then decided not to deliver and sent a bounce minutes or hours later, after
			delivery already looked successful.
		</li>
	</List>

	<Paragraph>
		Spam placement is the dangerous one because it is <strong>completely silent</strong>. There is no error code and no
		webhook when a message is filtered; the delivery rate stays high while the open rate quietly
		collapses. The only indirect signal is that drop in engagement.
	</Paragraph>

	<Callout variant="info">
		The takeaway: of the three outcomes, spam is the one to fear, because nothing reports it. A sender
		only learns about it indirectly, through falling open rates, so engagement tracking is the early
		warning system.
	</Callout>

	<Heading level={2}>The feedback loop</Heading>

	<Paragraph>
		Placement is not the end of the process. <strong>Signals flow back from the recipient's mail server to the
		sender</strong>, and how those signals are handled directly affects future deliverability.
	</Paragraph>

	<Paragraph>
		Three signals come back:
	</Paragraph>

	<List>
		<li>
			<strong>Bounces.</strong> Hard bounces (5xx codes like <code>550 5.1.1 User Unknown</code>) mean
			the address is permanently invalid and should be suppressed at once. Soft bounces (4xx codes like
			<code>421 Try again later</code>) are temporary and can be retried.
		</li>
		<li>
			<strong>Spam complaints.</strong> Relayed through <a
				href="https://en.wikipedia.org/wiki/Feedback_loop_(email)">feedback loops</a
			> when a recipient hits "Report Spam." Above <a href="https://support.google.com/a/answer/81126"
				>0.3%</a
			> deliverability is at serious risk; over 0.1% deserves investigation.
		</li>
		<li>
			<strong>Opens and clicks.</strong> Tracked with pixels and redirect links. Image blocking and
			tools like Apple's Mail Privacy Protection distort the numbers, but a sudden drop on a healthy
			domain usually means placement has slipped.
		</li>
	</List>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="Does a 200 OK mean my email was delivered?">
			<strong>No. A 200 OK means the message passed validation and was queued for sending.</strong>
			Delivery happens later, when the receiving server accepts the message and returns a
			<code>250</code> over SMTP. Even that is not the same as reaching the inbox, since placement is
			decided afterward by authentication, reputation, and content filtering.
		</FaqItem>

		<FaqItem question="What is the difference between delivery and deliverability?">
			<strong>Delivery means the receiving server accepted the message; deliverability means it
			reached the inbox.</strong> A <code>250</code> confirms delivery, but the receiver still decides
			whether to file the message in the inbox, in spam, or in a tab like Promotions. A 99% delivery
			rate can still leave a large share of mail in spam.
		</FaqItem>

		<FaqItem question="Why did my email land in spam with no error?">
			<strong>Spam placement is silent: there is no error code and no webhook when a message is
			filtered.</strong> The message was accepted, so the delivery rate stays high while the open rate
			drops. That fall in engagement is usually the only signal, which is why tracking opens is the
			early warning system for placement problems.
		</FaqItem>

		<FaqItem question="What actually decides whether an email reaches the inbox?">
			<strong>Reputation does most of the work, with authentication as the entry requirement.</strong>
			SPF, DKIM, and DMARC have to pass for the message to be considered at all, but the sending
			domain's reputation, built from how recipients engage with its mail, is what determines placement
			when the content itself is ambiguous.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Between the API call and the inbox, a message passes through DNS resolution, cryptographic
		verification, reputation scoring, and content analysis, and each step can silently drop or misroute
		it. <strong>The only confirmation a sender gets is a <code>250 OK</code>, which means the server
		took the message, not that anyone will see it.</strong> Authentication, reputation, and feedback
		loops feed into one another, and placement is the result.
	</Paragraph>

	<Paragraph>
		Lettr surfaces every step in <a href="/platform/analytics/">delivery logs and analytics</a>, on a
		multi-region <a href="/channels/email/">email channel</a> built for it, so DKIM alignment and
		feedback-loop handling are not something to run yourself.
		<a href="https://app.lettr.com/register">Create a free account</a> to send on it.
	</Paragraph>
</BlogPost>
