<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Optional attribution shown under the quote. */
		cite?: string;
		children: Snippet;
	}

	let { cite, children }: Props = $props();
</script>

<blockquote class="border-l-2 border-primary pl-5">
	<p class="font-heading text-[20px] leading-[1.5] text-surface">
		{@render children()}
	</p>
	{#if cite}
		<footer class="mt-3 text-sm text-muted">— {cite}</footer>
	{/if}
</blockquote>
