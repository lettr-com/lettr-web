<script lang="ts">
	import { onMount } from 'svelte';
	import { slugify } from '$lib/utils/slug';
	import { resolveActiveId, hasReachedPinned } from '$lib/utils/scrollSpy';

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

	// While a TOC click is scrolling the page, the clicked heading is "pinned":
	// the observer holds the indicator on it instead of walking down through every
	// heading the smooth scroll passes over. Cleared once the scroll arrives (the
	// observer sees the target reach the band) or by a safety timeout.
	let pinnedId: string | null = null;
	let pinSafetyTimer: ReturnType<typeof setTimeout> | null = null;

	function clearPin() {
		pinnedId = null;
		if (pinSafetyTimer) {
			clearTimeout(pinSafetyTimer);
			pinSafetyTimer = null;
		}
	}

	function pinTarget(id: string) {
		pinnedId = id;
		activeId = id;
		if (pinSafetyTimer) clearTimeout(pinSafetyTimer);
		// Safety net: if the observer never reports the target reaching the band
		// (e.g. a short last section that can't scroll to the top), release the pin
		// so the scroll-spy is never permanently frozen.
		pinSafetyTimer = setTimeout(clearPin, 1200);
	}

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

		const observer = new IntersectionObserver(
			() => {
				// Recompute from live geometry every callback. The band sits ~the
				// navbar offset from the top of the viewport.
				const positions = observed.map((node) => ({
					id: node.id,
					top: node.getBoundingClientRect().top
				}));

				// A click-scroll that has reached its target hands control back to the
				// observer, so the indicator doesn't stay stuck once the reader scrolls on.
				if (pinnedId != null && hasReachedPinned(positions, { pinnedId, viewportHeight: window.innerHeight })) {
					clearPin();
				}

				activeId = resolveActiveId(positions, {
					viewportHeight: window.innerHeight,
					pinnedId
				});
			},
			// Collapse the viewport to a band near the top so a heading becomes
			// "active" as it crosses ~the navbar offset.
			{ rootMargin: '-120px 0px -66% 0px', threshold: 0 }
		);

		observed.forEach((node) => observer.observe(node));

		return () => {
			observer.disconnect();
			clearPin();
		};
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
						onclick={() => pinTarget(item.id)}
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
