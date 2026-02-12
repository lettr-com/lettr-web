<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<h3 class={cn('text-lg font-medium leading-none tracking-tight text-surface', className)} {...rest}>
	{#if children}{@render children()}{/if}
</h3>
