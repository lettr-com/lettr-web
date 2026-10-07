<script lang="ts">
	import { LETTERS } from '$lib/glossary/letters';
	import type { Letter } from '$lib/glossary/types';

	interface Props {
		/** Letters that have at least one term; every other letter renders greyed and unlinked. */
		available: readonly Letter[];
	}

	let { available }: Props = $props();

	let active = $state<Letter | null>(null);

	// 27 cells at min-w-8 plus gap-1 need 968px and the layout column is 848px, so
	// from md the bar is a 27-column grid that always fits one row; phones wrap.
	const cell =
		'flex h-9 min-w-8 items-center justify-center px-2 text-sm font-semibold md:min-w-0 md:px-0';

	// Without JS the href still lands on the group's anchor. With JS we also open
	// the mobile accordion so the scroll target is not a collapsed box.
	function jump(event: MouseEvent, letter: Letter) {
		event.preventDefault();
		active = letter;
		const target = document.getElementById(letter);
		if (!target) return;
		const details = target.querySelector('details');
		if (details) details.open = true;
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<nav
	aria-label="Browse by letter"
	class="flex flex-wrap gap-1 md:grid md:grid-cols-[repeat(27,minmax(0,1fr))] md:gap-0"
>
	{#each LETTERS as letter (letter)}
		{#if available.includes(letter)}
			<a
				href="#{letter}"
				aria-current={active === letter ? 'true' : undefined}
				onclick={(event) => jump(event, letter)}
				class="{cell} transition-colors {active === letter
					? 'bg-surface text-white'
					: 'text-muted hover:bg-surface/5 hover:text-surface'}"
			>
				{letter}
			</a>
		{:else}
			<span aria-disabled="true" class="{cell} cursor-default text-border">{letter}</span>
		{/if}
	{/each}
</nav>
