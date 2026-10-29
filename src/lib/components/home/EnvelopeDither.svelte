<script lang="ts">
	import { onMount } from 'svelte';
	import {
		bayer8 as BAYER,
		designCenter,
		heroFaceSource,
		heroLayouts,
		heroPalette as PALETTE,
		heroSpread as SPREAD,
		heroSpriteSources as SPRITE_SRC,
		heroThresholds as THRESHOLDS,
		type HeroLayout as Layout,
		type HeroSprite as Sprite,
		type HeroSpriteKind as Kind
	} from '$lib/hero/envelopeField';

	/*
	 * Envelope field from the 2026 homepage design: flat envelope illustrations
	 * floating on an ink background, composed on a low-resolution canvas and
	 * ordered-dithered (Bayer 8x8) into the brand palette, then scaled up with
	 * image-rendering: pixelated. The pointer leaves a faint, quickly fading flicker of specks,
	 * same as DitherHero. The homepage shows HeroArtStatic, the same field baked into
	 * still images, and HomeHero loads this live version over it only on desktops with
	 * a mouse. It fades in once its sprites are in, draws ~30 frames a second, pauses
	 * off screen, and calls `onfail` if the first frames cost too much.
	 *
	 * Besides envelopes and the @ the field carries a few of the blog art's clay
	 * sprites (tools/blog-images/sprites/), shrunk to 256px WebP and dimmed to 80%
	 * in static/hero/objects/ so they dither to primary rather than rose: stamp,
	 * megaphone, bell, mailbox. Everything just drifts upward;
	 * clicking an envelope lifts its flap for a moment.
	 */

	interface Props {
		/** Pixel size of one dither cell on desktop. */
		cell?: number;
		/** Cell size under 768px wide. */
		cellMobile?: number;
		/** Turn the dither off to see the raw composition. */
		dither?: boolean;
		/** Called when a sprite fails to load or frames cost more than the budget; unmount and keep the still. */
		onfail?: () => void;
	}

	let {
		cell = heroLayouts.desktop.cell,
		cellMobile = heroLayouts.mobile.cell,
		dither = true,
		onfail
	}: Props = $props();

	// Clicks mark envelopes open, so each mount works on its own copy of the layouts
	const copy = (layout: Layout): Layout => ({ ...layout, sprites: layout.sprites.map((s) => ({ ...s })) });
	const DESKTOP = copy(heroLayouts.desktop);
	const MOBILE = copy(heroLayouts.mobile);

	/** Peak brightness the pointer trail lifts the dark ground to: just enough to flicker a few cells. */
	const TINGLE = 0.085;

	let wrapper: HTMLElement | undefined = $state();
	let canvas: HTMLCanvasElement | undefined = $state();
	let faceCanvas: HTMLCanvasElement | undefined = $state();
	let isOverEnvelope = $state(false);
	let isReady = $state(false);

	onMount(() => {
		if (!wrapper || !canvas || !faceCanvas) return;
		const host = wrapper;
		const target = canvas;
		const ctx = target.getContext('2d');
		const off = document.createElement('canvas');
		const octx = off.getContext('2d', { willReadFrequently: true });
		if (!ctx || !octx) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let start = performance.now();

		// The drift is slow, so ~30 redraws a second look the same as one per display frame.
		// The slack keeps a 60 Hz screen on every second frame despite timing jitter.
		const minFrameGap = 1000 / 30 - 4;
		// Average main-thread ms per frame, over the first frames, above which the device
		// is too slow for the live field and the still underneath is kept instead.
		const frameBudget = 8;
		const budgetFrames = 60;
		let lastDraw = -Infinity;
		let measured = 0;
		let workMs = 0;

		const faceImg = new Image();
		const openImg = new Image();
		const spriteImgs = {} as Record<Exclude<Kind, 'face'>, HTMLImageElement>;
		// Stay invisible until every sprite is in, then restart the clock so the first visible
		// frame is the designed layout, the same frame as the still it fades in over.
		let pending = 2 + Object.keys(SPRITE_SRC).length;
		const onLoad = () => {
			if (--pending > 0) return;
			start = performance.now();
			isReady = true;
			render(start);
			sync();
		};
		const onError = () => onfail?.();
		for (const img of [faceImg, openImg]) {
			img.onload = onLoad;
			img.onerror = onError;
		}
		faceImg.src = heroFaceSource;
		openImg.src = '/hero/sprites/envelope-open.png';
		for (const key of Object.keys(SPRITE_SRC) as Exclude<Kind, 'face'>[]) {
			const img = new Image();
			img.onload = onLoad;
			img.onerror = onError;
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
		/** Whether any cell of the pointer trail is still lit; diffusion is skipped otherwise. */
		let trailLive = false;
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
			stampR = Math.max(3, Math.round(22 / size));
			out = ctx!.createImageData(cols, rows);
		}

		// The designed centre, bobbing and drifting upward over time
		function spriteCenter(s: Sprite, t: number) {
			const bob = reducedMotion || s.speed === 0 ? 0 : Math.sin(t * 0.7 + s.phase * 1.3) * 5;
			const { cx, cy: rest, rad } = designCenter(s);
			let cy = rest + bob;
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
			const { cx, cy: rest, rad } = designCenter(face);
			const cy = reducedMotion ? rest : wrapY(rest, face, t);
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
			let lit = false;
			for (let y = 0; y < h; y++) {
				const up = (y > 0 ? y - 1 : y) * w;
				const dn = (y < h - 1 ? y + 1 : y) * w;
				for (let x = 0; x < w; x++) {
					const i = y * w + x;
					const n =
						trail[up + x] + trail[dn + x] + trail[i - (x > 0 ? 1 : 0)] + trail[i + (x < w - 1 ? 1 : 0)];
					const v = (trail[i] * 0.5 + n * 0.07) * 0.94;
					trailNext[i] = v < 0.003 ? 0 : v;
					if (v >= 0.003) lit = true;
				}
			}
			trailLive = lit;
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
					trailLive = true;
				}
			}
		}

		function render(now: number) {
			if (running && now - lastDraw < minFrameGap) {
				raf = requestAnimationFrame(render);
				return;
			}
			lastDraw = now;
			const began = performance.now();
			const t = reducedMotion ? 0 : (now - start) / 1000;
			drawScene(t);
			if (!reducedMotion && trailLive) diffuse();
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
						// a few faint specks on the dark ground where the pointer passed
						if (lum < TINGLE) lum += (TINGLE - lum) * Math.min(1, trailV * 1.2);
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
			if (running && measured < budgetFrames) {
				workMs += performance.now() - began;
				if (++measured === budgetFrames && workMs / measured > frameBudget) {
					running = false;
					raf = 0;
					onfail?.();
					return;
				}
			}
			raf = running ? requestAnimationFrame(render) : 0;
		}

		// Animate only once ready, while the field is on screen and the tab is visible.
		let visible = false;
		let running = false;
		function sync() {
			const next = isReady && !reducedMotion && visible && !document.hidden;
			if (next === running) return;
			running = next;
			if (running) raf = requestAnimationFrame(render);
			else cancelAnimationFrame(raf);
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
			if (!running) render(performance.now());
		});
		ro.observe(host);
		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			sync();
		});
		io.observe(host);
		document.addEventListener('visibilitychange', sync);
		host.addEventListener('pointermove', onPointerMove, { passive: true });
		host.addEventListener('pointerleave', onPointerLeave);
		host.addEventListener('pointerdown', onPointerDown);
		host.addEventListener('pointerup', onPointerUp);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
			document.removeEventListener('visibilitychange', sync);
			host.removeEventListener('pointermove', onPointerMove);
			host.removeEventListener('pointerleave', onPointerLeave);
			host.removeEventListener('pointerdown', onPointerDown);
			host.removeEventListener('pointerup', onPointerUp);
		};
	});
</script>

<div
	bind:this={wrapper}
	class="relative h-[320px] w-full overflow-hidden bg-[#23020B] transition-opacity duration-700 md:h-[430px] {isReady
		? 'opacity-100'
		: 'opacity-0'} {isOverEnvelope ? 'cursor-pointer' : ''}"
	aria-hidden="true"
>
	<canvas
		bind:this={canvas}
		class="absolute inset-0 h-full w-full"
		style="image-rendering: pixelated;"
	></canvas>
	<canvas bind:this={faceCanvas} class="pointer-events-none absolute inset-0 h-full w-full"></canvas>
</div>
