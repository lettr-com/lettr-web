<script lang="ts">
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import { comparisonRows } from '$lib/data/pricing';

	const heads = ['Free', 'Pro', 'Business', 'Enterprise'];
	const columns = 'grid-template-columns: minmax(170px, 1.6fr) repeat(4, minmax(104px, 1fr))';
</script>

<section aria-labelledby="compare-heading" class="mx-auto mt-8 max-w-[1100px] bg-white p-5 sm:p-8">
	<div class="mb-5 flex items-baseline justify-between gap-3">
		<h2 id="compare-heading" class="m-0 font-heading text-[1.75rem] leading-[34px] tracking-[-0.02em] text-surface">Compare plans</h2>
		<span class="text-xs text-muted lg:hidden">Swipe to compare</span>
	</div>

	<div class="-mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
		<div class="min-w-[640px]" role="table" aria-label="Plan comparison">
			<div role="row" class="grid pb-3.5" style={columns}>
				<span role="columnheader" class="text-sm leading-5 text-muted">Feature</span>
				{#each heads as head}
					<span role="columnheader" class="text-center text-sm leading-5 {head === 'Pro' ? 'font-bold text-primary' : 'text-muted'}">{head}</span>
				{/each}
			</div>
			{#each comparisonRows as row}
				<div role="row" class="grid items-center border-t border-border/60 py-3.5" style={columns}>
					<span role="rowheader" class="pr-4 text-[0.9375rem] leading-[22px] font-semibold text-surface">{row.feature}</span>
					{#each row.values as value}
						<span role="cell" class="flex min-h-[22px] items-center justify-center text-center text-[0.9375rem] leading-[22px] text-muted">
							{#if value === true}
								<CheckIcon size={16} weight="bold" class="text-primary" aria-label="Included" />
							{:else if value === false}
								<XIcon size={16} class="text-border" aria-label="Not included" />
							{:else}
								{value}
							{/if}
						</span>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</section>
