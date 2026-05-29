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

	const subdomainMapping = `mail.yourapp.com     → password resets, verification codes, receipts, 2FA
news.yourapp.com     → newsletters, product updates, feature announcements`;
</script>

<BlogPost
	category="Deliverability"
	title="Why you should separate transactional and marketing email"
	excerpt="Your password reset and your weekly newsletter have almost nothing in common — yet most teams send both from the same domain, then wonder why 2FA codes hit spam after a campaign goes sideways."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="April 8, 2026"
	datetime="2026-04-08"
	readTime="7 min read"
	slug="separate-transactional-and-marketing-email"
>
	<Lead>
		Your password reset and your weekly newsletter have almost nothing in common: different
		audiences, expectations, legal requirements, and engagement patterns. But most teams send them
		from the same domain and through the same infrastructure, then wonder why 2FA codes end up in
		spam after a marketing campaign goes sideways.
	</Lead>

	<Paragraph>
		We've seen this play out more than once. A team sends a re-engagement campaign to users who
		haven't opened an email in the past 6 months. Complaints spike, and within a week, the
		transactional delivery rate drops. These two events don't seem connected unless you know to link
		them. By the time you're investigating why users can't log in, the real issue is a promotional
		email about a feature launch nobody requested.
	</Paragraph>

	<Heading level={2}>The problem with one domain</Heading>

	<Paragraph>
		When you send everything from <code>yourapp.com</code>, every message shares the same sender
		reputation. Mailbox providers like Gmail don't know or care that your password reset and your
		product announcement are different categories. They see one domain and judge it as a whole.
	</Paragraph>

	<Paragraph>
		Marketing email, by nature, has lower engagement and higher complaint rates than transactional
		email. People ignore newsletters. They mark them as spam instead of unsubscribing because it's
		one click instead of two. Open rates of 20-25% are healthy for marketing, but for transactional,
		anything below 50% indicates a problem. When both types share a domain, the marketing numbers
		drag down the overall reputation.
	</Paragraph>

	<Paragraph>
		A promotional campaign with a 0.2% complaint rate sounds harmless, but it's enough to make Gmail
		suspicious of everything you send. Order confirmations suddenly drift into Promotions, and
		verification codes land in spam. There's no alert when this happens, and most developers find out
		something is wrong only after it's already too late.
	</Paragraph>

	<Heading level={2}>How subdomain separation works</Heading>

	<Paragraph>
		The fix is straightforward: use separate subdomains for each email type. For example, use
		<code>mail.yourapp.com</code> for transactional emails and <code>news.yourapp.com</code> or
		<code>marketing.yourapp.com</code> for campaigns.
	</Paragraph>

	<Paragraph>
		This way, each subdomain builds its own reputation with mailbox providers, and Gmail treats
		<code>mail.yourapp.com</code> and <code>news.yourapp.com</code> as separate senders with separate
		histories. As a result, a spike in complaints on your marketing subdomain doesn't affect your
		transactional reputation. Password resets still land in the inbox even when your newsletter is
		having a bad week.
	</Paragraph>

	<Paragraph>
		Setup means configuring SPF, DKIM, and DMARC for each subdomain independently. That sounds like
		double the work, but in practice, it's a second set of DNS records. Lettr lets you
		<a href="https://docs.lettr.com/learn/domains/sending-domains">configure multiple sending domains</a>,
		each with its own authentication and reputation.
	</Paragraph>

	<Paragraph>A common setup looks like this:</Paragraph>

	<Code lang="text" code={subdomainMapping} />

	<Paragraph>
		Once each subdomain is sending, register both in
		<a href="https://postmaster.google.com/">Google Postmaster Tools</a> and watch their reputations
		as they diverge. The dashboards report per-domain spam rate, IP reputation, and auth pass rate.
	</Paragraph>

	<Paragraph>
		Some teams add a third subdomain for onboarding drips, which sit between transactional and
		marketing in terms of engagement. Whether you need it depends on volume. If onboarding is a few
		thousand emails per month, bundling with marketing is fine. If it's a significant share of your
		sending, a dedicated subdomain lets you monitor its reputation independently.
	</Paragraph>

	<Heading level={2}>The gray areas</Heading>

	<Paragraph>
		Not every email easily falls into the categories of "transactional" or "marketing." A few common
		ones tend to confuse people.
	</Paragraph>

	<Heading level={3}>Onboarding sequences</Heading>

	<Paragraph>
		A welcome email sent immediately after signup feels transactional. The third email in a drip
		series, sent three days later and explaining features the user hasn't tried yet, feels more like
		marketing. The line shifts as the sequence progresses. The first message or two can go through
		transactional. Anything after that should go through marketing.
	</Paragraph>

	<Heading level={3}>Review requests</Heading>

	<Paragraph>
		"How was your recent purchase?" emails are triggered by a user action (buying something) and are
		intended to drive engagement, not to provide information. Most providers and regulators treat
		these emails as marketing. Send them through your marketing subdomain.
	</Paragraph>

	<Heading level={3}>Account activity digests</Heading>

	<Paragraph>
		A weekly summary of activity in your app is triggered automatically, not by a specific user
		action. These are closer to marketing than to transactional messages. They should include an
		unsubscribe option and be part of your marketing stream.
	</Paragraph>

	<Heading level={3}>Renewal and expiration notices</Heading>

	<Paragraph>
		"Your subscription expires in 3 days" is transactional. "Your subscription expired. Here's a 20%
		discount to come back" is marketing with a transactional wrapper. The discount makes it
		promotional.
	</Paragraph>

	<Heading level={3}>Shipping and delivery updates</Heading>

	<Paragraph>
		Clearly transactional. "Your package shipped" belongs in the transactional stream. But if you add
		product recommendations below the tracking number, you're drifting into promotional territory for
		both filters and regulators.
	</Paragraph>

	<Heading level={3}>When in doubt, consider it marketing</Heading>

	<Paragraph>
		Reason is simple: the downside of sending a borderline email through marketing is slightly lower
		open rates. The downside of sending it through transactional and having it generate complaints is
		damage to the reputation of the emails your users actually depend on.
	</Paragraph>

	<Heading level={2}>Auditing your current setup</Heading>

	<Paragraph>
		If you're already sending email and haven't separated streams, start by figuring out what you're
		actually working with.
	</Paragraph>

	<List>
		<li>
			<strong>List every email your application sends.</strong> Not just the ones you remember building.
			Grep your codebase for every call to your email service. Check your provider's dashboard for message
			types or tags. If you have them, pull SMTP logs. Most teams discover emails they had forgotten
			about during this step.
		</li>
		<li>
			<strong>Classify each one.</strong> Ask two questions: Was this triggered by a specific user action?
			Does the user need this information to complete what they started? If both are yes, it's transactional.
			If either is no, it's marketing. For gray areas, apply the "when in doubt, consider it marketing"
			rule.
		</li>
		<li>
			<strong>Check your DNS.</strong> Run <code>dig TXT yourapp.com</code> to review your SPF, DKIM,
			and DMARC records. If you're sending everything from the root domain, you'll see a single set of
			records. Note which services are authorized in your SPF record, as you'll need equivalent records
			for the new subdomains.
		</li>
		<li>
			<strong>Check complaint and bounce rates by email type.</strong> Lettr surfaces these via
			<a href="https://docs.lettr.com/learn/webhooks/introduction">webhooks</a> and the
			<a href="https://docs.lettr.com/learn/events/introduction">events API</a>. Your overall bounce
			rate may look healthy even when one specific campaign is responsible for most of the damage. The
			whole-domain average hides this.
		</li>
		<li>
			<strong>Set up Postmaster Tools and feedback loops.</strong> Postmaster shows Gmail's view of your
			domain, including spam rate, reputation, and auth. Feedback loops at Yahoo and Microsoft forward
			complaints so you can automatically suppress complainers. Without these signals, you're flying blind
			whether or not the streams are separated.
		</li>
	</List>

	<Heading level={2}>Migrating to separated streams</Heading>

	<Paragraph>
		It is important not to do this all at once. A gradual migration is safer and easier to debug.
	</Paragraph>

	<List ordered>
		<li>
			<strong>Set up your subdomains.</strong> Create DNS records for <code>mail.yourapp.com</code> and
			<code>news.yourapp.com</code>, and configure SPF, DKIM, and DMARC for each. Lettr
			<a href="https://docs.lettr.com/learn/domains/sending-domains">verifies domain authentication</a>
			during setup, so you'll know immediately if anything is misconfigured.
		</li>
		<li>
			<strong>Audit your <code>From</code> addresses now, not later.</strong> Every email template must
			use the correct subdomain in its <code>From</code> header. A password reset sent "from" your marketing
			subdomain defeats the purpose. This step is easy to forget once migration is underway, so do it before
			you flip traffic and check again afterward.
		</li>
		<li>
			<strong>Move transactional first.</strong> Move your most critical messages (password resets, verification
			codes, 2FA) to the transactional subdomain first. These are the emails where delivery failures have
			the most impact, so you want them isolated and monitored before you touch anything else.
		</li>
		<li>
			<strong>Warm up the new subdomains.</strong> Brand-new subdomains have no reputation history. Mailbox
			providers treat them with suspicion until they build a track record. Start at a low volume and scale
			up over one to two weeks. Don't migrate your highest-volume email types on day one.
		</li>
		<li>
			<strong>Move marketing email.</strong> Once transactional is stable, route marketing emails through
			<code>news.yourapp.com</code>. Start with smaller campaigns and ramp up. If your marketing was dragging
			the shared domain down, you may see transactional delivery improve after the split.
		</li>
		<li>
			<strong>Monitor both streams independently.</strong> The key point is that each stream has its own
			health metrics. Track bounce, complaint, and open rates per subdomain. A problem in one stream should
			be visible without noise from the other.
		</li>
	</List>

	<Heading level={2}>The legal reinforcement</Heading>

	<Paragraph>
		Separation isn't only a deliverability decision. Transactional and marketing emails are governed
		by different legal rules, and mixing them creates compliance risk on top of inbox placement
		risk.
	</Paragraph>

	<Paragraph>
		Under CAN-SPAM, transactional emails are largely exempt from opt-out requirements. You don't need
		an unsubscribe link in a password reset. Marketing emails require one, and the FTC has
		<a href="https://www.ftc.gov/legal-library/browse/cases-proceedings?search_api_fulltext=can-spam">fined companies</a>
		for noncompliance.
	</Paragraph>

	<Paragraph>
		GDPR treats transactional email as necessary for contract performance: you bought something, so
		you get a receipt, and no separate consent is needed. Marketing emails require explicit opt-in
		consent, and recipients can withdraw at any time. Canada's CASL has similar carve-outs for
		transactional messages tied to an existing business relationship.
	</Paragraph>

	<Paragraph>
		Gmail is particularly aggressive here. Its filters evaluate content signals, not your internal
		categorization. If your transactional email looks promotional, Gmail treats it as promotional,
		regardless of what triggered the send.
	</Paragraph>

	<Callout variant="info" title="The safe default">
		Keep transactional emails focused on a single purpose per message. If you want to cross-sell, do
		so in a separate email sent through the marketing subdomain, with proper consent and unsubscribe
		handling.
	</Callout>

	<Heading level={2}>What a well-separated setup looks like</Heading>

	<Paragraph>
		Once you've migrated, each subdomain has its own SPF, DKIM, and DMARC records, builds reputation
		independently, and a problem in one subdomain stays contained.
	</Paragraph>

	<Paragraph>
		Transactional should have near-zero complaints because every email in it was directly triggered
		by a user action. If your transactional complaint rate is above 0.01%, you likely have a
		classification problem: something in that stream is actually marketing.
	</Paragraph>

	<Paragraph>
		Marketing will naturally receive more complaints and have lower engagement. That's fine. Those
		numbers don't affect your transactional delivery, which is the whole reason you separated them.
	</Paragraph>

	<Heading level={2}>The cost of not doing this</Heading>

	<Paragraph>
		Separation takes a few hours to configure and a week or two to migrate. Skipping it has no
		immediate cost, which is why most teams don't bother until something breaks. The asymmetry lies
		in recovery: once a shared domain's reputation drops, there's no shortcut back. You earn it back
		through weeks of consistent good behavior at a lower volume.
	</Paragraph>

	<Paragraph>
		In the meantime, some of your transactional email ends up in spam. Users can't log in, verify
		accounts, or view receipts, and support tickets pile up while reputation slowly recovers. The fix
		is two subdomains and two sets of DNS records, set up before you ever need them.
	</Paragraph>

	<Divider />

	<Paragraph>
		If you're using <a href="https://lettr.com">Lettr</a>, multiple sending domains are supported out
		of the box. DNS verification typically completes in under five minutes once your records
		propagate.
	</Paragraph>
</BlogPost>
