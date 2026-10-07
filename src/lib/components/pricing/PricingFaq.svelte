<script lang="ts">
	import { slide } from 'svelte/transition';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { faqs } from '$lib/data/faqs';

	let openIndex: number | null = $state(0);

	function toggle(i: number) {
		const wasOpen = openIndex === i;
		openIndex = wasOpen ? null : i;
		void capturePosthogEvent('faq_toggled', { index: i, question: faqs[i].question, opened: !wasOpen });
	}
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: { '@type': 'Answer', text: faq.answer }
		}))
	})}<\/script>`}
</svelte:head>

<section id="faq" aria-labelledby="faq-heading" class="mx-auto flex max-w-[1100px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">
	<div class="flex shrink-0 flex-col gap-5 lg:w-[340px]">
		<h2 id="faq-heading" class="m-0 flex flex-col font-heading text-[1.875rem] leading-[1.2] tracking-[-0.025em] text-surface sm:text-[2.5rem] sm:leading-[46px]">
			Frequently asked
			<em class="font-serif text-[2.125rem] leading-[1.1] font-medium text-primary sm:text-[2.875rem] sm:leading-[50px]">questions</em>
		</h2>
		<p class="m-0 text-[1.0625rem] leading-[27px] text-muted">Common questions about Lettr's email platform for SaaS companies.</p>
	</div>

	<div class="flex-1 border-t border-surface">
		{#each faqs as faq, i}
			{@const isOpen = openIndex === i}
			<div class="border-b border-border">
				<h3 class="m-0">
					<button
						type="button"
						onclick={() => toggle(i)}
						aria-expanded={isOpen}
						aria-controls="faq-panel-{i}"
						class="flex w-full cursor-pointer items-center justify-between gap-6 py-[22px] text-left"
					>
						<span class="font-heading text-base leading-[26px] font-medium text-surface sm:text-lg">{faq.question}</span>
						<span class="w-5 shrink-0 text-center text-[1.625rem] leading-[26px] {isOpen ? 'text-primary' : 'text-surface'}" aria-hidden="true">{isOpen ? '−' : '+'}</span>
					</button>
				</h3>
				{#if isOpen}
					<div id="faq-panel-{i}" transition:slide={{ duration: 200 }}>
						<p class="m-0 pr-0 pb-[22px] text-base leading-[26px] text-muted sm:pr-11">{faq.answer}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
