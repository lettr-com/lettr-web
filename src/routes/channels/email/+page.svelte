<script lang="ts">
	import { onMount } from 'svelte';
	import {
		GlobeSimpleIcon,
		ArrowsSplitIcon,
		RocketLaunchIcon,
		ShieldCheckIcon,
		LockKeyIcon,
		ChartLineUpIcon,
		CheckCircleIcon
	} from 'phosphor-svelte';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';

	let statsSection: HTMLElement | undefined = $state();
	let infraSection: HTMLElement | undefined = $state();
	let deliverabilitySection: HTMLElement | undefined = $state();
	let ctaSection: HTMLElement | undefined = $state();
	let registerHref: string = $state(registerUrl);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);

		const cleanups: (() => void)[] = [];

		for (const section of [statsSection, infraSection, deliverabilitySection, ctaSection]) {
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

	const stats = [
		{ value: '6T+', label: 'Emails delivered across our platform' },
		{ value: '40%', label: 'Of B2C companies use email as primary channel' },
		{ value: '99.99%', label: 'Uptime across all sending regions' },
		{ value: '<3s', label: 'Average delivery time to inbox' }
	];

	const infrastructure = [
		{
			icon: GlobeSimpleIcon,
			title: 'Multi-region',
			description: 'Sending infrastructure deployed across multiple regions. Your emails route through the closest data center to the recipient for lowest latency.'
		},
		{
			icon: ArrowsSplitIcon,
			title: 'Adaptive routing',
			description: 'Smart routing that adapts to ISP throttling, temporary blocks, and network conditions in real time. Automatic failover between sending paths.'
		},
		{
			icon: RocketLaunchIcon,
			title: 'Massive throughput',
			description: 'Handle sudden spikes in email volume without queuing delays. Our infrastructure scales elastically to match your sending patterns.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'Built-in compliance',
			description: 'GDPR-compliant data handling, automatic suppression management, and audit logs for every email sent. Compliance baked into every layer.'
		},
		{
			icon: LockKeyIcon,
			title: 'TLS everywhere',
			description: 'Opportunistic TLS for all outbound connections. DANE and MTA-STS support for domains that require strict transport security.'
		},
		{
			icon: ChartLineUpIcon,
			title: 'IP reputation',
			description: 'Dedicated and shared IP pools with active reputation management. Automatic warm-up sequences and continuous sender score monitoring.'
		}
	];

	const authItems = [
		'Automated DKIM key generation and rotation',
		'SPF record management with include directives',
		'DMARC policy setup and aggregate reporting',
		'Custom Return-Path for bounce handling',
		'ARC sealing for forwarded messages'
	];

	const visibilityItems = [
		'Real-time delivery status for every email',
		'Bounce classification and auto-suppression',
		'Open and click tracking with custom domains',
		'ISP-level delivery analytics and insights',
		'Webhook notifications for all email events'
	];
</script>

<FeaturePageLayout
	title="Email Channel"
	metaDescription="Enterprise-grade email delivery infrastructure. Multi-region, adaptive routing, 99.99% uptime, and sub-3-second delivery times."
	label="// EMAIL"
	description="Enterprise-grade email delivery infrastructure built for transactional email. Multi-region, adaptive routing, and sub-3-second delivery."
>
	{#snippet heading()}
		The most reliable way<br />to reach the inbox.
	{/snippet}

	{#snippet children()}
		<!-- Stat Cards -->
		<div bind:this={statsSection} class="mx-auto max-w-3xl">
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each stats as stat}
					<div data-reveal class="border border-border/50 bg-white p-5 text-center">
						<div class="font-heading text-2xl text-primary">{stat.value}</div>
						<p class="mt-2 text-xs leading-relaxed text-muted">{stat.label}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Infrastructure Cards -->
		<div bind:this={infraSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Built for scale</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Infrastructure designed to deliver billions of emails with consistent performance and reliability.
			</p>
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each infrastructure as item}
					<div data-reveal class="border border-border/50 bg-white p-6">
						<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
							<item.icon size={20} class="text-primary" />
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{item.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{item.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Deliverability Section -->
		<div bind:this={deliverabilitySection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Deliverability built in</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Every email is authenticated, tracked, and optimized for inbox placement from day one.
			</p>
			<div class="grid gap-5 sm:grid-cols-2">
				<!-- Authentication & Security -->
				<div data-reveal class="border border-border/50 bg-white p-6">
					<h3 class="mb-4 text-base font-semibold text-surface">Authentication & Security</h3>
					<ul class="space-y-3">
						{#each authItems as item}
							<li class="flex items-start gap-2.5">
								<CheckCircleIcon size={16} class="mt-0.5 shrink-0 text-primary" />
								<span class="text-sm leading-relaxed text-muted">{item}</span>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Visibility -->
				<div data-reveal class="border border-border/50 bg-white p-6">
					<h3 class="mb-4 text-base font-semibold text-surface">Visibility & Tracking</h3>
					<ul class="space-y-3">
						{#each visibilityItems as item}
							<li class="flex items-start gap-2.5">
								<CheckCircleIcon size={16} class="mt-0.5 shrink-0 text-primary" />
								<span class="text-sm leading-relaxed text-muted">{item}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<!-- CTA Section -->
		<div bind:this={ctaSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<div data-reveal class="border border-border/50 bg-white p-8 text-center md:p-12">
				<h2>Ready to send?</h2>
				<p class="mx-auto mt-3 max-w-lg text-body leading-relaxed text-muted">
					Get started with 3,000 free emails per month. No credit card required. Full access to every feature from day one.
				</p>
				<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<a
						href={registerHref}
						class="bg-primary px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
					>
						Start sending for free &rarr;
					</a>
					<a
						href="/demo"
						class="px-4 py-3 text-[15px] font-medium text-muted transition-colors hover:text-surface"
					>
						Book a demo
					</a>
				</div>
			</div>
		</div>
	{/snippet}
</FeaturePageLayout>
