<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<p data-reveal class="text-body leading-[1.8] text-muted">
	{@render children()}
</p>
