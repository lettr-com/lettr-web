<script lang="ts">
	import type { Integration } from '$lib/integrations/types';

	interface Props {
		entry: Pick<Integration, 'name' | 'logo' | 'lettermark' | 'brandLogo' | 'logoScale'>;
		/** Rendered width and height of the mark's box. */
		size?: number;
		/** Text colour class for a one-colour glyph, drawn as a mask. Brand logos ignore it. */
		tone?: string;
		/** The tile is dark, so a brand's dark-background file is used where it has one. */
		onDark?: boolean;
	}

	let { entry, size = 48, tone = 'text-surface', onDark = false }: Props = $props();

	// marks that run edge to edge are drawn smaller so every logo reads the same size
	const markSize = $derived(Math.round(size * (entry.logoScale ?? 1)));
	// a lettermark stands in until the partner's logo arrives
	const initial = $derived(entry.lettermark ?? entry.name.charAt(0).toUpperCase());
	// longer marks shrink so they stay inside the box
	const initialScale = $derived(initial.length > 1 ? 0.55 : 0.8);
	const brandSrc = $derived(
		entry.brandLogo ? (onDark ? (entry.brandLogo.dark ?? entry.brandLogo.light) : entry.brandLogo.light) : undefined
	);
</script>

{#if brandSrc}
	<!-- the company's own file, shown as supplied: no tint, no filter -->
	<img
		src={brandSrc}
		alt=""
		class="block shrink-0 object-contain opacity-75"
		style:width="{markSize}px"
		style:height="{markSize}px"
		loading="lazy"
		decoding="async"
	/>
{:else if entry.logo}
	<span
		class="block shrink-0 bg-current opacity-75 {tone}"
		style:width="{markSize}px"
		style:height="{markSize}px"
		style:mask="url({entry.logo}) center / contain no-repeat"
		style:-webkit-mask="url({entry.logo}) center / contain no-repeat"
		aria-hidden="true"
	></span>
{:else}
	<span
		class="flex shrink-0 items-center justify-center font-heading leading-none opacity-75 {tone}"
		style:width="{size}px"
		style:height="{size}px"
		style:font-size="{Math.round(size * initialScale)}px"
		aria-hidden="true"
	>
		{initial}
	</span>
{/if}
