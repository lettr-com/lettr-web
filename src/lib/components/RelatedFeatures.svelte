<script module lang="ts">
	export interface RelatedLink {
		href: string;
		label: string;
		description: string;
	}
</script>

<script lang="ts">
	interface Props {
		links: RelatedLink[];
		/** Eyebrow heading shown above the cards. */
		heading?: string;
	}

	let { links, heading = 'Explore the platform' }: Props = $props();
</script>

{#if links.length}
	<div class="mx-auto max-w-[1064px] px-4">
		<div class="border-t border-border/50 pt-12">
			<h2 class="font-heading text-xs tracking-[0.15em] text-primary uppercase">
				{heading}
			</h2>
			<div class="mt-6 grid gap-4 sm:grid-cols-3">
				{#each links as item}
					<a
						href={item.href}
						class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30"
					>
						<h3 class="text-base leading-snug transition-colors group-hover:text-primary">
							{item.label}
						</h3>
						<p class="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}
