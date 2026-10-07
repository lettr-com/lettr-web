<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import type { LetterGroup } from '$lib/glossary/types';

	interface Props {
		group: LetterGroup;
	}

	let { group }: Props = $props();
</script>

<!-- The hover arrow is desktop-only: touch screens never show it. -->
{#snippet termList(listClass: string, linkClass: string, arrow: boolean)}
	<ul class="flex {listClass}">
		{#each group.terms as term (term.slug)}
			<li>
				<a
					href={term.href}
					class="group/link flex items-center justify-between gap-2 text-muted transition-colors hover:text-primary {linkClass}"
				>
					<span class="break-words">{term.term}</span>
					{#if arrow}
						<!-- Sized to this 17px list the way the 15px arrows on a term page are sized to 14px text, with the same pink slide on hover. -->
						<ArrowRightIcon
							size={18}
							class="shrink-0 opacity-0 transition duration-200 ease-out group-hover/link:translate-x-0.5 group-hover/link:opacity-100 group-focus-visible/link:translate-x-0.5 group-focus-visible/link:opacity-100 motion-reduce:transition-none"
						/>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{/snippet}

<!--
	One section per letter holding both layouts so the anchor id exists once.
	Desktop shows an open column; phones get a native <details> accordion,
	closed by default. Both are in the prerendered HTML so every term link is
	crawlable.
-->
<section id={group.letter} class="min-w-0 scroll-mt-24">
	<div class="hidden md:flex md:flex-col md:gap-4">
		<div class="border-b border-border/50 pb-3">
			<h2 class="text-h2">{group.letter}</h2>
		</div>
		{@render termList('flex-col gap-1', 'min-h-8 py-1 text-body', true)}
	</div>

	<details class="group border border-border/50 bg-white md:hidden">
		<summary
			class="flex h-[52px] cursor-pointer list-none items-center justify-between px-4 transition-colors group-open:bg-surface group-open:text-white [&::-webkit-details-marker]:hidden"
		>
			<h2 class="text-h3">{group.letter}</h2>
			<CaretDownIcon size={16} class="shrink-0 transition-transform duration-200 group-open:rotate-180" />
		</summary>
		{@render termList('flex-col gap-1 px-2 pt-4 pb-4', 'min-h-9 p-2 text-lg', false)}
	</details>
</section>
