<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import VolumeCard from './VolumeCard.svelte';
	import EnterpriseRow from './EnterpriseRow.svelte';
	import { marketingFeatures, marketingSteps } from '$lib/data/pricing';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	let step = $state(1);
	let registerHref: string = $state(registerUrl);
	let debounce: ReturnType<typeof setTimeout> | null = null;

	const last = marketingSteps.length - 1;
	const current = $derived(marketingSteps[step]);
	const isEnterprise = $derived(step >= last);
	const cta = $derived(step === 0 ? 'Start for free' : 'Start campaigns');

	$effect(() => {
		const label = current.label;
		const value = step;
		if (debounce) clearTimeout(debounce);
		debounce = setTimeout(() => {
			void capturePosthogEvent('campaigns_pricing_volume_changed', { slider_value: value, volume_label: label });
		}, 400);
	});

	function trackPlanCta() {
		void capturePosthogEvent('campaigns_pricing_plan_cta_clicked', { cta_label: cta, slider_value: step, volume_label: current.label });
		trackSignupClick('campaigns_pricing_plan', registerHref, { cta_label: cta, volume_label: current.label });
	}

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
	});
</script>

<div class="mx-auto flex max-w-[1100px] flex-col gap-4">
	<h2 class="sr-only">Marketing plan</h2>
	<VolumeCard
		question="How many contacts do you have?"
		labels={marketingSteps.map((s) => s.label)}
		volume={current.volume}
		planCaption={isEnterprise ? 'Enterprise plan' : 'Marketing plan'}
		price={isEnterprise ? 'Custom' : current.price}
		showPeriod={!isEnterprise}
		accent="green"
		bind:value={step}
		valueText="{current.volume} contacts, {isEnterprise ? 'Enterprise' : 'Marketing'} plan"
	/>

	<div
		class="flex flex-col gap-8 p-6 transition-colors duration-300 sm:p-10 lg:flex-row lg:justify-between lg:gap-12 {isEnterprise
			? 'bg-white'
			: 'bg-[#002010]'}"
	>
		<div class="flex shrink-0 flex-col justify-between gap-8 lg:w-[360px]">
			<div class="flex flex-col gap-2.5">
				<p class="m-0 flex items-baseline gap-2">
					<span class="font-heading text-[2.75rem] leading-[52px] tracking-[-0.025em] sm:text-[3.5rem] sm:leading-[60px] {isEnterprise ? 'text-surface' : 'text-white'}">{current.price}</span>
					<span class="text-lg leading-[26px] {isEnterprise ? 'text-muted' : 'text-white/70'}">/mo</span>
				</p>
				<p class="m-0 text-lg leading-[26px] {isEnterprise ? 'text-muted' : 'text-[#aaffd5]'}">{current.contacts}</p>
			</div>
			<Button href={registerHref} onclick={trackPlanCta} variant={isEnterprise ? 'outline' : 'green'} class="w-full">
				{cta}
			</Button>
		</div>
		<ul class="m-0 flex flex-1 list-none flex-col border-t p-0 {isEnterprise ? 'border-border/60' : 'border-white/15'}">
			{#each marketingFeatures as feature}
				<li class="flex items-center gap-3.5 border-b py-4 text-base leading-[26px] sm:text-lg {isEnterprise ? 'border-border/60 text-surface' : 'border-white/15 text-white/85'}">
					<span class="h-2 w-2 shrink-0 bg-green" aria-hidden="true"></span>
					{feature}
				</li>
			{/each}
		</ul>
	</div>

	<EnterpriseRow
		description="40,000+ contacts, dedicated IPs, SLA, SSO/SAML, and a dedicated account manager."
		selected={isEnterprise}
		tone="green"
		placement="campaigns_pricing_enterprise"
		volumeLabel={current.label}
	/>
</div>
