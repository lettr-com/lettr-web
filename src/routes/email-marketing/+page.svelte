<script lang="ts">
	import { onMount } from 'svelte';
	import {
		UsersThreeIcon,
		PaintBrushIcon,
		ChartLineIcon,
		ShieldCheckIcon,
		ClockCounterClockwiseIcon,
		PaperPlaneTiltIcon
	} from 'phosphor-svelte';
	import Button from '$lib/components/Button.svelte';
	import CampaignEditorPreview from '$lib/components/CampaignEditorPreview.svelte';
	import TalkToExpert from '$lib/components/TalkToExpert.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	let hero: HTMLElement | undefined = $state();
	let featuresSection: HTMLElement | undefined = $state();
	let listsSection: HTMLElement | undefined = $state();
	let registerHref: string = $state(registerUrl);

	function trackHeroCta(label: string, href: string, variant: 'primary' | 'secondary') {
		void capturePosthogEvent('cta_clicked', {
			placement: 'campaigns_hero',
			label,
			href,
			variant,
			destination_type: /^https?:\/\//.test(href) ? 'external' : 'internal'
		});
		if (label === 'Start sending') {
			trackSignupClick('campaigns_hero', href);
		}
	}

	const features = [
		{
			icon: PaintBrushIcon,
			title: 'Best-in-class drag-and-drop editor',
			description:
				'The same Topol editor trusted by 40,000+ companies. Synced sections, multilingual templates, version history, draft and publish workflow — built for teams that actually ship.'
		},
		{
			icon: UsersThreeIcon,
			title: 'Contact lists and segmentation',
			description:
				'Manage audiences without a spreadsheet. Filter by attributes, behavior, or custom events. Segments update in real time as your data changes.'
		},
		{
			icon: ChartLineIcon,
			title: 'Campaign analytics',
			description:
				'Opens, clicks, conversions, unsubscribes — per campaign and per contact. Compare variants, surface what works, and feed insights back into your product.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'Same deliverability stack',
			description:
				'Marketing and transactional share one sending reputation. SPF, DKIM, DMARC, custom tracking domains, and dedicated IPs are first-class — not add-ons.'
		},
		{
			icon: ClockCounterClockwiseIcon,
			title: 'Version history and approvals',
			description:
				'Roll back any change. Add reviewers before a campaign goes out. Audit every send to a known author and a known template version.'
		}
	];

	const listFeatures = [
		'Import via CSV, API, or webhook',
		'Double opt-in flows out of the box',
		'GDPR-aware unsubscribe and consent tracking',
		'Custom fields and dynamic placeholders',
		'Real-time segments — no nightly batch'
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

		for (const section of [featuresSection, listsSection]) {
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

<svelte:head>
	<title>Email Marketing & Campaigns — Lettr</title>
	<link rel="canonical" href="https://lettr.com/email-marketing" />
	<meta name="description" content="Run marketing campaigns from the same platform that sends your transactional email. Drag-and-drop editor, contact lists, segmentation, and automations — priced by contact." />
	<meta property="og:title" content="Email Marketing & Campaigns — Lettr" />
	<meta property="og:description" content="Run marketing campaigns from the same platform that sends your transactional email." />
	<meta property="og:url" content="https://lettr.com/email-marketing" />
	<meta name="twitter:title" content="Email Marketing & Campaigns — Lettr" />
	<meta name="twitter:description" content="Run marketing campaigns from the same platform that sends your transactional email." />
</svelte:head>

<div>
<section bind:this={hero} class="pt-30 pb-16 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-1">
		<div class="flex flex-col">
			<a
				data-animate
				href="/changelog/"
				class="group mb-6 inline-flex w-fit items-center gap-2 border border-primary/20 bg-primary/5 p-1.5 text-sm text-primary transition-colors hover:bg-primary/10"
			>
				<span class="bg-primary px-2 py-0.5 text-xs font-bold text-white">New</span>
				Introducing Campaigns
				<span class="transition-transform group-hover:translate-x-0.5">&rarr;</span>
			</a>
			<h1 data-animate class="text-surface mb-4">
				Marketing campaigns,<br />
				<span class="text-primary">in the same editor.</span>
			</h1>

			<p data-animate class="max-w-[650px] text-body text-muted mb-10">
				Run newsletters, product launches, and re-engagement series from the same platform that
				sends your transactional email. One editor, one bill.
			</p>

			<div data-animate class="flex flex-wrap items-center mb-3 gap-2">
				<Button
					variant="primary"
					href={registerHref}
					onclick={() => trackHeroCta('Start sending', registerHref, 'primary')}
				>Start sending</Button>
				<Button
					variant="secondary"
					href="/pricing/"
					onclick={() => trackHeroCta('See pricing', '/pricing/', 'secondary')}
				>See pricing</Button>
			</div>
			<p data-animate class="max-w-md text-sm text-muted">
				Priced per contact. Bundle with Transactional for a discount.
			</p>
		</div>

		<div data-animate class="campaigns-theme">
			<CampaignEditorPreview />
		</div>
	</div>
</section>

<section bind:this={featuresSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			What's inside
		</div>
		<h2 class="mb-3 text-surface">
			Everything you need<br /><span class="text-primary">to run a campaign program.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Built for teams that ship marketing alongside product — not as a side project.
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

<section bind:this={listsSection} class="py-20 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
		<div data-reveal>
			<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
				<span class="block w-6 h-px bg-primary/60"></span>
				Lists &amp; segmentation
			</div>
			<h2 class="mb-4 text-surface">
				Audiences that<br /><span class="text-primary">stay in sync.</span>
			</h2>
			<p class="text-body text-muted mb-6 max-w-[52ch]">
				Push contacts from your product via API or webhook. Segments update in real time as
				attributes and events change — no nightly export, no stale lists.
			</p>
			<ul class="space-y-3">
				{#each listFeatures as item}
					<li class="flex items-start gap-3 text-sm text-muted">
						<span class="mt-2 block h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex items-center gap-2">
				<PaperPlaneTiltIcon size={16} class="text-primary" />
				<span class="font-code text-xs text-muted">contacts.add</span>
			</div>
			<pre class="overflow-x-auto font-code text-[13px] leading-relaxed text-surface">{`POST /v1/contacts
{
  "email": "alex@example.com",
  "fields": {
    "plan": "pro",
    "signed_up_at": "2026-04-18"
  },
  "lists": ["product-news"]
}`}</pre>
			<div class="mt-4 border-t border-border/30 pt-4">
				<div class="text-[11px] uppercase tracking-wider text-muted/70 mb-2">
					Auto-segments updated
				</div>
				<div class="flex flex-wrap gap-2">
					<span class="border border-border/40 bg-background px-2 py-0.5 text-[12px] text-surface">Pro plan</span>
					<span class="border border-border/40 bg-background px-2 py-0.5 text-[12px] text-surface">Signed up this week</span>
					<span class="border border-border/40 bg-background px-2 py-0.5 text-[12px] text-surface">Product news subscribers</span>
				</div>
			</div>
		</div>
	</div>
</section>

<TalkToExpert />
<FAQSection />
</div>

<style>
	/* Scope the green accent to the email editor preview only.
	   Custom properties inherit through the DOM, so every *-primary
	   utility inside this wrapper resolves to green within the
	   CampaignEditorPreview — while the rest of the page keeps the
	   default red primary. */
	.campaigns-theme {
		--color-primary: #00d46b;
	}
</style>
