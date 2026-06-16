<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	let { sectionClass = 'py-20 sm:py-24' }: { sectionClass?: string } = $props();

	let section: HTMLElement | undefined = $state();

	type Tile = {
		key: 'transactional' | 'marketing';
		label: string;
		unit: string;
		price: string;
		priceNote: string;
		description: string;
		highlights: string[];
	};

	const tiles: Tile[] = [
		{
			key: 'transactional',
			label: 'Transactional',
			unit: 'Pay per email',
			price: '$0',
			priceNote: '/mo',
			description: '3,000 emails every month, free. Scale up from $15/mo.',
			highlights: ['Email API & SMTP', 'No daily limit on paid plans', 'Real-time webhooks']
		},
		{
			key: 'marketing',
			label: 'Marketing',
			unit: 'Pay per contact',
			price: '$0',
			priceNote: '/mo',
			description: 'Up to 500 contacts, free. Scale up from $10/mo.',
			highlights: ['Unlimited campaigns', 'Drag-and-drop editor', 'Lists & segments']
		}
	];

	function trackTileCta(tile: Tile) {
		void capturePosthogEvent('cta_clicked', {
			placement: `pricing_preview_${tile.key}`,
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

<section bind:this={section} id="pricing" class={sectionClass}>
	<div class="mb-10 sm:mb-12 max-w-2xl" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			Pricing
		</div>
		<h2 class="mb-4 text-surface">
			Simple, usage-based<br /><span class="text-primary">pricing.</span>
		</h2>
		<p class="text-body text-muted max-w-[52ch]">
			Both products start free. Transactional bills per email, Marketing bills per contact —
			bundle them for a discount.
		</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
		{#each tiles as tile}
			{@const isTransactional = tile.key === 'transactional'}
			<a
				href="/pricing/"
				data-reveal
				onclick={() => trackTileCta(tile)}
				class="group flex flex-col p-6 border border-border/30 bg-white transition-all duration-300
					hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
			>
				<div class="mb-5 flex items-center gap-3">
					<span
						aria-hidden="true"
						class="flex h-11 w-11 shrink-0 items-center justify-center
							{isTransactional ? 'bg-[#EC104B]' : 'bg-[#00D46B]'}"
					>
						{#if isTransactional}
							<svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="block">
								<path d="M11.3896 13.832L15 17.334L12.251 20L9.5 17.334L6.75098 20L4 17.334L6.75098 14.666L9.5 12L11.3896 13.832ZM15 6.66602L11.748 9.82031L9.5 12L6.75098 9.33398L4 6.66602L6.75098 4L9.5 6.66602L12.251 4L15 6.66602Z" fill="white" />
							</svg>
						{:else}
							<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="block">
								<path d="M11 15L7 19L3 15L7 11L11 15ZM19 15L15 19L11 15L15 11L19 15ZM11 7L7 11L3 7L7 3L11 7ZM19 7L15 11L11 7L15 3L19 7Z" fill="white" />
							</svg>
						{/if}
					</span>
					<div>
						<h3 class="font-heading text-base leading-5 text-surface">{tile.label}</h3>
						<span class="text-[13px] text-muted">{tile.unit}</span>
					</div>
				</div>

				<div class="mb-1 flex items-baseline gap-1">
					<span class="text-sm text-muted">From</span>
					<span class="text-2xl font-bold text-surface">{tile.price}</span>
					<span class="text-sm text-muted">{tile.priceNote}</span>
				</div>
				<p class="mb-5 text-[13px] text-muted">{tile.description}</p>

				<ul class="mb-6 flex flex-1 flex-col gap-2">
					{#each tile.highlights as highlight}
						<li class="flex items-start gap-2 text-[13px] leading-5 text-muted">
							<span class="mt-2 block h-1 w-1 shrink-0 rounded-full bg-border"></span>
							<span>{highlight}</span>
						</li>
					{/each}
				</ul>

				<span class="inline-flex items-center gap-2 text-sm font-medium text-primary">
					See full pricing
					<ArrowRight size={14} class="transition-transform duration-300 group-hover:translate-x-1" />
				</span>
			</a>
		{/each}
	</div>
</section>
