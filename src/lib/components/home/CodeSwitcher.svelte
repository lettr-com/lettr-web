<script lang="ts">
	import { onMount } from 'svelte';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import CopyIcon from 'phosphor-svelte/lib/CopyIcon';
	import type { SwitcherTab } from '$lib/home/codeSamples';
	import type { HighlightedTab } from '$lib/utils/shiki';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	/*
	 * Framework tabs over a slate code panel. Tabs turn into a native select
	 * when the panel is narrow and the indicator slides between tabs. With
	 * `height="tallest"` every sample shares one cell, so the panel never changes
	 * height; with `fit` hidden samples leave the layout and the panel eases to
	 * each one. Either way the server render already has its final height.
	 */

	interface Props {
		/** Highlighted at prerender with the `lettr-mint` theme. */
		tabs: (SwitcherTab & HighlightedTab)[];
		label?: string;
		height?: 'tallest' | 'fit';
	}

	let { tabs, label = 'Code example', height = 'tallest' }: Props = $props();

	const uid = $props.id();
	let activeIndex = $state(0);
	const active = $derived(tabs[activeIndex]);

	let tabEls: HTMLButtonElement[] = $state([]);
	let strip: HTMLElement | undefined = $state();
	let indicator = $state({ left: 0, width: 0, ready: false });
	let heights: number[] = $state([]);
	let didCopy = $state(false);
	let copyTimer: number | undefined;
	// The first placement jumps; later ones slide. Plain variable so the effect never reads what it writes.
	let placed = false;

	function select(index: number, source: 'tab' | 'select') {
		if (index === activeIndex) return;
		activeIndex = index;
		void capturePosthogEvent('code_snippet_tab_selected', {
			tab_index: index,
			tab_label: tabs[index].label,
			tab_lang: tabs[index].lang,
			source,
			filename: null
		});
	}

	function onKey(event: KeyboardEvent, index: number) {
		const last = tabs.length - 1;
		const keys: Record<string, number> = {
			ArrowRight: index === last ? 0 : index + 1,
			ArrowLeft: index === 0 ? last : index - 1,
			Home: 0,
			End: last
		};
		const next = keys[event.key];
		if (next === undefined) return;
		event.preventDefault();
		select(next, 'tab');
		tabEls[next]?.focus();
	}

	function place() {
		const tab = tabEls[activeIndex];
		if (!tab) return;
		indicator = { left: tab.offsetLeft, width: tab.offsetWidth, ready: placed };
		if (tab.offsetWidth > 0) placed = true;
		if (strip && (tab.offsetLeft < strip.scrollLeft || tab.offsetLeft + tab.offsetWidth > strip.scrollLeft + strip.clientWidth)) {
			strip.scrollTo({ left: tab.offsetLeft - 24, behavior: 'smooth' });
		}
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(active.code);
			didCopy = true;
			clearTimeout(copyTimer);
			copyTimer = window.setTimeout(() => (didCopy = false), 1600);
			void capturePosthogEvent('code_snippet_copied', { tab_label: active.label, tab_lang: active.lang });
		} catch {
			didCopy = false;
		}
	}

	/** Marks the code scroller with data-more so CSS can fade the side that runs on. */
	function overflowHint(node: HTMLElement) {
		const pre = node.querySelector('pre');
		if (!pre) return;
		const update = () => node.toggleAttribute('data-more', pre.scrollLeft + pre.clientWidth < pre.scrollWidth - 2);
		const observer = new ResizeObserver(update);
		observer.observe(pre);
		pre.addEventListener('scroll', update, { passive: true });
		update();
		return () => {
			observer.disconnect();
			pre.removeEventListener('scroll', update);
		};
	}

	$effect(() => {
		void activeIndex;
		place();
	});

	onMount(() => {
		const observer = new ResizeObserver(place);
		if (strip) observer.observe(strip);
		return () => {
			observer.disconnect();
			clearTimeout(copyTimer);
		};
	});
</script>

<div class="switcher">
	<div class="bar">
		<div class="tabs" bind:this={strip} role="tablist" aria-label={label}>
			{#each tabs as tab, i (tab.id)}
				<button
					bind:this={tabEls[i]}
					type="button"
					role="tab"
					id="{uid}-tab-{tab.id}"
					aria-selected={i === activeIndex}
					aria-controls="{uid}-panel-{tab.id}"
					tabindex={i === activeIndex ? 0 : -1}
					class="tab"
					onclick={() => select(i, 'tab')}
					onkeydown={(e) => onKey(e, i)}
				>
					{tab.label}
				</button>
			{/each}
			<span
				class="indicator"
				aria-hidden="true"
				style:transform="translateX({indicator.left}px)"
				style:width="{indicator.width}px"
				data-shown={indicator.width > 0 ? '' : undefined}
				data-ready={indicator.ready ? '' : undefined}
			></span>
		</div>
		<label class="picker">
			<span class="sr-only">{label}: language</span>
			<select value={activeIndex} onchange={(e) => select(Number(e.currentTarget.value), 'select')}>
				{#each tabs as tab, i (tab.id)}<option value={i}>{tab.label}</option>{/each}
			</select>
			<span class="picker-face" aria-hidden="true">{active.label}<CaretDownIcon size={12} weight="bold" /></span>
		</label>
		<button type="button" class="copy" onclick={copy} aria-label="Copy {active.label} code">
			<span class="swap" aria-hidden="true">
				<CopyIcon size={14} data-off={didCopy ? '' : undefined} />
				<CheckIcon size={14} weight="bold" class="text-green" data-off={didCopy ? undefined : ''} />
			</span>
			<span class="swap" aria-hidden="true">
				<span data-off={didCopy ? '' : undefined}>Copy</span>
				<span data-off={didCopy ? undefined : ''}>Copied</span>
			</span>
		</button>
		<span class="sr-only" aria-live="polite">{didCopy ? 'Copied to clipboard' : ''}</span>
	</div>
	<div
		class="stack"
		data-fit={height === 'fit' ? '' : undefined}
		style:height={height === 'fit' && heights[activeIndex] ? `${heights[activeIndex]}px` : undefined}
	>
		{#each tabs as tab, i (tab.id)}
			<div
				role="tabpanel"
				id="{uid}-panel-{tab.id}"
				aria-labelledby="{uid}-tab-{tab.id}"
				class="panel"
				data-inactive={i === activeIndex ? undefined : ''}
				bind:clientHeight={heights[i]}
				{@attach overflowHint}
			>
				{@html tab.html}
			</div>
		{/each}
	</div>
</div>

<style>
	/* Slate, like the homepage terminal: lighter than the ink card, so it separates by surface. */
	.switcher {
		container-type: inline-size;
		background: #1c2434;
		box-shadow: 0 0 0 1px rgb(247 241 243 / 0.1);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 44px;
		padding-right: 6px;
		background: #151c2a;
		box-shadow: inset 0 -1px 0 #2a3447;
	}
	.tabs {
		position: relative;
		display: flex;
		align-self: stretch;
		min-width: 0;
		overflow-x: auto;
		scrollbar-width: none;
		mask-image: linear-gradient(to right, #000 calc(100% - 24px), transparent);
	}
	.tabs::-webkit-scrollbar {
		display: none;
	}
	.tab {
		flex: none;
		padding-inline: 16px;
		font-size: 13px;
		color: rgb(255 255 255 / 0.6);
		white-space: nowrap;
		cursor: pointer;
		transition: color 120ms ease;
	}
	.tab:hover,
	.tab[aria-selected='true'] {
		color: #fff;
	}
	.tab:focus-visible {
		outline: 2px solid #f9b7c9;
		outline-offset: -4px;
	}
	/* Before hydration the active tab draws its own underline. */
	.tabs:not(:has(.indicator[data-shown])) .tab[aria-selected='true'] {
		box-shadow: inset 0 -2px 0 var(--color-primary);
	}
	.indicator {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 2px;
		background: var(--color-primary);
		opacity: 0;
	}
	.indicator[data-shown] {
		opacity: 1;
	}
	.indicator[data-ready] {
		transition:
			transform 240ms cubic-bezier(0.45, 0, 0.1, 1),
			width 240ms cubic-bezier(0.45, 0, 0.1, 1);
	}

	.picker {
		display: none;
		position: relative;
		margin-left: 8px;
	}
	.picker select {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
		font-size: 16px; /* stops iOS zooming on focus */
	}
	.picker-face {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 30px;
		padding-inline: 10px;
		background: #222b3d;
		color: #fff;
		font-size: 13px;
		pointer-events: none;
	}
	.picker:focus-within .picker-face {
		outline: 2px solid #f9b7c9;
		outline-offset: 1px;
	}
	@container (max-width: 26rem) {
		.tabs {
			display: none;
		}
		.picker {
			display: block;
		}
	}

	.copy {
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 30px;
		margin-left: auto;
		padding-inline: 8px;
		font-size: 12.5px;
		font-weight: 500;
		color: rgb(255 255 255 / 0.7);
		cursor: pointer;
		transition:
			color 120ms ease,
			background-color 120ms ease;
	}
	.copy:hover {
		color: #fff;
		background: #222b3d;
	}
	.copy:focus-visible {
		outline: 2px solid #f9b7c9;
		outline-offset: -2px;
	}
	.swap {
		display: inline-grid;
		place-items: center;
	}
	.swap > :global(*) {
		grid-area: 1 / 1;
		transition:
			opacity 160ms ease,
			transform 200ms cubic-bezier(0.25, 0.8, 0.25, 1);
	}
	.swap > :global([data-off]) {
		opacity: 0;
		transform: scale(0.7);
	}
	@media (pointer: coarse) {
		.copy {
			height: 40px;
		}
	}

	.stack {
		position: relative;
		display: grid;
		overflow: hidden;
		transition: height 260ms cubic-bezier(0.25, 0.8, 0.25, 1);
	}
	.panel {
		grid-area: 1 / 1;
		align-self: start;
		min-width: 0;
		transition:
			opacity 180ms ease,
			transform 220ms cubic-bezier(0.25, 0.8, 0.25, 1);
	}
	.stack[data-fit] .panel[data-inactive] {
		position: absolute;
		inset: 0 0 auto 0;
	}
	.panel[data-inactive] {
		visibility: hidden;
		opacity: 0;
		transform: translateY(3px);
		transition:
			opacity 120ms ease,
			transform 120ms ease,
			visibility 0s 120ms;
	}
	.panel :global(pre) {
		margin: 0;
		padding: 16px 20px 18px;
		background: transparent !important;
		overflow-x: auto;
		scrollbar-width: thin;
		scrollbar-color: #2a3447 transparent;
		font-family: var(--font-code);
		font-size: 13px;
		line-height: 1.6;
		font-variant-ligatures: none;
		tab-size: 4;
	}
	.panel:global([data-more]) :global(pre) {
		mask-image: linear-gradient(to right, #000 calc(100% - 40px), transparent);
	}
	@media (prefers-reduced-motion: reduce) {
		.indicator,
		.stack,
		.panel,
		.swap > :global(*) {
			transition: none !important;
		}
	}
</style>
