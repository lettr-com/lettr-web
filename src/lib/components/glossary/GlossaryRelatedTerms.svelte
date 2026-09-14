<script lang="ts">
	import type { GlossaryTermLink } from '$lib/glossary/types';

	interface Props {
		terms: GlossaryTermLink[];
	}

	let { terms }: Props = $props();
</script>

<nav aria-label="Related terms" class="mt-10">
	<p class="font-heading text-xs tracking-[0.15em] text-primary uppercase">Related terms</p>
	<ul class="mt-3 flex flex-wrap gap-2">
		{#each terms as term (term.slug)}
			<li>
				<a
					href={term.href}
					class="inline-block rounded-full border border-border/60 px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-muted transition-colors hover:border-primary/30 hover:text-surface"
				>
					{term.term}
				</a>
			</li>
		{/each}
	</ul>
</nav>
