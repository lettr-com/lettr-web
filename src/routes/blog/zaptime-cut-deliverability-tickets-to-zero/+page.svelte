<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		TldrList,
		Quote,
		Callout,
		Faq,
		FaqItem
	} from '$lib/components/blog';
</script>

<BlogPost
	category="Case study"
	title="Zaptime cut deliverability tickets from dozens a month to zero with Lettr"
	seoTitle="Zaptime cut deliverability tickets to zero with Lettr"
	excerpt="Zaptime's customers were reporting that their clients never received booking confirmations, and Amazon SES gave the team no way to find out why. The switch to Lettr took a single day of engineering, and it came down to two things the alternative could not do: manage sending domains for hundreds of customer teams, and process data in the EU."
	metaDescription="Zaptime replaced two email vendors with Lettr in a one-day migration, and went from dozens of deliverability tickets a month to zero."
	author={{ name: 'Jack Zagorski', role: 'Content specialist', avatar: '/images/authors/jack.jpg' }}
	date="September 11, 2026"
	datetime="2026-09-11"
	readTime="4 min read"
	slug="zaptime-cut-deliverability-tickets-to-zero"
>
	<Lead>
		<a href="https://zaptime.app/">Zaptime</a> is a scheduling and booking platform for teams, with
		booking pages, calendar and video-call integrations, payments, CRM sync, and automated email
		workflows. It is fully localized, and customers can manage their scheduling from AI assistants
		like Claude and ChatGPT through Zaptime's MCP server. Every reservation triggers a confirmation,
		reminders, and a payment receipt sent from the customer's own domain, so email is a core part of
		the product.
	</Lead>

	<Paragraph>
		This case study covers how Zaptime moved both its transactional and marketing email onto Lettr
		in a single day of engineering, and how its deliverability tickets went from
		<strong>dozens a month to zero</strong>.
	</Paragraph>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>The problem</strong>: clients of Zaptime's customers were missing booking
				confirmations, Amazon SES gave no visibility into deliverability, and marketing ran through
				a second tool with its own contact database.
			</li>
			<li>
				<strong>The switch</strong>: Lettr replaced both vendors in a one-day migration. Its domain
				API creates and verifies each customer's sending domain, delivery is reported per message,
				and data stays in the EU.
			</li>
			<li>
				<strong>The result</strong>: deliverability tickets dropped from dozens a month to zero.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>The challenge: missing booking confirmations and no diagnostic data</Heading>

	<Paragraph>
		Before Lettr, Zaptime ran <strong>two separate email stacks</strong>: Amazon SES for booking
		messages and a separate tool for its own marketing. Support tickets showed that customers'
		clients were missing booking notifications, and SES offered nothing to explain why beyond raw
		bounce notifications.
	</Paragraph>

	<Paragraph>
		Custom sending domains were a second weak point. Each customer team sends from its own domain,
		and Zaptime verified those domains through a fragile,
		<a href="/blog/the-hidden-cost-of-diy-transactional-email/">do-it-yourself flow</a>. The
		marketing tool kept its own contact database, which made
		<strong>consent and unsubscribe preferences</strong> difficult to connect to Zaptime's app.
	</Paragraph>

	<Paragraph>
		Zaptime first tested a popular transactional email API, which fell short on two requirements.
		It could not <strong>manage sending domains programmatically</strong> for hundreds of customer
		teams, and its EU data residency did not meet the needs of a customer base that is mostly
		European.
	</Paragraph>

	<Heading level={2}>The solution: one platform for booking emails and marketing</Heading>

	<Paragraph>
		Zaptime chose Lettr, which
		<a href="/blog/separate-transactional-and-marketing-email/">handles both kinds of email</a> from
		<strong>one account</strong>: the transactional booking emails Zaptime's customers send to their
		clients, and Zaptime's own marketing to those customers.
	</Paragraph>

	<Paragraph>
		The deciding factor was <strong>domain management through the API</strong>. Lettr's domain API
		creates and verifies each customer's sending domain, so Zaptime shows the required
		<a href="/blog/spf-dkim-dmarc-explained-for-developers/">DNS records</a> in its own UI, and Lettr
		reports delivery data for every message.
	</Paragraph>

	<Paragraph>
		Lettr also met two other requirements. It is <strong>hosted in the EU</strong>, which many of Zaptime's
		customers require for data processing, and its
		<a href="/blog/why-we-built-lettr-on-laravel/">official Laravel package</a> matches Zaptime's
		stack.
	</Paragraph>

	<Callout variant="info">
		Sending domains can be created and verified through the API as well as the dashboard. The
		<a href="https://docs.lettr.com/learn/domains/sending-domains">sending domains docs</a> cover the
		DNS records and API calls, and the
		<a href="https://docs.lettr.com/quickstart/laravel/introduction">Laravel quickstart</a> covers the
		package.
	</Callout>

	<Paragraph>
		The whole migration (transactional sending, custom-domain enrollment, contact sync, and the
		preference-management UI) took <strong>a single day of engineering</strong>. Both providers ran
		side by side during the switch, so Zaptime's customers saw no disruption.
	</Paragraph>

	<Paragraph>
		<a href="https://www.linkedin.com/in/sektomas/">Tomas Senk</a>, co-founder of Zaptime, on the
		setup:
	</Paragraph>

	<Quote>
		Support was fast, technical and genuinely helpful. When we were setting up custom sending domains
		for our users, the Lettr support engineer walked us through the DNS records and verification
		flow. It felt like working with a partner.
	</Quote>

	<Heading level={2}>The outcome: zero deliverability tickets</Heading>

	<Paragraph>
		Booking emails now <strong>reach inboxes reliably</strong>. Every outgoing email is tagged with its trigger and customer team, so
		delivery and engagement are visible per customer, and users manage their email preferences
		directly in Zaptime's app.
	</Paragraph>

	<Paragraph>Tomas Senk on what changed for the team:</Paragraph>

	<Quote>
		Before the migration, Zaptime was getting dozens of tickets a month. Afterwards, the number
		dropped to zero, freeing our engineers to spend their hours on more important tasks. For a team
		our size, that is the biggest win.
	</Quote>

	<Paragraph>
		Zaptime's next steps build on the same setup: <strong>surfacing delivery and engagement data</strong>
		inside its own product, driving lifecycle campaigns from typed contact properties such as plan
		and trial end, and moving its remaining SES domains over so that Lettr becomes its only email
		provider.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="How long did Zaptime's migration to Lettr take?">
			<strong>One day of engineering.</strong> That day covered transactional sending,
			custom-domain enrollment, contact sync, and the preference-management UI, with the old and new
			providers running in parallel.
		</FaqItem>

		<FaqItem question="Can one Lettr account send both transactional and marketing email?">
			<strong>Yes. Lettr handles transactional sending and marketing campaigns from the same
			account.</strong> Zaptime uses it for the booking emails its customers send to their clients and
			for its own marketing, with contacts and unsubscribe preferences synced to its app.
		</FaqItem>

		<FaqItem question="Can Lettr create sending domains for my own customers through the API?">
			<strong>Yes. The domain API creates a sending domain and returns the DNS records it needs.</strong>
			A platform like Zaptime can show those records in its own UI and trigger verification once the
			customer has added them.
		</FaqItem>

		<FaqItem question="Where does Lettr host its data?">
			<strong>Lettr runs on EU-hosted infrastructure.</strong> EU data processing was one of Zaptime's
			requirements, and it ruled out the other transactional email API the team tested.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Zaptime's deliverability problems came from two gaps: no visibility into why booking emails went
		missing, and a do-it-yourself flow for customer sending domains. Moving both kinds of email onto
		Lettr closed both in <strong>one day of engineering</strong> and brought deliverability tickets
		to zero. To try the same setup,
		<a href="https://app.lettr.com/register">create a free Lettr account</a>, or read the
		<a href="https://docs.lettr.com/learn/domains/sending-domains">sending domains docs</a> to see how
		per-customer domains work.
	</Paragraph>
</BlogPost>
