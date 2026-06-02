<script lang="ts">
	import { onMount } from 'svelte';
	import { slugify } from '$lib/utils/slug';

	interface Props {
		/** The blog body element whose <h2>s populate the TOC. */
		container: HTMLElement | undefined;
	}

	interface TocItem {
		id: string;
		text: string;
	}

	let { container }: Props = $props();

	let items = $state<TocItem[]>([]);
	let activeId = $state<string | null>(null);

	onMount(() => {
		// Fail-soft: nothing to do until the body element is bound.
		if (!container) return;

		const headings = Array.from(container.querySelectorAll('h2'));
		const seen = new Set<string>();
		const collected: TocItem[] = [];
		// Only the headings that received a usable id are observed.
		const observed: HTMLElement[] = [];

		for (const node of headings) {
			const text = node.textContent?.trim() ?? '';
			if (!text) continue;

			// Prefer an author-supplied explicit id, else derive from the text.
			let id = node.id || slugify(text);
			if (!id) continue; // symbol-only heading: no usable anchor, skip.

			// De-dupe: "intro", "intro-2", "intro-3", ...
			if (seen.has(id)) {
				let n = 2;
				while (seen.has(`${id}-${n}`)) n++;
				id = `${id}-${n}`;
			}
			seen.add(id);

			// The TOC is the sole id writer: write the resolved id back so the
			// href="#id" anchor always resolves to exactly one heading.
			node.id = id;

			collected.push({ id, text });
			observed.push(node);
		}

		items = collected;

		if (observed.length === 0) return;

		// Index of the most recently passed heading (top above the band).
		let lastPassed = 0;

		const observer = new IntersectionObserver(
			() => {
				// Recompute from live geometry every callback. The band sits ~the
				// navbar offset from the top of the viewport.
				const bandTop = 120;
				const intersecting: { id: string; top: number }[] = [];
				lastPassed = 0;

				observed.forEach((node, index) => {
					const top = node.getBoundingClientRect().top;
					if (top <= bandTop) lastPassed = index; // most recent heading above band.
					// "In the band" = near the top of the viewport.
					if (top >= 0 && top <= window.innerHeight * 0.34) {
						intersecting.push({ id: node.id, top });
					}
				});

				if (intersecting.length > 0) {
					// Topmost visible heading wins (smallest top).
					intersecting.sort((a, b) => a.top - b.top);
					activeId = intersecting[0].id;
				} else {
					// Nothing in the band: keep the section being read lit — the most
					// recently passed heading (first item at the very top of the page).
					activeId = observed[lastPassed].id;
				}
			},
			// Collapse the viewport to a band near the top so a heading becomes
			// "active" as it crosses ~the navbar offset.
			{ rootMargin: '-120px 0px -66% 0px', threshold: 0 }
		);

		observed.forEach((node) => observer.observe(node));

		return () => observer.disconnect();
	});
</script>

{#if items.length > 0}
	<nav aria-label="Table of contents" class="text-sm">
		<p class="mb-4 font-heading text-xs tracking-[0.15em] text-muted uppercase">On this page</p>
		<ul class="space-y-1">
			{#each items as item (item.id)}
				<li>
					<a
						href={'#' + item.id}
						onclick={() => (activeId = item.id)}
						class="block border-l-2 py-1 pl-3 transition-colors
							{activeId === item.id
							? 'border-primary text-primary'
							: 'border-transparent text-muted hover:border-border hover:text-primary'}"
					>
						{item.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
