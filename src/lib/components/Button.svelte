<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary';
		size?: 'default' | 'hero';
		href?: string;
		onclick?: () => void;
		children?: Snippet;
	}

	let { variant = 'primary', size = 'default', href, onclick, children, ...rest }: Props & Record<string, unknown> =
		$props();

	// Hover lift handled in pure CSS (transform) instead of gsap so this
	// above-the-fold component pulls no animation library into the critical path.
	const baseClasses =
		'inline-flex items-center justify-center font-bold cursor-pointer transition duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0';
	const variants = {
		primary: 'bg-primary-strong text-white hover:bg-primary-strong/90',
		secondary: 'text-primary-strong bg-white hover:bg-primary/10'
	};
	const sizes = {
		default: 'min-w-[180px] px-6 py-3',
		hero: 'min-w-[210px] px-8 py-5 text-lg sm:min-w-[240px] sm:px-10 sm:py-6 sm:text-xl'
	};
</script>

{#if href}
	<a {href} {onclick} class="{baseClasses} {sizes[size]} {variants[variant]}" {...rest}>
		{#if children}{@render children()}{/if}
	</a>
{:else}
	<button {onclick} class="{baseClasses} {sizes[size]} {variants[variant]}" {...rest}>
		{#if children}{@render children()}{/if}
	</button>
{/if}
