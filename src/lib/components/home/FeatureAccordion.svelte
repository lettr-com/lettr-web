<script module lang="ts">
	import type { GraphicId } from './AccordionGraphic.svelte';

	export interface AccordionItem {
		id: GraphicId;
		title: string;
		description: string;
	}
</script>

<script lang="ts">
	import AccordionGraphic from './AccordionGraphic.svelte';

	interface Props {
		items: AccordionItem[];
		/** Prefix that keeps aria ids unique when several accordions share a page. */
		name: string;
	}

	let { items, name }: Props = $props();

	// one row open at a time, all closed to start
	let openId: GraphicId | null = $state(null);

	function toggle(id: GraphicId) {
		openId = openId === id ? null : id;
	}
</script>

<ul class="flex flex-col gap-2 md:gap-4">
	{#each items as item (item.id)}
		{@const isOpen = openId === item.id}
		<li class="group border-l-[3px] transition-colors {isOpen ? 'border-primary bg-white' : 'border-transparent bg-white hover:border-primary hover:bg-primary-soft'}">
			<h3 class="m-0">
				<button
					type="button"
					id="{name}-{item.id}-trigger"
					aria-expanded={isOpen}
					aria-controls="{name}-{item.id}-panel"
					onclick={() => toggle(item.id)}
					class="flex min-h-[68px] w-full cursor-pointer items-center justify-between gap-4 py-[22px] pr-5 pl-5 text-left transition-colors md:pr-[26px] md:pl-5 {isOpen ? 'bg-primary-soft' : ''}"
				>
					<span class="font-body text-[1.0625rem] leading-6 font-semibold text-surface md:text-xl {isOpen ? '' : 'text-muted group-hover:text-surface'}">{item.title}</span>
					<span class="w-6 shrink-0 text-center text-2xl leading-6 text-primary {isOpen ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity" aria-hidden="true">{isOpen ? '−' : '+'}</span>
				</button>
			</h3>

			<div
				id="{name}-{item.id}-panel"
				class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none {isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}"
			>
				<div class="min-h-0 overflow-hidden" inert={!isOpen}>
					<div class="flex flex-col gap-[22px] px-5 pt-6 pb-7 md:pr-[26px]">
						<p class="min-h-[50px] max-w-[460px] text-base leading-[25px] text-muted">{item.description}</p>
						<AccordionGraphic id={item.id} />
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>
