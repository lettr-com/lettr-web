<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import ArrowUpIcon from 'phosphor-svelte/lib/ArrowUpIcon';
	import { MONTHS, formatMonth, loadMonth } from '$lib/changelog/months';
	import { trackChangelogLinkClick } from '$lib/changelog/analytics';
	import {
		describeFilter,
		entryCount,
		filterMonth,
		monthHref,
		summarizeMatches,
		type FilterToken
	} from '$lib/changelog/filter';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';
	import type { ChangelogMonth as ChangelogMonthData } from '$lib/changelog/types';
	import ChangelogMonth from './ChangelogMonth.svelte';

	interface Props {
		/** The newest month, resolved in `load()` so it is part of the prerendered HTML. */
		initial: ChangelogMonthData;
		/** Active badge filter. Months with nothing matching drop out of the feed. */
		filter?: FilterToken[];
		/** Called from the empty state, so a dead end always offers a way out. */
		onClear?: () => void;
		/**
		 * The filter's status line, reported upward rather than rendered here: the
		 * feed is the only thing that knows how many months it has actually read,
		 * but the reader should get one line about the selection, not a second one
		 * restating what the panel above already says. Undefined when nothing is
		 * selected.
		 */
		status?: string;
	}

	let { initial, filter = [], onClear, status = $bindable() }: Props = $props();

	let container: HTMLElement | undefined = $state();
	let sentinel: HTMLElement | undefined = $state();
	// The newest month arrives as a prop and every later one is appended here,
	// so the rendered list is derived rather than seeded — seeding $state with
	// `initial` would capture only its first value.
	let older = $state<ChangelogMonthData[]>([]);
	let isLoading = $state(false);
	// Set while a filter pulls in every month it has not read yet. Distinct from
	// `isLoading`, which is the one-month-at-a-time scroll loader.
	let isSearchingAll = $state(false);
	let failedMonth = $state<string | null>(null);

	const loaded = $derived([initial, ...older]);
	const loadedIds = $derived(new Set(loaded.map((month) => month.id)));
	const isComplete = $derived(loaded.length >= MONTHS.length);
	/** The oldest month still missing, rather than `MONTHS[loaded.length]`: the
	 * bulk load below settles out of order, so a positional guess would repeat a
	 * month it had already read. */
	const nextMonthId = $derived(MONTHS.find((id) => !loadedIds.has(id)));

	// A filtered month is kept only if something survived the filter; a run of
	// month headings with nothing under them is not an answer to "show me the
	// transactional changes". The sentinel stays on screen while they drop out,
	// which is what walks the loader on to the next month by itself.
	const visible = $derived(loaded.filter((month) => entryCount(filterMonth(month, filter)) > 0));
	const matchCount = $derived(
		loaded.reduce((total, month) => total + entryCount(filterMonth(month, filter)), 0)
	);
	const matchSummary = $derived.by(() => {
		if (isSearchingAll) return `Searching every month for ${describeFilter(filter)}…`;

		const line = summarizeMatches(matchCount, filter);
		// Filtering reads the whole log, so the count is unqualified — unless a
		// month refused to load, which is the one case where it really is partial.
		return isComplete ? `${line}.` : `${line}, excluding months that could not be loaded.`;
	});

	$effect(() => {
		status = filter.length ? matchSummary : undefined;
	});

	const revealCleanups: (() => void)[] = [];
	// Reveal-on-scroll is a first-impression device. Once the reader starts
	// filtering, entries appear because they clicked, so the animation is
	// retired for the rest of the visit rather than replayed on every toggle.
	let isInstant = $state(false);

	/** Reveal one month's entries, once it is in the DOM. */
	async function revealMonth(id: string) {
		if (isInstant) return;
		await tick();
		const element = container?.querySelector(`[data-month="${id}"]`);
		if (!element) return;
		revealCleanups.push(createScrollRevealCleanup({ scope: element, targets: '[data-reveal]' }));
	}

	/** Keeps `older` in registry order however the months arrived. */
	function addMonths(months: ChangelogMonthData[]) {
		const byId = new Map(older.map((month) => [month.id, month]));
		for (const month of months) byId.set(month.id, month);
		older = [...byId.values()].sort((a, b) => MONTHS.indexOf(a.id) - MONTHS.indexOf(b.id));
	}

	/**
	 * Picking a badge means "show me everything tagged this", so the filter reads
	 * the months it has not fetched yet rather than answering over whatever the
	 * reader happened to have scrolled past. Each month is its own small chunk,
	 * so this is a handful of parallel imports, and it lets the count next to the
	 * feed be a fact about the log instead of a fact about the scroll position.
	 */
	async function searchWholeLog() {
		if (isSearchingAll || isComplete) return;

		const pending = MONTHS.filter((id) => !loadedIds.has(id));
		if (pending.length === 0) return;

		isSearchingAll = true;
		const results = await Promise.allSettled(pending.map((id) => loadMonth(id)));
		const fetched: ChangelogMonthData[] = [];

		results.forEach((result, index) => {
			if (result.status === 'fulfilled') fetched.push(result.value);
			else failedMonth ??= pending[index];
		});

		addMonths(fetched);
		isSearchingAll = false;
	}

	$effect(() => {
		if (filter.length === 0) return;

		untrack(() => {
			if (!isInstant) {
				isInstant = true;
				// Reverting the contexts drops the inline opacity gsap set, handing the
				// elements back to the `[data-reveal-instant]` rule in app.css.
				revealCleanups.forEach((fn) => fn());
				revealCleanups.length = 0;
			}

			void searchWholeLog();
		});
	});

	async function loadNextMonth(observer: IntersectionObserver) {
		const id = nextMonthId;
		if (isLoading || isSearchingAll || !id || failedMonth) return;

		isLoading = true;

		try {
			addMonths([await loadMonth(id)]);
			await revealMonth(id);
		} catch {
			// A month that will not load is still reachable at its own page, so
			// offer that rather than retrying the same import forever.
			failedMonth = id;
		} finally {
			isLoading = false;
		}

		// A short month — or one the filter emptied — can leave the sentinel still
		// on screen, and an observer does not re-fire while an entry stays
		// intersecting. Re-observing forces a fresh check on the next frame.
		if (sentinel && !isComplete && !failedMonth) {
			observer.unobserve(sentinel);
			observer.observe(sentinel);
		}
	}

	onMount(() => {
		const cleanups: (() => void)[] = [];

		if (container) {
			const element = container;
			element.addEventListener('click', trackChangelogLinkClick);
			cleanups.push(() => element.removeEventListener('click', trackChangelogLinkClick));
			void revealMonth(initial.id);
		}

		if (sentinel) {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries.some((entry) => entry.isIntersecting)) void loadNextMonth(observer);
				},
				{ rootMargin: '200px' }
			);
			observer.observe(sentinel);
			cleanups.push(() => observer.disconnect());
		}

		return () => {
			cleanups.forEach((fn) => fn());
			revealCleanups.forEach((fn) => fn());
		};
	});
</script>

<div bind:this={container} data-reveal-instant={isInstant ? '' : undefined} class="divide-y divide-border/50">
	{#each visible as month (month.id)}
		<div class="py-16 first:pt-0">
			<ChangelogMonth {month} isLatest={month.id === initial.id} {filter} />
		</div>
	{/each}
</div>

<!-- Held back while the filter is still reading months, so a log that does
	 contain matches never flashes "nothing here" on the way to finding them. -->
{#if filter.length && visible.length === 0 && !isSearchingAll}
	<div class="border-t border-border/50 py-16 text-center">
		<p class="text-body text-surface">
			{isComplete
				? `Nothing in the log is tagged ${describeFilter(filter)}.`
				: `Nothing tagged ${describeFilter(filter)} in the months that could be loaded.`}
		</p>
		{#if onClear}
			<button
				type="button"
				onclick={onClear}
				class="mt-4 cursor-pointer text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/70"
			>
				Clear the filter
			</button>
		{/if}
	</div>
{/if}

{#if !isComplete}
	<div bind:this={sentinel} class="border-t border-border/50 pt-10 text-center">
		{#if failedMonth}
			<p class="text-sm text-muted">
				{formatMonth(failedMonth)} could not be loaded here.
				<a
					href={monthHref(failedMonth, filter)}
					class="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
				>
					Open it on its own page
				</a>.
			</p>
		{:else}
			<p class="text-sm text-muted" aria-live="polite">
				{isLoading || isSearchingAll ? 'Loading earlier months…' : 'Scroll for earlier months'}
			</p>
		{/if}
	</div>
{:else}
	<div class="border-t border-border/50 pt-10 text-center">
		<div class="flex items-center justify-center gap-2" role="separator">
			<span class="h-1 w-1 bg-border"></span>
			<span class="h-1 w-1 bg-border"></span>
			<span class="h-1 w-1 bg-border"></span>
		</div>
		<p class="mt-6 text-sm text-muted">
			That is the whole log, back to {formatMonth(MONTHS[MONTHS.length - 1])}.
		</p>
		<p class="mt-2 text-sm text-muted">
			Something missing or wrong?
			<a
				href="/support/"
				class="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
			>
				Tell us
			</a>
			— we would rather fix the entry than have you find out the hard way.
		</p>
		<a
			href="#top"
			class="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
		>
			<ArrowUpIcon
				size={14}
				class="transition-transform duration-200 group-hover:-translate-y-0.5"
			/>
			Back to the latest month
		</a>
	</div>
{/if}
