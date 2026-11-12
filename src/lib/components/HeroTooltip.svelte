<script lang="ts" module>
	/** Hero tooltips and hover lifts run only here: phones and tablets get neither. Matches Tailwind's `lg:hover:`. */
	export const heroHoverQuery = '(min-width: 1024px) and (hover: hover)';
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		story: string;
		ref?: HTMLDivElement;
	}

	let { title, story, ref = $bindable(), class: className = '', ...rest }: Props = $props();
</script>

<!-- The card that names a hero sprite on hover: the homepage orbit and the integrations board share it. -->
<div bind:this={ref} class="w-[min(240px,calc(100vw-32px))] bg-surface p-4 text-white {className}" {...rest}>
	<p class="font-heading text-[1.0625rem] leading-[1.3] tracking-[-0.01em] text-balance">{title}</p>
	<p class="mt-1.5 text-sm leading-[1.5] text-pretty text-white/80">{story}</p>
</div>
