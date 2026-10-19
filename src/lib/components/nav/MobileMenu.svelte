<script lang="ts">
	import { onMount, tick } from 'svelte';
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
	import CaretRight from 'phosphor-svelte/lib/CaretRight';
	import LaneMark from '$lib/components/nav/LaneMark.svelte';
	import {
		docsUrl,
		featuredPost,
		isCurrentItem,
		menus,
		pricingHref,
		salesHref,
		signInHref,
		sisterProducts,
		type MenuKey,
		type NavItem
	} from '$lib/navigation/menu';

	interface Props {
		id: string;
		pathname: string;
		registerHref: string;
		onLinkClick: (item: NavItem, menu: MenuKey | null) => void;
		onCta: (label: 'Sign in' | 'Get started' | 'Contact sales', href: string) => void;
		onDrill: (menu: MenuKey) => void;
	}

	let { id, pathname, registerHref, onLinkClick, onCta, onDrill }: Props = $props();

	let view: MenuKey | null = $state(null);
	let list: HTMLElement | undefined = $state();

	const activeMenu = $derived(menus.find((menu) => menu.key === view));
	const post = featuredPost();
	const focusRing =
		'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary';

	async function focusFirst() {
		await tick();
		list?.querySelector<HTMLElement>('a, button')?.focus();
	}

	function drill(key: MenuKey | null) {
		view = key;
		if (key) onDrill(key);
		void focusFirst();
	}

	onMount(() => {
		void focusFirst();
	});
</script>

{#snippet itemLink(item: NavItem, menu: MenuKey | null)}
	{@const isCurrent = isCurrentItem(item, pathname)}
	<a
		href={item.href}
		target={item.external ? '_blank' : undefined}
		rel={item.external ? 'noopener noreferrer' : undefined}
		aria-current={isCurrent ? 'page' : undefined}
		class="block py-2 {focusRing}"
		onclick={() => onLinkClick(item, menu)}
	>
		<span class="flex items-center gap-1.5 text-base leading-[22px] font-semibold {isCurrent ? 'text-primary' : 'text-surface'}">
			{item.label}
			{#if item.external}
				<ArrowUpRight size={12} class="text-subtle" aria-hidden="true" />
				<span class="sr-only">(opens in a new tab)</span>
			{/if}
		</span>
		{#if item.description}
			<span class="block text-[13px] leading-[18px] text-subtle">{item.description}</span>
		{/if}
	</a>
{/snippet}

<div {id} class="nav-sheet fixed inset-x-0 top-14 bottom-0 z-40 flex flex-col border-t border-hairline bg-white lg:hidden">
	<div bind:this={list} class="flex-1 overflow-y-auto overscroll-contain">
		{#if !activeMenu}
			<ul class="flex flex-col px-4 pt-2">
				{#each menus as menu (menu.key)}
					<li class="border-b border-[#F0EAEC]">
						<button
							type="button"
							class="flex min-h-18 w-full items-center justify-between gap-4 text-left {focusRing}"
							onclick={() => drill(menu.key)}
						>
							<span>
								<span class="block text-lg leading-6 font-semibold text-surface">{menu.label}</span>
								<span class="block text-[13px] leading-[18px] text-subtle">{menu.summary}</span>
							</span>
							<CaretRight size={16} class="shrink-0 text-subtle" aria-hidden="true" />
						</button>
					</li>
				{/each}
				<li class="border-b border-[#F0EAEC]">
					<a
						href={pricingHref}
						aria-current={pathname.startsWith(pricingHref) ? 'page' : undefined}
						class="flex h-15 items-center justify-between gap-4 {focusRing}"
						onclick={() => onLinkClick({ label: 'Pricing', href: pricingHref }, null)}
					>
						<span class="flex items-center gap-2.5 text-lg font-semibold text-surface">
							<span class="size-[7px] bg-primary" aria-hidden="true"></span>
							Pricing
						</span>
						<span class="text-[13px] text-subtle">Free up to 3,000 emails</span>
					</a>
				</li>
				<li>
					<a
						href={docsUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="flex h-15 items-center justify-between {focusRing}"
						onclick={() => onLinkClick({ label: 'Docs', href: docsUrl, external: true }, null)}
					>
						<span class="text-lg font-semibold text-surface">Docs</span>
						<ArrowUpRight size={14} class="text-subtle" aria-hidden="true" />
						<span class="sr-only">(opens in a new tab)</span>
					</a>
				</li>
			</ul>
		{:else}
			<div class="nav-drill">
				<button
					type="button"
					class="flex h-13 w-full items-center gap-2 border-b border-[#F0EAEC] px-4 text-[15px] font-semibold text-surface {focusRing}"
					aria-label="Back to menu"
					onclick={() => drill(null)}
				>
					<CaretLeft size={16} aria-hidden="true" />
					{activeMenu.label}
				</button>
				{#each activeMenu.sections as section, index (section.id)}
					<section class="px-4 pt-4 pb-2 {index > 0 ? 'border-t border-[#F0EAEC]' : ''}">
						{#if section.lane}
							<h3 class="flex items-center gap-2.5 pb-1.5">
								<LaneMark lane={section.lane} size="sm" />
								<span
									class="text-surface {section.lane === 'marketing'
										? 'font-serif text-xl leading-6 tracking-[-0.02em]'
										: section.lane === 'transactional'
											? 'font-heading text-base tracking-[-0.02em]'
											: 'text-[15px] font-semibold'}"
								>
									{section.title}
								</span>
							</h3>
						{:else if section.id !== 'docs'}
							<h3 class="pb-1.5 font-code text-[11px] font-normal tracking-[0.12em] text-subtle uppercase">
								{section.title}
							</h3>
						{/if}
						{#if section.id === 'quickstarts'}
							<ul class="grid grid-cols-2 gap-2 py-1">
								{#each section.items as item (item.href)}
									<li>
										<a
											href={item.href}
											target="_blank"
											rel="noopener noreferrer"
											class="flex h-12 items-center gap-2.5 border border-hairline px-3 text-sm font-semibold text-surface {focusRing}"
											onclick={() => onLinkClick(item, activeMenu.key)}
										>
											{#if item.icon}
												<img src={item.icon} alt="" class="size-5" loading="lazy" />
											{/if}
											{item.label}
											<span class="sr-only">quickstart (opens in a new tab)</span>
										</a>
									</li>
								{/each}
							</ul>
						{:else}
							<ul class="flex flex-col">
								{#each section.items as item (item.href)}
									<li>{@render itemLink(item, activeMenu.key)}</li>
								{/each}
							</ul>
						{/if}
					</section>
				{/each}
				{#if activeMenu.key === 'resources'}
					<section class="flex flex-col gap-3 border-t border-[#F0EAEC] px-4 py-4">
						{#if post}
							<a
								href="/blog/{post.slug}/"
								class="flex flex-col gap-2 bg-background p-4 {focusRing}"
								onclick={() => onLinkClick({ label: post.title, href: `/blog/${post.slug}/` }, 'resources')}
							>
								<span class="font-code text-[11px] tracking-[0.12em] text-primary uppercase">
									{post.category} · {post.readTime}
								</span>
								<span class="font-heading text-base leading-[22px] tracking-[-0.02em] text-surface">
									{post.title}
								</span>
							</a>
						{/if}
						<div class="flex items-center gap-4">
							<p class="text-xs text-subtle">Same makers</p>
							{#each sisterProducts as product (product.href)}
								<a
									href={product.href}
									target="_blank"
									rel="noopener noreferrer"
									class="flex min-h-10 items-center gap-2 text-[13px] font-semibold text-surface {focusRing}"
									onclick={() => onLinkClick(product, 'resources')}
								>
									{#if product.icon}
										<img src={product.icon} alt="" class="size-4" loading="lazy" />
									{/if}
									{product.label}
									<span class="sr-only">(opens in a new tab)</span>
								</a>
							{/each}
						</div>
					</section>
				{/if}
			</div>
		{/if}
	</div>

	<div
		class="flex flex-col gap-3 border-t border-hairline bg-white px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
	>
		<p class="flex items-center justify-between gap-4 text-[13px] leading-[18px]">
			<span class="text-subtle">Migrating or sending at volume?</span>
			<a
				href={salesHref}
				class="flex min-h-10 items-center font-semibold text-primary {focusRing}"
				onclick={() => onCta('Contact sales', salesHref)}
			>
				Contact sales
			</a>
		</p>
		<div class="flex gap-2">
			<a
				href={signInHref}
				class="flex h-12 flex-1 items-center justify-center border border-surface text-[15px] font-semibold text-surface transition-colors active:bg-background {focusRing}"
				onclick={() => onCta('Sign in', signInHref)}
			>
				Sign in
			</a>
			<a
				href={registerHref}
				class="flex h-12 flex-1 items-center justify-center bg-primary-strong text-[15px] font-semibold text-white min-[360px]:hidden {focusRing}"
				onclick={() => onCta('Get started', registerHref)}
			>
				Get started
			</a>
		</div>
	</div>
</div>
