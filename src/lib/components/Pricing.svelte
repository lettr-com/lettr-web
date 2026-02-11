<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { Check, X } from 'phosphor-svelte';
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
			description: '3,000 emails/mo · 100/day',
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
			price: '$110',
			period: '/mo',
			description: '200k emails · $0.80/1k extra',
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

	const sliderLabels = ['Free', '50k', '100k', '200k', '500k', '1M', 'Enterprise'];

	const proEmailsMap: Record<number, string> = {
		1: '50K emails',
		2: '100K emails',
		3: '200K emails',
		4: '500K emails',
		5: '1M emails'
	};

	let proMonthlyEmails = $derived(proEmailsMap[sliderValue] ?? '100K emails');
	let proSendingDomains = $derived(sliderValue >= 3 ? 'Unlimited' : '10 domains');

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
				labels={sliderLabels}
			/>
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
		<!-- Compare plans table -->
		<div data-pricing-animate class="mt-8">	
			<div class="p-6">
				<h3 class="mb-6 text-sm font-bold text-surface">Compare plans</h3>

				<div class="overflow-x-auto">
					<table class="w-full table-fixed text-[13px]">
						<colgroup>
							<col class="w-[34%]" />
							<col class="w-[22%]" />
							<col class="w-[22%]" />
							<col class="w-[22%]" />
						</colgroup>
						<thead>
							<tr class="border-b border-border/30">
								<th class="pb-3 pr-4 text-left font-normal text-gray-500">Feature</th>
								<th class="pb-3 px-4 text-center font-normal text-gray-500">Free</th>
								<th class="pb-3 px-4 text-center font-semibold text-primary">Pro</th>
								<th class="pb-3 pl-4 text-center font-normal text-gray-500">Enterprise</th>
							</tr>
						</thead>
						<tbody class="text-muted">
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">Monthly emails</td>
								<td class="py-3 px-4 text-center">3,000</td>
								<td class="py-3 px-4 text-center">{proMonthlyEmails}</td>
								<td class="py-3 pl-4 text-center">Unlimited</td>
							</tr>
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">Daily limit</td>
								<td class="py-3 px-4 text-center">100 / day</td>
								<td class="py-3 px-4 text-center">No limit</td>
								<td class="py-3 pl-4 text-center">No limit</td>
							</tr>
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">Sending domains</td>
								<td class="py-3 px-4 text-center">1 domain</td>
								<td class="py-3 px-4 text-center">{proSendingDomains}</td>
								<td class="py-3 pl-4 text-center">Unlimited</td>
							</tr>
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">Email API & SMTP</td>
								<td class="py-3 px-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
								<td class="py-3 px-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
								<td class="py-3 pl-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
							</tr>
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">Webhook events</td>
								<td class="py-3 px-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
								<td class="py-3 px-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
								<td class="py-3 pl-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
							</tr>
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">Analytics</td>
								<td class="py-3 px-4 text-center">Basic</td>
								<td class="py-3 px-4 text-center">Advanced</td>
								<td class="py-3 pl-4 text-center">Advanced</td>
							</tr>
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">Data retention</td>
								<td class="py-3 px-4 text-center">7 days</td>
								<td class="py-3 px-4 text-center">30 days</td>
								<td class="py-3 pl-4 text-center">30 days</td>
							</tr>
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">Team members</td>
								<td class="py-3 px-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
								<td class="py-3 px-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
								<td class="py-3 pl-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
							</tr>
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">Dedicated IPs</td>
								<td class="py-3 px-4 text-center"><X size={16} class="inline text-border" /></td>
								<td class="py-3 px-4 text-center"><X size={16} class="inline text-border" /></td>
								<td class="py-3 pl-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
							</tr>
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">Priority support</td>
								<td class="py-3 px-4 text-center"><X size={16} class="inline text-border" /></td>
								<td class="py-3 px-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
								<td class="py-3 pl-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
							</tr>
							<tr class="border-b border-border/20">
								<td class="py-3 pr-4 font-medium text-surface">SLA guarantee</td>
								<td class="py-3 px-4 text-center"><X size={16} class="inline text-border" /></td>
								<td class="py-3 px-4 text-center"><X size={16} class="inline text-border" /></td>
								<td class="py-3 pl-4 text-center"><Check size={16} class="inline text-primary" weight="bold" /></td>
							</tr>
							<tr>
								<td class="py-3 pr-4 font-medium text-surface">SSO / SAML</td>
								<td class="py-3 px-4 text-center"><X size={16} class="inline text-border" /></td>
								<td class="py-3 px-4 text-center"><X size={16} class="inline text-border" /></td>
								<td class="py-3 pl-4 text-center text-muted text-xs">TBA</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</section>
