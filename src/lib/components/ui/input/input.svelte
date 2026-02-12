<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props extends HTMLInputAttributes {
		class?: string;
	}

	let { value = $bindable(), class: className, ...rest }: Props = $props();
</script>

<input
	class={cn(
		'h-10 w-full border border-border bg-white px-3 py-2 text-sm text-surface placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	bind:value
	{...rest}
/>
