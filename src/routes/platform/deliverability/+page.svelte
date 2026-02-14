<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ShieldCheckIcon,
		ChartLineUpIcon,
		HardDrivesIcon,
		ProhibitIcon,
		ListChecksIcon,
		LockKeyIcon
	} from 'phosphor-svelte';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let scoreSection: HTMLElement | undefined = $state();
	let dnsSection: HTMLElement | undefined = $state();
	let blocklistSection: HTMLElement | undefined = $state();
	let featuresSection: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		for (const section of [scoreSection, dnsSection, blocklistSection, featuresSection]) {
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

	const scorePercentage = 99.9;
	const circumference = 2 * Math.PI * 80;
	const dashOffset = circumference - (scorePercentage / 100) * circumference;

	const dnsRecords = [
		{
			type: 'DKIM',
			record: 'lettr._domainkey.yourapp.com',
			value: 'v=DKIM1; k=rsa; p=MIGfMA0G...',
			status: 'verified'
		},
		{
			type: 'SPF',
			record: 'yourapp.com',
			value: 'v=spf1 include:spf.lettr.com ~all',
			status: 'verified'
		},
		{
			type: 'DMARC',
			record: '_dmarc.yourapp.com',
			value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@lettr.com',
			status: 'verified'
		},
		{
			type: 'CNAME',
			record: 'track.yourapp.com',
			value: 'tracking.lettr.com',
			status: 'pending'
		}
	];

	const blocklists = [
		{ name: 'Spamhaus ZEN', status: 'clean' },
		{ name: 'Barracuda BRBL', status: 'clean' },
		{ name: 'SpamCop', status: 'clean' },
		{ name: 'SORBS', status: 'clean' },
		{ name: 'UCEProtect L1', status: 'clean' },
		{ name: 'Invaluement', status: 'clean' }
	];

	const features = [
		{
			icon: ShieldCheckIcon,
			title: 'DKIM & SPF Setup',
			description:
				'Guided setup for email authentication records. Lettr generates and validates your DKIM keys and SPF records automatically.'
		},
		{
			icon: ChartLineUpIcon,
			title: 'DMARC Monitoring',
			description:
				'Receive and parse DMARC aggregate reports. See who is sending email on your behalf and detect unauthorized senders.'
		},
		{
			icon: HardDrivesIcon,
			title: 'Dedicated IPs',
			description:
				'Get your own dedicated sending IP with full reputation control. Warm up automatically and monitor your sender score over time.'
		},
		{
			icon: ProhibitIcon,
			title: 'Suppression Lists',
			description:
				'Automatically suppress bounced addresses, complaints, and unsubscribes. Protect your sender reputation by never hitting bad addresses twice.'
		},
		{
			icon: ListChecksIcon,
			title: 'Blocklist Monitoring',
			description:
				'Continuous monitoring across major blocklists. Get alerted immediately if your sending IPs or domains appear on any blocklist.'
		},
		{
			icon: LockKeyIcon,
			title: 'Custom SSL Tracking Domains',
			description:
				'Use your own branded tracking domain with full SSL support. Links and open tracking look like they come from your domain, not a third party.'
		}
	];
</script>

<FeaturePageLayout
	title="Deliverability"
	metaDescription="Maximize email deliverability with automated DNS setup, DMARC monitoring, blocklist checks, and dedicated IPs. 99.9% inbox placement."
	label="DELIVERABILITY"
	description="Automated DNS authentication, blocklist monitoring, and dedicated IPs. Everything you need to reach the inbox."
>
	{#snippet heading()}
		Every email.<br />Every inbox.
	{/snippet}

	{#snippet children()}
		<!-- Deliverability Score -->
		<div bind:this={scoreSection} class="mx-auto max-w-3xl">
			<div data-reveal class="border border-border/50 bg-white p-8 md:p-12">
				<div class="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
					<div class="shrink-0">
						<svg width="180" height="180" viewBox="0 0 200 200" class="block">
							<!-- Background circle -->
							<circle
								cx="100"
								cy="100"
								r="80"
								fill="none"
								stroke="currentColor"
								stroke-width="6"
								class="text-border/20"
							/>
							<!-- Score arc -->
							<circle
								cx="100"
								cy="100"
								r="80"
								fill="none"
								stroke="currentColor"
								stroke-width="6"
								stroke-linecap="round"
								stroke-dasharray={circumference}
								stroke-dashoffset={dashOffset}
								transform="rotate(-90 100 100)"
								class="text-primary"
							/>
							<!-- Score text -->
							<text x="100" y="96" text-anchor="middle" dominant-baseline="central" class="fill-surface font-heading text-[2.75rem]">
								{scorePercentage}%
							</text>
						</svg>
					</div>
					<div class="text-center sm:text-left">
						<p class="text-xs font-medium tracking-wider text-muted uppercase">Deliverability Score</p>
						<p class="mt-2 font-heading text-2xl text-surface">Inbox Placement</p>
						<p class="mt-2 text-sm leading-relaxed text-muted">
							Based on authentication, reputation, and infrastructure health across all sending domains.
						</p>
						<div class="mt-4 flex flex-wrap justify-center gap-4 sm:justify-start">
							<div class="flex items-center gap-1.5">
								<div class="h-1.5 w-1.5 rounded-full bg-green-500"></div>
								<span class="text-xs text-muted">SPF verified</span>
							</div>
							<div class="flex items-center gap-1.5">
								<div class="h-1.5 w-1.5 rounded-full bg-green-500"></div>
								<span class="text-xs text-muted">DKIM verified</span>
							</div>
							<div class="flex items-center gap-1.5">
								<div class="h-1.5 w-1.5 rounded-full bg-green-500"></div>
								<span class="text-xs text-muted">DMARC pass</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- DNS Setup Card -->
		<div bind:this={dnsSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">DNS authentication</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				All your email authentication records in one place. Guided setup with real-time verification.
			</p>
			<div data-reveal class="border border-border/50 bg-white">
				<div class="border-b border-border/50 px-5 py-3">
					<div class="flex items-center gap-2">
						<span class="font-heading text-sm font-semibold text-surface">DNS Records</span>
						<span class="font-code text-xs text-muted">yourapp.com</span>
					</div>
				</div>
				<div class="divide-y divide-border/30">
					{#each dnsRecords as record}
						<div class="px-5 py-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<span class="w-14 font-code text-xs font-semibold text-primary">{record.type}</span>
									<span class="font-code text-xs text-muted">{record.record}</span>
								</div>
								<span
									class="text-[10px] font-semibold uppercase tracking-wider {record.status === 'verified'
										? 'text-green-600'
										: 'text-amber-500'}"
								>
									{record.status}
								</span>
							</div>
							<div class="mt-2 ml-17">
								<code class="bg-surface px-3 py-1.5 font-code text-[11px] text-white/80">{record.value}</code>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Blocklist Monitor -->
		<div bind:this={blocklistSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Blocklist monitoring</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Continuous scanning across major blocklists. Get alerted the moment something changes.
			</p>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each blocklists as list}
					<div data-reveal class="flex items-center justify-between border border-border/50 bg-white px-5 py-4">
						<span class="text-sm font-medium text-surface">{list.name}</span>
						<div class="flex items-center gap-1.5">
							<div class="h-2 w-2 bg-green-500"></div>
							<span class="text-xs font-medium text-green-600 capitalize">{list.status}</span>
						</div>
					</div>
				{/each}
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
