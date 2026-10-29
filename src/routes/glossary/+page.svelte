<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import GlossaryLetterGroup from '$lib/components/glossary/GlossaryLetterGroup.svelte';
	import GlossaryLetterNav from '$lib/components/glossary/GlossaryLetterNav.svelte';
	import { indexJsonLd, jsonLdScript } from '$lib/glossary/seo';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();


	const available = $derived(data.groups.map((group) => group.letter));
	const description = $derived(
		`${data.count} email infrastructure, deliverability, authentication and compliance terms, each explained in plain language with how it shows up in Lettr.`
	);

	const terms = $derived(data.groups.flatMap((group) => group.terms));
</script>

<Seo
	title="Email Glossary – Deliverability, Auth and API Terms | Lettr"
	{description}
	canonical="/glossary/"
/>

<svelte:head>
	{@html jsonLdScript(indexJsonLd(terms, description))}
</svelte:head>

<section class="pt-32 pb-24">
	<div>
		<span class="mb-4 inline-block font-heading text-sm text-primary">
			Glossary
		</span>
		<h1>Email terms, explained</h1>
		<p class="mt-6 max-w-[40ch] text-body leading-normal text-muted">
			Plain-language explanations of email infrastructure, deliverability, authentication and
			compliance terms, and how each one shows up in Lettr.
		</p>

		<div class="mt-8 border-y border-border/50 py-3">
			<GlossaryLetterNav {available} />
		</div>
	</div>

	<div class="mt-12 grid gap-3 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
		{#each data.groups as group (group.letter)}
			<GlossaryLetterGroup {group} />
		{/each}
	</div>
</section>
