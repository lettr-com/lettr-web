<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { TranslateIcon, GitForkIcon, ChartLineUpIcon, PaintBrushIcon } from 'phosphor-svelte';

	gsap.registerPlugin(ScrollTrigger);

	let section: HTMLElement | undefined = $state();

	const features = [
		{
			icon: PaintBrushIcon,
			title: 'Non-dev visual editor',
			description: 'Chainable methods for building emails. Clean, readable, intuitive.'
		},
		{
			icon: TranslateIcon,
			title: 'Multi-language',
			description: 'Send using pre-built templates with substitution data for personalization.'
		},
		{
			icon: GitForkIcon,
			title: 'Version control',
			description: 'Attach files by path or raw data. PDF, CSV, images - all supported.'
		},
		{
			icon: ChartLineUpIcon,
			title: 'Event tracking',
			description: 'Track opens, clicks, bounces, and deliveries. Full visibility.'
		}
	];

	onMount(() => {
		if (!section) return;

		gsap.from(section.querySelectorAll('[data-feature]'), {
			scrollTrigger: {
				trigger: section,
				start: 'top 80%',
				toggleActions: 'play none none none'
			},
			y: 30,
			opacity: 0,
			duration: 0.6,
			stagger: 0.08,
			ease: 'power3.out'
		});
	});
</script>

<section bind:this={section} class="px-4 py-16 border-b border-border/30">
	<div class="mx-auto max-w-[550px]">
		<div class="mb-8" data-feature>
			<h2 class="mb-3 text-surface">Works for the <span class="text-primary">whole team</span></h2>
		</div>

		<div class="grid grid-cols-2 gap-x-4 gap-y-12">
			{#each features as feature}
				<div data-feature>
					<feature.icon size={18} class="text-primary mb-2" />
					<h3 class="text-sm text-surface mb-1">{feature.title}</h3>
					<p class="max-w-[30ch] text-xs text-muted leading-relaxed">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
