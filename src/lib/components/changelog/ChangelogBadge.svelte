<script lang="ts">
	import type { FeatureTag, Module } from '$lib/changelog/types';

	interface Props {
		/** Renders a tinted, colored module badge. */
		module?: Module;
		/** Renders an outline feature badge, or a warning one for "Breaking". */
		tag?: FeatureTag;
	}

	let { module, tag }: Props = $props();

	// Tailwind scans source files for complete class strings, so these are
	// written out in full rather than composed as `bg-module-${module}/10`.
	const moduleClasses: Record<Module, string> = {
		transactional: 'bg-module-transactional/10 text-module-transactional',
		campaigns: 'bg-module-campaigns/10 text-module-campaigns',
		audience: 'bg-module-audience/10 text-module-audience',
		platform: 'bg-module-platform/10 text-module-platform'
	};

	const moduleLabels: Record<Module, string> = {
		transactional: 'Transactional',
		campaigns: 'Campaigns',
		audience: 'Audience',
		platform: 'Platform'
	};

	const base = 'inline-block px-3 py-0.5 font-heading text-[11px] tracking-[0.05em] whitespace-nowrap';

	const label = $derived(module ? moduleLabels[module] : (tag ?? ''));
	const variant = $derived(
		module
			? moduleClasses[module]
			: tag === 'Breaking'
				? 'bg-warning/10 text-warning'
				: 'border border-border text-muted'
	);
</script>

{#if label}
	<span class="{base} {variant}">{label}</span>
{/if}
