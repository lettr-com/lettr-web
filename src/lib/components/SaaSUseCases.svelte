<script lang="ts">
	import { onMount } from 'svelte';
	import { UserPlusIcon, LockKeyIcon, HourglassHighIcon, BellIcon, MegaphoneIcon, RocketLaunchIcon } from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const useCases = [
		{
			icon: UserPlusIcon,
			title: 'Onboarding sequences',
			description: 'Welcome new users, guide them through setup, and drive activation.'
		},
		{
			icon: LockKeyIcon,
			title: 'Password resets & security',
			description: 'Transactional emails that land instantly. Every time.'
		},
		{
			icon: HourglassHighIcon,
			title: 'Trial expiry & upgrade nudges',
			description: 'Convert free users to paid with perfectly timed emails.'
		},
		{
			icon: BellIcon,
			title: 'Usage alerts & billing',
			description: 'Keep users informed about limits, invoices, and account changes.'
		},
		{
			icon: MegaphoneIcon,
			title: 'Product updates & changelogs',
			description: 'Share what you shipped. Keep your users engaged and informed.'
		},
		{
			icon: RocketLaunchIcon,
			title: 'Feature announcements',
			description: 'Launch new features with targeted campaigns to the right audience.'
		}
	];

	onMount(() => {
		if (!section) return;

		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-usecase]'
		});
	});
</script>

<section bind:this={section} class="py-16 border-b border-border/30">
		<div class="mb-8" data-usecase>
			<h2 class="mb-3 text-surface">Built for the emails <span class="text-primary">SaaS companies actually send.</span></h2>
			<p class="text-body text-muted max-w-[55ch]">
				Every template, workflow, and metric is designed for the emails your product already sends.
			</p>
		</div>

		<div class="grid grid-cols-2 gap-x-6 gap-y-8">
			{#each useCases as useCase}
				<div data-usecase>
					<useCase.icon size={20} class="text-primary mb-3" />
					<h3 class="text-sm text-surface font-medium mb-1">{useCase.title}</h3>
					<p class="text-[13px] text-muted leading-relaxed">{useCase.description}</p>
				</div>
			{/each}
		</div>
</section>
