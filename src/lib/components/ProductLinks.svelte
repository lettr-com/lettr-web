<script lang="ts">
	import { page } from '$app/state';
	import { setupLinks } from '$lib/seo/links';

	const links = $derived(setupLinks[page.url.pathname] ?? []);
	const isExternal = (href: string) => /^https?:\/\//.test(href);
</script>

<!--
	Docs quickstart, comparisons and explainers for a product page, picked by path.
	Server-rendered, so crawlers see the links from the page that sells the feature.
-->
{#if links.length}
	<div class="mx-auto max-w-[1064px] px-4">
		<div class="border-t border-border/50 pt-12">
			<h2 class="font-heading text-xs tracking-[0.15em] text-primary uppercase">Set up, compare, learn</h2>
			<div class="mt-6 grid gap-4 sm:grid-cols-3">
				{#each links as link (link.href)}
					<a
						href={link.href}
						target={isExternal(link.href) ? '_blank' : undefined}
						rel={isExternal(link.href) ? 'noopener noreferrer' : undefined}
						class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30"
					>
						<h3 class="text-base leading-snug transition-colors group-hover:text-primary">{link.label}</h3>
						<p class="mt-2 text-sm leading-relaxed text-muted">{link.description}</p>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}
