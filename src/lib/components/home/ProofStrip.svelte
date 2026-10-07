<script lang="ts">
	import { onMount } from 'svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const stats = [
		{ value: '40,000+', label: 'companies use our email editor' },
		{ value: '12,000+', label: 'organizations run campaigns with us' },
		{ value: '12 years', label: 'running email infrastructure' }
	];

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} aria-label="Email infrastructure experience" class="py-10 md:py-16">
	<div class="mx-auto grid max-w-[900px] grid-cols-3">
		{#each stats as stat}
			<div
				data-reveal
				class="flex flex-col items-center border-r border-border/30 px-1.5 text-center last:border-r-0 sm:px-6"
			>
				<p
					class="font-heading text-[clamp(0.9375rem,5.2vw,1.25rem)] leading-none tracking-[-0.02em] whitespace-nowrap text-surface tabular-nums sm:text-3xl"
				>
					{stat.value}
				</p>
				<p class="mt-2 text-xs leading-snug text-muted sm:text-sm">
					{stat.label}
				</p>
			</div>
		{/each}
	</div>
</section>
