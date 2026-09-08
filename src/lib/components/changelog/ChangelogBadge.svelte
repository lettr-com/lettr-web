<script lang="ts">
	import { MODULE_LABELS } from '$lib/changelog/filter';
	import type { FeatureTag, Module } from '$lib/changelog/types';

	interface Props {
		/** Renders a tinted, colored module badge. */
		module?: Module;
		/** Renders an outline feature badge, or a warning one for "Breaking". */
		tag?: FeatureTag;
		/**
		 * Turns the badge into a filter toggle. The badge keeps its appearance
		 * either way, so the control a reader clicks in the filter is visibly the
		 * same object as the badge they are matching on an entry.
		 */
		onToggle?: () => void;
		/** Toggle only: whether this badge is part of the active filter. */
		pressed?: boolean;
	}

	let { module, tag, onToggle, pressed = false }: Props = $props();

	// Tailwind scans source files for complete class strings, so these are
	// written out in full rather than composed as `bg-module-${module}/10`.
	const moduleClasses: Record<Module, string> = {
		transactional: 'bg-module-transactional/10 text-module-transactional',
		campaigns: 'bg-module-campaigns/10 text-module-campaigns',
		audience: 'bg-module-audience/10 text-module-audience',
		platform: 'bg-module-platform/10 text-module-platform'
	};

	const moduleHoverClasses: Record<Module, string> = {
		transactional: 'hover:bg-module-transactional/20',
		campaigns: 'hover:bg-module-campaigns/20',
		audience: 'hover:bg-module-audience/20',
		platform: 'hover:bg-module-platform/20'
	};

	const moduleSelectedClasses: Record<Module, string> = {
		transactional: 'bg-module-transactional text-white',
		campaigns: 'bg-module-campaigns text-white',
		audience: 'bg-module-audience text-white',
		platform: 'bg-module-platform text-white'
	};

	const base = 'inline-block px-3 font-heading text-[11px] tracking-[0.05em] whitespace-nowrap';
	// A toggle is a touch target, so it keeps thumb-sized padding on phones and
	// drops back to the badge's own density from `sm` up.
	const interactive =
		'cursor-pointer py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:py-0.5';

	const label = $derived(module ? MODULE_LABELS[module] : (tag ?? ''));

	const variant = $derived.by(() => {
		if (module) {
			if (pressed) return moduleSelectedClasses[module];
			return `${moduleClasses[module]} ${onToggle ? moduleHoverClasses[module] : ''}`;
		}

		if (tag === 'Breaking') {
			if (pressed) return 'bg-warning text-white';
			return `bg-warning/10 text-warning ${onToggle ? 'hover:bg-warning/20' : ''}`;
		}

		if (pressed) return 'border border-surface bg-surface text-white';
		return `border border-border text-muted ${onToggle ? 'hover:border-surface hover:text-surface' : ''}`;
	});
</script>

{#if label}
	{#if onToggle}
		<button type="button" aria-pressed={pressed} onclick={onToggle} class="{base} {interactive} {variant}">
			{label}
		</button>
	{:else}
		<span class="{base} py-0.5 {variant}">{label}</span>
	{/if}
{/if}
