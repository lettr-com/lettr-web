<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
	import ClockIcon from 'phosphor-svelte/lib/ClockIcon';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import Seo from '$lib/components/Seo.svelte';
	import TableOfContents from './TableOfContents.svelte';
	import { getRelatedPosts } from '$lib/data/posts';

	export interface BlogAuthor {
		name: string;
		role?: string;
		avatar?: string;
	}

	interface Props {
		/** Small eyebrow label above the title, e.g. "Engineering" or "Deliverability". */
		category?: string;
		title: string;
		/** Short summary shown under the title and used as the meta description. */
		excerpt?: string;
		/** Optional meta description override when the visible excerpt is too long for SEO. */
		metaDescription?: string;
		author: BlogAuthor;
		/** Human-readable publish date, e.g. "May 29, 2026". */
		date: string;
		/** ISO date used for the <time> element and structured data. */
		datetime?: string;
		readTime?: string;
		coverImage?: string;
		coverAlt?: string;
		/** Canonical slug, used to build the canonical URL. */
		slug?: string;
		children: Snippet;
	}

	let {
		category,
		title,
		excerpt,
		metaDescription,
		author,
		date,
		datetime,
		readTime,
		coverImage,
		coverAlt = '',
		slug,
		children
	}: Props = $props();

	const canonical = $derived(slug ? `/blog/${slug}/` : undefined);
	const seoDescription = $derived(metaDescription ?? excerpt ?? '');
	const related = $derived(getRelatedPosts(slug));
	const initials = $derived(
		author.name
			.split(' ')
			.map((part) => part[0])
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);

	let header: HTMLElement | undefined = $state();
	let body: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		if (header) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: header,
					targets: '[data-animate]',
					vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
				})
			);
		}

		if (body) {
			cleanups.push(
				createScrollRevealCleanup({
					scope: body,
					targets: '[data-reveal]'
				})
			);
		}

		return () => cleanups.forEach((fn) => fn());
	});
</script>

<Seo
	title="{title} | Lettr Blog"
	description={seoDescription}
	ogTitle={title}
	type="article"
	image={coverImage}
	{canonical}
/>

<article class="pt-32 pb-24">
	<div class="mx-auto max-w-[1064px] px-4">
		<!-- Header -->
		<header bind:this={header} class="max-w-[800px]">
			<a
				data-animate
				href="/blog/"
				class="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
			>
				<ArrowLeftIcon size={15} />
				All posts
			</a>

			{#if category}
				<span
					data-animate
					class="mt-8 block font-heading text-xs tracking-[0.15em] text-primary uppercase"
				>
					{category}
				</span>
			{/if}

			<h1 data-animate class="mt-3">{title}</h1>

			{#if excerpt}
				<p data-animate class="mt-5 text-h3 leading-[1.5] text-muted">{excerpt}</p>
			{/if}

			<div data-animate class="mt-8 flex items-center gap-3 border-y border-border/50 py-4">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-border/50 bg-background"
				>
					{#if author.avatar}
						<img src={author.avatar} alt={author.name} class="h-full w-full object-cover" />
					{:else}
						<span class="font-heading text-sm text-surface">{initials}</span>
					{/if}
				</div>
				<div class="leading-tight">
					<div class="text-sm font-semibold text-surface">{author.name}</div>
					{#if author.role}
						<div class="text-xs text-muted">{author.role}</div>
					{/if}
				</div>
				<div class="ml-auto flex items-center gap-3 text-xs text-muted">
					<time datetime={datetime ?? undefined}>{date}</time>
					{#if readTime}
						<span class="flex items-center gap-1">
							<ClockIcon size={13} />
							{readTime}
						</span>
					{/if}
				</div>
			</div>
		</header>

		{#if coverImage}
			<figure class="mt-10 max-w-[800px]">
				<img
					src={coverImage}
					alt={coverAlt}
					class="w-full border border-border/50 bg-white object-cover"
				/>
			</figure>
		{/if}
	</div>

	<!-- Body + table of contents -->
	<div class="mx-auto mt-12 flex max-w-[1064px] gap-10 px-4">
		<div bind:this={body} class="blog-prose w-full max-w-[800px] min-w-0">
			{@render children()}
		</div>
		<aside class="hidden w-56 shrink-0 lg:block">
			<div class="sticky top-32">
				<TableOfContents container={body} />
			</div>
		</aside>
	</div>

	{#if related.length}
		<div class="mx-auto mt-20 max-w-[1064px] px-4">
			<div class="border-t border-border/50 pt-12">
				<h2 class="font-heading text-xs tracking-[0.15em] text-primary uppercase">
					Related articles
				</h2>
				<div class="mt-6 grid gap-4 sm:grid-cols-3">
					{#each related as post}
						<a
							href="/blog/{post.slug}/"
							class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30"
						>
							<span class="font-heading text-xs tracking-[0.15em] text-primary uppercase">
								{post.category}
							</span>
							<h3 class="mt-2 text-base leading-snug transition-colors group-hover:text-primary">
								{post.title}
							</h3>
							<div class="mt-auto pt-5 flex items-center gap-2 text-xs text-muted">
								<span>{post.date}</span>
								<span class="flex items-center gap-1">
									<ClockIcon size={12} />
									{post.readTime}
								</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</article>
