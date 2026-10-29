<script lang="ts">
	import { onMount, tick } from 'svelte';
	import ListIcon from 'phosphor-svelte/lib/ListIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import { slugify } from '$lib/utils/slug';
	import { resolveActiveId, hasReachedPinned } from '$lib/utils/scrollSpy';
	import { trackContentsClicked, type BlogArticleContext, type BlogPlacement } from '$lib/analytics/blog';
	import { readProgress, showsContents } from '$lib/blog/article';

	interface Props {
		/** The blog body element whose <h2>s populate the contents. */
		container: HTMLElement | undefined;
		/** The article header; the mobile control waits until it has scrolled away. */
		header: HTMLElement | undefined;
		article: BlogArticleContext;

	}

	interface TocItem {
		id: string;
		text: string;
	}

	let { container, header, article }: Props = $props();

	let items = $state<TocItem[]>([]);
	let activeId = $state<string | null>(null);
	/** 0..1 through the article body. */
	let progress = $state(0);
	let pastHeader = $state(false);
	let scrollingUp = $state(false);
	let sheetOpen = $state(false);
	let sheet: HTMLElement | undefined = $state();

	const enabled = $derived(showsContents(items.length));
	const activeIndex = $derived(Math.max(0, items.findIndex((item) => item.id === activeId)));
	const activeText = $derived(items[activeIndex]?.text ?? 'Contents');
	const showPill = $derived(enabled && items.length > 0 && pastHeader && (scrollingUp || sheetOpen));

	// While a click is scrolling the page, the clicked heading is "pinned": the
	// scroll handler holds the indicator on it instead of walking down through every
	// heading the smooth scroll passes over. Cleared once the scroll arrives or
	// by a safety timeout.
	let pinnedId: string | null = null;
	let pinSafetyTimer: ReturnType<typeof setTimeout> | null = null;

	function clearPin() {
		pinnedId = null;
		if (pinSafetyTimer) {
			clearTimeout(pinSafetyTimer);
			pinSafetyTimer = null;
		}
	}

	function go(item: TocItem, placement: BlogPlacement) {
		pinnedId = item.id;
		activeId = item.id;
		if (pinSafetyTimer) clearTimeout(pinSafetyTimer);
		// Safety net: release the pin if the target never reaches the band
		// (e.g. a short last section that can't scroll to the top).
		pinSafetyTimer = setTimeout(clearPin, 1200);
		sheetOpen = false;
		trackContentsClicked(article, item.text, placement);
	}

	async function openSheet() {
		sheetOpen = true;
		await tick();
		const current = sheet?.querySelector<HTMLElement>('a[aria-current="true"]') ?? sheet?.querySelector<HTMLElement>('a');
		current?.focus({ preventScroll: true });
	}

	onMount(() => {
		if (!container) return;

		const headings = Array.from(container.querySelectorAll('h2'));
		const seen = new Set<string>();
		const collected: TocItem[] = [];
		const observed: HTMLElement[] = [];

		for (const node of headings) {
			const text = node.textContent?.trim() ?? '';
			if (!text) continue;
			let id = node.id || slugify(text);
			if (!id) continue;
			if (seen.has(id)) {
				let n = 2;
				while (seen.has(`${id}-${n}`)) n++;
				id = `${id}-${n}`;
			}
			seen.add(id);
			// The contents are the sole id writer, so href="#id" always resolves to one heading.
			node.id = id;
			collected.push({ id, text });
			observed.push(node);
		}

		items = collected;
		if (observed.length === 0) return;

		// Recomputed from live geometry on every (frame-throttled) scroll, so the
		// active section is right even after a jump that skips headings.
		function updateActive() {
			const positions = observed.map((node) => ({ id: node.id, top: node.getBoundingClientRect().top }));
			if (pinnedId != null && hasReachedPinned(positions, { pinnedId, viewportHeight: window.innerHeight })) {
				clearPin();
			}
			activeId = resolveActiveId(positions, { viewportHeight: window.innerHeight, pinnedId });
		}

		let lastY = window.scrollY;
		let frame = 0;
		const body = container;
		function measure() {
			frame = 0;
			const rect = body.getBoundingClientRect();
			const first = body.firstElementChild;
			progress = readProgress({
				top: rect.top,
				height: rect.height,
				firstLine: first ? parseFloat(getComputedStyle(first).lineHeight) || 0 : 0,
				topEdge: document.querySelector('header')?.getBoundingClientRect().bottom ?? 0,
				viewportHeight: window.innerHeight
			});
			pastHeader = (header?.getBoundingClientRect().bottom ?? 0) < 0;
			const y = window.scrollY;
			if (Math.abs(y - lastY) > 4) scrollingUp = y < lastY;
			lastY = y;
			updateActive();
		}
		function onScroll() {
			if (!frame) frame = requestAnimationFrame(measure);
		}
		function onKey(event: KeyboardEvent) {
			if (event.key === 'Escape') sheetOpen = false;
		}
		measure();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('keydown', onKey);

		return () => {
			clearPin();
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

{#if enabled && items.length > 0}
	<!-- Desktop: a slim rail in the page margin; hover or focus opens the full list. -->
	<nav aria-label="Contents" data-markdown="skip" class="relative hidden lg:block">
		<ul class="relative flex w-8 flex-col gap-2.5 border border-border/60 bg-white px-2 py-3.5">
			<!-- Reading progress, filling down the rail's left edge. -->
			<li aria-hidden="true" class="absolute inset-y-0 left-0 w-0.5 bg-border/40">
				<span class="block w-full bg-primary" style:height="{progress * 100}%"></span>
			</li>
			{#each items as item (item.id)}
				<li>
					<a
						href={'#' + item.id}
						aria-label={item.text}
						aria-current={activeId === item.id ? 'true' : undefined}
						onclick={() => go(item, 'blog_contents_rail')}
						class="block h-0.5 transition-[width] {activeId === item.id ? 'w-4 bg-primary' : 'w-2.5 bg-border hover:bg-subtle'}"
					></a>
				</li>
			{/each}
		</ul>
		<div
			class="toc-panel absolute top-0 left-full z-20 pl-2"
		>
			<div class="w-[300px] border border-border/60 bg-white px-5 py-4 shadow-[0_24px_60px_-40px_rgba(17,24,39,0.5)]">
			<div class="flex items-baseline justify-between pb-3">
				<span class="text-sm font-bold text-surface">Contents</span>
				<span class="text-[13px] text-subtle">{Math.round(progress * 100)}% read</span>
			</div>
			<ul>
				{#each items as item (item.id)}
					<li>
						<a
							href={'#' + item.id}
							tabindex="-1"
							onclick={() => go(item, 'blog_contents_panel')}
							class="block border-l-2 py-1.5 pl-3 text-sm leading-[1.4] transition-colors {activeId === item.id
								? 'border-primary font-semibold text-surface'
								: 'border-border/60 text-subtle hover:text-primary'}"
						>
							{item.text}
						</a>
					</li>
				{/each}
			</ul>
			<a href="#main-content" tabindex="-1" class="mt-3 block text-[13px] font-semibold text-surface hover:text-primary">↑ Back to top</a>
			</div>
		</div>
	</nav>

	<!-- Mobile: reading progress along the bottom edge of the screen, out of the way of the header's banners. -->
	<div aria-hidden="true" data-markdown="skip" class="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-0.5 lg:hidden">
		<div class="h-full bg-primary" style:width="{progress * 100}%"></div>
	</div>

	<!-- Mobile: a control that appears once the header is gone, only while scrolling back up. -->
	<div
		data-markdown="skip"
		class="fixed bottom-4 left-4 right-[84px] z-40 transition-[opacity,translate] duration-200 lg:hidden {showPill
			? 'translate-y-0 opacity-100'
			: 'pointer-events-none translate-y-4 opacity-0'}"
	>
		{#if sheetOpen}
			<div bind:this={sheet} role="dialog" aria-label="Contents" class="mb-2 max-h-[60vh] overflow-y-auto bg-white p-4 shadow-[0_24px_60px_-30px_rgba(17,24,39,0.6)]">
				<div class="flex items-center justify-between pb-2">
					<span class="text-sm font-bold text-surface">Contents</span>
					<button type="button" onclick={() => (sheetOpen = false)} aria-label="Close contents" class="p-1 text-subtle">
						<XIcon size={16} />
					</button>
				</div>
				<ul>
					{#each items as item (item.id)}
						<li>
							<a
								href={'#' + item.id}
								aria-current={activeId === item.id ? 'true' : undefined}
								onclick={() => go(item, 'blog_contents_mobile')}
								class="block border-l-2 py-2 pl-3 text-[15px] leading-[1.35] {activeId === item.id
									? 'border-primary font-semibold text-surface'
									: 'border-border/60 text-subtle'}"
							>
								{item.text}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		<button
			type="button"
			onclick={() => (sheetOpen ? (sheetOpen = false) : openSheet())}
			aria-expanded={sheetOpen}
			tabindex={showPill ? 0 : -1}
			class="relative flex h-12 w-full items-center gap-2.5 overflow-hidden bg-surface px-4 text-left text-background"
		>
			<span class="absolute top-0 left-0 h-0.5 bg-primary" style:width="{progress * 100}%"></span>
			<ListIcon size={16} class="shrink-0" />
			<span class="min-w-0 flex-1 truncate text-sm font-semibold">{activeText}</span>
			<span class="shrink-0 font-code text-xs text-primary-outline">{activeIndex + 1}/{items.length}</span>
		</button>
	</div>
{/if}

<style>
	/*
	 * The panel's transparent left padding bridges the gap to the rail, so the
	 * pointer never leaves the nav on its way across. Opening is immediate;
	 * closing waits a beat, so a wobbly path to an item doesn't lose the panel.
	 */
	.toc-panel {
		visibility: hidden;
		opacity: 0;
		transition:
			opacity 150ms ease 250ms,
			visibility 0s linear 400ms;
	}

	nav:hover .toc-panel,
	nav:focus-within .toc-panel {
		visibility: visible;
		opacity: 1;
		transition:
			opacity 150ms ease,
			visibility 0s;
	}
</style>
