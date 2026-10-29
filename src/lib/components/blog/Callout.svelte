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
	const rules = { info: 'border-primary', tip: 'border-green', warning: 'border-warning' };
</script>

<aside class="border-l-2 py-0.5 pl-5 text-[16px] leading-[1.6] text-muted {rules[variant]}">
	{#if title}
		<div class="mb-1.5 flex items-center gap-1.5 text-[15px] font-bold text-surface">
			{#if variant !== 'info'}
				<Icon size={15} class="text-subtle" />
			{/if}
			{title}
		</div>
	{/if}
	{@render children()}
</aside>
