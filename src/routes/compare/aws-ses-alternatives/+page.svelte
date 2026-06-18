<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import TalkToExpert from '$lib/components/TalkToExpert.svelte';
	import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import MinusIcon from 'phosphor-svelte/lib/MinusIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	let hero: HTMLElement | undefined = $state();
	let reasonsSection: HTMLElement | undefined = $state();
	let tableSection: HTMLElement | undefined = $state();
	let breakdownSection: HTMLElement | undefined = $state();
	let migrationSection: HTMLElement | undefined = $state();
	let faqSection: HTMLElement | undefined = $state();
	let finalCtaSection: HTMLElement | undefined = $state();
	let registerHref: string = $state(registerUrl);
	let openFaq: number | null = $state(null);

	function trackCta(
		placement: string,
		label: string,
		href: string,
		variant: 'primary' | 'secondary'
	) {
		void capturePosthogEvent('cta_clicked', {
			placement,
			label,
			href,
			variant,
			destination_type: /^https?:\/\//.test(href) ? 'external' : 'internal'
		});
		if (variant === 'primary' && /register/.test(href)) {
			trackSignupClick(placement, href);
		}
	}

	function toggleFaq(i: number) {
		const wasOpen = openFaq === i;
		openFaq = wasOpen ? null : i;
		void capturePosthogEvent('faq_toggled', {
			index: i,
			question: faqs[i].question,
			opened: !wasOpen
		});
	}

	// The friction that sends SES users looking — three concrete places it bites.
	const reasons = [
		{
			title: 'No real dashboard',
			body: 'SES is an API and a line on your AWS bill — no screen for browsing sends, opening a message, or seeing why one bounced. You wire up CloudWatch and SNS and build that view yourself.'
		},
		{
			title: 'Setup is a project',
			body: 'Before one email goes out: IAM users and policies, verified identities, a configuration set, and an SNS topic wired to a queue just to catch bounces.'
		},
		{
			title: 'Sandbox, then quota tickets',
			body: 'New accounts can only email verified addresses until a support ticket frees them. Raising your send limit is another ticket — usually right when you are growing.'
		}
	];

	// Comparison cells: status drives the icon, label is the text shown.
	// status: 'yes' (check) | 'no' (x) | 'partial' (dash) | 'info' (plain text)
	type Cell = { label: string; status: 'yes' | 'no' | 'partial' | 'info' };
	type Row = { feature: string; lettr: Cell; ses: Cell; sendgrid: Cell; postmark: Cell };

	const columns = ['Lettr', 'AWS SES', 'SendGrid', 'Postmark'];

	const rows: Row[] = [
		{
			feature: 'Dashboard & UI',
			lettr: { label: 'Full UI for sends, contacts & logs', status: 'yes' },
			ses: { label: 'Bare console', status: 'no' },
			sendgrid: { label: 'Full dashboard', status: 'yes' },
			postmark: { label: 'Clean, focused UI', status: 'yes' }
		},
		{
			feature: 'Setup & onboarding',
			lettr: { label: 'API key + guided wizard', status: 'yes' },
			ses: { label: 'IAM, identities, SNS, config sets', status: 'no' },
			sendgrid: { label: 'Moderate', status: 'partial' },
			postmark: { label: 'Fast', status: 'yes' }
		},
		{
			feature: 'Template editor',
			lettr: { label: 'Drag-and-drop (Topol)', status: 'yes' },
			ses: { label: 'None — code only', status: 'no' },
			sendgrid: { label: 'Included', status: 'yes' },
			postmark: { label: 'Layouts, no visual builder', status: 'partial' }
		},
		{
			feature: 'Per-email analytics & logs',
			lettr: { label: 'Per-message, searchable', status: 'yes' },
			ses: { label: 'CloudWatch counters only', status: 'no' },
			sendgrid: { label: 'Activity feed', status: 'yes' },
			postmark: { label: 'Detailed message events', status: 'yes' }
		},
		{
			feature: 'Deliverability tooling',
			lettr: { label: 'Guided SPF/DKIM/DMARC + alerts', status: 'yes' },
			ses: { label: 'Manual DNS, no guidance', status: 'partial' },
			sendgrid: { label: 'Standard auth', status: 'partial' },
			postmark: { label: 'Strong focus', status: 'yes' }
		},
		{
			feature: 'Sandbox / sending limits',
			lettr: { label: 'No sandbox; scales with use', status: 'yes' },
			ses: { label: 'Sandbox + ticket-based quotas', status: 'no' },
			sendgrid: { label: 'Tier-based', status: 'partial' },
			postmark: { label: 'Approval on signup', status: 'partial' }
		},
		{
			feature: 'API & SMTP relay',
			lettr: { label: 'REST API, SMTP, SDKs', status: 'yes' },
			ses: { label: 'Solid API & SMTP', status: 'yes' },
			sendgrid: { label: 'Full API & SMTP', status: 'yes' },
			postmark: { label: 'Excellent API & SMTP', status: 'yes' }
		},
		{
			feature: 'Pricing model',
			lettr: { label: 'Usage-based, tools included', status: 'info' },
			ses: { label: '$0.10 / 1k emails, infra extra', status: 'info' },
			sendgrid: { label: 'Per email, tiered', status: 'info' },
			postmark: { label: 'Per email, prepaid', status: 'info' }
		},
		{
			feature: 'Cost at very high volume',
			lettr: { label: 'Competitive', status: 'partial' },
			ses: { label: 'Cheapest at scale', status: 'yes' },
			sendgrid: { label: 'Higher than SES', status: 'partial' },
			postmark: { label: 'Higher than SES', status: 'partial' }
		}
	];

	// Honest one-line take on each — SES's "Great for" is where it genuinely still wins.
	const breakdown = [
		{
			name: 'Lettr',
			highlight: true,
			summary: 'SES-grade sending with the dashboard, editor, and logs already built in.',
			goodFor: 'teams that want reliable API and SMTP sending without building the tooling around it.',
			watch: 'newer than the incumbents, and not the cheapest per email at very high volume.'
		},
		{
			name: 'AWS SES',
			highlight: false,
			summary: 'The cheapest, most bare-bones sending engine there is.',
			goodFor: 'huge volume, deep AWS-native integration, and teams happy to build their own tooling.',
			watch: 'no dashboard or editor, a sandbox to escape, and analytics that stop at CloudWatch.'
		},
		{
			name: 'SendGrid',
			highlight: false,
			summary: 'A broad platform covering both transactional and marketing.',
			goodFor: 'larger programs that want both kinds of email under one roof.',
			watch: 'pricier than SES, and the breadth can feel heavy for a simple transactional need.'
		},
		{
			name: 'Postmark',
			highlight: false,
			summary: 'Fast, focused, transactional-only sending with strong deliverability.',
			goodFor: 'speed-obsessed transactional teams with no marketing email to send.',
			watch: 'no visual template builder, an approval review on signup, and higher cost than SES.'
		}
	];

	const faqs = [
		{
			question: 'What is the best AWS SES alternative?',
			answer:
				'It comes down to what you want SES to stop making you build. If you want the same reliable sending plus a dashboard, a template editor, searchable logs, and a guided deliverability setup, Lettr is the closest fit — REST API and SMTP relay included. Postmark is a strong pick for transactional-only teams that care most about speed, and SendGrid suits larger programs mixing transactional and marketing. SES itself is still right for teams happy to build their own layer in return for the lowest per-email price.'
		},
		{
			question: 'Why do people switch away from AWS SES?',
			answer:
				'Mostly because SES is a sending engine, not a product. There is no real dashboard, getting a first email out takes IAM, identities, configuration sets, and SNS plumbing, new accounts sit in a sandbox until a support ticket frees them, and analytics stop at CloudWatch counters. The sending stays cheap; the dashboard, logs, templates, and deliverability tooling around it are all on you.'
		},
		{
			question: 'Is Lettr cheaper than AWS SES?',
			answer:
				'On the raw per-email line, no — at $0.10 per 1,000 emails SES wins at high volume, full stop. Lettr usually wins on total cost. SES gives you only the engine, so the dashboard, analytics, searchable logs, template editor, and deliverability monitoring are tooling you build or buy on top. Lettr includes all of it and starts free up to 3,000 emails a month, then from $15/month — so once you count the engineering time, most teams come out lower.'
		},
		{
			question: 'Does Lettr deliver as well as AWS SES?',
			answer:
				'Yes. Lettr sets up SPF, DKIM, and DMARC for you and watches your reputation, flagging it when bounce rates climb or a domain lands on a blocklist. SES gives you the same reliable infrastructure but leaves all of the authentication and monitoring to you. Both reach the inbox; Lettr just keeps it that way without you building the tooling.'
		},
		{
			question: 'How hard is it to migrate from AWS SES to Lettr?',
			answer:
				'It is a config change, not a rewrite. Swap your SES API call or SMTP credentials for Lettr ones, verify your domain through the guided SPF/DKIM/DMARC setup, and bring your templates over. Since Lettr speaks the same REST API and SMTP that you already use, most codebases only need new credentials — and you can run both side by side during the cutover so there is no downtime.'
		}
	];

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);

		const cleanups: (() => void)[] = [];

		if (hero) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: hero,
					targets: '[data-animate]',
					vars: { y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
				})
			);
		}

		for (const section of [
			reasonsSection,
			tableSection,
			breakdownSection,
			migrationSection,
			faqSection,
			finalCtaSection
		]) {
			if (section) {
				cleanups.push(
					createScrollRevealCleanup({
						scope: section,
						targets: '[data-reveal]'
					})
				);
			}
		}

		return () => cleanups.forEach((fn) => fn());
	});
</script>

<Seo
	title="AWS SES Alternative: 4 Top Picks Compared (2026) | Lettr"
	description="Looking for an AWS SES alternative? Compare Lettr, SES, SendGrid, and Postmark on setup, dashboard, analytics, templates, deliverability, and pricing — an honest breakdown to help you switch."
	ogTitle="The Best AWS SES Alternative, Compared"
	ogDescription="An honest comparison of AWS SES alternatives on setup ease, UI, analytics, templates, deliverability, and pricing."
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: { '@type': 'Answer', text: faq.answer }
		}))
	})}<\/script>`}
</svelte:head>

<!-- Hero -->
<section bind:this={hero} class="pt-30 pb-20 border-b border-border/30">
	<a
		href="/compare/"
		class="mb-10 flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-surface"
	>
		<ArrowLeftIcon size={14} />
		All comparisons
	</a>

	<h1 data-animate class="text-surface mb-5 max-w-[16ch]">
		Looking for an <span class="text-primary">AWS SES alternative?</span>
	</h1>
	<p data-animate class="max-w-[58ch] text-body text-muted mb-8">
		SES is a cheap, reliable sending engine. But the moment you want a dashboard, a template editor, or
		logs you can search, you're building it yourself. Here's an honest look at your options — including
		where SES is still the right call.
	</p>

	<div data-animate class="flex flex-wrap items-center gap-2">
		<Button
			variant="primary"
			href={registerHref}
			onclick={() => trackCta('aws_ses_alt_hero', 'Try Lettr free', registerHref, 'primary')}
		>Try Lettr free</Button>
		<Button
			variant="secondary"
			href="#comparison"
			onclick={() => trackCta('aws_ses_alt_hero', 'See the comparison', '#comparison', 'secondary')}
		>See the comparison</Button>
	</div>
</section>

<!-- Why people look past SES -->
<section bind:this={reasonsSection} class="py-20 border-b border-border/30">
	<h2 data-reveal class="mb-3 text-surface max-w-[18ch]">
		Why teams start looking elsewhere
	</h2>
	<p data-reveal class="text-body text-muted max-w-[55ch] mb-12">
		SES is great at cheap, reliable delivery. The friction shows up in everything around the send.
	</p>

	<div class="grid gap-8 sm:grid-cols-3">
		{#each reasons as reason, i}
			<div data-reveal>
				<div class="mb-3 font-code text-sm text-primary">0{i + 1}</div>
				<h3 class="mb-2 text-base font-semibold text-surface">{reason.title}</h3>
				<p class="text-sm leading-relaxed text-muted">{reason.body}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Comparison table -->
<section bind:this={tableSection} id="comparison" class="py-20 border-b border-border/30">
	<h2 data-reveal class="mb-3 text-surface max-w-[20ch]">
		The short version
	</h2>
	<p data-reveal class="text-body text-muted max-w-[55ch] mb-12">
		Just the things that decide it — setup, tooling, deliverability, price. No 40-row feature matrix.
	</p>

	<div data-reveal class="overflow-x-auto border border-border/40 bg-white">
		<table class="w-full min-w-[760px] border-collapse text-left">
			<thead>
				<tr class="border-b border-border/40">
					<th class="p-4 text-[11px] font-medium uppercase tracking-wider text-muted/70">&nbsp;</th>
					{#each columns as col, ci}
						<th class="p-4 text-sm font-semibold {ci === 0 ? 'text-primary' : 'text-surface'}">{col}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each rows as row, i}
					<tr class="{i < rows.length - 1 ? 'border-b border-border/20' : ''}">
						<td class="p-4 align-top text-sm font-medium text-surface">{row.feature}</td>
						{#each [row.lettr, row.ses, row.sendgrid, row.postmark] as cell}
							<td class="p-4 align-top">
								<div class="flex items-start gap-2 text-sm {cell.status === 'no' ? 'text-muted/70' : 'text-muted'}">
									{#if cell.status === 'yes'}
										<CheckIcon size={16} class="mt-0.5 shrink-0 text-primary" />
									{:else if cell.status === 'no'}
										<XIcon size={16} class="mt-0.5 shrink-0 text-muted/50" />
									{:else if cell.status === 'partial'}
										<MinusIcon size={16} class="mt-0.5 shrink-0 text-muted/50" />
									{:else}
										<span class="w-4 shrink-0" aria-hidden="true"></span>
									{/if}
									<span>{cell.label}</span>
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p data-reveal class="mt-4 text-xs text-muted/70">
		Based on publicly documented features and pricing as of 2026; details change. See the full
		<a href="/compare/sendgrid/" class="text-primary underline underline-offset-2">Lettr vs SendGrid</a>
		and
		<a href="/compare/postmark/" class="text-primary underline underline-offset-2">Lettr vs Postmark</a>
		breakdowns for more.
	</p>
</section>

<!-- Per-alternative breakdown -->
<section bind:this={breakdownSection} class="py-20 border-b border-border/30">
	<h2 data-reveal class="mb-3 text-surface max-w-[20ch]">
		A quick, honest take on each
	</h2>
	<p data-reveal class="text-body text-muted max-w-[55ch] mb-12">
		No tool wins for everyone — ours included. Here's where each one is strong and where it isn't.
	</p>

	<div class="grid gap-4 sm:grid-cols-2">
		{#each breakdown as option}
			<div
				data-reveal
				class="border bg-white p-6 {option.highlight ? 'border-primary/40' : 'border-border/40'}"
			>
				<div class="mb-2 flex items-center gap-3">
					<h3 class="text-base font-semibold text-surface">{option.name}</h3>
					{#if option.highlight}
						<span class="border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
							Our pick
						</span>
					{/if}
				</div>
				<p class="mb-5 text-sm leading-relaxed text-muted">{option.summary}</p>

				<div class="flex items-start gap-2 text-sm text-muted">
					<CheckIcon size={15} class="mt-0.5 shrink-0 text-primary" />
					<span><span class="text-surface">Great for:</span> {option.goodFor}</span>
				</div>
				<div class="mt-2 flex items-start gap-2 text-sm text-muted">
					<XIcon size={15} class="mt-0.5 shrink-0 text-muted/50" />
					<span><span class="text-surface">Watch out:</span> {option.watch}</span>
				</div>
			</div>
		{/each}
	</div>

	<p data-reveal class="mt-8 text-body text-muted max-w-[60ch]">
		The reason most teams leaving SES land on Lettr: the same reliable sending, but with a clean
		<a class="text-primary underline underline-offset-2" href="/email-api/">developer API</a>
		for engineers, a
		<a class="text-primary underline underline-offset-2" href="/email-marketing/">drag-and-drop editor</a>
		for everyone else, and searchable per-email logs so you can see exactly what landed — none of it to
		build yourself.
	</p>
</section>

<!-- Migration note -->
<section bind:this={migrationSection} class="py-20 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
		<div data-reveal>
			<h2 class="mb-4 text-surface max-w-[16ch]">Switching is mostly a settings change</h2>
			<p class="text-body text-muted mb-8 max-w-[50ch]">
				Moving off SES doesn't mean rewriting anything. Point your app at Lettr over the REST API or
				SMTP and you're sending in minutes, with no downtime.
			</p>
			<ol class="space-y-4">
				<li class="flex items-start gap-3 text-sm text-muted">
					<span class="font-code text-xs text-primary mt-0.5">01</span>
					<span><span class="text-surface font-medium">Swap your credentials</span> — replace your SES key or SMTP login with Lettr's.</span>
				</li>
				<li class="flex items-start gap-3 text-sm text-muted">
					<span class="font-code text-xs text-primary mt-0.5">02</span>
					<span><span class="text-surface font-medium">Verify your domain</span> with the guided SPF, DKIM &amp; DMARC wizard.</span>
				</li>
				<li class="flex items-start gap-3 text-sm text-muted">
					<span class="font-code text-xs text-primary mt-0.5">03</span>
					<span><span class="text-surface font-medium">Bring your templates over</span> — rebuild in the editor or paste your HTML.</span>
				</li>
			</ol>
			<div class="mt-8 flex flex-wrap gap-2">
				<Button
					variant="secondary"
					href="/smtp-relay/"
					onclick={() => trackCta('aws_ses_alt_migration', 'SMTP relay', '/smtp-relay/', 'secondary')}
				>SMTP relay</Button>
				<Button
					variant="secondary"
					href="/free-email-api/"
					onclick={() => trackCta('aws_ses_alt_migration', 'Free email API', '/free-email-api/', 'secondary')}
				>Free email API</Button>
			</div>
		</div>

		<div data-reveal class="border border-border/40 bg-white p-6">
			<p class="text-sm leading-relaxed text-muted">
				<span class="text-surface">The short version:</span> your sending code stays the same. No more
				IAM policies, config sets, or SNS topics to maintain, every send and bounce shows up in one
				searchable dashboard, and there's no sandbox or quota ticket to deal with.
			</p>
		</div>
	</div>
</section>

<TalkToExpert />

<!-- FAQ -->
<section bind:this={faqSection} class="py-16 border-b border-border/30">
	<h2 data-reveal class="mb-10 text-surface">A few common questions</h2>

	<div class="space-y-0">
		{#each faqs as faq, i}
			<div data-reveal class="{i < faqs.length - 1 ? 'border-b border-border/20' : ''}">
				<button
					onclick={() => toggleFaq(i)}
					class="flex w-full items-center justify-between py-5 text-left"
				>
					<h3 class="text-sm font-medium text-surface">{faq.question}</h3>
					<CaretDownIcon
						size={14}
						class="shrink-0 ml-4 text-muted transition-transform duration-200 {openFaq === i ? 'rotate-180' : ''}"
					/>
				</button>
				{#if openFaq === i}
					<div transition:slide={{ duration: 200 }}>
						<p class="text-[13px] text-muted leading-relaxed max-w-[65ch] pb-5">{faq.answer}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

<!-- Final CTA -->
<section bind:this={finalCtaSection} class="py-20">
	<div data-reveal class="flex flex-col items-center text-center">
		<h2 class="mb-3 text-surface max-w-[16ch]">
			SES sending, <span class="text-primary">tooling included.</span>
		</h2>
		<p class="mb-8 max-w-[46ch] text-body text-muted">
			Keep the reliable, API-first delivery. Get the dashboard, analytics, editor, and deliverability
			tooling SES leaves to you — free to start, no card.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-2">
			<Button
				variant="primary"
				href={registerHref}
				onclick={() => trackCta('aws_ses_alt_footer', 'Try Lettr free', registerHref, 'primary')}
			>Try Lettr free</Button>
			<Button
				variant="secondary"
				href="/compare/"
				onclick={() => trackCta('aws_ses_alt_footer', 'View all comparisons', '/compare/', 'secondary')}
			>View all comparisons</Button>
		</div>
	</div>
</section>
