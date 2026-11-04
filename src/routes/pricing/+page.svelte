<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ModeTabs from '$lib/components/pricing/ModeTabs.svelte';
	import TransactionalPricing from '$lib/components/pricing/TransactionalPricing.svelte';
	import MarketingPricing from '$lib/components/pricing/MarketingPricing.svelte';
	import CompareTable from '$lib/components/pricing/CompareTable.svelte';
	import PricingTables from '$lib/components/pricing/PricingTables.svelte';
	import EuNote from '$lib/components/pricing/EuNote.svelte';
	import TopolBundle from '$lib/components/pricing/TopolBundle.svelte';
	import PricingFaq from '$lib/components/pricing/PricingFaq.svelte';
	import type { Mode } from '$lib/data/pricing';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { jsonLdScript } from '$lib/utils/jsonLd';
	import { productPageJsonLd } from '$lib/utils/pageJsonLd';

	const metaDescription =
		'Transparent Lettr pricing: transactional bills per email, marketing per contact, with a free tier of 3,000 transactional emails a month.';

	let mode: Mode = $state('transactional');

	function handleModeChange(next: Mode) {
		void capturePosthogEvent('pricing_mode_changed', { mode: next });
	}

	onMount(() => {
		// Prerendered page, so the tab is read client-side: /pricing/?plan=marketing opens Marketing
		const plan = new URLSearchParams(window.location.search).get('plan');
		if (plan === 'marketing' || plan === 'transactional') mode = plan;
	});
</script>

<Seo
	title="Email API Pricing – Free to 3,000/mo, Pro from $15 | Lettr"
	description={metaDescription}
	ogDescription="Transactional per email, Marketing per contact. Free tier of 3,000 emails a month."
/>

<svelte:head>
	{@html jsonLdScript(
		productPageJsonLd({
			path: '/pricing/',
			name: 'Pricing',
			description: metaDescription
		})
	)}
</svelte:head>

<section class="pt-page pb-10 md:pb-14">
	<div class="mx-auto flex max-w-[700px] flex-col items-center gap-5 text-center md:gap-6">
		<h1 class="m-0 flex flex-col items-center type-display text-surface">
			Email API pricing
			<em class="type-accent leading-[1.15] whitespace-nowrap text-primary">that grows with you.</em>
		</h1>
		<p class="m-0 max-w-[534px] type-lead text-muted">
			Pay per email for transactional. Pay per contact for marketing.
		</p>
	</div>
</section>

<div class="mx-auto max-w-wide">
	<ModeTabs bind:value={mode} onChange={handleModeChange} />
</div>

<div class="mt-4">
	{#if mode === 'transactional'}
		<TransactionalPricing />
	{:else}
		<MarketingPricing />
	{/if}
</div>

{#if mode === 'transactional'}
	<CompareTable />
{/if}

<PricingTables />

<div class="mx-auto mt-10 max-w-[340px] md:max-w-wide">
	<EuNote />
</div>

<div class="mt-16 md:mt-20">
	<TopolBundle />
</div>

<div class="mt-20 pb-20 md:mt-24 md:pb-[120px]">
	<PricingFaq />
</div>
