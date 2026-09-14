<script lang="ts">
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import type { ReadingLink } from '$lib/glossary/types';

	interface Props {
		links: ReadingLink[];
	}

	let { links }: Props = $props();

	const isExternal = (href: string) => /^https?:\/\//.test(href);
</script>

<aside
	aria-labelledby="glossary-further-reading"
	class="mt-12 border border-border/50 bg-white p-6 shadow-[0_20px_50px_-45px_rgba(17,24,39,0.6)]"
>
	<p id="glossary-further-reading" class="font-heading text-xs tracking-[0.15em] text-primary uppercase">
		Further reading
	</p>
	<ul class="mt-4 space-y-2">
		{#each links as link (link.href)}
			{@const external = isExternal(link.href)}
			<li>
				<a
					href={link.href}
					target={external ? '_blank' : undefined}
					rel={external ? 'noopener noreferrer' : undefined}
					class="inline-flex items-center gap-1.5 text-body text-surface transition-colors hover:text-primary"
				>
					{link.title}
					<ArrowUpRightIcon size={14} class="shrink-0" />
				</a>
			</li>
		{/each}
	</ul>
</aside>
