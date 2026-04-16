<script lang="ts">
	import { onMount } from 'svelte';
	import { ChatCircleDotsIcon } from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	onMount(() => {
		if (!section) return;

		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-reveal]'
		});
	});
</script>

<section bind:this={section} class="border-b border-border/30 py-16">
	<div data-reveal class="flex flex-col items-center text-center">
		<ChatCircleDotsIcon size={24} class="mb-4 text-primary" />
		<h2 class="mb-2 text-surface">Need help deciding?</h2>
		<p class="mb-6 max-w-[40ch] text-sm text-muted">
			Talk to our team about your email infrastructure, volume needs, or migration from another provider.
		</p>
		<a
			href="/demo"
			class="bg-surface px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-surface/90"
		>
			Talk to an expert
		</a>
	</div>
</section>
