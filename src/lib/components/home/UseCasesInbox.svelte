<script lang="ts">
	import { onMount } from 'svelte';
	import UserPlusIcon from 'phosphor-svelte/lib/UserPlusIcon';
	import LockKeyIcon from 'phosphor-svelte/lib/LockKeyIcon';
	import HourglassHighIcon from 'phosphor-svelte/lib/HourglassHighIcon';
	import BellIcon from 'phosphor-svelte/lib/BellIcon';
	import MegaphoneIcon from 'phosphor-svelte/lib/MegaphoneIcon';
	import RocketLaunchIcon from 'phosphor-svelte/lib/RocketLaunchIcon';
	import SectionLabel from './SectionLabel.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const useCases = [
		{ icon: UserPlusIcon, title: 'Onboarding sequences', sender: 'Looplex', subject: 'Welcome to Looplex, Sarah', badge: 'Day 1 of 5', time: '12:40' },
		{ icon: LockKeyIcon, title: 'Password resets & security', sender: 'Nimbus', subject: 'Your login code: 284-391', badge: 'Delivered in 0.3s', time: '12:38' },
		{ icon: HourglassHighIcon, title: 'Trial expiry & upgrade nudges', sender: 'Archway', subject: '3 days left in your trial', badge: 'Triggered by event', time: '11:52' },
		{ icon: BellIcon, title: 'Usage alerts & billing', sender: 'Cobalt', subject: "You've hit 80% of your plan", badge: 'Dynamic variables', time: '10:05' },
		{ icon: MegaphoneIcon, title: 'Product updates & changelogs', sender: 'Pilot', subject: "What's new in Pilot: September", badge: 'No deploy required', time: 'Yesterday' },
		{ icon: RocketLaunchIcon, title: 'Feature announcements', sender: 'Meridian', subject: 'Introducing AI commands (Pro)', badge: 'Targeted by usage', time: 'Yesterday' }
	];

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} class="border-b border-border/30 py-20">
	<div data-reveal class="mb-10 max-w-[720px]">
		<SectionLabel index={3} total={5} label="What SaaS actually sends" />
		<h2 class="mb-4 text-[2rem] leading-[1.15] tracking-[-0.02em] text-surface sm:text-[2.5rem]">
			Built for the emails <span class="text-primary">SaaS companies actually send.</span>
		</h2>
		<p class="text-body text-muted">Designed for the emails your product already sends.</p>
	</div>

	<div data-reveal class="border border-border/40 bg-white">
		<div class="flex items-center justify-between border-b border-border/30 px-5 py-3 text-sm text-muted">
			<span class="font-medium text-surface">Inbox</span>
			<span>6 templates, one account</span>
		</div>
		{#each useCases as useCase, i}
			<div
				class="group grid items-center gap-4 px-5 py-4 transition-colors hover:bg-primary/[0.03] sm:grid-cols-[32px_180px_minmax(0,1fr)_auto_64px] {i < useCases.length - 1 ? 'border-b border-border/20' : ''}"
			>
				<span class="flex h-8 w-8 items-center justify-center bg-primary/10 text-primary">
					<useCase.icon size={16} />
				</span>
				<div class="min-w-0">
					<p class="truncate text-sm font-semibold text-surface">{useCase.sender}</p>
					<p class="truncate text-xs text-muted">{useCase.title}</p>
				</div>
				<p class="min-w-0 truncate text-sm text-surface">{useCase.subject}</p>
				<span class="hidden items-center gap-1.5 border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary sm:inline-flex">
					<span class="h-1 w-1 bg-primary"></span>
					{useCase.badge}
				</span>
				<span class="hidden text-right text-xs text-muted tabular-nums sm:block">{useCase.time}</span>
			</div>
		{/each}
	</div>
</section>
