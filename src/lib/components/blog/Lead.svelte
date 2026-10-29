<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<p class="text-[17px] leading-[1.6] text-surface md:text-[19px]">
	{@render children()}
</p>
