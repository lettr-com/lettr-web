<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ChangelogFeed from '$lib/components/changelog/ChangelogFeed.svelte';
	import ChangelogFilter from '$lib/components/changelog/ChangelogFilter.svelte';
	import ChangelogArchive from '$lib/components/changelog/ChangelogArchive.svelte';
	import type { FilterToken } from '$lib/changelog/filter';
	import { MONTHS } from '$lib/changelog/months';
	import { FEED_URL, INDEX_DESCRIPTION, INDEX_TITLE, indexJsonLd } from '$lib/changelog/seo';
	import { jsonLdScript } from '$lib/utils/jsonLd';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Owned here rather than inside the filter panel because the feed below is
	// what the selection actually acts on.
	let filter = $state<FilterToken[]>([]);
	// The feed counts the matches — it is the only thing that knows how many
	// months it has read — and the panel above states them, so the selection is
	// described once rather than twice.
	let filterStatus = $state<string | undefined>();
</script>

<Seo title={INDEX_TITLE} description={INDEX_DESCRIPTION} ogTitle="Lettr Changelog" canonical="/changelog/" />

<svelte:head>
	<link rel="alternate" type="application/atom+xml" title="Lettr Changelog" href={FEED_URL} />
	{@html jsonLdScript(indexJsonLd(data.month))}
</svelte:head>

<section id="top" class="pt-32 pb-24">
	<div>
		<span
			class="mb-4 inline-block font-heading text-sm text-primary"
		>
			Changelog
		</span>
		<h1>Everything we ship to Lettr,<br class="hidden sm:inline" />month by month</h1>
		<p class="mt-6 max-w-[45ch] text-body leading-[1.8] text-muted">
			Every month we post a summary of what's new in Lettr: features, improvements and
			bugfixes. Each entry is tagged with the part of the app it affects.
		</p>

		{#if MONTHS.length > 1}
			<div class="mt-8 border-y border-border/50 py-3">
				<ChangelogArchive {filter} />
			</div>
		{/if}

		<div class="mt-6">
			<ChangelogFilter bind:tokens={filter} status={filterStatus} />
		</div>
	</div>

	<div class="mt-16">
		<ChangelogFeed
			initial={data.month}
			{filter}
			bind:status={filterStatus}
			onClear={() => (filter = [])}
		/>
	</div>
</section>
