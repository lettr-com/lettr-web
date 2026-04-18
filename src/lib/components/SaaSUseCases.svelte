<script lang="ts">
	import { onMount } from 'svelte';
	import { UserPlusIcon, LockKeyIcon, HourglassHighIcon, BellIcon, MegaphoneIcon, RocketLaunchIcon } from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const useCases = [
		{
			icon: UserPlusIcon,
			title: 'Onboarding sequences',
			description: 'Welcome emails, setup guides, activation nudges. Build the full sequence visually, then let your product team tweak copy without filing a ticket.'
		},
		{
			icon: LockKeyIcon,
			title: 'Password resets & security',
			description: 'Sub-second delivery for the emails users are staring at their inbox waiting for. Automatic retries and priority queuing built in.'
		},
		{
			icon: HourglassHighIcon,
			title: 'Trial expiry & upgrade nudges',
			description: 'Trigger emails based on trial days remaining, usage thresholds, or custom events. Your marketing team designs the email — your API decides when it fires.'
		},
		{
			icon: BellIcon,
			title: 'Usage alerts & billing',
			description: 'Quota warnings, invoice receipts, failed payment notices. Template them once with dynamic variables, and every customer gets the right numbers.'
		},
		{
			icon: MegaphoneIcon,
			title: 'Product updates & changelogs',
			description: 'Ship a feature, then send a beautiful changelog digest — designed in the drag-and-drop editor by anyone on your team. No deploy required.'
		},
		{
			icon: RocketLaunchIcon,
			title: 'Feature announcements',
			description: 'Target campaigns by plan, usage, or custom attributes. Announce your new Pro feature only to users who would actually care about it.'
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

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
			{#each useCases as useCase}
				<div data-usecase>
					<useCase.icon size={20} class="text-primary mb-3" />
					<h3 class="text-sm text-surface font-medium mb-1">{useCase.title}</h3>
					<p class="text-[13px] text-muted leading-relaxed">{useCase.description}</p>
				</div>
			{/each}
		</div>
</section>
