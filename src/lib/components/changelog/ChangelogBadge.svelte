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

	const base = 'inline-block font-heading tracking-[0.05em] whitespace-nowrap';
	/** The badge as printed on an entry: dense, so a row of them stays one line. */
	const label = 'px-3 py-0.5 text-[11px]';
	// A toggle is a target, not a label, so it is a step larger than the badge
	// it stands for: comfortably clickable, and thumb-sized on phones.
	const interactive =
		'cursor-pointer px-3.5 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:py-1';

	const text = $derived(module ? MODULE_LABELS[module] : (tag ?? ''));

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

{#if text}
	{#if onToggle}
		<button type="button" aria-pressed={pressed} onclick={onToggle} class="{base} {interactive} {variant}">
			{text}
		</button>
	{:else}
		<span class="{base} {label} {variant}">{text}</span>
	{/if}
{/if}
