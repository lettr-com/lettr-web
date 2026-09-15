<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import Seo from '$lib/components/Seo.svelte';
	import ChangelogMonth from '$lib/components/changelog/ChangelogMonth.svelte';
	import ChangelogArchive from '$lib/components/changelog/ChangelogArchive.svelte';
	import ChangelogFilter from '$lib/components/changelog/ChangelogFilter.svelte';
	import { trackChangelogLinkClick } from '$lib/changelog/analytics';
	import {
		describeFilter,
		entryCount,
		filterMonth,
		filterQuery,
		monthHref,
		summarizeMatches,
		type FilterToken
	} from '$lib/changelog/filter';
	import { formatMonth } from '$lib/changelog/months';
	import { FEED_URL, formatDate, monthDescription, monthJsonLd, monthTitle } from '$lib/changelog/seo';
	import { summarizeMonthHtml } from '$lib/changelog/summary';
	import { jsonLdScript } from '$lib/utils/jsonLd';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { untrack } from 'svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let header: HTMLElement | undefined = $state();
	let body: HTMLElement | undefined = $state();
	let filter = $state<FilterToken[]>([]);

	const label = $derived(formatMonth(data.month.id));
	const total = $derived(entryCount(data.month));
	const matches = $derived(entryCount(filterMonth(data.month, filter)));
	const filterStatus = $derived(
		filter.length ? `${summarizeMatches(matches, filter, total)}.` : undefined
	);
	// The hero line, with the counts marked up because they are the point of
	// it. The meta description is the same sentence plus the headline features,
	// built in `monthDescription`.
	const summaryHtml = $derived(summarizeMonthHtml(data.month));
	const descriptionHtml = $derived(
		summaryHtml
			? `Everything Lettr shipped in ${label}: ${summaryHtml}.`
			: `Everything Lettr shipped in ${label}.`
	);

	onMount(() => {
		const cleanups: (() => void)[] = [];

		if (header) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: header,
					targets: '[data-animate]',
					vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
				})
			);
		}

		if (body) {
			const element = body;
			element.addEventListener('click', trackChangelogLinkClick);
			cleanups.push(() => element.removeEventListener('click', trackChangelogLinkClick));
		}

		return () => cleanups.forEach((fn) => fn());
	});

	// Reveal-on-scroll is a first-impression device. Once the reader starts
	// filtering, entries appear because they clicked, so the animation is
	// retired for the rest of the visit rather than replayed on every toggle.
	let isInstant = $state(false);

	$effect(() => {
		if (filter.length > 0 && !untrack(() => isInstant)) isInstant = true;
	});

	// Moving between months reuses this component, so onMount fires only for the
	// first one — while every entry below is replaced and starts at opacity 0
	// (see `[data-reveal]` in app.css). Re-running the reveal per month is what
	// makes the new entries appear at all; without it they stay invisible.
	// Retiring it reverts the contexts, handing the entries to the
	// `[data-reveal-instant]` rule instead.
	$effect(() => {
		void data.month.id;
		const element = body;
		if (!element || isInstant) return;

		return createScrollRevealCleanup({ scope: element, targets: '[data-reveal]' });
	});
</script>

<Seo
	title={monthTitle(data.month)}
	description={monthDescription(data.month)}
	ogTitle="Lettr Changelog — {label}"
	type="article"
	canonical="/changelog/{data.month.id}/"
/>

<svelte:head>
	<meta property="article:published_time" content={data.month.published} />
	<meta property="article:modified_time" content={data.month.published} />
	<link rel="alternate" type="application/atom+xml" title="Lettr Changelog" href={FEED_URL} />
	{@html jsonLdScript(monthJsonLd(data.month))}
</svelte:head>

<section class="pt-32 pb-24">
	<div bind:this={header}>
		<a
			data-animate
			href="/changelog/"
			class="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
		>
			<ArrowLeftIcon size={15} />
			All changes
		</a>

		<span
			data-animate
			class="mt-8 block font-heading text-sm text-primary"
		>
			Lettr changelog
		</span>
		<h1 data-animate class="mt-3">What's new in {label}</h1>
		<p data-animate class="mt-5 max-w-[40ch] text-body leading-normal text-muted">
			{@html descriptionHtml}
		</p>
		<p data-animate class="mt-4 text-xs text-muted">
			Published <time datetime={data.month.published}>{formatDate(data.month.published)}</time>
		</p>

		<div data-animate class="mt-10 border-t border-border/50 py-3">
			<ChangelogArchive current={data.month.id} {filter} />
		</div>

		<div data-animate class="mt-6">
			<ChangelogFilter bind:tokens={filter} status={filterStatus} />
		</div>
	</div>

	<div
		bind:this={body}
		data-reveal-instant={isInstant ? '' : undefined}
		class="mt-10 border-t border-border/50 pt-12"
	>
		{#if filter.length && matches === 0}
			<div class="py-8 text-center">
				<p class="text-body text-surface">
					Nothing in {label} is tagged {describeFilter(filter)}.
				</p>
				<div class="mt-4 flex flex-wrap items-baseline justify-center gap-x-6 gap-y-2 text-sm font-medium">
					<a
						href="/changelog/{filterQuery(filter)}"
						class="text-primary underline underline-offset-4 transition-colors hover:text-primary/70"
					>
						Look across every month
					</a>
					<button
						type="button"
						onclick={() => (filter = [])}
						class="cursor-pointer text-muted underline underline-offset-4 transition-colors hover:text-primary"
					>
						Clear the filter
					</button>
				</div>
			</div>
		{:else}
			<ChangelogMonth month={data.month} variant="page" {filter} />
		{/if}
	</div>

	{#if data.newer || data.older}
		<nav aria-label="Other months" class="mt-20 border-t border-border/50 pt-12">
			<h2 class="font-heading text-sm text-primary">Other months</h2>
			<div class="mt-6 grid gap-4 sm:grid-cols-2">
				{#if data.older}
					<a
						href={monthHref(data.older, filter)}
						class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30"
					>
						<span class="text-xs font-medium text-muted">Earlier</span>
						<span
							class="mt-2 inline-flex items-center gap-2 font-heading text-h3 text-surface transition-colors group-hover:text-primary"
						>
							<ArrowLeftIcon
								size={16}
								class="text-muted transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-primary"
							/>
							{formatMonth(data.older)}
						</span>
					</a>
				{:else}
					<span class="hidden sm:block" aria-hidden="true"></span>
				{/if}

				{#if data.newer}
					<a
						href={monthHref(data.newer, filter)}
						class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30 sm:items-end sm:text-right"
					>
						<span class="text-xs font-medium text-muted">Later</span>
						<span
							class="mt-2 inline-flex items-center gap-2 font-heading text-h3 text-surface transition-colors group-hover:text-primary"
						>
							{formatMonth(data.newer)}
							<ArrowRightIcon
								size={16}
								class="text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
							/>
						</span>
					</a>
				{/if}
			</div>
		</nav>
	{/if}
</section>
