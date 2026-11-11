<script lang="ts">
	import { onMount } from 'svelte';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';

	interface Props {
		value: string;
		/** Id of the element the results render into, for aria-controls. */
		controls: string;
	}

	let { value = $bindable(), controls }: Props = $props();

	let input: HTMLInputElement | undefined = $state();

	function clear() {
		value = '';
		input?.focus();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && value) {
			event.preventDefault();
			value = '';
		}
	}

	onMount(() => {
		// "/" jumps to the search from anywhere on the page, unless the visitor is already typing.
		function onGlobalKey(event: KeyboardEvent) {
			if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
			const target = event.target as HTMLElement | null;
			if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
			event.preventDefault();
			input?.focus();
		}
		window.addEventListener('keydown', onGlobalKey);
		return () => window.removeEventListener('keydown', onGlobalKey);
	});
</script>

<div class="relative w-full md:w-72" role="search" data-markdown="skip">
	<label for="integration-search" class="sr-only">Search integrations</label>
	<MagnifyingGlassIcon
		size={16}
		class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle"
		aria-hidden="true"
	/>
	<input
		bind:this={input}
		bind:value
		id="integration-search"
		type="search"
		placeholder="Search integrations"
		autocomplete="off"
		spellcheck="false"
		aria-controls={controls}
		onkeydown={onKeydown}
		class="h-10 w-full border border-border bg-white pr-10 pl-9 text-sm text-surface placeholder:text-subtle focus-visible:border-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 [&::-webkit-search-cancel-button]:appearance-none"
	/>
	{#if value}
		<button
			type="button"
			onclick={clear}
			class="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center text-subtle transition-colors hover:text-surface focus-visible:outline-2 focus-visible:outline-surface"
			aria-label="Clear search"
		>
			<XIcon size={14} aria-hidden="true" />
		</button>
	{:else}
		<kbd
			class="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 border border-border px-1.5 font-code text-caption leading-5 text-subtle md:block"
			aria-hidden="true">/</kbd
		>
	{/if}
</div>
