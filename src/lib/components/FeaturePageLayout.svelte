<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';

	interface Props {
		title: string;
		metaDescription: string;
		label: string;
		heading: Snippet;
		description: string;
		children: Snippet;
	}

	let { title, metaDescription, label, heading, description, children }: Props = $props();

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

<svelte:head>
	<title>{title} | Lettr</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href="https://lettr.com" />
	<meta property="og:title" content="Lettr — {title}" />
	<meta property="og:description" content={metaDescription} />
	<meta name="twitter:title" content="Lettr — {title}" />
	<meta name="twitter:description" content={metaDescription} />
</svelte:head>

<section class="px-4 pt-32 pb-24">
	<div bind:this={hero} class="mx-auto max-w-[550px] text-center">
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

	<div class="mx-auto mt-20 max-w-[550px] text-center md:mt-32">
		<a
			href={registerHref}
			class="inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
		>
			Start sending for free &rarr;
		</a>
		<p class="mt-3 text-sm text-muted">3,000 emails/month free. No credit card required.</p>
	</div>
</section>
