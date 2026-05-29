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

	const lowVolumeSchedule = `Day     Daily volume   Notes
1-2     100-200        Most engaged recipients only
3-4     500            Monitor bounce and complaint rates
5-7     1,000          Check Postmaster Tools if sending to Gmail
8-10    2,500
11-14   5,000
15+     Target volume  Maintain steady sending from here`;

	const highVolumeSchedule = `Week    Daily volume       Notes
1       1,000-2,000        Most engaged recipients, monitor everything
2       5,000-10,000       Review Postmaster Tools, check deferral rates
3       15,000-25,000      Expand to moderately engaged recipients
4       30,000-50,000
5-6     50,000-100,000     Approach target volume
6+      Target volume`;
</script>

<BlogPost
	category="Deliverability"
	title="How to warm up a new sending domain"
	excerpt="You set up SPF, DKIM, and DMARC, flip the switch, send 50,000 emails on day one — and half vanish. Nothing is broken. Your domain is just new and untrusted. Here's how to warm it up."
	author={{ name: 'Erik Vlčák', role: 'Customer Success', avatar: '/images/authors/erik.jpg' }}
	date="April 22, 2026"
	datetime="2026-04-22"
	readTime="9 min read"
	slug="how-to-warm-up-a-sending-domain"
>
	<Lead>
		You've set up SPF, DKIM, and DMARC. Your templates look good, and your API integration works. You
		flip the switch, send 50,000 emails on day one, and half of them vanish. Gmail defers most of them.
		Outlook silently drops a chunk into spam. Yahoo bounces a few hundred with a cryptic "temporarily
		deferred" error.
	</Lead>

	<Paragraph>
		Nothing is broken, and your authentication is fine. The problem is that your domain is new and not
		yet trusted, which is what the rest of this article is about.
	</Paragraph>

	<Heading level={2}>Why warm-up exists</Heading>

	<Paragraph>
		Mailbox providers maintain reputation scores for every sending domain. A brand-new domain has no
		score, which is worse than having a mediocre one. An unknown sender behaves exactly like a spammer
		who just registered a new domain, and providers can't tell the difference without evidence.
	</Paragraph>

	<Paragraph>
		The evidence they need is sending history: messages that are delivered, opened, and not reported as
		spam. That history has to build over time. You can't provide it all at once, because a sudden flood
		from an unknown domain is itself a spam signal.
	</Paragraph>

	<Paragraph>
		The trap is that the test looks fine. A team ships 50 emails during development, and everything
		lands in the inbox, so they assume production will behave the same way, but it doesn't. The reason
		is that mailbox providers apply different levels of scrutiny at different volumes, so 50 emails from
		an unknown domain are unremarkable, but 50,000 are alarming.
	</Paragraph>

	<Paragraph>
		The consequences depend on how badly you overshoot. Gmail might defer your messages for hours,
		delivering them in slow batches, or your domain might get rate-limited, requiring weeks of
		reduced-volume sending to recover. In the worst case, you land on a blocklist and spend months
		trying to get removed.
	</Paragraph>

	<Heading level={2}>Who needs to warm up</Heading>

	<Paragraph>Not every situation needs a warm-up.</Paragraph>

	<Paragraph><strong>You need a warm-up if:</strong></Paragraph>

	<List>
		<li>
			You're sending from a brand-new domain or subdomain that has never sent email before
		</li>
		<li>
			You're switching email providers and your new provider uses different sending IPs (your domain
			reputation carries over, but IP reputation doesn't)
		</li>
		<li>You're bringing a domain back into use after months of inactivity</li>
		<li>
			You're adding a new subdomain for a separate sending stream (such as splitting transactional
			from marketing)
		</li>
	</List>

	<Paragraph><strong>You probably don't need a warm-up if:</strong></Paragraph>

	<List>
		<li>
			You're switching providers while keeping the same sending IPs (rare, but it happens during
			dedicated IP migrations)
		</li>
		<li>
			You're already sending a steady volume and just adding a few thousand more messages per day
		</li>
		<li>
			You're sending very low volume (under a few hundred emails per day), where the gradual ramp
			would be indistinguishable from normal sending
		</li>
	</List>

	<Paragraph>
		If you're setting up a new domain with <a href="https://docs.lettr.com/learn/domains/sending-domains"
			>Lettr</a
		>, you need to warm up, regardless of how your previous provider was configured. The domain's
		authentication records transfer, but your new sending IPs won't yet have an established reputation.
	</Paragraph>

	<Paragraph>
		This is also the right time to consider whether you should separate transactional and marketing
		email. Each new subdomain you add will need its own warm-up. See <a
				href="/blog/separate-transactional-and-marketing-email"
				>why you should separate transactional and marketing email</a
			> for the full case.
	</Paragraph>

	<Heading level={2}>Dedicated vs. shared IPs</Heading>

	<Paragraph>
		Reputation lives in two places: your domain and the IPs your messages are sent from. Domain
		reputation is yours alone, and it follows you across providers. IP reputation depends on how those
		IPs are used.
	</Paragraph>

	<Paragraph>
		On a shared IP pool, you inherit a reputation built by other senders. That can cut both ways: a
		clean shared pool gives a new domain a head start, while a noisy one drags you down regardless of
		how careful your sending is.
	</Paragraph>

	<Paragraph>
		A dedicated IP is yours alone, but it starts at zero. You're warming up <em>both</em> the domain and
		the IP at the same time. That's slower and more demanding, and it's only worth it once your volume is
		high enough that a shared pool can't protect your reputation from other senders' mistakes.
	</Paragraph>

	<Paragraph>
		The rule of thumb: for fewer than ~100,000 messages per month, shared IPs are usually the right
		choice. Above that, a dedicated IP starts to justify the extra warm-up effort. With Lettr, sending
		IPs are managed for you, so you don't pick the pool, but you still need to warm up the domain.
	</Paragraph>

	<Heading level={2}>What and who to send first</Heading>

	<Paragraph>
		The single most important decision during warm-up is who you send to first. Every signal is
		amplified at this stage. A 2% bounce rate on 100,000 emails is a problem; a 2% bounce rate on your
		first 500 emails is an emergency, because it's the only data the provider has about you. Your early
		sends need to produce strong positive signals: high open rates, low bounce rates, zero complaints.
	</Paragraph>

	<Paragraph>
		Sort your recipient list by engagement and start at the top. The people you want first are the ones
		who opened an email from you in the last 30 days, clicked something recently, or actively use your
		product. They're the most likely to open your messages and the least likely to mark them as spam.
		Work your way down the list as volume increases.
	</Paragraph>

	<Paragraph>
		Do not start with your newest signups. New users have the highest bounce rates (due to typos in
		email addresses and disposable emails) and the lowest engagement (they haven't formed a habit yet).
		And absolutely do not start with a re-engagement campaign targeting users who haven't opened in
		months, as that's the worst possible audience for a new domain.
	</Paragraph>

	<Paragraph>
		<strong>On the content side, stick to your top-performing email types.</strong> Transactional emails
		that people expect and open (order confirmations, account notifications) are ideal. If you're warming
		up a marketing subdomain, use your highest-engagement content rather than a cold re-engagement campaign.
	</Paragraph>

	<Paragraph>
		<strong>Avoid anything that could generate complaints during warm-up.</strong> No re-engagement blasts,
		no aggressive promotions, and nothing for segments you haven't mailed in a while. One bad send in the
		first week can set you back significantly.
	</Paragraph>

	<Heading level={2}>Warm-up schedules</Heading>

	<Paragraph>
		There's no universal schedule because every sender has different volume targets, audience quality,
		and risk tolerance. The principle is always the same: start low, increase gradually, and watch the
		signals. Here are two schedules that serve as starting points. Adjust based on the feedback you see.
	</Paragraph>

	<Heading level={3}>Low-volume senders (target: under 10,000/day)</Heading>

	<Code lang="text" code={lowVolumeSchedule} />

	<Paragraph>
		For low-volume senders, two weeks is usually enough. The ramp may feel slow, but you're building a
		foundation. Rushing to reach target volume three days in saves you nothing if Gmail starts
		deferring everything on day four.
	</Paragraph>

	<Heading level={3}>High-volume senders (target: 50,000+/day)</Heading>

	<Code lang="text" code={highVolumeSchedule} />

	<Paragraph>
		High-volume warm-ups take 4-6 weeks. There's no way to compress this significantly without risking
		throttling or blocks. If your launch timeline doesn't allow a full month of warm-up, start earlier.
		This is one of those things that's easy to plan for and painful to rush.
	</Paragraph>

	<Heading level={2}>The signals to watch</Heading>

	<Paragraph>
		During warm-up, you need to monitor three categories of signals and understand what each one means.
		Set up <a href="https://postmaster.google.com/">Google Postmaster Tools</a> and feedback loops at Yahoo
		and Microsoft before your first send. Without them, you're flying blind throughout the ramp.
	</Paragraph>

	<Heading level={3}>Bounce rate</Heading>

	<Paragraph>
		Track hard bounces (permanent failures, 5xx errors) and soft bounces (temporary failures, 4xx
		errors) separately, as they mean very different things. Hard bounces above 2% on any single send
		indicate poor list quality. In that case, it is best to stop, clean your list, and resume with
		verified addresses. During warm-up, anything above 1% should make you uncomfortable.
	</Paragraph>

	<Paragraph>
		Soft bounces and deferrals during warm-up are normal up to a point. Mailbox providers deliberately
		slow delivery from unknown senders, so a deferral rate of 5-10% in the first few days isn't
		unusual. If the deferral rate is above 20% or persists after the first week, you're ramping too
		fast.
	</Paragraph>

	<Paragraph>
		Lettr reports bounce events via <a href="https://docs.lettr.com/learn/webhooks/introduction"
			>webhooks</a
		> and the <a href="https://docs.lettr.com/learn/events/introduction">events API</a>, categorized by
		type, so you can tell the difference between list quality issues and normal warm-up throttling.
	</Paragraph>

	<Heading level={3}>Complaint rate</Heading>

	<Paragraph>
		This is the most damaging signal. Gmail's published threshold is 0.3% before they take action, but
		during warm-up you should aim for zero, because even a single complaint on a small-volume send has
		an outsized impact.
	</Paragraph>

	<Paragraph>
		If you see complaints during the first week, figure out why immediately. Are you sending to people
		who didn't opt in? Is the content confusing enough to be mistaken for spam? Is the "from" name
		unrecognizable? Fix it before sending more.
	</Paragraph>

	<Heading level={3}>Open and click rates</Heading>

	<Paragraph>
		High open rates during warm-up tell providers your messages are wanted. This is why starting with
		engaged recipients matters so much. If your first few sends achieve 60-70% open rates, you're
		building a strong reputation foundation. If they're at 15%, you're telling Gmail that most people
		who receive your email don't care about it.
	</Paragraph>

	<Heading level={2}>Stop signals</Heading>

	<Paragraph>
		Not everything during warm-up is a normal growing pain. Some signals mean you should pause
		immediately.
	</Paragraph>

	<Paragraph>
		<strong>Hard bounce rate above 5% on a single send.</strong> Your list has serious quality issues. Stop
		sending, remove all bounced addresses, and consider re-verifying your entire list before resuming. Continuing
		to send to invalid addresses during warm-up is the fastest way to get blocked.
	</Paragraph>

	<Paragraph>
		<strong>Complaint rate above 0.3% on any send.</strong> You're past Gmail's threshold. Identify what
		triggered the complaints. If it's a list-quality issue (sending to people who didn't sign up), fix the
		list. If it's a content issue (people don't recognize the sender), fix the "from" name and template.
		Don't resume until you've addressed the root cause.
	</Paragraph>

	<Paragraph>
		<strong>Deferral rate above 30% that isn't decreasing.</strong> Some deferrals are normal in the first
		few days. Persistent high deferrals after a week indicate you've ramped too fast. Drop back to a lower
		volume and stay there for several days before trying to increase again.
	</Paragraph>

	<Paragraph>
		<strong>Postmaster Tools shows a "Bad" reputation.</strong> If Google Postmaster Tools marks your domain
		as "Bad" during warm-up, stop sending to Gmail immediately. Reduce volume dramatically and send only
		to your most engaged Gmail recipients until reputation recovers. This can take 1-2 weeks of reduced sending.
	</Paragraph>

	<Paragraph>
		<strong>Blocklist appearance.</strong> Check whether your domain or sending IP has been listed on a major
		blocklist (Spamhaus, Barracuda, SURBL). If so, pause all sending and work to get delisted before continuing.
		Sending while blocklisted makes everything worse.
	</Paragraph>

	<Callout variant="warning" title="When you hit a stop signal, stop">
		When you hit any of these, the instinct is to push through, but don't. Pausing to fix the problem
		costs you days, while ignoring it and continuing to send costs you weeks or months.
	</Callout>

	<Heading level={2}>Recovering from a botched warm-up</Heading>

	<Paragraph>
		If you've already sent too much too fast and your reputation is damaged, the recovery process looks
		a lot like a warm-up, only slower and more cautious.
	</Paragraph>

	<Paragraph>
		<strong>Drop your volume immediately.</strong> Return to sending a few hundred emails per day, all to
		your most engaged recipients. You need to generate positive signals to counteract the negative ones.
	</Paragraph>

	<Paragraph>
		<strong>Clean your list ruthlessly.</strong> Remove every address that bounced, anyone who complained,
		and anyone who hasn't engaged in 90 days. You should be left with a core audience that reliably opens
		your email.
	</Paragraph>

	<Paragraph>
		<strong>Ramp up even more slowly than a normal warm-up.</strong> While a fresh domain might go from 1,000
		to 5,000 in a week, a damaged domain should take two weeks to reach the same increase. Providers are
		watching you more closely now.
	</Paragraph>

	<Paragraph>
		<strong>Be patient.</strong> Recovery typically takes 2-4 weeks of consistent, good sending. If you were
		added to a blocklist, allow extra time for the delisting process. If Postmaster Tools shows a "Bad"
		reputation, expect at least two weeks of clean sending before it starts to climb back. The frustrating
		part is that there's no way to know exactly when reputation has recovered. You watch the metrics trend
		in the right direction and keep doing what you're doing.
	</Paragraph>

	<Heading level={2}>What to expect from each provider</Heading>

	<Paragraph>
		Gmail, Outlook, and Yahoo each handle unknown senders differently. The framework above applies to
		all three, but understanding the per-provider quirks helps you interpret what you're seeing.
	</Paragraph>

	<Heading level={3}>Gmail</Heading>

	<Paragraph>
		Gmail is the most transparent. They aggressively rate-limit new senders, and you'll see 421
		deferral responses ("try again later") when you exceed their limits. These deferrals are normal and
		decrease as your reputation builds.
	</Paragraph>

	<Paragraph>
		In Postmaster Tools, you want to see your domain reputation climb from "no data" to "Medium" to
		"High" over the warm-up period. The data lags by 1-2 days, so don't expect real-time feedback, but
		check it daily. If your reputation drops to "Low" or "Bad," pause and investigate before sending
		more.
	</Paragraph>

	<Paragraph>
		Gmail also tracks engagement per recipient. Even during warm-up, some users might see your email in
		spam while others see it in their primary inbox, based on their individual interaction history with
		similar senders.
	</Paragraph>

	<Callout variant="tip" title="Set up Postmaster Tools before your first send">
		Google Postmaster Tools is the clearest window into how Gmail sees your domain. Verify it before
		you send a single production email, then check it daily throughout the ramp — the data lags by 1-2
		days, so early visibility matters.
	</Callout>

	<Heading level={3}>Outlook / Microsoft 365</Heading>

	<Paragraph>
		Microsoft is less transparent than Gmail. It doesn't offer an equivalent to Postmaster Tools for
		most senders. What it does have is <a
			href="https://sendersupport.olc.protection.outlook.com/snds/">SNDS (Smart Network Data Services)</a
		>, which provides reputation data for each IP address. On shared IPs, SNDS reflects all senders on
		that IP, not just you, so it's less useful.
	</Paragraph>

	<Paragraph>
		Microsoft tends to be more aggressive with spam filtering during warm-up. While Gmail defers and
		delivers later, Outlook is more likely to silently route messages to Junk. You might see decent
		delivery rates (the server accepted the message) but poor open rates (because everything went to
		spam). If your Outlook opens are significantly lower than Gmail's during warm-up, send to a test
		account to check whether messages are landing in Junk.
	</Paragraph>

	<Paragraph>
		Microsoft also maintains its own blocklist. The delisting process involves submitting a request and
		waiting, sometimes for days. Keeping your early volumes low and your list clean is the best
		prevention.
	</Paragraph>

	<Heading level={3}>Yahoo</Heading>

	<Paragraph>
		Yahoo behaves similarly to Gmail in terms of deferral patterns but provides less tooling. There's
		no public equivalent to Postmaster Tools, so you'll diagnose Yahoo issues mainly through bounce
		codes and delivery timing.
	</Paragraph>

	<Paragraph>
		Yahoo is particularly sensitive to complaint rates. They operate one of the original feedback
		loops, so spam complaints come back quickly if you're registered for FBLs through your email
		provider. Watch these closely during warm-up.
	</Paragraph>

	<Paragraph>
		One Yahoo-specific quirk: they sometimes defer messages with a 421 error that includes the phrase
		"temporarily deferred." This is their rate-limiting mechanism for new senders, not an error in the
		traditional sense. The message will go through eventually, once Yahoo has decided you're not a
		spammer.
	</Paragraph>

	<Heading level={2}>Planning warm-up into your launch timeline</Heading>

	<Paragraph>
		The most practical advice: don't treat warm-up as something you'll figure out at launch time. If
		your product launch or migration is in six weeks, start warm-up now. Three common mistakes:
	</Paragraph>

	<Paragraph>
		<strong>"We'll warm up during our beta."</strong> This only works if the beta generates enough volume.
		Fifty beta users sending 20 emails a day won't meaningfully warm up a domain.
	</Paragraph>

	<Paragraph>
		<strong>"We'll send a test batch the week before launch."</strong> One batch doesn't build a reputation.
		Warm-up requires sustained daily sending over weeks.
	</Paragraph>

	<Paragraph>
		<strong>"We'll start with our full list and see what happens."</strong> This is how most botched warm-ups
		happen. By the time you see what happens, the damage is done.
	</Paragraph>

	<Paragraph>
		Build warm-up into your project timeline the same way you'd include QA or a staging deployment. It's
		not optional and can't be compressed much. A realistic warm-up adds 2-4 weeks for low-volume
		senders and 4-6 weeks for high-volume senders.
	</Paragraph>

	<Divider />

	<Paragraph>
		If you're using <a href="https://docs.lettr.com/learn/domains/sending-domains">Lettr</a>, domain authentication
		is verified during setup, eliminating one common source of warm-up problems: broken SPF or DKIM records
		that cause authentication failures on your first sends.
	</Paragraph>

	<Paragraph>
		Bounce and complaint events stream through <a
			href="https://docs.lettr.com/learn/webhooks/introduction">webhooks</a
		> in real time, so you can catch ramp problems within minutes instead of days. But the warm-up itself
		is still on you, and no email provider can skip it.
	</Paragraph>
</BlogPost>
