<script lang="ts">
	import { onMount } from 'svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	/*
	 * Live counter: the number is a placeholder until it is wired to a real
	 * endpoint (status page or a cached aggregate). It ticks up slowly so the
	 * strip reads as live rather than static.
	 */
	const BASE_COUNT = 1_284_392;
	const PER_SECOND = 2.4;

	let section: HTMLElement | undefined = $state();
	let count = $state(BASE_COUNT);

	const stats = [
		{ value: '40,000+', label: 'companies build email in the Topol editor that ships inside Lettr' },
		{ value: '12,000+', label: 'organisations send through the same infrastructure via Ecomail' },
		{ value: '12 years', label: 'of running email infrastructure, since 2014' },
		{ value: 'EU', label: 'hosted on every plan, GDPR and CCPA compliant by default' }
	];

	const group = [
		{ name: 'Topol', src: '/images/logos/topol-icon.svg' },
		{ name: 'Ecomail', src: '/images/logos/ecomail-icon.svg' },
		{ name: 'DMARCeye', src: '/images/logos/dmarceye-icon.svg' }
	];

	const formatter = new Intl.NumberFormat('en-US');

	onMount(() => {
		if (!section) return;
		const started = performance.now();
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let raf = 0;
		const tick = (now: number) => {
			count = BASE_COUNT + Math.floor(((now - started) / 1000) * PER_SECOND);
			raf = requestAnimationFrame(tick);
		};
		if (!reduced) raf = requestAnimationFrame(tick);
		const cleanup = createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
		return () => {
			cancelAnimationFrame(raf);
			cleanup();
		};
	});
</script>

<section bind:this={section} class="border-b border-border/30 py-10">
	<div class="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] md:gap-14">
		<div data-reveal class="flex flex-col justify-center border-border/30 md:border-r md:pr-10">
			<div class="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-surface">
				<span class="relative block h-2 w-2 bg-primary">
					<span class="absolute inset-0 animate-ping bg-primary/60"></span>
				</span>
				Live
			</div>
			<p class="font-heading text-[2.25rem] leading-none tracking-[-0.02em] text-surface tabular-nums sm:text-[2.75rem]">
				{formatter.format(count)}
			</p>
			<p class="mt-2 text-sm text-muted">emails delivered in the last 7 days</p>
		</div>

		<div class="grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
			{#each stats as stat}
				<div data-reveal>
					<p class="font-heading text-2xl leading-none tracking-[-0.01em] text-surface">{stat.value}</p>
					<p class="mt-2 text-sm leading-snug text-muted">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>

	<div data-reveal class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/30 pt-6 text-sm text-muted">
		<span>
			Part of the <a href="https://biggood.io/" target="_blank" rel="noopener noreferrer" class="font-semibold text-surface transition-colors hover:text-primary">Big Good</a> group
		</span>
		<div class="flex items-center gap-8">
			{#each group as company}
				<span class="inline-flex items-center gap-2 text-surface">
					<img src={company.src} alt="" class="h-4 w-4" />
					<span class="text-sm font-medium">{company.name}</span>
				</span>
			{/each}
		</div>
	</div>
</section>
