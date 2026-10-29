<script lang="ts">
	import {
		artAlt,
		artLayouts,
		artPaths,
		groundColor,
		keyAxis,
		objectMotion,
		objectPivots,
		objectSprinkles,
		sprinkleColors,
		spritePoint,
		sweepFrames,
		sweepPaths,
		type PostArt
	} from '$lib/blog/art';

	type Variant = 'cover' | 'square' | 'thumb' | 'strip';

	interface Props {
		slug: string;
		category: string;
		art: PostArt;
		variant: Variant;
		/** Next to a visible title the art is decoration; give it an empty alt there. */
		decorative?: boolean;
		loading?: 'lazy' | 'eager';
		class?: string;
	}

	let { slug, category, art, variant, decorative = false, loading = 'lazy', class: className = '' }: Props = $props();

	const SPRINKLES = 12;

	const layout = $derived(artLayouts[variant]);
	const motion = $derived(objectMotion[art.object]);
	const sweep = $derived(motion === 'sweep' && variant !== 'strip' ? sweepPaths(slug)[variant] : undefined);
	const pivot = $derived.by(() => {
		const point = objectPivots[art.object];
		return point ? spritePoint(art, variant, point) : { left: 50, top: 50 };
	});

	// A burst of single-colour pixel squares, two cells wide, thrown from a point
	// on the object. Directions and distances are fixed per index, so a card
	// sprinkles the same way every time.
	const sprinkles = $derived.by(() => {
		const source = variant === 'strip' ? undefined : objectSprinkles[art.object];
		if (!source) return undefined;
		const origin = spritePoint(art, variant, source);
		const objectWidth = ((layout.rows * layout.scale) / layout.cols) * 100;
		const [light, mid] = sprinkleColors(category, art);
		const centre = (source.angle ?? 0) + art.rotate;
		const arc = source.arc ?? 360;
		const pieces = Array.from({ length: SPRINKLES }, (_, i) => {
			const step = arc === 360 ? i / SPRINKLES : i / (SPRINKLES - 1) - 0.5;
			const wobble = ((i * 37) % 11) / 11 - 0.5;
			const angle = ((centre + step * arc + wobble * 18) * Math.PI) / 180;
			const reach = objectWidth * (0.22 + (((i * 53) % 7) / 7) * 0.2);
			return {
				dx: Math.cos(angle) * reach,
				dy: Math.sin(angle) * reach,
				// A small stagger (0-40ms) so the burst looks thrown, not stamped.
				delay: ((i * 29) % 5) * 10,
				color: i % 3 === 0 ? mid : light
			};
		});
		return { origin, pieces };
	});
</script>

<!--
	The ground is painted here and the object is a transparent layer on top, so
	hovering the card (or the art itself) moves the object over a still ground.
	The motions live in app.css under .art-<motion>.
-->
<span
	class="art art-{motion} relative block overflow-hidden {className}"
	style:aspect-ratio="{layout.cols} / {layout.rows}"
	style:background-color={groundColor(category, art)}
	style:--art-frames={sweepFrames}
	style:--art-cell="calc(100cqw / {layout.cols})"
	style:--art-level="{-(keyAxis + art.rotate)}deg"
	style:--art-pivot="{pivot.left}% {pivot.top}%"
>
	<img
		src={artPaths(slug)[variant]}
		alt={decorative ? '' : artAlt(art)}
		width={layout.cols}
		height={layout.rows}
		{loading}
		decoding="async"
		class="art-object absolute inset-0 block size-full [image-rendering:pixelated]"
	/>
	{#if sweep}
		<span
			aria-hidden="true"
			class="art-frames absolute inset-0 [image-rendering:pixelated]"
			style:background-image="url({sweep})"
		></span>
	{/if}
	{#if sprinkles}
		<span aria-hidden="true" class="art-sprinkles" style:left="{sprinkles.origin.left}%" style:top="{sprinkles.origin.top}%">
			{#each sprinkles.pieces as piece, index (index)}
				<span
					class="art-sprinkle"
					style:--dx="{piece.dx}cqw"
					style:--dy="{piece.dy}cqw"
					style:--delay="{piece.delay}ms"
					style:background-color={piece.color}
				></span>
			{/each}
		</span>
	{/if}
</span>
