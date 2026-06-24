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
	import ChecksIcon from 'phosphor-svelte/lib/ChecksIcon';

	const dmarcRecord = `v=DMARC1; p=none; rua=mailto:dmarc-reports@yourapp.com`;
</script>

<BlogPost
	category="Deliverability"
	title="Email deliverability checklist"
	excerpt="A complete email deliverability checklist covering authentication (SPF, DKIM, DMARC), list hygiene, content and spam triggers, sender reputation and IP warmup, and the monitoring metrics to watch, with a printable summary at the end."
	metaDescription="A complete email deliverability checklist: SPF, DKIM, and DMARC, list hygiene, spam triggers, sender reputation and warmup, and the metrics to monitor."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="June 9, 2026"
	datetime="2026-06-09"
	readTime="9 min read"
	slug="email-deliverability-checklist"
>
	<Lead>
		Email deliverability is the rate at which the messages you send reach the inbox instead of the
		spam folder or a hard rejection. It is not a single setting but the sum of several independent
		signals: how your domain is authenticated, how clean your recipient list is, what your content
		looks like to a spam filter, and what reputation your sending domain has earned. This checklist
		works through each of those in the order that matters, and ends with a printable summary.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Authentication comes first</strong>: SPF, DKIM, and DMARC tell receivers the mail is
				genuinely yours, and without them bulk mail is increasingly refused outright.
			</li>
			<li>
				<strong>Reputation is earned, not configured</strong>: a clean list, expected content, and a
				gradual volume ramp are what convince mailbox providers to deliver.
			</li>
			<li>
				<strong>Monitoring closes the loop</strong>: bounce rate, complaint rate, and inbox placement
				are the numbers that tell you whether any of it is working.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What affects email deliverability</Heading>

	<Paragraph>
		Before the checklist itself, it helps to know what a mailbox provider is actually deciding when a
		message arrives. <strong>Every inbound email is scored, not simply accepted or rejected</strong>,
		and the score draws on a handful of independent inputs. Get one badly wrong and strong scores
		elsewhere will not save the message.
	</Paragraph>

	<Paragraph>
		Five factors carry most of the weight, and the rest of this article is one section per factor:
	</Paragraph>

	<List>
		<li>
			<strong>Authentication.</strong> Whether SPF, DKIM, and DMARC prove the message genuinely comes
			from your domain.
		</li>
		<li>
			<strong>List quality.</strong> Whether the recipients are real, engaged, and asked to hear from
			you.
		</li>
		<li>
			<strong>Content.</strong> Whether the subject line, body, and image-to-text balance resemble
			wanted mail or spam.
		</li>
		<li>
			<strong>Sender reputation.</strong> The track record the sending domain and IP have built over
			time.
		</li>
		<li>
			<strong>Engagement.</strong> Whether recipients open, reply, and avoid marking the mail as spam.
		</li>
	</List>

	<Paragraph>
		The ordering is deliberate. Authentication is a prerequisite that either passes or fails on day
		one, while reputation and engagement build slowly and are the parts no setup step can shortcut.
		Work top to bottom.
	</Paragraph>

	<Heading level={2}>Authentication setup (SPF, DKIM, DMARC)</Heading>

	<Paragraph>
		Authentication is the foundation, because a message that fails it is discounted no matter how good
		everything else is. <strong>Gmail and Yahoo both require all three records for bulk senders</strong>,
		and providers increasingly reject unauthenticated mail rather than filing it in spam. These three
		DNS records are the first thing to get right.
	</Paragraph>

	<List>
		<li>
			<strong>SPF</strong> is a DNS TXT record listing the servers allowed to send for your domain. A
			receiver checks the sending IP against that list. Publish exactly one SPF record, include every
			service that sends on your behalf, and end it with <code>~all</code>.
		</li>
		<li>
			<strong>DKIM</strong> attaches a cryptographic signature to each message, so the receiver can
			verify the content was not altered in transit and genuinely came from your domain. The signature
			survives forwarding, which SPF does not. The provider holds the private key and publishes the
			public key in DNS.
		</li>
		<li>
			<strong>DMARC</strong> ties SPF and DKIM to the visible <code>From</code> address and tells
			receivers what to do when a message fails. Start it at <code>p=none</code> with a reporting
			address.
		</li>
	</List>

	<Code lang="text" code={dmarcRecord} />

	<Paragraph>
		The concept that does the real work is <strong>alignment</strong>: DMARC passes only when the
		domain that authenticated matches the domain a recipient sees in the <code>From</code> field. That
		match is what stops a spammer from passing SPF on their own domain while displaying yours. For the
		full mechanics of how the three records fit together and how to read the headers, see
		<a href="/blog/spf-dkim-dmarc-explained-for-developers/">SPF, DKIM, and DMARC explained for
		developers</a>.
	</Paragraph>

	<Callout variant="tip" title="Roll out DMARC in stages">
		Deploy <code>p=none</code> first so receivers report failures without blocking anything. Read the
		aggregate reports for a few weeks to find every legitimate sender, then ratchet to
		<code>p=quarantine</code> and finally <code>p=reject</code>. Jumping straight to
		<code>p=reject</code> drops forwarded mail and forgotten services overnight.
	</Callout>

	<Heading level={2}>List hygiene</Heading>

	<Paragraph>
		A clean list is the cheapest reputation insurance there is, because <strong>every send to a dead or
		unwilling address is a negative signal</strong>. Mailbox providers watch how often you hit invalid
		addresses and spam traps, and a list that decays untouched will drag down delivery for the
		recipients who do want the mail. Three habits keep a list healthy.
	</Paragraph>

	<List>
		<li>
			<strong>Remove hard bounces immediately.</strong> A hard bounce (a permanent 5xx error) means the
			address does not exist. Sending to it again is the single fastest way to look like a spammer, who
			characteristically mails stale lists. Suppress every hard-bounced address on the first failure
			and never retry it.
		</li>
		<li>
			<strong>Honor unsubscribes instantly.</strong> An unsubscribe must stop mail within a day, and a
			one-click unsubscribe header is now required for bulk senders at Gmail and Yahoo. A recipient who
			cannot leave easily clicks "spam" instead, which is far more damaging than a quiet opt-out.
		</li>
		<li>
			<strong>Prune disengaged recipients.</strong> Addresses that have not opened or clicked in six to
			twelve months lower engagement scores and sometimes turn into recycled spam traps. Run a
			re-engagement campaign, then drop the ones who stay silent.
		</li>
	</List>

	<Paragraph>
		The discipline that underpins all three is <strong>collecting addresses honestly in the first
		place</strong>. Confirmed opt-in (where a new subscriber clicks a link to verify the address)
		keeps typos, disposable addresses, and spam traps off the list before they can ever bounce or
		complain. A purchased or scraped list does the opposite, and it is the most reliable way to land
		on a blocklist.
	</Paragraph>

	<Callout variant="warning" title="Never buy a list">
		A purchased list is full of addresses that never agreed to hear from you, including spam traps
		planted specifically to catch senders who buy lists. One send to it can damage a domain's
		reputation for months. There is no list cheap enough to be worth that.
	</Callout>

	<Heading level={2}>Content and spam triggers</Heading>

	<Paragraph>
		Modern spam filters lean far more on reputation and engagement than on scanning words, so
		<strong>content rarely sinks a well-authenticated message from a trusted sender on its own</strong>.
		It still matters at the margins, and a few patterns reliably hurt. The goal is mail that reads
		like a genuine message rather than a broadcast.
	</Paragraph>

	<List>
		<li>
			<strong>Write honest subject lines.</strong> The subject should match the body. ALL CAPS,
			excessive punctuation, and bait like "RE:" on a message that is not a reply read as manipulation
			to a filter and to a reader.
		</li>
		<li>
			<strong>Keep a healthy text-to-image ratio.</strong> An email that is one large image with almost
			no text is a classic spam pattern, and it breaks entirely for recipients who block images. Lead
			with real text and use images to support it.
		</li>
		<li>
			<strong>Include a plain-text version.</strong> Sending a multipart message with both HTML and
			plain-text alternatives is a signal of legitimate mail, and some clients prefer the plain-text
			part outright.
		</li>
	</List>

	<Paragraph>
		The "spammy words" advice that circulates is mostly outdated. A single mention of "free" or "sale"
		will not divert a message from a reputable sender. <strong>What filters actually weigh is the
		whole picture</strong>: a sudden change in tone or format, links to a domain with no reputation, or
		mismatched <code>From</code> and reply-to addresses. Consistency from one send to the next is worth
		more than avoiding any particular word.
	</Paragraph>

	<Callout variant="tip" title="Test before a large send">
		Send the message to a few seed addresses across Gmail, Outlook, and Yahoo first, and open each to
		check it lands in the inbox and renders correctly. A spam-checking tool that scores the content
		against common filters catches obvious problems before the full list ever sees them.
	</Callout>

	<Heading level={2}>Sender reputation and IP warmup</Heading>

	<Paragraph>
		Reputation is the part of deliverability that <strong>cannot be configured, only earned</strong>.
		Mailbox providers keep a running score for every sending domain and IP, built from delivery
		history, complaints, and engagement. Correct authentication proves who is sending; reputation is
		what proves the sender is trusted, and a brand-new domain starts with none.
	</Paragraph>

	<Paragraph>
		The way a new domain or IP earns a reputation is <strong>warmup</strong>: raising daily volume
		gradually so providers can build a track record before full-scale sending. A new domain that sends
		fifty thousand messages on its first day looks exactly like a spammer who just registered, and a
		large share of that mail will be deferred or filtered.
	</Paragraph>

	<List>
		<li>
			<strong>Start small and ramp over weeks.</strong> Begin in the low hundreds per day and roughly
			double every few days, taking two to six weeks to reach target volume depending on how high that
			target is.
		</li>
		<li>
			<strong>Send to the most engaged recipients first.</strong> Early sends carry outsized weight, so
			they should go to people who open and click reliably. High open rates at the start build the
			foundation; low ones tell providers the mail is unwanted.
		</li>
		<li>
			<strong>Warm up each sending stream separately.</strong> A new subdomain or a switch to a
			provider with different IPs starts at zero again, even when the parent domain is established.
		</li>
	</List>

	<Paragraph>
		Reputation is also why <a href="/blog/separate-transactional-and-marketing-email/">separating
		transactional and marketing email</a> onto different subdomains pays off: a marketing campaign that
		draws complaints then cannot drag down the password resets and receipts that recipients are
		actively waiting for. For the full ramp schedules and the signals that mean pause, see
		<a href="/blog/how-to-warm-up-a-sending-domain/">how to warm up a new sending domain</a>.
	</Paragraph>

	<Heading level={2}>Monitoring</Heading>

	<Paragraph>
		Deliverability is not a setup task that stays done, because <strong>reputation is re-evaluated
		continuously and a single bad sending day can undo weeks of good ones</strong>. Monitoring is what
		turns a silent decline into an alert while there is still time to act. Three numbers cover most of
		it, and all three should be watched per mailbox provider, not just as an overall average.
	</Paragraph>

	<List>
		<li>
			<strong>Bounce rate.</strong> Track hard bounces (permanent) and soft bounces (temporary)
			separately. A hard bounce rate above roughly 2% points to a list-quality problem and calls for
			cleaning the list before sending more.
		</li>
		<li>
			<strong>Complaint rate.</strong> The share of recipients who mark the mail as spam. Gmail's
			published threshold is 0.3%, and staying an order of magnitude below it is the goal. This is the
			single most damaging signal, so any spike needs an immediate diagnosis.
		</li>
		<li>
			<strong>Inbox placement.</strong> Delivery to the server is not the same as landing in the inbox.
			A message can be accepted and then filed in spam, which produces no error at all, so placement has
			to be measured directly with seed-list tests or provider dashboards.
		</li>
	</List>

	<Paragraph>
		The tooling for this is mostly free. <strong><a href="https://postmaster.google.com/">Google
		Postmaster Tools</a> reports domain and IP reputation, spam rate, and authentication results</strong>
		for mail sent to Gmail, and feedback loops at Yahoo and Microsoft report complaints from their
		users. Set these up before the first large send, because a ramp run without them is run blind.
	</Paragraph>

	<Callout variant="info">
		On <a href="https://docs.lettr.com/learn/domains/sending-domains">Lettr</a>, authentication is
		verified during domain setup, and bounce and complaint events stream through
		<a href="https://docs.lettr.com/learn/webhooks/introduction">webhooks</a> in real time, so a rising
		complaint rate surfaces in minutes rather than after a customer reports a missing email. That
		monitoring is part of <a href="/platform/deliverability/">Lettr's deliverability tooling</a>.
	</Callout>

	<Heading level={2}>The deliverability checklist</Heading>

	<Paragraph>
		Here is the whole thing in one place, grouped by section. It is built to copy into a runbook or
		print straight from the browser, so it can serve as the pre-send checklist before any large
		campaign.
	</Paragraph>

	<div class="checklist not-prose my-8 border border-border/50 bg-white p-6 shadow-[0_20px_50px_-45px_rgba(17,24,39,0.6)] sm:p-8">
		<div class="mb-6 flex items-center justify-between gap-3 border-b border-border/50 pb-4">
			<span class="font-heading text-xs tracking-[0.15em] text-primary uppercase">
				Pre-send checklist
			</span>
			<ChecksIcon size={18} class="text-primary" />
		</div>

		<div class="grid gap-7">
			<div>
				<h3 class="mb-3 text-sm font-semibold text-surface">Authentication</h3>
				<ul class="space-y-2.5 text-sm leading-snug text-muted">
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Exactly one SPF record published, including every sending service, ending in <code>~all</code>.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>DKIM signing enabled, with the public key published under your provider's selector.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>DMARC record live at <code>_dmarc.yourdomain.com</code> with a reporting address.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>DMARC moved past <code>p=none</code> to <code>p=quarantine</code> or <code>p=reject</code> after reviewing reports.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>SPF, DKIM, and DMARC all aligned with the visible <code>From</code> domain.</span></li>
				</ul>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold text-surface">List hygiene</h3>
				<ul class="space-y-2.5 text-sm leading-snug text-muted">
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Addresses collected through confirmed opt-in, never purchased or scraped.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Hard bounces suppressed automatically on the first failure.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Unsubscribes honored within a day, with a one-click unsubscribe header on bulk mail.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Disengaged recipients pruned or re-engaged on a regular schedule.</span></li>
				</ul>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold text-surface">Content</h3>
				<ul class="space-y-2.5 text-sm leading-snug text-muted">
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Subject line honest and matching the body, with no bait or ALL CAPS.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Real text leading the message, images supporting rather than replacing it.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>A plain-text alternative included alongside the HTML.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Consistent <code>From</code> name and address from one send to the next.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Rendering and placement tested across Gmail, Outlook, and Yahoo before a large send.</span></li>
				</ul>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold text-surface">Reputation and warmup</h3>
				<ul class="space-y-2.5 text-sm leading-snug text-muted">
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>New domains and IPs warmed up gradually over two to six weeks.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Early sends directed at the most engaged recipients.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Each new sending stream or subdomain warmed up on its own.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Transactional and marketing mail separated onto different subdomains.</span></li>
				</ul>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold text-surface">Monitoring</h3>
				<ul class="space-y-2.5 text-sm leading-snug text-muted">
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Hard bounce rate watched and kept under roughly 2%.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Complaint rate watched and kept well under 0.3%.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Inbox placement measured directly, not assumed from delivery.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Google Postmaster Tools and Yahoo and Microsoft feedback loops configured.</span></li>
					<li class="flex gap-2.5"><span class="mt-0.5 shrink-0 text-primary">&#10003;</span><span>Alerts set on the key metrics so a decline surfaces before customers notice.</span></li>
				</ul>
			</div>
		</div>
	</div>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="What is a good email deliverability rate?">
			<strong>A healthy delivery rate is 95% or higher</strong>, meaning at least 95 of every 100
			messages are accepted by the receiving server. Delivery is not the same as inbox placement,
			though, so a high delivery rate paired with low inbox placement points to a reputation or content
			problem rather than a list problem.
		</FaqItem>

		<FaqItem question="Why do my emails go to spam even with SPF, DKIM, and DMARC set up?">
			<strong>Authentication proves who is sending, not that the sender is trusted.</strong> A correctly
			authenticated message from a new domain with no reputation, or one sending to a stale list, can
			still be filtered. Spam placement after correct setup usually traces to weak sender reputation,
			low engagement, or a list-quality issue rather than the DNS records.
		</FaqItem>

		<FaqItem question="What bounce rate is too high?">
			<strong>A hard bounce rate above roughly 2% is a warning sign</strong> and a sign the recipient
			list needs cleaning. Hard bounces are permanent failures to addresses that do not exist, and
			continuing to send to them is a strong spam signal. Soft bounces are temporary and less alarming
			in small numbers.
		</FaqItem>

		<FaqItem question="What complaint rate causes deliverability problems?">
			<strong>Gmail's published spam-complaint threshold is 0.3%</strong>, and crossing it prompts
			filtering or blocking. The practical target is to stay an order of magnitude below that, around
			0.1% or lower, since complaints are the most damaging signal a mailbox provider tracks.
		</FaqItem>

		<FaqItem question="How long does it take to fix bad email deliverability?">
			<strong>Recovering a damaged sender reputation typically takes several weeks of disciplined
			sending</strong>: clean the list, fix the root cause of complaints or bounces, and resume at lower
			volume to the most engaged recipients. Reputation builds back gradually for the same reason it
			builds slowly during warmup.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Deliverability comes down to a sequence: <strong>authenticate the domain, keep the list clean, send
		content that reads as wanted, build reputation slowly, and monitor the result</strong>. None of the
		steps is difficult alone, but they are easy to let slip, which is why a checklist run before each
		large send is worth more than any single optimization.
	</Paragraph>

	<Paragraph>
		Lettr operationalizes most of this list directly. Authentication is generated and verified during
		<a href="https://docs.lettr.com/learn/domains/sending-domains">domain setup</a>, bounces and
		complaints stream through webhooks in real time, and the deliverability metrics above are tracked
		for every send.
		<a href="https://app.lettr.com/register">Create a free account</a> and verify a domain before your
		next campaign goes out.
	</Paragraph>
</BlogPost>
