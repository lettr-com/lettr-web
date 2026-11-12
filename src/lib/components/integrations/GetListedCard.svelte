<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import Button from '$lib/components/Button.svelte';
	import { objectSprinkles } from '$lib/blog/art';
	import { LISTING_EMAIL } from '$lib/integrations';

	const steps = [
		'Send us the link to your live public listing.',
		'We check it describes Lettr correctly.',
		'Your connector gets a card and a page here.'
	];

	// The plug's render (tools/blog-images/integrations.mjs): 96 cells, object at 92% scale, tilted -14°.
	const PLUG = { cells: 96, scale: 0.92, rotate: -14 };
	const SPRINKLES = 12;
	// Light and mid steps of the plug's crimson ramp, as the blog's art throws on a dark ground.
	const sprinkleColors = ['#fde7ed', '#f9b7c9'];

	// The blog's spark hover (ArtImage.svelte): a burst of pixel squares thrown from the prongs,
	// with the same directions, reach and stagger, placed for this render.
	const sparks = (() => {
		const source = objectSprinkles.plug!;
		const size = PLUG.cells * PLUG.scale;
		const dx = (source.x - 0.5) * size;
		const dy = (source.y - 0.5) * size;
		const tilt = (PLUG.rotate * Math.PI) / 180;
		const origin = {
			left: ((PLUG.cells / 2 + dx * Math.cos(tilt) - dy * Math.sin(tilt)) / PLUG.cells) * 100,
			top: ((PLUG.cells / 2 + dx * Math.sin(tilt) + dy * Math.cos(tilt)) / PLUG.cells) * 100
		};
		const objectWidth = PLUG.scale * 100;
		const centre = (source.angle ?? 0) + PLUG.rotate;
		const arc = source.arc ?? 360;
		const pieces = Array.from({ length: SPRINKLES }, (_, i) => {
			const step = arc === 360 ? i / SPRINKLES : i / (SPRINKLES - 1) - 0.5;
			const wobble = ((i * 37) % 11) / 11 - 0.5;
			const angle = ((centre + step * arc + wobble * 18) * Math.PI) / 180;
			const reach = objectWidth * (0.22 + (((i * 53) % 7) / 7) * 0.2);
			return {
				dx: Math.cos(angle) * reach,
				dy: Math.sin(angle) * reach,
				delay: ((i * 29) % 5) * 10,
				color: sprinkleColors[i % 3 === 0 ? 1 : 0]
			};
		});
		return { origin, pieces };
	})();
</script>

<!-- The card system's big integrated card on plum: the ask on the left, the listing a partner gets on the right. -->
<div class="relative grid overflow-hidden bg-plum text-white lg:grid-cols-[minmax(0,1fr)_440px]">
	<div class="relative z-10 flex flex-col p-8 md:p-12 lg:p-16">
		<h2 id="get-listed-heading" class="type-h2 text-balance text-white">
			Built a Lettr connector?
			<span class="type-accent block text-primary-outline">Get listed.</span>
		</h2>
		<p class="mt-6 max-w-[44ch] type-lead text-pretty text-white/80">
			Connectors built by partners get their own page here, labelled with who built them.
		</p>

		<ol class="mt-10 grid border-t border-white/15 sm:grid-cols-3">
			{#each steps as step, index (step)}
				<li class="flex gap-3 border-b border-white/15 py-4 text-body-sm text-white/80 sm:flex-col sm:gap-2 sm:border-b-0 sm:pr-6">
					<span class="font-code text-caption text-primary-outline">0{index + 1}</span>
					{step}
				</li>
			{/each}
		</ol>

		<div class="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
			<Button size="lg" href="mailto:{LISTING_EMAIL}">
				Email {LISTING_EMAIL}
				<ArrowRightIcon aria-hidden="true" />
			</Button>
			<p class="max-w-[28ch] text-body-sm text-pretty text-white/70">
				Found an error? Tell us.
			</p>
		</div>
	</div>

	<div class="flex items-center justify-center px-8 pb-12 lg:p-12" aria-hidden="true" data-markdown="skip">
		<!-- the blog's art hover: .art-spark pushes the plug home, .art-sprinkle throws the sparks (app.css) -->
		<span
			class="art art-spark relative block aspect-square w-[240px] md:w-[320px] lg:w-[384px]"
			style:--art-cell="calc(100cqw / {PLUG.cells})"
		>
			<img
				src="/integrations/plug.png"
				alt=""
				width="96"
				height="96"
				loading="lazy"
				decoding="async"
				class="art-object absolute inset-0 block size-full [image-rendering:pixelated]"
			/>
			<span class="art-sprinkles" style:left="{sparks.origin.left}%" style:top="{sparks.origin.top}%">
				{#each sparks.pieces as piece, index (index)}
					<span
						class="art-sprinkle"
						style:--dx="{piece.dx}cqw"
						style:--dy="{piece.dy}cqw"
						style:--delay="{piece.delay}ms"
						style:background-color={piece.color}
					></span>
				{/each}
			</span>
		</span>
	</div>
</div>
