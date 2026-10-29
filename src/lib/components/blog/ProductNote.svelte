<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { getArticle } from '$lib/blog/article';
	import { postLinks } from '$lib/blog/links';
	import ArtImage from './ArtImage.svelte';

	// Placed after a post's first section. In PostHog session recordings readers
	// who wanted the product reached it through the footer; this gives them a
	// way in at the point most of them are still reading.
	const post = getArticle();
	const product = $derived(post ? postLinks[post.slug]?.product : undefined);
</script>

{#if post && product}
	<a
		href={product.href}
		data-blog-placement="blog_product_note"
		data-markdown="skip"
		class="group flex items-center gap-4 border-y border-border/60 py-4 no-underline!"
	>
		<ArtImage slug={post.slug} category={post.category} art={post.art} variant="thumb" decorative class="size-10 shrink-0" />
		<span class="min-w-0 flex-1 text-[15px] leading-[1.5] text-pretty text-muted">
			<strong>{product.label}.</strong>
			{product.description}
		</span>
		<span class="hidden shrink-0 items-center gap-1 text-sm font-bold text-primary sm:flex">
			Learn more
			<ArrowRightIcon size={14} class="transition-transform group-hover:translate-x-0.5" />
		</span>
	</a>
{/if}
