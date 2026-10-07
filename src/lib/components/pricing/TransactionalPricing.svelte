<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import VolumeCard from './VolumeCard.svelte';
	import EnterpriseRow from './EnterpriseRow.svelte';
	import { transactionalPlans, transactionalSteps, type PlanKey } from '$lib/data/pricing';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	let step = $state(1);
	let registerHref: string = $state(registerUrl);
	let debounce: ReturnType<typeof setTimeout> | null = null;

	const current = $derived(transactionalSteps[step]);
	const plans = $derived(transactionalPlans(step));
	const highlighted: PlanKey = $derived(current.plan);
	// on phones only the plan that matches the slider is shown
	const mobilePlan: PlanKey = $derived(highlighted === 'enterprise' ? 'business' : highlighted);

	$effect(() => {
		const label = current.label;
		const value = step;
		const plan = highlighted;
		if (debounce) clearTimeout(debounce);
		debounce = setTimeout(() => {
			void capturePosthogEvent('pricing_volume_changed', { slider_value: value, volume_label: label, highlighted_plan: plan });
		}, 400);
	});

	function trackPlanCta(key: PlanKey, name: string, cta: string) {
		void capturePosthogEvent('pricing_plan_cta_clicked', {
			plan: key,
			plan_name: name,
			cta_label: cta,
			highlighted_plan: highlighted,
			slider_value: step,
			volume_label: current.label
		});
		trackSignupClick(`pricing_plan_${key}`, registerHref, {
			plan: key,
			plan_name: name,
			cta_label: cta,
			highlighted_plan: highlighted,
			volume_label: current.label
		});
	}

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
	});
</script>

<div class="mx-auto flex max-w-[1100px] flex-col gap-4">
	<h2 class="sr-only">Transactional plans</h2>
	<VolumeCard
		question="How many emails do you send per month?"
		labels={transactionalSteps.map((s) => s.label)}
		volume={current.volume}
		planName={current.name}
		price={current.price}
		showPeriod={current.plan !== 'enterprise'}
		accent="primary"
		bind:value={step}
		valueText="{current.volume} emails per month, {current.name} plan"
	/>

	<div class="grid gap-4 md:grid-cols-3">
		{#each plans as plan}
			{@const selected = highlighted === plan.key}
			<div
				class="flex-col gap-6 p-6 transition-colors duration-300 sm:p-8 {mobilePlan === plan.key ? 'flex' : 'hidden md:flex'} {selected
					? 'bg-[#23020b]'
					: 'bg-white'}"
			>
				<div class="flex flex-col gap-2.5">
					<div class="flex h-[22px] items-center justify-between">
						<h3 class="m-0 font-heading text-base leading-5 font-semibold {selected ? 'text-primary-outline' : 'text-muted'}">{plan.name}</h3>
						{#if selected}
							<span data-markdown="skip" class="bg-primary px-2 py-[3px] text-xs leading-4 font-semibold text-white">Your volume</span>
						{/if}
					</div>
					<p class="m-0 flex items-baseline gap-1.5">
						<span class="font-heading text-5xl leading-[52px] tracking-[-0.025em] {selected ? 'text-white' : 'text-surface'}">{plan.price}</span>
						<span class="text-base leading-6 {selected ? 'text-white/70' : 'text-muted'}">/mo</span>
					</p>
					<p class="m-0 text-sm leading-5 {selected ? 'text-white/70' : 'text-muted'}">{plan.blurb}</p>
				</div>

				<ul class="m-0 flex flex-1 list-none flex-col border-t p-0 {selected ? 'border-white/15' : 'border-border/60'}">
					{#each plan.features as feature, i}
						<li
							class="flex items-center gap-3 py-[11px] text-[0.9375rem] leading-[22px] {i < plan.features.length - 1
								? selected
									? 'border-b border-white/10'
									: 'border-b border-[#f0eaec]'
								: ''} {feature.excluded ? 'text-[#9ca3af]' : selected ? 'text-white/85' : 'text-surface'}"
						>
							{#if feature.excluded}
								<span class="flex h-[7px] w-[7px] shrink-0 items-center" aria-hidden="true"><span class="h-0.5 w-[7px] bg-border"></span></span>
							{:else}
								<span class="h-[7px] w-[7px] shrink-0 {selected ? 'bg-primary' : 'bg-border'}" aria-hidden="true"></span>
							{/if}
							{feature.text}
						</li>
					{/each}
				</ul>

				<Button
					href={registerHref}
					onclick={() => trackPlanCta(plan.key, plan.name, plan.cta)}
					variant={selected ? 'primary' : 'outline'}
					class="w-full"
				>
					{plan.cta}
				</Button>
			</div>
		{/each}
	</div>

	<EnterpriseRow
		description="Unlimited emails, dedicated IPs, SLA guarantee, SSO/SAML, and a dedicated account manager."
		selected={highlighted === 'enterprise'}
		placement="pricing_enterprise"
		volumeLabel={current.label}
	/>
</div>
