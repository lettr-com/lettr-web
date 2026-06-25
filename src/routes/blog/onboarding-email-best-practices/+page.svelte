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

	// Visual email mockups for the "examples" section, modeled on the card design
	// in /platform/templates ("Start from a template"). Each renders as a shrunk
	// email preview, paired with a short teardown of why it works.
	interface ExampleEmail {
		/** Section title for the example, e.g. "Welcome email". */
		name: string;
		/** One-line note on where this email sits in the sequence. */
		summary: string;
		stage: string;
		subject: string;
		title: string;
		greeting: string;
		body: string;
		cta: string;
		detail?: { label: string; value: string };
		breakdown: { point: string; rest: string }[];
	}

	const examples: ExampleEmail[] = [
		{
			name: 'Welcome email',
			summary:
				'The first message, sent within seconds of signup. It moves a new user from "I made an account" to "I did the first thing."',
			stage: 'Sent immediately on signup',
			subject: 'Welcome to Acme, Sam',
			title: 'Welcome to Acme',
			greeting: 'Hi Sam,',
			body: "Thanks for signing up. Your account is ready. The fastest way to see what Acme does is to import your first contact list. It takes about two minutes.",
			cta: 'Import your contacts',
			detail: { label: 'Reply-to', value: 'sam@acme.com reaches a real person' },
			breakdown: [
				{ point: 'One action, no tour.', rest: ' The whole message points at a single first step instead of listing every feature.' },
				{ point: 'The subject names the person and product.', rest: ' "Welcome to Acme, Sam" reads as expected mail, not a broadcast.' },
				{ point: 'It invites a reply.', rest: ' Sending from a monitored address turns the first email into the start of a conversation.' }
			]
		},
		{
			name: 'Activation nudge',
			summary:
				'A follow-up to users who signed up but stalled before the core action, pointing them at the one step they left open.',
			stage: 'Sent day 3, only if setup is unfinished',
			subject: 'Your contact list is still empty',
			title: 'Finish setting up Acme',
			greeting: 'Hi Sam,',
			body: "You created your account but haven't imported any contacts yet. That's the one step that makes everything else work. It takes two minutes and you can paste from a spreadsheet.",
			cta: 'Import contacts',
			detail: { label: 'Trigger', value: 'Skipped automatically once contacts exist' },
			breakdown: [
				{ point: 'Triggered by behavior, not a timer.', rest: ' It only reaches users who left the step open, so it never tells an active user to do something they already did.' },
				{ point: 'It references the specific open step.', rest: ' Naming the empty contact list reads as attention, not a generic nudge.' },
				{ point: 'It links straight to the action.', rest: ' The button goes to the import screen, not the dashboard.' }
			]
		},
		{
			name: 'Appointment reminder',
			summary:
				"The onboarding email's close cousin in any booking or scheduling product, following the same rules in a tighter form.",
			stage: 'Sent the day before a booking',
			subject: 'Your appointment with Acme is tomorrow',
			title: 'Your appointment is tomorrow',
			greeting: 'Hi Sam,',
			body: 'This is a reminder that your appointment is tomorrow, Thursday 26 June, at 2:00 PM. Need to change it? Use the button below.',
			cta: 'Reschedule',
			detail: { label: 'When', value: 'Thu 26 June · 2:00 PM' },
			breakdown: [
				{ point: 'One fact, stated plainly.', rest: ' The date and time lead the message; everything else is secondary.' },
				{ point: 'A single relevant action.', rest: ' Reschedule or confirm, behind one button, with nothing competing for the click.' },
				{ point: 'Scheduled against the appointment.', rest: ' The send time is keyed to the booking, not to signup, which is the one structural difference from the rest of the sequence.' }
			]
		}
	];

	// Copy-paste source for the three mockups above. Each template uses the same
	// structure and copy as its example, with {{merge_tag}} placeholders in place of
	// the concrete values, so filling the tags reproduces the email the mockup shows.
	const welcomeTemplate = `Subject: Welcome to {{product}}, {{first_name}}

Hi {{first_name}},

Thanks for signing up. Your account is ready. The fastest way to
see what {{product}} does is to {{first_action}}. It takes about
two minutes.

{{cta_button: Get started}}

If anything is unclear, reply straight to this email. A real
person reads it.

{{sender_name}}`;

	const nudgeTemplate = `Subject: {{open_step_subject}}

Hi {{first_name}},

You created your account but haven't {{open_step}} yet. That's
the one step that makes everything else work. It takes two
minutes and you can paste from a spreadsheet.

{{cta_button: {{cta_label}}}}

{{sender_name}}`;

	const reminderTemplate = `Subject: Your appointment with {{business}} is tomorrow

Hi {{first_name}},

This is a reminder that your appointment is tomorrow,
{{date}} at {{time}}.

Need to change it? {{cta_button: Reschedule}}

See you then,
{{business}}`;

	const sendTemplate = `import { Lettr } from 'lettr';

const lettr = new Lettr(process.env.LETTR_API_KEY);

const result = await lettr.emails.send({
  from: 'onboarding@yourapp.com',
  to: [user.email],
  template_slug: 'welcome',
  substitution_data: {
    first_name: user.firstName,
    product: 'Acme',
    first_action: 'import your first contact list'
  }
});`;

	const scheduleSend = `// Step 2 of the sequence: a setup nudge, three days later.
const sendAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

await lettr.emails.schedule({
  from: 'onboarding@yourapp.com',
  to: [user.email],
  template_slug: 'finish-setup',
  substitution_data: { first_name: user.firstName },
  scheduled_at: sendAt.toISOString()
});`;
</script>

<BlogPost
	category="Fundamentals"
	title="Onboarding email best practices (with examples and templates)"
	excerpt="A practical guide to onboarding email sequences: what an onboarding email is, how to time and structure the welcome-to-activation flow, the best practices that matter (subject lines, personalization, a single CTA, the metrics to track), teardown examples, copy-paste templates, and how to send the sequence programmatically."
	metaDescription="A practical guide to onboarding emails: sequence timing and structure, best practices, real examples, copy-paste templates, and how to send them with an API."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="June 12, 2026"
	datetime="2026-06-12"
	readTime="9 min read"
	slug="onboarding-email-best-practices"
>
	<Lead>
		An onboarding email is a message sent to a new user or customer to help them start using a product
		and reach its value quickly. It rarely works as a single email, but as a short sequence (a welcome,
		a setup nudge, an activation prompt, and a check-in) timed across the first days of an account. Each
		message has one job, to move the user a step closer to the product's value, and the
		sequence works best when every email earns the next one rather than arriving on a fixed
		schedule.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Onboarding is a sequence, not one email</strong>: welcome, then setup, then
				activation, then a check-in, spaced over the first one to two weeks.
			</li>
			<li>
				<strong>One message, one job</strong>: every email points at a single next action, and the
				subject line names it plainly.
			</li>
			<li>
				<strong>Activation is the metric that matters</strong>: opens and clicks are leading
				signals, but the number worth optimizing is how many new users reach the product's first
				meaningful action.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What is an onboarding email</Heading>

	<Paragraph>
		An onboarding email is an automated message triggered by a user action, usually a signup, that
		guides the recipient toward getting value from a product. <strong>It is a transactional message,
		not a marketing one</strong>: it goes to one person in response to something they just did, rather
		than to a list on a publishing schedule. A welcome email confirming an account, a prompt to finish
		setup, and a nudge to try a key feature are all onboarding emails.
	</Paragraph>

	<Paragraph>
		The distinction matters for deliverability and tone. <strong>Onboarding mail is expected and
		personal</strong>, which is exactly the profile mailbox providers treat most favorably, so it
		tends to reach the inbox and earn high open rates. That also raises the stakes on getting it right,
		because a welcome email is often the first thing a new user reads from a product and sets the tone
		for everything after. For the line between this and bulk sending, see
		<a href="/blog/separate-transactional-and-marketing-email/">why you should separate transactional
		and marketing email</a>.
	</Paragraph>

	<Heading level={2}>Onboarding sequence timing and structure</Heading>

	<Paragraph>
		A good onboarding sequence mirrors the path a new user actually takes, from "I just signed up" to
		"I understand why I'm here." <strong>Four stages cover almost every product</strong>, each with a
		different job and its own rough timing. The exact gaps depend on how long the product takes to
		show value, but the order holds.
	</Paragraph>

	<List>
		<li>
			<strong>Welcome (immediately).</strong> Sent the moment someone signs up, while intent is at its
			peak. It confirms the account, sets expectations, and points at the single first action that
			leads to value. This is the highest-engagement email in the whole sequence, so it carries the
			most important call to action.
		</li>
		<li>
			<strong>Setup (day 1 to 3).</strong> A nudge for anyone who signed up but has not finished the
			steps that make the product useful: connecting a data source, inviting a teammate, importing a
			list. Trigger it on the missing step rather than on a timer, so users who already finished never
			receive it.
		</li>
		<li>
			<strong>Activation (day 3 to 7).</strong> A prompt toward the product's core action, the thing a
			user does when they have genuinely adopted it. The message names one feature and one reason to
			try it now, rather than touring everything the product can do.
		</li>
		<li>
			<strong>Check-in (day 7 to 14).</strong> A lighter, often plain-text message asking how it is
			going and offering help. It re-engages users who stalled and opens a reply channel for the ones
			who have questions but have not asked.
		</li>
	</List>

	<Paragraph>
		The principle underneath the timing is <strong>trigger on behavior, not just on the clock</strong>.
		A purely time-based drip sends the "finish setup" email to people who already finished, which reads
		as if the product is not paying attention. Keying each message to what the user has and has not done
		keeps the sequence relevant and stops it the moment it is no longer needed.
	</Paragraph>

	<Callout variant="tip" title="Let the sequence end early">
		The goal of onboarding is activation, not completion of the email series. When a user reaches the
		core action, the remaining nudges should stop. A sequence that keeps sending "finish setup" to an
		already-active user trains them to ignore the sender, which costs more than the email gains.
	</Callout>

	<Heading level={2}>Onboarding email best practices</Heading>

	<Paragraph>
		Most of what separates an onboarding email that works from one that gets ignored comes down to a
		handful of choices, and <strong>nearly all of them push in the same direction: less</strong>. A
		new user has limited attention and one question, which is what to do next. The practices below all
		serve answering it.
	</Paragraph>

	<List>
		<li>
			<strong>Write subject lines that name the action.</strong> "Finish setting up your account"
			beats "Welcome aboard!" because it tells the reader what is inside and what to do. Keep it under
			roughly 50 characters so it survives truncation on mobile, and skip the exclamation marks and
			emoji that read as marketing.
		</li>
		<li>
			<strong>Personalize with data, not just a first name.</strong> A merge tag for the name is the
			floor. The personalization that changes behavior references what the user actually did:
			the plan they chose, the integration they connected, the step they still have open.
		</li>
		<li>
			<strong>Give each email a single call to action.</strong> One button, one job. Multiple
			competing links split attention and lower the odds of any of them being clicked. If a message
			seems to need two CTAs, it is usually two emails.
		</li>
		<li>
			<strong>Keep the body short and mostly text.</strong> Onboarding mail is read fast and often on
			a phone. A few sentences leading to one button outperforms a designed, image-heavy layout, and a
			high text-to-image ratio also keeps the message clear of spam filters.
		</li>
	</List>

	<Paragraph>
		One practice sits above the rest: <strong>send from a real, monitored address and invite
		replies</strong>. A welcome email from <code>noreply@</code> signals that the door only opens
		outward. Sending onboarding mail from an address a person reads turns the first email into the
		start of a conversation, which is the entire point of onboarding.
	</Paragraph>

	<Heading level={3}>Metrics to track</Heading>

	<Paragraph>
		The numbers worth watching form a funnel, and <strong>the one at the bottom is the only one that
		pays the bills</strong>. Open and click rates are leading indicators that tell you whether the
		subject line and CTA are working, but they are means, not the end.
	</Paragraph>

	<List>
		<li>
			<strong>Open rate</strong> shows whether the subject line earns attention. For triggered
			onboarding mail it runs high, often well above marketing benchmarks, because the message is
			expected.
		</li>
		<li>
			<strong>Click-through rate</strong> shows whether the body and CTA move people to act. A healthy
			open rate with a weak click rate points at the message, not the subject line.
		</li>
		<li>
			<strong>Activation rate</strong> is the share of new users who reach the product's core action.
			This is the metric the whole sequence exists to move, and it is the one to optimize when the
			others look fine but growth does not follow.
		</li>
	</List>

	<Heading level={2}>Onboarding email examples</Heading>

	<Paragraph>
		The patterns above are easier to read off a real message than off a rule. Each mockup below is one
		stage of the sequence shown the way it would land in an inbox, with <strong>a short teardown of the
		choices that make it work</strong> underneath.
	</Paragraph>

	{#each examples as example}
		<!-- Title + context use the article's native heading/paragraph styling, so the
		     examples read as ordinary subsections; only the mockup card is custom. -->
		<Heading level={3}>{example.name}</Heading>

		<Paragraph>{example.summary}</Paragraph>

		<div class="not-prose my-6">
			<article class="border border-border/50 bg-white shadow-[0_20px_50px_-45px_rgba(17,24,39,0.6)]">
				<!-- Mock client chrome: subject line as it shows in an inbox list -->
				<div class="flex items-center gap-2 border-b border-border/50 px-5 py-3">
					<span class="bg-background border border-border/50 px-2 py-0.5 text-[9px] font-medium tracking-wide text-surface uppercase">
						{example.stage}
					</span>
					<div class="h-px flex-1 bg-border/50"></div>
				</div>

				<div class="p-5 text-[11px] leading-relaxed text-muted sm:p-6">
					<!-- Subject -->
					<p class="mb-1 text-[8px] font-semibold tracking-[0.12em] text-muted uppercase">Subject</p>
					<p class="mb-4 text-[12px] font-semibold text-surface">{example.subject}</p>

					<!-- Heading -->
					<p class="mb-2 text-[13px] font-bold text-surface">{example.title}</p>

					<!-- Greeting + body -->
					<p class="mb-2">{example.greeting}</p>
					<p class="mb-4">{example.body}</p>

					<!-- CTA -->
					<div class="mb-4">
						<span class="inline-block bg-surface px-3 py-1.5 text-[10px] font-semibold text-white">{example.cta}</span>
					</div>

					{#if example.detail}
						<!-- Detail block -->
						<div class="border border-border/40 bg-background/60 p-2.5">
							<p class="mb-1 text-[8px] font-semibold tracking-[0.12em] text-muted uppercase">{example.detail.label}</p>
							<p class="text-[9px] text-surface">{example.detail.value}</p>
						</div>
					{/if}
				</div>
			</article>
		</div>

		<!-- Teardown: why this one works. Uses the blog List styling so the red dots
		     stay baseline-aligned, matching every other bullet list in the article. -->
		<List>
			{#each example.breakdown as item}
				<li><strong>{item.point}</strong>{item.rest}</li>
			{/each}
		</List>
	{/each}

	<Heading level={2}>Copy-paste onboarding email templates</Heading>

	<Paragraph>
		Here is each mockup above as copy-paste source, in the same order. <strong>Each uses
		<code>{'{{merge_tag}}'}</code> placeholders</strong> for the values a sending system fills in per
		recipient, in the same syntax Lettr templates use. Adapt the voice to the product and keep the
		structure: one clear action, short body, reply-friendly close.
	</Paragraph>

	<Heading level={3}>Welcome email</Heading>

	<Paragraph>The first message, sent the moment someone signs up:</Paragraph>

	<Code lang="text" code={welcomeTemplate} />

	<Heading level={3}>Activation nudge</Heading>

	<Paragraph>The follow-up to a user who stalled before the core action:</Paragraph>

	<Code lang="text" code={nudgeTemplate} />

	<Heading level={3}>Appointment reminder</Heading>

	<Paragraph>The reminder for a booking or scheduling product, sent the day before:</Paragraph>

	<Code lang="text" code={reminderTemplate} />

	<Heading level={2}>How to send them programmatically</Heading>

	<Paragraph>
		Onboarding mail is triggered by events in a product (a signup, a finished setup step, an upcoming
		appointment), so it is sent from code rather than a campaign tool. <strong>The core operation is a
		single API call that combines a stored template with per-recipient data</strong>. With the
		<a href="https://docs.lettr.com/quickstart/nodejs/introduction">Lettr SDK</a>, sending the welcome
		template from the signup handler looks like this:
	</Paragraph>

	<Code lang="javascript" code={sendTemplate} />

	<Paragraph>
		The template lives in Lettr and the call passes only the data, so <strong>the copy can change
		without a deploy</strong>. The merge tags in the template resolve against the
		<code>substitution_data</code> object, which is where personalizing on real user data, the plan or
		the open setup step, happens.
	</Paragraph>

	<Paragraph>
		The later stages of the sequence are scheduled rather than sent at once. <strong>Scheduling an
		email for a future moment is one parameter</strong>, an ISO timestamp, which turns the immediate
		send into a drip. Queue the day-three setup nudge from the same signup handler:
	</Paragraph>

	<Code lang="javascript" code={scheduleSend} />

	<Paragraph>
		Behavioral triggering layers on top. <strong>Cancel a scheduled nudge when the user completes the
		step it was meant to prompt</strong>, so the sequence stops the moment it is no longer needed, and
		delivery, bounce, and open events arrive over
		<a href="https://docs.lettr.com/learn/webhooks/introduction">webhooks</a> to feed the activation
		metrics above. Because onboarding mail and any marketing sends can share the same account and
		domains, the sequence and the broader lifecycle stay in one place.
	</Paragraph>

	<Callout variant="info">
		On <a href="https://app.lettr.com/register">Lettr</a>, onboarding emails send through the same
		transactional API and <a href="https://docs.lettr.com/learn/api-keys/introduction">templates</a>
		shown here, with scheduling, webhooks, and authenticated domains built in, so the whole sequence
		runs from your application code without a separate marketing tool.
	</Callout>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="What is an onboarding email?">
			<strong>An onboarding email is an automated message sent to a new user or customer to help them
			start using a product and reach its value.</strong> It is usually triggered by a signup and sent
			as a short sequence (welcome, setup, activation, check-in) over the first days of an account,
			rather than as a single message.
		</FaqItem>

		<FaqItem question="How many emails should an onboarding sequence have?">
			<strong>Three to five emails covers most products.</strong> A typical sequence is a welcome,
			one or two setup or activation nudges, and a check-in, spread across the first one to two weeks.
			More than that risks fatiguing a new user, and the sequence should end early once the user
			reaches the core action.
		</FaqItem>

		<FaqItem question="What should the first onboarding email say?">
			<strong>The first email should confirm the account and point at a single first action.</strong>
			Keep it short, name one thing to do next with one button, skip the full feature tour, and invite
			a reply. It is the highest-engagement message in the sequence, so it carries the most important
			call to action.
		</FaqItem>

		<FaqItem question="Are onboarding emails transactional or marketing?">
			<strong>Onboarding emails are transactional.</strong> Each one is triggered by an individual
			user's action and sent to that one person, which is the defining trait of transactional mail.
			Sending them on a transactional path, separate from bulk marketing, also keeps their
			deliverability high.
		</FaqItem>

		<FaqItem question="What is a good open rate for onboarding emails?">
			<strong>Triggered onboarding emails commonly open at well above marketing rates</strong> because
			the recipient expects them and they arrive right after an action. Open rate is a useful leading
			signal, but activation rate, the share of users who reach the core action, is the number worth
			optimizing.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		An onboarding sequence is a few focused emails, each triggered by where the user is and each
		pointing at one next action. <strong>Welcome immediately, nudge setup and activation on behavior,
		check in once, and stop when the user is active.</strong>
	</Paragraph>

	<Paragraph>
		Because every message is event-triggered, the sequence belongs in application code, and Lettr sends
		all of it through one transactional API with templates, scheduling, and webhooks included.
		<a href="https://app.lettr.com/register">Create a free account</a> and send your first welcome
		email from a verified domain.
	</Paragraph>
</BlogPost>
