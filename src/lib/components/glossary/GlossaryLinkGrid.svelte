<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';

	interface Link {
		href: string;
		label: string;
	}

	interface Props {
		/** Id for the heading, which also labels the section. */
		id: string;
		heading: string;
		links: Link[];
	}

	let { id, heading, links }: Props = $props();

	const isExternal = (href: string) => /^https?:\/\//.test(href);
</script>

<!--
	Further reading and Related terms share this one layout so the two blocks at
	the foot of a term read as a pair. The arrow is the only thing that differs:
	↗ leaves for another site in a new tab, → stays in the glossary.
-->
<section aria-labelledby={id} class="mt-12">
	<!-- A label, not an h2, so the heading outline stays the article body only. -->
	<p {id} class="font-heading text-sm text-primary">{heading}</p>
	<ul class="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
		{#each links as link (link.href)}
			{@const external = isExternal(link.href)}
			<li class="min-w-0">
				<a
					href={link.href}
					target={external ? '_blank' : undefined}
					rel={external ? 'noopener noreferrer' : undefined}
					class="group flex h-full min-h-12 items-center justify-between gap-3 border border-border/50 bg-white px-4 py-3 text-sm font-medium text-surface transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>
					<span class="break-words">{link.label}</span>
					{#if external}
						<!-- A step larger: the diagonal glyph fills less of its box than → does. -->
						<ArrowUpRightIcon
							size={16}
							class="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
						/>
					{:else}
						<ArrowRightIcon
							size={15}
							class="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
						/>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</section>
