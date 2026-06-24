<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** The Q&A pairs, passed via the children snippet as <FaqItem> elements. */
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<!--
	Distinct FAQ block. Sets the Q&A apart from the article's prose and heading
	outline so it reads as a separate type of content, the way the TL;DR callout
	does. Holds a stack of collapsible <FaqItem>s (native <details>), divided by
	hairlines. The questions deliberately sit outside the <h2>/<h3> outline, so
	they don't appear in the table of contents.
-->
<div
	data-reveal
	class="divide-y divide-border/50 border border-border/50 bg-white shadow-[0_20px_50px_-45px_rgba(17,24,39,0.6)]"
>
	{@render children()}
</div>
