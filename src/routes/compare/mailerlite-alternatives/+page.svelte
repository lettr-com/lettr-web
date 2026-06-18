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

	// A few honest reasons people start looking — kept short and plain.
	const reasons = [
		{
			title: 'The price keeps creeping up',
			body: 'MailerLite charges by how many contacts you have, so the bill grows as your list does — even for people who never open a thing.'
		},
		{
			title: 'It does not do transactional email',
			body: 'Password resets and receipts run through a second product, MailerSend. That means two tools, two logins, and two invoices for one job.'
		},
		{
			title: 'The API stops at marketing',
			body: 'Great for managing subscribers and campaigns. Not built to be the email engine behind your app once you start shipping software.'
		}
	];

	// Trimmed comparison — only the rows that actually decide a switch.
	// status drives the icon; label is the text shown.
	type Cell = { label: string; status: 'yes' | 'no' | 'partial' | 'info' };
	type Row = { feature: string; lettr: Cell; mailerlite: Cell; brevo: Cell; resend: Cell };

	const columns = ['Lettr', 'MailerLite', 'Brevo', 'Resend'];

	const rows: Row[] = [
		{
			feature: 'Transactional email',
			lettr: { label: 'Built in', status: 'yes' },
			mailerlite: { label: 'Separate product', status: 'no' },
			brevo: { label: 'Included', status: 'yes' },
			resend: { label: 'Core product', status: 'yes' }
		},
		{
			feature: 'Marketing campaigns',
			lettr: { label: 'Built in', status: 'yes' },
			mailerlite: { label: 'Strong', status: 'yes' },
			brevo: { label: 'Included', status: 'yes' },
			resend: { label: 'Basic only', status: 'partial' }
		},
		{
			feature: 'Both on one bill',
			lettr: { label: 'Yes', status: 'yes' },
			mailerlite: { label: 'No — two products', status: 'no' },
			brevo: { label: 'Yes', status: 'yes' },
			resend: { label: 'Mostly transactional', status: 'partial' }
		},
		{
			feature: 'Developer API',
			lettr: { label: 'Full, with SDKs', status: 'yes' },
			mailerlite: { label: 'Marketing only', status: 'partial' },
			brevo: { label: 'Full', status: 'yes' },
			resend: { label: 'Excellent', status: 'yes' }
		},
		{
			feature: 'Per-email analytics',
			lettr: { label: 'Every message', status: 'yes' },
			mailerlite: { label: 'Campaign level', status: 'partial' },
			brevo: { label: 'Campaign level', status: 'partial' },
			resend: { label: 'Aggregated', status: 'partial' }
		},
		{
			feature: 'Pricing',
			lettr: { label: 'Per email & contact', status: 'info' },
			mailerlite: { label: 'Per subscriber', status: 'info' },
			brevo: { label: 'Per email', status: 'info' },
			resend: { label: 'Per email', status: 'info' }
		}
	];

	// One-line takes instead of stacked pros/cons. Easier to skim, more human.
	const breakdown = [
		{
			name: 'Lettr',
			summary: 'Transactional and marketing email in one place, with a real API.',
			goodFor: 'SaaS teams who send both and want one bill.',
			watch: 'Newer name, and not a website or CRM builder.',
			highlight: true
		},
		{
			name: 'MailerLite',
			summary: 'Still lovely for newsletters, landing pages, and simple automations.',
			goodFor: 'Creators and small businesses with no app behind them.',
			watch: 'No transactional email, and price climbs with your list.',
			highlight: false
		},
		{
			name: 'Brevo',
			summary: 'An all-in-one with marketing, transactional, SMS, and a light CRM.',
			goodFor: 'Teams who want a bit of everything in one tool.',
			watch: 'Can feel busy, and lower plans cap your daily sends.',
			highlight: false
		},
		{
			name: 'Resend',
			summary: 'A clean, modern email API that developers genuinely enjoy.',
			goodFor: 'Engineers sending mostly transactional email.',
			watch: 'No drag-and-drop editor for non-technical teammates.',
			highlight: false
		}
	];

	const faqs = [
		{
			question: 'What is the best MailerLite alternative?',
			answer:
				'It depends on what you send. If you need both transactional and marketing email from one place, Lettr is the simplest fit — one API, one editor, one bill. Brevo is a solid all-in-one, Resend is great for developer-first transactional email, and MailerLite itself is still a fine choice if you only send newsletters.'
		},
		{
			question: 'Does MailerLite do transactional email?',
			answer:
				'Not on its own. MailerLite is a marketing tool. Things like password resets and receipts go through MailerSend, a separate product from the same company with its own API and pricing. Lettr handles both from a single account, so there is no second tool to set up.'
		},
		{
			question: 'Is Lettr cheaper than MailerLite?',
			answer:
				'Often, yes — especially once you factor in MailerSend. Lettr is free up to 3,000 emails a month and 500 marketing contacts, then $15/month for transactional and $10/month for marketing. MailerLite charges by subscriber count, so the price rises as your list grows even if those contacts are inactive.'
		},
		{
			question: 'How hard is it to switch?',
			answer:
				'Not hard. It is mostly a settings change: drop in a Lettr API key or SMTP login, verify your domain with the guided wizard, and rebuild or import your templates. Your sending code stays the same, so most teams are live in minutes with no downtime.'
		},
		{
			question: 'Can Lettr replace both MailerLite and MailerSend?',
			answer:
				'Yes — that is the main reason people move. Instead of MailerLite for campaigns and MailerSend for transactional, Lettr sends both from one account, with one set of credentials, one analytics view, and one invoice.'
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
					vars: { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
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
	title="5 Best MailerLite Alternatives in 2026 (Compared) | Lettr"
	description="Thinking of leaving MailerLite? An honest, plain-English look at the best alternatives — Lettr, Brevo, Resend and MailerSend — and how to switch in minutes."
	ogTitle="The Best MailerLite Alternatives, Honestly"
	ogDescription="A plain-English comparison of the top MailerLite alternatives — and where MailerLite is still a great fit."
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

	<h1 data-animate class="text-surface mb-5 max-w-[14ch]">
		Thinking of leaving <span class="text-primary">MailerLite?</span>
	</h1>
	<p data-animate class="max-w-[58ch] text-body text-muted mb-8">
		MailerLite is a lovely newsletter tool. But once you need transactional email, a proper developer
		API, or a bill that doesn't grow with every contact, it starts to pinch. Here's an honest look at
		your options — including where MailerLite is still the right call.
	</p>

	<div data-animate class="flex flex-wrap items-center gap-2">
		<Button
			variant="primary"
			href={registerHref}
			onclick={() => trackCta('mailerlite_alt_hero', 'Try Lettr free', registerHref, 'primary')}
		>Try Lettr free</Button>
		<Button
			variant="secondary"
			href="#comparison"
			onclick={() => trackCta('mailerlite_alt_hero', 'Jump to the comparison', '#comparison', 'secondary')}
		>See the comparison</Button>
	</div>
</section>

<!-- Why people leave -->
<section bind:this={reasonsSection} class="py-20 border-b border-border/30">
	<h2 data-reveal class="mb-3 text-surface max-w-[18ch]">
		Why people start looking around
	</h2>
	<p data-reveal class="text-body text-muted max-w-[55ch] mb-12">
		MailerLite earns its fans for easy newsletters. The friction tends to show up in three places.
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
		Just the things that actually decide a switch — no 40-row feature matrix.
	</p>

	<div data-reveal class="overflow-x-auto border border-border/40 bg-white">
		<table class="w-full min-w-[720px] border-collapse text-left">
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
						{#each [row.lettr, row.mailerlite, row.brevo, row.resend] as cell}
							<td class="p-4 align-top">
								<div class="flex items-start gap-2 text-sm {cell.status === 'no' ? 'text-muted/70' : 'text-muted'}">
									{#if cell.status === 'yes'}
										<CheckIcon size={16} class="mt-0.5 shrink-0 text-primary" />
									{:else if cell.status === 'no'}
										<XIcon size={16} class="mt-0.5 shrink-0 text-muted/50" />
									{:else if cell.status === 'partial'}
										<MinusIcon size={16} class="mt-0.5 shrink-0 text-muted/50" />
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
		<a href="/compare/resend/" class="text-primary underline underline-offset-2">Lettr vs Resend</a>
		breakdown for more.
	</p>
</section>

<!-- Per-alternative breakdown -->
<section bind:this={breakdownSection} class="py-20 border-b border-border/30">
	<h2 data-reveal class="mb-3 text-surface max-w-[20ch]">
		A quick, honest take on each
	</h2>
	<p data-reveal class="text-body text-muted max-w-[55ch] mb-12">
		No tool wins for everyone — ours included. Here's where each one shines and where it doesn't.
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
		The reason most switchers land on Lettr is simple: it sends your transactional and marketing email
		from <span class="text-surface">one platform</span> — a clean
		<a class="text-primary underline underline-offset-2" href="/email-api/">developer API</a>
		for engineers, a
		<a class="text-primary underline underline-offset-2" href="/email-marketing/">drag-and-drop editor</a>
		for everyone else, and per-email analytics so you can see exactly what landed. No MailerSend on the
		side.
	</p>
</section>

<!-- Migration note -->
<section bind:this={migrationSection} class="py-20 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
		<div data-reveal>
			<h2 class="mb-4 text-surface max-w-[16ch]">Switching is mostly a settings change</h2>
			<p class="text-body text-muted mb-8 max-w-[50ch]">
				Moving off MailerLite — and MailerSend — doesn't mean rewriting anything. Point your app at
				Lettr and you're sending in minutes, with no downtime.
			</p>
			<ol class="space-y-4">
				<li class="flex items-start gap-3 text-sm text-muted">
					<span class="font-code text-xs text-primary mt-0.5">01</span>
					<span><span class="text-surface font-medium">Drop in your Lettr key</span> — API or SMTP, whichever you use.</span>
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
					onclick={() => trackCta('mailerlite_alt_migration', 'SMTP relay', '/smtp-relay/', 'secondary')}
				>SMTP relay</Button>
				<Button
					variant="secondary"
					href="/free-email-api/"
					onclick={() => trackCta('mailerlite_alt_migration', 'Free email API', '/free-email-api/', 'secondary')}
				>Free email API</Button>
			</div>
		</div>

		<div data-reveal class="border border-border/40 bg-white p-6">
			<p class="text-sm leading-relaxed text-muted">
				<span class="text-surface">The short version:</span> your sending code stays the same. One set
				of credentials now covers both transactional and marketing, you retire the second MailerSend
				bill, and every message shows up in one dashboard.
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
			Both kinds of email, <span class="text-primary">one place.</span>
		</h2>
		<p class="mb-8 max-w-[46ch] text-body text-muted">
			Replace MailerLite and MailerSend with a single tool — real API, per-email analytics, free to
			start, no credit card.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-2">
			<Button
				variant="primary"
				href={registerHref}
				onclick={() => trackCta('mailerlite_alt_footer', 'Try Lettr free', registerHref, 'primary')}
			>Try Lettr free</Button>
			<Button
				variant="secondary"
				href="/compare/"
				onclick={() => trackCta('mailerlite_alt_footer', 'View all comparisons', '/compare/', 'secondary')}
			>View all comparisons</Button>
		</div>
	</div>
</section>
