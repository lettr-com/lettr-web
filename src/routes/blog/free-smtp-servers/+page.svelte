<script lang="ts">
	import type { PageProps } from './$types';
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
		FaqItem,
		ProductNote
	} from '$lib/components/blog';

	let { data }: PageProps = $props();

	// Single source for the visible FAQ and the FAQPage structured data.
	const faqItems = [
		{
			question: 'What is the best free SMTP server?',
			lead: 'The one whose limits fit the sending: the monthly allowance, the daily cap, and a tier rather than a trial.',
			rest: "For application email, start with a free tier that includes both an API and an SMTP relay, with no card and no end date. Lettr's free tier has all of that at 3,000 emails a month."
		},
		{
			question: "Is Google's SMTP server free?",
			lead: 'Yes, with a Google account, at personal volumes.',
			rest: 'A personal account is limited to 500 emails sent a day and 500 recipients on one email, tools that ask for the account password no longer work, and app passwords need 2-Step Verification. It is not built for sending an application\'s email to customers.'
		},
		{
			question: 'Can I use Outlook or Microsoft 365 as a free SMTP server?',
			lead: 'Only in the same personal sense as Gmail.',
			rest: 'A free Outlook.com mailbox sends through smtp-mail.outlook.com and requires OAuth2 sign-in, with app passwords for devices. Microsoft 365 SMTP submission needs a licensed, paid mailbox, and Microsoft has scheduled password sign-in for it for deprecation, so an application is better served by a relay service.'
		},
		{
			question: 'What is the best free SMTP server for WordPress?',
			lead: 'Any relay in this article works.',
			rest: 'A WordPress SMTP plugin takes the same four values (host, port, username, password) from any free SMTP relay in the table.'
		},
		{
			question: 'Is there a free SMTP server for testing?',
			lead: "Yes. Mailtrap's Email Sandbox has a free plan of 50 test emails, and Lettr's sandbox API keys redirect every test send to the key creator's own inbox.",
			rest: 'Lettr sandbox keys work over both the API and SMTP, so nothing sent with them reaches a customer.'
		}
	];
	const faqs = faqItems.map(({ question, lead, rest }) => ({ question, answer: `${lead} ${rest}` }));
</script>

<BlogPost
	category="Fundamentals"
	title="12 best free SMTP servers, compared"
	seoTitle="12 Best Free SMTP Servers, Compared (2027)"
	excerpt="Twelve free SMTP servers compared on monthly and daily sending limits, with the use cases and senders each one fits."
	metaDescription="12 free SMTP servers compared on monthly and daily sending limits, use cases, and target audience."
	author={{ name: 'Jack Zagorski', role: 'Content specialist', avatar: '/images/authors/jack.jpg' }}
	date="November 24, 2026"
	datetime="2026-11-24"
	readTime="12 min read"
	slug="free-smtp-servers"
	{faqs}
>
	<Lead>
		This article compares eleven SMTP relay services with a free plan or trial (Lettr, Mailtrap, and
		Brevo among them) on monthly and daily sending limits, and covers Gmail's own SMTP server
		separately. Each entry says what the free offer includes, where it stops, and which sender it
		suits.
	</Lead>

	<Paragraph>
		One disclosure: Lettr is our product. All vendor-specific information was verified directly
		on vendor websites at the time of publication.
	</Paragraph>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Nine of the services have free tiers with no end date.</strong> UniOne's free offer
				is a four-month trial, and Amazon SES gives new customers expiring credits.
			</li>
			<li>
				<strong>Check the daily cap before the monthly allowance.</strong> Several free plans allow
				100 to 300 emails a day, which in some cases (a launch, for example) is easier to exceed
				than the monthly allowance.
			</li>
			<li>
				<strong>Lettr's free tier covers app email over API or SMTP:</strong> 3,000 emails a month
				with no credit card and no end date.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What counts as a free SMTP server</Heading>

	<Paragraph>
		A free SMTP server is one of three kinds. The first is a free plan or trial from an
		<a href="/glossary/smtp-relay/">SMTP relay</a> service (also called an SMTP provider), and the
		eleven services in the list are this kind. The second is a mailbox's own SMTP server, covered in
		the Gmail section after the list. The third is <strong>SMTP server software you run
			yourself</strong
		>, which stays out of the roundup: the software is free, but the setup and upkeep are not.
	</Paragraph>

	<Heading level={3}>SMTP server software you run yourself</Heading>

	<Paragraph>
		Postfix and similar mail server software cost nothing to install, but the major clouds block
		<strong>outbound port 25</strong>, the port they need. AWS restricts it on EC2 instances and
		Lambda functions until you
		<a href="https://repost.aws/knowledge-center/ec2-port-25-throttle">request a removal</a>, and
		Google Cloud <a href="https://cloud.google.com/compute/docs/tutorials/sending-mail"
			>blocks it</a
		> outright.
	</Paragraph>

	<Paragraph>
		A new server also has no sending history, so its mail is more likely to land in spam until the
		IP and domain <a href="/blog/how-to-warm-up-a-sending-domain/">warm up</a>.
	</Paragraph>

	<ProductNote />

	<Heading level={2}>Free tier or free trial: the 12 at a glance</Heading>

	<Paragraph>
		A <strong>free tier</strong> is a limited $0 plan with no end date. A free trial is free for a
		set time or a credit balance, after which sending stops until you pay.
	</Paragraph>

	<div class="table-scroll">
		<table>
			<thead>
				<tr>
					<th>Service</th>
					<th>Free allowance, as published</th>
					<th>Included at $0</th>
					<th>Tier or trial</th>
					<th>Card at sign-up</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Lettr</td>
					<td>3,000 a month, 100 a day</td>
					<td>API + SMTP, visual template editor, marketing for 500 contacts</td>
					<td>Free tier</td>
					<td>Not needed</td>
				</tr>
				<tr>
					<td>Brevo</td>
					<td>300 a day</td>
					<td>SMTP + API inside its marketing platform</td>
					<td>Free tier</td>
					<td>Not needed</td>
				</tr>
				<tr>
					<td>Mailtrap</td>
					<td>4,000 a month, 150 a day</td>
					<td>API + SMTP, plus a free testing sandbox</td>
					<td>Free tier</td>
					<td>Not needed</td>
				</tr>
				<tr>
					<td>SMTP2GO</td>
					<td>1,000 a month</td>
					<td>SMTP relay with reporting</td>
					<td>Free tier</td>
					<td>Not needed</td>
				</tr>
				<tr>
					<td>Mailjet</td>
					<td>6,000 a month, 200 a day</td>
					<td>API + SMTP, webhooks, email editor</td>
					<td>Free tier</td>
					<td>Not needed</td>
				</tr>
				<tr>
					<td>SendPulse</td>
					<td>12,000 a month, 400 a day</td>
					<td>SMTP inside a multi-channel marketing platform</td>
					<td>Free tier</td>
					<td>Not stated</td>
				</tr>
				<tr>
					<td>Sender</td>
					<td>15,000 a month, 2,500 subscribers</td>
					<td>SMTP and API on a marketing platform</td>
					<td>Free tier</td>
					<td>Not needed</td>
				</tr>
				<tr>
					<td>Resend</td>
					<td>3,000 a month, 100 a day</td>
					<td>API + SMTP, templates in code</td>
					<td>Free tier</td>
					<td>Not stated</td>
				</tr>
				<tr>
					<td>UniOne</td>
					<td>6,000 a month, for 4 months</td>
					<td>Standard-plan features, SMTP API included</td>
					<td>Free trial</td>
					<td>Required</td>
				</tr>
				<tr>
					<td>Mailgun</td>
					<td>100 a day</td>
					<td>API + SMTP, tracking and webhooks</td>
					<td>Free tier</td>
					<td>Not stated</td>
				</tr>
				<tr>
					<td>Amazon SES</td>
					<td>Up to $200 in credits, 6-month free plan</td>
					<td>Sending only; the tooling is yours to assemble</td>
					<td>Trial credits</td>
					<td>AWS account</td>
				</tr>
				<tr>
					<td>Gmail</td>
					<td>500 a day on a personal account</td>
					<td>The mailbox's outgoing server</td>
					<td>With a Google account</td>
					<td>Not needed</td>
				</tr>
			</tbody>
		</table>
	</div>

	<Paragraph>
		Four more services have a free plan or trial but stay out of the main roundup:
	</Paragraph>

	<List>
		<li>
			<strong>Twilio SendGrid.</strong> SendGrid has no free plan. New accounts get a free trial with
			no credit card, and sending after it needs a paid plan.
		</li>
		<li>
			<strong>Postmark.</strong> The free plan is 100 emails a month, the smallest monthly allowance
			on this page, so it stays out of the list.
		</li>
		<li>
			<strong>MailerSend.</strong> The free plan covers 500 emails a month (half the table's
			smallest monthly allowance) with one domain and one template, and sending starts once the
			account is approved.
		</li>
		<li>
			<strong>Elastic Email.</strong> The pricing page lists a $0 plan for up to 3,000 emails a
			month, but its one sentence on sending ("Try all the basic features from the Starter plan and
			upgrade to send with a limit of 100 emails per day") reads two ways, so its limits can't be
			stated with confidence.
		</li>
	</List>

	<Heading level={2}>What else to check before you pick</Heading>

	<Paragraph>
		The allowances in the table are the headline numbers. Four other limits decide whether a free
		plan works for a given sender:
	</Paragraph>

	<List>
		<li>
			<strong>How long the plan keeps your logs.</strong> A free plan stores sending history for
			days rather than months (Lettr, for example, keeps 7 days of data).
		</li>
		<li>
			<strong>Caps underneath the caps.</strong> Some plans limit by the hour as well as by the day,
			and a personal Gmail account has two caps: 500 emails sent a day and 500 recipients on a
			single email. Read the whole limits page before connecting an app.
		</li>
		<li>
			<strong>Sign-up gates.</strong> A plan may ask for more than an email address before the first
			send: a credit card, an address at your own domain, an account review, or a sandbox that only
			sends to verified addresses.
		</li>
		<li>
			<strong>A relay or a whole marketing platform.</strong> Several of these free plans belong to
			marketing platforms, where a subscriber cap can apply before the email cap does, and some
			(Sender, for example) put their branding on free emails.
		</li>
	</List>

	<Heading level={2}>The eleven relay services</Heading>

	<Paragraph>
		Each entry covers what the service is, the tradeoffs of its free offer, and who it suits.
	</Paragraph>

	<Heading level={3}>Lettr</Heading>

	<Paragraph>
		Lettr, our sending platform for transactional and marketing email, gives every account a
		<strong>free tier of 3,000 emails a month</strong>, capped at 100 a day. The free tier includes
		one sending domain, both the REST API and the SMTP relay, basic analytics, and 7 days of data
		retention, with no credit card and no end date.
	</Paragraph>

	<Paragraph>
		Over SMTP, an app connects to smtp.lettr.com with the username <code>lettr</code> and a Lettr
		<strong>API key as the password</strong>, on port 587 (STARTTLS) or 465 (implicit TLS):
	</Paragraph>

	<Code filename=".env" {...data.code.smtpSettings} />

	<Paragraph>
		The <a href="/blog/smtp-relay/">SMTP relay guide</a> walks through these values and a test send.
		The free tier opens the full <a href="/smtp-relay/">SMTP relay service</a> rather than a limited
		test mode.
		Templates are built in Lettr's visual editor (powered by our own
		<a href="https://topol.io/">Topol.io</a>), and the same account includes
		<strong>marketing email for up to 500 contacts</strong> at no cost.
	</Paragraph>

	<Paragraph>
		The limits to plan around are the <strong>100-a-day cap</strong> and the 7-day retention. The
		Pro plan, at $15 a month for 50,000 emails, removes the daily cap, keeps logs for 30 days, and
		allows up to 10 sending domains.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> An app or site owner who wants both the API and the SMTP relay at
		$0, with marketing email ready in the same account.
	</Paragraph>

	<Heading level={3}>Brevo</Heading>

	<Paragraph>
		Brevo publishes its free limit per day rather than per month: <strong
			>300 emails a day</strong
		>, with no credit card required. The same account includes Brevo's marketing platform, so
		contacts, campaigns, and transactional SMTP share one login. Brevo reviews new accounts, and its
		pricing FAQ says sending starts once the account is approved.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> A sender with even daily volume that also plans campaigns and
		contact storage.
	</Paragraph>

	<Heading level={3}>Mailtrap</Heading>

	<Paragraph>
		Mailtrap pairs a sending platform with its email testing tool, Email Sandbox. The free plan
		includes <strong>4,000 emails a month</strong> with no credit card, capped at 150 a day, with one
		domain and 3 days of email logs. The testing side has its own free plan of 50 test emails; the
		limit to plan around is the 3 days of logs on the sending side.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> A product team that wants staging email caught and production
		email sent from one account, and can work with 3 days of logs.
	</Paragraph>

	<Heading level={3}>SMTP2GO</Heading>

	<Paragraph>
		SMTP2GO is relay-first: the product is the SMTP service itself, with reporting around it. The
		free plan covers <strong>1,000 emails a month</strong> with no credit card, the smallest monthly
		figure among the free tiers here, and sign-up requires an address at your own domain rather than
		a public mailbox. Live chat and phone support are available for 14 days on the free plan, and
		support is by ticket only after that.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> A company sending low-volume alerts and notifications that can
		sign up with an address at its own domain.
	</Paragraph>

	<Heading level={3}>Mailjet</Heading>

	<Paragraph>
		Mailjet's free plan allows <strong>6,000 emails a month, capped at 200 a day</strong>, with the
		API, the SMTP relay, webhooks, and storage for 1,000 contacts, and its pricing FAQ confirms no
		credit card is needed at sign-up. The plan includes Mailjet's email editor, so the same account
		composes newsletters and relays application mail.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> A team that wants newsletters and application mail from one
		account at $0 and stays under 200 emails a day.
	</Paragraph>

	<Heading level={3}>SendPulse</Heading>

	<Paragraph>
		SendPulse is a multi-channel marketing platform whose SMTP service has one of the larger free
		allowances here: <strong>12,000 emails a month</strong>. Its SMTP limits page adds two caps on
		the free plan, 50 emails an hour and 400 a day.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> A sender whose mail is spread evenly through the day, since the
		hourly cap of 50 rules out bursts.
	</Paragraph>

	<Heading level={3}>Sender</Heading>

	<Paragraph>
		Sender is a marketing platform whose Free Forever plan covers <strong
			>15,000 emails a month to 2,500 subscribers</strong
		>, the largest monthly allowance in the table, with no credit card. Its plan listing includes
		transactional emails and SMTP among the features.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> A newsletter with notifications on the side. An app that only
		sends system email is better served by the relay-first plans above.
	</Paragraph>

	<Heading level={3}>Resend</Heading>

	<Paragraph>
		Resend is an API-first sending service with an SMTP relay alongside the REST API. The free plan
		covers <strong>3,000 emails a month, capped at 100 a day</strong>, with three sending domains.
		Templates are written in code rather than in a visual editor, which suits a developer who
		versions email with the app, but not a business team working outside the codebase.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> A developer who keeps email templates in version control next to
		the app code.
	</Paragraph>

	<Heading level={3}>UniOne</Heading>

	<Paragraph>
		UniOne's free offer is a <strong>four-month free trial</strong> with 6,000 emails a month and 100
		email address validations, on the features of its Standard plan, SMTP API included. Activating
		the trial requires a credit or debit card, and after the four months the same volume costs $4 a
		month. The trial suits an evaluation at steady volume, as four months is long enough to watch
		deliverability across real traffic.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> A team evaluating a provider over several months with a card
		ready. A sender who needs a permanent $0 plan should look at the tiers above.
	</Paragraph>

	<Heading level={3}>Mailgun</Heading>

	<Paragraph>
		Mailgun's free plan allows <strong>100 emails a day</strong> with one custom sending domain, one
		API key, and ticket support, over both the REST API and the SMTP relay. Tracking, analytics, and
		webhooks are included, so an integration test covers event reporting from the first send. There
		is no monthly allowance, only the daily 100, and paid tiers start at $35 a month for 50,000
		emails.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> A developer already weighing Mailgun's paid platform who wants to
		try it at $0 first.
	</Paragraph>

	<Heading level={3}>Amazon SES</Heading>

	<Paragraph>
		Amazon SES prices per email sent, and its free offer is credits rather than a tier: new AWS
		customers get <strong>up to $200 in Free Tier credits</strong>, with a free plan available for 6
		months after account creation and credits that expire within 12 months.
	</Paragraph>

	<Paragraph>
		Two more gates apply. Every new SES account starts in a sandbox that allows 200 messages per 24
		hours, to verified addresses only, until AWS approves production access. SES is also
		infrastructure, so bounce handling, analytics, and templates are left to the user to build.
	</Paragraph>

	<Paragraph>
		<strong>Who it's for.</strong> A team already on AWS with engineering time to spend. For everyone
		else, the relay services above take less setup.
	</Paragraph>

	<Heading level={2}>Is Gmail a free SMTP server?</Heading>

	<Paragraph>
		Yes, within the limits Google sets for a person rather than an application. A personal Gmail
		account sends through smtp.gmail.com, and Google's help page gives it two limits: <strong
			>500 emails sent a day</strong
		> and 500 recipients on a single email. Crossing either one blocks sending for up to 24 hours.
	</Paragraph>

	<Paragraph>
		The sign-in rules are the tighter constraint. Gmail no longer accepts apps that sign in with a
		username and password, and the app passwords that older tools need require 2-Step Verification
		and are described as not recommended on
		<a href="https://support.google.com/accounts/answer/185833">Google's own help page</a>. Paid
		Google Workspace accounts have higher limits, with a dedicated relay at smtp-relay.gmail.com for
		<a href="https://support.google.com/a/answer/176600">printers, scanners, and apps</a>.
	</Paragraph>

	<Paragraph>
		Gmail's SMTP server fits a personal tool or a device sending a handful of messages. Application
		email sent to customers from a company domain belongs on one of the relay services above.
	</Paragraph>

	<Heading level={2}>Which free SMTP server fits your use case</Heading>

	<Paragraph>
		The free plans are built for different senders, so the job decides the pick:
	</Paragraph>

	<List>
		<li>
			<strong>Contact forms on a WordPress site:</strong> Lettr or Brevo. Any SMTP plugin takes a
			relay's settings. Lettr's 100 a day covers form and order notifications, and Brevo's 300 a
			day leaves headroom for a busier shop.
		</li>
		<li>
			<strong>An app's password resets and receipts:</strong> Lettr or Resend, both free at 3,000 a
			month with API and SMTP. Lettr adds the visual template editor and keeps marketing email in
			the same account for later.
		</li>
		<li>
			<strong>Homelab and server alerts:</strong> Lettr or Mailtrap for delivery logs on a no-card
			tier (7 and 3 days of them, respectively), or SMTP2GO if 1,000 a month is enough and a domain-based address
			is available to sign up with.
		</li>
		<li>
			<strong>A newsletter first, notifications second:</strong> Sender, SendPulse, Brevo, or
			Mailjet. All four are marketing platforms whose free tiers include SMTP, so subscribers,
			campaigns, and the relay share one account.
		</li>
		<li>
			<strong>An evaluation at higher volume:</strong> UniOne's four-month trial at 6,000 a month,
			or Amazon SES credits for a team already on AWS. Both end, so plan for what comes after.
		</li>
	</List>

	<Paragraph>
		Once volume outgrows every free plan, the comparison moves from allowances to
		<a href="/blog/best-transactional-email-services/"
			>pricing at 50,000 and 100,000 emails a month</a
		>.
	</Paragraph>

	<Heading level={2}>Does a free SMTP server hurt deliverability?</Heading>

	<Paragraph>
		No, but a free plan gives up one control: free plans typically send only from
		<strong>IP addresses shared</strong> with other customers.
	</Paragraph>

	<Paragraph>
		What you control is the domain. <a href="/blog/spf-dkim-dmarc-explained-for-developers/"
			>SPF, DKIM, and DMARC</a
		> records prove to receiving servers that mail from your domain is authorized, and they are set
		up once in DNS whichever service sends the mail.
	</Paragraph>

	<Callout variant="info">
		Lettr's <a href="/free-email-api/">free tier includes domain authentication</a>: adding a
		sending domain shows the DNS records to publish, and the
		<a href="https://docs.lettr.com/learn/domains/introduction">domains docs</a> cover verification.
	</Callout>

	<Paragraph>
		The other input is the <strong>recipient list</strong>. Mail sent to people who did not ask for
		it draws spam complaints, and sending to dead addresses raises the bounce rate. Receiving
		servers count both against the domain, on a free plan and a paid one alike.
	</Paragraph>

	<Heading level={2}>Why else use Lettr?</Heading>

	<Paragraph>
		Lettr has an <a href="/email-api/">email API</a> next to the SMTP relay, so an app can start on
		SMTP and move individual sends to the REST API later without changing accounts or domains. Both
		paths share the same sending domains, <strong>per-email logs</strong>, and webhooks.
	</Paragraph>

	<Paragraph>
		The same account also runs <a href="/email-marketing/">email marketing</a>: campaigns,
		segments, double opt-in, and unsubscribe handling are built in, so marketing and transactional
		email share one editor and one bill.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		{#each faqItems as item}
			<FaqItem question={item.question}>
				<strong>{item.lead}</strong>
				{item.rest}
			</FaqItem>
		{/each}
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Of the three kinds of free SMTP server, a relay service's free plan is the one built for
		application email, and the use-case list above matches each plan to the sender it suits. Lettr's
		free tier covers <strong>API or SMTP sending with domain authentication</strong>, with no credit
		card and no end date.
	</Paragraph>

	<Paragraph>
		<a href="https://app.lettr.com/register">Create a free Lettr account</a> to send up to 3,000
		emails a month at $0, or read the
		<a href="https://docs.lettr.com/quickstart/smtp/introduction">SMTP quickstart</a> to see the
		connection settings in full.
	</Paragraph>
</BlogPost>
