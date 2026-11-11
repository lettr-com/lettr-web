<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import Seo from '$lib/components/Seo.svelte';
	import GetListedCard from '$lib/components/integrations/GetListedCard.svelte';
	import IntegrationCard from '$lib/components/integrations/IntegrationCard.svelte';
	import IntegrationSearch from '$lib/components/integrations/IntegrationSearch.svelte';
	import IntegrationsHeroArt from '$lib/components/integrations/IntegrationsHeroArt.svelte';
	import type { Ground } from '$lib/components/integrations/grounds';
	import { searchIntegrations } from '$lib/integrations/search';
	import { HUB_DESCRIPTION, HUB_TITLE, hubJsonLd, jsonLdScript } from '$lib/integrations/seo';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// the featured row is the page's colour moment: one ground per card, in this order
	const featuredGrounds: Ground[] = ['plum', 'white', 'blush', 'forest'];

	// Search narrows the sections in place. The prerendered page shows everything, so the
	// directory still reads in full without JavaScript and for crawlers.
	let query = $state('');
	let isReady = $state(false);
	const isSearching = $derived(query.trim().length > 0);
	const visibleSections = $derived(
		data.sections
			.map((section) => ({ ...section, entries: searchIntegrations(section.entries, query, () => section.heading) }))
			.filter((section) => section.entries.length > 0)
	);
	const resultCount = $derived(visibleSections.reduce((sum, section) => sum + section.entries.length, 0));

	onMount(() => {
		// A shared link like /integrations/?q=supabase opens with that search.
		query = new URL(window.location.href).searchParams.get('q') ?? '';
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
		</div>
		<IntegrationsHeroArt sections={data.sections} />
	</div>

	<div class="mt-10 flex flex-col gap-3 border-y border-border/50 py-3 md:flex-row md:items-center md:justify-between md:gap-8">
		<IntegrationSearch bind:value={query} controls="integration-results" />
		<nav aria-label="Integration categories" class="md:order-first">
			<ul class="flex flex-wrap gap-x-6 gap-y-2">
				{#each visibleSections as section (section.id)}
					<li>
						<a
							href="#{section.id}"
							class="inline-flex items-baseline gap-1.5 text-sm text-surface transition-colors hover:text-primary"
						>
							{section.heading}
							<span class="text-caption text-muted">{section.entries.length}</span>
						</a>
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
	<p class="mt-4 text-body-sm text-muted empty:hidden" aria-live="polite" data-markdown="skip">
		{#if isSearching}{resultCount === 1 ? '1 integration matches' : `${resultCount} integrations match`} “{query.trim()}”{/if}
	</p>
</section>

<div id="integration-results">
{#if !isSearching}
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
		<ul class="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
			{#each section.entries as entry (entry.slug)}
				<li><IntegrationCard {entry} /></li>
			{/each}
		</ul>
	</section>
{/each}

{#if isSearching && resultCount === 0}
	<section class="section-y-sm" data-markdown="skip">
		<div class="border border-border/50 bg-white p-8 md:p-12">
			<h2 class="type-h3 text-balance">No integration matches “{query.trim()}”</h2>
			<p class="mt-4 max-w-measure text-body-sm text-pretty text-muted">
				Lettr still works with any tool that sends over SMTP or makes HTTP requests. Built a connector
				for it? Tell us and we will list it.
			</p>
			<ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
				<li><a href="/integrations/smtp-relay/" class="text-surface underline decoration-border underline-offset-4 transition-colors hover:text-primary">SMTP relay</a></li>
				<li><a href="/integrations/rest-api/" class="text-surface underline decoration-border underline-offset-4 transition-colors hover:text-primary">REST API</a></li>
				<li><a href="#get-listed" class="text-surface underline decoration-border underline-offset-4 transition-colors hover:text-primary">Get listed</a></li>
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
