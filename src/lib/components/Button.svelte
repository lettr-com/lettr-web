<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary';
		href?: string;
		onclick?: () => void;
		children?: Snippet;
	}

	let { variant = 'primary', href, onclick, children, ...rest }: Props & Record<string, unknown> =
		$props();

	// Hover lift handled in pure CSS (transform) instead of gsap so this
	// above-the-fold component pulls no animation library into the critical path.
	const baseClasses =
		'inline-flex items-center justify-center min-w-[180px] px-6 py-3 font-bold cursor-pointer transition duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0';
	const variants = {
		primary: 'bg-primary text-white hover:bg-primary/90',
		secondary: 'text-primary bg-white hover:bg-primary/10'
	};
</script>

{#if href}
	<a {href} {onclick} class="{baseClasses} {variants[variant]}" {...rest}>
		{#if children}{@render children()}{/if}
	</a>
{:else}
	<button {onclick} class="{baseClasses} {variants[variant]}" {...rest}>
		{#if children}{@render children()}{/if}
	</button>
{/if}
