<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		TldrList,
		Callout,
		Divider
	} from '$lib/components/blog';
</script>

<BlogPost
	category="Deliverability"
	title="How to warm up a new sending domain"
	excerpt="How to build sending reputation on a new domain by ramping volume gradually: who needs a warm-up, which recipients and content to send first, two sample ramp schedules, the bounce and complaint signals to watch, and the stop signals that mean pause immediately."
	metaDescription="How to warm up a new sending domain by ramping volume gradually: who needs it, what to send first, sample ramp schedules, and the signals to watch."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="April 22, 2026"
	datetime="2026-04-22"
	readTime="6 min read"
	slug="how-to-warm-up-a-sending-domain"
>
	<Lead>
		Warming up a sending domain means raising its daily volume gradually so mailbox providers can build
		a reputation for it before it sends at full scale. A brand-new domain with correct SPF, DKIM, and
		DMARC can still see half its first large batch deferred or filtered, because correct authentication
		proves who is sending, not that the sender is trusted.
	</Lead>

	<Paragraph>
		That trust is the part no setup checklist covers, and it cannot be configured. It has to be earned,
		by sending in a way that gives mailbox providers a reason to deliver. This article is about how to do
		that without tripping a spam filter on the way: who needs a warm-up, which recipients and content to
		send first, how fast to ramp, and which signals mean keep going or stop.
	</Paragraph>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>A new domain has no reputation</strong>, which reads to providers like a spammer who just
				registered.
			</li>
			<li>
				<strong>Reputation is built gradually</strong>: ramp from a few hundred emails a day over two to six
				weeks.
			</li>
			<li>
				<strong>The first sends matter most</strong>: most-engaged recipients only, and pause on any stop
				signal.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>Why warm-up exists</Heading>

	<Paragraph>
		Mailbox providers maintain reputation scores for every sending domain, and <strong>a brand-new
		domain has no score, which is worse than having a mediocre one</strong>. An unknown sender behaves
		exactly like a spammer who just registered a new domain, and providers cannot tell the difference
		without evidence.
	</Paragraph>

	<Paragraph>
		The evidence they need is <strong>sending history</strong>: messages that are delivered, opened, and
		not reported as spam. That history has to build over time, because a sudden flood from an unknown
		domain is itself a spam signal. Fifty emails sent during development all land in the inbox, while
		fifty thousand from the same new domain are alarming, and overshooting earns deferrals, rate-limiting,
		or in the worst case a blocklist that takes months to get removed from.
	</Paragraph>

	<Heading level={2}>Who needs to warm up</Heading>

	<Paragraph>
		Not every situation needs a warm-up, and the deciding factor is whether the sending IPs already
		carry a reputation. <strong>A warm-up is needed whenever the IPs start at zero</strong>:
	</Paragraph>

	<List>
		<li>A brand-new domain or subdomain that has never sent email before.</li>
		<li>
			A provider switch where the new provider sends from different IPs. Domain reputation carries
			over, IP reputation does not.
		</li>
		<li>A domain coming back into use after months of inactivity.</li>
		<li>
			A new subdomain for a separate sending stream, such as splitting transactional from marketing.
		</li>
	</List>

	<Paragraph>
		The warm-up is <strong>usually skippable when the reputation already exists or the volume is
		negligible</strong>: a provider switch that keeps the same sending IPs (rare, mostly during
		dedicated IP migrations), a steady sender adding only a few thousand messages a day, or a very
		low-volume sender under a few hundred emails a day, where a gradual ramp is indistinguishable from
		normal sending.
	</Paragraph>

	<Paragraph>
		A new domain on <a href="https://docs.lettr.com/learn/domains/sending-domains">Lettr</a> always needs
		a warm-up, regardless of the previous provider. The authentication records transfer, but the new sending
		IPs have no established reputation yet, and <strong>each new subdomain needs its own warm-up</strong>
		(one reason to <a href="/blog/separate-transactional-and-marketing-email/">separate transactional and
		marketing email</a> from the start).
	</Paragraph>

	<Heading level={2}>What and who to send first</Heading>

	<Paragraph>
		The single most important decision during warm-up is <strong>who receives the first sends</strong>.
		Every signal is amplified at this stage. A 2% bounce rate on 100,000 emails is a problem; a 2% bounce
		rate on the first 500 is an emergency, because it is the only data the provider has. The early sends
		need to produce strong positive signals: high open rates, low bounce rates, zero complaints.
	</Paragraph>

	<Paragraph>
		Sort the recipient list by engagement and start at the top. The first batch should go to the people
		<strong>who opened a recent email</strong>, <strong>clicked something lately</strong>, or <strong>actively use the product</strong>. They are the most
		likely to open and the least likely to mark a message as spam. The rest of the list comes in as
		volume increases.
	</Paragraph>

	<Paragraph>
		<strong>The newest signups are the wrong place to start.</strong> New users have the highest bounce
		rates (typos and disposable addresses) and the lowest engagement (no habit formed yet). The worst
		audience of all is a re-engagement campaign aimed at users who have not opened in months.
	</Paragraph>

	<Paragraph>
		On the content side, <strong>the top-performing email types are the safest.</strong> Transactional
		emails that people expect and open (order confirmations, account notifications) are ideal. A marketing
		subdomain should warm up on its highest-engagement content, never a cold re-engagement campaign.
	</Paragraph>

	<Paragraph>
		<strong>Anything that could generate complaints stays off the schedule during warm-up.</strong> No
		re-engagement blasts, no aggressive promotions, nothing aimed at segments left untouched for a while.
		One bad send in the first week can set the domain back significantly.
	</Paragraph>

	<Heading level={2}>Warm-up schedules</Heading>

	<Paragraph>
		There is no universal schedule, because every sender has different volume targets, audience quality,
		and risk tolerance. The principle is always the same: <strong>start low, increase gradually, and
		watch the signals</strong>. The two schedules below are starting points to adjust against the
		feedback each send produces.
	</Paragraph>

	<Heading level={3}>Low-volume senders (target: under 10,000/day)</Heading>

	<table>
		<thead>
			<tr>
				<th>Day</th>
				<th>Daily volume</th>
				<th>Notes</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1-2</td>
				<td>100-200</td>
				<td>Most engaged recipients only</td>
			</tr>
			<tr>
				<td>3-4</td>
				<td>500</td>
				<td>Monitor bounce and complaint rates</td>
			</tr>
			<tr>
				<td>5-7</td>
				<td>1,000</td>
				<td>Check Postmaster Tools if sending to Gmail</td>
			</tr>
			<tr>
				<td>8-10</td>
				<td>2,500</td>
				<td></td>
			</tr>
			<tr>
				<td>11-14</td>
				<td>5,000</td>
				<td></td>
			</tr>
			<tr>
				<td>15+</td>
				<td>Target volume</td>
				<td>Maintain steady sending from here</td>
			</tr>
		</tbody>
	</table>

	<Paragraph>
		For low-volume senders, <strong>two weeks is usually enough</strong>. The ramp feels slow, but it is
		building a foundation. Reaching target volume three days in saves nothing if Gmail starts deferring
		everything on day four.
	</Paragraph>

	<Heading level={3}>High-volume senders (target: 50,000+/day)</Heading>

	<table>
		<thead>
			<tr>
				<th>Week</th>
				<th>Daily volume</th>
				<th>Notes</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>1,000-2,000</td>
				<td>Most engaged recipients, monitor everything</td>
			</tr>
			<tr>
				<td>2</td>
				<td>5,000-10,000</td>
				<td>Review Postmaster Tools, check deferral rates</td>
			</tr>
			<tr>
				<td>3</td>
				<td>15,000-25,000</td>
				<td>Expand to moderately engaged recipients</td>
			</tr>
			<tr>
				<td>4</td>
				<td>30,000-50,000</td>
				<td></td>
			</tr>
			<tr>
				<td>5-6</td>
				<td>50,000-100,000</td>
				<td>Approach target volume</td>
			</tr>
			<tr>
				<td>6+</td>
				<td>Target volume</td>
				<td></td>
			</tr>
		</tbody>
	</table>

	<Paragraph>
		High-volume warm-ups take <strong>four to six weeks</strong>, with no way to compress that
		significantly without risking throttling or blocks. A launch timeline that does not leave a full
		month for the ramp needs to start earlier. This is easy to plan for and painful to rush.
	</Paragraph>

	<Heading level={2}>The signals to watch</Heading>

	<Paragraph>
		Warm-up depends on monitoring <strong>three categories of signal</strong> and knowing what each one
		means. Set up <a href="https://postmaster.google.com/">Google Postmaster Tools</a> and feedback loops
		at Yahoo and Microsoft before the first send. Without them, the entire ramp runs blind.
	</Paragraph>

	<Heading level={3}>Bounce rate</Heading>

	<Paragraph>
		Track <strong>hard bounces (permanent, 5xx) and soft bounces (temporary, 4xx) separately</strong>,
		because they mean very different things. Hard bounces above 2% on any single send indicate poor list
		quality, and the right response is to stop, clean the list, and resume with verified addresses.
		During warm-up, anything above 1% is cause for concern.
	</Paragraph>

	<Paragraph>
		Soft bounces and deferrals are normal during warm-up, up to a point. Mailbox providers deliberately
		slow delivery from unknown senders, so a <strong>deferral rate of 5-10% in the first few days</strong>
		is unremarkable. A deferral rate above 20%, or one that persists past the first week, means the ramp
		is too fast.
	</Paragraph>

	<Heading level={3}>Complaint rate</Heading>

	<Paragraph>
		This is <strong>the most damaging signal</strong>. Gmail's published threshold is 0.3% before it
		takes action, but the warm-up target is zero, because even a single complaint on a small-volume send
		has an outsized impact.
	</Paragraph>

	<Paragraph>
		Complaints in the first week need an immediate diagnosis. The usual causes are recipients who never
		opted in, content confusing enough to be mistaken for spam, or an unrecognizable "from" name. Fix the
		cause before sending more.
	</Paragraph>

	<Heading level={3}>Open and click rates</Heading>

	<Paragraph>
		High open rates tell providers the messages are wanted, which is why the first sends go to engaged
		recipients. <strong>First sends at 60-70% open rates build a strong reputation foundation; first
		sends at 15% tell Gmail that most recipients do not care.</strong>
	</Paragraph>

	<Heading level={2}>Stop signals</Heading>

	<Paragraph>
		Not everything during warm-up is a normal growing pain. <strong>Five signals call for an immediate
		pause</strong>, not a push-through:
	</Paragraph>

	<List>
		<li>
			<strong>Hard bounce rate above 5% on a single send.</strong> The list has serious quality issues.
			Stop sending, remove every bounced address, and consider re-verifying the whole list before resuming.
			Continuing to send to invalid addresses during warm-up is the fastest way to get blocked.
		</li>
		<li>
			<strong>Complaint rate above 0.3% on any send.</strong> This is past Gmail's threshold. A
			list-quality cause (recipients who never signed up) needs the list fixed; a content cause (an
			unrecognized sender) needs the "from" name and template fixed. Do not resume until the root cause is
			addressed.
		</li>
		<li>
			<strong>Deferral rate above 30% that is not decreasing.</strong> Some deferrals are normal in the
			first few days, but persistent high deferrals after a week mean the ramp moved too fast. Drop back to
			a lower volume and hold there for several days before increasing again.
		</li>
		<li>
			<strong>Postmaster Tools shows a "Bad" reputation.</strong> Stop sending to Gmail immediately, reduce
			volume dramatically, and send only to the most engaged Gmail recipients until reputation recovers.
			This can take one to two weeks of reduced sending.
		</li>
		<li>
			<strong>Blocklist appearance.</strong> Check whether the domain or sending IP has landed on a major
			blocklist (Spamhaus, Barracuda, SURBL). If so, pause all sending and work to get delisted first.
			Sending while blocklisted makes everything worse.
		</li>
	</List>

	<Callout variant="warning" title="When a stop signal hits, stop">
		The instinct on hitting any of these is to push through. Resist it. Pausing to fix the problem costs
		days; ignoring it and continuing to send costs weeks or months.
	</Callout>

	<Heading level={2}>What warming up actually buys you</Heading>

	<Paragraph>
		One idea sits under every rule here: <strong>a warm-up is the sender proving, gradually, that volume
		from this domain is wanted</strong>. A slow ramp is not wasted time. Reputation is the one part of an
		email stack that cannot be provisioned on demand, which is why it has to be scheduled rather than
		rushed at launch.
	</Paragraph>

	<Paragraph>
		On <a href="https://docs.lettr.com/learn/domains/sending-domains">Lettr</a>, authentication is
		verified during setup and bounce and complaint events stream through <a
			href="https://docs.lettr.com/learn/webhooks/introduction">webhooks</a
		> in real time, so a bad ramp surfaces in minutes instead of days — part of Lettr's
		<a href="/platform/deliverability/">deliverability tooling</a>. <a href="https://app.lettr.com/register">Create a free account</a> and verify a
		domain before the next launch needs it.
	</Paragraph>
</BlogPost>
