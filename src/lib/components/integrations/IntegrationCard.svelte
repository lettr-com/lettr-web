<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import IntegrationLogo from '$lib/components/integrations/IntegrationLogo.svelte';
	import { grounds, type Ground } from '$lib/components/integrations/grounds';
	import { integrationHref, isExternal } from '$lib/integrations';
	import type { Integration } from '$lib/integrations/types';

	interface Props {
		entry: Integration;
		/** `featured` is the larger, square tile in the hub's first row. */
		variant?: 'default' | 'featured';
		ground?: Ground;
		/** Heading level, so the card fits the outline of the page it sits on. */
		headingLevel?: 'h3' | 'h4';
	}

	let { entry, variant = 'default', ground = 'white', headingLevel = 'h3' }: Props = $props();

	const href = $derived(integrationHref(entry));
	const external = $derived(isExternal(href));
	const isPartner = $derived(entry.builtBy !== 'Lettr');
	const isFeatured = $derived(variant === 'featured');
	const colors = $derived(grounds[ground]);
</script>

<!-- The "text below" card from the card system: the tile carries the logo, the words sit on the page. -->
<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	class="group flex h-full flex-col gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-surface md:gap-5"
>
	<span
		class="relative flex items-center justify-center {colors.tile} {isFeatured
			? 'aspect-square'
			: 'aspect-[4/3]'} transition-transform duration-200 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
	>
		<IntegrationLogo {entry} size={isFeatured ? 96 : 56} tone={colors.logo} onDark={colors.dark} />
		<span class="absolute top-3 right-3 md:top-4 md:right-4 {colors.arrow}">
			{#if external}
				<ArrowUpRightIcon size={18} aria-label="Opens in a new tab" />
			{:else}
				<ArrowRightIcon size={18} aria-hidden="true" />
			{/if}
		</span>
	</span>

	<span class="flex flex-col gap-1.5">
		<svelte:element
			this={headingLevel}
			class="text-balance transition-colors group-hover:text-primary {isFeatured ? 'type-h4' : 'type-h5'}"
		>
			{entry.name}
		</svelte:element>
		<span class="text-caption text-pretty text-muted sm:text-body-sm">{entry.summary}</span>
		<span class="mt-1 text-caption text-subtle">
			{entry.type}
			<span aria-hidden="true">·</span>
			<span class="whitespace-nowrap">
				Built by <span class={isPartner ? 'font-semibold text-surface' : ''}>{entry.builtBy}</span>
			</span>
		</span>
	</span>
</a>
