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
	category="Product"
	title="Meet Adamko, Lettr's AI assistant"
	excerpt="Adamko is Lettr's built-in AI assistant. He sets up a new account from nothing but a website URL, creates branded templates and campaign drafts, diagnoses DNS and delivery problems from live account data, and records every change he makes in a team-wide activity log with one-click undo."
	metaDescription="Adamko is Lettr's built-in AI assistant: account setup from a website URL, branded templates, live deliverability diagnosis, and one-click undo."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="August 14, 2026"
	datetime="2026-08-14"
	readTime="5 min read"
	slug="meet-adamko"
>
	<Lead>
		Adamko is Lettr's built-in AI assistant. He lives in a chat drawer in the dashboard and does
		real work in the account: ask him to set up a fresh account and he builds a brand kit from the
		company website, scaffolds branded transactional emails, and registers a sending domain; ask
		why a specific recipient never got an email and he pulls the delivery events and suppression
		records and names the likely cause. Every answer draws on live data from the account, and
		every change he makes lands in an activity log where it can be undone.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Adamko does real work</strong>: full account setup from a website URL, branded
				templates and campaign drafts, and diagnostics that pull live DNS, event, and suppression
				data.
			</li>
			<li>
				<strong>He never sends.</strong> Sending, scheduling, and segment membership stay human
				actions, and everything he does create is logged team-wide with one-click undo.
			</li>
			<li>
				<strong>He answers with a button</strong>: replies carry guided walkthroughs that highlight
				the exact field, and nudges flag problems before anyone goes looking.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>Not a search box over the docs</Heading>

	<Paragraph>
		Adamko's answers are grounded in <strong>live data from the account</strong>: its domains,
		campaigns, event history, and suppression lists. The question "what's my bounce rate this
		week?" triggers a real query, and "why isn't my domain verifying?" triggers a DNS lookup at
		that moment, not a recitation of what SPF is. When the answer genuinely lives in the
		documentation, he searches it and cites the article.
	</Paragraph>

	<Paragraph>
		Adamko is also Lettr's second AI surface, and the two are complementary. The
		<a href="/blog/managing-lettr-from-your-ai-assistant/">MCP integration</a> brings the Lettr API
		into an external assistant such as Claude or Cursor, which suits developers already working in
		one. Adamko lives inside the dashboard, needs no setup, and can do things an API call cannot,
		like highlighting the exact button a task needs next.
	</Paragraph>

	<Heading level={2}>Account setup from a website URL</Heading>

	<Paragraph>
		The flagship flow is onboarding. On a fresh account, Adamko offers to set everything up from a
		single input: the company's website URL. He visits the site and builds a
		<strong>brand kit</strong> from it (logo, brand colors, fonts, tone of voice, and the language
		the site is written in), then recommends a set of transactional emails that fits the business.
		A SaaS gets welcome, verification, password reset, and invoice emails pre-selected; an
		e-commerce store gets a different mix, and billing emails are never suggested to a site that
		doesn't charge anyone.
	</Paragraph>

	<Paragraph>
		After one confirmation, he creates the selected templates in the brand design with a shared
		header and footer, registers a sending domain, and issues the first API key together with a
		working integration snippet for the chosen stack. The one thing he cannot do is
		<strong>edit DNS at the registrar</strong>. He shows the exact records to add, each value
		click-to-copy, and confirms them with a live check once they are in place.
	</Paragraph>

	<Callout variant="info">
		The complete flow, including the brand kit contents and the transactional email catalog, is
		documented in
		<a href="https://docs.lettr.com/learn/ai-assistant/onboarding-and-setup"
			>Onboarding &amp; setup with Adamko</a
		>.
	</Callout>

	<Heading level={2}>Templates, campaigns, and a plan</Heading>

	<Paragraph>
		Content creation runs off the same brand kit. Adamko scaffolds any of the
		<strong>eleven transactional email types</strong> in his catalog, builds custom templates from
		a plain description ("a template announcing our dark mode feature, button linking to the
		settings page"), and drafts whole campaigns: subject line, body copy in the brand voice, layout
		in the brand design. Everything he generates lands in the account as a normal, fully editable
		template or draft; there is no separate "AI content" silo.
	</Paragraph>

	<Paragraph>
		Two smaller jobs round this out. Before a big send, he can <strong>review a template</strong>
		for broken merge tags, a missing unsubscribe link, layout risks, and spam triggers, each
		finding with a concrete fix. And "plan my campaigns for next quarter" produces a dated sending
		calendar grounded in the account's real audience sizes and remaining quota, drafted one
		campaign at a time as each is approved.
	</Paragraph>

	<Heading level={2}>Diagnostics from evidence, not guesses</Heading>

	<Paragraph>
		Diagnostics is where Adamko saves the most time, because a delivery problem usually means
		cross-referencing DNS records, event logs, suppression lists, and webhook configs. Adamko pulls
		from all of them at once. The classic support question, "why didn't jane@acme.com receive my
		email?", gets answered <strong>end to end</strong>: he checks the recipient's recent message
		events, the suppression list, and the domain state, and answers with one likely root cause,
		the evidence, and the fix.
	</Paragraph>

	<Paragraph>
		The same applies at account level. "Check my sending health" returns a single verdict
		(healthy, needs attention, or at risk) backed by domain verification state, bounce and
		complaint trends, and suppression estimates. "Why are my API requests failing?" samples the
		recent request logs and webhook configuration and returns issues ordered by severity. On
		verification he is deliberately strict: a domain is only ever called verified after a
		<strong>live DNS check</strong>, never from memory.
	</Paragraph>

	<Callout variant="info">
		The full list of diagnoses, including the DNS mistakes Adamko recognizes, is in
		<a href="https://docs.lettr.com/learn/ai-assistant/troubleshooting-and-diagnostics"
			>Troubleshooting &amp; diagnostics</a
		>.
	</Callout>

	<Heading level={2}>He answers with a button</Heading>

	<Paragraph>
		"Where do I configure X?" gets a button, not a paragraph. For multi-step jobs, replies carry a
		<strong>Guide me</strong> action that opens the right page and walks through the task one
		element at a time: a highlight rings the exact field, a bubble explains the step, and the tour
		advances on its own as each step completes.
	</Paragraph>

	<Paragraph>
		He also watches for a small set of situations worth flagging (a domain unverified for more
		than a day, a bounce rate past the warning threshold, an abandoned campaign draft) and
		surfaces each as a dismissible banner with the diagnosis one click away.
		<strong>Nudges alert; they never act.</strong>
	</Paragraph>

	<Heading level={2}>What he will never do</Heading>

	<Paragraph>
		An assistant with write access needs hard limits, and Adamko's are deliberate. He will
		<strong>never</strong>:
	</Paragraph>

	<List>
		<li><strong>Send or schedule</strong> an email or campaign; sending is always a human click</li>
		<li>
			<strong>Create segments, lists, or topics</strong> on his own; he suggests them and hands off
			to the builder, since membership decides who gets emailed
		</li>
		<li><strong>Invite teammates or change roles</strong></li>
		<li>
			<strong>Reveal an API key</strong>; keys appear once at creation in a copy-once card that
			bypasses the model entirely
		</li>
		<li>
			<strong>Read a dropped file</strong>; a CSV goes straight to the importer, and Adamko sees
			only its structured analysis, never the raw rows
		</li>
	</List>

	<Paragraph>
		Everything he does do is recorded in a <strong>team-wide activity log</strong>: who asked,
		the exact prompt, and what was created, updated, or deleted. Most entries carry an Undo
		button, and the rule for it is not a time limit but "untouched since". A drafted campaign can
		be undone while it is still an unedited draft; a sending domain while it is unverified; a
		template while nobody has changed it. Once a person builds on top of his change, the button
		disappears, because one-click reversal would then destroy human work.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="Can Adamko send emails on his own?">
			<strong>No. Sending and scheduling are always a human click, for every team member.</strong>
			Adamko drafts campaigns and creates templates, but the draft sits in the Campaigns list
			until someone reviews it, picks the audience, and sends it themselves.
		</FaqItem>

		<FaqItem question="What happens if Adamko creates something I didn't want?">
			<strong>Every change is recorded in a team-wide activity log, and most can be undone with
			one click.</strong> Undo stays available while the entity is untouched: an unedited
			template, an unverified domain, a draft nobody has opened. The log itself is permanent, so
			the history of what happened, including reversals, is always visible.
		</FaqItem>

		<FaqItem question="Can Adamko change my DNS records for me?">
			<strong>No. DNS stays at the registrar, and Adamko never touches it.</strong> He shows the
			exact records to add, each value click-to-copy, and once they are in place he confirms them
			with a live DNS lookup rather than guessing. He also recognizes the classic mistakes, such
			as a record added at the wrong host or a Cloudflare-proxied CNAME that should be DNS-only.
		</FaqItem>

		<FaqItem question="Does Adamko work in languages other than English?">
			<strong>Yes. Adamko understands and replies in whatever language a message is written in</strong>,
			whether Czech, German, or Japanese. Templates he generates are written in the website's
			detected language automatically, and he can translate existing generated content while
			preserving the layout, images, links, and merge tags.
		</FaqItem>

		<FaqItem question="Does Adamko have usage limits?">
			<strong>Each team has a monthly AI allowance that refills at the start of every cycle.</strong>
			Heavy work such as template generation draws on it more than quick questions, and when it
			runs out, navigation, quick actions, and everything Adamko already built keep working.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Adamko is the fastest route from an empty Lettr account to a production-ready one, and after
		that, the first place to ask when something misbehaves. Trying him costs nothing:
		<a href="https://app.lettr.com/register">create a free Lettr account</a> and ask him to set
		everything up. Once you're in, the
		<a href="https://docs.lettr.com/learn/ai-assistant/introduction">AI assistant docs</a> walk
		through everything he can do.
	</Paragraph>
</BlogPost>
