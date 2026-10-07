<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import DitherSide from './DitherSide.svelte';
	import { marketingSteps, transactionalSteps, type Mode } from '$lib/data/pricing';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	/*
	 * The stops and prices come from $lib/data/pricing, the same data the
	 * /pricing page uses, so the two can't drift apart.
	 */
	const THUMB = 28;
	const modes: Mode[] = ['transactional', 'marketing'];

	// each mode opens on a paid-looking stop: 50,000 emails (Pro) or 2,000 contacts
	const defaultStep: Record<Mode, number> = { transactional: 1, marketing: 1 };

	let mode: Mode = $state('transactional');
	let stepIndex = $state(defaultStep.transactional);

	const isTransactional = $derived(mode === 'transactional');
	const steps = $derived(isTransactional ? transactionalSteps : marketingSteps);
	const last = $derived(steps.length - 1);
	const current = $derived(steps[Math.min(stepIndex, last)]);
	const isEnterprise = $derived(stepIndex >= last);

	/** Horizontal position of step `i` along the track, matching where the native thumb centres. */
	const at = (i: number) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${i / last})`;

	// plan zones above the transactional track; marketing has a single plan, so none
	const zones = $derived(
		isTransactional
			? ([
					{ label: 'Free', plan: 'free', step: 0, align: 'left' },
					{ label: 'Pro', plan: 'pro', step: 1, align: 'center' },
					{ label: 'Business', plan: 'business', step: 3, align: 'center' },
					{ label: 'Enterprise', plan: 'enterprise', step: last, align: 'right' }
				] as const)
			: []
	);

	const planCaption = $derived(
		isTransactional ? 'Transactional plan' : isEnterprise ? 'Enterprise plan' : 'Marketing plan'
	);
	const planName = $derived(isTransactional ? (current as (typeof transactionalSteps)[number]).name : '');
	const price = $derived(!isTransactional && isEnterprise ? 'Custom' : current.price);
	const showPeriod = $derived(!isEnterprise);
	const question = $derived(isTransactional ? 'How many emails per month?' : 'How many contacts do you have?');
	const valueText = $derived(
		isTransactional
			? `${current.volume} emails per month, ${planName} plan`
			: `${current.volume} contacts, ${isEnterprise ? 'Enterprise' : 'Marketing'} plan`
	);

	function setMode(next: Mode) {
		if (next === mode) return;
		mode = next;
		stepIndex = defaultStep[next];
		void capturePosthogEvent('pricing_mode_changed', { mode: next, placement: 'home_pricing' });
	}

	function onModeKeydown(event: KeyboardEvent, index: number) {
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const next = modes[(index + step + modes.length) % modes.length];
		setMode(next);
		document.getElementById(`home-pricing-tab-${next}`)?.focus();
	}

	const tiles = [
		{
			key: 'transactional',
			label: 'Transactional',
			unit: 'Pay per email',
			unitShort: 'Per email',
			description: ['3,000 emails every month, free.', 'Scale up from $15/mo.'],
			highlights: ['Email API & SMTP', 'No daily limit on paid plans', 'Real-time webhooks']
		},
		{
			key: 'marketing',
			label: 'Marketing',
			unit: 'Pay per contact',
			unitShort: 'Per contact',
			description: ['Up to 500 contacts, free.', 'Scale up from $10/mo.'],
			highlights: ['Unlimited campaigns', 'Drag-and-drop editor', 'Lists & segments']
		}
	];

	function trackTile(key: string) {
		void capturePosthogEvent('cta_clicked', {
			placement: `pricing_preview_${key}`,
			label: 'See full pricing',
			href: `/pricing/?plan=${key}`,
			destination_type: 'internal'
		});
	}

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<style>
	/* Native range input, restyled: square crimson thumb on a slim gray track that fills as it moves */
	.volume-range {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 28px;
		margin: 0;
		background: transparent;
		cursor: pointer;
	}

	.volume-range::-webkit-slider-runnable-track {
		height: 8px;
		background: linear-gradient(to right, var(--accent) var(--fill), #e5e7eb var(--fill));
	}

	.volume-range::-moz-range-track {
		height: 8px;
		background: #e5e7eb;
	}

	.volume-range::-moz-range-progress {
		height: 8px;
		background: var(--accent);
	}

	.volume-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 28px;
		height: 28px;
		margin-top: -10px;
		background: var(--accent);
		border: 4px solid var(--halo);
		border-radius: 0;
		box-sizing: border-box;
	}

	.volume-range::-moz-range-thumb {
		width: 28px;
		height: 28px;
		background: var(--accent);
		border: 4px solid var(--halo);
		border-radius: 0;
		box-sizing: border-box;
	}

	.volume-range:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 6px;
	}
</style>

<section bind:this={section} id="pricing" aria-labelledby="pricing-heading" class="py-14 md:py-24">
	<div data-reveal class="mx-auto mb-10 flex max-w-[860px] flex-col items-center gap-4 text-center md:mb-14">
		<h2
			id="pricing-heading"
			class="font-heading text-balance text-[1.875rem] leading-[1.27] tracking-[-0.02em] text-surface md:text-[2.625rem] md:leading-[50px]"
		>
			Simple, usage-based
			<em class="block font-serif text-[2.125rem] leading-none font-medium text-primary md:text-[2.875rem]">pricing.</em>
		</h2>
		<p class="max-w-[520px] text-[1.0625rem] leading-[1.5] text-surface md:text-[1.1875rem]">
			Start free. Transactional is billed per email, Marketing per contact. Bundle both and save.
		</p>
	</div>

	<div data-reveal class="mx-auto flex max-w-[1100px] flex-col gap-4">
		<div
			data-markdown="skip"
			class="flex flex-col gap-8 bg-white px-5 py-6 md:gap-9 md:p-10"
			style="--accent: {isTransactional ? '#ec104b' : '#00c851'}; --halo: {isTransactional ? '#fde7ed' : '#d9f7e6'}"
		>
			<div class="grid gap-x-6 gap-y-5 md:grid-cols-[1fr_auto] md:gap-y-3">
				<div role="tablist" aria-label="Pricing mode" class="order-first grid grid-cols-2 gap-1.5 md:order-none md:col-start-2 md:row-start-1 md:flex md:self-center">
					{#each modes as m, i}
						{@const active = mode === m}
						<button
							type="button"
							role="tab"
							id="home-pricing-tab-{m}"
							aria-selected={active}
							tabindex={active ? 0 : -1}
							onclick={() => setMode(m)}
							onkeydown={(event) => onModeKeydown(event, i)}
							class="cursor-pointer border-2 px-3.5 py-1.5 text-center font-heading text-[13px] leading-5 transition-colors {active
								? m === 'transactional'
									? 'border-primary bg-[#23020b] text-white'
									: 'border-green bg-[#002010] text-white'
								: 'border-border/60 bg-white text-muted hover:border-primary-outline hover:text-surface'}"
						>
							{m === 'transactional' ? 'Transactional' : 'Marketing'}
						</button>
					{/each}
				</div>

				<label for="volume-range" class="text-[0.9375rem] leading-[22px] text-muted md:col-start-1 md:row-start-1 md:self-center md:text-base md:leading-6">{question}</label>
				<p class="m-0 font-heading text-[2.75rem] leading-[46px] tracking-[-0.025em] text-surface md:col-start-1 md:row-start-2 md:self-end md:text-[4rem] md:leading-[64px]" aria-live="polite">
					{current.volume}
				</p>
				<div class="flex items-baseline justify-between gap-2 border-t border-border/60 pt-4 md:col-start-2 md:row-start-2 md:flex-col md:items-end md:gap-2.5 md:border-t-0 md:pt-0">
					<p class="m-0 text-[0.9375rem] leading-[22px] text-muted md:text-base md:leading-6">{planCaption}</p>
					<p class="m-0 flex h-9 flex-wrap content-end items-baseline gap-x-2 md:h-14 md:gap-x-3">
						{#if planName}
							<span class="font-heading text-[1.375rem] leading-7 tracking-[-0.02em] text-surface md:text-4xl md:leading-10">{planName}</span>
						{/if}
						<span
							class="font-serif leading-none font-medium italic {isTransactional
								? 'text-primary text-[1.75rem] md:text-[2.75rem]'
								: 'text-[#00873d] text-[2.25rem] md:text-[3.5rem]'}"
						>
							{price}
						</span>
						{#if showPeriod}<span class="text-sm text-muted md:text-base">/mo</span>{/if}
					</p>
				</div>
			</div>

			<div class="flex flex-col gap-3.5">
				<div class="relative h-[18px]" aria-hidden="true">
					{#each zones as zone}
						<span
							class="absolute top-0 text-[11px] leading-[14px] tracking-[0.06em] transition-colors {zone.plan === (current as { plan?: string }).plan ? 'text-[#d40e43]' : 'text-muted'} {zone.plan === 'business' ? 'hidden sm:block' : ''}"
							style="left: {zone.align === 'right' ? 'auto' : at(zone.step)}; right: {zone.align === 'right' ? '0' : 'auto'}; transform: translateX({zone.align === 'center' ? '-50%' : '0'})"
						>
							{zone.label}
						</span>
					{/each}
				</div>

				<div class="relative">
					<div class="pointer-events-none absolute inset-x-0 top-1 h-5" aria-hidden="true">
						{#each steps as _, i}
							<span class="absolute top-0 h-5 w-0.5 -translate-x-1/2 bg-border" style="left: {at(i)}"></span>
						{/each}
					</div>
					<input
						id="volume-range"
						type="range"
						min={0}
						max={last}
						step={1}
						bind:value={stepIndex}
						class="volume-range relative"
						style="--fill: {at(stepIndex)}"
						aria-valuetext={valueText}
					/>
				</div>

				<div class="relative h-4" aria-hidden="true">
					{#each steps as step, i}
						<span
							class="absolute top-0 w-10 -translate-x-1/2 text-center font-code text-[11px] leading-4 md:text-[13px] {i === stepIndex ? 'text-surface' : 'text-muted'} {i % 2 === 1 ? 'hidden sm:block' : ''}"
							style="left: {at(i)}"
						>
							{step.label}
						</span>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			{#each tiles as tile}
				{@const isTransactional = tile.key === 'transactional'}
				<div class="relative flex flex-col gap-5 overflow-hidden p-6 md:gap-7 md:p-8 {isTransactional ? 'bg-[#23020b]' : 'bg-[#002010]'}">
					<DitherSide color={isTransactional ? '#ec104b' : '#00c851'} variant={isTransactional ? 'ripple' : 'noise'} width={isTransactional ? 20 : 30} />
					<div class="relative flex flex-col gap-3.5 md:gap-5">
						<div class="flex h-11 items-center justify-between gap-3">
							<h3
								class="m-0 text-white {isTransactional
									? 'font-heading text-[1.625rem] tracking-[-0.05em] md:text-[2rem]'
									: 'font-serif text-[1.875rem] tracking-[-0.04em] md:text-4xl'}"
							>
								{tile.label}.
							</h3>
							<span class="shrink-0 border px-2 py-0.5 font-code text-[11px] whitespace-nowrap leading-[14px] tracking-[0.02em] md:px-2.5 md:py-1 {isTransactional ? 'border-primary text-primary-outline' : 'border-green text-[#aaffd5]'}">
								<span class="lg:hidden" data-markdown="skip">{tile.unitShort}</span><span class="hidden lg:inline">{tile.unit}</span>
							</span>
						</div>
						<p class="m-0 text-[1.1875rem] leading-[1.4] text-white md:text-[1.375rem]">
							{tile.description[0]}<br class="hidden lg:block" />
							<span class="lg:hidden"> </span>{tile.description[1]}
						</p>
					</div>

					<ul class="relative m-0 flex list-none flex-col p-0">
						{#each tile.highlights as highlight, i}
							<li class="flex items-center gap-3 border-t border-white/15 py-3 text-base leading-[22px] text-white/85 md:gap-3.5 md:py-3.5 md:text-[1.0625rem] md:leading-6 {i === tile.highlights.length - 1 ? 'border-b' : ''}">
								<span class="h-2 w-2 shrink-0 {isTransactional ? 'bg-primary' : 'bg-green'}"></span>
								{highlight}
							</li>
						{/each}
					</ul>

					<div class="relative flex items-center justify-between">
						<a
							href="/pricing/?plan={tile.key}"
							onclick={() => trackTile(tile.key)}
							class="text-[0.9375rem] font-semibold text-white underline-offset-4 hover:underline md:text-base"
						>
							See full pricing
						</a>
						<a
							href="/pricing/?plan={tile.key}"
							onclick={() => trackTile(tile.key)}
							tabindex="-1"
							aria-hidden="true"
							class="flex h-10 w-10 items-center justify-center transition-transform duration-300 hover:translate-x-1 md:h-11 md:w-11 {isTransactional ? 'bg-primary text-white' : 'bg-green text-[#002010]'}"
						>
							<ArrowRightIcon size={22} weight="bold" />
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
