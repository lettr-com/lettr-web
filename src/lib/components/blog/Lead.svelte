<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<p data-reveal class="text-h3 leading-[1.6] text-surface">
	{@render children()}
</p>
