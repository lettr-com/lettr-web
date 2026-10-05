<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * Envelope field from the 2026 homepage design: flat envelope illustrations
	 * floating on an ink background, composed on a low-resolution canvas and
	 * ordered-dithered (Bayer 8x8) into the brand palette, then scaled up with
	 * image-rendering: pixelated. The pointer etches a fading crimson trail,
	 * same as DitherHero. Swap this component for DitherHero in HomeHero to
	 * roll back to the previous 3D treatment.
	 *
	 * Besides envelopes the field carries a few other mail-ish objects (plane,
	 * stamp, key, @, check). Everything just drifts upward; clicking an envelope
	 * lifts its flap for a moment.
	 */

	interface Props {
		/** Pixel size of one dither cell on desktop. */
		cell?: number;
		/** Cell size under 768px wide. */
		cellMobile?: number;
		/** Turn the dither off to see the raw composition. */
		dither?: boolean;
	}

	let { cell = 4, cellMobile = 3, dither = true }: Props = $props();

	type Kind = 'envelope' | 'face' | 'plane' | 'at' | 'stamp' | 'key' | 'check';

	interface Sprite {
		kind: Kind;
		// top-left origin + size + clockwise rotation (deg), as laid out in Paper
		x: number;
		y: number;
		w: number;
		h: number;
		rot: number;
		phase: number;
		/** upward drift in reference px per second; 0 pins the sprite */
		speed: number;
		/** envelopes only: time (s) until the flap closes again */
		openUntil?: number;
		/** envelopes only: when it was last opened, for the little pop */
		openAt?: number;
	}

	interface Layout {
		w: number;
		h: number;
		sprites: Sprite[];
	}

	const env = (
		x: number,
		y: number,
		w: number,
		h: number,
		rot: number,
		phase: number,
		speed: number
	): Sprite => ({
		kind: 'envelope',
		x,
		y,
		w,
		h,
		rot,
		phase,
		speed
	});

	const obj = (kind: Kind, x: number, y: number, size: number, rot: number, phase: number, speed: number): Sprite => ({
		kind,
		x,
		y,
		w: size,
		h: size,
		rot,
		phase,
		speed
	});

	const DESKTOP: Layout = {
		w: 1280,
		h: 430,
		sprites: [
			env(63, -114, 280.8, 366.2, 44.15, 0.4, 26),
			env(270.2, 143.7, 172.5, 172.5, 4.44, 1.9, 16),
			env(412, -5, 118.4, 118.4, -30.58, 3.1, 12),
			env(608, 76, 196.3, 256, -8.69, 4.4, 22),
			env(514, 324, 149.3, 194.6, 15, 2.6, 14),
			env(972, 65, 92.2, 92.2, -6.67, 5.2, 10),
			env(894.9, 203.5, 220, 220, -4.1, 0.9, 24),
			env(1123, -20, 220, 220, -15, 3.7, 28),
			{ kind: 'face', x: 144, y: 316, w: 60, h: 60, rot: 9.39, phase: 1.2, speed: 18 },
			obj('stamp', 372, 36, 84, 12, 2.2, 13),
			obj('plane', 780, 318, 96, -10, 0.7, 20),
			obj('key', 706, 14, 86, 24, 3.5, 15),
			obj('at', 1168, 300, 80, -6, 4.8, 12),
			obj('check', 250, 18, 66, 8, 1.4, 17)
		]
	};

	const MOBILE: Layout = {
		w: 390,
		h: 320,
		sprites: [
			env(40, -20, 190, 248, 44.15, 0.4, 20),
			env(190, 170, 150, 150, -4.1, 1.9, 14),
			env(235, 10, 120, 156, -8.69, 4.4, 22),
			env(100, 230, 76, 76, -30.58, 3.1, 10),
			env(322, 20, 64, 64, -6.67, 5.2, 14),
			{ kind: 'face', x: 24, y: 252, w: 56, h: 56, rot: 9.39, phase: 1.2, speed: 18 },
			obj('plane', 16, 120, 64, -14, 0.7, 16),
			obj('stamp', 296, 232, 58, 12, 2.2, 13),
			obj('check', 330, 120, 46, 8, 1.4, 17)
		]
	};

	// ink, deep crimson, crimson, hot rose, rose, blush, paper
	const PALETTE: [number, number, number][] = [
		[35, 2, 11],
		[120, 8, 40],
		[200, 14, 66],
		[236, 16, 75],
		[244, 126, 156],
		[250, 206, 218],
		[247, 241, 243]
	];
	const THRESHOLDS = [0.1, 0.22, 0.34, 0.5, 0.68, 0.84];
	const SPREAD = 0.1;

	const BAYER = [
		0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60,
		28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15,
		47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21
	];

	let wrapper: HTMLElement | undefined = $state();
	let canvas: HTMLCanvasElement | undefined = $state();
	let faceCanvas: HTMLCanvasElement | undefined = $state();
	let isOverEnvelope = $state(false);

	const SPRITE_SRC: Record<Exclude<Kind, 'face'>, string> = {
		envelope: '/hero/envelope.png',
		plane: '/hero/sprites/paper-plane.png',
		at: '/hero/sprites/at-sign.png',
		stamp: '/hero/sprites/stamp.png',
		key: '/hero/sprites/key.png',
		check: '/hero/sprites/check.png'
	};

	onMount(() => {
		if (!wrapper || !canvas || !faceCanvas) return;
		const host = wrapper;
		const target = canvas;
		const ctx = target.getContext('2d');
		const off = document.createElement('canvas');
		const octx = off.getContext('2d', { willReadFrequently: true });
		if (!ctx || !octx) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const start = performance.now();

		const faceImg = new Image();
		const openImg = new Image();
		const spriteImgs = {} as Record<Exclude<Kind, 'face'>, HTMLImageElement>;
		const onLoad = () => {
			if (reducedMotion) render(performance.now());
		};
		faceImg.onload = onLoad;
		openImg.onload = onLoad;
		faceImg.src = '/hero/designer.png';
		openImg.src = '/hero/sprites/envelope-open.png';
		for (const key of Object.keys(SPRITE_SRC) as Exclude<Kind, 'face'>[]) {
			const img = new Image();
			img.onload = onLoad;
			img.src = SPRITE_SRC[key];
			spriteImgs[key] = img;
		}
		// view transform of the last drawn frame, for hit-testing clicks
		let viewScale = 1;
		let viewOx = 0;
		let viewOy = 0;

		let cols = 0;
		let rows = 0;
		let layout = DESKTOP;
		let trail = new Float32Array(0);
		let trailNext = new Float32Array(0);
		let stampR = 12;
		let out: ImageData | null = null;
		let raf = 0;
		let last: { x: number; y: number } | null = null;

		function resize() {
			const w = host.clientWidth;
			const h = host.clientHeight;
			layout = w < 768 ? MOBILE : DESKTOP;
			const size = w < 768 ? cellMobile : cell;
			cols = Math.max(40, Math.floor(w / size));
			rows = Math.max(24, Math.floor(h / size));
			off.width = cols;
			off.height = rows;
			target.width = cols;
			target.height = rows;
			trail = new Float32Array(cols * rows);
			trailNext = new Float32Array(cols * rows);
			stampR = Math.max(6, Math.round(54 / size));
			out = ctx!.createImageData(cols, rows);
		}

		// Paper rotates around the top-left corner; recover the centre
		function spriteCenter(s: Sprite, t: number) {
			const bob = reducedMotion || s.speed === 0 ? 0 : Math.sin(t * 0.7 + s.phase * 1.3) * 5;
			const rad = (s.rot * Math.PI) / 180;
			const cx = s.x + (s.w / 2) * Math.cos(rad) - (s.h / 2) * Math.sin(rad);
			let cy = s.y + (s.w / 2) * Math.sin(rad) + (s.h / 2) * Math.cos(rad) + bob;
			if (s.speed > 0 && !reducedMotion) cy = wrapY(cy, s, t);
			return { cx, cy, rad };
		}

		function drawSprite(s: Sprite, t: number, scale: number, ox: number, oy: number) {
			const isOpen = s.kind === 'envelope' && (s.openUntil ?? 0) > t;
			const img = s.kind === 'face' ? faceImg : isOpen ? openImg : spriteImgs[s.kind];
			if (!img.complete || !img.naturalWidth) return;
			const sway = reducedMotion ? 0 : Math.sin(t * 0.5 + s.phase) * 0.05;
			const { cx, cy, rad } = spriteCenter(s, t);
			const w = s.w * scale;
			const h = s.h * scale;
			// a small pop as the flap lifts, then it settles back to normal size
			const pop = isOpen ? 1 + 0.08 * Math.sin(Math.min(1, (t - (s.openAt ?? 0)) / 0.5) * Math.PI) : 1;
			octx!.save();
			octx!.translate(ox + cx * scale, oy + cy * scale);
			octx!.rotate(rad + sway);
			octx!.scale(pop, pop);
			if (isOpen) {
				// the open envelope fills its square, so shrink it to match the closed one
				const side = Math.max(w, h) * 0.84;
				octx!.drawImage(img, -side / 2, -side / 2, side, side);
			} else {
				// background-size: cover, centred
				const ratio = w / h;
				const sw = ratio >= 1 ? img.naturalWidth : img.naturalHeight * ratio;
				const sh = ratio >= 1 ? img.naturalWidth / ratio : img.naturalHeight;
				octx!.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, -w / 2, -h / 2, w, h);
			}
			octx!.restore();
		}

		function envelopeAt(clientX: number, clientY: number): Sprite | undefined {
			const rect = host.getBoundingClientRect();
			const lx = (((clientX - rect.left) / rect.width) * cols - viewOx) / viewScale;
			const ly = (((clientY - rect.top) / rect.height) * rows - viewOy) / viewScale;
			const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
			const sprites = layout.sprites;
			for (let i = sprites.length - 1; i >= 0; i--) {
				const s = sprites[i];
				if (s.kind !== 'envelope') continue;
				const { cx, cy, rad } = spriteCenter(s, t);
				const a = rad + Math.sin(t * 0.5 + s.phase) * 0.05;
				const dx = lx - cx;
				const dy = ly - cy;
				const x = dx * Math.cos(-a) - dy * Math.sin(-a);
				const y = dx * Math.sin(-a) + dy * Math.cos(-a);
				const base = Math.max(s.w, s.h);
				const hw = Math.min(base * 0.74, s.w) / 2;
				const hh = (base * 0.55) / 2;
				if (Math.abs(x) <= hw && Math.abs(y) <= hh) return s;
			}
			return undefined;
		}

		// The face sits on its own full-resolution canvas so it stays crisp.
		function drawFace(t: number, scale: number, ox: number, oy: number) {
			const fctx = faceCanvas!.getContext('2d');
			const face = layout.sprites.find((s) => s.kind === 'face');
			if (!fctx || !face || !faceImg.complete || !faceImg.naturalWidth) return;
			const px = host.clientWidth / cols;
			const dpr = window.devicePixelRatio || 1;
			if (faceCanvas!.width !== Math.round(host.clientWidth * dpr)) {
				faceCanvas!.width = Math.round(host.clientWidth * dpr);
				faceCanvas!.height = Math.round(host.clientHeight * dpr);
			}
			fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			fctx.clearRect(0, 0, host.clientWidth, host.clientHeight);
			const sway = reducedMotion ? 0 : Math.sin(t * 0.9 + face.phase) * 0.12;
			const rad = (face.rot * Math.PI) / 180;
			const cx = face.x + (face.w / 2) * Math.cos(rad) - (face.h / 2) * Math.sin(rad);
			let cy = face.y + (face.w / 2) * Math.sin(rad) + (face.h / 2) * Math.cos(rad);
			if (!reducedMotion) cy = wrapY(cy, face, t);
			const w = face.w * scale * px;
			fctx.save();
			fctx.translate((ox + cx * scale) * px, (oy + cy * scale) * px);
			fctx.rotate(rad + sway);
			fctx.drawImage(faceImg, -w / 2, -w / 2, w, w);
			fctx.restore();
		}

		// fly upward and re-enter from below once fully off the top
		function wrapY(cy: number, s: Sprite, t: number) {
			const margin = Math.max(s.w, s.h) * 0.8;
			const travel = layout.h + margin * 2;
			return ((((cy + margin - t * s.speed * 2.5) % travel) + travel) % travel) - margin;
		}

		function drawScene(t: number) {
			octx!.fillStyle = 'rgb(35,2,11)';
			octx!.fillRect(0, 0, cols, rows);
			// cover-fit the reference layout into the canvas, centred
			const scale = Math.max(cols / layout.w, rows / layout.h);
			const ox = (cols - layout.w * scale) / 2;
			const oy = (rows - layout.h * scale) / 2;
			viewScale = scale;
			viewOx = ox;
			viewOy = oy;
			for (const s of layout.sprites) if (s.kind !== 'face') drawSprite(s, t, scale, ox, oy);
			drawFace(t, scale, ox, oy);
		}

		function diffuse() {
			const w = cols;
			const h = rows;
			for (let y = 0; y < h; y++) {
				const up = (y > 0 ? y - 1 : y) * w;
				const dn = (y < h - 1 ? y + 1 : y) * w;
				for (let x = 0; x < w; x++) {
					const i = y * w + x;
					const n =
						trail[up + x] + trail[dn + x] + trail[i - (x > 0 ? 1 : 0)] + trail[i + (x < w - 1 ? 1 : 0)];
					const v = (trail[i] * 0.64 + n * 0.09) * 0.985;
					trailNext[i] = v < 0.003 ? 0 : v;
				}
			}
			const tmp = trail;
			trail = trailNext;
			trailNext = tmp;
		}

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

		function render(now: number) {
			const t = reducedMotion ? 0 : (now - start) / 1000;
			drawScene(t);
			if (!reducedMotion) diffuse();
			const src = octx!.getImageData(0, 0, cols, rows).data;
			const dst = out!.data;
			for (let y = 0; y < rows; y++) {
				const by = (y & 7) * 8;
				for (let x = 0; x < cols; x++) {
					const i = y * cols + x;
					const p = i * 4;
					if (!dither) {
						dst[p] = src[p];
						dst[p + 1] = src[p + 1];
						dst[p + 2] = src[p + 2];
						dst[p + 3] = 255;
						continue;
					}
					let lum = (src[p] * 0.299 + src[p + 1] * 0.587 + src[p + 2] * 0.114) / 255;
					const trailV = trail[i];
					if (trailV > 0.02) {
						// pull dark ground toward crimson where the pointer passed
						const k = Math.min(1, trailV * 1.15);
						lum = lum * (1 - k) + 0.45 * k;
					}
					const threshold = (BAYER[by + (x & 7)] + 0.5) / 64;
					const v = lum + (threshold - 0.5) * SPREAD;
					let level = 0;
					while (level < THRESHOLDS.length && v > THRESHOLDS[level]) level++;
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
			if (reducedMotion) {
				render(performance.now());
			} else {
				isOverEnvelope = !!envelopeAt(ev.clientX, ev.clientY);
			}
		}

		function onPointerLeave() {
			last = null;
			isOverEnvelope = false;
		}

		// A tap or click on an envelope lifts its flap for a couple of seconds
		let down: { x: number; y: number; at: number } | null = null;

		function onPointerDown(ev: PointerEvent) {
			down = { x: ev.clientX, y: ev.clientY, at: performance.now() };
		}

		function onPointerUp(ev: PointerEvent) {
			const d = down;
			down = null;
			if (!d || reducedMotion) return;
			if (Math.hypot(ev.clientX - d.x, ev.clientY - d.y) > 8 || performance.now() - d.at > 500) return;
			const hit = envelopeAt(ev.clientX, ev.clientY);
			if (!hit) return;
			const t = (performance.now() - start) / 1000;
			hit.openAt = t;
			hit.openUntil = t + 2.2;
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
		host.addEventListener('pointerdown', onPointerDown);
		host.addEventListener('pointerup', onPointerUp);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			host.removeEventListener('pointermove', onPointerMove);
			host.removeEventListener('pointerleave', onPointerLeave);
			host.removeEventListener('pointerdown', onPointerDown);
			host.removeEventListener('pointerup', onPointerUp);
		};
	});
</script>

<div
	bind:this={wrapper}
	class="relative h-[320px] w-full overflow-hidden bg-[#23020B] md:h-[430px] {isOverEnvelope ? 'cursor-pointer' : ''}"
	aria-hidden="true"
>
	<canvas
		bind:this={canvas}
		class="absolute inset-0 h-full w-full"
		style="image-rendering: pixelated;"
	></canvas>
	<canvas bind:this={faceCanvas} class="pointer-events-none absolute inset-0 h-full w-full"></canvas>
</div>
