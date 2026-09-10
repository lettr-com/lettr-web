<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRightIcon';
	import Slider from '$lib/components/Slider.svelte';
	import SectionLabel from './SectionLabel.svelte';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	/*
	 * Volume steps and plan mapping mirror the public tiers in the site's
	 * structured data (Free 3,000/mo, Pro from $15 up to 100,000, Business from
	 * $110 up to 200,000). Exact per-step prices live on /pricing.
	 */
	const steps = [
		{ label: '3k', volume: 3_000, plan: 'Free', price: '$0' },
		{ label: '10k', volume: 10_000, plan: 'Pro', price: 'from $15' },
		{ label: '25k', volume: 25_000, plan: 'Pro', price: 'from $15' },
		{ label: '50k', volume: 50_000, plan: 'Pro', price: 'from $15' },
		{ label: '100k', volume: 100_000, plan: 'Pro', price: 'from $15' },
		{ label: '200k', volume: 200_000, plan: 'Business', price: 'from $110' }
	];

	let stepIndex = $state(0);
	let current = $derived(steps[stepIndex]);
	const formatter = new Intl.NumberFormat('en-US');

	const tiles = [
		{
			key: 'transactional',
			label: 'Transactional',
			unit: 'Pay per email',
			description: '3,000 emails every month, free. Scale up from $15/mo.',
			highlights: ['Email API & SMTP', 'No daily limit on paid plans', 'Real-time webhooks']
		},
		{
			key: 'marketing',
			label: 'Marketing',
			unit: 'Pay per contact',
			description: 'Up to 500 contacts, free. Scale up from $10/mo.',
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

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} id="pricing" class="border-b border-border/30 py-20 sm:py-24">
	<div data-reveal class="mb-10 max-w-[720px]">
		<SectionLabel index={5} total={5} label="Pricing" />
		<h2 class="mb-4 text-[2rem] leading-[1.15] tracking-[-0.02em] text-surface sm:text-[2.5rem]">
			Simple, usage-based <span class="text-primary">pricing.</span>
		</h2>
		<p class="text-body text-muted">
			Both products start free. Transactional bills per email, Marketing bills per contact.
			Bundle them for a discount.
		</p>
	</div>

	<div data-reveal class="mb-6 border border-border/40 bg-white p-6 sm:p-8">
		<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="text-sm text-muted">How many emails do you send per month?</p>
				<p class="font-heading text-3xl leading-none text-surface tabular-nums">{formatter.format(current.volume)}</p>
			</div>
			<div class="text-right">
				<p class="text-sm text-muted">Transactional plan</p>
				<p class="font-heading text-2xl leading-none text-surface">
					{current.plan} <span class="text-primary">{current.price}</span><span class="text-sm text-muted">/mo</span>
				</p>
			</div>
		</div>
		<Slider
			min={0}
			max={steps.length - 1}
			step={1}
			bind:value={stepIndex}
			labels={steps.map((s) => s.label)}
		/>
	</div>

	<div class="grid grid-cols-1 gap-px border border-border/40 bg-border/40 sm:grid-cols-2">
		{#each tiles as tile}
			<a
				href="/pricing/"
				data-reveal
				onclick={() => trackTile(tile.key)}
				class="group flex flex-col bg-white p-6 transition-colors hover:bg-primary/[0.03]"
			>
				<div class="mb-4 flex items-baseline justify-between">
					<h3 class="text-lg font-medium text-surface">{tile.label}</h3>
					<span class="text-sm text-muted">{tile.unit}</span>
				</div>
				<p class="mb-5 text-sm text-muted">{tile.description}</p>
				<ul class="mb-6 flex flex-1 flex-col gap-2">
					{#each tile.highlights as highlight}
						<li class="flex items-start gap-2 text-sm text-muted">
							<span class="mt-2 block h-1 w-1 shrink-0 bg-primary"></span>
							<span>{highlight}</span>
						</li>
					{/each}
				</ul>
				<span class="inline-flex items-center gap-2 text-sm font-semibold text-primary">
					See full pricing
					<ArrowRight size={14} class="transition-transform duration-300 group-hover:translate-x-1" />
				</span>
			</a>
		{/each}
	</div>
</section>
