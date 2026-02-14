<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ChartBarIcon,
		BellIcon,
		TrendUpIcon,
		LightningIcon,
		EyeIcon,
		ShieldWarningIcon
	} from 'phosphor-svelte';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let metricsSection: HTMLElement | undefined = $state();
	let tableSection: HTMLElement | undefined = $state();
	let chartSection: HTMLElement | undefined = $state();
	let featuresSection: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		for (const section of [metricsSection, tableSection, chartSection, featuresSection]) {
			if (section) {
				cleanups.push(
					createScrollRevealCleanup({
						scope: section,
						targets: '[data-reveal]'
					})
				);
			}
		}

		return () => cleanups.forEach((fn) => fn());
	});

	const metrics = [
		{ label: 'Emails Sent', value: '76,970', change: '+12%', positive: true },
		{ label: 'Delivery Rate', value: '99.8%', change: '+0.1%', positive: true },
		{ label: 'Open Rate', value: '64.3%', change: '+3.2%', positive: true },
		{ label: 'Bounce Rate', value: '0.18%', change: '-0.04%', positive: true }
	];

	const emailTypes = [
		{
			name: 'Welcome Email',
			sent: '12,450',
			delivered: '12,431',
			opened: '9,102',
			openRate: '73.2%',
			bounced: '19',
			live: true
		},
		{
			name: 'Password Reset',
			sent: '8,210',
			delivered: '8,205',
			opened: '7,891',
			openRate: '96.2%',
			bounced: '5',
			live: false
		},
		{
			name: 'Invoice',
			sent: '23,100',
			delivered: '23,078',
			opened: '14,320',
			openRate: '62.1%',
			bounced: '22',
			live: true
		},
		{
			name: 'Shipping Notification',
			sent: '18,740',
			delivered: '18,722',
			opened: '11,580',
			openRate: '61.8%',
			bounced: '18',
			live: false
		},
		{
			name: 'Team Invite',
			sent: '5,320',
			delivered: '5,318',
			opened: '3,890',
			openRate: '73.2%',
			bounced: '2',
			live: false
		},
		{
			name: 'Verify Email',
			sent: '9,150',
			delivered: '9,142',
			opened: '8,470',
			openRate: '92.6%',
			bounced: '8',
			live: true
		}
	];

	const chartBars = [
		{ day: 'Mon', height: 85 },
		{ day: 'Tue', height: 92 },
		{ day: 'Wed', height: 78 },
		{ day: 'Thu', height: 95 },
		{ day: 'Fri', height: 88 },
		{ day: 'Sat', height: 45 },
		{ day: 'Sun', height: 38 }
	];

	const features = [
		{
			icon: ChartBarIcon,
			title: 'Per-Template Analytics',
			description:
				'See delivery, open, and bounce rates broken down by each email template. Know exactly which emails perform and which need attention.'
		},
		{
			icon: BellIcon,
			title: 'Smart Alerts',
			description:
				'Get notified when delivery rates drop, bounce rates spike, or a template starts underperforming. Set thresholds that matter to you.'
		},
		{
			icon: TrendUpIcon,
			title: 'Trend Analysis',
			description:
				'Track how your email performance changes over time. Spot seasonal patterns, identify regressions, and measure the impact of changes.'
		},
		{
			icon: LightningIcon,
			title: 'Real-Time Feed',
			description:
				'Watch emails being sent, delivered, opened, and bounced in real time. A live stream of your email activity as it happens.'
		},
		{
			icon: EyeIcon,
			title: 'Email Preview',
			description:
				'See exactly what was sent to each recipient. Full email content, headers, metadata, and delivery timeline in a single view.'
		},
		{
			icon: ShieldWarningIcon,
			title: 'Deliverability Alerts',
			description:
				'Automated monitoring for SPF, DKIM, and DMARC issues. Get alerted before authentication problems affect your delivery.'
		}
	];
</script>

<FeaturePageLayout
	title="Email Analytics"
	metaDescription="Real-time analytics for every transactional email. Track delivery rates, open rates, bounces, and per-template performance."
	label="// ANALYTICS"
	description="Real-time visibility into every email your app sends. Per-template analytics, smart alerts, and deliverability monitoring."
>
	{#snippet heading()}
		Know what your<br />emails are doing.
	{/snippet}

	{#snippet children()}
		<!-- Metric Cards -->
		<div bind:this={metricsSection} class="mx-auto max-w-3xl">
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each metrics as metric}
					<div data-reveal class="border border-border/50 bg-white p-5">
						<p class="text-xs font-medium text-muted uppercase">{metric.label}</p>
						<p class="mt-1 font-heading text-2xl text-surface">{metric.value}</p>
						<p
							class="mt-1 text-xs font-medium {metric.positive ? 'text-green-600' : 'text-red-500'}"
						>
							{metric.change}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Email Types Table -->
		<div bind:this={tableSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Per-template performance</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Every email type tracked individually so you know exactly where to focus.
			</p>
			<div data-reveal class="overflow-x-auto border border-border/50 bg-white">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b border-border/50 bg-background">
							<th class="px-4 py-3 text-xs font-semibold text-muted uppercase">Template</th>
							<th class="px-4 py-3 text-xs font-semibold text-muted uppercase">Sent</th>
							<th class="px-4 py-3 text-xs font-semibold text-muted uppercase">Delivered</th>
							<th class="px-4 py-3 text-xs font-semibold text-muted uppercase">Opened</th>
							<th class="px-4 py-3 text-xs font-semibold text-muted uppercase">Open Rate</th>
							<th class="px-4 py-3 text-xs font-semibold text-muted uppercase">Bounced</th>
						</tr>
					</thead>
					<tbody>
						{#each emailTypes as emailType}
							<tr class="border-b border-border/30 last:border-b-0">
								<td class="px-4 py-3">
									<div class="flex items-center gap-2">
										<span class="font-medium text-surface">{emailType.name}</span>
										{#if emailType.live}
											<span class="bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-600 uppercase">LIVE</span>
										{/if}
									</div>
								</td>
								<td class="px-4 py-3 font-code text-xs text-muted">{emailType.sent}</td>
								<td class="px-4 py-3 font-code text-xs text-muted">{emailType.delivered}</td>
								<td class="px-4 py-3 font-code text-xs text-muted">{emailType.opened}</td>
								<td class="px-4 py-3 font-code text-xs font-medium text-surface">{emailType.openRate}</td>
								<td class="px-4 py-3 font-code text-xs text-muted">{emailType.bounced}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Delivery Chart -->
		<div bind:this={chartSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Daily delivery overview</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Track your sending volume and delivery rates day by day.
			</p>
			<div data-reveal class="border border-border/50 bg-white p-6">
				<div class="mb-4 flex items-center justify-between">
					<span class="text-sm font-medium text-surface">Delivery Rate</span>
					<span class="font-code text-xs text-muted">Last 7 days</span>
				</div>
				<div class="flex items-end justify-between gap-3" style="height: 160px;">
					{#each chartBars as bar}
						<div class="flex flex-1 flex-col items-center gap-2">
							<div class="w-full bg-primary/80 transition-all" style="height: {bar.height}%;"></div>
							<span class="text-[10px] text-muted">{bar.day}</span>
						</div>
					{/each}
				</div>
				<div class="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
					<span class="text-xs text-muted">Avg: 99.8%</span>
					<span class="text-xs font-medium text-green-600">All healthy</span>
				</div>
			</div>
		</div>

		<!-- Feature Cards -->
		<div bind:this={featuresSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature}
					<div data-reveal class="border border-border/50 bg-white p-6">
						<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
							<feature.icon size={20} class="text-primary" />
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{feature.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</FeaturePageLayout>
