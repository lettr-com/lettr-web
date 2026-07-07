<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		TldrList,
		Callout,
		Faq,
		FaqItem
	} from '$lib/components/blog';
</script>

<BlogPost
	category="Deliverability"
	title="Why your emails go to spam (and how to fix it)"
	excerpt="A diagnostic guide to why emails go to spam: how spam filters actually decide, where to find the evidence (message headers, Google Postmaster Tools, Microsoft SNDS, blocklist checks), and the five causes behind most spam placement, each with the signs that identify it and the fix."
	metaDescription="Why emails go to spam and how to find the real cause: failed authentication, complaint rate, sender reputation, list quality, or content, with diagnostic tools for each."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="July 7, 2026"
	datetime="2026-07-07"
	readTime="10 min read"
	slug="why-emails-go-to-spam"
>
	<Lead>
		A message that lands in spam produces no error, no bounce, and no notification, and mailbox
		providers do not report why they filed it there. The causes are enumerable, though, and each
		one leaves evidence in a specific place.
		This guide is a diagnostic: how the filtering decision works, where to look for the evidence,
		and the five causes that account for most spam placement, each with the signs that identify
		it and the fix. For building a compliant setup from scratch, the
		<a href="/blog/email-deliverability-checklist/">deliverability checklist</a> is the companion
		piece; this article is for when mail is already going to spam and the question is why.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Check authentication first.</strong> Since February 2024, Gmail requires SPF or
				DKIM from every sender, and unauthenticated or misaligned mail is filtered or rejected
				regardless of content. A test message and "Show original" reveal the verdict in seconds.
			</li>
			<li>
				<strong>The evidence lives in three places</strong>: the Authentication-Results header of
				a test message, Google Postmaster Tools (compliance, spam rate, reputation), and
				Microsoft SNDS for Outlook placement.
			</li>
			<li>
				<strong>Complaints outweigh content.</strong> Modern filters are trained on user
				behavior, so who receives the mail and how they react matters more than which words the
				mail contains. The 0.3% complaint-rate threshold is enforced; "spam trigger words" are
				mostly folklore.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>How a spam filter decides</Heading>

	<Paragraph>
		Knowing what the filter weighs tells you where to look. Gmail describes its filtering as
		machine learning trained on user feedback, examining <strong>the sending IP, the domain,
		authentication, and how users react</strong> to a sender's mail; marking a message as spam,
		or rescuing one from the spam folder, trains the model directly. Microsoft's SmartScreen
		documentation lists the same inputs: sending IP, domain, authentication, list accuracy,
		complaint rates, and content. The practical reading of both lists is an order of operations:
		authentication acts as a gate, sender reputation sets the default disposition, and user
		signals move it over time. Content sits last, as a tiebreaker.
	</Paragraph>

	<Paragraph>
		One structural point explains most confusion: <strong>the sender is the unit being judged,
		not the message</strong>. The same newsletter lands in the inbox from one domain and in spam
		from another, because the domains carry different histories. This is why diagnosing starts
		with the sender's evidence rather than with rewriting the email.
	</Paragraph>

	<Heading level={2}>Find the evidence before changing anything</Heading>

	<Paragraph>
		Each diagnostic below takes minutes and rules causes in or out. Run them in this order:
	</Paragraph>

	<List>
		<li>
			<strong>Send a test to a Gmail address and open "Show original"</strong> (the three-dot menu
			on the message). The summary at the top shows SPF, DKIM, and DMARC as pass or fail for that
			exact message. Any fail here is cause 1, and nothing else matters until it passes.
		</li>
		<li>
			<strong>Check <a href="https://postmaster.google.com/">Google Postmaster Tools</a></strong>
			for the sending domain. The compliance dashboard grades the domain against Gmail's sender
			requirements, and the spam rate, domain reputation, and IP reputation dashboards separate
			cause 2 from cause 3. Low-volume senders may see no data, which is itself informative: the
			domain has little history.
		</li>
		<li>
			<strong>For Outlook and Hotmail placement, register the sending IPs in Microsoft
			SNDS</strong> (Smart Network Data Services). It reports complaint volume, spam-trap hits,
			and the filter's verdict per IP.
		</li>
		<li>
			<strong>Run the domain and IPs through a blocklist check</strong> such as MXToolbox, with
			one caveat: it queries around a hundred lists and most of them do not matter. A Spamhaus
			listing is significant; an obscure list nobody queries is noise.
		</li>
		<li>
			<strong>For a placement answer rather than a cause, run a seed test</strong> (GlockApps and
			similar services deliver to real mailboxes across providers and report where each copy
			landed). Single-message scanners like mail-tester check the message and DNS setup, which
			catches configuration issues but cannot see reputation.
		</li>
	</List>

	<Heading level={2}>Cause 1: authentication fails or doesn't align</Heading>

	<Paragraph>
		This is the first thing to rule out because it is binary and enforced.
		<strong>Since February 2024, Gmail requires every sender to pass SPF or DKIM</strong>, and
		bulk senders (5,000 or more messages a day) need SPF, DKIM, and DMARC together, with the
		visible From domain aligned to the domain that SPF or DKIM validated. Unauthenticated mail
		may be rejected outright with a <code>5.7.26</code> error, and since May 2025 Microsoft
		rejects unauthenticated high-volume mail with <code>550 5.7.515</code>. Yahoo enforces the
		same standard.
	</Paragraph>

	<Paragraph>
		The failure that slips past experienced senders is <strong>alignment</strong>: SPF and DKIM
		both pass, but for a different domain than the one in the From address, so DMARC fails
		anyway. The special case worth naming is the freemail From address: mail sent from an
		<code>@gmail.com</code> or <code>@yahoo.com</code> address through an email provider fails
		DMARC by construction, because the provider cannot authenticate for Google's or Yahoo's
		domain (Yahoo has published a reject policy since 2014). The fix is sending from a domain
		you own, with the records from the
		<a href="/blog/spf-dkim-dmarc-explained-for-developers/">SPF, DKIM, and DMARC guide</a>
		published and verified.
	</Paragraph>

	<Heading level={2}>Cause 2: recipients mark the mail as spam</Heading>

	<Paragraph>
		Complaints are the strongest negative signal a filter learns from, and they are the one
		metric with a published, enforced threshold. <strong>Google requires the spam rate reported
		in Postmaster Tools to stay below 0.3% and recommends staying below 0.1%</strong>; a sender
		above 0.3% is ineligible for support mitigation until the rate stays below the line for
		seven consecutive days. Yahoo publishes the same 0.3% ceiling.
	</Paragraph>

	<Paragraph>
		The measurement has a diagnostic subtlety. Gmail's spam rate counts messages that reached
		the inbox and were then marked as spam, so <strong>a low spam rate does not clear a sender
		whose mail already lands in spam</strong> (mail in the spam folder generates no complaints).
		A rising spam rate means inbox recipients are turning against the mail. The causes are
		usually consent and expectations: recipients who never signed up, mail arriving far more
		often than promised, or an unsubscribe that is harder to find than the spam button. The fix
		is one-click unsubscribe (required for bulk senders anyway), honest sending frequency, and
		cutting the segments that never engage.
	</Paragraph>

	<Heading level={2}>Cause 3: the sender's reputation is low or nonexistent</Heading>

	<Paragraph>
		Postmaster Tools grades domain and IP reputation on four levels (bad, low, medium, high),
		and Google's documentation is blunt about the bottom of the scale: mail from a bad-reputation
		sender is almost always marked as spam or rejected. <strong>Reputation problems have three
		usual shapes</strong>: a new domain with no history sending real volume on day one, a sudden
		volume increase on an established domain (Google's guidance after deferrals is to grow daily
		volume by 25% to 100%, not multiples), and inherited trouble from shared infrastructure,
		since the activity of every sender on a shared IP affects all of them.
	</Paragraph>

	<Paragraph>
		One aggregation rule matters for anyone running subdomains: Gmail counts subdomain traffic
		toward the primary domain's bulk-sender status and evaluates compliance at the primary-domain
		level, so <strong>a misbehaving marketing subdomain can affect how the organization's mail is
		classified</strong> even when transactional mail is clean. A new or cold domain needs a
		<a href="/blog/how-to-warm-up-a-sending-domain/">gradual warm-up</a>; an established domain
		with a reputation dip needs the volume held steady while causes 2 and 4 are fixed.
	</Paragraph>

	<Heading level={2}>Cause 4: the list itself</Heading>

	<Paragraph>
		List quality shows up in the filter's inputs as engagement and in the worst case as
		<strong>spam traps</strong>: addresses that exist to catch senders with bad list practices. A
		pristine trap never belonged to a person, so hitting one means the list was bought or
		scraped. A recycled trap is an abandoned mailbox that hard-bounced for an extended period
		before being reactivated as a trap, so hitting one means bounces are not being removed.
		Microsoft SNDS reports trap hits directly, which makes them one of the few list problems
		that can be measured rather than inferred.
	</Paragraph>

	<Paragraph>
		The fix is mechanical and covered step by step in the
		<a href="/blog/how-to-send-bulk-email/">bulk email guide</a>: double opt-in at the front
		door, immediate removal of <a href="/blog/hard-bounce-vs-soft-bounce/">hard bounces</a>, and
		a sunset policy for recipients who have not engaged in months. Google's own guidelines
		recommend both of the last two.
	</Paragraph>

	<Heading level={2}>Cause 5: the content (a smaller factor than assumed)</Heading>

	<Paragraph>
		Content is the most rewritten and least decisive factor. <strong>Static lists of "spam
		trigger words" are folklore</strong>; for an authenticated sender in good standing, no single
		word decides placement, and deliverability practitioners have largely stopped treating word
		lists as meaningful. What Google actually documents as content requirements is narrower and
		checkable:
	</Paragraph>

	<List>
		<li>
			<strong>No hidden content.</strong> HTML or CSS that conceals text from the reader is an
			explicit spam signal.
		</li>
		<li>
			<strong>Honest subject lines.</strong> No "Re:" or "Fwd:" on messages that are not replies
			or forwards, and no misleading claims.
		</li>
		<li>
			<strong>One message type per message.</strong> Google specifically warns against mixing
			content types, such as promotions inside a receipt.
		</li>
		<li>
			<strong>Visible, comprehensible links.</strong> Link text should match where the link goes.
			URL shorteners are not banned, but they hide the destination domain, and a shortener whose
			domain sits on a blocklist donates that reputation to the message.
		</li>
		<li>
			<strong>Standards-compliant formatting.</strong> RFC 5322 structure, a valid Message-ID,
			and well-formed HTML.
		</li>
	</List>

	<Callout variant="tip" title="The Promotions tab is not spam">
		Landing in Gmail's Promotions tab is inbox delivery. Tab classification is a separate system
		from spam filtering, and moving from Promotions to Primary is an engagement question, not a
		deliverability one. Diagnose spam-folder placement and tab placement as different problems.
	</Callout>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="Why are my emails going to spam all of a sudden?">
			<strong>A sudden change usually means a threshold was crossed, not that content
			changed.</strong> The usual suspects are an authentication record that broke (check a test
			message's Show original), a complaint rate approaching 0.3%, a volume jump the domain's
			history does not support, or a new blocklist entry. Postmaster Tools narrows it down
			fastest.
		</FaqItem>

		<FaqItem question="How do I find out why my emails go to spam?">
			<strong>Collect evidence in three places.</strong> Send a test to Gmail and read the SPF,
			DKIM, and DMARC verdicts in Show original; check compliance, spam rate, and reputation in
			Google Postmaster Tools; and run the domain and IPs through a blocklist check. Each cause
			of spam placement leaves a mark in one of them.
		</FaqItem>

		<FaqItem question="Do spam trigger words still matter?">
			<strong>Barely. Modern filters weigh authentication, sender reputation, and user behavior
			far above vocabulary.</strong> Google's documented content rules are about deception
			instead: hidden text, fake "Re:" subjects, mixed message types, and misleading links. A
			reputable sender does not need to write around a word list.
		</FaqItem>

		<FaqItem question="How do I stop my emails from going to spam in Gmail?">
			<strong>Pass Gmail's published requirements, then fix whichever cause the evidence
			points to.</strong> That means SPF, DKIM, and DMARC with an aligned From domain, one-click
			unsubscribe on bulk mail, a spam rate below 0.3% (ideally 0.1%), steady volume, and a list
			of people who opted in. The compliance dashboard in Postmaster Tools grades each item.
		</FaqItem>

		<FaqItem question="Will getting delisted from a blocklist fix my deliverability?">
			<strong>Only if the listing caused the problem, and only if the root cause is fixed
			first.</strong> Gmail, Outlook, and Yahoo rely primarily on their own reputation systems,
			not public blocklists; a Spamhaus listing matters, but most of the hundred lists a checker
			queries do not. Delisting without fixing the underlying practice leads to relisting.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Spam placement always has a cause, and the cause leaves evidence: an authentication verdict
		in the headers, a complaint rate or reputation grade in Postmaster Tools, trap hits in SNDS,
		a listing on a blocklist that actually matters. <strong>Diagnose in that order, fix the one
		thing the evidence names</strong>, and resist rewriting subject lines while the real cause
		sits in DNS or in the list.
	</Paragraph>

	<Paragraph>
		A managed sending platform removes several causes outright: Lettr authenticates every domain
		it sends for, adds one-click unsubscribe to campaigns, suppresses bounces and complaints
		automatically, and its deliverability alerts report reputation problems and blocklistings as
		they happen rather than after a quarter of silent spam placement.
		<a href="https://app.lettr.com/register">Create a free account</a> and run the first
		authenticated test message through it today.
	</Paragraph>
</BlogPost>
