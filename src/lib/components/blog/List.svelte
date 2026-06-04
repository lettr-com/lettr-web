<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		ordered?: boolean;
		/** Provide string items, or pass <li> elements via the children snippet. */
		items?: string[];
		children?: Snippet;
	}

	let { ordered = false, items, children }: Props = $props();

	const listClass = $derived(
		'space-y-2 text-body leading-[1.8] text-muted ' +
			(ordered ? 'list-decimal' : 'list-disc') +
			' pl-5 marker:text-primary'
	);
</script>

{#if ordered}
	<ol data-reveal class={listClass}>
		{#if items}
			{#each items as item}
				<li>{item}</li>
			{/each}
		{:else if children}
			{@render children()}
		{/if}
	</ol>
{:else}
	<ul data-reveal class={listClass}>
		{#if items}
			{#each items as item}
				<li>{item}</li>
			{/each}
		{:else if children}
			{@render children()}
		{/if}
	</ul>
{/if}
