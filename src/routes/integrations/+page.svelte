<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowDownIcon from 'phosphor-svelte/lib/ArrowDownIcon';
	import { replaceState } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import GetListedCard from '$lib/components/integrations/GetListedCard.svelte';
	import IntegrationCard from '$lib/components/integrations/IntegrationCard.svelte';
	import IntegrationLetterFilter from '$lib/components/integrations/IntegrationLetterFilter.svelte';
	import IntegrationRow from '$lib/components/integrations/IntegrationRow.svelte';
	import IntegrationSearch from '$lib/components/integrations/IntegrationSearch.svelte';
	import IntegrationsHeroArt from '$lib/components/integrations/IntegrationsHeroArt.svelte';
	import ViewSwitch, { type IntegrationView } from '$lib/components/integrations/ViewSwitch.svelte';
	import type { Ground } from '$lib/components/integrations/grounds';
	import { filterByLetter, letterOf, searchIntegrations, type Letter } from '$lib/integrations/search';
	import { HUB_DESCRIPTION, HUB_TITLE, hubJsonLd, jsonLdScript } from '$lib/integrations/seo';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const VIEW_KEY = 'lettr:integrations-view';

	// the featured row is the page's colour moment: one ground per card, in this order
	const featuredGrounds: Ground[] = ['plum', 'white', 'blush', 'forest'];

	// Search and the A–Z filter narrow the sections in place. The prerendered page shows
	// everything, so the directory still reads in full without JavaScript and for crawlers.
	let query = $state('');
	let letter = $state<Letter | null>(null);
	let view = $state<IntegrationView>('grid');
	let isReady = $state(false);

	const isSearching = $derived(query.trim().length > 0);
	const isFiltering = $derived(isSearching || letter !== null);
	const searchedSections = $derived(
		data.sections.map((section) => ({
			...section,
			entries: searchIntegrations(section.entries, query, () => section.heading)
		}))
	);
	// letters stay live only while they still have an entry under the current search
	const availableLetters = $derived(
		new Set(searchedSections.flatMap((section) => section.entries.map((entry) => letterOf(entry))))
	);
	const visibleSections = $derived(
		searchedSections
			.map((section) => ({ ...section, entries: filterByLetter(section.entries, letter) }))
			.filter((section) => section.entries.length > 0)
	);
	const resultCount = $derived(visibleSections.reduce((sum, section) => sum + section.entries.length, 0));
	// Every category stays in the bar, at 0 when filtered out, so the bar never changes height.
	const categoryCounts = $derived(
		data.sections.map((section) => ({
			id: section.id,
			heading: section.heading,
			count: visibleSections.find((visible) => visible.id === section.id)?.entries.length ?? 0
		}))
	);

	const letterPhrase = $derived(letter === '#' ? 'a number' : letter);
	const status = $derived.by(() => {
		if (!isFiltering) return '';
		const one = resultCount === 1;
		const noun = one ? 'integration' : 'integrations';
		const matches = one ? 'matches' : 'match';
		const starts = one ? 'starts' : 'start';
		const term = query.trim();
		if (isSearching && letter) return `${resultCount} ${noun} ${matches} “${term}” and ${starts} with ${letterPhrase}`;
		if (isSearching) return `${resultCount} ${noun} ${matches} “${term}”`;
		return `${resultCount} ${noun} ${starts} with ${letterPhrase}`;
	});

	onMount(() => {
		// A shared link like /integrations/?q=supabase opens with that search.
		query = new URL(window.location.href).searchParams.get('q') ?? '';
		// The layout is a per-visitor preference; storage can be missing or blocked.
		try {
			const saved = window.localStorage.getItem(VIEW_KEY);
			if (saved === 'grid' || saved === 'list') view = saved;
		} catch {
			// keep the grid
		}
		isReady = true;
	});

	$effect(() => {
		if (!isReady) return;
		const url = new URL(window.location.href);
		const term = query.trim();
		if ((url.searchParams.get('q') ?? '') === term) return;
		if (term) url.searchParams.set('q', term);
		else url.searchParams.delete('q');
		replaceState(url, {});
	});

	$effect(() => {
		if (!isReady) return;
		try {
			window.localStorage.setItem(VIEW_KEY, view);
		} catch {
			// the choice just won't be remembered
		}
	});
</script>

<Seo title={HUB_TITLE} description={HUB_DESCRIPTION} canonical="/integrations/" />

<svelte:head>
	{@html jsonLdScript(hubJsonLd(data.entries, data.faqs))}
</svelte:head>

<section class="pt-page">
	<div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-16">
		<div>
			<h1 class="type-display">
				Everything Lettr
				<span class="type-accent block text-primary">connects to</span>
			</h1>
			<p class="mt-6 max-w-measure type-lead text-pretty text-muted">
				Lettr is the email platform for SaaS: transactional email and campaigns in one account. It
				connects through SDKs, a hosted MCP server, SMTP, webhooks and connectors built by partners.
			</p>
			<div class="mt-8">
				<Button size="lg" href="#get-listed" class="w-full sm:w-auto">
					Get listed
					<ArrowDownIcon aria-hidden="true" />
				</Button>
			</div>
		</div>
		<IntegrationsHeroArt sections={data.sections} />
	</div>

	<div class="mt-10 flex flex-col gap-3 border-y border-border/50 py-3 md:flex-row md:items-center md:justify-between md:gap-8">
		<IntegrationSearch bind:value={query} controls="integration-results" />
		<nav aria-label="Integration categories" class="md:order-first">
			<ul class="flex flex-wrap gap-x-6 gap-y-2">
				{#each categoryCounts as category (category.id)}
					<li>
						{#if category.count > 0}
							<a
								href="#{category.id}"
								class="inline-flex items-baseline gap-1.5 text-sm text-surface transition-colors hover:text-primary"
							>
								{category.heading}
								<span class="text-caption text-muted">{category.count}</span>
							</a>
						{:else}
							<span class="inline-flex items-baseline gap-1.5 text-sm text-border" aria-disabled="true">
								{category.heading}
								<span class="text-caption">0</span>
							</span>
						{/if}
					</li>
				{/each}
				<li>
					<a href="#get-listed" class="text-sm text-surface transition-colors hover:text-primary">
						Get listed
					</a>
				</li>
			</ul>
		</nav>
	</div>

	<div class="mt-3 flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-4">
		<div class="w-full min-w-0 md:flex-1">
			<IntegrationLetterFilter bind:value={letter} available={availableLetters} controls="integration-results" />
		</div>
		<ViewSwitch bind:value={view} controls="integration-results" />
	</div>

	<!-- Holds its line when empty, so picking a letter or typing never moves the results. -->
	<p class="mt-4 min-h-6 text-body-sm text-muted" aria-live="polite" data-markdown="skip">{status}</p>
</section>

<div id="integration-results">
	{#if !isFiltering}
		<section aria-labelledby="featured" class="pt-12 md:pt-16">
			<h2 id="featured" class="type-h6 text-muted">Start here</h2>
			<ul class="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
				{#each data.featured as entry, index (entry.slug)}
					<li>
						<IntegrationCard {entry} variant="featured" ground={featuredGrounds[index % featuredGrounds.length]} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#each visibleSections as section (section.id)}
		<section id={section.id} aria-labelledby="{section.id}-heading" class="scroll-mt-24 section-y-sm">
			<div class="flex flex-col gap-2">
				<h2 id="{section.id}-heading" class="type-h3">{section.heading}</h2>
				<p class="max-w-measure text-body-sm text-muted">{section.intro}</p>
			</div>
			{#if view === 'list'}
				<ul class="mt-8 border-t border-border/50">
					{#each section.entries as entry (entry.slug)}
						<li><IntegrationRow {entry} /></li>
					{/each}
				</ul>
			{:else}
				<ul class="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
					{#each section.entries as entry (entry.slug)}
						<li><IntegrationCard {entry} /></li>
					{/each}
				</ul>
			{/if}
		</section>
	{/each}

	{#if isFiltering && resultCount === 0}
		<section class="section-y-sm" data-markdown="skip">
			<div class="border border-border/50 bg-white p-8 md:p-12">
				<h2 class="type-h3 text-balance">
					No integration matches “{query.trim()}”{letter ? ` and starts with ${letterPhrase}` : ''}
				</h2>
				<p class="mt-4 max-w-measure text-body-sm text-pretty text-muted">
					Lettr still works with any tool that sends over SMTP or makes HTTP requests. Built a connector
					for it? Tell us and we will list it.
				</p>
				<ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
					<li>
						<a href="/integrations/smtp-relay/" class="text-surface underline decoration-border underline-offset-4 transition-colors hover:text-primary">SMTP relay</a>
					</li>
					<li>
						<a href="/integrations/rest-api/" class="text-surface underline decoration-border underline-offset-4 transition-colors hover:text-primary">REST API</a>
					</li>
					<li>
						<a href="#get-listed" class="text-surface underline decoration-border underline-offset-4 transition-colors hover:text-primary">Get listed</a>
					</li>
				</ul>
			</div>
		</section>
	{/if}
</div>

<section id="get-listed" aria-labelledby="get-listed-heading" class="scroll-mt-24 section-y-sm">
	<GetListedCard />
</section>

<section aria-labelledby="questions-heading" class="section-y-sm">
	<h2 id="questions-heading" class="type-h3">Questions</h2>
	<dl class="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
		{#each data.faqs as faq (faq.question)}
			<div class="border-t border-border/50 pt-6">
				<dt class="type-h6">{faq.question}</dt>
				<dd class="mt-2 text-body-sm text-muted">{faq.answer}</dd>
			</div>
		{/each}
	</dl>
</section>
