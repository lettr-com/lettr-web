<script lang="ts">
	import { onMount } from 'svelte';
	import { UserPlusIcon, LockKeyIcon, HourglassHighIcon, BellIcon, MegaphoneIcon, RocketLaunchIcon } from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const useCases = [
		{
			icon: UserPlusIcon,
			title: 'Onboarding sequences',
			sender: 'Looplex',
			subject: 'Welcome to Looplex, Sarah',
			badge: 'Day 1 of 5'
		},
		{
			icon: LockKeyIcon,
			title: 'Password resets & security',
			sender: 'Nimbus',
			subject: 'Your login code: 284-391',
			badge: 'Delivered in 0.3s'
		},
		{
			icon: HourglassHighIcon,
			title: 'Trial expiry & upgrade nudges',
			sender: 'Archway',
			subject: '3 days left in your trial',
			badge: 'Triggered by event'
		},
		{
			icon: BellIcon,
			title: 'Usage alerts & billing',
			sender: 'Cobalt',
			subject: "You've hit 80% of your plan",
			badge: 'Dynamic variables'
		},
		{
			icon: MegaphoneIcon,
			title: 'Product updates & changelogs',
			sender: 'Pilot',
			subject: "What's new in Pilot — April",
			badge: 'No deploy required'
		},
		{
			icon: RocketLaunchIcon,
			title: 'Feature announcements',
			sender: 'Meridian',
			subject: 'Introducing AI commands (Pro)',
			badge: 'Targeted by usage'
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

<section bind:this={section} class="pt-24 pb-16 border-b border-border/30">
		<div class="mb-8" data-usecase>
			<h2 class="mb-3 text-surface">Built for the emails <span class="text-primary">SaaS companies actually send.</span></h2>
			<p class="text-body text-muted max-w-[55ch]">
				Designed for the emails your product already sends.
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
			{#each useCases as useCase}
				<div data-usecase class="group">
					<h3 class="text-sm text-surface font-medium leading-tight tracking-tight mb-3">{useCase.title}</h3>
					<div class="border border-border/40 bg-white p-3 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_24px_-12px_rgba(236,16,75,0.2)] group-hover:border-primary/40">
						<div class="flex items-center gap-2 mb-2">
							<div class="w-7 h-7 bg-primary/10 flex items-center justify-center flex-shrink-0">
								<useCase.icon size={14} class="text-primary" />
							</div>
							<span class="text-[13px] text-surface font-medium">{useCase.sender}</span>
						</div>
						<p class="text-[13px] text-surface font-semibold mb-2 truncate">{useCase.subject}</p>
						<div class="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 font-medium uppercase tracking-wide">
							<span class="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
							{useCase.badge}
						</div>
					</div>
				</div>
			{/each}
		</div>
</section>
