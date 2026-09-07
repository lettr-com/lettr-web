<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import Seo from '$lib/components/Seo.svelte';
	import ChangelogMonth from '$lib/components/changelog/ChangelogMonth.svelte';
	import { trackChangelogLinkClick } from '$lib/changelog/analytics';
	import { formatMonth } from '$lib/changelog/months';
	import { summarizeMonth } from '$lib/changelog/summary';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let header: HTMLElement | undefined = $state();
	let body: HTMLElement | undefined = $state();

	const label = $derived(formatMonth(data.month.id));
	const description = $derived.by(() => {
		const summary = summarizeMonth(data.month);
		return summary
			? `Everything Lettr shipped in ${label}: ${summary}.`
			: `Everything Lettr shipped in ${label}.`;
	});

	onMount(() => {
		const cleanups: (() => void)[] = [];

		if (header) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: header,
					targets: '[data-animate]',
					vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
				})
			);
		}

		if (body) {
			const element = body;
			cleanups.push(createScrollRevealCleanup({ scope: element, targets: '[data-reveal]' }));
			element.addEventListener('click', trackChangelogLinkClick);
			cleanups.push(() => element.removeEventListener('click', trackChangelogLinkClick));
		}

		return () => cleanups.forEach((fn) => fn());
	});
</script>

<Seo
	title="{label} Changelog | Lettr"
	{description}
	ogTitle="Lettr Changelog — {label}"
	canonical="/changelog/{data.month.id}/"
/>

<section class="pt-32 pb-24">
	<div bind:this={header}>
		<a
			data-animate
			href="/changelog/"
			class="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
		>
			<ArrowLeftIcon size={15} />
			All changes
		</a>

		<span
			data-animate
			class="mt-8 block font-heading text-xs tracking-[0.15em] text-primary uppercase"
		>
			Changelog
		</span>
		<h1 data-animate class="mt-3">{label}</h1>
		<p data-animate class="mt-5 max-w-xl text-body leading-[1.8] text-muted">
			{description}
		</p>
	</div>

	<div bind:this={body} class="mt-12 border-t border-border/50 pt-12">
		<ChangelogMonth month={data.month} variant="page" />
	</div>

	{#if data.newer || data.older}
		<nav aria-label="Other months" class="mt-20 border-t border-border/50 pt-12">
			<h2 class="font-heading text-xs tracking-[0.15em] text-primary uppercase">Other months</h2>
			<div class="mt-6 grid gap-4 sm:grid-cols-2">
				{#if data.older}
					<a
						href="/changelog/{data.older}/"
						class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30"
					>
						<span class="text-xs font-medium tracking-[0.1em] text-muted uppercase">Earlier</span>
						<span
							class="mt-2 inline-flex items-center gap-2 font-heading text-h3 text-surface transition-colors group-hover:text-primary"
						>
							<ArrowLeftIcon
								size={16}
								class="text-muted transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-primary"
							/>
							{formatMonth(data.older)}
						</span>
					</a>
				{:else}
					<span class="hidden sm:block" aria-hidden="true"></span>
				{/if}

				{#if data.newer}
					<a
						href="/changelog/{data.newer}/"
						class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30 sm:items-end sm:text-right"
					>
						<span class="text-xs font-medium tracking-[0.1em] text-muted uppercase">Later</span>
						<span
							class="mt-2 inline-flex items-center gap-2 font-heading text-h3 text-surface transition-colors group-hover:text-primary"
						>
							{formatMonth(data.newer)}
							<ArrowRightIcon
								size={16}
								class="text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
							/>
						</span>
					</a>
				{/if}
			</div>
		</nav>
	{/if}
</section>
