<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * The backdrop of a dark stage: a still 8x8 Bayer dither that rises from the
	 * bottom edge in a tone one step lighter than the stage. One definition so the
	 * terminal section and the version history section match. Put it inside a
	 * `relative overflow-hidden` parent.
	 */

	interface Props {
		/** Dither colour, one step lighter than the stage it sits on. Any CSS colour, tokens included. */
		tone: string;
	}

	let { tone }: Props = $props();

	const BAYER = [
		0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60,
		28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15,
		47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21
	];
	/** One dither cell in CSS px. */
	const cell = 4;
	/** Share of the stage height the ramp climbs, and its density at the bottom edge. */
	const reach = 0.7;
	const peak = 0.85;

	let canvas: HTMLCanvasElement | undefined = $state();

	onMount(() => {
		if (!canvas) return;
		const target = canvas;
		const ctx = target.getContext('2d');
		if (!ctx) return;

		// Canvas cannot read CSS variables, so let the element resolve the colour.
		target.style.color = tone;
		const fill = getComputedStyle(target).color;

		function render() {
			const cols = Math.max(1, Math.ceil(target.clientWidth / cell));
			const rows = Math.max(1, Math.ceil(target.clientHeight / cell));
			target.width = cols;
			target.height = rows;
			ctx!.fillStyle = fill;
			for (let y = 0; y < rows; y++) {
				const fromBottom = 1 - (y + 0.5) / rows;
				const v = Math.pow(Math.max(0, 1 - fromBottom / reach), 1.6) * peak;
				for (let x = 0; x < cols; x++) {
					if (v > (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64) ctx!.fillRect(x, y, 1, 1);
				}
			}
		}

		render();
		const ro = new ResizeObserver(render);
		ro.observe(target);
		return () => ro.disconnect();
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none absolute inset-0 h-full w-full [image-rendering:pixelated]"
	aria-hidden="true"
></canvas>
