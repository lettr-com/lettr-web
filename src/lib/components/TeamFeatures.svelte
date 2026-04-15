<script lang="ts">
	import { onMount } from 'svelte';
	import { TranslateIcon, GitForkIcon, PaintBrushIcon, ArrowsClockwiseIcon, TextboxIcon, SquaresFourIcon } from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const features = [
		{
			icon: PaintBrushIcon,
			title: 'Drag-and-drop editor',
			description: 'Powered by Topol, used by 40,000+ companies. Best-in-class email building.'
		},
		{
			icon: ArrowsClockwiseIcon,
			title: 'Synced sections',
			description: 'Update a header or footer once, apply it everywhere. No manual copying.'
		},
		{
			icon: GitForkIcon,
			title: 'Draft & publish workflow',
			description: 'Version history built in. Preview, approve, publish with confidence.'
		},
		{
			icon: TranslateIcon,
			title: 'Multilingual templates',
			description: 'Manage translations in one place. Send the right language automatically.'
		},
		{
			icon: TextboxIcon,
			title: 'Dynamic placeholders',
			description: 'Personalize every email with user data. No code needed from your team.'
		},
		{
			icon: SquaresFourIcon,
			title: 'SaaS template library',
			description: 'Pre-built templates for onboarding, alerts, updates, and more.'
		}
	];

	onMount(() => {
		if (!section) return;

		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-feature]'
		});
	});
</script>

<section bind:this={section} class="py-16 border-b border-border/30">
		<div class="mb-8" data-feature>
			<h2 class="mb-3 text-surface">Your team edits. <span class="text-primary">No dev tickets required.</span></h2>
			<p class="text-body text-muted max-w-[50ch]">
				A full visual editor your marketing and product team can use independently.
			</p>
		</div>

		<div class="grid grid-cols-2 gap-x-4 gap-y-12">
			{#each features as feature}
				<div data-feature>
					<feature.icon size={18} class="text-primary mb-2" />
					<h3 class="text-base text-surface font-medium mb-1">{feature.title}</h3>
					<p class="max-w-[30ch] text-sm text-muted leading-relaxed">{feature.description}</p>
				</div>
			{/each}
		</div>
</section>
