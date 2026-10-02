<script lang="ts">
	import { onMount } from 'svelte';
	import CodeSnippet from '$lib/components/CodeSnippet.svelte';
	import FeatureAccordion, { type AccordionItem } from './FeatureAccordion.svelte';
	import EditorPreview from '$lib/components/EditorPreview.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const devItems: AccordionItem[] = [
		{
			id: 'rest-smtp',
			title: 'Clean REST API + SMTP',
			description: 'Send with one API call, or connect your existing app through SMTP.'
		},
		{
			id: 'sdks',
			title: 'SDKs for every language',
			description: "Pick your language, drop in the SDK, and you're sending in a few lines."
		},
		{
			id: 'webhooks',
			title: 'Webhooks for every event',
			description: "Get pinged when an email is delivered, opened or clicked. Every call is signed."
		}
	];
	const teamItems: AccordionItem[] = [
		{
			id: 'synced',
			title: 'Synced sections',
			description: 'Reuse a header or footer across emails. Change it once and every email follows.'
		},
		{
			id: 'multilingual',
			title: 'Multilingual templates',
			description: 'Keep every language in one template, so there are no copies to keep in sync.'
		},
		{
			id: 'placeholders',
			title: 'Dynamic placeholders',
			description: 'Drop in names, plans or dates and each email fills itself in. No copy-pasting.'
		}
	];

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} aria-labelledby="dev-teams-heading" class="py-14 md:py-24">
	<div data-reveal class="mx-auto mb-10 flex max-w-[860px] flex-col items-center gap-4 text-center md:mb-14">
		<h2
			id="dev-teams-heading"
			class="font-heading text-balance text-[1.875rem] leading-[1.27] tracking-[-0.02em] text-surface md:text-[2.625rem] md:leading-[50px]"
		>
			Make <em class="font-serif text-[2.125rem] leading-none font-medium text-primary md:text-[2.875rem]">all</em>
			your emails<br class="hidden md:block" />
			accessible to
			<em class="block font-serif text-[2.125rem] leading-none font-medium text-primary md:inline md:text-[2.875rem]">everyone</em>
		</h2>
		<p class="max-w-[364px] text-[1.0625rem] leading-[1.5] text-surface md:text-[1.1875rem]">
			Connect sending once. Your team can then edit the emails customers see.
		</p>
	</div>

	<div class="mx-auto grid max-w-[1100px] items-start gap-6 lg:grid-cols-2 lg:gap-4">
		<!-- Developers -->
		<div data-reveal class="flex flex-col gap-6 md:gap-4">
			<div class="relative flex flex-col gap-6 overflow-hidden bg-surface p-6 lg:block lg:h-[560px]">
				<h3 class="relative font-heading text-[1.75rem] leading-[1.2] tracking-[-0.05em] text-white md:text-[2rem]">
					Dev integrate.
				</h3>
				<div class="w-full max-w-[560px] lg:absolute lg:top-1/2 lg:left-[125px] lg:w-[529px] lg:max-w-none lg:-translate-y-1/2">
					<CodeSnippet />
				</div>
				<p class="m-0 max-w-[280px] text-[1.375rem] leading-[1.3] text-white lg:absolute lg:bottom-6 lg:left-6 lg:w-[202px] lg:text-2xl lg:leading-[1.4]">
					A clean API that developers enjoy.
				</p>
			</div>
			<FeatureAccordion items={devItems} name="dev" />
		</div>

		<!-- Teams -->
		<div data-reveal class="flex flex-col gap-6 md:gap-4">
			<div class="relative flex flex-col gap-6 overflow-hidden bg-primary p-6 lg:block lg:h-[560px]">
				<h3 class="relative font-serif text-4xl leading-[1.2] tracking-[-0.04em] text-white md:text-[2.5rem]">
					Teams create.
				</h3>
				<div class="w-full max-w-[560px] lg:absolute lg:top-[calc(50%-14px)] lg:left-[91px] lg:w-[529px] lg:max-w-none lg:-translate-y-1/2">
					<div role="img" aria-label="Preview of the Lettr visual email editor">
						<EditorPreview />
					</div>
				</div>
				<p class="m-0 max-w-[320px] text-[1.375rem] leading-[1.3] text-white lg:absolute lg:bottom-6 lg:left-6 lg:w-[429px] lg:max-w-none lg:text-2xl lg:leading-[1.4]">
					Connected to a visual editor your whole team can use independently.
				</p>
			</div>
			<FeatureAccordion items={teamItems} name="teams" />
		</div>
	</div>
</section>
