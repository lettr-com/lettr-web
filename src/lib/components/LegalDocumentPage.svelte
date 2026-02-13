<script lang="ts">
	import type { LegalDocumentData, LegalNavLink } from '$lib/content/legal';
	import Footer from '$lib/components/Footer.svelte';

	interface Props {
		document: LegalDocumentData;
		links: LegalNavLink[];
	}

	let { document, links }: Props = $props();
</script>

<svelte:head>
	<title>{document.title} | Lettr</title>
	<meta name="description" content={document.description} />
	<link rel="canonical" href={`https://lettr.com${document.href}`} />
</svelte:head>

<section class="px-4 pb-20 pt-28">
	<div class="rounded border border-border/50 bg-white/80 p-5 shadow-[0_20px_50px_-45px_rgba(17,24,39,0.6)]">
		<p class="font-heading text-xs tracking-[0.12em] text-primary uppercase">Legal</p>
		<h1 class="mt-2 text-3xl text-surface">{document.title}</h1>
		<p class="mt-2 text-xs text-muted">Last updated {document.updatedAt}</p>

		<nav class="mt-5 flex flex-wrap gap-2" aria-label="Legal pages">
			{#each links as link}
				<a
					href={link.href}
					aria-current={link.key === document.key ? 'page' : undefined}
					class={`rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors ${link.key === document.key
						? 'border-primary/40 bg-primary/10 text-primary'
						: 'border-border/60 text-muted hover:border-primary/30 hover:text-surface'}`}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</div>

	<article class="legal-prose mt-4 rounded border border-border/50 bg-white px-5 py-6 shadow-[0_20px_50px_-45px_rgba(17,24,39,0.6)]">
		{@html document.html}
	</article>
</section>

<Footer />
