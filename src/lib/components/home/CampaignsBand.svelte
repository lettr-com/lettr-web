<script lang="ts">
	import { onMount } from 'svelte';
	import LargeFeatureCard from './LargeFeatureCard.svelte';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	function trackCard(label: string, href: string) {
		void capturePosthogEvent('cta_clicked', {
			placement: 'home_marketing_email',
			label,
			href,
			destination_type: 'internal'
		});
	}

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} class="border-b border-border/30 py-20 sm:py-24">
	<div data-reveal class="mb-12 max-w-[760px]">
		<h2 class="home-section-heading text-surface">
			Every email you send. <span class="block text-primary">One platform.</span>
		</h2>
	</div>

	<div class="grid gap-5 lg:grid-cols-2">
		<LargeFeatureCard
			title="The right people, every time."
			description="Build segments from customer data and activity."
			href="/email-marketing/"
			surface="white"
			onselect={() => trackCard('Explore audiences', '/email-marketing/')}
		>
			<div class="w-full max-w-[445px] border border-white/15 bg-surface p-5 shadow-[10px_10px_0_0_rgba(236,16,75,0.16)] sm:p-7">
				<div class="border border-white/20 px-5 py-4 font-heading text-lg text-white sm:text-xl">All contacts</div>
				<div class="ml-7 h-8 w-px bg-primary"></div>
				<div class="grid gap-3 sm:grid-cols-2">
					<div class="border-2 border-primary bg-primary/10 px-4 py-4 text-sm text-white sm:text-base">Active trials</div>
					<div class="border border-white/20 px-4 py-4 text-sm text-white sm:text-base">Paid teams</div>
				</div>
			</div>
		</LargeFeatureCard>

		<LargeFeatureCard
			title="Send as often as you need."
			description="Campaigns are priced by audience size, not send volume."
			href="/pricing/"
			surface="white"
			onselect={() => trackCard('See campaign pricing', '/pricing/')}
		>
			<div class="flex h-[260px] w-full max-w-[445px] items-center justify-center border border-white/15 bg-surface shadow-[10px_10px_0_0_rgba(236,16,75,0.16)] sm:h-[290px]">
				<span class="font-heading text-[13rem] leading-none text-primary sm:text-[16rem]">∞</span>
			</div>
		</LargeFeatureCard>
	</div>
</section>
