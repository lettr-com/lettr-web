<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRight } from 'phosphor-svelte';
	import Slider from './Slider.svelte';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	let section: HTMLElement | undefined = $state();
	let sliderValue: number = $state(1);
	let registerHref: string = $state(registerUrl);

	// Stripe lettr_marketing tiers — see Downloads/stripe-plans.csv.
	const sliderLabels = ['500', '2K', '5K', '10K', '15K', '20K', '30K', '40K+'];

	const tiers = [
		{ price: '$0', desc: '500 contacts' },
		{ price: '$10', desc: '2,000 contacts' },
		{ price: '$30', desc: '5,000 contacts' },
		{ price: '$50', desc: '10,000 contacts' },
		{ price: '$75', desc: '15,000 contacts' },
		{ price: '$100', desc: '20,000 contacts' },
		{ price: '$140', desc: '30,000 contacts' },
		{ price: '$180', desc: '40,000 contacts' }
	];

	let isEnterprise = $derived(sliderValue >= 7);
	let currentTier = $derived(tiers[sliderValue]);
	let cta = $derived(sliderValue === 0 ? 'Start for free' : 'Start campaigns');

	const features = [
		'Unlimited campaigns',
		'Drag-and-drop editor',
		'Lists & segments',
		'Advanced analytics'
	];

	let sliderDebounce: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const currentValue = sliderValue;
		const currentLabel = sliderLabels[currentValue];
		if (sliderDebounce) clearTimeout(sliderDebounce);
		sliderDebounce = setTimeout(() => {
			void capturePosthogEvent('campaigns_pricing_volume_changed', {
				slider_value: currentValue,
				volume_label: currentLabel
			});
		}, 400);
	});

	function trackPlanCta() {
		void capturePosthogEvent('campaigns_pricing_plan_cta_clicked', {
			cta_label: cta,
			slider_value: sliderValue,
			volume_label: sliderLabels[sliderValue]
		});
		trackSignupClick('campaigns_pricing_plan', registerHref, {
			cta_label: cta,
			volume_label: sliderLabels[sliderValue]
		});
	}

	function trackEnterpriseCta() {
		void capturePosthogEvent('cta_clicked', {
			placement: 'campaigns_pricing_enterprise',
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
		return createFromAnimationCleanup({
			scope: section,
			targets: '[data-pricing-animate]',
			vars: { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', clearProps: 'opacity,transform' }
		});
	});
</script>

<section bind:this={section} id="campaigns-pricing" class="pt-6 pb-16">
	<div class="mb-8" data-pricing-animate>
		<span class="mb-3 block text-sm text-muted">How many contacts do you have?</span>
		<Slider
			min={0}
			max={7}
			step={1}
			bind:value={sliderValue}
			labels={sliderLabels}
		/>
	</div>

	<div data-pricing-animate class="flex flex-col p-5 border transition-colors duration-300 {isEnterprise ? 'border-border/30 bg-white' : 'border-primary bg-white shadow-lg shadow-primary/5'}">
		<div class="flex items-baseline gap-1 mb-1">
			<span class="text-3xl font-bold text-surface">{currentTier.price}</span>
			<span class="text-sm text-muted">/mo</span>
		</div>
		<p class="text-sm text-muted mb-4">{currentTier.desc}</p>

		<ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
			{#each features as feature}
				<li class="flex items-start gap-2 text-[13px] leading-5 text-muted">
					<span class="mt-2 block w-1 h-1 rounded-full bg-border shrink-0"></span>
					<span>{feature}</span>
				</li>
			{/each}
		</ul>

		<a
			href={registerHref}
			class="flex items-center justify-center py-2.5 text-sm font-medium transition-colors bg-primary text-white hover:bg-primary/90"
			onclick={trackPlanCta}
		>
			{cta}
		</a>
	</div>

	<div data-pricing-animate class="mt-3 border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors duration-300 {isEnterprise ? 'border-primary shadow-lg shadow-primary/5' : 'border-border/30'}">
		<div>
			<h3 class="text-sm font-semibold mb-1 {isEnterprise ? 'text-primary' : 'text-surface'}">Enterprise</h3>
			<p class="text-[13px] text-muted">
				40,000+ contacts, dedicated IPs, SLA, SSO/SAML, and a dedicated account manager.
			</p>
		</div>
		<a
			href="/demo/"
			class="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors w-full sm:w-auto sm:shrink-0
				{isEnterprise
				? 'bg-primary text-white hover:bg-primary/90'
				: 'border border-border/50 text-surface hover:border-primary/30 hover:text-primary'}"
			onclick={trackEnterpriseCta}
		>
			Contact sales
			<ArrowRight size={14} />
		</a>
	</div>
</section>
