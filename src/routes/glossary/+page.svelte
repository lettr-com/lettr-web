<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import GlossaryLetterGroup from '$lib/components/glossary/GlossaryLetterGroup.svelte';
	import GlossaryLetterNav from '$lib/components/glossary/GlossaryLetterNav.svelte';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let header: HTMLElement | undefined = $state();

	const available = $derived(data.groups.map((group) => group.letter));
	const description = $derived(
		`${data.count} email infrastructure, deliverability, authentication and compliance terms, each explained in plain language with how it shows up in Lettr.`
	);

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'DefinedTermSet',
				'@id': 'https://lettr.com/glossary/#set',
				name: 'Lettr Email Glossary',
				url: 'https://lettr.com/glossary/'
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lettr.com/' },
					{ '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://lettr.com/glossary/' }
				]
			}
		]
	};

	onMount(() => {
		if (!header) return;
		return createFromAnimationCleanup({
			scope: header,
			targets: '[data-animate]',
			vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
		});
	});
</script>

<Seo
	title="Email Glossary: Deliverability, Authentication & API Terms | Lettr"
	{description}
	canonical="/glossary/"
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>

<section class="pt-32 pb-24">
	<div bind:this={header}>
		<span data-animate class="mb-4 inline-block font-heading text-xs tracking-[0.15em] text-primary uppercase">
			Glossary
		</span>
		<h1 data-animate>Email terms, explained</h1>
		<p data-animate class="mt-6 max-w-xl text-body leading-[1.8] text-muted">
			Plain-language explanations of email infrastructure, deliverability, authentication and
			compliance terms, and how each one shows up in Lettr.
		</p>

		<div data-animate class="mt-8 border-y border-border/50 py-3">
			<GlossaryLetterNav {available} />
		</div>
	</div>

	<div class="mt-12 grid gap-3 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
		{#each data.groups as group (group.letter)}
			<GlossaryLetterGroup {group} />
		{/each}
	</div>
</section>
