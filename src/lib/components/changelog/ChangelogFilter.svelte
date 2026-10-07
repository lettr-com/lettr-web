<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import { replaceState } from '$app/navigation';
	import { trackChangelogFilterChange } from '$lib/changelog/analytics';
	import {
		FEATURE_TAGS,
		MODULES,
		describeFilter,
		filterQuery,
		parseFilter,
		toggleFilter,
		type FilterToken
	} from '$lib/changelog/filter';
	import ChangelogBadge from './ChangelogBadge.svelte';

	interface Props {
		/** The active selection, owned by the page so it can filter what it renders. */
		tokens: FilterToken[];
		/** What the page can count under the current selection, e.g. "6 of 23 entries". */
		status?: string;
	}

	let { tokens = $bindable(), status }: Props = $props();

	// Collapsed by default: the badges are also printed on every entry below, so
	// the panel is a tool you reach for rather than a legend you must read
	// first. A shared link that already carries a selection opens it, so the
	// reader can see — and undo — the filter that is acting on the page.
	let isOpen = $state(false);

	// The page is prerendered without search params, so the filter in a shared
	// link can only be applied after hydration. Reading it in onMount rather
	// than at init keeps the first client render identical to the served HTML.
	let isMounted = false;

	onMount(() => {
		const fromUrl = parseFilter(new URL(location.href).searchParams.getAll('filter'));
		if (fromUrl.length) {
			tokens = fromUrl;
			isOpen = true;
		}
		isMounted = true;
	});

	// Mirror the selection into the URL so it can be shared and survives a
	// reload. `replaceState` is shallow routing: the address bar updates without
	// re-running load or moving the scroll position. In dev this trips
	// SvelteKit's "avoid history.replaceState" warning — a false positive from
	// the stack-trace heuristic it uses to spot direct history calls; the
	// router's own bookkeeping is written, and the check is stripped from
	// production builds.
	$effect(() => {
		const query = filterQuery(tokens);
		if (!isMounted || query === location.search) return;

		try {
			replaceState(`${location.pathname}${query}`, {});
		} catch {
			// The router is not ready yet; the selection still applies to the page,
			// it just is not in the address bar.
		}
	});

	function toggle(token: FilterToken) {
		tokens = toggleFilter(tokens, token);
		trackChangelogFilterChange(tokens);
	}

	function clear() {
		tokens = [];
		trackChangelogFilterChange(tokens);
	}

	// `items-baseline` rather than a matched line-height: the badge row is a
	// flex container, so the grid takes its first badge's baseline and the label
	// lines up with it whatever the badges' padding is at this breakpoint.
	const rowClass = 'grid items-baseline gap-x-6 gap-y-2 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]';
</script>

<!--
	The badge legend and the filter are one control. Every badge here is the same
	object as the badge printed on an entry, so the explanation of what a badge
	means and the way to narrow the log to it are never two separate panels
	showing the same twelve pills.
-->
<section aria-labelledby="changelog-filter-heading" class="border border-border/50 bg-white">
	<!--
		Three items sharing one baseline: the toggle, the status, and Clear. Only
		the status may grow or wrap, so a selection long enough to run onto a
		second line reflows under itself and leaves Clear where the reader last
		saw it — pinned to the top right rather than pushed down with the text.

		The status is pushed right by `ml-auto` rather than by `text-right`: an
		auto margin only has space to act on while the sentence is short, so a
		short one still sits over by Clear, and a long one fills the row and wraps
		left-aligned the way a sentence is read. Right-aligning the text instead
		would strand the last line's few words against the far edge.
	-->
	<div class="flex items-baseline gap-x-4 gap-y-1.5 px-4 py-3 max-sm:flex-wrap sm:gap-x-6 sm:px-5">
		<h2 id="changelog-filter-heading" class="shrink-0 font-heading text-sm">
			<button
				type="button"
				aria-expanded={isOpen}
				aria-controls="changelog-filter-badges"
				onclick={() => (isOpen = !isOpen)}
				class="inline-flex cursor-pointer items-center gap-1.5 text-primary transition-colors hover:text-primary/70"
			>
				Filter the log
				<CaretDownIcon
					size={11}
					weight="bold"
					class="transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
				/>
			</button>
		</h2>

		<p
			class="order-last w-full text-sm text-muted sm:order-none sm:ml-auto sm:w-auto sm:min-w-0"
			aria-live="polite"
		>
			{status ??
				(tokens.length
					? `Showing ${describeFilter(tokens)}.`
					: 'Pick a badge to see only the entries carrying it.')}
		</p>

		{#if tokens.length}
			<button
				type="button"
				onclick={clear}
				class="ml-auto shrink-0 cursor-pointer text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/70 sm:ml-0"
			>
				Clear
			</button>
		{/if}
	</div>

	{#if isOpen}
		<div id="changelog-filter-badges" transition:slide={{ duration: 200 }}>
			<div class="divide-y divide-border/40 border-t border-border/40 px-4 sm:px-5">
				<div class={rowClass}>
					<p class="text-sm font-medium text-surface">Product area</p>
					<div class="flex flex-wrap gap-2" role="group" aria-label="Filter by product area">
						{#each MODULES as module (module)}
							<ChangelogBadge
								{module}
								pressed={tokens.includes(module)}
								onToggle={() => toggle(module)}
							/>
						{/each}
					</div>
				</div>

				<div class={rowClass}>
					<p class="text-sm font-medium text-surface">Type of change</p>
					<div class="flex flex-wrap gap-2" role="group" aria-label="Filter by type of change">
						{#each FEATURE_TAGS as tag (tag)}
							<ChangelogBadge {tag} pressed={tokens.includes(tag)} onToggle={() => toggle(tag)} />
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</section>
