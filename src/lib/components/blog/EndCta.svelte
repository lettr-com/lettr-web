<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { groundColor } from '$lib/blog/art';
	import { endCtaFor, getArticle } from '$lib/blog/article';
	import { trackCtaViewed } from '$lib/analytics/blog';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import ArtImage from './ArtImage.svelte';

	const post = getArticle();
	const cta = $derived(post ? endCtaFor(post.slug) : undefined);

	let registerHref = $state(registerUrl);
	let block: HTMLElement | undefined = $state();

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
		if (!block || !post || !cta) return;
		const article = { slug: post.slug, category: post.category };
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				trackCtaViewed(article, cta.kind, 'blog_end_cta');
				observer.disconnect();
			},
			{ threshold: 0.5 }
		);
		observer.observe(block);
		return () => observer.disconnect();
	});
</script>

{#if post && cta}
	<aside
		bind:this={block}
		data-blog-placement="blog_end_cta"
		data-markdown="skip"
		class="flex flex-col sm:flex-row {cta.kind === 'compare' ? 'border border-border/60 bg-white' : 'bg-plum'}"
	>
		<!--
			The art column runs the full height of the card in the art's own ground
			colour, and the square tile sits on its bottom edge, so however tall the
			copy makes the card the art reaches both edges without stretching.
		-->
		<div
			class="hidden w-[232px] shrink-0 items-end self-stretch overflow-hidden sm:flex"
			style:background-color={groundColor(post.category, post.art)}
		>
			<ArtImage
				slug={post.slug}
				category={post.category}
				art={post.art}
				variant="square"
				decorative
				class="size-[232px] shrink-0"
			/>
		</div>
		<div class="flex flex-col justify-center gap-2.5 p-6 sm:min-h-[232px] sm:px-7">
			{#if cta.kind === 'compare'}
				<p class="font-heading text-[21px] leading-[1.3] text-surface">Price your own volume</p>
				<p class="text-[15px] leading-[1.5] text-subtle">
					See what Lettr costs at your monthly volume, or put it next to the provider you use today.
				</p>
				<div class="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-3">
					<a href="/pricing/" class="bg-primary-strong px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary">
						See pricing
					</a>
					<a href={cta.compare.href} class="group inline-flex items-center gap-1 text-sm font-semibold text-surface">
						{cta.compare.label}
						<ArrowRightIcon size={14} class="transition-transform group-hover:translate-x-0.5" />
					</a>
				</div>
			{:else}
				<p class="font-heading text-[21px] leading-[1.3] text-background">{cta.product.label}</p>
				<p class="text-[15px] leading-[1.5] text-primary-outline">{cta.product.description}</p>
				<div class="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-3">
					<a href={registerHref} class="bg-primary-strong px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary">
						Create a free account
					</a>
					<a href={cta.product.href} class="group inline-flex items-center gap-1 text-sm font-semibold text-background">
						Learn more
						<ArrowRightIcon size={14} class="transition-transform group-hover:translate-x-0.5" />
					</a>
				</div>
			{/if}
		</div>
	</aside>
{/if}
