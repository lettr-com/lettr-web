<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { formatMonth } from '$lib/changelog/months';
	import { renderInline } from '$lib/changelog/inline';
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
	}

	let { month, variant = 'feed', isLatest = false }: Props = $props();

	const label = $derived(formatMonth(month.id));
	const sections = $derived(sectionsOf(month));
	const railEyebrow = $derived(variant === 'page' ? 'In this month' : isLatest ? 'Latest' : 'Archive');
</script>

<!-- data-month is read by the delegated PostHog handler on the container. -->
<div data-month={month.id} class="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12">
	<!--
		The rail mirrors the blog post's sticky table of contents: it names the
		month and lets the reader jump straight to the section they care about.
	-->
	<aside data-reveal class="mb-10 lg:sticky lg:top-32 lg:mb-0 lg:self-start">
		<div
			class="flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-primary/80 uppercase"
		>
			<span class="block h-px w-6 bg-primary/60"></span>
			{railEyebrow}
		</div>

		{#if variant === 'feed'}
			<h2 class="mt-3 text-h3">
				<a
					href="/changelog/{month.id}/"
					class="text-surface transition-colors hover:text-primary"
				>
					{label}
				</a>
			</h2>
		{/if}

		<ol class="mt-4 border-t border-border/50 pt-3 text-sm">
			{#each sections as section (section.key)}
				<li>
					<a
						href="#{sectionAnchor(month, section.key)}"
						class="flex items-baseline justify-between gap-4 py-1.5 transition-colors hover:text-primary {section.count ===
						0
							? 'text-muted/50'
							: 'text-muted'}"
					>
						<span>{section.label}</span>
						<span class="font-code text-xs tabular-nums">{section.count}</span>
					</a>
				</li>
			{/each}
		</ol>

		{#if variant === 'feed'}
			<a
				href="/changelog/{month.id}/"
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
		{#if month.intro}
			<p data-reveal class="mb-10 max-w-2xl text-body leading-[1.8] text-muted">
				{@html renderInline(month.intro)}
			</p>
		{/if}

		<section id={sectionAnchor(month, 'features')} class="scroll-mt-28">
			<h2 data-reveal class="font-heading text-xs tracking-[0.15em] text-primary uppercase">
				New features
			</h2>
			{#if month.features.length}
				<div class="mt-5 space-y-4">
					{#each month.features as entry (entry.title)}
						<ChangelogEntry {entry} />
					{/each}
				</div>
			{:else}
				<p data-reveal class="mt-4 text-sm text-muted">No new features shipped in {label}.</p>
			{/if}
		</section>

		<section id={sectionAnchor(month, 'improvements')} class="mt-14 scroll-mt-28">
			<h2 data-reveal class="font-heading text-xs tracking-[0.15em] text-primary uppercase">
				Improvements
			</h2>
			{#if month.improvements.length}
				<div class="mt-5 space-y-4">
					{#each month.improvements as entry (entry.title)}
						<ChangelogEntry {entry} />
					{/each}
				</div>
			{:else}
				<p data-reveal class="mt-4 text-sm text-muted">No improvements recorded in {label}.</p>
			{/if}
		</section>

		<section id={sectionAnchor(month, 'bugfixes')} class="mt-14 scroll-mt-28">
			<h2 data-reveal class="font-heading text-xs tracking-[0.15em] text-primary uppercase">
				Bugfixes
			</h2>
			{#if month.bugfixes.length}
				<ul class="mt-5 divide-y divide-border/40 border border-border/50 bg-white">
					{#each month.bugfixes as fix (fix.text)}
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
	</div>
</div>
