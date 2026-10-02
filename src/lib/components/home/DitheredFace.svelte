<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * Illustration drawn with a light ordered dither: the image keeps its own
	 * colours but each channel is reduced to a few steps and the rounding is
	 * pushed around by a Bayer matrix, which leaves a fine pixel grain.
	 */

	interface Props {
		src: string;
		/** Resolution of the canvas in image pixels; the element is scaled up to fit its box. */
		resolution?: number;
		/** Colour steps kept per channel. More steps = subtler. */
		levels?: number;
		class?: string;
	}

	let { src, resolution = 96, levels = 9, class: className = '' }: Props = $props();

	const BAYER = [
		0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60,
		28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15,
		47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21
	];

	let canvas: HTMLCanvasElement | undefined = $state();
	let isReady = $state(false);

	onMount(() => {
		if (!canvas) return;
		const target = canvas;
		const ctx = target.getContext('2d', { willReadFrequently: true });
		if (!ctx) return;

		const image = new Image();
		image.onload = () => {
			target.width = resolution;
			target.height = resolution;
			ctx.imageSmoothingQuality = 'high';
			ctx.drawImage(image, 0, 0, resolution, resolution);
			const frame = ctx.getImageData(0, 0, resolution, resolution);
			const px = frame.data;
			const steps = levels - 1;
			for (let y = 0; y < resolution; y++) {
				for (let x = 0; x < resolution; x++) {
					const i = (y * resolution + x) * 4;
					const bias = (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64 - 0.5;
					for (let c = 0; c < 3; c++) {
						const v = (px[i + c] / 255) * steps + bias;
						px[i + c] = (Math.min(steps, Math.max(0, Math.round(v))) / steps) * 255;
					}
				}
			}
			ctx.putImageData(frame, 0, 0);
			isReady = true;
		};
		image.src = src;
	});
</script>

<canvas
	bind:this={canvas}
	class="{className} {isReady ? '' : 'opacity-0'}"
	style="image-rendering: pixelated;"
	aria-hidden="true"
></canvas>
