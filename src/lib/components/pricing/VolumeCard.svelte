<script lang="ts">
	interface Props {
		/** The question above the big number. */
		question: string;
		/** Slider stop labels, in order. */
		labels: string[];
		/** Big number for the current stop. */
		volume: string;
		/** "Selected plan" or "Marketing plan". */
		planCaption: string;
		/** Plan name next to the price (transactional only). */
		planName?: string;
		price: string;
		/** Whether the price reads as a number with /mo after it. */
		showPeriod?: boolean;
		accent: 'primary' | 'green';
		value: number;
		valueText: string;
	}

	let {
		question,
		labels,
		volume,
		planCaption,
		planName,
		price,
		showPeriod = true,
		accent,
		value = $bindable(),
		valueText
	}: Props = $props();

	const THUMB = 28;
	const last = $derived(labels.length - 1);
	const at = (i: number) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${i / last})`;
</script>

<style>
	/* Native range input, restyled to the Paper slider: square thumb, slim grey track that fills as it moves */
	.range {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 28px;
		margin: 0;
		background: transparent;
		cursor: pointer;
	}

	.range::-webkit-slider-runnable-track {
		height: 8px;
		background: linear-gradient(to right, var(--accent) var(--fill), #e5e7eb var(--fill));
	}

	.range::-moz-range-track {
		height: 8px;
		background: #e5e7eb;
	}

	.range::-moz-range-progress {
		height: 8px;
		background: var(--accent);
	}

	.range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 28px;
		height: 28px;
		margin-top: -10px;
		background: var(--accent);
		border: 4px solid var(--halo);
		border-radius: 0;
		box-sizing: border-box;
	}

	.range::-moz-range-thumb {
		width: 28px;
		height: 28px;
		background: var(--accent);
		border: 4px solid var(--halo);
		border-radius: 0;
		box-sizing: border-box;
	}

	.range:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 6px;
	}
</style>

<div
	class="bg-white p-5 sm:p-10"
	style="--accent: {accent === 'primary' ? '#ec104b' : '#00c851'}; --halo: {accent === 'primary' ? '#fde7ed' : '#d9f7e6'}"
>
	<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
		<div class="flex flex-col gap-2.5">
			<label for="volume-range" class="text-base leading-6 text-muted">{question}</label>
			<p class="m-0 font-heading text-[2.75rem] leading-[46px] tracking-[-0.025em] text-surface md:text-[4rem] md:leading-[64px]" aria-live="polite">
				{volume}
			</p>
		</div>
		<div class="flex items-baseline justify-between gap-3 border-t border-border/60 pt-4 md:flex-col md:items-end md:gap-2.5 md:border-t-0 md:pt-0">
			<p class="m-0 text-base leading-6 text-muted">{planCaption}</p>
			<p class="m-0 flex items-baseline gap-2 sm:gap-3">
				{#if planName}
					<span class="font-heading text-2xl leading-8 tracking-[-0.02em] text-surface sm:text-4xl sm:leading-10">{planName}</span>
				{/if}
				<span
					class="font-serif leading-none font-medium italic {accent === 'primary'
						? 'text-primary text-[2rem] sm:text-[2.75rem]'
						: 'text-[#00873d] text-[2.5rem] sm:text-[3.5rem]'}"
				>
					{price}
				</span>
				{#if showPeriod}<span class="text-base leading-6 text-muted">/mo</span>{/if}
			</p>
		</div>
	</div>

	<div class="mt-8 flex flex-col gap-3.5 md:mt-9">
		<div class="relative">
			<div class="pointer-events-none absolute inset-x-0 top-1 h-5" aria-hidden="true">
				{#each labels as _, i}
					<span class="absolute top-0 h-5 w-0.5 -translate-x-1/2 bg-border" style="left: {at(i)}"></span>
				{/each}
			</div>
			<input
				id="volume-range"
				type="range"
				min={0}
				max={last}
				step={1}
				bind:value
				class="range relative"
				style="--fill: {at(value)}"
				aria-valuetext={valueText}
			/>
		</div>
		<div class="relative h-[18px]" aria-hidden="true">
			{#each labels as label, i}
				<span
					class="absolute top-0 w-10 -translate-x-1/2 text-center font-code text-[13px] leading-4 {i === value ? 'text-surface' : 'text-muted'} {i % 2 === 1 ? 'hidden sm:block' : ''}"
					style="left: {at(i)}"
				>
					{label}
				</span>
			{/each}
		</div>
	</div>
</div>
