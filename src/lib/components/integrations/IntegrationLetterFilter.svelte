<script lang="ts">
	import { LETTERS, type Letter } from '$lib/integrations/search';

	interface Props {
		value: Letter | null;
		/** Letters with at least one entry under the current search; the rest are greyed and inert. */
		available: ReadonlySet<Letter>;
		controls: string;
	}

	let { value = $bindable(), available, controls }: Props = $props();

	// Square cells like the glossary's letter bar; "All" clears the filter.
	const cell =
		'flex h-8 min-w-8 shrink-0 items-center justify-center px-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface';

	function pick(letter: Letter) {
		value = value === letter ? null : letter;
	}
</script>

<!-- Phones wrap the letters onto extra rows; from md they sit on one line. -->
<div class="md:-mx-1 md:overflow-x-auto md:px-1 md:[scrollbar-width:none]" data-markdown="skip">
	<div role="group" aria-label="Filter by first letter" class="flex flex-wrap gap-0.5 md:w-max md:flex-nowrap">
		<button
			type="button"
			aria-pressed={value === null}
			aria-controls={controls}
			onclick={() => (value = null)}
			class="{cell} {value === null ? 'bg-surface text-white' : 'text-muted hover:bg-surface/5 hover:text-surface'}"
		>
			All
		</button>
		{#each LETTERS as letter (letter)}
			{@const isAvailable = available.has(letter)}
			<button
				type="button"
				aria-pressed={value === letter}
				aria-controls={controls}
				aria-label={letter === '#' ? 'Starts with a number' : `Starts with ${letter}`}
				disabled={!isAvailable && value !== letter}
				onclick={() => pick(letter)}
				class="{cell} {value === letter
					? 'bg-surface text-white'
					: isAvailable
						? 'text-muted hover:bg-surface/5 hover:text-surface'
						: 'cursor-default text-border'}"
			>
				{letter}
			</button>
		{/each}
	</div>
</div>
