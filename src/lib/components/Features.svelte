<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { LinkIcon, FileTextIcon, ChartLineUpIcon, SparkleIcon, LightningIcon, PaperclipIcon } from 'phosphor-svelte';
	import { createGsapContextCleanup } from '$lib/utils/gsapContext';

	gsap.registerPlugin(ScrollTrigger);

	let section: HTMLElement | undefined = $state();

	const features = [
		{
			icon: LinkIcon,
			title: 'Fluent builder API',
			description: 'Chainable methods for building emails. Clean, readable, intuitive.'
		},
		{
			icon: FileTextIcon,
			title: 'Template support',
			description: 'Send using pre-built templates with substitution data for personalization.'
		},
		{
			icon: PaperclipIcon,
			title: 'Attachments made easy',
			description: 'Attach files by path or raw data. PDF, CSV, images - all supported.'
		},
		{
			icon: ChartLineUpIcon,
			title: 'Event tracking',
			description: 'Track opens, clicks, bounces, and deliveries. Full visibility.'
		},
		{
			icon: SparkleIcon,
			title: 'Smart inlining',
			description: 'CSS is automatically inlined for maximum email client compatibility.'
		},
		{
			icon: LightningIcon,
			title: 'Click & open tracking',
			description: 'Track opens, clicks, bounces, and deliveries. Full visibility.'
		}
	];

	onMount(() => {
		if (!section) return;
		const sectionEl = section;

		return createGsapContextCleanup(
			gsap,
			() => {
				gsap.from(sectionEl.querySelectorAll('[data-feature]'), {
					scrollTrigger: {
						trigger: sectionEl,
						start: 'top 80%',
						toggleActions: 'play none none none'
					},
					y: 30,
					opacity: 0,
					duration: 0.6,
					stagger: 0.08,
					ease: 'power3.out'
				});
			},
			sectionEl
		);
	});
</script>

<section bind:this={section} id="features" class="px-4 pt-16">
	<div class="mx-auto max-w-[550px]">
		<div class="mb-8" data-feature>
			<h2 class="mb-3 text-surface">Built for <span class="text-primary">developers</span></h2>
		</div>

		<div class="grid grid-cols-2 gap-x-4 gap-y-12">
			{#each features as feature}
				<div data-feature>
					<feature.icon size={18} class="text-primary mb-2" />
					<h3 class="text-sm text-surface font-medium mb-1">{feature.title}</h3>
					<p class="max-w-[30ch] text-xs text-muted leading-relaxed">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
