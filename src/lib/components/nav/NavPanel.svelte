<script lang="ts">
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	import LaneMark from '$lib/components/nav/LaneMark.svelte';
	import {
		docsUrl,
		featuredPost,
		isCurrentItem,
		pricingHref,
		sisterProducts,
		type NavItem,
		type NavMenu,
		type NavSection
	} from '$lib/navigation/menu';

	interface Props {
		menu: NavMenu;
		id: string;
		pathname: string;
		onLinkClick: (item: NavItem) => void;
	}

	let { menu, id, pathname, onLinkClick }: Props = $props();

	const post = featuredPost();
	const section = (sectionId: string): NavSection | undefined =>
		menu.sections.find((candidate) => candidate.id === sectionId);
	const focusRing =
		'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
</script>

{#snippet itemLink(item: NavItem)}
	{@const isCurrent = isCurrentItem(item, pathname)}
	<a
		href={item.href}
		target={item.external ? '_blank' : undefined}
		rel={item.external ? 'noopener noreferrer' : undefined}
		aria-current={isCurrent ? 'page' : undefined}
		class="block px-3 py-2.5 transition-colors hover:bg-background active:bg-primary-soft {focusRing} {isCurrent
			? 'bg-background shadow-[inset_2px_0_0_var(--color-primary)]'
			: ''}"
		onclick={() => onLinkClick(item)}
	>
		<span class="flex items-center gap-1.5 text-sm leading-5 font-semibold text-surface">
			{item.label}
			{#if item.external}
				<ArrowUpRight size={11} class="text-subtle" aria-hidden="true" />
				<span class="sr-only">(opens in a new tab)</span>
			{/if}
		</span>
		{#if item.description}
			<span class="mt-0.5 block text-[13px] leading-[19px] text-subtle">{item.description}</span>
		{/if}
	</a>
{/snippet}

{#snippet columnLabel(text: string)}
	<p class="px-3 pb-2.5 font-code text-[11px] tracking-[0.12em] text-subtle uppercase">{text}</p>
{/snippet}

<div {id}>
	{#if menu.key === 'product'}
		<div class="mx-auto grid max-w-[1200px] grid-cols-[1fr_1fr_1.85fr] gap-10 px-6 py-7">
			{#each menu.sections as lane (lane.id)}
				<div class="flex flex-col gap-1 {lane.lane === 'shared' ? 'border-l border-hairline pl-10' : ''}">
					<div class="flex items-center gap-3 px-3 pb-3.5">
						<LaneMark lane={lane.lane ?? 'shared'} />
						<div>
							<p
								class="text-surface {lane.lane === 'transactional'
									? 'font-heading text-lg leading-[22px] tracking-[-0.02em]'
									: lane.lane === 'marketing'
										? 'font-serif text-[22px] leading-[22px] tracking-[-0.02em]'
										: 'text-base leading-[22px] font-semibold tracking-[-0.01em]'}"
							>
								{lane.title}
							</p>
							<p class="text-xs leading-4 text-subtle">{lane.subtitle}</p>
						</div>
					</div>
					<ul
						class={lane.lane === 'shared'
							? 'grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-2 gap-y-1'
							: 'flex flex-col gap-1'}
					>
						{#each lane.items as item (item.href)}
							<li>{@render itemLink(item)}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
		<div class="bg-background">
			<div
				class="mx-auto flex h-13 max-w-[1200px] items-center justify-between px-6 text-[13px] leading-[19px]"
			>
				<p class="flex items-center gap-2.5 px-3 text-subtle">
					<span class="size-1.5 bg-primary" aria-hidden="true"></span>
					Free tier: 3,000 emails a month, no credit card.
					<a
						href="/free-email-api/"
						class="font-semibold text-surface underline-offset-4 hover:underline {focusRing}"
						onclick={() => onLinkClick({ label: 'Free email API', href: '/free-email-api/' })}
					>
						Free email API
					</a>
				</p>
				<a
					href={pricingHref}
					class="group flex items-center gap-1.5 px-3 font-semibold text-primary {focusRing}"
					onclick={() => onLinkClick({ label: 'Compare plans and prices', href: pricingHref })}
				>
					Compare plans and prices
					<ArrowRight size={12} class="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
				</a>
			</div>
		</div>
	{:else if menu.key === 'developers'}
		{@const docs = section('docs')?.items[0]}
		{@const reference = section('reference')}
		{@const quickstarts = section('quickstarts')}
		<div class="mx-auto grid max-w-[1200px] grid-cols-[1fr_1fr_1.4fr] gap-10 px-6 pt-7 pb-8">
			{#if docs}
				<a
					href={docs.href}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex flex-col justify-between gap-5 bg-plum p-6 {focusRing}"
					onclick={() => onLinkClick(docs)}
				>
					<span class="flex flex-col gap-2">
						<span class="font-code text-[11px] tracking-[0.12em] text-primary-outline uppercase">
							Documentation
						</span>
						<span class="font-heading text-[22px] leading-7 tracking-[-0.02em] text-white">
							Send your first email in a few minutes.
						</span>
					</span>
					<span class="flex flex-col gap-3.5">
						<code
							class="block overflow-hidden bg-plum-raised px-3 py-2.5 text-xs leading-[18px] text-ellipsis whitespace-nowrap text-[#F9A8B8]"
							aria-hidden="true">$ composer require lettr/lettr-laravel</code
						>
						<span class="flex items-center gap-1.5 text-[13px] font-semibold text-white">
							Open docs.lettr.com
							<ArrowUpRight
								size={12}
								class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								aria-hidden="true"
							/>
							<span class="sr-only">(opens in a new tab)</span>
						</span>
					</span>
				</a>
			{/if}
			{#if reference}
				<div class="flex flex-col gap-1">
					{@render columnLabel(reference.title)}
					<ul class="flex flex-col gap-1">
						{#each reference.items as item (item.href)}
							<li>{@render itemLink(item)}</li>
						{/each}
					</ul>
				</div>
			{/if}
			{#if quickstarts}
				<div class="flex flex-col gap-1">
					<p class="pb-2.5 font-code text-[11px] tracking-[0.12em] text-subtle uppercase">
						{quickstarts.title}
					</p>
					<ul class="grid grid-cols-2 gap-2 xl:grid-cols-3">
						{#each quickstarts.items as item (item.href)}
							<li>
								<a
									href={item.href}
									target={item.external ? '_blank' : undefined}
									rel={item.external ? 'noopener noreferrer' : undefined}
									class="flex h-13 items-center gap-2.5 border border-hairline px-3.5 text-sm font-semibold text-surface transition-colors hover:border-primary-outline hover:bg-background {focusRing}"
									onclick={() => onLinkClick(item)}
								>
									{#if item.icon}
										<img src={item.icon} alt="" class="size-5" loading="lazy" />
									{/if}
									{item.label}
									{#if item.external}
										<span class="sr-only">quickstart (opens in a new tab)</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
					<p class="pt-3 text-[13px] leading-[19px] text-subtle">
						Another language? The <a
							href="{docsUrl}/api-reference/introduction"
							target="_blank"
							rel="noopener noreferrer"
							class="font-semibold text-surface underline-offset-4 hover:underline {focusRing}"
							onclick={() =>
								onLinkClick({ label: 'REST API', href: `${docsUrl}/api-reference/introduction`, external: true })}
							>REST API</a
						> works from anything that speaks HTTP.
					</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="mx-auto grid max-w-[1200px] grid-cols-[1fr_1fr_1.6fr] gap-10 px-6 pt-7 pb-8">
			{#each menu.sections as group (group.id)}
				<div class="flex flex-col gap-1">
					{@render columnLabel(group.title)}
					<ul class="flex flex-col gap-1">
						{#each group.items as item (item.href)}
							<li>{@render itemLink(item)}</li>
						{/each}
					</ul>
				</div>
			{/each}
			<div class="flex flex-col gap-4">
				{#if post}
					<a
						href="/blog/{post.slug}/"
						class="group flex flex-col gap-3 bg-background p-6 transition-colors hover:bg-primary-soft {focusRing}"
						onclick={() => onLinkClick({ label: post.title, href: `/blog/${post.slug}/` })}
					>
						<span class="font-code text-[11px] tracking-[0.12em] text-primary uppercase">
							From the blog · {post.readTime}
						</span>
						<span class="font-heading text-xl leading-[27px] tracking-[-0.02em] text-surface">
							{post.title}
						</span>
						<span class="flex items-center gap-1.5 pt-1 text-[13px] font-semibold text-surface">
							Read the article
							<ArrowRight size={12} class="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
						</span>
					</a>
				{/if}
				<div class="flex items-center gap-4 px-1">
					<p class="text-xs text-subtle">Same makers</p>
					{#each sisterProducts as product (product.href)}
						<a
							href={product.href}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-[13px] font-semibold text-surface underline-offset-4 hover:underline {focusRing}"
							onclick={() => onLinkClick(product)}
						>
							{#if product.icon}
								<img src={product.icon} alt="" class="size-4" loading="lazy" />
							{/if}
							{product.label}
							<span class="sr-only">(opens in a new tab)</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
