<script lang="ts">
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, XIcon } from 'phosphor-svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { providers } from '$lib/data/providers';

	let { data } = $props();

	const provider = $derived.by(() => {
		const p = providers[data.provider];
		if (!p) error(404, { message: 'Provider not found' });
		return p;
	});

	let hero: HTMLElement | undefined = $state();
	let featuresSection: HTMLElement | undefined = $state();
	let pricingSection: HTMLElement | undefined = $state();
	let ctaSection: HTMLElement | undefined = $state();
	let registerHref: string = $state(registerUrl);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);

		const cleanups: (() => void)[] = [];

		if (hero) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: hero,
					targets: '[data-animate]',
					vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
				})
			);
		}

		for (const section of [featuresSection, pricingSection, ctaSection]) {
			if (section) {
				cleanups.push(
					createScrollRevealCleanup({
						scope: section,
						targets: '[data-reveal]'
					})
				);
			}
		}

		return () => cleanups.forEach((fn) => fn());
	});
</script>

<svelte:head>
	<title>Lettr vs {provider.name} | Lettr</title>
	<meta
		name="description"
		content="Compare Lettr with {provider.name}. {provider.tagline} — save up to {provider.averageSavings}% on transactional email."
	/>
	<link rel="canonical" href="https://lettr.com/compare/{provider.slug}" />
	<meta property="og:title" content="Lettr vs {provider.name}" />
	<meta
		property="og:description"
		content="{provider.tagline}. Save up to {provider.averageSavings}% on transactional email."
	/>
</svelte:head>

<section class="px-4 pt-32 pb-24">
	<div class="mx-auto max-w-[550px]">
		<!-- Back Link -->
		<a
			href="/compare"
			class="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-surface"
		>
			<ArrowLeftIcon size={14} />
			All comparisons
		</a>

		<!-- Hero -->
		<div bind:this={hero}>
			<!-- Logo vs Logo -->
			<div data-animate class="mb-8 flex items-center gap-4">
				<div class="flex h-14 w-14 items-center justify-center border border-border/50 bg-background">
					<img src="/images/logos/lettr-icon.svg" alt="Lettr" class="h-7 w-7" />
				</div>
				<span class="font-heading text-lg text-muted">vs</span>
				<div class="flex h-14 w-14 items-center justify-center border border-border/50 bg-background">
					<img src={provider.logo} alt={provider.name} class="h-7 w-7" />
				</div>
			</div>

			<span data-animate class="mb-4 inline-block font-heading text-xs tracking-[0.15em] text-primary uppercase">
				COMPARE
			</span>
			<h1 data-animate>
				Lettr vs {provider.name}
			</h1>
			<p data-animate class="mt-2 text-lg text-muted">{provider.tagline}</p>
			<p data-animate class="mt-6 text-body leading-[1.8] text-muted">
				{provider.description}
			</p>
		</div>

		<!-- Features -->
		<div bind:this={featuresSection} class="mt-16">
			<h2 data-reveal class="mb-6">Feature comparison</h2>
			<div class="space-y-3">
				{#each provider.features as feature}
					<div data-reveal class="border border-border/50 bg-white p-5">
						<div class="mb-3 flex items-start justify-between gap-4">
							<div>
								<h3 class="text-base font-semibold text-surface">{feature.label}</h3>
								<p class="mt-1 text-sm leading-relaxed text-muted">{feature.description}</p>
								{#if feature.learnMoreUrl}
									<a
										href={feature.learnMoreUrl}
										target="_blank"
										rel="noopener noreferrer"
										class="mt-1 inline-block text-xs text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
									>
										Learn more
									</a>
								{/if}
							</div>
						</div>
						<div class="flex gap-3">
							<div class="flex flex-1 items-center gap-2 border border-green-200 bg-green-50 px-3 py-2">
								<CheckIcon size={16} weight="bold" class="shrink-0 text-green-600" />
								<span class="text-sm font-medium text-green-700">Lettr</span>
							</div>
							<div class="flex flex-1 items-center gap-2 border border-border/50 bg-background px-3 py-2">
								<XIcon size={16} weight="bold" class="shrink-0 text-muted/60" />
								<span class="text-sm text-muted">
									{feature.competitorNote ?? provider.name}
								</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Pricing -->
		<div bind:this={pricingSection} class="mt-16">
			<h2 data-reveal class="mb-2">Pricing comparison</h2>
			<p data-reveal class="mb-6 text-sm text-muted">
				Monthly pricing at different email volumes. Save up to {provider.averageSavings}% compared to {provider.name}.
			</p>

			<div data-reveal class="border border-border/50 bg-white">
				<!-- Table Header -->
				<div class="grid grid-cols-3 border-b border-border/50 bg-background px-5 py-3 text-xs font-semibold tracking-wide text-muted uppercase">
					<span>Volume</span>
					<span>Lettr</span>
					<span>{provider.name}</span>
				</div>

				<!-- Table Rows -->
				{#each provider.pricingTiers as tier, i}
					<div class="grid grid-cols-3 items-center px-5 py-4 {i < provider.pricingTiers.length - 1 ? 'border-b border-border/50' : ''}">
						<span class="text-sm font-medium text-surface">{tier.volume} emails</span>
						<span class="text-sm font-semibold text-primary">${tier.lettrPrice}/mo</span>
						<div class="flex items-center gap-2">
							<span class="text-sm text-muted line-through">${tier.competitorPrice}/mo</span>
							<span class="border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
								-{Math.round(((tier.competitorPrice - tier.lettrPrice) / tier.competitorPrice) * 100)}%
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Migration CTA -->
		<div bind:this={ctaSection} class="mt-20">
			<div data-reveal class="border border-border/50 bg-white p-8 text-center md:p-12">
				<h2>Switch from {provider.name} in minutes</h2>
				<p class="mx-auto mt-3 max-w-lg text-body leading-[1.7] text-muted">
					Swap your mail driver, verify your domain, and start sending. No complex migration scripts, no
					downtime.
				</p>
				<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<a
						href={registerHref}
						class="bg-primary px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
					>
						Try Lettr free &rarr;
					</a>
					<a
						href="/compare"
						class="flex items-center gap-2 px-4 py-3 text-[15px] font-medium text-muted transition-colors hover:text-surface"
					>
						View all comparisons
						<ArrowRightIcon size={14} />
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
