<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { openLinksInNewTab } from '$lib/utils/blogLinks';
	import Seo from '$lib/components/Seo.svelte';
	import TableOfContents from './TableOfContents.svelte';
	import ArtImage from './ArtImage.svelte';
	import EndCta from './EndCta.svelte';
	import ReadNext from './ReadNext.svelte';
	import { posts } from '$lib/data/posts';
	import { artAlt, artPaths } from '$lib/blog/art';
	import { readMinutes, setArticle } from '$lib/blog/article';
	import {
		newDepths,
		trackArticleLink,
		trackArticleViewed,
		trackReadProgress,
		type BlogPlacement
	} from '$lib/analytics/blog';
	import { jsonLdScript } from '$lib/utils/jsonLd';
	import { noWidow } from '$lib/utils/typography';
	import { blogPostJsonLd, type FaqEntry } from '$lib/utils/pageJsonLd';

	export interface BlogAuthor {
		name: string;
		role?: string;
		avatar?: string;
	}

	interface Props {
		/** The post's category, shown in the breadcrumb, e.g. "Engineering" or "Deliverability". */
		category?: string;
		title: string;
		/** Optional <title> override when the visible headline is too long for SEO. */
		seoTitle?: string;
		/** Long summary, used for the meta description when there is no shorter one. */
		excerpt?: string;
		/** The meta description; also shown under the title, where a short dek reads better than the excerpt. */
		metaDescription?: string;
		author: BlogAuthor;
		/** Human-readable publish date, e.g. "May 29, 2026". */
		date: string;
		/** ISO date used for the <time> element and structured data. */
		datetime?: string;
		/** ISO date of the last substantial edit, for structured data. Defaults to {@link datetime}. */
		dateModified?: string;
		readTime?: string;
		/** Overrides the generated Open Graph image (static/blog/<slug>/og.png). */
		coverImage?: string;
		coverAlt?: string;
		/** Canonical slug, used to build the canonical URL and find the post's art. */
		slug?: string;
		/** The article's FAQ as plain text, emitted as FAQPage structured data. */
		faqs?: readonly FaqEntry[];
		children: Snippet;
	}

	let {
		category,
		title,
		seoTitle,
		excerpt,
		metaDescription,
		author,
		date,
		datetime,
		dateModified,
		readTime,
		coverImage,
		coverAlt,
		slug,
		faqs,
		children
	}: Props = $props();

	const post = posts.find((candidate) => candidate.slug === slug);
	if (post) setArticle(post);

	const canonical = $derived(slug ? `/blog/${slug}/` : undefined);
	const seoDescription = $derived(metaDescription ?? excerpt ?? '');
	const dek = $derived(metaDescription ?? excerpt);
	const ogImage = $derived(coverImage ?? (post ? artPaths(post.slug).og : undefined));
	const ogAlt = $derived(coverAlt ?? (post ? `${artAlt(post.art)} with the title “${title}”` : undefined));
	const minutes = $derived(readMinutes(readTime ?? ''));
	const jsonLd = $derived(
		slug
			? blogPostJsonLd({
					slug,
					title,
					description: seoDescription,
					datetime,
					dateModified,
					category,
					author,
					image: ogImage,
					faqs
				})
			: undefined
	);
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

	const articleContext = $derived({ slug: slug ?? '', category: category ?? '' });

	/** One handler for every tracked link in the article: body copy, the product note, the end block, read-next. */
	function handleClick(event: MouseEvent) {
		if (!slug || !(event.target instanceof Element)) return;
		const link = event.target.closest('a');
		const href = link?.getAttribute('href');
		if (!link || !href || href.startsWith('#')) return;
		const block = link.closest<HTMLElement>('[data-blog-placement]');
		const placement = (block?.dataset.blogPlacement ?? (body?.contains(link) ? 'blog_body' : null)) as BlogPlacement | null;
		if (placement) trackArticleLink(articleContext, href, placement);
	}

	onMount(() => {
		if (!body) return;
		const content = body;
		// Links that leave lettr.com open in a new tab so readers keep their place.
		openLinksInNewTab(content);

		if (!slug) return;
		const article = articleContext;
		trackArticleViewed(article, minutes);

		let reached = 0;
		let frame = 0;
		function measure() {
			frame = 0;
			const rect = content.getBoundingClientRect();
			const depth = Math.min(100, Math.max(0, ((window.innerHeight - rect.top) / rect.height) * 100));
			for (const step of newDepths(reached, depth)) trackReadProgress(article, step);
			reached = Math.max(reached, depth);
		}
		function onScroll() {
			if (!frame) frame = requestAnimationFrame(measure);
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<Seo
	title="{seoTitle ?? title} | Lettr Blog"
	description={seoDescription}
	ogTitle={title}
	type="article"
	image={ogImage}
	imageAlt={ogAlt}
	{canonical}
	author={author.name}
/>

<svelte:head>
	{#if jsonLd}
		{@html jsonLdScript(jsonLd)}
	{/if}
</svelte:head>

<!-- Click tracking only: the links inside stay the interactive elements. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<article class="pb-24 pt-[60px] md:pt-28" onclick={handleClick}>
	{#if post}
		<div class="-mx-6 md:hidden" data-markdown="skip">
			<ArtImage slug={post.slug} category={post.category} art={post.art} variant="strip" decorative loading="eager" class="w-full" />
		</div>
	{/if}

	<div class="mx-auto max-w-[848px]">
		<header bind:this={header} class="flex items-start gap-12 border-b border-border/60 pt-5 pb-6 md:pt-0 md:pb-7">
			<div class="min-w-0 flex-1">
				<nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm font-medium text-subtle">
					<a href="/blog/" class="transition-colors hover:text-primary">Blog</a>
					{#if category}
						<span aria-hidden="true" class="text-border">/</span>
						<a href="/blog/?topic={encodeURIComponent(category)}" class="text-surface transition-colors hover:text-primary">{category}</a>
					{/if}
				</nav>

				<h1
					class="mt-3.5 text-[30px] leading-[1.17] tracking-[-0.02em] text-balance text-surface md:mt-4 md:text-[44px] md:leading-[1.14] md:tracking-[-0.025em]"
				>
					{noWidow(title)}
				</h1>

				{#if dek}
					<p class="mt-3.5 text-[17px] leading-[1.55] text-pretty text-subtle md:mt-4 md:text-[19px]">{dek}</p>
				{/if}

				<div class="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-subtle md:mt-5 md:text-sm">
					<span class="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden border border-border/60 bg-background">
						{#if author.avatar}
							<img src={author.avatar} alt="" width="28" height="28" class="h-full w-full object-cover" />
						{:else}
							<span class="font-heading text-[11px] text-surface">{initials}</span>
						{/if}
					</span>
					<span class="font-semibold text-surface">{author.name}</span>
					<span aria-hidden="true" class="text-border">·</span>
					<time datetime={datetime ?? undefined}>{date}</time>
					{#if readTime}
						<span aria-hidden="true" class="text-border">·</span>
						<span>{readTime}</span>
					{/if}
				</div>
			</div>

			{#if post}
				<ArtImage
					slug={post.slug}
					category={post.category}
					art={post.art}
					variant="square"
					decorative
					loading="eager"
					class="hidden size-[232px] shrink-0 md:block"
				/>
			{/if}
		</header>

		<div class="relative">
			<div bind:this={body} class="blog-prose article-prose max-w-[680px] min-w-0 pt-8 md:pt-9">
				{@render children()}
			</div>
			{#if slug}
				<!-- Sits in the page margin beside the column; after the body so its container is bound. -->
				<!-- z-30: the sticky child is its own stacking context, so the column itself must sit above the article blocks that follow it. -->
				<div class="absolute top-9 bottom-0 -left-14 z-30 xl:-left-20">
					<div class="sticky top-40">
						<TableOfContents
							container={body}
							{header}
							article={articleContext}
						/>
					</div>
				</div>
			{/if}
		</div>

		<div class="mt-12 max-w-[680px]">
			<EndCta />
		</div>

		<div class="mt-16">
			<ReadNext />
		</div>
	</div>
</article>
