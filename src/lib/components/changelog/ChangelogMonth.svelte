<script lang="ts">
	import { formatMonth } from '$lib/changelog/months';
	import { renderInline } from '$lib/changelog/inline';
	import type { ChangelogMonth } from '$lib/changelog/types';
	import ChangelogBadge from './ChangelogBadge.svelte';
	import ChangelogEntry from './ChangelogEntry.svelte';

	interface Props {
		month: ChangelogMonth;
		/**
		 * "feed" prepends the month separator, which links to the month's own
		 * page. "page" omits it, because that page already carries an <h1>.
		 */
		variant?: 'feed' | 'page';
	}

	let { month, variant = 'feed' }: Props = $props();

	const label = $derived(formatMonth(month.id));
</script>

<!-- data-month is read by the delegated PostHog handler on the container. -->
<div data-month={month.id}>
	{#if variant === 'feed'}
		<div data-reveal class="relative mb-10 flex items-center">
			<span class="h-px flex-1 bg-border/60"></span>
			<a
				href="/changelog/{month.id}/"
				class="px-4 font-code text-[13px] tracking-[0.05em] text-muted transition-colors hover:text-primary"
			>
				{label}
			</a>
			<span class="h-px flex-1 bg-border/60"></span>
		</div>
	{/if}

	{#if month.intro}
		<p data-reveal class="mb-10 max-w-2xl text-body leading-[1.8] text-muted">
			{@html renderInline(month.intro)}
		</p>
	{/if}

	<section class="mb-12">
		<h2 data-reveal class="mb-6 text-surface">New Features</h2>
		{#if month.features.length}
			<div class="space-y-8">
				{#each month.features as entry (entry.title)}
					<ChangelogEntry {entry} />
				{/each}
			</div>
		{:else}
			<p data-reveal class="text-body text-muted italic">
				No new features shipped in {label}.
			</p>
		{/if}
	</section>

	<section class="mb-12">
		<h2 data-reveal class="mb-6 text-surface">Improvements</h2>
		{#if month.improvements.length}
			<div class="space-y-8">
				{#each month.improvements as entry (entry.title)}
					<ChangelogEntry {entry} />
				{/each}
			</div>
		{:else}
			<p data-reveal class="text-body text-muted italic">
				No improvements recorded in {label}.
			</p>
		{/if}
	</section>

	<section>
		<h2 data-reveal class="mb-6 text-surface">Bugfixes</h2>
		{#if month.bugfixes.length}
			<ul class="space-y-4 border-t border-border/40 pt-6">
				{#each month.bugfixes as fix (fix.text)}
					<li data-reveal data-entry-title={fix.text} class="leading-[1.8] text-muted">
						<span class="mr-2 inline-flex flex-wrap gap-1.5 align-[3px]">
							{#each fix.modules as module (module)}
								<ChangelogBadge {module} />
							{/each}
							{#each fix.tags ?? [] as tag (tag)}
								<ChangelogBadge {tag} />
							{/each}
						</span>{@html renderInline(fix.text)}
					</li>
				{/each}
			</ul>
		{:else}
			<p data-reveal class="text-body text-muted italic">
				No bugfixes recorded in {label}.
			</p>
		{/if}
	</section>
</div>
