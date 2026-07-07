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
	category="Fundamentals"
	title="Best transactional email services in 2026, compared"
	excerpt="A comparison of nine transactional email services (Lettr, Postmark, SendGrid, Mailgun, Amazon SES, Resend, MailerSend, Brevo, SMTP2GO): current free tiers, pricing at 50,000 and 100,000 emails a month, deliverability track records, and which service fits which use case."
	metaDescription="Nine transactional email services compared on free tiers, pricing at 50k and 100k emails a month, deliverability, and features, with a pick per use case."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="June 29, 2026"
	datetime="2026-06-29"
	readTime="11 min read"
	slug="best-transactional-email-services"
>
	<Lead>
		A transactional email service sends the messages an application triggers for one recipient at
		a time (password resets, receipts, verification codes) through infrastructure with an
		established sending reputation, and reports back what happened to each one. The market moved a
		lot in the last two years: SendGrid retired its free plan in 2025, SparkPost disappeared into
		Bird, and several providers repriced. This comparison covers nine services with their current
		pricing, what each is genuinely good at, and where each falls short.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Amazon SES is the cheapest and the most work</strong>: roughly $10 a month at
				100,000 emails, with bounce handling, analytics, and templates left for you to build.
			</li>
			<li>
				<strong>Postmark has the strongest deliverability track record and the highest per-email
				price</strong> among mainstream providers, at roughly $134 a month for 100,000 emails.
			</li>
			<li>
				<strong>A broad middle tier costs a third of Postmark</strong>: Lettr ($30), Resend ($35),
				and SendGrid ($34.95) all cover 100,000 emails a month; the differences are analytics
				depth, template tooling, and support.
			</li>
		</TldrList>
	</Callout>

	<Paragraph>
		One disclosure up front: Lettr is our product, so its entry below is the vendor's own case.
		Every price and test result for the other eight comes from their public pricing pages and
		named third-party tests, checked in July 2026.
	</Paragraph>

	<Heading level={2}>What to compare before the price</Heading>

	<Paragraph>
		The nine services below all do the same basic job: accept a message over a REST API or SMTP
		relay and deliver it. The differences that matter in production are less visible than the
		price:
	</Paragraph>

	<List>
		<li>
			<strong>Traffic separation.</strong> Whether transactional mail shares IP pools with
			marketing blasts. Shared pools mean someone else's campaign can affect your password
			resets; separated streams (Postmark's Message Streams, Lettr's transactional and marketing
			streams) contain the damage.
		</li>
		<li>
			<strong>Analytics granularity and retention.</strong> Per-email event history versus
			aggregate counters, and for how long. Retention is a hidden pricing lever: Mailgun keeps
			logs 1 to 30 days depending on plan, MailerSend 24 hours on its free tier, Postmark 45 days
			by default.
		</li>
		<li>
			<strong>Template tooling.</strong> Bring-your-own-HTML (SES), templates-in-code (Resend), or
			a visual builder (Lettr, MailerSend, Brevo). This decides whether a copy change needs a
			deploy.
		</li>
		<li>
			<strong>Support and onboarding friction.</strong> The most common complaint across review
			sites is not features but accounts: suspensions without explanation and support gated
			behind top tiers, particularly at the acquired providers (SendGrid under Twilio, Mailgun
			under Sinch, Postmark under ActiveCampaign).
		</li>
	</List>

	<Paragraph>
		Pricing across the category is volume-based: the bill follows emails sent, not contacts
		stored. Anyone arriving from a Mailchimp-style marketing platform should expect that model
		change, and it usually works in the sender's favor for transactional traffic.
	</Paragraph>

	<Heading level={2}>Pricing at a glance</Heading>

	<Paragraph>
		Monthly prices for two common volumes, plus each service's free tier, as published in July
		2026. <strong>Free tiers have been shrinking across the industry</strong> (SendGrid removed
		its entirely, MailerSend cut its from 3,000 to 500 emails), so treat this column as the most
		volatile.
	</Paragraph>

	<table>
		<thead>
			<tr>
				<th>Service</th>
				<th>Free tier</th>
				<th>50,000/mo</th>
				<th>100,000/mo</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Amazon SES</td>
				<td>3,000/mo, first 12 months only</td>
				<td>~$5</td>
				<td>~$10</td>
			</tr>
			<tr>
				<td>Lettr</td>
				<td>3,000/mo</td>
				<td>$15</td>
				<td>$30</td>
			</tr>
			<tr>
				<td>Resend</td>
				<td>3,000/mo (100/day)</td>
				<td>$20</td>
				<td>$35</td>
			</tr>
			<tr>
				<td>SendGrid</td>
				<td>None (60-day trial)</td>
				<td>$19.95</td>
				<td>$34.95</td>
			</tr>
			<tr>
				<td>Mailgun</td>
				<td>100/day</td>
				<td>$35</td>
				<td>$90</td>
			</tr>
			<tr>
				<td>MailerSend</td>
				<td>500/mo</td>
				<td>$35</td>
				<td>from $110 (Professional)</td>
			</tr>
			<tr>
				<td>Brevo</td>
				<td>300/day</td>
				<td>Starter, sliding scale</td>
				<td>$69 (Starter)</td>
			</tr>
			<tr>
				<td>SMTP2GO</td>
				<td>1,000/mo</td>
				<td>~$50 (Starter + overage)</td>
				<td>$75 (Professional)</td>
			</tr>
			<tr>
				<td>Postmark</td>
				<td>100/mo</td>
				<td>~$68.50 (Pro)</td>
				<td>~$133.50 (Pro)</td>
			</tr>
		</tbody>
	</table>

	<Heading level={2}>The nine services</Heading>

	<Heading level={3}>Lettr</Heading>

	<Paragraph>
		Lettr sends over both a <a href="/email-api/">REST API</a> and an
		<a href="/smtp-relay/">SMTP relay</a>, and its distinguishing feature is
		<strong>per-email statistics</strong>: opens, clicks, bounces, and delivery state are stored
		and searchable for every individual message, not aggregated into daily counters. Templates
		are built in the Topol drag-and-drop editor with a full template language (conditionals,
		loops, snippets), tracking domains run over HTTPS, and deliverability alerts report sudden
		bounce-rate jumps and blocklist appearances as they happen.
	</Paragraph>

	<Paragraph>
		Marketing email is included rather than a separate product: Audiences and Campaigns run in
		the same account on <strong>separate sending streams</strong>, so campaign complaints never
		touch transactional reputation. The free tier is 3,000 emails a month with no expiry, and
		paid pricing ($15 for 50,000, $30 for 100,000) sits at roughly half of Mailgun and a quarter
		of Postmark. The <a href="/pricing/">pricing page</a> has the full ladder. The honest
		tradeoff: Lettr is younger than the incumbents, which is also why it is priced under them.
	</Paragraph>

	<Heading level={3}>Postmark</Heading>

	<Paragraph>
		Postmark has spent a decade optimizing for <strong>transactional deliverability and
		speed</strong>, and independent tests keep confirming it: Mailtrap's 2026 comparison
		measured it highest of the services tested at 83.3% inbox placement. Message Streams keep
		transactional and broadcast traffic on separate IP pools by design. The price reflects the
		reputation: roughly $133.50 a month at 100,000 emails on the Pro plan, and a dedicated IP
		requires 300,000 emails a month plus $50. Since the ActiveCampaign acquisition, reviews
		increasingly mention stricter account approval and slower support, a shift from its
		Wildbit-era reputation. See how it stacks up against Lettr feature by feature on the
		<a href="/compare/postmark/">Postmark comparison</a>.
	</Paragraph>

	<Heading level={3}>Twilio SendGrid</Heading>

	<Paragraph>
		SendGrid is the biggest name in the category and the safest choice on paper for enterprise
		scale, with volume pricing that stays reasonable ($34.95 at 100,000 on Essentials). Two
		caveats have grown in recent years. First, <strong>the free plan is gone</strong>: retired in
		May 2025, replaced by a 60-day trial capped at 100 emails a day. Second, support and account
		management draw persistent complaints (a 1.2/5 Trustpilot average, with account suspensions a
		recurring theme), and meaningful support is effectively gated behind the $89.95 Pro tier,
		which is also where dedicated IPs start. Shared-IP senders inherited a rough patch in early
		2025 when Microsoft temporarily blocked SendGrid shared-pool traffic. The
		<a href="/compare/sendgrid/">SendGrid comparison</a> covers the feature differences.
	</Paragraph>

	<Heading level={3}>Mailgun</Heading>

	<Paragraph>
		Mailgun remains a developer favorite for its API, routing, and validation tooling, and it is
		one of the clearest choices for <strong>EU data residency</strong>, with a dedicated EU region
		where message data never leaves the region. Pricing has crept upward since the Sinch
		acquisition ($35 at 50,000, $90 at 100,000 on Scale), log retention is short on lower tiers
		(1 to 5 days), and review sites echo the same acquisition-era support complaints as SendGrid.
		Feature comparison: <a href="/compare/mailgun/">Mailgun vs. Lettr</a>.
	</Paragraph>

	<Heading level={3}>Amazon SES</Heading>

	<Paragraph>
		SES is the cheapest option by a wide margin: $0.10 per 1,000 emails, about $10 a month at
		100,000. The price covers sending only, because <strong>SES is raw infrastructure</strong>. There is
		no template builder, minimal dashboarding, and bounce handling, suppression, and analytics
		have to be assembled from SNS topics and CloudWatch. New accounts start in a sandbox capped
		at 200 emails a day until production access is approved, and AWS enforces bounce and
		complaint thresholds automatically. SES is the right answer for teams with the engineering
		time to build around it; the
		<a href="/blog/the-hidden-cost-of-diy-transactional-email/">hidden cost of DIY
		transactional email</a> is the counterargument, and
		<a href="/compare/aws-ses-alternatives/">this page</a> compares the alternatives.
	</Paragraph>

	<Heading level={3}>Resend</Heading>

	<Paragraph>
		Resend is the default in the modern JavaScript ecosystem, and deservedly so for developer
		experience: a clean API, official SDKs in nine languages, React Email for templates-in-code,
		and a 3,000-email monthly free tier. It also picked up much of SendGrid's departing free-tier
		audience in 2025. The limits show up after launch: <strong>analytics are thin</strong>
		compared to Mailgun or Postmark, data retention is 30 days outside Enterprise, and dedicated
		IPs require the $90 Scale plan. Pricing is otherwise competitive at $20 for 50,000 and $35
		for 100,000. The <a href="/compare/resend/">Resend comparison</a> details where the two
		products differ.
	</Paragraph>

	<Heading level={3}>MailerSend</Heading>

	<Paragraph>
		MailerSend pairs a developer API with a drag-and-drop template builder inherited from
		<a href="/compare/mailerlite-alternatives/">MailerLite</a>, a combination rare at its price
		point ($35 at 50,000). Its recent direction is
		worth knowing: the free tier shrank from 3,000 emails to 500 in late 2025 (with a credit card
		now required), activity retention is 24 hours on the free plan and 7 days on Starter, and
		account approval is strict enough that rejected signups are a recurring review theme.
		<a href="/compare/mailersend/">MailerSend vs. Lettr</a> has the feature breakdown.
	</Paragraph>

	<Heading level={3}>Brevo</Heading>

	<Paragraph>
		Brevo (formerly Sendinblue) bundles marketing and transactional email into one inexpensive
		platform, with a perpetual 300-email-a-day free tier and 100,000 transactional emails for $69
		on Starter. The architecture is the tradeoff: <strong>transactional mail shares
		infrastructure with marketing traffic</strong>, and measured placement reflects it (roughly
		87% overall in one 2026 test, with Gmail placement as low as 72%, and slower delivery than
		the transactional specialists). A reasonable pick when one cheap tool for everything matters
		more than transactional performance.
	</Paragraph>

	<Heading level={3}>SMTP2GO</Heading>

	<Paragraph>
		SMTP2GO posted the best deliverability numbers in the field: EmailTooltester's 2026
		four-round test measured <strong>95.5% average inbox placement</strong>, and reviews
		consistently praise its human support. The product is relay-first and simpler than
		the API-first providers (no SSO, no HIPAA option, reporting retention 30 days on paid plans),
		and pricing lands mid-pack: $10 for 10,000 on Starter, $75 for 100,000 on Professional with a
		dedicated IP included. A strong fit for teams that mainly need a reliable
		<a href="/blog/smtp-relay/">SMTP relay</a> with people answering the support inbox.
	</Paragraph>

	<Callout variant="tip" title="Where did SparkPost go?">
		SparkPost, for years a major name on lists like this one, was acquired by MessageBird and
		absorbed into the rebranded Bird platform as "Bird Email." The infrastructure still runs, but
		the standalone developer-first product is gone, the old API endpoints were deprecated during
		the migration, and most former SparkPost customers have moved to the providers above.
	</Callout>

	<Heading level={2}>Which one to pick</Heading>

	<List>
		<li>
			<strong>Lowest cost at scale, engineering time available:</strong> Amazon SES, with the
			understanding that the tooling around it is yours to build and operate.
		</li>
		<li>
			<strong>Maximum deliverability pedigree, price secondary:</strong> Postmark, or SMTP2GO for
			a relay-first setup with the best measured placement.
		</li>
		<li>
			<strong>Modern developer experience on a JS stack:</strong> Resend, if aggregate analytics
			and 30-day retention are enough.
		</li>
		<li>
			<strong>Per-email analytics, visual templates, and marketing in one account:</strong>
			Lettr, at $30 for 100,000 emails with both API and SMTP transports.
		</li>
		<li>
			<strong>EU data residency as a hard requirement:</strong> Mailgun's EU region, or Brevo as
			an EU-headquartered all-in-one.
		</li>
		<li>
			<strong>Enterprise procurement and the Twilio ecosystem:</strong> SendGrid, budgeting for
			the Pro tier where support and dedicated IPs live.
		</li>
	</List>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="What is a transactional email service?">
			<strong>A service that sends application-triggered email (password resets, receipts,
			notifications) through infrastructure with established sending reputation.</strong> It
			accepts messages over a REST API or SMTP relay, handles authentication and delivery, and
			reports delivery, bounce, and engagement events back. The
			<a href="/blog/what-is-transactional-email/">transactional email guide</a> covers the
			category in depth.
		</FaqItem>

		<FaqItem question="Which transactional email service is the cheapest?">
			<strong>Amazon SES, at $0.10 per 1,000 emails.</strong> The price buys raw sending only;
			bounce handling, suppression lists, analytics, and templates have to be built around it.
			Among full-featured services, Lettr ($30) and Resend ($35) are the least expensive at
			100,000 emails a month as of July 2026.
		</FaqItem>

		<FaqItem question="Does SendGrid still have a free plan?">
			<strong>No. SendGrid retired its free plan in May 2025.</strong> New accounts get a 60-day
			trial capped at 100 emails a day, after which a paid plan is required. Ongoing free tiers
			still exist at Lettr and Resend (3,000 emails a month each), Brevo (300 a day), and SMTP2GO
			(1,000 a month).
		</FaqItem>

		<FaqItem question="Can a transactional email service send marketing email too?">
			<strong>Often yes, but the traffic should stay separated.</strong> Marketing mail draws more
			complaints than receipts, and shared reputation lets a bad campaign drag transactional mail
			into spam. Prefer providers that separate the streams (Postmark's Message Streams, Lettr's
			transactional and marketing streams), and keep the two on
			<a href="/blog/separate-transactional-and-marketing-email/">separate sending domains</a>.
		</FaqItem>

		<FaqItem question="Should I choose SMTP or a REST API to send?">
			<strong>All nine services offer both, so the choice is per codebase, not per
			provider.</strong> SMTP is a drop-in for legacy systems and anything with an SMTP settings
			screen; a REST API adds templates, structured errors, and idempotency for new application
			code. The <a href="/blog/smtp-vs-rest-api-how-to-choose/">SMTP vs. REST API guide</a>
			covers how to decide.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		The category splits into three tiers: raw infrastructure (SES) for teams that want to build,
		premium specialists (Postmark) for teams that want a track record at any price, and a broad
		middle where price, analytics, and tooling decide. <strong>Free tiers are the fastest way to
		compare the middle tier</strong>, since setup on any of these services takes minutes rather
		than days.
	</Paragraph>

	<Paragraph>
		Lettr's free tier is 3,000 emails a month with per-email analytics, both transports, and the
		template builder included. <a href="https://app.lettr.com/register">Create a free account</a>
		and send a real message through the API or the relay before committing to anything.
	</Paragraph>
</BlogPost>
