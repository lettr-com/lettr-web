<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import type { LetterGroup } from '$lib/glossary/types';

	interface Props {
		group: LetterGroup;
	}

	let { group }: Props = $props();
</script>

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
		<ul class="flex flex-col gap-1">
			{#each group.terms as term (term.slug)}
				<li>
					<a
						href={term.href}
						class="group flex min-h-8 items-center justify-between gap-2 py-1 text-body text-muted transition-colors hover:text-primary"
					>
						<span class="break-words">{term.term}</span>
						<ArrowRightIcon
							size={15}
							class="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
						/>
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<details class="group border border-border/50 bg-white md:hidden">
		<summary
			class="flex h-[52px] cursor-pointer list-none items-center justify-between px-4 transition-colors group-open:bg-surface group-open:text-white [&::-webkit-details-marker]:hidden"
		>
			<h2 class="text-h3">{group.letter}</h2>
			<CaretDownIcon size={16} class="shrink-0 transition-transform duration-200 group-open:rotate-180" />
		</summary>
		<ul class="flex flex-col gap-1 px-2 pt-4 pb-4">
			{#each group.terms as term (term.slug)}
				<li>
					<a
						href={term.href}
						class="group/link flex min-h-9 items-center justify-between gap-2 px-2 py-1.5 text-sm text-muted transition-colors hover:text-primary"
					>
						<span class="break-words">{term.term}</span>
						<ArrowRightIcon
							size={15}
							class="shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100 group-focus-visible/link:opacity-100"
						/>
					</a>
				</li>
			{/each}
		</ul>
	</details>
</section>
