<script lang="ts">
	import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import Button from '$lib/components/Button.svelte';
	import CodeSwitcher from '$lib/components/home/CodeSwitcher.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import IntegrationCard from '$lib/components/integrations/IntegrationCard.svelte';
	import IntegrationLogo from '$lib/components/integrations/IntegrationLogo.svelte';
	import { categoryGround, grounds } from '$lib/components/integrations/grounds';
	import { detailJsonLd, formatCheckedDate, jsonLdScript } from '$lib/integrations/seo';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const entry = $derived(data.entry);
	const seo = $derived(entry.seo!);
	const isPartner = $derived(entry.builtBy !== 'Lettr');
	const ground = $derived(grounds[categoryGround[entry.category]]);

	const links = $derived(
		[
			entry.links.docs && { label: 'Setup guide in the Lettr docs', href: entry.links.docs },
			entry.links.listing && {
				label: entry.links.listingLabel ?? (isPartner ? `Lettr on ${entry.name}` : 'Public listing'),
				href: entry.links.listing
			},
			entry.links.source && { label: 'Source code', href: entry.links.source }
		].filter((link): link is { label: string; href: string } => Boolean(link))
	);
	// The page's main action. A partner's connector and an app Lettr ships (plugin, marketplace
	// app, n8n node) lead to the listing where it is installed; everything else to the setup guide.
	const isInstalledFromListing = $derived(
		isPartner || ['Plugin', 'Marketplace app', 'Automation platform'].includes(entry.type)
	);
	const primary = $derived.by(() => {
		if (isInstalledFromListing && entry.links.listing)
			return { href: entry.links.listing, label: isPartner ? `Open in ${entry.name}` : 'Get the integration' };
		if (entry.links.docs) return { href: entry.links.docs, label: 'Read the setup guide' };
		if (entry.links.source) return { href: entry.links.source, label: 'View the source' };
		return undefined;
	});

	const facts = $derived([
		{ term: 'Built by', value: entry.builtBy },
		{ term: 'Type', value: entry.type },
		{ term: 'Auth', value: entry.auth }
	]);
</script>

<Seo title={seo.title} description={seo.description} ogTitle={seo.heading} canonical="/integrations/{entry.slug}/" />

<svelte:head>
	{@html jsonLdScript(detailJsonLd(entry))}
</svelte:head>

<article class="pt-page pb-24">
	<a
		href="/integrations/"
		class="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
	>
		<ArrowLeftIcon
			size={15}
			class="shrink-0 transition-transform duration-200 ease-out group-hover:-translate-x-0.5 motion-reduce:transition-none"
		/>
		All integrations
	</a>

	<!-- header, facts, body: on phones the facts sit under the header; on desktop they are a sticky sidebar -->
	<div class="mt-8 grid gap-y-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-16">
		<header class="min-w-0 lg:col-start-1">
			<!-- on phones a small tile leads the header; on desktop the large one tops the sidebar -->
			<span class="mb-8 flex size-20 items-center justify-center {ground.tile} lg:hidden">
				<IntegrationLogo {entry} size={40} tone={ground.logo} onDark={ground.dark} />
			</span>
			<h1 class="text-balance">{seo.heading}</h1>
			<p class="mt-6 max-w-[35ch] type-lead text-balance text-muted">{entry.statement}</p>
			<p class="mt-4 text-caption text-muted">
				Checked <time datetime={entry.lastChecked}>{formatCheckedDate(entry.lastChecked)}</time>
			</p>
			{#if primary}
				<div class="mt-8">
					<Button href={primary.href} target="_blank" rel="noopener noreferrer">
						{primary.label}
						<ArrowUpRightIcon aria-hidden="true" />
					</Button>
				</div>
			{/if}
		</header>

		<aside aria-label="About this integration" class="lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
			<div class="hidden aspect-[4/3] items-center justify-center lg:flex {ground.tile}">
				<IntegrationLogo {entry} size={112} tone={ground.logo} onDark={ground.dark} />
			</div>
			<dl class="flex flex-col border border-border/50 bg-white lg:border-t-0">
				{#each facts as fact (fact.term)}
					<div class="flex justify-between gap-4 border-b border-border/50 px-6 py-4 text-body-sm">
						<dt class="text-muted">{fact.term}</dt>
						<dd class="text-right {fact.term === 'Built by' && isPartner ? 'font-semibold' : ''} text-surface">
							{fact.value}
						</dd>
					</div>
				{/each}
				<div class="flex justify-between gap-4 px-6 py-4 text-body-sm">
					<dt class="text-muted">Last checked</dt>
					<dd class="text-right text-surface">
						<time datetime={entry.lastChecked}>{formatCheckedDate(entry.lastChecked)}</time>
					</dd>
				</div>
			</dl>
			{#if isPartner}
				<p class="mt-4 text-caption text-muted">
					{entry.builtBy} builds and maintains this connector. This page describes what it covers as of the
					date above.
				</p>
			{/if}
		</aside>

		<div class="min-w-0 lg:col-start-1">
			<section aria-labelledby="can-do">
				<h2 id="can-do" class="type-h3 text-balance">What you can do</h2>
				<ul class="mt-6 flex flex-col gap-3">
					{#each entry.canDo as item (item)}
						<li class="flex gap-3 text-body-sm text-surface">
							<CheckIcon size={18} class="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
							{item}
						</li>
					{/each}
				</ul>
			</section>

			<section aria-labelledby="setup" class="mt-16">
				<h2 id="setup" class="type-h3 text-balance">How to set it up</h2>
				<div class="mt-6 flex flex-col gap-8">
					{#each data.setup as block, index (index)}
						{#if block.kind === 'steps'}
							<ol class="flex flex-col border-t border-border/50">
								{#each block.steps as step, stepIndex (stepIndex)}
									<li class="flex gap-4 border-b border-border/50 py-4 text-body-sm text-surface">
										<span class="w-6 shrink-0 font-code text-caption text-primary">{stepIndex + 1}</span>
										{step}
									</li>
								{/each}
							</ol>
						{:else if 'tab' in block}
							<div class="flex flex-col gap-3">
								{#if block.note}
									<p class="text-body-sm text-muted">{block.note}</p>
								{/if}
								<CodeSwitcher tabs={[block.tab]} label={block.label} height="fit" />
							</div>
						{/if}
					{/each}
				</div>
			</section>

			{#if entry.requirements?.length}
				<section aria-labelledby="requirements" class="mt-16">
					<h2 id="requirements" class="type-h3 text-balance">Requirements</h2>
					<ul class="mt-6 flex flex-col gap-2 text-body-sm text-surface">
						{#each entry.requirements as requirement (requirement)}
							<li class="flex gap-3">
								<span aria-hidden="true" class="text-primary">/</span>{requirement}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<section aria-labelledby="links" class="mt-16">
				<h2 id="links" class="type-h3 text-balance">Links</h2>
				<ul class="mt-6 flex flex-col border-t border-border/50">
					{#each links as link (link.href)}
						<li>
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								class="group flex items-center justify-between gap-4 border-b border-border/50 py-4 text-body-sm text-surface transition-colors hover:text-primary"
							>
								<span>
									{link.label}
									<span class="block text-caption text-muted">{link.href.replace(/^https?:\/\//, '')}</span>
								</span>
								<ArrowUpRightIcon size={16} class="shrink-0" aria-label="Opens in a new tab" />
							</a>
						</li>
					{/each}
				</ul>
			</section>

			{#if entry.faq?.length}
				<section aria-labelledby="questions" class="mt-16">
					<h2 id="questions" class="type-h3 text-balance">Questions</h2>
					<dl class="mt-6 flex flex-col gap-6">
						{#each entry.faq as faq (faq.question)}
							<div class="border-t border-border/50 pt-6">
								<dt class="type-h6">{faq.question}</dt>
								<dd class="mt-2 text-body-sm text-muted">{faq.answer}</dd>
							</div>
						{/each}
					</dl>
				</section>
			{/if}
		</div>
	</div>

	{#if data.related.length}
		<section aria-labelledby="related" class="mt-24">
			<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
				<h2 id="related" class="type-h3 text-balance">Related integrations</h2>
				<a href="/integrations/" class="text-sm text-muted transition-colors hover:text-primary">All integrations</a>
			</div>
			<ul class="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3">
				{#each data.related as related (related.slug)}
					<li><IntegrationCard entry={related} /></li>
				{/each}
			</ul>
		</section>
	{/if}
</article>
