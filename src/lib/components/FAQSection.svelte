<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { faqs } from '$lib/data/faqs';

	let section: HTMLElement | undefined = $state();
	let openIndex: number | null = $state(null);

	function toggle(i: number) {
		const wasOpen = openIndex === i;
		openIndex = wasOpen ? null : i;
		void capturePosthogEvent('faq_toggled', {
			index: i,
			question: faqs[i].question,
			opened: !wasOpen
		});
	}


	onMount(() => {
		if (!section) return;

		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-faq]'
		});
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": faqs.map(faq => ({
			"@type": "Question",
			"name": faq.question,
			"acceptedAnswer": {
				"@type": "Answer",
				"text": faq.answer
			}
		}))
	})}<\/script>`}
</svelte:head>

<section bind:this={section} id="faq" class="py-16 border-b border-border/30">
	<div class="mb-10" data-faq>
		<h2 class="mb-3 font-medium text-surface">Frequently asked <span class="block text-primary">questions</span></h2>
		<p class="text-body text-muted max-w-[55ch]">
			Common questions about Lettr's email platform for SaaS companies.
		</p>
	</div>

	<div class="space-y-0" data-markdown="faq">
		{#each faqs as faq, i}
			<div data-faq class="{i < faqs.length - 1 ? 'border-b border-border/20' : ''}">
				<button
					onclick={() => toggle(i)}
					class="flex w-full items-center justify-between py-5 text-left"
				>
					<h3 class="text-sm font-medium text-surface">{faq.question}</h3>
					<CaretDownIcon
						size={14}
						class="shrink-0 ml-4 text-muted transition-transform duration-200 {openIndex === i ? 'rotate-180' : ''}"
					/>
				</button>
				{#if openIndex === i}
					<div transition:slide={{ duration: 200 }}>
						<p class="text-[13px] text-muted leading-relaxed max-w-[65ch] pb-5">{faq.answer}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
