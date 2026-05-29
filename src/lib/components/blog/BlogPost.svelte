<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { ArrowLeftIcon, ClockIcon } from 'phosphor-svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';

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
		author,
		date,
		datetime,
		readTime,
		coverImage,
		coverAlt = '',
		slug,
		children
	}: Props = $props();

	const canonical = $derived(slug ? `https://lettr.com/blog/${slug}` : undefined);
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

<svelte:head>
	<title>{title} | Lettr Blog</title>
	{#if excerpt}<meta name="description" content={excerpt} />{/if}
	{#if canonical}<link rel="canonical" href={canonical} />{/if}
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	{#if excerpt}<meta property="og:description" content={excerpt} />{/if}
	{#if coverImage}<meta property="og:image" content={coverImage} />{/if}
</svelte:head>

<article class="pt-32 pb-24">
	<div class="mx-auto max-w-[720px]">
		<!-- Header -->
		<header bind:this={header}>
			<a
				data-animate
				href="/blog"
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
			<figure class="mt-10">
				<img
					src={coverImage}
					alt={coverAlt}
					class="w-full border border-border/50 bg-white object-cover"
				/>
			</figure>
		{/if}

		<!-- Body -->
		<div bind:this={body} class="blog-prose mt-12">
			{@render children()}
		</div>
	</div>
</article>
