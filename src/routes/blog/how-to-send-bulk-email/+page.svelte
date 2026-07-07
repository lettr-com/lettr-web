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

	const oneClickHeaders = `List-Unsubscribe: <https://yourapp.com/unsubscribe?c=123&u=456>
List-Unsubscribe-Post: List-Unsubscribe=One-Click`;
</script>

<BlogPost
	category="Fundamentals"
	title="How to send bulk email the right way"
	excerpt="How to send bulk email that reaches the inbox: the sending limits that rule out Gmail and Outlook mailboxes, the bulk sender requirements Gmail, Yahoo, and Microsoft now enforce, the legal rules in the US, EU, and Canada, and a six-step workflow from permission to monitoring."
	metaDescription="The bulk sender rules Gmail, Yahoo, and Outlook enforce, why a mailbox account can't send mass email, and a six-step workflow that reaches the inbox."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="July 4, 2026"
	datetime="2026-07-04"
	readTime="9 min read"
	slug="how-to-send-bulk-email"
>
	<Lead>
		Bulk email is one message sent to a large list of recipients at once: a newsletter, a product
		announcement, a promotion. Since February 2024, Gmail and Yahoo enforce technical requirements
		on anyone sending 5,000 or more messages a day, and Microsoft added its own in May 2025. Mail
		that misses them is increasingly rejected outright rather than filed in spam. This guide covers
		what the rules require, why a regular mailbox account cannot meet them, and a step-by-step
		workflow for bulk sending that holds up.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>A mailbox account is the wrong tool.</strong> A free Gmail account caps out at 500
				recipients a day and a Workspace account at 2,000 messages, and neither handles
				unsubscribes, bounces, or the headers bulk mail now requires.
			</li>
			<li>
				<strong>Bulk senders have hard requirements.</strong> SPF, DKIM, and DMARC with an aligned
				From domain, one-click unsubscribe, and a spam complaint rate below 0.3% are enforced by
				Gmail, Yahoo, and Outlook, with rejection as the penalty.
			</li>
			<li>
				<strong>Permission decides the outcome.</strong> Authentication gets a message evaluated;
				a list of people who actually asked to hear from you is what gets it delivered.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What counts as bulk email</Heading>

	<Paragraph>
		The threshold that matters is the one the mailbox providers use.
		<strong>Google treats anyone sending 5,000 or more messages a day to personal Gmail accounts
		as a bulk sender</strong>, and the count aggregates everything sent from the same primary
		domain, so mail from <code>example.com</code> and <code>promotions.example.com</code> counts
		together. Once a domain crosses the line, bulk sender status is permanent regardless of what
		volume does later. Yahoo announced matching rules jointly with Google, and Microsoft applies
		its own version to domains sending 5,000 or more messages a day to Outlook, Hotmail, and Live
		addresses.
	</Paragraph>

	<Paragraph>
		The older name for this kind of send is an <strong>email marketing blast</strong>: the same
		message pushed to an entire list at once. The term survives, but sending one message to
		everyone regardless of interest is exactly the pattern that drives spam complaints, and
		complaint rate is now a hard metric. Segmented sends to the part of the list a message is
		actually relevant to are the modern form of the blast.
	</Paragraph>

	<Paragraph>
		Bulk email is also a different category from transactional email, the receipts and password
		resets an application sends to one person at a time. The two are judged differently by mailbox
		providers and regulated differently by law, which is why they belong on
		<a href="/blog/separate-transactional-and-marketing-email/">separate sending domains</a>.
	</Paragraph>

	<Heading level={2}>Why a mailbox account can't send mass email</Heading>

	<Paragraph>
		The obvious starting point is Gmail or Outlook, with the list in the BCC field or a mail
		merge add-on. The published sending limits make that a dead end well before real volume.
		<strong>These are the current caps</strong>:
	</Paragraph>

	<table>
		<thead>
			<tr>
				<th>Account type</th>
				<th>Daily sending limit</th>
				<th>What happens above it</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Free Gmail</td>
				<td>500 recipients or 500 emails per day</td>
				<td>Sending blocked for 1 to 24 hours</td>
			</tr>
			<tr>
				<td>Google Workspace</td>
				<td>2,000 messages (1,500 via built-in mail merge)</td>
				<td>Sending blocked for up to 24 hours</td>
			</tr>
			<tr>
				<td>Free Outlook.com</td>
				<td>About 300 recipients, 100 per message</td>
				<td>Send failures; new accounts start lower</td>
			</tr>
			<tr>
				<td>Microsoft 365</td>
				<td>5,000 recipients, 500 per message</td>
				<td>Throttling and send failures</td>
			</tr>
		</tbody>
	</table>

	<Paragraph>
		The limits are only half the problem. <strong>A BCC blast offers no personalization, no
		per-recipient delivery tracking, and one wrong keystroke</strong> (Cc instead of Bcc) exposes
		the entire list to every recipient, which for a customer list is a privacy incident.
	</Paragraph>

	<Paragraph>
		The other half is compliance tooling. A mailbox provides <strong>no unsubscribe headers, no
		suppression list, no bounce processing, and no complaint feedback loop</strong>, all of which
		the bulk sender rules below effectively require. A mailbox account runs out of quota two
		orders of magnitude before the 5,000-a-day threshold, so the rules were never written with one
		in mind.
	</Paragraph>

	<Heading level={2}>The rules Gmail, Yahoo, and Outlook enforce</Heading>

	<Paragraph>
		Google and Yahoo announced their requirements jointly in October 2023 and began enforcing them
		on February 1, 2024; Microsoft's version took effect on May 5, 2025. The three sets overlap
		almost entirely, so <strong>meeting Google's published sender guidelines effectively covers
		all three providers</strong>. The requirements for bulk senders:
	</Paragraph>

	<List>
		<li>
			<strong>Full authentication.</strong> SPF and DKIM must both pass, a DMARC record must exist
			(at minimum <code>p=none</code>), and the visible From domain must align with the domain
			SPF or DKIM validated. The
			<a href="/blog/spf-dkim-dmarc-explained-for-developers/">SPF, DKIM, and DMARC guide</a>
			covers how to publish each record.
		</li>
		<li>
			<strong>One-click unsubscribe.</strong> Marketing messages must carry the RFC 8058 header
			pair shown below, and opt-outs must be honored within two days. A visible unsubscribe link
			in the body is required as well.
		</li>
		<li>
			<strong>Spam complaint rate below 0.3%.</strong> That is the enforcement threshold; Google
			recommends staying below 0.1% as measured in
			<a href="https://postmaster.google.com/">Postmaster Tools</a>.
		</li>
		<li>
			<strong>Clean infrastructure.</strong> Sending IPs need valid forward and reverse DNS (PTR
			records), and delivery must use TLS.
		</li>
	</List>

	<Paragraph>
		The one-click unsubscribe requirement is two headers, added to every marketing message:
	</Paragraph>

	<Code lang="text" code={oneClickHeaders} />

	<Callout variant="warning" title="Enforcement is rejection now">
		Through 2024 the penalty for missing these requirements was mostly spam placement. That has
		changed. Starting November 2025, Gmail answers non-compliant traffic with temporary failures
		(4.7.x codes) and permanent rejections (5.7.x codes), and Microsoft rejects unauthenticated
		bulk mail with <code>550 5.7.515 Access denied</code>. Authentication stopped being a
		deliverability optimization and became a delivery prerequisite.
	</Callout>

	<Paragraph>
		The full requirement lists are published in
		<a href="https://support.google.com/a/answer/81126">Google's Email sender guidelines</a> and
		<a href="https://senders.yahooinc.com/best-practices/">Yahoo's sender best practices</a>;
		Microsoft's are in its
		<a
			href="https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730"
			>high-volume sender announcement</a
		>.
	</Paragraph>

	<Heading level={2}>The legal rules</Heading>

	<Paragraph>
		Separate from the mailbox providers, three legal regimes cover most bulk sending, and they
		differ on one axis: <strong>whether consent is required before the first email</strong>.
	</Paragraph>

	<List>
		<li>
			<strong>CAN-SPAM (US)</strong> is an opt-out regime: emailing first is allowed, but every
			message needs truthful headers, a physical postal address, and a working opt-out honored
			within 10 business days. The FTC's penalty is up to
			<a href="https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business"
				>$53,088 per email</a
			>.
		</li>
		<li>
			<strong>GDPR (EU)</strong> is opt-in: marketing to individuals requires consent that is
			active (no pre-ticked boxes), specific, provable, and withdrawable at any time.
		</li>
		<li>
			<strong>CASL (Canada)</strong> requires express consent before sending, with penalties up to
			CA$10 million per violation for organizations.
		</li>
	</List>

	<Paragraph>
		A permission-first list satisfies all three regimes at once, which is why the workflow below
		starts there rather than with tooling.
	</Paragraph>

	<Heading level={2}>How to send bulk email, step by step</Heading>

	<Heading level={3}>1. Collect permission, not just addresses</Heading>

	<Paragraph>
		Every address on the list should belong to someone who asked to be there.
		<strong>Double opt-in</strong> (a confirmation click after signup) proves the address exists,
		keeps typos and bots off the list, and produces the consent record GDPR expects. A purchased
		list fails on every count: the recipients never opted in, the complaint rate will show it, and
		bought lists are where <a href="/blog/email-deliverability-checklist/">spam traps</a> live.
	</Paragraph>

	<Heading level={3}>2. Authenticate a dedicated sending domain</Heading>

	<Paragraph>
		Publish SPF, DKIM, and DMARC before the first send, and put bulk mail on its own subdomain
		(such as <code>news.example.com</code>) rather than the domain transactional email uses.
		<strong>Reputation is tracked per domain, and marketing mail always draws more complaints than
		receipts do</strong>, so the split keeps a bad campaign from dragging password resets into
		spam. Google's guidelines themselves recommend separating mail types by From address.
	</Paragraph>

	<Heading level={3}>3. Send through an email platform, not a mailbox</Heading>

	<Paragraph>
		A bulk email platform exists to do the things a mailbox cannot: render a template per
		recipient, add the one-click unsubscribe headers, process bounces, and maintain the
		suppression list automatically. In
		<a href="/blog/introducing-lettr-marketing-audiences-and-campaigns/">Lettr's Campaigns</a>,
		anyone who unsubscribes, bounces, or complains is excluded from every future send without a
		list to maintain, and <strong>an unsubscribe link is added to every campaign by
		default</strong>, so a send cannot ship without the one the law requires.
	</Paragraph>

	<Heading level={3}>4. Warm up before full volume</Heading>

	<Paragraph>
		A domain with no sending history cannot open at full volume. Google's guidance is to
		<strong>start with a low volume to the most engaged recipients and increase gradually</strong>;
		it warns that suddenly doubling previous volume can trigger rate limiting and reputation
		drops. The <a href="/blog/how-to-warm-up-a-sending-domain/">domain warm-up guide</a> has two
		ramp schedules to copy.
	</Paragraph>

	<Heading level={3}>5. Keep the list clean and segmented</Heading>

	<Paragraph>
		List quality decays on its own: addresses die, interest fades. Remove
		<a href="/blog/hard-bounce-vs-soft-bounce/">hard bounces</a> immediately, and follow Google's
		own recommendation to <strong>automatically unsubscribe recipients whose mail keeps bouncing
		and consider unsubscribing those who never open</strong> (a sunset policy). Segmenting each
		send to the contacts it is relevant to lowers complaints and raises engagement at the same
		time.
	</Paragraph>

	<Heading level={3}>6. Measure clicks and complaints, not opens</Heading>

	<Paragraph>
		Open rates stopped being trustworthy in 2021. <strong>Apple Mail Privacy Protection preloads
		tracking pixels when a message arrives, not when it is read</strong>, and Apple Mail accounts
		for roughly half of all email opens, so reported opens are inflated across the board. Clicks
		and conversions still measure real behavior. On the negative side, watch the spam complaint
		rate in <a href="https://postmaster.google.com/">Google Postmaster Tools</a> and treat 0.1% as
		the ceiling to stay under.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="How many emails can I send at once from Gmail?">
			<strong>A free Gmail account allows 500 recipients per day, a Google Workspace account
			2,000 messages, and Workspace's built-in mail merge 1,500 per day.</strong> Exceeding a
			limit blocks sending for up to 24 hours. Anything beyond those numbers, or anything
			commercial at scale, needs a bulk email service rather than a mailbox.
		</FaqItem>

		<FaqItem question="How do I send bulk emails without going to spam?">
			<strong>Authenticate the sending domain with SPF, DKIM, and DMARC, send only to people who
			opted in, include one-click unsubscribe, and keep the complaint rate below 0.3%.</strong>
			Warm up a new domain gradually instead of opening at full volume, and remove bouncing
			addresses as they appear. Those are the exact signals mailbox providers score.
		</FaqItem>

		<FaqItem question="What is an email marketing blast?">
			<strong>An email blast is the same message sent to an entire list at once, without
			segmentation.</strong> The approach still exists, but because unsegmented sends draw more
			spam complaints and complaint rate is now an enforced threshold, most senders target each
			message to the part of the list it is relevant to instead.
		</FaqItem>

		<FaqItem question="Is it legal to send mass emails?">
			<strong>Yes, within each region's rules.</strong> The US CAN-SPAM Act allows unsolicited
			commercial email but requires truthful headers, a postal address, and a working opt-out,
			with fines up to $53,088 per email. The EU's GDPR and Canada's CASL both require consent
			before sending. A permission-based list satisfies all three.
		</FaqItem>

		<FaqItem question="What is the difference between bulk email and transactional email?">
			<strong>Bulk email goes to many recipients by the sender's choice; transactional email goes
			to one person because of something they did</strong>, such as a purchase or a password
			reset. Providers judge them differently and the law treats them differently, so they belong
			on <a href="/blog/separate-transactional-and-marketing-email/">separate sending domains</a>.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Sending bulk email the right way is a short list: a permission-based list, SPF, DKIM, and
		DMARC on a dedicated subdomain, a platform that handles unsubscribes and bounces
		automatically, a gradual volume ramp, and complaint monitoring. <strong>Every item on the
		list is now enforced by someone</strong>, either a mailbox provider or a regulator, which is
		exactly why bulk sending belongs on purpose-built infrastructure.
	</Paragraph>

	<Paragraph>
		Lettr's <a href="/email-marketing/">Campaigns and Audiences</a> handle the platform side:
		suppression, one-click unsubscribe, per-recipient rendering, and real-time results, with
		marketing and transactional streams kept on separate domains.
		<a href="https://app.lettr.com/register">Create a free account</a> (3,000 emails and 500
		contacts a month are included) and send the first campaign to yourself.
	</Paragraph>
</BlogPost>
