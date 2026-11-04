<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ink' | 'green' | 'green-outline' | 'ghost';
		/** lg: hero and section CTAs. md: inside cards and forms. sm: navigation and compact rows. */
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		onclick?: () => void;
		disabled?: boolean;
		/** Shows a spinner, keeps the label for width, and blocks clicks. */
		loading?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		onclick,
		disabled = false,
		loading = false,
		class: className = '',
		children,
		...rest
	}: Props & Record<string, unknown> = $props();

	const isInert = $derived(disabled || loading);

	// Hover lift handled in pure CSS instead of gsap so this above-the-fold component
	// pulls no animation library into the critical path. will-change-transform keeps the
	// button on its own GPU layer for good: Chrome drops ClearType on that layer, and if the
	// layer only existed during the lift the label thinned and snapped back heavier as it ended.
	// The after: strip keeps the 2px the button leaves behind when it lifts inside the
	// hover area; without it a pointer on the bottom edge flickers the button up and down.
	const baseClasses =
		"relative after:absolute after:inset-x-0 after:top-full after:h-0.5 after:content-[''] inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap cursor-pointer will-change-transform transition-[translate,color,--fade-bg] duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none motion-reduce:hover:translate-y-0 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-busy:pointer-events-none";
	const variants = {
		primary: 'bg-fade-primary-strong text-white hover:bg-fade-primary-strong/90',
		secondary: 'text-primary-strong bg-fade-white hover:bg-fade-primary/10',
		// for white surfaces, where the plain white secondary would vanish
		outline: 'border border-primary-outline text-primary-strong bg-fade-white hover:bg-fade-primary-soft',
		// neutral dark action beside a pink one, or where pink would compete
		ink: 'bg-fade-surface text-white hover:bg-fade-surface/90',
		green: 'bg-fade-[#03bd4c] text-white hover:bg-fade-[#03bd4c]/90',
		'green-outline': 'border border-[#7ee2a8] text-[#00873d] bg-fade-white hover:bg-fade-[#e6f9ee]',
		// for dark surfaces: a hairline frame that fills in faintly on hover
		ghost: 'text-white bg-fade-white/0 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.28)] hover:bg-fade-white/10 focus-visible:outline-white'
	};
	// Heights are fixed so an icon or spinner never changes a button's size.
	const sizes = {
		sm: 'h-9 px-4 text-sm leading-5 font-semibold [&_svg]:size-4',
		md: 'h-12 min-w-[180px] px-6 text-base font-bold [&_svg]:size-4',
		lg: 'h-17 min-w-[210px] px-8 text-lg font-bold sm:h-19 sm:min-w-[240px] sm:px-10 sm:text-xl [&_svg]:size-5'
	};
	const classes = $derived(`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`);
</script>

{#snippet content()}
	{#if loading}
		<span
			class="absolute top-1/2 left-1/2 size-4 -translate-1/2 animate-spin border-2 border-current border-t-transparent motion-reduce:animate-none"
			aria-hidden="true"
		></span>
		<span class="invisible contents">{#if children}{@render children()}{/if}</span>
	{:else if children}
		{@render children()}
	{/if}
{/snippet}

{#if href && !isInert}
	<a {href} {onclick} class={classes} {...rest}>{@render content()}</a>
{:else if href}
	<a class={classes} aria-disabled="true" aria-busy={loading || undefined} {...rest}>{@render content()}</a>
{:else}
	<button
		{onclick}
		disabled={isInert}
		aria-disabled={isInert || undefined}
		aria-busy={loading || undefined}
		class={classes}
		{...rest}
	>
		{@render content()}
	</button>
{/if}
