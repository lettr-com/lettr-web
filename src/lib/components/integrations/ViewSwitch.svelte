<script lang="ts" module>
	export type IntegrationView = 'grid' | 'list';
</script>

<script lang="ts">
	import ListBulletsIcon from 'phosphor-svelte/lib/ListBulletsIcon';
	import SquaresFourIcon from 'phosphor-svelte/lib/SquaresFourIcon';

	interface Props {
		value: IntegrationView;
		controls: string;
	}

	let { value = $bindable(), controls }: Props = $props();

	const options = [
		{ id: 'grid', label: 'Grid', icon: SquaresFourIcon },
		{ id: 'list', label: 'List', icon: ListBulletsIcon }
	] as const;
</script>

<div role="group" aria-label="Layout" class="flex shrink-0 border border-border bg-white" data-markdown="skip">
	{#each options as option (option.id)}
		<button
			type="button"
			aria-pressed={value === option.id}
			aria-controls={controls}
			onclick={() => (value = option.id)}
			class="flex h-8 items-center gap-1.5 px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-surface {value ===
			option.id
				? 'bg-surface text-white'
				: 'text-muted hover:text-surface'}"
		>
			<option.icon size={16} aria-hidden="true" />
			{option.label}
		</button>
	{/each}
</div>
