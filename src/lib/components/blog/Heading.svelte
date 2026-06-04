<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** 2 renders a section heading (<h2>), 3 a subheading (<h3>). */
		level?: 2 | 3;
		/** Optional id for anchor links / table of contents. */
		id?: string;
		children: Snippet;
	}

	let { level = 2, id, children }: Props = $props();
</script>

{#if level === 2}
	<h2 data-reveal {id} class="scroll-mt-28 text-surface">
		{@render children()}
	</h2>
{:else}
	<h3 data-reveal {id} class="scroll-mt-28 text-surface">
		{@render children()}
	</h3>
{/if}
