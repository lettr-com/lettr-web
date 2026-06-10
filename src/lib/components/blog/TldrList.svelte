<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** The <li> items, passed via the children snippet. */
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<!--
	Compact bullet list for TL;DR callouts. Unlike List, it sets no font size,
	so it inherits the Callout's text-sm. Keeps every TL;DR visually consistent.
-->
<ul class="list-disc space-y-1 pl-5 marker:text-primary">
	{@render children()}
</ul>
