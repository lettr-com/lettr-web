<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'green';
		size?: 'default' | 'hero';
		href?: string;
		onclick?: () => void;
		class?: string;
		children?: Snippet;
	}

	let { variant = 'primary', size = 'default', href, onclick, class: className = '', children, ...rest }: Props & Record<string, unknown> =
		$props();

	// Hover lift handled in pure CSS instead of gsap so this above-the-fold component
	// pulls no animation library into the critical path. will-change-transform keeps the
	// button on its own GPU layer for good: Chrome drops ClearType on that layer, and if the
	// layer only existed during the lift the label thinned and snapped back heavier as it ended.
	// The after: strip keeps the 2px the button leaves behind when it lifts inside the
	// hover area; without it a pointer on the bottom edge flickers the button up and down.
	const baseClasses =
		"relative after:absolute after:inset-x-0 after:top-full after:h-0.5 after:content-[''] inline-flex items-center justify-center font-bold cursor-pointer will-change-transform transition-[translate,color,--fade-bg] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0";
	const variants = {
		primary: 'bg-fade-primary-strong text-white hover:bg-fade-primary-strong/90',
		secondary: 'text-primary-strong bg-fade-white hover:bg-fade-primary/10',
		// for white surfaces, where the plain white secondary would vanish
		outline: 'border border-primary-outline text-primary-strong bg-fade-white hover:bg-fade-primary-soft',
		green: 'bg-fade-[#03bd4c] text-white hover:bg-fade-[#03bd4c]/90'
	};
	const sizes = {
		default: 'min-w-[180px] px-6 py-3',
		hero: 'min-w-[210px] px-8 py-5 text-lg sm:min-w-[240px] sm:px-10 sm:py-6 sm:text-xl'
	};
</script>

{#if href}
	<a {href} {onclick} class="{baseClasses} {sizes[size]} {variants[variant]} {className}" {...rest}>
		{#if children}{@render children()}{/if}
	</a>
{:else}
	<button {onclick} class="{baseClasses} {sizes[size]} {variants[variant]} {className}" {...rest}>
		{#if children}{@render children()}{/if}
	</button>
{/if}
