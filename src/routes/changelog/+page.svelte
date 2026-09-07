<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ChangelogFeed from '$lib/components/changelog/ChangelogFeed.svelte';
	import ChangelogLegend from '$lib/components/changelog/ChangelogLegend.svelte';
	import { MONTHS, formatMonth } from '$lib/changelog/months';
	import { summarizeMonth } from '$lib/changelog/summary';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const latestLabel = $derived(formatMonth(data.month.id));
	const latestSummary = $derived(summarizeMonth(data.month));

	let header: HTMLElement | undefined = $state();

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
			class="mb-4 inline-block font-heading text-xs tracking-[0.15em] text-primary uppercase"
		>
			Changelog
		</span>
		<h1 data-animate>Everything we ship,<br class="hidden sm:inline" />month by month</h1>
		<p data-animate class="mt-6 max-w-xl text-body leading-[1.8] text-muted">
			If a change is something you could notice from the outside, it is written down here —
			including the ones we would rather have shipped quietly. Work that never leaves our side
			of the wire stays out.
		</p>

		<div
			data-animate
			class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border/50 py-4 text-sm"
		>
			<span class="flex items-center gap-2.5 font-medium text-surface">
				<span class="block h-1.5 w-1.5 bg-primary" aria-hidden="true"></span>
				Latest: {latestLabel}
			</span>
			{#if latestSummary}
				<span class="text-muted">{latestSummary}</span>
			{/if}
			{#if MONTHS.length > 1}
				<nav
					aria-label="Browse by month"
					class="flex flex-wrap items-center gap-x-4 gap-y-1 sm:ml-auto"
				>
					{#each MONTHS as id (id)}
						<a
							href="/changelog/{id}/"
							class="text-xs font-medium text-muted transition-colors hover:text-primary"
						>
							{formatMonth(id)}
						</a>
					{/each}
				</nav>
			{/if}
		</div>

		<div data-animate class="mt-6">
			<ChangelogLegend />
		</div>
	</div>

	<div class="mt-16">
		<ChangelogFeed initial={data.month} />
	</div>
</section>
