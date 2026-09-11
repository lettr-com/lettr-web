<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ChangelogFeed from '$lib/components/changelog/ChangelogFeed.svelte';
	import ChangelogFilter from '$lib/components/changelog/ChangelogFilter.svelte';
	import ChangelogArchive from '$lib/components/changelog/ChangelogArchive.svelte';
	import type { FilterToken } from '$lib/changelog/filter';
	import { MONTHS } from '$lib/changelog/months';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let header: HTMLElement | undefined = $state();
	// Owned here rather than inside the filter panel because the feed below is
	// what the selection actually acts on.
	let filter = $state<FilterToken[]>([]);
	// The feed counts the matches — it is the only thing that knows how many
	// months it has read — and the panel above states them, so the selection is
	// described once rather than twice.
	let filterStatus = $state<string | undefined>();

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
	title="Changelog | Lettr"
	description="Everything we ship to Lettr, month by month: new features, improvements and bugfixes across the transactional API, campaigns, audience and the platform."
	ogTitle="Lettr Changelog"
	canonical="/changelog/"
/>

<section id="top" class="pt-32 pb-24">
	<div bind:this={header}>
		<span
			data-animate
			class="mb-4 inline-block font-heading text-sm text-primary"
		>
			Changelog
		</span>
		<h1 data-animate>Everything we ship,<br class="hidden sm:inline" />month by month</h1>
		<p data-animate class="mt-6 max-w-xl text-body leading-[1.8] text-muted">
			Every month we post a summary of what's new in Lettr: features, improvements and
			bugfixes. Each entry is tagged with the part of the app it affects.
		</p>

		{#if MONTHS.length > 1}
			<div data-animate class="mt-8 border-y border-border/50 py-3">
				<ChangelogArchive {filter} />
			</div>
		{/if}

		<div data-animate class="mt-6">
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
