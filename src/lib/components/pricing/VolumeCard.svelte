<script lang="ts">
	import VolumeRange from './VolumeRange.svelte';
	import type { PlanKey, PlanZone } from '$lib/data/pricing';

	interface Props {
		/** The question above the big number. */
		question: string;
		/** The other tab's question; the question box is sized to fit the longer of the two. */
		sizingQuestion?: string;
		/** Slider stop labels, in order. */
		labels: string[];
		/** Big number for the current stop. */
		volume: string;
		/** Plan name next to the price, when the plan has one. */
		planName?: string;
		price: string;
		/** Whether the price reads as a number with /mo after it. */
		showPeriod?: boolean;
		accent: 'primary' | 'green';
		value: number;
		valueText: string;
		/** Plan names above the track. */
		zones?: PlanZone[];
		/** Plan of the current stop, whose zone label is highlighted. */
		activePlan?: PlanKey;
		/** Keeps the zone row's height without zones, so this card matches the one beside it in the other tab. */
		holdZoneRow?: boolean;
	}

	let {
		question,
		sizingQuestion,
		labels,
		volume,
		planName,
		price,
		showPeriod = true,
		accent,
		value = $bindable(),
		valueText,
		zones = [],
		activePlan,
		holdZoneRow = false
	}: Props = $props();

</script>

<div
	data-markdown="skip"
	class="bg-white p-5 sm:p-10"
>
	<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
		<div class="flex flex-col gap-2.5">
			<div class="grid text-base leading-6 text-muted">
				<label for="volume-range" class="col-start-1 row-start-1">{question}</label>
				{#if sizingQuestion}<span class="invisible col-start-1 row-start-1" aria-hidden="true">{sizingQuestion}</span>{/if}
			</div>
			<p class="m-0 font-heading text-[2.75rem] leading-[46px] tracking-[-0.025em] text-surface md:text-[4rem] md:leading-[64px]" aria-live="polite">
				{volume}
			</p>
		</div>
		<div class="flex items-baseline justify-between gap-3 border-t border-border/60 pt-4 md:flex-col md:items-end md:gap-2.5 md:border-t-0 md:pt-0">
			<p class="m-0 flex items-baseline gap-2 sm:gap-3">
				{#if planName}
					<span class="font-heading text-2xl leading-8 tracking-[-0.02em] text-surface sm:text-4xl sm:leading-10">{planName}</span>
				{/if}
				<span
					class="font-serif leading-none font-medium italic {accent === 'primary'
						? 'text-primary text-[2.5rem] sm:text-[3.5rem]'
						: 'text-[#00873d] text-[2.5rem] sm:text-[3.5rem]'}"
				>
					{price}
				</span>
				{#if showPeriod}<span class="text-base leading-6 text-muted">/mo</span>{/if}
			</p>
		</div>
	</div>

	<div class="mt-8 md:mt-9">
		<VolumeRange id="volume-range" {labels} bind:value {valueText} {accent} {zones} {activePlan} {holdZoneRow} />
	</div>
</div>
