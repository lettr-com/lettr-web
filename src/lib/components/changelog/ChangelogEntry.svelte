<script lang="ts">
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import { Code } from '$lib/components/blog';
	import { renderInline } from '$lib/changelog/inline';
	import type { ChangelogEntry } from '$lib/changelog/types';
	import ChangelogBadge from './ChangelogBadge.svelte';

	interface Props {
		entry: ChangelogEntry;
	}

	let { entry }: Props = $props();
</script>

<!-- data-entry-title is read by the delegated PostHog handler on the container. -->
<article data-reveal data-entry-title={entry.title} class="border-t border-border/40 pt-6">
	<div class="mb-3 flex flex-wrap items-center gap-2">
		{#each entry.modules as module (module)}
			<ChangelogBadge {module} />
		{/each}
		{#each entry.tags ?? [] as tag (tag)}
			<ChangelogBadge {tag} />
		{/each}
	</div>

	<h3 class="text-surface">{entry.title}</h3>

	<p class="mt-3 leading-[1.8] font-medium text-surface">{@html renderInline(entry.lead)}</p>

	{#each entry.body ?? [] as paragraph}
		<p class="mt-4 leading-[1.8] text-muted">{@html renderInline(paragraph)}</p>
	{/each}

	{#if entry.code}
		<div class="mt-5">
			<Code code={entry.code.source} lang={entry.code.lang} />
		</div>
	{/if}

	{#if entry.docs}
		<a
			href={entry.docs.href}
			target="_blank"
			rel="noopener noreferrer"
			class="mt-5 inline-flex items-center gap-1.5 font-heading text-[13px] text-primary transition-colors hover:text-primary/70"
		>
			{entry.docs.label}
			<ArrowUpRightIcon size={13} weight="bold" />
		</a>
	{/if}
</article>
