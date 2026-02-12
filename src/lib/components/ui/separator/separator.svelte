<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		orientation?: 'horizontal' | 'vertical';
		decorative?: boolean;
		class?: string;
	}

	let { orientation = 'horizontal', decorative = true, class: className, ...rest }: Props = $props();
</script>

<div
	class={cn(
		'shrink-0 bg-border/70',
		orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
		className
	)}
	role={decorative ? 'none' : 'separator'}
	aria-orientation={orientation}
	{...rest}
></div>
