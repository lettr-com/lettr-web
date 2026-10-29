<script lang="ts">
	import { onMount } from 'svelte';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import ArrowDownIcon from 'phosphor-svelte/lib/ArrowDownIcon';
	import Seo from '$lib/components/Seo.svelte';
	import ArtImage from '$lib/components/blog/ArtImage.svelte';
	import { posts, type PostMeta } from '$lib/data/posts';
	import { deliverabilityPath, mostReadSlugs, postsBySlug } from '$lib/blog/collections';
	import { jsonLdScript } from '$lib/utils/jsonLd';
	import { basicPageJsonLd } from '$lib/utils/pageJsonLd';
	import { noWidow } from '$lib/utils/typography';

	const topics = [
		{ category: 'Product', label: 'Product' },
		{ category: 'Deliverability', label: 'Deliverability' },
		{ category: 'Engineering', label: 'Engineering' },
		{ category: 'Fundamentals', label: 'Fundamentals' },
		{ category: 'Case study', label: 'Case studies' }
	].map((topic) => ({ ...topic, count: posts.filter((post) => post.category === topic.category).length }));

	/**
	 * Experiment: the index at the homepage's full content width instead of the
	 * 848px column articles use. Set to false to go back; nothing else changes.
	 */
	const wide = true;

	const [featured, ...afterFeatured] = posts;
	const latest = afterFeatured.slice(0, 6);
	const archive = afterFeatured.slice(6);
	const mostRead = postsBySlug(mostReadSlugs);
	const path = postsBySlug(deliverabilityPath.slugs);

	let topic = $state<string | null>(null);
	/** posts.ts is newest first; the archive and results lists can be flipped. */
	let newestFirst = $state(true);
	let query = $state('');
	let search: HTMLInputElement | undefined = $state();

	const filtering = $derived(topic !== null || query.trim() !== '');
	const archiveInOrder = $derived(newestFirst ? archive : [...archive].reverse());
	const results = $derived.by(() => {
		const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
		const ordered = newestFirst ? posts : [...posts].reverse();
		return ordered.filter((post) => {
			if (topic && post.category !== topic) return false;
			const haystack = `${noWidow(post.title)} ${post.excerpt} ${post.category}`.toLowerCase();
			return words.every((word) => haystack.includes(word));
		});
	});

	function shortDate(post: PostMeta) {
		return post.date.replace(/^(\w{3})\w*/, '$1');
	}

	function selectTopic(category: string | null) {
		topic = category;
		const url = new URL(window.location.href);
		if (category) url.searchParams.set('topic', category);
		else url.searchParams.delete('topic');
		history.replaceState(history.state, '', url);
	}

	onMount(() => {
		const requested = new URL(window.location.href).searchParams.get('topic');
		if (requested && topics.some((item) => item.category === requested)) topic = requested;

		// "/" jumps to search, as on docs sites, unless the reader is already typing somewhere.
		function onKey(event: KeyboardEvent) {
			if (event.key !== '/' || event.metaKey || event.ctrlKey) return;
			const target = event.target as HTMLElement | null;
			if (target?.closest('input, textarea, [contenteditable="true"]')) return;
			event.preventDefault();
			search?.focus();
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<Seo
	title="Lettr Blog — Email Deliverability & Engineering"
	ogTitle="Lettr Blog"
	description="Notes on transactional and marketing email, deliverability, and building email infrastructure that SaaS teams can trust."
/>

<svelte:head>
	{@html jsonLdScript(basicPageJsonLd({ path: '/blog/', name: 'Lettr Blog', type: 'CollectionPage' }))}
</svelte:head>

{#snippet sortToggle()}
	<button
		type="button"
		onclick={() => (newestFirst = !newestFirst)}
		aria-label={newestFirst ? 'Sorted newest first. Show oldest first' : 'Sorted oldest first. Show newest first'}
		class="inline-flex items-center gap-1.5 text-sm text-subtle transition-colors hover:text-primary"
	>
		{newestFirst ? 'Newest first' : 'Oldest first'}
		<ArrowDownIcon size={13} class="transition-transform duration-200 {newestFirst ? '' : 'rotate-180'}" />
	</button>
{/snippet}

{#snippet meta(post: PostMeta)}
	<span class="text-[13px] font-medium text-subtle">{post.category} · {shortDate(post)} · {post.readTime}</span>
{/snippet}

{#snippet row(post: PostMeta)}
	<li>
		<a href="/blog/{post.slug}/" class="group flex items-center gap-4 border-b border-border/60 py-3.5 sm:gap-5">
			<ArtImage slug={post.slug} category={post.category} art={post.art} variant="thumb" decorative class="size-12 shrink-0" />
			<span class="min-w-0 flex-1 text-[15px] leading-[1.4] font-semibold text-balance text-surface transition-colors group-hover:text-primary sm:text-base">
				{noWidow(post.title)}
			</span>
			<span class="hidden w-[110px] shrink-0 text-[13px] text-subtle md:block">{post.category}</span>
			<span class="hidden w-[90px] shrink-0 text-right text-[13px] text-subtle sm:block">{shortDate(post)}</span>
		</a>
	</li>
{/snippet}

<section class="mx-auto pt-24 pb-24 md:pt-32 {wide ? 'max-w-none' : 'max-w-[848px]'}">
	<header class="flex flex-col gap-5 pb-6 md:flex-row md:items-end md:justify-between md:gap-8 md:pb-7">
		<div>
			<h1 class="text-[30px] leading-[1.2] tracking-[-0.02em] text-surface md:text-[40px] md:leading-[1.15]">
				Email, <em class="font-serif text-[34px] leading-none font-medium tracking-normal text-primary md:text-[42px]">written down</em>
			</h1>
			<p class="mt-2.5 max-w-[480px] text-[15px] leading-[1.55] text-pretty text-subtle md:mt-3 md:text-base">
				Guides, product notes and engineering stories from the team that runs Lettr's sending infrastructure.
			</p>
		</div>
		<label class="flex h-11 w-full shrink-0 items-center gap-2.5 border border-border bg-white px-3 focus-within:border-primary md:h-10 md:w-[260px]">
			<MagnifyingGlassIcon size={16} class="shrink-0 text-subtle" />
			<span class="sr-only">Search articles</span>
			<input
				bind:this={search}
				bind:value={query}
				type="search"
				placeholder="Search {posts.length} articles"
				class="min-w-0 flex-1 bg-transparent text-[15px] text-surface outline-none placeholder:text-gray-500 md:text-sm"
			/>
			<kbd class="hidden border border-border px-1.5 font-code text-xs text-gray-500 md:inline">/</kbd>
		</label>
	</header>

	<nav aria-label="Topics" class="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
		<ul class="flex gap-2 pb-1 md:gap-6 md:border-y md:border-border/60 md:py-3.5">
			<li>
				<button
					type="button"
					onclick={() => selectTopic(null)}
					aria-pressed={topic === null}
					class="topic {topic === null ? 'is-active' : ''}"
				>
					All <span class="count">{posts.length}</span>
				</button>
			</li>
			{#each topics as item (item.category)}
				<li>
					<button
						type="button"
						onclick={() => selectTopic(item.category)}
						aria-pressed={topic === item.category}
						class="topic {topic === item.category ? 'is-active' : ''}"
					>
						{item.label} <span class="count">{item.count}</span>
					</button>
				</li>
			{/each}
		</ul>
	</nav>

	{#if filtering}
		<div class="pt-8" aria-live="polite">
			<div class="flex items-baseline justify-between gap-4 border-b border-surface pb-3">
				<p class="text-sm text-subtle">
					{results.length}
					{results.length === 1 ? 'article' : 'articles'}{query.trim() ? ` matching “${query.trim()}”` : ''}
				</p>
				{@render sortToggle()}
			</div>
			{#if results.length}
				<ul>
					{#each results as post (post.slug)}
						{@render row(post)}
					{/each}
				</ul>
			{:else}
				<p class="py-10 text-subtle">
					Nothing matches yet. Try a shorter word, or
					<button type="button" class="font-semibold text-surface underline underline-offset-4" onclick={() => { query = ''; selectTopic(null); }}>
						show every article
					</button>.
				</p>
			{/if}
		</div>
	{:else}
		<div
			class="grid gap-10 pt-8 pb-12 md:gap-8 md:pb-14 {wide
				? 'md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-12'
				: 'md:grid-cols-[520px_1fr]'}"
		>
			<a href="/blog/{featured.slug}/" class="group flex flex-col gap-4">
				<ArtImage slug={featured.slug} category={featured.category} art={featured.art} variant="cover" decorative loading="eager" class="w-full" />
				<div class="flex flex-col gap-2.5">
					{@render meta(featured)}
					<h2 class="text-[22px] leading-[1.25] tracking-[-0.015em] text-balance text-surface transition-colors group-hover:text-primary md:text-[28px] md:leading-[1.2]">
						{noWidow(featured.title)}
					</h2>
					<p class="line-clamp-3 text-[15px] leading-[1.55] text-pretty text-subtle md:text-base">{featured.excerpt}</p>
				</div>
			</a>

			<section aria-labelledby="most-read-heading">
				<h2 id="most-read-heading" class="border-b border-surface pb-3.5 text-base leading-[1.35] text-surface">
					Most read this quarter
				</h2>
				<ol>
					{#each mostRead as post (post.slug)}
						<li>
							<a href="/blog/{post.slug}/" class="group flex items-start gap-3.5 border-b border-border/60 py-4">
								<ArtImage slug={post.slug} category={post.category} art={post.art} variant="thumb" decorative class="size-16 shrink-0" />
								<span class="flex flex-col gap-1">
									<span class="text-[15px] leading-[1.4] font-semibold text-balance text-surface transition-colors group-hover:text-primary">{noWidow(post.title)}</span>
									<span class="text-[13px] text-subtle">{post.category} · {post.readTime.replace(' read', '')}</span>
								</span>
							</a>
						</li>
					{/each}
				</ol>
				<a href="/compare/" class="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
					Compare Lettr with other providers
					<ArrowRightIcon size={14} class="transition-transform group-hover:translate-x-0.5" />
				</a>
			</section>
		</div>

		<section aria-labelledby="latest-heading" class="pb-14">
			<div class="flex items-baseline justify-between border-t border-surface pt-3.5">
				<h2 id="latest-heading" class="text-[22px] leading-[1.3] text-surface">Latest</h2>
				<a href="/blog/feed.xml" class="text-sm font-semibold text-subtle hover:text-primary">RSS</a>
			</div>
			<ul class="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2">
				{#each latest as post (post.slug)}
					<li>
						<a href="/blog/{post.slug}/" class="group flex flex-col gap-3.5">
							<ArtImage slug={post.slug} category={post.category} art={post.art} variant="cover" decorative class="w-full" />
							{@render meta(post)}
							<h3 class="text-[20px] leading-[1.35] tracking-[-0.01em] text-balance text-surface transition-colors group-hover:text-primary">
								{noWidow(post.title)}
							</h3>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<section aria-labelledby="path-heading" class="-mx-6 flex flex-col gap-8 bg-surface px-6 py-9 md:mx-0 md:flex-row md:gap-10 md:p-10">
			<div class="flex flex-col gap-4 md:w-60 md:shrink-0">
				<ArtImage slug={path[path.length - 1].slug} category={path[path.length - 1].category} art={path[path.length - 1].art} variant="thumb" decorative class="size-20 md:size-24" />
				<h2 id="path-heading" class="text-[24px] leading-[1.25] tracking-[-0.015em] text-balance text-background">{noWidow(deliverabilityPath.title)}</h2>
				<p class="text-[15px] leading-[1.55] text-pretty text-gray-400">{deliverabilityPath.description}</p>
			</div>
			<div class="flex-1">
				<ol>
					{#each path as post, index (post.slug)}
						<li>
							<a href="/blog/{post.slug}/" class="group flex items-baseline gap-4 border-b border-white/10 py-3.5">
								<span class="w-6 shrink-0 font-code text-[13px] text-green">0{index + 1}</span>
								<span class="flex-1 text-[15px] font-semibold text-balance text-background transition-colors group-hover:text-primary-outline md:text-base">{noWidow(post.title)}</span>
								<span class="w-14 shrink-0 text-right text-[13px] text-gray-400">{post.readTime.replace(' read', '')}</span>
							</a>
						</li>
					{/each}
				</ol>
				<a href={deliverabilityPath.next.href} class="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-background">
					{deliverabilityPath.next.label}
					<ArrowRightIcon size={14} class="transition-transform group-hover:translate-x-0.5" />
				</a>
			</div>
		</section>

		<section aria-labelledby="archive-heading" class="pt-14">
			<div class="flex items-baseline justify-between border-t border-surface pt-3.5 pb-2">
				<h2 id="archive-heading" class="text-[22px] leading-[1.3] text-surface">All articles</h2>
				{@render sortToggle()}
			</div>
			<ul>
				{#each archiveInOrder as post (post.slug)}
					{@render row(post)}
				{/each}
			</ul>
		</section>
	{/if}
</section>

<style>
	.topic {
		display: inline-flex;
		align-items: baseline;
		gap: 0.3em;
		white-space: nowrap;
		border: 1px solid var(--color-border);
		padding: 0.4rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-surface);
		cursor: pointer;
	}

	.topic.is-active {
		border-color: var(--color-surface);
		background: var(--color-surface);
		color: var(--color-background);
	}

	.count {
		font-weight: 500;
		color: #9ca3af;
	}

	@media (min-width: 768px) {
		.topic {
			border: 0;
			border-bottom: 2px solid transparent;
			padding: 0 0 2px;
			font-weight: 500;
			color: var(--color-subtle);
		}

		.topic:hover {
			color: var(--color-surface);
		}

		.topic.is-active {
			border-bottom-color: var(--color-primary);
			background: transparent;
			color: var(--color-surface);
			font-weight: 700;
		}
	}
</style>
