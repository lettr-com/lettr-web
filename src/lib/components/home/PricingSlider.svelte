<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import DitherSide from './DitherSide.svelte';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	/*
	 * Volume steps and plan mapping mirror the public tiers in the site's
	 * structured data (Free 3,000/mo, Pro from $15 up to 100,000, Business from
	 * $110 up to 200,000). Exact per-step prices live on /pricing.
	 */
	const steps = [
		{ label: '3k', volume: 3_000, plan: 'Free', price: '$0', from: false },
		{ label: '10k', volume: 10_000, plan: 'Pro', price: '$15', from: true },
		{ label: '25k', volume: 25_000, plan: 'Pro', price: '$15', from: true },
		{ label: '50k', volume: 50_000, plan: 'Pro', price: '$15', from: true },
		{ label: '100k', volume: 100_000, plan: 'Pro', price: '$15', from: true },
		{ label: '200k', volume: 200_000, plan: 'Business', price: '$110', from: true }
	];

	const THUMB = 28;
	const last = steps.length - 1;

	let stepIndex = $state(0);
	let current = $derived(steps[stepIndex]);
	const formatter = new Intl.NumberFormat('en-US');

	/** Horizontal position of step `i` along the track, matching where the native thumb centres. */
	const at = (i: number) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${i / last})`;

	const zones = [
		{ label: 'Free', step: 0, align: 'left' },
		{ label: 'Pro', step: 1, align: 'center' },
		{ label: 'Business', step: last, align: 'right' }
	] as const;

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
			href: '/pricing/',
			destination_type: 'internal'
		});
	}

	function zoneOf(index: number) {
		return index === 0 ? 'Free' : index === last ? 'Business' : 'Pro';
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
		background: linear-gradient(to right, #ec104b var(--fill), #e5e7eb var(--fill));
	}

	.volume-range::-moz-range-track {
		height: 8px;
		background: #e5e7eb;
	}

	.volume-range::-moz-range-progress {
		height: 8px;
		background: #ec104b;
	}

	.volume-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 28px;
		height: 28px;
		margin-top: -10px;
		background: #ec104b;
		border: 4px solid #fde7ed;
		border-radius: 0;
		box-sizing: border-box;
	}

	.volume-range::-moz-range-thumb {
		width: 28px;
		height: 28px;
		background: #ec104b;
		border: 4px solid #fde7ed;
		border-radius: 0;
		box-sizing: border-box;
	}

	.volume-range:focus-visible {
		outline: 2px solid #ec104b;
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
			Both products start free. Transactional bills per email, Marketing bills per contact. Bundle them for a discount.
		</p>
	</div>

	<div data-reveal class="mx-auto flex max-w-[1100px] flex-col gap-4">
		<div class="flex flex-col gap-8 bg-white px-5 py-6 md:gap-9 md:p-10">
			<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div class="flex flex-col gap-2 md:gap-2.5">
					<label for="volume-range" class="text-[0.9375rem] leading-[22px] text-muted md:text-base md:leading-6">How many emails do you send per month?</label>
					<p class="m-0 font-heading text-[2.75rem] leading-[46px] tracking-[-0.025em] text-surface md:text-[4rem] md:leading-[64px]" aria-live="polite">
						{formatter.format(current.volume)}
					</p>
				</div>
				<div class="flex items-baseline justify-between gap-2 border-t border-border/60 pt-4 md:flex-col md:items-end md:gap-2.5 md:border-t-0 md:pt-0">
					<p class="m-0 text-[0.9375rem] leading-[22px] text-muted md:text-base md:leading-6">Transactional plan</p>
					<p class="m-0 flex items-baseline gap-2 md:gap-3">
						<span class="font-heading text-[1.375rem] leading-7 tracking-[-0.02em] text-surface md:text-4xl md:leading-10">{current.plan}</span>
						<span class="flex items-baseline gap-1.5">
							{#if current.from}<span class="text-sm text-muted">from</span>{/if}
							<span class="font-serif text-[1.75rem] leading-[30px] font-medium text-primary italic md:text-[2.75rem] md:leading-11">{current.price}</span>
						</span>
						<span class="text-sm text-muted md:text-base">/mo</span>
					</p>
				</div>
			</div>

			<div class="flex flex-col gap-3.5">
				<div class="relative h-[18px]" aria-hidden="true">
					{#each zones as zone}
						<span
							class="absolute top-0 text-[11px] leading-[14px] tracking-[0.06em] transition-colors {zoneOf(stepIndex) === zone.label ? 'text-[#d40e43]' : 'text-muted'}"
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
						aria-valuetext="{formatter.format(current.volume)} emails per month, {current.plan} plan"
					/>
				</div>

				<div class="relative h-4" aria-hidden="true">
					{#each steps as step, i}
						<span
							class="absolute top-0 w-10 -translate-x-1/2 text-center font-code text-[11px] leading-4 md:text-[13px] {i === stepIndex ? 'text-surface' : 'text-muted'}"
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
				<a
					href="/pricing/"
					onclick={() => trackTile(tile.key)}
					class="group relative flex flex-col gap-5 overflow-hidden p-6 md:gap-7 md:p-8 {isTransactional ? 'bg-[#23020b]' : 'bg-[#002010]'}"
				>
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
								<span class="lg:hidden">{tile.unitShort}</span><span class="hidden lg:inline">{tile.unit}</span>
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

					<span class="relative flex items-center justify-between">
						<span class="text-[0.9375rem] font-semibold text-white md:text-base">See full pricing</span>
						<span
							class="flex h-10 w-10 items-center justify-center transition-transform duration-300 group-hover:translate-x-1 md:h-11 md:w-11 {isTransactional ? 'bg-primary text-white' : 'bg-green text-[#002010]'}"
							aria-hidden="true"
						>
							<ArrowRightIcon size={22} weight="bold" />
						</span>
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>
