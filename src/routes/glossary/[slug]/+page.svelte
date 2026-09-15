<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
	import Seo from '$lib/components/Seo.svelte';
	import GlossaryLinkGrid from '$lib/components/glossary/GlossaryLinkGrid.svelte';
	import GlossaryStepper from '$lib/components/glossary/GlossaryStepper.svelte';
	import { jsonLdScript, termHeading, termJsonLd, termTitle } from '$lib/glossary/seo';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let header: HTMLElement | undefined = $state();

	const heading = $derived(termHeading(data.term));
	const readingLinks = $derived(data.term.reading.map(({ href, title }) => ({ href, label: title })));
	const relatedLinks = $derived(data.related.map(({ href, term }) => ({ href, label: term })));

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
	title={termTitle(data.term)}
	description={data.term.description}
	ogTitle={heading}
	type="article"
	canonical="/glossary/{data.term.slug}/"
/>

<svelte:head>
	{@html jsonLdScript(termJsonLd(data.term))}
</svelte:head>

<article class="pt-32 pb-24">
	<div class="max-w-[800px]">
		<header bind:this={header}>
			<a
				data-animate
				href="/glossary/"
				class="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
			>
				<ArrowLeftIcon
					size={15}
					class="shrink-0 transition-transform duration-200 ease-out group-hover:-translate-x-0.5 motion-reduce:transition-none"
				/>
				All terms
			</a>
			<span data-animate class="mt-8 block font-heading text-sm text-primary">
				Glossary
			</span>
			<h1 data-animate class="mt-3">{heading}</h1>
		</header>

		<div class="blog-prose glossary-prose mt-10 text-body text-surface">
			{@html data.term.html}
		</div>

		{#if readingLinks.length > 0}
			<GlossaryLinkGrid id="glossary-further-reading" heading="Further reading" links={readingLinks} />
		{/if}

		{#if relatedLinks.length > 0}
			<GlossaryLinkGrid id="glossary-related-terms" heading="Related terms" links={relatedLinks} />
		{/if}

		<GlossaryStepper prev={data.prev} next={data.next} />
	</div>
</article>
