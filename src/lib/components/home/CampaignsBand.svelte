<script lang="ts">
	import { onMount } from 'svelte';
	import PaintBrushIcon from 'phosphor-svelte/lib/PaintBrushIcon';
	import UsersThreeIcon from 'phosphor-svelte/lib/UsersThreeIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
	import ChartLineUpIcon from 'phosphor-svelte/lib/ChartLineUpIcon';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import SectionLabel from './SectionLabel.svelte';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const features = [
		{
			icon: PaintBrushIcon,
			title: 'The editor 40,000+ teams trust',
			description:
				'Powered by Topol. Drag, drop, ship. Your team launches campaigns in minutes, no dev tickets and no Figma exports required.'
		},
		{
			icon: UsersThreeIcon,
			title: 'Contacts, lists & segments',
			description:
				'Sync contacts straight from your product. Segment by plan, activity, or any property, and reach exactly the right people every time.'
		},
		{
			icon: PaperPlaneTiltIcon,
			title: 'Unlimited campaigns',
			description:
				'Pay for the size of your audience, not the volume. Schedule and send as many campaigns as you need.'
		},
		{
			icon: ChartLineUpIcon,
			title: 'Inbox-ready deliverability',
			description:
				'SPF, DKIM, and DMARC handled for you, with reputation monitoring and warm-up, so every campaign lands in the inbox.'
		}
	];

	function trackCta(label: string, href: string) {
		void capturePosthogEvent('cta_clicked', {
			placement: 'home_marketing_email',
			label,
			href,
			destination_type: /^https?:\/\//.test(href) ? 'external' : 'internal'
		});
	}

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} class="border-b border-border/30 py-20">
	<div class="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
		<div data-reveal>
			<SectionLabel index={4} total={5} label="Campaigns" />
			<h2 class="mb-4 text-[2rem] leading-[1.15] tracking-[-0.02em] text-surface sm:text-[2.5rem]">
				Every email you send. <span class="text-primary">One platform.</span>
			</h2>
			<p class="mb-8 text-body text-muted">
				Product launches, newsletters, promos: run them all from the account you already use for
				transactional.
			</p>
			<div class="flex flex-wrap items-center gap-3">
				<a
					href="/email-marketing/"
					onclick={() => trackCta('Explore Campaigns', '/email-marketing/')}
					class="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
				>
					Explore Campaigns
					<ArrowRightIcon size={14} />
				</a>
				<a
					href="/pricing/"
					onclick={() => trackCta('See pricing', '/pricing/')}
					class="inline-flex items-center justify-center border border-border/50 bg-white px-5 py-3 text-sm font-semibold text-surface transition-colors hover:border-primary/40 hover:text-primary"
				>
					See pricing
				</a>
			</div>
		</div>

		<div class="grid gap-px border border-border/40 bg-border/40 sm:grid-cols-2">
			{#each features as feature}
				<div data-reveal class="bg-white p-6">
					<span class="mb-4 flex h-9 w-9 items-center justify-center border border-border/40 bg-background text-primary">
						<feature.icon size={18} />
					</span>
					<h3 class="mb-2 text-base font-semibold text-surface">{feature.title}</h3>
					<p class="text-sm leading-relaxed text-muted">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
