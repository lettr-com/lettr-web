<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import { jsonLdScript } from '$lib/utils/jsonLd';
	import { featurePageJsonLd } from '$lib/utils/pageJsonLd';
	import RelatedFeatures, { type RelatedLink } from '$lib/components/RelatedFeatures.svelte';

	interface Props {
		title: string;
		/** Optional <title> override when a more descriptive search title helps. */
		seoTitle?: string;
		metaDescription: string;
		label: string;
		heading: Snippet;
		description: string;
		children: Snippet;
		/** Optional cross-links to related feature pages, shown above the closing CTA. */
		related?: RelatedLink[];
	}

	let { title, seoTitle, metaDescription, label, heading, description, children, related }: Props = $props();

	const pageTitle = $derived(seoTitle ?? title);

	let registerHref: string = $state(registerUrl);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
	});
</script>

<Seo title="{pageTitle} | Lettr" description={metaDescription} ogTitle="Lettr — {title}" />

<svelte:head>
	{@html jsonLdScript(
		featurePageJsonLd({ path: page.url.pathname, title: pageTitle, description: metaDescription })
	)}
</svelte:head>

<section class="pt-page pb-24">
	<div class="text-center">
		<span class="mb-4 inline-block font-heading text-xs tracking-label text-primary uppercase">
			{label}
		</span>
		<h1 class="mt-2 type-display">
			{@render heading()}
		</h1>
		<p class="mx-auto mt-5 max-w-xl text-body text-muted">
			{description}
		</p>
	</div>

	<div class="mt-16 md:mt-24">
		{@render children()}
	</div>

	{#if related?.length}
		<div class="mt-20 md:mt-32">
			<RelatedFeatures links={related} />
		</div>
	{/if}

	<div class="mt-20 text-center md:mt-32">
		<Button
			href={registerHref}
			size="lg"
			onclick={() => {
				void capturePosthogEvent('cta_clicked', {
					placement: 'feature_page_bottom',
					label: 'Start sending for free',
					feature: label,
					href: registerHref,
					destination_type: 'internal'
				});
				trackSignupClick('feature_page_bottom', registerHref, { feature: label });
			}}
		>
			Start sending for free &rarr;
		</Button>
		<p class="mt-3 text-sm text-muted">3,000 emails/month free. No credit card required.</p>
	</div>
</section>
