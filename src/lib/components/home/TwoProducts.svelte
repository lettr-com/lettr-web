<script lang="ts">
	import { onMount } from 'svelte';
	import AnimatedInstallTerminal from './AnimatedInstallTerminal.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();
	let activeMode: 'devs' | 'teams' = $state('devs');
	let progress = $state(0);
	let isVisible = false;
	let isPaused = false;
	let isAutoPlaying = $state(false);

	function selectMode(mode: 'devs' | 'teams') {
		activeMode = mode;
		progress = 0;
	}

	onMount(() => {
		if (!section) return;
		const cleanupReveal = createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return cleanupReveal;

		isAutoPlaying = true;
		let frame: number;
		let previousTime = 0;
		const observer = new IntersectionObserver(([entry]) => {
			isVisible = entry.isIntersecting;
			if (!isVisible) previousTime = 0;
		}, { threshold: 0.35 });
		observer.observe(section);

		function tick(time: number) {
			const elapsed = previousTime ? time - previousTime : 0;
			previousTime = time;
			if (isVisible && !isPaused && document.visibilityState === 'visible') {
				progress = Math.min(1, progress + elapsed / 10000);
				if (progress >= 1) selectMode(activeMode === 'devs' ? 'teams' : 'devs');
			}
			frame = window.requestAnimationFrame(tick);
		}
		frame = window.requestAnimationFrame(tick);

		return () => {
			window.cancelAnimationFrame(frame);
			observer.disconnect();
			cleanupReveal();
		};
	});
</script>

<section
	bind:this={section}
	aria-labelledby="two-products-heading"
	onfocusin={(event) => (isPaused = (event.target as HTMLElement).matches(':focus-visible'))}
	onfocusout={() => (isPaused = false)}
	class="border-b border-border/30 py-20 sm:py-24"
>
	<div data-reveal class="mb-10 max-w-[800px]">
		<h2 id="two-products-heading" class="home-section-heading text-surface">
			Devs integrate. <span class="block text-primary">Teams create.</span>
		</h2>
	</div>

	<div data-reveal class="border border-border/40 bg-background">
		<div class="relative grid grid-cols-2 border-b border-border/40">
			<button
				type="button"
				onclick={() => selectMode('devs')}
				aria-pressed={activeMode === 'devs'}
				class="px-3 py-5 text-center font-heading text-lg transition-colors sm:py-7 sm:text-2xl {activeMode === 'devs' ? 'bg-white text-surface' : 'text-muted hover:bg-white/60'}"
			>Devs integrate</button>
			<button
				type="button"
				onclick={() => selectMode('teams')}
				aria-pressed={activeMode === 'teams'}
				class="px-3 py-5 text-center font-heading text-lg transition-colors sm:py-7 sm:text-2xl {activeMode === 'teams' ? 'bg-white text-surface' : 'text-muted hover:bg-white/60'}"
			>Teams create</button>
			{#if isAutoPlaying}
				<div class="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-primary/15" aria-hidden="true">
					<div class="absolute top-0 h-full bg-primary" style:left={activeMode === 'devs' ? '0%' : '50%'} style:width={`${progress * 50}%`}></div>
				</div>
			{/if}
		</div>

		<div class="relative flex h-[440px] flex-col items-center overflow-hidden px-4 sm:px-10 sm:pt-14 {activeMode === 'devs' ? 'justify-end bg-surface pt-10' : 'justify-start bg-primary/5 pt-8'}">
			{#if activeMode === 'devs'}
				<div
					class="pointer-events-none absolute inset-0"
					style="background: radial-gradient(circle 650px at 50% 120%, color-mix(in srgb, var(--color-primary) 75%, transparent), color-mix(in srgb, var(--color-primary) 35%, transparent) 44%, transparent 80%);"
					aria-hidden="true"
				></div>
				<div class="relative z-10 w-full"><AnimatedInstallTerminal /></div>
			{:else}
				<div class="relative z-10 mx-auto w-full max-w-[780px] shrink-0 border border-border/40 bg-white">
					<div class="flex items-center justify-between gap-3 border-b border-border/40 px-5 py-3 text-sm text-muted">
						<div class="flex min-w-0 items-center gap-3"><span class="truncate font-medium text-surface">Product update</span><span class="border border-primary/30 px-2 py-0.5 text-xs text-primary">Draft</span></div>
						<span class="border border-border/40 px-3 py-1.5 text-xs text-surface">Preview</span>
					</div>
					<div class="grid sm:grid-cols-[210px_1fr]">
						<div class="border-b border-border/40 bg-background p-3 sm:border-r sm:border-b-0 sm:p-5">
							<p class="mb-2 text-sm font-medium text-surface sm:mb-3">Content</p>
							<div class="grid grid-cols-3 gap-2 sm:grid-cols-2">
								<div class="border border-border/40 bg-white px-2 py-2 text-center text-xs text-surface sm:py-3">Text</div>
								<div class="border border-border/40 bg-white px-2 py-2 text-center text-xs text-surface sm:py-3">Image</div>
								<div class="border border-primary bg-primary/5 px-2 py-2 text-center text-xs text-primary sm:py-3">Button</div>
							</div>
						</div>
						<div class="bg-background/60 p-3 sm:p-7">
							<div class="mx-auto max-w-[420px] border border-border/30 bg-white px-5 py-4 sm:px-8 sm:py-9">
								<div class="mb-4 h-2 w-16 bg-primary sm:mb-7"></div>
								<p class="mb-2 text-sm text-muted sm:mb-3">Hi Sarah,</p>
								<p class="mb-3 font-heading text-2xl leading-tight text-surface sm:mb-4 sm:text-3xl">A new way to collaborate.</p>
								<p class="mb-3 max-w-[32ch] text-sm text-muted sm:mb-5">Take a look at what's new in your workspace.</p>
								<div class="inline-flex border-2 border-primary p-1.5">
									<span class="bg-primary px-5 py-2.5 text-sm font-semibold text-white">Explore the update</span>
								</div>
								<div class="mt-7 border-t border-border/30 pt-4 text-xs text-muted">Sent by your team, powered by Lettr</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>
