<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, X, ArrowRight } from 'phosphor-svelte';
	import Slider from './Slider.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	let section: HTMLElement | undefined = $state();
	let sliderValue: number = $state(1);
	let registerHref: string = $state(registerUrl);

	const sliderLabels = ['3K', '50K', '100K', '200K', '500K', '1M', '2M+'];

	type PlanKey = 'free' | 'pro' | 'business' | 'enterprise';
	type PlanFeature = string | { text: string; excluded: true };

	let highlightedPlan: PlanKey = $derived(
		sliderValue === 0 ? 'free' :
		sliderValue <= 2 ? 'pro' :
		sliderValue <= 5 ? 'business' :
		'enterprise'
	);

	let mobileVisiblePlan: PlanKey = $derived(
		highlightedPlan === 'enterprise' ? 'business' : highlightedPlan
	);

	const proTier = $derived.by(() => {
		if (sliderValue <= 1) return { price: '$15', desc: '50K emails · $0.80 / 1,000 extra' };
		return { price: '$30', desc: '100K emails · $0.80 / 1,000 extra' };
	});

	const businessTier = $derived.by(() => {
		if (sliderValue <= 3) return { price: '$110', desc: '200K emails · $0.80 / 1,000 extra' };
		if (sliderValue === 4) return { price: '$250', desc: '500K emails · $0.80 / 1,000 extra' };
		return { price: '$450', desc: '1M emails · $0.80 / 1,000 extra' };
	});

	const plans = $derived.by(() => [
		{
			key: 'free' as PlanKey,
			name: 'Free',
			price: '$0',
			period: '/mo',
			description: '3,000 emails/month · 100/day',
			features: [
				'3,000 emails per month',
				'100 emails per day',
				'1 sending domain',
				'Email API & SMTP',
				'Basic analytics',
				'7-day data retention'
			] as PlanFeature[],
			cta: 'Start for free'
		},
		{
			key: 'pro' as PlanKey,
			name: 'Pro',
			price: proTier.price,
			period: '/mo',
			description: proTier.desc,
			features: [
				'Up to 10 sending domains',
				'1 inbound route',
				'Up to 10 webhook endpoints',
				'No daily sending limit',
				'Advanced analytics',
				'30-day data retention',
				{ text: 'No dedicated IPs', excluded: true }
			] as PlanFeature[],
			cta: 'Get started'
		},
		{
			key: 'business' as PlanKey,
			name: 'Business',
			price: businessTier.price,
			period: '/mo',
			description: businessTier.desc,
			features: [
				'Unlimited sending domains',
				'10 inbound routes',
				'Unlimited webhook endpoints',
				'Everything in Pro',
				'30-day data retention',
				'Dedicated IPs (add-on)',
				'Priority support',
				'Dedicated account manager',
				'Deliverability consultation'
			] as PlanFeature[],
			cta: 'Get started'
		}
	]);

	type CellValue = string | boolean;

	const comparisonRows: Array<{
		feature: string;
		values: [CellValue, CellValue, CellValue, CellValue];
	}> = [
		{ feature: 'Monthly emails', values: ['3,000', '100K emails', '200K emails', 'Unlimited'] },
		{ feature: 'Daily limit', values: ['100 / day', 'No limit', 'No limit', 'No limit'] },
		{ feature: 'Sending domains', values: ['1 domain', '10 domains', 'Unlimited', 'Unlimited'] },
		{ feature: 'Inbound routes', values: [false, '1', '10', 'Unlimited'] },
		{ feature: 'Webhook endpoints', values: ['1', '10', 'Unlimited', 'Unlimited'] },
		{ feature: 'Email API & SMTP', values: [true, true, true, true] },
		{ feature: 'Analytics', values: ['Basic', 'Advanced', 'Advanced', 'Advanced'] },
		{ feature: 'Data retention', values: ['7 days', '30 days', '30 days', '90 days'] },
		{ feature: 'Team members', values: [true, true, true, true] },
		{ feature: 'Dedicated IPs', values: [false, false, 'Add-on', true] },
		{ feature: 'Priority support', values: [false, false, true, true] },
		{ feature: 'SLA guarantee', values: [false, false, false, true] }
	];

	let sliderDebounce: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const currentValue = sliderValue;
		const currentLabel = sliderLabels[currentValue];
		const currentPlan = highlightedPlan;
		if (sliderDebounce) clearTimeout(sliderDebounce);
		sliderDebounce = setTimeout(() => {
			void capturePosthogEvent('pricing_volume_changed', {
				slider_value: currentValue,
				volume_label: currentLabel,
				highlighted_plan: currentPlan
			});
		}, 400);
	});

	function trackPlanCta(planKey: PlanKey, planName: string, cta: string) {
		void capturePosthogEvent('pricing_plan_cta_clicked', {
			plan: planKey,
			plan_name: planName,
			cta_label: cta,
			highlighted_plan: highlightedPlan,
			slider_value: sliderValue,
			volume_label: sliderLabels[sliderValue]
		});
	}

	function trackEnterpriseCta() {
		void capturePosthogEvent('cta_clicked', {
			placement: 'pricing_enterprise',
			label: 'Contact sales',
			href: '/demo/',
			destination_type: 'internal',
			slider_value: sliderValue,
			volume_label: sliderLabels[sliderValue]
		});
	}

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
		if (!section) return;
		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-pricing-animate]',
			vars: { y: 40, duration: 0.7, stagger: 0.1 }
		});
	});
</script>

<section bind:this={section} id="pricing" class="py-16 border-b border-border/30">
	<div class="mb-10" data-pricing-animate>
		<h2 class="mb-3 text-surface">Simple, transparent <span class="text-primary">pricing.</span></h2>
		<p class="text-body text-muted">Start free. Scale as you grow. No hidden fees.</p>
	</div>

	<div class="mb-8" data-pricing-animate>
		<span class="mb-3 block text-sm text-muted">How many emails do you send per month?</span>
		<Slider
			min={0}
			max={6}
			step={1}
			bind:value={sliderValue}
			labels={sliderLabels}
		/>
	</div>

	<!-- Pricing cards -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch" data-pricing-animate>
		{#each plans as plan}
			{@const isHighlighted = highlightedPlan === plan.key}
			{@const isMobileVisible = mobileVisiblePlan === plan.key}
			<div
				class="flex-col p-5 border transition-all duration-300
					{isMobileVisible ? 'flex' : 'hidden sm:flex'}
					{isHighlighted
					? 'border-primary bg-white shadow-lg shadow-primary/5'
					: 'border-border/30 bg-white'}"
			>
				<h3 class="text-sm font-semibold mb-3 {isHighlighted ? 'text-primary' : 'text-muted'}">
					{plan.name}
				</h3>

				<div class="flex items-baseline gap-1 mb-1">
					<span class="text-2xl font-bold text-surface">{plan.price}</span>
					{#if plan.period}
						<span class="text-sm text-muted">{plan.period}</span>
					{/if}
				</div>
				<p class="text-[12px] text-muted mb-5">{plan.description}</p>

				<ul class="flex flex-col gap-2 mb-6 flex-1">
					{#each plan.features as feature}
						{#if typeof feature === 'string'}
							<li class="flex items-start gap-2 text-[13px] leading-5 text-muted">
								<span class="mt-2 block w-1 h-1 rounded-full bg-border shrink-0"></span>
								<span>{feature}</span>
							</li>
						{:else}
							<li class="flex items-start gap-2 text-[13px] leading-5 text-muted/40">
								<span class="relative mt-2 block h-1 w-1 shrink-0">
									<X size={10} class="absolute -left-[3px] -top-[3px] text-border" />
								</span>
								<span>{feature.text}</span>
							</li>
						{/if}
					{/each}
				</ul>

				<a
					href={registerHref}
					class="flex items-center justify-center py-2.5 text-sm font-medium transition-colors
						{isHighlighted
						? 'bg-primary text-white hover:bg-primary/90'
						: 'border border-border/50 text-surface hover:border-primary/30 hover:text-primary'}"
					onclick={() => trackPlanCta(plan.key, plan.name, plan.cta)}
				>
					{plan.cta}
				</a>
			</div>
		{/each}
	</div>

	<!-- Enterprise row -->
	<div data-pricing-animate class="mt-3 border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 {highlightedPlan === 'enterprise' ? 'border-primary shadow-lg shadow-primary/5' : 'border-border/30'}">
		<div>
			<h3 class="text-sm font-semibold mb-1 {highlightedPlan === 'enterprise' ? 'text-primary' : 'text-surface'}">Enterprise</h3>
			<p class="text-[13px] text-muted">
				Unlimited emails, dedicated IPs, SLA guarantee, SSO/SAML, and a dedicated account manager.
			</p>
		</div>
		<a
			href="/demo/"
			class="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors w-full sm:w-auto sm:shrink-0
				{highlightedPlan === 'enterprise'
				? 'bg-primary text-white hover:bg-primary/90'
				: 'border border-border/50 text-surface hover:border-primary/30 hover:text-primary'}"
			onclick={trackEnterpriseCta}
		>
			Contact sales
			<ArrowRight size={14} />
		</a>
	</div>

	<!-- Compare plans -->
	<div data-pricing-animate class="mt-8 border border-border/30 bg-white p-4 sm:p-6">
		<div class="mb-6 flex items-baseline justify-between gap-3">
			<h3 class="text-sm font-bold text-surface">Compare plans</h3>
			<span class="text-[11px] text-muted/70 md:hidden">Swipe to compare &rarr;</span>
		</div>

		<div class="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
			<table class="w-full min-w-[640px] table-fixed text-[13px]">
				<colgroup>
					<col class="w-[28%]" />
					<col class="w-[18%]" />
					<col class="w-[18%]" />
					<col class="w-[18%]" />
					<col class="w-[18%]" />
				</colgroup>
				<thead>
					<tr class="border-b border-border/30">
						<th class="pb-3 pr-4 text-left font-normal text-muted">Feature</th>
						<th class="pb-3 px-4 text-center font-normal text-muted">Free</th>
						<th class="pb-3 px-4 text-center font-semibold text-primary">Pro</th>
						<th class="pb-3 px-4 text-center font-normal text-muted">Business</th>
						<th class="pb-3 px-4 text-center font-normal text-muted">Enterprise</th>
					</tr>
				</thead>
				<tbody class="text-muted">
					{#each comparisonRows as row, i}
						<tr class={i < comparisonRows.length - 1 ? 'border-b border-border/20' : ''}>
							<td class="py-3 pr-4 font-medium text-surface">{row.feature}</td>
							{#each row.values as val}
								<td class="py-3 px-4 text-center">
									{#if val === true}
										<Check size={16} class="inline text-primary" weight="bold" />
									{:else if val === false}
										<X size={16} class="inline text-border" />
									{:else}
										{val}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
