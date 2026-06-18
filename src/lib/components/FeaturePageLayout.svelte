<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';
	import Seo from '$lib/components/Seo.svelte';
	import RelatedFeatures, { type RelatedLink } from '$lib/components/RelatedFeatures.svelte';

	interface Props {
		title: string;
		metaDescription: string;
		label: string;
		heading: Snippet;
		description: string;
		children: Snippet;
		/** Optional cross-links to related feature pages, shown above the closing CTA. */
		related?: RelatedLink[];
	}

	let { title, metaDescription, label, heading, description, children, related }: Props = $props();

	let hero: HTMLElement | undefined = $state();
	let registerHref: string = $state(registerUrl);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);

		if (!hero) return;

		return createFromAnimationCleanup({
			scope: hero,
			targets: '[data-animate]',
			vars: {
				y: 20,
				opacity: 0,
				duration: 0.6,
				stagger: 0.1,
				ease: 'power3.out'
			}
		});
	});
</script>

<Seo title="{title} | Lettr" description={metaDescription} ogTitle="Lettr — {title}" />

<section class="pt-32 pb-24">
	<div bind:this={hero} class="text-center">
		<span data-animate class="mb-4 inline-block font-heading text-xs tracking-[0.15em] text-primary uppercase">
			{label}
		</span>
		<h1 data-animate class="mt-2">
			{@render heading()}
		</h1>
		<p data-animate class="mx-auto mt-5 max-w-xl text-body text-muted">
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
		<a
			href={registerHref}
			class="inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
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
		</a>
		<p class="mt-3 text-sm text-muted">3,000 emails/month free. No credit card required.</p>
	</div>
</section>
