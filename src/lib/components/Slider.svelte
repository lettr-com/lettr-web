<script lang="ts">
	interface Props {
		min?: number;
		max?: number;
		step?: number;
		value?: number;
		onchange?: (value: number) => void;
		labels?: string[];
	}

	let { min = 0, max = 100, step = 1, value = $bindable(50), onchange, labels = [] }: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = Number(target.value);
		onchange?.(value);
	}

	let percentage = $derived(((value - min) / (max - min)) * 100);
	let trackWidth: number = $state(500);
</script>

<div class="flex w-full flex-col gap-2" bind:clientWidth={trackWidth}>
	<input
		type="range"
		{min}
		{max}
		{step}
		{value}
		oninput={handleInput}
		class="slider-input w-full cursor-pointer appearance-none bg-transparent"
		style="--pct: {percentage}%"
		aria-label="Email volume slider"
	/>
</div>

{#if labels.length}
	<div class="relative mt-2 h-4">
		{#each labels as label, i}
			{@const thumbWidth = 20}
			{@const usable = trackWidth - thumbWidth}
			{@const steps = (max - min) / step}
			{@const left = thumbWidth / 2 + (i / steps) * usable}
			<span
				class="absolute text-xs text-muted -translate-x-1/2"
				style="left: {left}px"
			>
				{label}
			</span>
		{/each}
	</div>
{/if}

<style>
	.slider-input::-webkit-slider-runnable-track {
		height: 4px;
		background: linear-gradient(
			to right,
			var(--color-primary) 0%,
			var(--color-primary) var(--pct),
			#d1d5db var(--pct),
			#d1d5db 100%
		);
	}

	.slider-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		transform: rotate(45deg);
		background: var(--color-primary);
		cursor: pointer;
		margin-top: -5px;
	}

	.slider-input::-moz-range-track {
		height: 4px;
		background: #d1d5db;
	}

	.slider-input::-moz-range-progress {
		height: 4px;
		background: var(--color-primary);
	}

	.slider-input::-moz-range-thumb {
		width: 14px;
		height: 14px;
		background: var(--color-primary);
		cursor: pointer;
		transform: rotate(45deg);
	}
</style>
