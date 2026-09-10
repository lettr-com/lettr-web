<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * Prototype of the Browserbase-style hero: a low-resolution scene is drawn
	 * into an offscreen canvas every frame, ordered-dithered (Bayer 8x8) into
	 * the four-step brand palette, and blown up with image-rendering: pixelated.
	 * Moving the pointer etches a fading trail into the picture.
	 *
	 * The scene is procedural (paper envelopes drifting upward) so the effect
	 * can be judged without any assets. Swapping `drawScene` for a hidden
	 * <video> or an image sequence keeps everything else unchanged.
	 */

	interface Props {
		height?: number;
		cell?: number;
		/** Optional rendered loop (mp4). Frames are dithered live; the procedural scene stays as fallback. */
		src?: string;
		/** Render the envelopes live in WebGL (endless, no loop point). Takes priority over src. */
		three?: boolean;
	}

	let { height = 440, cell = 5, src, three = false }: Props = $props();

	let wrapper: HTMLElement | undefined = $state();
	let canvas: HTMLCanvasElement | undefined = $state();

	// paper, rose, crimson, ink (production palette + one tint of the primary)
	const PALETTE: [number, number, number][] = [
		[247, 241, 243],
		[244, 168, 190],
		[236, 16, 75],
		[17, 24, 39]
	];

	const BAYER = [
		0, 32, 8, 40, 2, 34, 10, 42,
		48, 16, 56, 24, 50, 18, 58, 26,
		12, 44, 4, 36, 14, 46, 6, 38,
		60, 28, 52, 20, 62, 30, 54, 22,
		3, 35, 11, 43, 1, 33, 9, 41,
		51, 19, 59, 27, 49, 17, 57, 25,
		15, 47, 7, 39, 13, 45, 5, 37,
		63, 31, 55, 23, 61, 29, 53, 21
	];

	interface Envelope {
		x: number; // 0..1 of width
		y: number; // 0..1 of height, drifts upward
		w: number; // width in cells
		speed: number;
		tilt: number;
		phase: number;
	}

	onMount(() => {
		if (!wrapper || !canvas) return;
		const target = canvas;
		const host = wrapper;
		const ctx = target.getContext('2d');
		const off = document.createElement('canvas');
		const octx = off.getContext('2d', { willReadFrequently: true });
		if (!ctx || !octx) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let cols = 0;
		let rows = 0;
		let trail = new Float32Array(0);
		let trailNext = new Float32Array(0);
		let stampR = 12;
		let out: ImageData | null = null;
		let raf = 0;
		let last: { x: number; y: number } | null = null;
		const start = performance.now();

		const envelopes: Envelope[] = Array.from({ length: 7 }, (_, i) => ({
			x: 0.08 + (i / 7) * 0.84 + (Math.sin(i * 7.3) * 0.05),
			y: 0.25 + ((i * 0.37) % 1) * 0.9,
			w: 26 + ((i * 11) % 4) * 9,
			speed: 0.018 + ((i * 5) % 3) * 0.008,
			tilt: ((i % 3) - 1) * 0.18,
			phase: i * 1.7
		}));

		function resize() {
			const w = host.clientWidth;
			const h = host.clientHeight;
			cols = Math.max(40, Math.floor(w / cell));
			rows = Math.max(24, Math.floor(h / cell));
			off.width = cols;
			off.height = rows;
			target.width = cols;
			target.height = rows;
			trail = new Float32Array(cols * rows);
			trailNext = new Float32Array(cols * rows);
			stampR = Math.max(6, Math.round(54 / cell));
			out = ctx!.createImageData(cols, rows);
			if (gl) gl.resize(cols * 2, rows * 2);
		}

		function drawEnvelope(e: Envelope, t: number) {
			const w = e.w;
			const h = w * 0.62;
			const cx = e.x * cols;
			const cy = (1 - ((e.y + t * e.speed) % 1.3)) * rows + Math.sin(t * 0.8 + e.phase) * 2;
			octx!.save();
			octx!.translate(cx, cy);
			octx!.rotate(e.tilt + Math.sin(t * 0.6 + e.phase) * 0.08);

			// soft drop shadow (reads as crimson/ink dots after dithering)
			octx!.fillStyle = 'rgba(0,0,0,0.35)';
			octx!.fillRect(-w / 2 + 3, -h / 2 + 4, w, h);

			// body: light paper with a shading gradient (mid tones become rose)
			const body = octx!.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
			body.addColorStop(0, 'rgb(250,250,250)');
			body.addColorStop(1, 'rgb(150,150,150)');
			octx!.fillStyle = body;
			octx!.fillRect(-w / 2, -h / 2, w, h);

			// flap: darker triangle so the fold reads as crimson
			const flap = octx!.createLinearGradient(0, -h / 2, 0, 0);
			flap.addColorStop(0, 'rgb(120,120,120)');
			flap.addColorStop(1, 'rgb(60,60,60)');
			octx!.fillStyle = flap;
			octx!.beginPath();
			octx!.moveTo(-w / 2, -h / 2);
			octx!.lineTo(w / 2, -h / 2);
			octx!.lineTo(0, h * 0.12);
			octx!.closePath();
			octx!.fill();

			// outline in ink
			octx!.strokeStyle = 'rgb(10,10,10)';
			octx!.lineWidth = 1.2;
			octx!.strokeRect(-w / 2, -h / 2, w, h);
			octx!.beginPath();
			octx!.moveTo(-w / 2, -h / 2);
			octx!.lineTo(0, h * 0.12);
			octx!.lineTo(w / 2, -h / 2);
			octx!.stroke();

			octx!.restore();
		}

		function drawScene(t: number) {
			// paper sky fading to a warm horizon; the gradient turns into rose and
			// crimson dot fields once dithered, which is the "ground" of the image
			const sky = octx!.createLinearGradient(0, 0, 0, rows);
			sky.addColorStop(0, 'rgb(255,255,255)');
			sky.addColorStop(0.62, 'rgb(246,246,246)');
			sky.addColorStop(0.86, 'rgb(196,196,196)');
			sky.addColorStop(1, 'rgb(70,70,70)');
			octx!.fillStyle = sky;
			octx!.fillRect(0, 0, cols, rows);

			// a slow "signal" glow that drifts, so the horizon breathes
			const gx = cols * (0.5 + Math.sin(t * 0.25) * 0.25);
			const glow = octx!.createRadialGradient(gx, rows * 0.9, 4, gx, rows * 0.9, rows * 0.7);
			glow.addColorStop(0, 'rgba(255,255,255,0.55)');
			glow.addColorStop(1, 'rgba(255,255,255,0)');
			octx!.fillStyle = glow;
			octx!.fillRect(0, 0, cols, rows);

			for (const e of envelopes) drawEnvelope(e, t);
		}

		// Optional video source. When it is playable, its frames replace the
		// procedural scene; until then (or if it fails) the envelopes are drawn.
		/*
		 * Seamless looping: two players of the same file. The primary plays
		 * through; during its last FADE seconds the secondary starts from 0 and
		 * is blended in, then the two swap roles. This removes both the browser's
		 * loop hitch and any pose mismatch between the clip's first and last
		 * frame. The blend happens before dithering, so it never shows.
		 */
		const FADE = 1.2;
		let video: HTMLVideoElement | null = null;
		let standby: HTMLVideoElement | null = null;
		let videoReady = false;

		function makePlayer(): HTMLVideoElement {
			const v = document.createElement('video');
			v.src = src!;
			v.muted = true;
			v.loop = false;
			v.playsInline = true;
			v.preload = 'auto';
			v.addEventListener('error', () => {
				videoReady = false;
			});
			return v;
		}

		if (src) {
			video = makePlayer();
			standby = makePlayer();
			video.addEventListener('loadeddata', () => {
				videoReady = true;
				if (reducedMotion) {
					video!.pause();
					render(performance.now());
				} else {
					void video!.play().catch(() => {
						videoReady = false;
					});
				}
			});
			video.load();
			standby.load();
		}

		function fitAndDraw(v: HTMLVideoElement) {
			const vw = v.videoWidth || 16;
			const vh = v.videoHeight || 9;
			const scale = Math.max(cols / vw, rows / vh);
			const dw = vw * scale;
			const dh = vh * scale;
			octx!.drawImage(v, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
		}

		function drawVideo() {
			const v = video!;
			const s = standby!;
			const duration = v.duration || 0;
			const remain = duration - v.currentTime;
			fitAndDraw(v);
			if (reducedMotion || !duration) return;
			if (remain <= FADE) {
				if (s.paused) {
					s.currentTime = 0;
					void s.play().catch(() => {});
				}
				if (s.readyState >= 2) {
					octx!.globalAlpha = Math.min(1, Math.max(0, 1 - remain / FADE));
					fitAndDraw(s);
					octx!.globalAlpha = 1;
				}
			}
			if (v.ended || remain <= 0.03) {
				// swap roles: the standby is already FADE seconds in, so time is continuous
				video = s;
				standby = v;
				v.pause();
				v.currentTime = 0;
			}
		}

		// Optional live WebGL scene (lazy chunk). Rendered at twice the cell
		// grid, then drawn into the buffer so edges resolve before dithering.
		let gl: import('$lib/hero/envelopeScene').EnvelopeScene | null = null;
		if (three) {
			void import('$lib/hero/envelopeScene')
				.then((mod) => {
					gl = mod.createEnvelopeScene(cols * 2, rows * 2);
					if (reducedMotion) render(performance.now());
				})
				.catch(() => {
					gl = null;
				});
		}

		function drawGl(t: number) {
			const scene = gl!;
			scene.render(t);
			octx!.drawImage(scene.canvas, 0, 0, cols, rows);
		}

		function render(now: number) {
			const t = reducedMotion ? 0 : (now - start) / 1000;
			if (gl) drawGl(t);
			else if (videoReady && video && video.readyState >= 2) drawVideo();
			else drawScene(t);
			if (!reducedMotion) diffuse();
			const src = octx!.getImageData(0, 0, cols, rows).data;
			const dst = out!.data;
			for (let y = 0; y < rows; y++) {
				const by = (y & 7) * 8;
				for (let x = 0; x < cols; x++) {
					const i = y * cols + x;
					const p = i * 4;
					let lum = (src[p] * 0.299 + src[p + 1] * 0.587 + src[p + 2] * 0.114) / 255;
					const trailV = trail[i];
					if (trailV > 0.02) {
						// etch: pull the picture toward crimson where the pointer passed.
						// Soft edges fall into rose, the core into crimson.
						const k = Math.min(1, trailV * 1.15);
						lum = lum * (1 - k) + 0.45 * k;
					}
					const threshold = (BAYER[by + (x & 7)] + 0.5) / 64;
					const v = lum + (threshold - 0.5) * 0.3;
					const level = v > 0.8 ? 0 : v > 0.58 ? 1 : v > 0.32 ? 2 : 3;
					const c = PALETTE[level];
					dst[p] = c[0];
					dst[p + 1] = c[1];
					dst[p + 2] = c[2];
					dst[p + 3] = 255;
				}
			}
			ctx!.putImageData(out!, 0, 0);
			if (!reducedMotion) raf = requestAnimationFrame(render);
		}

		// The trail bleeds outward and fades like ink on wet paper: a cheap
		// five-tap diffusion each frame plus a slow decay.
		function diffuse() {
			const w = cols;
			const h = rows;
			for (let y = 0; y < h; y++) {
				const up = (y > 0 ? y - 1 : y) * w;
				const dn = (y < h - 1 ? y + 1 : y) * w;
				for (let x = 0; x < w; x++) {
					const i = y * w + x;
					const n = trail[up + x] + trail[dn + x] + trail[i - (x > 0 ? 1 : 0)] + trail[i + (x < w - 1 ? 1 : 0)];
					const v = (trail[i] * 0.64 + n * 0.09) * 0.985;
					trailNext[i] = v < 0.003 ? 0 : v;
				}
			}
			const tmp = trail;
			trail = trailNext;
			trailNext = tmp;
		}

		// Organic blob: the radius wobbles around the rim with a few sine
		// harmonics driven by time, so no two stamps share a silhouette.
		function stamp(cx: number, cy: number, t: number) {
			const R = stampR;
			for (let dy = -R; dy <= R; dy++) {
				for (let dx = -R; dx <= R; dx++) {
					const d = Math.hypot(dx, dy);
					if (d > R) continue;
					const a = Math.atan2(dy, dx);
					const wobble =
						0.72 +
						0.14 * Math.sin(a * 3 + t * 1.9 + cx * 0.05) +
						0.09 * Math.sin(a * 5 - t * 2.7 + cy * 0.07) +
						0.05 * Math.sin(a * 8 + t * 4.1);
					const rr = R * wobble;
					if (d > rr) continue;
					const x = cx + dx;
					const y = cy + dy;
					if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
					const f = 1 - d / rr;
					const v = f * f * (3 - 2 * f);
					const i = y * cols + x;
					if (v > trail[i]) trail[i] = v;
				}
			}
		}

		function onPointerMove(ev: PointerEvent) {
			const rect = host.getBoundingClientRect();
			const x = Math.floor(((ev.clientX - rect.left) / rect.width) * cols);
			const y = Math.floor(((ev.clientY - rect.top) / rect.height) * rows);
			const t = (performance.now() - start) / 1000;
			if (last) {
				const steps = Math.max(1, Math.ceil(Math.hypot(x - last.x, y - last.y) / 3));
				for (let s = 1; s <= steps; s++) {
					stamp(
						Math.round(last.x + ((x - last.x) * s) / steps),
						Math.round(last.y + ((y - last.y) * s) / steps),
						t
					);
				}
			} else {
				stamp(x, y, t);
			}
			last = { x, y };
			if (reducedMotion) render(performance.now());
		}

		function onPointerLeave() {
			last = null;
		}

		resize();
		render(performance.now());

		const ro = new ResizeObserver(() => {
			resize();
			if (reducedMotion) render(performance.now());
		});
		ro.observe(host);
		host.addEventListener('pointermove', onPointerMove, { passive: true });
		host.addEventListener('pointerleave', onPointerLeave);

		return () => {
			cancelAnimationFrame(raf);
			if (gl) {
				gl.dispose();
				gl = null;
			}
			for (const v of [video, standby]) {
				if (!v) continue;
				v.pause();
				v.removeAttribute('src');
				v.load();
			}
			ro.disconnect();
			host.removeEventListener('pointermove', onPointerMove);
			host.removeEventListener('pointerleave', onPointerLeave);
		};
	});
</script>

<div
	bind:this={wrapper}
	class="relative w-full overflow-hidden border border-border/40 bg-background"
	style="height: {height}px"
	aria-hidden="true"
>
	<canvas bind:this={canvas} class="block h-full w-full [image-rendering:pixelated]"></canvas>
</div>
