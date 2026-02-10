<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { Check } from 'phosphor-svelte';
	import Slider from './Slider.svelte';

	gsap.registerPlugin(ScrollTrigger);

	let section: HTMLElement | undefined = $state();
	let sliderValue: number = $state(0);
	let card: HTMLElement | undefined = $state();

	const plans = [
		{
			name: 'Free',
			price: '$0',
			period: '/mo',
			description: '4,000 emails/mo · 100/day',
			features: [
				'Shared IP pool',
				'Basic analytics',
				'Email & webhook support',
				'Community support'
			],
			cta: 'Start free'
		},
		{
			name: 'Pro',
			price: '$15',
			period: '/mo',
			description: '50k emails · $0.80/1k extra',
			features: [
				'Dedicated sending domain',
				'Advanced analytics',
				'Priority support',
				'Webhooks & events',
				'Custom templates'
			],
			cta: 'Get started'
		},
		{
			name: 'Pro',
			price: '$45',
			period: '/mo',
			description: '100k emails · $0.80/1k extra',
			features: [
				'Dedicated sending domain',
				'Advanced analytics',
				'Priority support',
				'Webhooks & events',
				'Custom templates'
			],
			cta: 'Get started'
		},
		{
			name: 'Pro',
			price: '$125',
			period: '/mo',
			description: '250k emails · $0.80/1k extra',
			features: [
				'Dedicated sending domain',
				'Advanced analytics',
				'Priority support',
				'Webhooks & events',
				'Custom templates'
			],
			cta: 'Get started'
		},
		{
			name: 'Pro',
			price: '$250',
			period: '/mo',
			description: '500k emails · $0.80/1k extra',
			features: [
				'Dedicated sending domain',
				'Advanced analytics',
				'Priority support',
				'Webhooks & events',
				'Custom templates'
			],
			cta: 'Get started'
		},
		{
			name: 'Pro',
			price: '$450',
			period: '/mo',
			description: '1M emails · $0.80/1k extra',
			features: [
				'Dedicated sending domain',
				'Advanced analytics',
				'Priority support',
				'Webhooks & events',
				'Custom templates'
			],
			cta: 'Get started'
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			period: '',
			description: 'Unlimited · Dedicated IPs',
			features: [
				'Dedicated IP addresses',
				'Custom SLA',
				'SSO & SAML',
				'Dedicated account manager',
				'Volume discounts'
			],
			cta: 'Contact sales'
		}
	];

	const sliderLabels = ['Free', '50k', '100k', '250k', '500k', '1M', 'Enterprise'];

	let activePlan = $derived(plans[sliderValue]);

	function onSliderChange() {
		if (!card) return;
		gsap.killTweensOf(card);
		gsap.set(card, { opacity: 1, y: 0 });
		gsap.from(card, {
			opacity: 0.6,
			y: 6,
			duration: 0.3,
			ease: 'power2.out',
			overwrite: true
		});
	}

	onMount(() => {
		if (!section) return;

		gsap.from(section.querySelectorAll('[data-pricing-animate]'), {
			scrollTrigger: {
				trigger: section,
				start: 'top 80%',
				toggleActions: 'play none none none'
			},
			y: 40,
			opacity: 0,
			duration: 0.7,
			stagger: 0.1,
			ease: 'power3.out'
		});
	});
</script>

<section bind:this={section} id="pricing" class="px-4 py-16">
	<div class="mx-auto max-w-[550px]">
		<div class="mb-10" data-pricing-animate>
			<h2 class="mb-3 text-surface">Simple, transparent pricing</h2>
			<p class="text-body text-muted">Start free. Scale as you grow. No hidden fees.</p>
		</div>

		<div class="mb-8" data-pricing-animate>
			<div class="mb-3 flex items-center justify-between">
				<span class="text-sm font-medium text-surface">Plan</span>
				<span class="text-sm font-semibold text-primary">{activePlan.name}{activePlan.name === 'Pro' ? ` · ${activePlan.description.split(' ·')[0]}` : ''}</span>
			</div>
			<Slider
				min={0}
				max={6}
				step={1}
				bind:value={sliderValue}
				onchange={onSliderChange}
			/>
			<div class="mt-2 flex justify-between text-xs text-muted">
				{#each sliderLabels as label}
					<span>{label}</span>
				{/each}
			</div>
		</div>

		<div data-pricing-animate>
			<div
				bind:this={card}
				class="flex flex-col border border-primary bg-white p-6 shadow-lg shadow-primary/5"
			>
				<div class="mb-5">
					<h3 class="text-sm font-semibold text-primary">{activePlan.name}</h3>
					<div class="mt-2 flex items-baseline gap-1">
						<span class="text-h1 font-bold text-surface">{activePlan.price}</span>
						{#if activePlan.period}
							<span class="text-sm text-muted">{activePlan.period}</span>
						{/if}
					</div>
					<p class="mt-1 text-sm text-muted">{activePlan.description}</p>
				</div>

				<ul class="mb-6 flex flex-col gap-2.5">
					{#each activePlan.features as feature}
						<li class="flex items-start gap-2 text-sm text-muted">
							<Check size={16} class="mt-0.5 shrink-0 text-primary" weight="bold" />
							{feature}
						</li>
					{/each}
				</ul>

				<a
					href="#signup"
					class="flex items-center justify-center py-3 text-sm font-semibold bg-primary text-white transition-colors hover:bg-primary/90"
				>
					{activePlan.cta}
				</a>
			</div>
		</div>
	</div>
</section>
