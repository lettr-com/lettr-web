<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import CodeSnippet from '$lib/components/CodeSnippet.svelte';
	import TalkToExpert from '$lib/components/TalkToExpert.svelte';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import MinusIcon from 'phosphor-svelte/lib/MinusIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import ShieldCheckIcon from 'phosphor-svelte/lib/ShieldCheckIcon';
	import KeyIcon from 'phosphor-svelte/lib/KeyIcon';
	import GlobeSimpleIcon from 'phosphor-svelte/lib/GlobeSimpleIcon';
	import ListChecksIcon from 'phosphor-svelte/lib/ListChecksIcon';
	import RocketLaunchIcon from 'phosphor-svelte/lib/RocketLaunchIcon';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	const DOCS_URL = 'https://docs.lettr.com/introduction';

	let hero: HTMLElement | undefined = $state();
	let quickStartSection: HTMLElement | undefined = $state();
	let includedSection: HTMLElement | undefined = $state();
	let sdkSection: HTMLElement | undefined = $state();
	let upgradeSection: HTMLElement | undefined = $state();
	let competitorSection: HTMLElement | undefined = $state();
	let deliverabilitySection: HTMLElement | undefined = $state();
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

	const included = [
		'3,000 emails per month — free, every month',
		'100 emails per day',
		'REST API and SMTP relay — same free key',
		'1 verified sending domain',
		'Basic delivery analytics',
		'7-day searchable logs',
		'SPF, DKIM & DMARC authentication',
		'No credit card required'
	];

	const sdks = [
		{ label: 'Laravel', iconSrc: '/images/icons/laravel.svg', note: 'One-command install', href: 'https://docs.lettr.com/quickstart/laravel/introduction' },
		{ label: 'PHP', iconSrc: '/images/icons/php.svg', note: 'Standalone SDK', href: 'https://docs.lettr.com/quickstart/php/introduction' },
		{ label: 'Node.js', iconSrc: '/images/icons/node-js.svg', note: 'JavaScript & TypeScript', href: 'https://docs.lettr.com/quickstart/nodejs/introduction' },
		{ label: 'Go', iconSrc: '/images/icons/golang.svg', note: 'Go client library', href: 'https://docs.lettr.com/quickstart/go/quickstart' },
		{ label: 'Java', iconSrc: '/images/icons/java.svg', note: 'Java client library', href: 'https://docs.lettr.com/quickstart/java/quickstart' },
		{ label: 'Rust', iconSrc: '/images/icons/rust.svg', note: 'Rust client library', href: 'https://docs.lettr.com/quickstart/rust/quickstart' }
	];

	const freeEnough = [
		'Side projects, prototypes, and MVPs',
		'A SaaS sending under 3,000 emails a month',
		'Password resets, receipts, and sign-up emails at low volume',
		'Testing deliverability before you commit'
	];

	const timeToUpgrade = [
		'You need more than 3,000 emails/month or 100/day',
		'You send from multiple domains',
		'You want dedicated IPs and longer log retention',
		'You need higher rate limits for bursts'
	];

	// Lettr free tier vs. a typical cloud free tier (AWS SES). Kept qualitative
	// where competitor specifics change; SES free tier is a 12-month trial and
	// starts in a sandbox requiring production-access approval.
	const comparison = [
		{ feature: 'Free allowance', lettr: '3,000/mo — ongoing, no expiry', ses: '3,000/mo — first 12 months only' },
		{ feature: 'Start sending', lettr: 'Verify a domain and send', ses: 'Sandbox by default — request production access' },
		{ feature: 'Setup', lettr: 'Guided DNS wizard, minutes', ses: 'Manual DNS + IAM credentials' },
		{ feature: 'Deliverability tools', lettr: 'SPF, DKIM, DMARC built in', ses: 'Configure manually' },
		{ feature: 'Visual editor', lettr: 'Drag-and-drop, powered by Topol', ses: null },
		{ feature: 'API + SMTP', lettr: 'Both, one free key', ses: 'Both, separate setup' },
		{ feature: 'Logs & analytics', lettr: 'Searchable logs + dashboard', ses: 'CloudWatch, extra setup' }
	];

	const deliverability = [
		{
			icon: ShieldCheckIcon,
			title: 'Authentication on the free tier',
			description:
				'SPF, DKIM, and DMARC are not paywalled. A guided DNS wizard authenticates your domain in minutes so your mail lands in the inbox — even on free.'
		},
		{
			icon: GlobeSimpleIcon,
			title: 'Real sending infrastructure',
			description:
				'The free key sends on the same managed, monitored infrastructure as paid plans. Free means a lower limit, not a worse mailbox reputation.'
		},
		{
			icon: ListChecksIcon,
			title: 'Visibility from day one',
			description:
				'See deliveries, bounces, and complaints in the dashboard, and search 7 days of logs to find exactly why a message did or didn’t arrive.'
		}
	];

	const faqs = [
		{
			question: 'Is the email API really free?',
			answer:
				'Yes. Lettr’s free tier lets you send up to 3,000 emails per month (100 per day) with no credit card required. It’s an ongoing free plan, not a 12-month trial — the allowance resets every month. You get the REST API, SMTP relay, one verified sending domain, basic analytics, and 7 days of searchable logs.'
		},
		{
			question: 'How do I get a free API key?',
			answer:
				'Create a free Lettr account, verify your sending domain, and generate an API key from the dashboard. The key works for both the REST API (Bearer token) and the SMTP relay (as your SMTP password). You can send your first email within a few minutes of signing up.'
		},
		{
			question: 'What happens when I hit the free limit?',
			answer:
				'Sending pauses once you reach 3,000 emails in a month or 100 in a day — your account isn’t charged automatically and there’s no surprise bill. The monthly allowance resets at the start of each billing cycle. When you consistently need more, you can upgrade to a paid plan for higher limits, more domains, dedicated IPs, and longer log retention.'
		},
		{
			question: 'How is the free tier different from AWS SES free tier?',
			answer:
				'AWS SES offers a free tier for the first 12 months and starts new accounts in a sandbox that only sends to verified addresses until you request production access. Lettr’s free tier is ongoing, has no sandbox approval step, and includes a guided SPF/DKIM/DMARC wizard, a drag-and-drop editor, and searchable logs out of the box — so you can send to real recipients minutes after signing up.'
		},
		{
			question: 'Can I send email over both REST API and SMTP for free?',
			answer:
				'Yes. The same free API key works for the REST API and the SMTP relay (smtp.lettr.com). Use the API for new application code and SMTP for tools, frameworks, or apps that only expose SMTP settings — all on the free tier, with unified logs and analytics.'
		},
		{
			question: 'Do free emails have worse deliverability?',
			answer:
				'No. Free and paid emails send through the same managed infrastructure with the same authentication. Deliverability depends on your domain setup and sending practices, not your plan — which is why SPF, DKIM, and DMARC are available on the free tier.'
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
			quickStartSection,
			includedSection,
			sdkSection,
			upgradeSection,
			competitorSection,
			deliverabilitySection,
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
	title="Free Email API — Send 3,000 Emails/Month Free | Lettr"
	description="Get a free email API key and send up to 3,000 emails a month, no credit card. REST API and SMTP, SDKs for every language, and deliverability built in on the free tier."
	ogDescription="A genuinely free email API: 3,000 emails/month, REST API and SMTP, SDKs for every language, and SPF/DKIM/DMARC built in. No credit card, no sandbox."
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
<section bind:this={hero} class="pt-30 pb-16 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-1">
		<div class="flex flex-col">
			<div
				data-animate
				class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80"
			>
				<span class="block w-6 h-px bg-primary/60"></span>
				Free email API
			</div>
			<h1 data-animate class="text-surface mb-4">
				Send up to 3,000 emails<br />
				<span class="text-primary">a month, free.</span>
			</h1>

			<p data-animate class="max-w-[650px] text-body text-muted mb-8">
				Get a free email API key and send your first email in one request. REST API and SMTP, SDKs
				for every language, and deliverability built in — <span class="text-surface">no credit card required.</span>
			</p>

			<div data-animate class="mb-8 flex flex-wrap gap-2">
				<span class="border border-border/40 bg-white px-3 py-1.5 text-sm font-medium text-surface">3,000 emails / month</span>
				<span class="border border-border/40 bg-white px-3 py-1.5 text-sm font-medium text-surface">No credit card</span>
				<span class="border border-border/40 bg-white px-3 py-1.5 text-sm font-medium text-surface">REST API + SMTP</span>
			</div>

			<div data-animate class="flex flex-wrap items-center mb-3 gap-2">
				<Button
					variant="primary"
					href={registerHref}
					onclick={() => trackCta('free_api_hero', 'Get a free API key', registerHref, 'primary')}
				>Get a free API key</Button>
				<Button
					variant="secondary"
					href={DOCS_URL}
					target="_blank"
					rel="noopener noreferrer"
					onclick={() => trackCta('free_api_hero', 'See docs', DOCS_URL, 'secondary')}
				>See docs</Button>
			</div>
			<p data-animate class="max-w-md text-sm text-muted">
				Free forever — no credit card, no expiry.
			</p>
		</div>

		<div data-animate>
			<CodeSnippet primaryTabIndices={[2, 5]} moreTabIndices={[0, 1, 3, 4, 6]} />
		</div>
	</div>
</section>

<!-- Quick start -->
<section bind:this={quickStartSection} class="py-20 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
		<div data-reveal>
			<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
				<span class="block w-6 h-px bg-primary/60"></span>
				Quick start
			</div>
			<h2 class="mb-4 text-surface">
				Your first email<br /><span class="text-primary">in one request.</span>
			</h2>
			<p class="text-body text-muted mb-6 max-w-[52ch]">
				No pitch to read first. Grab your free key, send a single API call or SMTP message, and watch
				it land. The same key works across every SDK and both transports.
			</p>
			<ol class="space-y-3">
				<li class="flex items-start gap-3 text-sm text-muted">
					<span class="font-code text-xs text-primary mt-0.5">01</span>
					<span><span class="text-surface font-medium">Create a free account</span> and generate an API key.</span>
				</li>
				<li class="flex items-start gap-3 text-sm text-muted">
					<span class="font-code text-xs text-primary mt-0.5">02</span>
					<span><span class="text-surface font-medium">Authenticate your domain</span> with the guided DNS wizard.</span>
				</li>
				<li class="flex items-start gap-3 text-sm text-muted">
					<span class="font-code text-xs text-primary mt-0.5">03</span>
					<span><span class="text-surface font-medium">Send</span> — copy a snippet and fire your first email.</span>
				</li>
			</ol>
		</div>

		<div data-reveal>
			<CodeSnippet primaryTabIndices={[2, 5]} moreTabIndices={[0, 1, 3, 4, 6]} shadow={false} />
		</div>
	</div>
</section>

<!-- What's included free -->
<section bind:this={includedSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			What's included free
		</div>
		<h2 class="mb-3 text-surface">
			Everything you need to ship.<br /><span class="text-primary">Nothing held back.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Real limits, stated honestly — no asterisks, no "free for 12 months," no credit card on file.
		</p>
	</div>

	<div class="grid gap-x-8 gap-y-3 sm:grid-cols-2">
		{#each included as item}
			<div data-reveal class="flex items-start gap-3 border-b border-border/20 py-3">
				<CheckIcon size={18} class="mt-0.5 shrink-0 text-primary" />
				<span class="text-sm text-surface">{item}</span>
			</div>
		{/each}
	</div>
</section>

<!-- SDKs -->
<section bind:this={sdkSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			SDKs for every language
		</div>
		<h2 class="mb-3 text-surface">
			Integrate in minutes,<br /><span class="text-primary">in your language.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Typed, documented SDKs — plus a plain REST API and SMTP relay for everything else. The Laravel
			package installs with a single command.
		</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each sdks as sdk}
			<a
				data-reveal
				href={sdk.href}
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-4 border border-border/40 bg-white p-5 transition-colors hover:border-primary/30"
				onclick={() => trackCta('free_api_sdk', sdk.label, sdk.href, 'secondary')}
			>
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border/50 bg-background">
					<img src={sdk.iconSrc} alt={sdk.label} class="h-5 w-5" />
				</div>
				<div>
					<div class="text-sm font-semibold text-surface">{sdk.label}</div>
					<div class="text-xs text-muted">{sdk.note}</div>
				</div>
			</a>
		{/each}
	</div>
</section>

<!-- Free vs paid -->
<section bind:this={upgradeSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			Free vs. paid
		</div>
		<h2 class="mb-3 text-surface">
			Start free.<br /><span class="text-primary">Upgrade only when you need to.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			The free tier is a real product, not a teaser. Here's how to know when it's enough — and when
			to move up.
		</p>
	</div>

	<div class="grid gap-5 lg:grid-cols-2">
		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex items-center gap-2">
				<CheckIcon size={18} class="text-primary" />
				<h3 class="text-base font-semibold text-surface">The free tier is enough when…</h3>
			</div>
			<ul class="space-y-3">
				{#each freeEnough as item}
					<li class="flex items-start gap-3 text-sm text-muted">
						<CheckIcon size={16} class="mt-0.5 shrink-0 text-primary" />
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex items-center gap-2">
				<RocketLaunchIcon size={18} class="text-primary" />
				<h3 class="text-base font-semibold text-surface">Time to upgrade when…</h3>
			</div>
			<ul class="space-y-3">
				{#each timeToUpgrade as item}
					<li class="flex items-start gap-3 text-sm text-muted">
						<ArrowRightIcon size={16} class="mt-0.5 shrink-0 text-primary" />
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<p data-reveal class="mt-6 text-sm text-muted">
		See the full breakdown on the
		<a class="text-primary underline underline-offset-2" href="/pricing/">pricing page</a>, or read how the
		<a class="text-primary underline underline-offset-2" href="/email-api/">transactional email API</a> works
		for production sending.
	</p>
</section>

<!-- Lettr vs other free email APIs -->
<section bind:this={competitorSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			Lettr vs. other free email APIs
		</div>
		<h2 class="mb-3 text-surface">
			Free, without the<br /><span class="text-primary">sandbox friction.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Most "free" email APIs make you fight a sandbox, wire up DNS by hand, or watch the trial expire.
			Here's how Lettr's free tier compares to a typical cloud free tier like AWS SES.
		</p>
	</div>

	<div data-reveal class="overflow-x-auto border border-border/40 bg-white">
		<table class="w-full min-w-[560px] border-collapse text-left">
			<thead>
				<tr class="border-b border-border/40">
					<th class="p-4 text-[11px] font-medium uppercase tracking-wider text-muted/70">&nbsp;</th>
					<th class="p-4 text-sm font-semibold text-primary">Lettr free</th>
					<th class="p-4 text-sm font-semibold text-surface">AWS SES free tier</th>
				</tr>
			</thead>
			<tbody>
				{#each comparison as row, i}
					<tr class="{i < comparison.length - 1 ? 'border-b border-border/20' : ''}">
						<td class="p-4 align-top text-sm font-medium text-surface">{row.feature}</td>
						<td class="p-4 align-top">
							<div class="flex items-start gap-2 text-sm text-muted">
								<CheckIcon size={16} class="mt-0.5 shrink-0 text-primary" />
								<span>{row.lettr}</span>
							</div>
						</td>
						<td class="p-4 align-top">
							{#if row.ses}
								<div class="flex items-start gap-2 text-sm text-muted">
									<MinusIcon size={16} class="mt-0.5 shrink-0 text-muted/50" />
									<span>{row.ses}</span>
								</div>
							{:else}
								<div class="flex items-start gap-2 text-sm text-muted/60">
									<MinusIcon size={16} class="mt-0.5 shrink-0 text-muted/40" />
									<span>Not available</span>
								</div>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p data-reveal class="mt-4 text-xs text-muted/70">
		Comparison reflects publicly documented free-tier behavior and may change. AWS and Amazon SES are
		trademarks of Amazon.com, Inc.
	</p>
</section>

<!-- Deliverability -->
<section bind:this={deliverabilitySection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			Deliverability built in
		</div>
		<h2 class="mb-3 text-surface">
			Free, but not<br /><span class="text-primary">throwaway.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			A free key shouldn't mean mail in the spam folder. The deliverability tooling that powers paid
			plans is on the free tier too.
		</p>
	</div>

	<div class="grid gap-5 sm:grid-cols-3">
		{#each deliverability as item}
			<div data-reveal class="border border-border/40 bg-white p-6">
				<div class="mb-4 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
					<item.icon size={20} class="text-primary" />
				</div>
				<h3 class="mb-1 text-base font-semibold text-surface">{item.title}</h3>
				<p class="text-sm leading-relaxed text-muted">{item.description}</p>
			</div>
		{/each}
	</div>
</section>

<TalkToExpert />

<!-- FAQ -->
<section bind:this={faqSection} class="py-16 border-b border-border/30">
	<div class="mb-10" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			FAQ
		</div>
		<h2 class="mb-3 text-surface">Free email API <span class="text-primary">questions</span></h2>
		<p class="text-body text-muted max-w-[55ch]">
			The honest answers free-tier shoppers actually want.
		</p>
	</div>

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
		<h2 class="mb-3 text-surface">
			Get your <span class="text-primary">free API key.</span>
		</h2>
		<p class="mb-8 max-w-[46ch] text-body text-muted">
			Send your first 3,000 emails a month free — no credit card, no sandbox, no expiry. Upgrade only
			when you outgrow it.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-2">
			<Button
				variant="primary"
				href={registerHref}
				onclick={() => trackCta('free_api_footer', 'Get a free API key', registerHref, 'primary')}
			>Get a free API key</Button>
			<Button
				variant="secondary"
				href="/email-api/"
				onclick={() => trackCta('free_api_footer', 'Explore the email API', '/email-api/', 'secondary')}
			>Explore the email API</Button>
		</div>
	</div>
</section>
