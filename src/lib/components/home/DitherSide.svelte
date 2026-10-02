<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * Animated ordered-dither strip that runs down the right edge of a card,
	 * matching the Paper ripple / simplex Dithering shaders. Density falls off
	 * from the outer edge inwards.
	 */

	interface Props {
		color: string;
		/** `ripple` = rolling bands, `noise` = drifting blotches. */
		variant?: 'ripple' | 'noise';
		/** Strip width in px. */
		width?: number;
		/** Size of one dither cell in px. */
		cell?: number;
	}

	let { color, variant = 'ripple', width = 40, cell = 10 }: Props = $props();

	const BAYER = [
		0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60,
		28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15,
		47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21
	];

	let canvas: HTMLCanvasElement | undefined = $state();

	onMount(() => {
		if (!canvas) return;
		const target = canvas;
		const ctx = target.getContext('2d');
		if (!ctx) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const cols = Math.max(1, Math.round(width / cell));
		let rows = 1;
		let raf = 0;
		const start = performance.now();

		function resize() {
			rows = Math.max(1, Math.ceil(target.clientHeight / cell));
			target.width = cols;
			target.height = rows;
		}

		function field(x: number, y: number, t: number) {
			if (variant === 'ripple') {
				return 0.5 + 0.5 * Math.sin(y * 0.55 - t * 1.1 + Math.sin(y * 0.17 + t * 0.4) * 2.2);
			}
			return (
				0.5 +
				0.25 * Math.sin(x * 1.3 + y * 0.45 + t * 0.5) +
				0.2 * Math.sin(y * 0.8 - t * 0.7 + x * 0.6) +
				0.1 * Math.sin(y * 0.21 + t * 0.3)
			);
		}

		function render(now: number) {
			const t = reducedMotion ? 0 : (now - start) / 1000;
			ctx!.clearRect(0, 0, cols, rows);
			ctx!.fillStyle = color;
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const edge = (x + 1) / cols; // 1 at the outer (right) edge
					const v = field(x, y, t) * edge * 1.25 - 0.1;
					const threshold = (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
					if (v > threshold) ctx!.fillRect(x, y, 1, 1);
				}
			}
			if (!reducedMotion) raf = requestAnimationFrame(render);
		}

		resize();
		render(performance.now());
		const ro = new ResizeObserver(() => {
			resize();
			if (reducedMotion) render(performance.now());
		});
		ro.observe(target);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none absolute top-0 right-0 h-full"
	style="width: {width}px; image-rendering: pixelated;"
	aria-hidden="true"
></canvas>
