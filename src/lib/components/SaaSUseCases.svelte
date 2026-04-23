<script lang="ts">
	import { onMount } from 'svelte';
	import { UserPlusIcon, LockKeyIcon, HourglassHighIcon, BellIcon, MegaphoneIcon, RocketLaunchIcon } from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();
	let activeIndex = $state(0);

	const useCases = [
		{
			icon: UserPlusIcon,
			title: 'Onboarding sequences',
			description: 'Welcome emails, setup guides, activation nudges — built visually.',
			sender: 'Looplex',
			subject: 'Welcome to Looplex, Sarah',
			preview: "Let's get your first workspace set up in 3 quick steps...",
			badge: 'Day 1 of 5',
			time: 'now'
		},
		{
			icon: LockKeyIcon,
			title: 'Password resets & security',
			description: 'Sub-second delivery with automatic retries and priority queuing.',
			sender: 'Nimbus',
			subject: 'Your login code: 284-391',
			preview: "Expires in 10 minutes. If you didn't request this, ignore...",
			badge: 'Delivered in 0.3s',
			time: '2s ago'
		},
		{
			icon: HourglassHighIcon,
			title: 'Trial expiry & upgrade nudges',
			description: 'Trigger by trial days, usage thresholds, or custom events.',
			sender: 'Archway',
			subject: '3 days left in your trial',
			preview: 'Keep your team, data, and integrations past Friday...',
			badge: 'Triggered by event',
			time: '1m ago'
		},
		{
			icon: BellIcon,
			title: 'Usage alerts & billing',
			description: 'Quota warnings, receipts, failed payments — with dynamic variables.',
			sender: 'Cobalt',
			subject: "You've hit 80% of your plan",
			preview: '$47.20 in overage so far this month. Upgrade to keep...',
			badge: 'Dynamic variables',
			time: '5m ago'
		},
		{
			icon: MegaphoneIcon,
			title: 'Product updates & changelogs',
			description: 'Ship a feature, send a beautiful changelog — no deploy required.',
			sender: 'Pilot',
			subject: "What's new in Pilot — April",
			preview: 'Branching, dev mode, and 4 more improvements from the team...',
			badge: 'No deploy required',
			time: '1h ago'
		},
		{
			icon: RocketLaunchIcon,
			title: 'Feature announcements',
			description: 'Target campaigns by plan, usage, or custom attributes.',
			sender: 'Meridian',
			subject: 'Introducing AI commands (Pro)',
			preview: 'Since you run automations 10× a week, this one is for you...',
			badge: 'Targeted by usage',
			time: '3h ago'
		}
	];

	function bringToFront(index: number) {
		activeIndex = index;
	}

	function getStackPosition(index: number): number {
		const len = useCases.length;
		return (index - activeIndex + len) % len;
	}

	onMount(() => {
		if (!section) return;

		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-usecase]'
		});
	});
</script>

<section bind:this={section} class="pt-24 pb-16 border-b border-border/30">
	<div class="mb-12 max-w-2xl" data-usecase>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			Use cases
		</div>
		<h2 class="mb-3 text-surface">
			Built for the emails <span class="text-primary">SaaS companies actually send.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Designed for the emails your product already sends.
		</p>
	</div>

	<div class="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-14 items-start">
		<div class="flex flex-col" data-usecase>
			<ul class="flex flex-col">
				{#each useCases as useCase, i}
					{@const isActive = activeIndex === i}
					<li>
						<button
							type="button"
							onclick={() => bringToFront(i)}
							aria-pressed={isActive}
							class="group flex w-full items-center gap-3 border-l-2 py-3 pl-4 pr-2 text-left transition-colors cursor-pointer"
							class:border-primary={isActive}
							class:border-transparent={!isActive}
							class:bg-primary={false}
						>
							<span
								class="flex h-8 w-8 flex-shrink-0 items-center justify-center transition-colors"
								class:bg-primary={isActive}
								style={isActive ? '' : 'background-color: rgba(236, 16, 75, 0.08);'}
							>
								<useCase.icon
									size={16}
									class={isActive ? 'text-white' : 'text-primary'}
								/>
							</span>
							<span
								class="text-sm font-medium transition-colors"
								class:text-primary={isActive}
								class:text-surface={!isActive}
							>
								{useCase.title}
							</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>

		<div
			class="queue-frame relative overflow-hidden border border-border/40 bg-white p-5 sm:p-6"
			data-usecase
		>
			<div class="particles-wrap" aria-hidden="true">
				<div class="particles"></div>
			</div>

			<div class="relative h-[360px] w-full">
				{#each useCases as useCase, i}
					{@const pos = getStackPosition(i)}
					<button
						type="button"
						onclick={() => bringToFront(i)}
						aria-label={`Show ${useCase.title} email`}
						class="stack-card absolute bottom-0 left-0 right-[90px] cursor-pointer border border-border/40 bg-white p-4 text-left shadow-[0_10px_30px_-18px_rgba(17,24,39,0.35)] transition-all duration-500 ease-out hover:border-primary/50"
						style="--pos: {pos}; z-index: {100 - pos};"
					>
						<div class="mb-2 flex items-center gap-2">
							<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-primary/10">
								<useCase.icon size={16} class="text-primary" />
							</div>
							<span class="text-[13px] font-semibold text-surface">{useCase.sender}</span>
							<span class="ml-auto text-[10px] uppercase tracking-wider text-muted/60">
								{useCase.time}
							</span>
						</div>
						<p class="mb-0.5 truncate text-[14px] font-semibold text-surface">
							{useCase.subject}
						</p>
						<p class="mb-3 truncate text-[12px] text-muted">{useCase.preview}</p>
						<div
							class="inline-flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary"
						>
							<span class="h-1 w-1 rounded-full bg-primary"></span>
							{useCase.badge}
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.particles-wrap {
		position: absolute;
		inset: 0;
		pointer-events: none;
		-webkit-mask-image: radial-gradient(
			ellipse at 100% 50%,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0.75) 35%,
			rgba(0, 0, 0, 0) 78%
		);
		mask-image: radial-gradient(
			ellipse at 100% 50%,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0.75) 35%,
			rgba(0, 0, 0, 0) 78%
		);
	}

	.particles {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(236, 16, 75, 0.55) 0%,
			rgba(236, 16, 75, 1) 50%,
			rgba(236, 16, 75, 0.65) 100%
		);
		-webkit-mask-image:
			radial-gradient(circle, #000 1.4px, transparent 1.7px),
			radial-gradient(circle, #000 1.4px, transparent 1.7px);
		-webkit-mask-size: 5px 5px, 5px 5px;
		-webkit-mask-position: 0 0, 2.5px 2.5px;
		-webkit-mask-repeat: repeat, repeat;
		mask-image:
			radial-gradient(circle, #000 1.4px, transparent 1.7px),
			radial-gradient(circle, #000 1.4px, transparent 1.7px);
		mask-size: 5px 5px, 5px 5px;
		mask-position: 0 0, 2.5px 2.5px;
		mask-repeat: repeat, repeat;
		opacity: 0.9;
	}

	.stack-card {
		transform: translate(calc(var(--pos) * 14px), calc(var(--pos) * -34px))
			scale(calc(1 - var(--pos) * 0.015));
		transform-origin: bottom left;
		transition:
			transform 500ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 300ms,
			border-color 300ms;
	}

	.stack-card:hover {
		transform: translate(calc(var(--pos) * 14px), calc((var(--pos) * -34px) - 4px))
			scale(calc(1 - var(--pos) * 0.015));
	}
</style>
