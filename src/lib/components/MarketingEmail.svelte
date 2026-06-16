<script lang="ts">
	import { onMount } from 'svelte';
	import PaintBrushIcon from 'phosphor-svelte/lib/PaintBrushIcon';
	import UsersThreeIcon from 'phosphor-svelte/lib/UsersThreeIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
	import ChartLineUpIcon from 'phosphor-svelte/lib/ChartLineUpIcon';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	let section: HTMLElement | undefined = $state();

	const features = [
		{
			icon: PaintBrushIcon,
			title: 'The editor 40,000+ teams trust',
			description:
				'Powered by Topol. Drag, drop, ship — your team launches campaigns in minutes, no dev tickets and no Figma exports required.'
		},
		{
			icon: UsersThreeIcon,
			title: 'Contacts, lists & segments',
			description:
				'Sync contacts straight from your product. Segment by plan, activity, or any property — and reach exactly the right people every time.'
		},
		{
			icon: PaperPlaneTiltIcon,
			title: 'Unlimited campaigns',
			description:
				'Pay for the size of your audience — not the volume. Schedule and send as many campaigns as you need.'
		},
		{
			icon: ChartLineUpIcon,
			title: 'Inbox-ready deliverability',
			description:
				'SPF, DKIM, and DMARC handled for you, with reputation monitoring and warm-up — so every campaign lands in the inbox. Real-time logs, unified analytics.'
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

<section bind:this={section} class="py-16 border-b border-border/30">
	<div class="mb-10 max-w-[60ch]" data-reveal>
		<span class="mb-4 inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-2.5 py-1 font-heading text-[10px] tracking-[0.15em] text-primary uppercase">
			<span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
			Campaigns
		</span>
		<h2 class="mb-3 text-surface">
			Every email you send. <span class="text-primary">One platform.</span>
		</h2>
		<p class="text-body text-muted">
			Product launches, newsletters, promos — run them all from the account you already use for
			transactional.
		</p>
	</div>

	<div class="grid gap-3 sm:grid-cols-2" data-reveal>
		{#each features as feature}
			<div class="flex items-start gap-4 border border-border/40 bg-white p-5">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border/40 bg-background">
					<feature.icon size={18} class="text-primary" />
				</div>
				<div>
					<h3 class="mb-1 text-sm font-semibold text-surface">{feature.title}</h3>
					<p class="text-[13px] leading-relaxed text-muted">{feature.description}</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-8 flex flex-col items-start gap-4 border border-border/40 bg-white p-6 sm:flex-row sm:items-center sm:justify-between" data-reveal>
		<div class="max-w-[55ch]">
			<p class="text-[13px] font-medium text-surface">
				Your team builds. Engineering keeps shipping.
			</p>
			<p class="mt-1 text-[13px] text-muted">
				Marketers launch campaigns in the visual editor while your transactional stack stays
				untouched. Add Campaigns to your account in minutes — and watch every send land in the
				inbox.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<a
				href="/email-marketing/"
				onclick={() => trackCta('Explore Campaigns', '/email-marketing/')}
				class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
			>
				Explore Campaigns
				<ArrowRightIcon size={14} />
			</a>
			<a
				href="/pricing/"
				onclick={() => trackCta('See pricing', '/pricing/')}
				class="inline-flex items-center justify-center gap-2 border border-border/50 bg-white px-4 py-2 text-sm font-medium text-surface transition-colors hover:border-primary/40 hover:text-primary"
			>
				See pricing
			</a>
		</div>
	</div>
</section>
