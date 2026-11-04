<script lang="ts">
	import { untrack } from 'svelte';
	import type { PlanKey, PlanZone } from '$lib/data/pricing';

	interface Props {
		id: string;
		/** Stop labels under the track, in order. */
		labels: string[];
		value: number;
		valueText: string;
		accent: 'primary' | 'green';
		/** Plan names above the track. */
		zones?: PlanZone[];
		/** Plan of the current stop, whose zone label is highlighted. */
		activePlan?: PlanKey;
		/** Keeps the zone row's height when there are no zones, so switching modes doesn't move the track. */
		holdZoneRow?: boolean;
	}

	let { id, labels, value = $bindable(), valueText, accent, zones = [], activePlan, holdZoneRow = false }: Props = $props();

	/*
	 * The native input sits invisibly over the drawn track and keeps keyboard and screen-reader
	 * behaviour. Its thumb is as wide as the track is tall, so the drawn knob, which sits inside
	 * the fill with a PAD inset, centres where the native thumb does.
	 */
	const TRACK = 36;
	const PAD = 4;
	const MINOR = 3;
	// the fill is solid for SOLID px behind the knob, then thins out in ordered dither towards the start
	const CELL = 3;
	const SOLID = 40;
	const FLOOR = 0.3;
	const BAYER = [
		0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60,
		28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15,
		47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21
	];

	const last = $derived(labels.length - 1);
	const at = (i: number) => `calc(${TRACK / 2}px + (100% - ${TRACK}px) * ${i / last})`;
	const ticks = $derived(Array.from({ length: last * (MINOR + 1) + 1 }, (_, i) => i / (MINOR + 1)));
	const color = $derived(accent === 'primary' ? '#ec104b' : '#00c851');

	let canvas: HTMLCanvasElement | undefined = $state();
	let width = $state(0);
	// drawn knob position in steps; it glides after `value`, and `lag` thins the dither while it travels
	let pos = $state(untrack(() => value));
	let lag = $state(0);

	const centre = $derived(TRACK / 2 + (width - TRACK) * (pos / last));
	const solidFrom = $derived(Math.max(0, centre - TRACK / 2 - SOLID));

	$effect(() => {
		const target = value;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			pos = target;
			return;
		}
		let raf = 0;
		let prev = performance.now();
		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - prev) / 1000);
			prev = now;
			const step = (target - pos) * (1 - Math.exp(-dt * 12));
			const speed = (Math.abs(step) * (width - TRACK)) / last / Math.max(dt, 0.001);
			pos = Math.abs(target - pos - step) < 0.002 ? target : pos + step;
			lag += (Math.min(120, speed * 0.1) - lag) * (1 - Math.exp(-dt * 10));
			if (pos === target && lag < 0.5) {
				lag = 0;
				return;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	$effect(() => {
		if (!canvas || !width) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const cols = Math.ceil(width / CELL);
		const rows = TRACK / CELL;
		canvas.width = cols;
		canvas.height = rows;
		ctx.fillStyle = color;
		const span = Math.max(1, solidFrom);
		for (let x = 0; x * CELL < solidFrom; x++) {
			const t = Math.min(1, (solidFrom - (x + 0.5) * CELL + lag) / span);
			const density = FLOOR + (1 - FLOOR) * Math.pow(1 - t, 0.8);
			for (let y = 0; y < rows; y++) {
				if (density > (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64) ctx.fillRect(x, y, 1, 1);
			}
		}
	});
</script>

<style>
	.range {
		-webkit-appearance: none;
		appearance: none;
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		background: transparent;
		cursor: pointer;
		opacity: 0;
	}

	.range::-webkit-slider-runnable-track {
		height: 100%;
		background: transparent;
	}

	.range::-moz-range-track {
		height: 100%;
		background: transparent;
	}

	.range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 36px;
		height: 36px;
	}

	.range::-moz-range-thumb {
		width: 36px;
		height: 36px;
		border: 0;
		border-radius: 0;
	}

	.knob {
		transition: scale 160ms cubic-bezier(0.22, 1, 0.36, 1);
		box-shadow:
			0 1px 2px rgb(17 24 39 / 0.18),
			0 4px 10px -2px rgb(17 24 39 / 0.16);
	}

	.track:hover .knob {
		scale: 1.06;
	}

	.track:has(.range:active) .knob {
		scale: 0.94;
	}

	.track:has(.range:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}
</style>

<div class="flex flex-col gap-3" style="--accent: {color}">
	{#if zones.length || holdZoneRow}
		<div class="relative h-[18px]" aria-hidden="true">
			{#each zones as zone}
				<span
					class="absolute top-0 text-[11px] leading-[14px] tracking-[0.06em] transition-colors {zone.plan === activePlan ? 'text-[#d40e43]' : 'text-muted'}"
					style="left: {zone.align === 'left' ? '0' : zone.align === 'right' ? 'auto' : at(zone.step)}; right: {zone.align === 'right' ? '0' : 'auto'}; transform: translateX({zone.align === 'center' ? '-50%' : '0'})"
				>
					{zone.label}
				</span>
			{/each}
		</div>
	{/if}

	<div class="track relative overflow-hidden bg-[#f1eef0]" style="height: {TRACK}px" bind:clientWidth={width}>
		<canvas
			bind:this={canvas}
			class="pointer-events-none absolute top-0 left-0 h-full"
			style="width: {Math.ceil(width / CELL) * CELL}px; image-rendering: pixelated"
			aria-hidden="true"
		></canvas>
		<!-- before the track is measured (prerendered HTML) this is the whole fill -->
		<div
			class="pointer-events-none absolute inset-y-0"
			style={width
				? `left: ${solidFrom}px; width: ${centre + TRACK / 2 - solidFrom}px; background: ${color}`
				: `left: 0; width: calc(${TRACK}px + (100% - ${TRACK}px) * ${value / last}); background: ${color}`}
			aria-hidden="true"
		></div>
		<span
			class="knob pointer-events-none absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-white"
			style="left: {width ? `${centre}px` : at(value)}; width: {TRACK - PAD * 2}px; height: {TRACK - PAD * 2}px"
			aria-hidden="true"
		>
			<span class="h-1.5 w-1.5" style="background: {color}"></span>
		</span>
		<input
			{id}
			type="range"
			min={0}
			max={last}
			step={1}
			bind:value
			class="range"
			aria-valuetext={valueText}
		/>
	</div>

	<div class="flex flex-col gap-2" aria-hidden="true">
		<div class="relative h-3.5">
			{#each ticks as t}
				{@const isStop = Number.isInteger(t)}
				{@const isCurrent = t === value}
				<span
					class="absolute top-0 w-px -translate-x-1/2 transition-colors {isCurrent
						? 'h-3.5 bg-surface'
						: isStop
							? 'h-2.5 bg-[#9ca3af]'
							: 'h-1.5 bg-border'}"
					style="left: {at(t)}"
				></span>
			{/each}
		</div>
		<div class="relative h-4">
			{#each labels as label, i}
				<span
					class="absolute top-0 w-10 -translate-x-1/2 text-center font-code text-[11px] leading-4 transition-colors md:text-[13px] {i === value ? 'text-surface' : 'text-muted/70'} {i % 2 === 1 ? 'hidden sm:block' : ''}"
					style="left: {at(i)}"
				>
					{label}
				</span>
			{/each}
		</div>
	</div>
</div>
