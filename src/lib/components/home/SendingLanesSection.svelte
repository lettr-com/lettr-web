<script lang="ts">
	import { onMount } from 'svelte';
	import DitherSide from './DitherSide.svelte';
	import GetStartedButton from './GetStartedButton.svelte';
	import FeatureAccordion, { type AccordionItem } from './FeatureAccordion.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const transactionalItems: AccordionItem[] = [
		{
			id: 'onboarding',
			title: 'Onboarding sequences',
			description: 'Set up a welcome series once and it goes out as people sign up.'
		},
		{
			id: 'security',
			title: 'Password resets & security',
			description: 'Resets and login alerts jump the queue, even mid-campaign.'
		},
		{
			id: 'trial',
			title: 'Trial expiry & upgrade nudges',
			description: 'Remind people before a trial ends and nudge them to upgrade.'
		}
	];
	const marketingItems: AccordionItem[] = [
		{
			id: 'segments',
			title: 'Contacts, lists & segments',
			description: 'Group contacts into lists and segments so every send hits the right people.'
		},
		{
			id: 'campaigns',
			title: 'Unlimited campaigns',
			description: 'Send as many campaigns as you want. No caps.'
		},
		{
			id: 'analytics',
			title: 'Dashboards & analytics',
			description: 'See what was delivered, opened and clicked across every email, in one place.'
		}
	];

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} aria-labelledby="lanes-heading" class="pt-14 pb-14 md:pt-24 md:pb-16">
	<div data-reveal class="mx-auto mb-10 flex max-w-[860px] flex-col items-center gap-4 text-center md:mb-14">
		<h2
			id="lanes-heading"
			class="font-heading text-balance text-[1.875rem] leading-[1.27] tracking-[-0.02em] text-surface md:text-[2.625rem] md:leading-[50px]"
		>
			One platform.<br />
			Separate
			<em class="block font-serif text-[2.125rem] leading-none font-medium text-primary md:inline md:text-[2.875rem]">sending lanes.</em>
		</h2>
		<p class="max-w-[480px] text-[1.0625rem] leading-[1.5] text-surface md:text-[1.1875rem]">
			A big campaign never holds up a password reset.
		</p>
	</div>

	<div class="mx-auto grid max-w-[1100px] items-start gap-6 md:grid-cols-2 md:gap-4">
		<!-- Transactional -->
		<div data-reveal class="flex flex-col gap-6 md:gap-4">
			<div class="relative flex h-[480px] flex-col justify-between overflow-hidden bg-[#23020b] p-6 md:h-[560px]">
				<DitherSide color="#ec104b" variant="ripple" width={20} />
				<h3 class="relative font-heading text-[1.75rem] leading-[1.2] tracking-[-0.05em] text-white md:text-[2rem]">
					Transactional.
				</h3>
				<svg
					viewBox="-133.5 -133 300 300"
					class="absolute top-1/2 left-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 overflow-visible bg-primary shadow-[inset_0_0_32px_rgba(255,236,241,0.2)] md:h-[220px] md:w-[220px] lg:h-[300px] lg:w-[300px]"
					aria-hidden="true"
				>
					<defs>
						<filter id="lane-tx-shadow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
							<feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#1a0007" flood-opacity="0.2" />
						</filter>
						<linearGradient id="lane-tx-fill" x1="0.5" y1="0" x2="0.5" y2="1">
							<stop offset="0" stop-color="#ffeff4" />
							<stop offset="1" stop-color="#ff90ae" />
						</linearGradient>
					</defs>
					<g transform="translate(10.5 8)" filter="url(#lane-tx-shadow)">
						<path
							d="M23.721 25.716L57.565 58.548 31.793 83.541 6.002 58.548-19.77 83.541-45.56 58.548-19.77 33.535 6.002 8.541 23.721 25.716ZM57.565-41.465L27.076-11.897 6.002 8.541-19.77-16.452-45.56-41.465-19.77-66.459 6.002-41.465 31.793-66.459 57.565-41.465Z"
							fill="url(#lane-tx-fill)"
						/>
					</g>
				</svg>
				<p class="relative max-w-[429px] text-[1.25rem] leading-[1.4] text-white md:text-2xl">
					The emails your app triggers, sent the moment something happens.
				</p>
			</div>
			<FeatureAccordion items={transactionalItems} name="transactional" />
		</div>

		<!-- Marketing -->
		<div data-reveal class="flex flex-col gap-6 md:gap-4">
			<div class="relative flex h-[480px] flex-col justify-between overflow-hidden bg-[#002010] p-6 md:h-[560px]">
				<DitherSide color="#00c851" variant="noise" width={40} />
				<h3 class="relative font-serif text-4xl leading-[1.2] tracking-[-0.04em] text-white md:text-[2.25rem]">
					Marketing.
				</h3>
				<svg
					viewBox="-134 -134 300 300"
					class="absolute top-1/2 left-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 overflow-visible bg-green shadow-[inset_0_0_4px_#06c767] md:h-[220px] md:w-[220px] lg:h-[300px] lg:w-[300px]"
					aria-hidden="true"
				>
					<defs>
						<filter id="lane-mk-shadow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
							<feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#00190a" flood-opacity="0.2" />
						</filter>
						<linearGradient id="lane-mk-fill" x1="0.5" y1="0" x2="0.5" y2="1">
							<stop offset="0" stop-color="#fff" />
							<stop offset="1" stop-color="#aaffd5" />
						</linearGradient>
					</defs>
					<g transform="translate(8 8)" filter="url(#lane-mk-shadow)">
						<path
							d="M8 45.5L-29.5 83-67 45.5-29.5 8 8 45.5ZM83 45.5L45.5 83 8 45.5 45.5 8 83 45.5ZM8-29.5L-29.5 8-67-29.5-29.5-67 8-29.5ZM83-29.5L45.5 8 8-29.5 45.5-67 83-29.5Z"
							fill="url(#lane-mk-fill)"
						/>
					</g>
				</svg>
				<p class="relative max-w-[429px] text-[1.25rem] leading-[1.4] text-white md:text-2xl">
					Campaigns for your whole audience, sent from the same account.
				</p>
			</div>
			<FeatureAccordion items={marketingItems} name="marketing" />
		</div>
	</div>

	<div data-reveal class="mt-10 flex justify-center md:mt-14">
		<GetStartedButton placement="home_sending_lanes" />
	</div>
</section>
