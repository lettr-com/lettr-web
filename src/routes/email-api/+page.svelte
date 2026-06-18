<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import CodeIcon from 'phosphor-svelte/lib/CodeIcon';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import ShieldCheckIcon from 'phosphor-svelte/lib/ShieldCheckIcon';
	import ArrowsClockwiseIcon from 'phosphor-svelte/lib/ArrowsClockwiseIcon';
	import LinkIcon from 'phosphor-svelte/lib/LinkIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import UserPlusIcon from 'phosphor-svelte/lib/UserPlusIcon';
	import LockKeyIcon from 'phosphor-svelte/lib/LockKeyIcon';
	import BellIcon from 'phosphor-svelte/lib/BellIcon';
	import HourglassHighIcon from 'phosphor-svelte/lib/HourglassHighIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
	import Button from '$lib/components/Button.svelte';
	import CodeSnippet from '$lib/components/CodeSnippet.svelte';
	import TalkToExpert from '$lib/components/TalkToExpert.svelte';
	import Pricing from '$lib/components/Pricing.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import RelatedFeatures from '$lib/components/RelatedFeatures.svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	let hero: HTMLElement | undefined = $state();
	let featuresSection: HTMLElement | undefined = $state();
	let eventsSection: HTMLElement | undefined = $state();
	let useCasesSection: HTMLElement | undefined = $state();
	let registerHref: string = $state(registerUrl);

	function trackHeroCta(label: string, href: string, variant: 'primary' | 'secondary') {
		void capturePosthogEvent('cta_clicked', {
			placement: 'transactional_hero',
			label,
			href,
			variant,
			destination_type: /^https?:\/\//.test(href) ? 'external' : 'internal'
		});
		if (label === 'Start sending') {
			trackSignupClick('transactional_hero', href);
		}
	}

	const features = [
		{
			icon: CodeIcon,
			title: 'REST API + SMTP relay',
			description:
				'Send your first email with a single POST. Or point your existing SMTP credentials at Lettr and change nothing else — same code, better delivery.'
		},
		{
			icon: LightningIcon,
			title: 'SDKs for every language',
			description:
				'First-class Laravel package with a one-command install. Typed, documented SDKs for PHP, Node.js, Go, Java, and Rust — plus a plain REST API for everything else.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'Deliverability built in',
			description:
				'SPF, DKIM, DMARC, custom tracking domains, and dedicated IPs are first-class. A guided DNS wizard gets you authenticated in minutes — no CNAME guesswork.'
		},
		{
			icon: ArrowsClockwiseIcon,
			title: 'Reliable by design',
			description:
				'Sub-second sends with automatic retries and idempotency keys, so a flaky network never sends the same password reset or 2FA code twice.'
		},
		{
			icon: LinkIcon,
			title: 'Webhooks for every event',
			description:
				'Know the moment an email is delivered, opened, clicked, or bounced. Build automations, sync your database, or trigger in-app flows on signed, retried payloads.'
		},
		{
			icon: MagnifyingGlassIcon,
			title: 'Searchable logs',
			description:
				'Full-text search across every email you have ever sent. Filter by recipient, status, or tag and find exactly why that one email bounced — in seconds, not hours.'
		}
	];

	const eventFeatures = [
		'delivered, opened, clicked, bounced, and complained events',
		'HMAC-signed payloads you can verify',
		'Automatic retries with exponential backoff',
		'Up to unlimited endpoints, filtered by event type',
		'Every send searchable in the logs for up to 90 days'
	];

	const useCases = [
		{ icon: UserPlusIcon, title: 'Welcome & email verification' },
		{ icon: LockKeyIcon, title: 'Password resets & magic links' },
		{ icon: ShieldCheckIcon, title: 'Security alerts & 2FA codes' },
		{ icon: BellIcon, title: 'Receipts & billing notifications' },
		{ icon: HourglassHighIcon, title: 'Usage & limit warnings' },
		{ icon: PaperPlaneTiltIcon, title: 'Account & system updates' }
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

		for (const section of [featuresSection, eventsSection, useCasesSection]) {
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
	title="Transactional Email API — Lettr"
	description="Send transactional email from your SaaS via a clean REST API and SMTP relay — with sub-second delivery, automatic retries, webhooks, and searchable logs."
	ogDescription="Send transactional email from your SaaS via a clean REST API and SMTP relay. Sub-second delivery, automatic retries, webhooks, and searchable logs."
/>

<section bind:this={hero} class="pt-30 pb-16 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-1">
		<div class="flex flex-col">
			<h1 data-animate class="text-surface mb-4">
				Transactional email<br />
				<span class="text-primary">your product can rely on.</span>
			</h1>

			<p data-animate class="max-w-[650px] text-body text-muted mb-10">
				Fire password resets, receipts, and alerts from a clean REST API or SMTP relay. Sub-second
				delivery, automatic retries, and a drag-and-drop editor your team owns — no dev ticket to
				change a button.
			</p>

			<div data-animate class="flex flex-wrap items-center mb-3 gap-2">
				<Button
					variant="primary"
					href={registerHref}
					onclick={() => trackHeroCta('Start sending', registerHref, 'primary')}
				>Start sending</Button>
				<Button
					variant="secondary"
					href="https://docs.lettr.com/introduction"
					target="_blank"
					rel="noopener noreferrer"
					onclick={() => trackHeroCta('See docs', 'https://docs.lettr.com/introduction', 'secondary')}
				>See docs</Button>
			</div>
			<p data-animate class="max-w-md text-sm text-muted">
				3,000 emails/month free. No credit card required. See the
				<a class="text-primary underline underline-offset-2" href="/free-email-api/">free email API</a>.
			</p>
		</div>

		<div data-animate>
			<CodeSnippet />
		</div>
	</div>
</section>

<section bind:this={featuresSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			Built for transactional
		</div>
		<h2 class="mb-3 text-surface">
			Everything your product's email needs.<br /><span class="text-primary">Nothing it doesn't.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			The emails that have to arrive — reset links, receipts, 2FA codes — deserve infrastructure
			built for exactly that.
		</p>
	</div>

	<div class="grid gap-5 sm:grid-cols-2">
		{#each features as feature}
			<div data-reveal class="flex items-start gap-5 border border-border/40 bg-white p-6">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border/50 bg-background">
					<feature.icon size={20} class="text-primary" />
				</div>
				<div>
					<h3 class="mb-1 text-base font-semibold text-surface">{feature.title}</h3>
					<p class="text-sm leading-relaxed text-muted">{feature.description}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<section bind:this={eventsSection} class="py-20 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
		<div data-reveal>
			<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
				<span class="block w-6 h-px bg-primary/60"></span>
				Events &amp; webhooks
			</div>
			<h2 class="mb-4 text-surface">
				Know what happened<br /><span class="text-primary">to every email.</span>
			</h2>
			<p class="text-body text-muted mb-6 max-w-[52ch]">
				Lettr fires a signed webhook the moment something changes — delivered, opened, clicked, or
				bounced. React in real time and keep your own database in sync, without polling.
			</p>
			<ul class="space-y-3">
				{#each eventFeatures as item}
					<li class="flex items-start gap-3 text-sm text-muted">
						<span class="mt-2 block h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex items-center gap-2">
				<LinkIcon size={16} class="text-primary" />
				<span class="font-code text-xs text-muted">POST your-app.com/webhooks/lettr</span>
			</div>
			<pre class="overflow-x-auto font-code text-[13px] leading-relaxed text-surface">{`{
  "event": "email.delivered",
  "email_id": "msg_8f21c0",
  "to": "alex@example.com",
  "subject": "Your login code",
  "tags": ["auth", "2fa"],
  "timestamp": "2026-04-18T09:21:04Z"
}`}</pre>
			<div class="mt-4 border-t border-border/30 pt-4">
				<div class="text-[11px] uppercase tracking-wider text-muted/70 mb-2">
					Events you can subscribe to
				</div>
				<div class="flex flex-wrap gap-2">
					<span class="border border-border/40 bg-background px-2 py-0.5 text-[12px] text-surface">delivered</span>
					<span class="border border-border/40 bg-background px-2 py-0.5 text-[12px] text-surface">opened</span>
					<span class="border border-border/40 bg-background px-2 py-0.5 text-[12px] text-surface">clicked</span>
					<span class="border border-border/40 bg-background px-2 py-0.5 text-[12px] text-surface">bounced</span>
					<span class="border border-border/40 bg-background px-2 py-0.5 text-[12px] text-surface">complained</span>
				</div>
			</div>
		</div>
	</div>
</section>

<section bind:this={useCasesSection} class="py-20 border-b border-border/30">
	<div class="mb-10" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			Use cases
		</div>
		<h2 class="mb-3 text-surface">
			The emails your product<br /><span class="text-primary">already has to send.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Every transactional email a SaaS sends, from the first verification link to the final invoice.
		</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each useCases as useCase}
			<div data-reveal class="flex items-center gap-4 border border-border/40 bg-white p-5">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border/50 bg-background">
					<useCase.icon size={20} class="text-primary" />
				</div>
				<span class="text-sm font-medium text-surface">{useCase.title}</span>
			</div>
		{/each}
	</div>
</section>

<div class="py-16">
	<RelatedFeatures
		links={[
			{ href: '/smtp-relay/', label: 'SMTP Relay', description: 'Drop-in SMTP for any app, framework, or server.' },
			{ href: '/platform/deliverability/', label: 'Deliverability', description: 'SPF, DKIM, DMARC, dedicated IPs, and DNS setup.' },
			{ href: '/platform/analytics/', label: 'Analytics & Logs', description: 'Delivery metrics, searchable logs, and webhooks.' }
		]}
	/>
</div>

<TalkToExpert />
<Pricing />
<FAQSection />
