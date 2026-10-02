<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * Ragged wave-dithered edge that lets a dark band bleed up into the page,
	 * matching the Paper "Dithering" strip (wave, 8x8 Bayer, 24px tall).
	 */

	interface Props {
		/** Edge colour. */
		color?: string;
		/** Strip height in px. */
		height?: number;
		/** Size of one dither cell in px. */
		cell?: number;
		/** `above` sits over the top of its parent, `inside` hugs the parent's bottom edge. */
		placement?: 'above' | 'inside';
		/** `wave` is a ragged edge, `fire` licks upward in flickering tongues. */
		mode?: 'wave' | 'fire';
	}

	let { color = '#23020B', height = 24, cell = 6, placement = 'above', mode = 'wave' }: Props = $props();

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
		const rows = Math.round(height / cell);
		let cols = 0;
		let raf = 0;
		const start = performance.now();

		function resize() {
			cols = Math.max(1, Math.ceil(target.clientWidth / cell));
			target.width = cols;
			target.height = rows;
		}

		function render(now: number) {
			const t = reducedMotion ? 0 : (now - start) / 1000;
			ctx!.clearRect(0, 0, cols, rows);
			ctx!.fillStyle = color;
			for (let y = 0; y < rows; y++) {
				const base = (y + 0.5) / rows; // 0 at the top, 1 at the bottom
				for (let x = 0; x < cols; x++) {
					if (mode === 'fire') {
						// each column has a flame tip that flickers; heat grows towards the base
						const tip =
							0.5 +
							Math.sin(x * 0.41 + t * 2.1) * 0.2 +
							Math.sin(x * 0.93 - t * 3.3) * 0.14 +
							Math.sin(x * 0.17 + t * 1.1) * 0.12;
						const heat = Math.max(0, (base - tip) / (1 - tip));
						const flicker = Math.sin(y * 1.7 - t * 6 + x * 0.6) * 0.07;
						const threshold = (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
						if (y >= rows - 1 || heat * 0.95 + flicker > threshold) ctx!.fillRect(x, y, 1, 1);
						continue;
					}
					const wave =
						Math.sin(x * 0.11 + t * 0.9) * 0.18 +
						Math.sin(x * 0.047 - t * 0.6) * 0.16 +
						Math.sin(x * 0.23 + t * 1.3) * 0.06;
					const v = base * 1.3 - 0.12 + wave;
					const threshold = (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
					if (y === rows - 1 || v > threshold) ctx!.fillRect(x, y, 1, 1);
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
	class="pointer-events-none absolute inset-x-0 w-full"
	style="height: {height}px; {placement === 'above' ? `top: -${height}px;` : 'bottom: 0;'} image-rendering: pixelated;"
	aria-hidden="true"
></canvas>
