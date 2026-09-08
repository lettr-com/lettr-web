<script lang="ts">
	import { monthHref, type FilterToken } from '$lib/changelog/filter';
	import { archiveByYear, formatMonth } from '$lib/changelog/months';

	interface Props {
		/** The month being read, filled in so the grid says where you are. */
		current?: string;
		/** Carried into every month link, so narrowing the log survives the jump. */
		filter?: FilterToken[];
	}

	let { current, filter = [] }: Props = $props();

	const years = archiveByYear();

	const cell = 'flex h-9 items-center justify-center text-xs sm:h-8';
	const monthCell = `${cell} border font-medium transition-colors`;
</script>

<!--
	The month index, one fixed twelve-slot row per year. A flat list of
	"February 2026"-style links grows a line every month and repeats the year
	twelve times over; keeping every year the same width means the header stays
	the same size however long the log gets. Months with nothing in them stay in
	the grid as inert cells — they hold the shape, and they show the cadence.
-->
<nav aria-label="Browse the changelog by month" class="flex max-w-xl flex-col gap-3 sm:gap-2">
	{#each years as { year, slots } (year)}
		<div class="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 sm:gap-x-6">
			<span class="font-heading text-sm leading-9 text-muted tabular-nums sm:leading-8">{year}</span>
			<div class="grid grid-cols-6 gap-1 sm:grid-cols-12">
				{#each slots as slot, index (index)}
					{#if slot.id}
						<a
							href={monthHref(slot.id, filter)}
							aria-label={formatMonth(slot.id)}
							aria-current={slot.id === current ? 'page' : undefined}
							class="{monthCell} {slot.id === current
								? 'border-primary bg-primary text-white'
								: 'border-border/50 bg-white text-surface hover:border-primary hover:bg-primary hover:text-white'}"
						>
							{slot.label}
						</a>
					{:else}
						<span aria-hidden="true" class="{cell} text-border">{slot.label}</span>
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</nav>
