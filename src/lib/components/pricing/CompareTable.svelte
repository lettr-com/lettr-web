<script lang="ts">
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import { comparisonRows } from '$lib/data/pricing';

	const heads = ['Free', 'Pro', 'Business', 'Enterprise'];
</script>

<section aria-labelledby="compare-heading" class="mx-auto mt-8 max-w-[1100px] bg-white p-5 sm:p-8">
	<div class="mb-5 flex items-baseline justify-between gap-3">
		<h2 id="compare-heading" class="m-0 font-heading text-[1.75rem] leading-[34px] tracking-[-0.02em] text-surface">Compare plans</h2>
		<span class="text-xs text-muted lg:hidden" data-markdown="skip">Swipe to compare</span>
	</div>

	<div class="-mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
		<table aria-label="Plan comparison" class="w-full min-w-[640px] border-collapse text-left">
			<thead>
				<tr>
					<th scope="col" class="w-[24%] pb-3.5 text-sm leading-5 font-normal text-muted">Feature</th>
					{#each heads as head}
						<th scope="col" class="pb-3.5 text-center text-sm leading-5 {head === 'Pro' ? 'font-bold text-primary' : 'font-normal text-muted'}">{head}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each comparisonRows as row}
					<tr class="border-t border-border/60">
						<th scope="row" class="py-3.5 pr-4 text-[0.9375rem] leading-[22px] font-semibold text-surface">{row.feature}</th>
						{#each row.values as value}
							<td class="py-3.5 text-center text-[0.9375rem] leading-[22px] text-muted">
								{#if value === true}
									<CheckIcon size={16} weight="bold" class="inline text-primary" aria-label="Included" />
								{:else if value === false}
									<XIcon size={16} class="inline text-border" aria-label="Not included" />
								{:else}
									{value}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
