<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
	import Seo from '$lib/components/Seo.svelte';
	import GlossaryFurtherReading from '$lib/components/glossary/GlossaryFurtherReading.svelte';
	import GlossaryRelatedTerms from '$lib/components/glossary/GlossaryRelatedTerms.svelte';
	import GlossaryStepper from '$lib/components/glossary/GlossaryStepper.svelte';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let header: HTMLElement | undefined = $state();

	const heading = $derived(`${data.term.question} ${data.term.term}?`);
	const pageUrl = $derived(`https://lettr.com/glossary/${data.term.slug}/`);

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'DefinedTerm',
				'@id': `${pageUrl}#term`,
				name: data.term.term,
				...(data.term.fullName ? { alternateName: data.term.fullName } : {}),
				description: data.term.description,
				url: pageUrl,
				inDefinedTermSet: { '@id': 'https://lettr.com/glossary/#set' }
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lettr.com/' },
					{ '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://lettr.com/glossary/' },
					{ '@type': 'ListItem', position: 3, name: data.term.term, item: pageUrl }
				]
			}
		]
	});

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
	title="{heading} | Lettr Glossary"
	description={data.term.description}
	ogTitle={heading}
	type="article"
	canonical="/glossary/{data.term.slug}/"
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>

<article class="pt-32 pb-24">
	<div class="max-w-[800px]">
		<header bind:this={header}>
			<a
				data-animate
				href="/glossary/"
				class="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
			>
				<ArrowLeftIcon size={15} />
				All terms
			</a>
			<span data-animate class="mt-8 block font-heading text-xs tracking-[0.15em] text-primary uppercase">
				Glossary
			</span>
			<h1 data-animate class="mt-3">{heading}</h1>
		</header>

		<div class="blog-prose glossary-prose mt-10 text-body text-surface">
			{@html data.term.html}
		</div>

		{#if data.term.reading.length > 0}
			<GlossaryFurtherReading links={data.term.reading} />
		{/if}

		{#if data.related.length > 0}
			<GlossaryRelatedTerms terms={data.related} />
		{/if}

		<GlossaryStepper prev={data.prev} next={data.next} />
	</div>
</article>
