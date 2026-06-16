<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		TldrList,
		Quote,
		Callout,
		Divider
	} from '$lib/components/blog';
</script>

<BlogPost
	category="Deliverability"
	title="Why you should separate transactional and marketing email"
	excerpt="Why transactional and marketing email belong on separate subdomains: how shared sender reputation lets a marketing campaign drag 2FA codes into spam, how to classify the gray-area emails that sit between the two, and what the legal rules add on top."
	metaDescription="Why transactional and marketing email belong on separate subdomains, how shared reputation drags 2FA codes into spam, and how to classify gray-area mail."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="April 8, 2026"
	datetime="2026-04-08"
	readTime="5 min read"
	slug="separate-transactional-and-marketing-email"
>
	<Lead>
		A password reset and a weekly newsletter have almost nothing in common: different audiences,
		expectations, legal requirements, and engagement patterns. However, sending both from the same domain ties
		their fates together, which is how a marketing campaign can push transactional emails into spam.
	</Lead>

	<Paragraph>
		The most critical email a business cannot afford to lose is transactional, such as password resets, 2FA codes, receipts, and messages that users are actively awaiting. Marketing emails are sent in bulk to recipients who never requested them. Sharing a domain means the reputation of the transactional emails depends on the behavior of the marketing messages.
	</Paragraph>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>One domain means one reputation</strong>: marketing complaints drag down the transactional
				email users depend on.
			</li>
			<li>
				<strong>Separate subdomains separate reputations</strong>, each with its own authentication and
				sender history, so a bad campaign stays contained.
			</li>
			<li><strong>Some emails sit on the line</strong>; when in doubt, treat an email as marketing.</li>
		</TldrList>
	</Callout>

	<Heading level={2}>The problem with one domain</Heading>

	<Paragraph>
		Everything sent from <code>yourapp.com</code> shares <strong>the same sender reputation</strong>.
		Mailbox providers like Gmail don't distinguish a password reset from a product announcement by
		category; they see one domain and judge it as a whole.
	</Paragraph>

	<Paragraph>
		Marketing email runs <strong>lower engagement and higher complaint rates</strong> than
		transactional email. Open rates of 20-25% are healthy for marketing, but for
		transactional anything below 50% signals a problem. On a shared domain, the marketing numbers drag
		down the overall reputation.
	</Paragraph>

	<Paragraph>
		A 0.2% complaint rate on a promotional campaign is enough to make Gmail suspicious of the whole
		domain, which pushes order confirmations into Promotions and verification codes into spam.
		<strong>No alert fires when this happens</strong>, so the problem usually surfaces only after
		delivery has already degraded.
	</Paragraph>

	<Heading level={2}>How subdomain separation works</Heading>

	<Paragraph>
		The fix is to give each email type <strong>its own subdomain</strong>:
		<code>mail.yourapp.com</code> for transactional emails and <code>news.yourapp.com</code> (or
		<code>marketing.yourapp.com</code>) for campaigns.
	</Paragraph>

	<Paragraph>
		Each subdomain then <strong>builds its own reputation</strong>, and Gmail treats
		<code>mail.yourapp.com</code> and <code>news.yourapp.com</code> as separate senders with separate
		histories. A complaint spike on the marketing subdomain no longer touches the transactional
		reputation, so password resets keep reaching the inbox regardless of how the marketing subdomain
		is performing.
	</Paragraph>

	<Paragraph>
		Setup means <strong>configuring SPF, DKIM, and DMARC for each subdomain independently</strong>. That sounds like
		double the work, but in practice it's a second set of DNS records. Lettr supports
		<a href="https://docs.lettr.com/learn/domains/sending-domains">multiple sending domains</a>, each
		with its own authentication and reputation.
	</Paragraph>

	<Paragraph>A common setup splits the two streams like this:</Paragraph>

	<List>
		<li>
			<strong><code>mail.yourapp.com</code></strong> for password resets, verification codes, receipts,
			and 2FA.
		</li>
		<li>
			<strong><code>news.yourapp.com</code></strong> for newsletters, product updates, and feature
			announcements.
		</li>
	</List>

	<Paragraph>
		Once each subdomain is sending, register both in
		<a href="https://postmaster.google.com/">Google Postmaster Tools</a> and watch their reputations
		diverge. The dashboards report <strong>per-domain spam rate, IP reputation, and auth pass rate</strong>.
	</Paragraph>

	<Heading level={2}>The gray areas</Heading>

	<Paragraph>
		Not every email lands cleanly in "transactional" or "marketing." A handful of common types sit on
		the line:
	</Paragraph>

	<List>
		<li>
			<strong>Onboarding sequences.</strong> The welcome email is transactional; the day-three drip
			pitching unused features is marketing.
		</li>
		<li>
			<strong>Review requests.</strong> "How was your recent purchase?" is triggered by a user action
			but exists to drive engagement, so it counts as marketing.
		</li>
		<li>
			<strong>Activity digests.</strong> A weekly summary fires on a schedule, not a user action, which
			makes it marketing and means it needs an unsubscribe link.
		</li>
		<li>
			<strong>Renewal notices.</strong> "Your subscription expires in 3 days" is transactional; bolt on
			"here's 20% to come back" and the discount turns it into marketing.
		</li>
		<li>
			<strong>Shipping updates.</strong> "Your package shipped" is transactional until product
			recommendations under the tracking number push it into marketing.
		</li>
	</List>

	<Paragraph>
		<strong>When in doubt, treat it as marketing.</strong> The downside of routing a borderline email
		through marketing is slightly lower open rates. The downside of routing it through transactional
		and having it generate complaints is damage to the reputation of the emails users actually depend
		on.
	</Paragraph>

	<Heading level={2}>The legal reinforcement</Heading>

	<Paragraph>
		Transactional and marketing emails are governed
		by different legal rules, and mixing them creates compliance risk on top of inbox placement
		risk.
	</Paragraph>

	<Paragraph>
		Under <strong>CAN-SPAM</strong>, transactional emails are <strong>largely exempt from opt-out requirements</strong>:
		a password reset needs no unsubscribe link. Marketing emails do require one, and the FTC has
		<a href="https://www.ftc.gov/legal-library/browse/cases-proceedings?search_api_fulltext=can-spam">fined companies</a>
		for noncompliance.
	</Paragraph>

	<Paragraph>
		<strong>GDPR</strong> treats transactional email as <strong>necessary for contract performance</strong>: a purchase
		earns a receipt without separate consent. Marketing emails require explicit opt-in consent that
		recipients can withdraw at any time. Canada's CASL has similar carve-outs for transactional
		messages tied to an existing business relationship.
	</Paragraph>

	<Paragraph>
		<strong>Gmail</strong> is particularly aggressive here. Its filters evaluate <strong>content signals, not internal
		categorization</strong>. A transactional email that looks promotional gets treated as promotional,
		regardless of what triggered the send.
	</Paragraph>

	<Callout variant="info" title="The safe default">
		Keep transactional emails to a single purpose per message. Cross-sells belong in a separate email
		sent through the marketing subdomain, with proper consent and unsubscribe handling.
	</Callout>

	<Heading level={2}>Where to start</Heading>

	<Paragraph>
		Separating the two streams is a <strong>structural decision, not a deliverability tactic</strong>.
		Any product that sends both password resets and newsletters benefits from putting them on
		different subdomains from the start, so a marketing campaign can never reach the reputation the
		transactional email depends on.
	</Paragraph>

	<Paragraph>
		Lettr is built around separate sending domains, each with its own authentication and reputation.
		<a href="https://app.lettr.com/register">Create a free account</a> to set transactional and
		marketing email apart.
	</Paragraph>
</BlogPost>
