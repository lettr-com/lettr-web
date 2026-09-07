<script lang="ts">
	import { onMount, tick } from 'svelte';
	import ArrowUpIcon from 'phosphor-svelte/lib/ArrowUpIcon';
	import { MONTHS, formatMonth, loadMonth } from '$lib/changelog/months';
	import { trackChangelogLinkClick } from '$lib/changelog/analytics';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';
	import type { ChangelogMonth as ChangelogMonthData } from '$lib/changelog/types';
	import ChangelogMonth from './ChangelogMonth.svelte';

	interface Props {
		/** The newest month, resolved in `load()` so it is part of the prerendered HTML. */
		initial: ChangelogMonthData;
	}

	let { initial }: Props = $props();

	let container: HTMLElement | undefined = $state();
	let sentinel: HTMLElement | undefined = $state();
	// The newest month arrives as a prop and every later one is appended here,
	// so the rendered list is derived rather than seeded — seeding $state with
	// `initial` would capture only its first value.
	let older = $state<ChangelogMonthData[]>([]);
	let isLoading = $state(false);
	let failedMonth = $state<string | null>(null);

	const loaded = $derived([initial, ...older]);
	const isComplete = $derived(loaded.length >= MONTHS.length);

	const revealCleanups: (() => void)[] = [];

	/** Reveal the month element added most recently, once it is in the DOM. */
	async function revealNewestMonth() {
		await tick();
		const elements = container?.querySelectorAll('[data-month]');
		const newest = elements?.[elements.length - 1];
		if (!newest) return;
		revealCleanups.push(createScrollRevealCleanup({ scope: newest, targets: '[data-reveal]' }));
	}

	async function loadNextMonth(observer: IntersectionObserver) {
		if (isLoading || isComplete || failedMonth) return;

		const id = MONTHS[loaded.length];
		isLoading = true;

		try {
			older = [...older, await loadMonth(id)];
			await revealNewestMonth();
		} catch {
			// A month that will not load is still reachable at its own page, so
			// offer that rather than retrying the same import forever.
			failedMonth = id;
		} finally {
			isLoading = false;
		}

		// A short month can leave the sentinel still on screen, and an observer
		// does not re-fire while an entry stays intersecting. Re-observing forces
		// a fresh check on the next frame.
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
			void revealNewestMonth();
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

<div bind:this={container} class="divide-y divide-border/50">
	{#each loaded as month, index (month.id)}
		<div class="py-16 first:pt-0">
			<ChangelogMonth {month} isLatest={index === 0} />
		</div>
	{/each}
</div>

{#if !isComplete}
	<div bind:this={sentinel} class="border-t border-border/50 pt-10 text-center">
		{#if failedMonth}
			<p class="text-sm text-muted">
				{formatMonth(failedMonth)} could not be loaded here.
				<a
					href="/changelog/{failedMonth}/"
					class="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
				>
					Open it on its own page
				</a>.
			</p>
		{:else}
			<p class="text-sm text-muted" aria-live="polite">
				{isLoading ? 'Loading earlier months…' : 'Scroll for earlier months'}
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
