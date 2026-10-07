<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { formatMonth } from '$lib/changelog/months';
	import { renderInline } from '$lib/changelog/inline';
	import { filterMonth, monthHref, type FilterToken } from '$lib/changelog/filter';
	import { entryAnchor } from '$lib/changelog/seo';
	import { sectionAnchor, sectionsOf } from '$lib/changelog/summary';
	import type { ChangelogMonth } from '$lib/changelog/types';
	import ChangelogBadge from './ChangelogBadge.svelte';
	import ChangelogEntry from './ChangelogEntry.svelte';

	interface Props {
		month: ChangelogMonth;
		/**
		 * "feed" renders the month name in the rail as a link to the month's own
		 * page. "page" omits it, because that page already carries an <h1>.
		 */
		variant?: 'feed' | 'page';
		/** Feed only: labels the rail "Latest" instead of "Archive". */
		isLatest?: boolean;
		/**
		 * Active badge filter. The month is reduced here rather than by the
		 * caller so the rail counts, the entries and the empty-section copy all
		 * describe the same, filtered view.
		 */
		filter?: FilterToken[];
	}

	let { month, variant = 'feed', isLatest = false, filter = [] }: Props = $props();

	const label = $derived(formatMonth(month.id));
	const shown = $derived(filterMonth(month, filter));
	const sections = $derived(sectionsOf(shown));
	const href = $derived(monthHref(month.id, filter));
	const railEyebrow = $derived(
		variant === 'page' ? 'In this month' : isLatest ? 'Latest' : 'Archive'
	);
	/**
	 * Under a filter an empty section is not news — the reader asked for a
	 * subset — so it drops out entirely rather than announcing its absence.
	 * Unfiltered, the same emptiness is information: nothing shipped there.
	 */
	const hideEmpty = $derived(filter.length > 0);
</script>

<!-- data-month is read by the delegated PostHog handler on the container. -->
<div data-month={month.id} class="lg:grid lg:grid-cols-[minmax(0,1fr)_11rem] lg:gap-12">
	<!--
		The rail mirrors the blog post's sticky table of contents: it names the
		month and lets the reader jump straight to the section they care about.
		It sits to the right of the entries on wide screens (as the blog's does),
		but stays first in the DOM so it leads on phones, where it stacks above.
	-->
	<aside data-reveal class="mb-10 lg:sticky lg:top-32 lg:order-last lg:mb-0 lg:self-start">
		<div class="flex items-center gap-2 font-heading text-sm text-primary">
			<span class="block h-px w-6 bg-primary/60"></span>
			{railEyebrow}
		</div>

		{#if variant === 'feed'}
			<h2 class="mt-3 text-h3">
				<a {href} class="text-surface transition-colors hover:text-primary">
					{label}
				</a>
			</h2>
		{/if}

		<ol class="mt-4 border-t border-border/50 pt-3 text-sm">
			{#each sections as section (section.key)}
				{@const rowClass = `flex items-baseline justify-between gap-4 py-1.5 ${section.count === 0 ? 'text-muted/50' : 'text-muted'}`}
				<li>
					{#if section.count === 0 && hideEmpty}
						<span class={rowClass}>
							<span>{section.label}</span>
							<span class="font-code text-xs tabular-nums">{section.count}</span>
						</span>
					{:else}
						<a
							href="#{sectionAnchor(month, section.key)}"
							class="{rowClass} transition-colors hover:text-primary"
						>
							<span>{section.label}</span>
							<span class="font-code text-xs tabular-nums">{section.count}</span>
						</a>
					{/if}
				</li>
			{/each}
		</ol>

		{#if variant === 'feed'}
			<a
				{href}
				class="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
			>
				Open this month
				<ArrowRightIcon
					size={14}
					class="transition-transform duration-200 group-hover:translate-x-1"
				/>
			</a>
		{/if}
	</aside>

	<div class="min-w-0">
		{#if shown.features.length || !hideEmpty}
			<section id={sectionAnchor(month, 'features')} class="scroll-mt-28 first:mt-0">
				<h2 data-reveal class="font-heading text-sm text-primary">
					New features
				</h2>
				{#if shown.features.length}
					<div class="mt-5 space-y-4">
						{#each shown.features as entry (entry.title)}
							<ChangelogEntry {entry} id={entryAnchor(month, entry)} />
						{/each}
					</div>
				{:else}
					<p data-reveal class="mt-4 text-sm text-muted">No new features shipped in {label}.</p>
				{/if}
			</section>
		{/if}

		{#if shown.improvements.length || !hideEmpty}
			<section
				id={sectionAnchor(month, 'improvements')}
				class="mt-14 scroll-mt-28 first:mt-0"
			>
				<h2 data-reveal class="font-heading text-sm text-primary">
					Improvements
				</h2>
				{#if shown.improvements.length}
					<div class="mt-5 space-y-4">
						{#each shown.improvements as entry (entry.title)}
							<ChangelogEntry {entry} id={entryAnchor(month, entry)} />
						{/each}
					</div>
				{:else}
					<p data-reveal class="mt-4 text-sm text-muted">No improvements recorded in {label}.</p>
				{/if}
			</section>
		{/if}

		{#if shown.bugfixes.length || !hideEmpty}
			<section
				id={sectionAnchor(month, 'bugfixes')}
				class="mt-14 scroll-mt-28 first:mt-0"
			>
				<h2 data-reveal class="font-heading text-sm text-primary">
					Bugfixes
				</h2>
				{#if shown.bugfixes.length}
					<ul class="mt-5 divide-y divide-border/40 border border-border/50 bg-white">
						{#each shown.bugfixes as fix (fix.text)}
							<li
								data-reveal
								data-entry-title={fix.text}
								class="grid gap-x-5 gap-y-2 px-5 py-4 sm:grid-cols-[9.5rem_minmax(0,1fr)]"
							>
								<div class="flex flex-wrap content-start gap-1.5">
									{#each fix.modules as module (module)}
										<ChangelogBadge {module} />
									{/each}
									{#each fix.tags ?? [] as tag (tag)}
										<ChangelogBadge {tag} />
									{/each}
								</div>
								<p class="text-sm leading-[1.7] text-muted">{@html renderInline(fix.text)}</p>
							</li>
						{/each}
					</ul>
				{:else}
					<p data-reveal class="mt-4 text-sm text-muted">No bugfixes recorded in {label}.</p>
				{/if}
			</section>
		{/if}
	</div>
</div>
