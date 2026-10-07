<script lang="ts">
	import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import type { GlossaryTermLink } from '$lib/glossary/types';

	interface Props {
		prev?: GlossaryTermLink;
		next?: GlossaryTermLink;
	}

	let { prev, next }: Props = $props();

	const link = 'group inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary';
	const arrow = 'shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none';
</script>

<!--
	Desktop: previous | all terms | next in one row. Under md: previous and next
	share the first row, "All terms" sits centred on the second. Empty cells stay
	in the grid so the alignment holds for the first and last term.
-->
<nav aria-label="Glossary navigation" class="mt-14 border-t border-border/50 pt-10">
	<div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:items-center">
		<div class="flex min-w-0 justify-self-start">
			{#if prev}
				<a href={prev.href} rel="prev" class={link}>
					<ArrowLeftIcon size={15} class="{arrow} group-hover:-translate-x-0.5" />
					<span class="truncate">{prev.term}</span>
				</a>
			{/if}
		</div>
		<div class="col-span-2 row-start-2 flex justify-self-center md:col-span-1 md:row-start-auto">
			<a href="/glossary/" class={link}>All terms</a>
		</div>
		<div class="flex min-w-0 justify-self-end">
			{#if next}
				<a href={next.href} rel="next" class={link}>
					<span class="truncate">{next.term}</span>
					<ArrowRightIcon size={15} class="{arrow} group-hover:translate-x-0.5" />
				</a>
			{/if}
		</div>
	</div>
</nav>
