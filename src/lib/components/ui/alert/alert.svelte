<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<div
	role="alert"
	class={cn('border border-border bg-white/70 px-4 py-3 text-sm text-surface', className)}
	{...rest}
>
	{#if children}{@render children()}{/if}
</div>
