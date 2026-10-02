<script lang="ts">
	import DitherEdge from './DitherEdge.svelte';

	const text = 'Nobody files a ticket to change a button color.';
	// Two identical halves; the track slides by exactly one half so the loop is seamless
	const halves = [0, 1];
</script>

<style>
	@keyframes marquee-slide {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	.marquee-track {
		animation: marquee-slide 17s linear infinite;
		will-change: transform;
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}
	}
</style>

<section class="relative -mx-6 flex h-[170px] items-center overflow-hidden bg-primary-soft md:h-[220px]" aria-label={text}>
	<div class="marquee-track flex w-max" aria-hidden="true">
		{#each halves as half (half)}
			<p
				class="m-0 shrink-0 pr-[0.6em] pb-1 font-code text-[3rem] leading-none tracking-[-0.09em] whitespace-nowrap text-primary-outline md:text-[5rem]"
			>
				{text}
			</p>
		{/each}
	</div>

	<!-- Flames lick up over the lower part of the text -->
	<div class="absolute inset-x-0 bottom-0 md:hidden">
		<DitherEdge mode="fire" color="#ec104b" placement="inside" height={66} cell={6} />
	</div>
	<div class="absolute inset-x-0 bottom-0 hidden md:block">
		<DitherEdge mode="fire" color="#ec104b" placement="inside" height={96} cell={6} />
	</div>
</section>
