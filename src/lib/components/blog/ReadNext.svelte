<script lang="ts">
	import { getArticle } from '$lib/blog/article';
	import { readNextFor } from '$lib/blog/collections';
	import { postLinks } from '$lib/blog/links';
	import { noWidow } from '$lib/utils/typography';
	import ArtImage from './ArtImage.svelte';

	const post = getArticle();
	const next = $derived(post ? readNextFor(post.slug) : []);
	const terms = $derived(post ? (postLinks[post.slug]?.terms ?? []) : []);
</script>

{#if post && next.length}
	<section data-blog-placement="blog_read_next" data-markdown="skip" aria-labelledby="read-next-heading">
		<div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-surface pt-3.5">
			<p id="read-next-heading" class="font-heading text-[22px] leading-[1.3] text-surface">Read next</p>
			{#if terms.length}
				<p class="text-sm text-subtle">
					In the glossary:
					{#each terms as term, index (term.slug)}
						<a href="/glossary/{term.slug}/" class="underline-offset-4 hover:text-primary hover:underline">{term.label}</a>{index < terms.length - 1 ? ', ' : ''}
					{/each}
				</p>
			{/if}
		</div>
		<div class="mt-5 grid gap-6 sm:grid-cols-2 sm:gap-8">
			{#each next as item (item.slug)}
				<a href="/blog/{item.slug}/" class="group flex items-start gap-4">
					<ArtImage slug={item.slug} category={item.category} art={item.art} variant="thumb" decorative class="size-24 shrink-0" />
					<span class="flex flex-col gap-1.5">
						<span class="text-[13px] text-subtle">{item.category} · {item.readTime}</span>
						<span class="font-heading text-[17px] leading-[1.35] text-balance text-surface transition-colors group-hover:text-primary">{noWidow(item.title)}</span>
					</span>
				</a>
			{/each}
		</div>
	</section>
{/if}
