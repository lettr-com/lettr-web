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

	// The lift is CSS only (no animation library, so this above-the-fold component adds
	// nothing to the critical path), and it moves an inner span, never the link itself.
	// If the link moved, the 2px it leaves behind would drop out from under a pointer on
	// that edge, the hover would end, the button would fall back, hover again, and so on:
	// a visible blip. The outer element stays put and is the only thing hover is read from.
	const baseClasses =
		'flex w-full items-center justify-center font-bold transition duration-200 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0';
	const variants = {
		primary: 'bg-primary-strong text-white group-hover:bg-primary-strong/90',
		secondary: 'text-primary-strong bg-white group-hover:bg-primary/10',
		// for white surfaces, where the plain white secondary would vanish
		outline: 'border border-primary-outline text-primary-strong bg-white group-hover:bg-primary-soft',
		green: 'bg-[#03bd4c] text-white group-hover:bg-[#03bd4c]/90'
	};
	const sizes = {
		default: 'min-w-[180px] px-6 py-3',
		hero: 'min-w-[210px] px-8 py-5 text-lg sm:min-w-[240px] sm:px-10 sm:py-6 sm:text-xl'
	};
</script>

{#snippet face()}
	<span class="{baseClasses} {sizes[size]} {variants[variant]}">
		{#if children}{@render children()}{/if}
	</span>
{/snippet}

{#if href}
	<a {href} {onclick} class="group inline-flex cursor-pointer {className}" {...rest}>{@render face()}</a>
{:else}
	<button {onclick} class="group inline-flex cursor-pointer {className}" {...rest}>{@render face()}</button>
{/if}
