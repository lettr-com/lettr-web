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
<article
	data-reveal
	data-entry-title={entry.title}
	class="border border-border/50 bg-white p-6 shadow-[0_20px_50px_-45px_rgba(17,24,39,0.6)] md:p-8"
>
	<div class="flex flex-wrap items-center gap-1.5">
		{#each entry.modules as module (module)}
			<ChangelogBadge {module} />
		{/each}
		{#each entry.tags ?? [] as tag (tag)}
			<ChangelogBadge {tag} />
		{/each}
	</div>

	<h3 class="mt-4 text-surface">{entry.title}</h3>

	<p class="mt-3 text-body leading-[1.7] font-medium text-surface">{@html renderInline(entry.lead)}</p>

	{#each entry.body ?? [] as paragraph}
		<p class="mt-4 text-[15px] leading-[1.8] text-muted">{@html renderInline(paragraph)}</p>
	{/each}

	{#if entry.code}
		<div class="mt-6">
			<Code code={entry.code.source} lang={entry.code.lang} />
		</div>
	{/if}

	{#if entry.docs}
		<a
			href={entry.docs.href}
			target="_blank"
			rel="noopener noreferrer"
			class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/70"
		>
			{entry.docs.label}
			<ArrowUpRightIcon size={14} weight="bold" />
		</a>
	{/if}
</article>
