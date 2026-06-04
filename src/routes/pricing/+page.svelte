<script lang="ts">
	import { onMount } from 'svelte';
	import { PackageIcon, ArrowRight } from 'phosphor-svelte';
	import Pricing from '$lib/components/Pricing.svelte';
	import CampaignsPricing from '$lib/components/CampaignsPricing.svelte';
	import ModeToggle, { type Mode } from '$lib/components/ModeToggle.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	let header: HTMLElement | undefined = $state();
	let bundleSection: HTMLElement | undefined = $state();
	let mode: Mode = $state('transactional');

	function handleModeChange(next: Mode) {
		void capturePosthogEvent('pricing_mode_changed', { mode: next });
	}

	function trackBundleCta() {
		void capturePosthogEvent('cta_clicked', {
			placement: 'pricing_bundle',
			label: 'Talk to us',
			href: '/demo/',
			destination_type: 'internal'
		});
	}

	onMount(() => {
		const cleanups: (() => void)[] = [];
		if (header) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: header,
					targets: '[data-animate]',
					vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
				})
			);
		}
		if (bundleSection) {
			cleanups.push(
				createScrollRevealCleanup({ scope: bundleSection, targets: '[data-reveal]' })
			);
		}
		return () => cleanups.forEach((fn) => fn());
	});
</script>

<svelte:head>
	<title>Pricing — Lettr</title>
	<link rel="canonical" href="https://lettr.com/pricing" />
	<meta name="description" content="Transparent pricing for Lettr. Transactional bills per email, Marketing bills per contact. Bundle both for a discount. Free tier for transactional — 3,000 emails/month." />
	<meta property="og:title" content="Pricing — Lettr" />
	<meta property="og:description" content="Transactional per email, Marketing per contact. Bundle to save more." />
	<meta property="og:url" content="https://lettr.com/pricing" />
	<meta name="twitter:title" content="Pricing — Lettr" />
	<meta name="twitter:description" content="Transactional per email, Marketing per contact. Bundle to save more." />
</svelte:head>

<section bind:this={header} class="pt-32 pb-8">
	<div class="text-center">
		<span data-animate class="mb-4 inline-block font-heading text-xs tracking-[0.15em] text-primary uppercase">
			Pricing
		</span>
		<h1 data-animate>
			Pricing that<br /><span class="text-primary">grows with you.</span>
		</h1>
		<p data-animate class="mx-auto mt-5 max-w-xl text-body text-muted">
			Pay per email for transactional. Pay per contact for marketing.
		</p>
	</div>
</section>

<section class="pb-4">
	<div class="mx-auto max-w-2xl">
		<ModeToggle bind:value={mode} onChange={handleModeChange} />
	</div>
</section>

{#if mode === 'transactional'}
	<Pricing sectionClass="pt-6 pb-16" animateOnMount />
{:else}
	<CampaignsPricing />
{/if}

<section bind:this={bundleSection} class="py-16 border-t border-border/30">
	<div data-reveal class="border border-primary/30 bg-white p-8 sm:p-10">
		<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-start gap-4">
				<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30 bg-primary/5">
					<PackageIcon size={22} class="text-primary" />
				</div>
				<div>
					<h2 class="mb-2 text-surface">Bundle <span class="text-primary">and save.</span></h2>
					<p class="text-body text-muted max-w-[55ch]">
						Run transactional and marketing from the same account and the price drops on both. Talk
						to us — we'll price the bundle to your sending mix.
					</p>
				</div>
			</div>
			<a
				href="/demo/"
				class="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 shrink-0"
				onclick={trackBundleCta}
			>
				Talk to us
				<ArrowRight size={14} />
			</a>
		</div>
	</div>
</section>

<FAQSection />
