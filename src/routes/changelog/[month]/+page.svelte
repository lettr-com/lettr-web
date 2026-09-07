<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import Seo from '$lib/components/Seo.svelte';
	import ChangelogMonth from '$lib/components/changelog/ChangelogMonth.svelte';
	import { trackChangelogLinkClick } from '$lib/changelog/analytics';
	import { formatMonth } from '$lib/changelog/months';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let header: HTMLElement | undefined = $state();
	let body: HTMLElement | undefined = $state();

	const label = $derived(formatMonth(data.month.id));

	function count(n: number, singular: string): string | null {
		if (n === 0) return null;
		return `${n} ${n === 1 ? singular : `${singular}s`}`;
	}

	const description = $derived.by(() => {
		const parts = [
			count(data.month.features.length, 'new feature'),
			count(data.month.improvements.length, 'improvement'),
			count(data.month.bugfixes.length, 'bugfix')
		].filter((part): part is string => part !== null);

		if (parts.length === 0) return `Everything Lettr shipped in ${label}.`;

		const list =
			parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`;
		return `Everything Lettr shipped in ${label}: ${list}.`;
	});

	onMount(() => {
		const cleanups: (() => void)[] = [];

		if (header) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: header,
					targets: '[data-animate]',
					vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
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
	<div bind:this={header} class="mb-14">
		<a
			data-animate
			href="/changelog/"
			class="mb-6 inline-flex items-center gap-1.5 font-heading text-[13px] text-muted transition-colors hover:text-primary"
		>
			<ArrowLeftIcon size={13} weight="bold" />
			All changes
		</a>
		<h1 data-animate class="font-heading text-4xl text-surface">{label}</h1>
		<p data-animate class="mt-4 max-w-xl text-body leading-[1.7] text-muted">
			{description}
		</p>
	</div>

	<div bind:this={body}>
		<ChangelogMonth month={data.month} variant="page" />
	</div>

	{#if data.newer || data.older}
		<nav
			aria-label="Other months"
			class="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-8"
		>
			{#if data.older}
				<a
					href="/changelog/{data.older}/"
					class="inline-flex items-center gap-1.5 font-heading text-[13px] text-muted transition-colors hover:text-primary"
				>
					<ArrowLeftIcon size={13} weight="bold" />
					{formatMonth(data.older)}
				</a>
			{:else}
				<span></span>
			{/if}

			{#if data.newer}
				<a
					href="/changelog/{data.newer}/"
					class="inline-flex items-center gap-1.5 font-heading text-[13px] text-muted transition-colors hover:text-primary"
				>
					{formatMonth(data.newer)}
					<ArrowRightIcon size={13} weight="bold" />
				</a>
			{/if}
		</nav>
	{/if}
</section>
