<script lang="ts">
	import type { Snippet } from 'svelte';
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import LightbulbIcon from 'phosphor-svelte/lib/LightbulbIcon';
	import WarningIcon from 'phosphor-svelte/lib/WarningIcon';

	interface Props {
		variant?: 'info' | 'tip' | 'warning';
		title?: string;
		children: Snippet;
	}

	let { variant = 'info', title, children }: Props = $props();

	const icons = { info: InfoIcon, tip: LightbulbIcon, warning: WarningIcon };
	const Icon = $derived(icons[variant]);
</script>

<aside
	data-reveal
	class="flex gap-3 border border-border/50 bg-white p-5 shadow-[0_20px_50px_-45px_rgba(17,24,39,0.6)]"
>
	<div class="flex h-8 w-8 shrink-0 items-center justify-center border border-border/50 bg-background">
		<Icon size={16} class="text-primary" />
	</div>
	<div class="text-sm leading-relaxed text-muted">
		{#if title}
			<div class="mb-1 font-semibold text-surface">{title}</div>
		{/if}
		{@render children()}
	</div>
</aside>
