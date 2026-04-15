<script lang="ts">
	import { onMount } from 'svelte';
	import CodeSnippet from './CodeSnippet.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	onMount(() => {
		if (!section) return;

		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-animate]',
			vars: {
				stagger: 0.1
			}
		});
	});
</script>

<section bind:this={section} class="-mx-6 px-6 py-16 bg-surface border-b border-white/10">
		<div class="mb-10" data-animate>
			<h2 class="mb-3 text-white">
				Devs integrate. <span class="text-primary">Teams create.</span>
			</h2>
			<p class="text-body text-gray-400 max-w-[50ch]">
				A clean API that developers enjoy, connected to a visual editor your whole team can use independently. Nobody files a ticket to change a button color.
			</p>
		</div>

		<div data-animate>
			<CodeSnippet />
		</div>
</section>
