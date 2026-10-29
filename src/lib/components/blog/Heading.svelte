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
	<h2 {id} class="scroll-mt-40 text-[24px] leading-[1.25] tracking-[-0.015em] text-balance text-surface md:text-[28px]">
		{@render children()}
	</h2>
{:else}
	<h3 {id} class="scroll-mt-40 text-[20px] leading-[1.35] font-medium text-balance text-surface">
		{@render children()}
	</h3>
{/if}
