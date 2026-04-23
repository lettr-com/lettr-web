<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { CaretDownIcon } from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

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

	const faqs = [
		{
			question: 'What is Lettr?',
			answer: 'Lettr is an email infrastructure platform built for SaaS companies. It combines a clean REST API and SMTP relay for developers with a drag-and-drop visual editor — powered by Topol, trusted by 40,000+ companies — for marketing and product teams. Unlike general-purpose email tools, every feature, template, and metric is designed for the emails SaaS products send: onboarding sequences, password resets, trial nudges, product updates, and marketing campaigns.'
		},
		{
			question: 'How is Lettr different from Resend, Postmark, or SendGrid?',
			answer: 'Resend offers a developer-friendly API but no visual editing tools for non-technical team members. Postmark focuses on transactional email only, with no campaign or marketing features. SendGrid and Mailchimp target a very broad audience, while Lettr is focused specifically on SaaS features. Lettr combines a developer-friendly API with a best-in-class drag-and-drop editor and supports both transactional and marketing emails from one platform.'
		},
		{
			question: 'Can I send both transactional and marketing emails with Lettr?',
			answer: 'Yes. Lettr handles both transactional emails (password resets, security alerts, usage notifications) and marketing emails (product updates, feature announcements, newsletters) from a single platform. One sending domain, one deliverability reputation, and one integration. No need to manage separate providers for transactional and marketing email.'
		},
		{
			question: 'What programming languages does Lettr support?',
			answer: 'Lettr provides official SDKs for six languages: Laravel (PHP), PHP, Node.js, Go, Java, and Rust. It also offers a standard REST API and SMTP relay compatible with any language or framework. The Laravel SDK includes first-class support with a one-command installation.'
		},
		{
			question: 'Does Lettr include an email template editor?',
			answer: 'Yes. Lettr includes a full drag-and-drop email editor powered by Topol, a technology trusted by over 40,000 companies. Features include synced sections that update across all templates at once, a draft-and-publish workflow with version history, multilingual template support, dynamic placeholders for personalization, and pre-built templates for SaaS use cases like onboarding, alerts, and product updates.'
		},
		{
			question: 'Who built Lettr?',
			answer: 'Lettr is built by the Big Good group — the team behind Topol (email editor used by 40,000+ companies), Ecomail (email marketing platform serving 12,000+ organizations for over 12 years), and DMARCeye (DMARC monitoring and reporting). Lettr leverages this deep email infrastructure expertise to deliver enterprise-grade reliability at startup-friendly pricing.'
		}
	];

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
	})}</script>`}
</svelte:head>

<section bind:this={section} id="faq" class="py-16 border-b border-border/30">
	<div class="mb-10" data-faq>
		<h2 class="mb-3 text-surface">Frequently asked <span class="text-primary">questions</span></h2>
		<p class="text-body text-muted max-w-[55ch]">
			Common questions about Lettr's email platform for SaaS companies.
		</p>
	</div>

	<div class="space-y-0">
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
