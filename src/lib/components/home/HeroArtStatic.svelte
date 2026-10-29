<script lang="ts">
	import { designCenter, heroGrid, heroLayouts, heroStill, type HeroLayout } from '$lib/hero/envelopeField';

	/*
	 * The homepage hero's envelope field as still images. tools/dither/bake-hero.mjs
	 * dithers the composition in envelopeField.ts offline into one pixel per cell,
	 * and the page scales it up with image-rendering: pixelated, so the hero costs
	 * a few KB and no script or animation frames. The stage is the reference layout
	 * cover-fitted into the box, centred, the same framing EnvelopeDither's canvas
	 * uses, so crops match at every width. The face stays a full-resolution image.
	 */

	const desktopGrid = heroGrid(heroLayouts.desktop);
	const mobileGrid = heroGrid(heroLayouts.mobile);

	// The face's centre, width and tilt as fractions of the stage, per breakpoint
	function faceVars(layout: HeroLayout, suffix: string): string[] {
		const face = layout.sprites.find((s) => s.kind === 'face');
		if (!face) return [];
		const { cx, cy } = designCenter(face);
		const pct = (v: number) => `${(v * 100).toFixed(3)}%`;
		return [
			`--face-x${suffix}:${pct(cx / layout.w)}`,
			`--face-y${suffix}:${pct(cy / layout.h)}`,
			`--face-w${suffix}:${pct(face.w / layout.w)}`,
			`--face-r${suffix}:${face.rot}deg`
		];
	}

	const faceStyle = [...faceVars(heroLayouts.mobile, ''), ...faceVars(heroLayouts.desktop, '-md')].join(';');
</script>

<!-- Ragged edge that lets the dark band bleed up into the page (DitherEdge's wave, baked) -->
<div class="pointer-events-none absolute inset-x-0 -top-6 h-6 overflow-hidden" aria-hidden="true">
	<img src={heroStill.edge} alt="" width="256" height="4" decoding="async" class="h-6 w-[1536px] max-w-none [image-rendering:pixelated]" />
</div>

<div class="relative h-[320px] w-full overflow-hidden bg-plum md:h-[430px]" aria-hidden="true">
	<div class="absolute top-1/2 left-1/2 aspect-[390/320] w-[max(390px,100%)] -translate-x-1/2 -translate-y-1/2 md:aspect-[1280/430] md:w-[max(1280px,100%)]">
		<picture>
			<source media="(min-width: 48rem)" srcset={heroStill.field.desktop} width={desktopGrid.cols} height={desktopGrid.rows} />
			<img
				src={heroStill.field.mobile}
				alt=""
				width={mobileGrid.cols}
				height={mobileGrid.rows}
				decoding="async"
				class="absolute inset-0 size-full [image-rendering:pixelated]"
			/>
		</picture>
		<img
			src={heroStill.face}
			alt=""
			width="250"
			height="250"
			decoding="async"
			style={faceStyle}
			class="absolute top-(--face-y) left-(--face-x) aspect-square w-(--face-w) -translate-x-1/2 -translate-y-1/2 rotate-(--face-r) md:top-(--face-y-md) md:left-(--face-x-md) md:w-(--face-w-md) md:rotate-(--face-r-md)"
		/>
	</div>
</div>
