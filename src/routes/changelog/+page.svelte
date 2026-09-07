<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ChangelogBadge from '$lib/components/changelog/ChangelogBadge.svelte';
	import ChangelogFeed from '$lib/components/changelog/ChangelogFeed.svelte';
	import { MONTHS, formatMonth } from '$lib/changelog/months';
	import type { FeatureTag, Module } from '$lib/changelog/types';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const modules: Module[] = ['transactional', 'campaigns', 'audience', 'platform'];
	const tags: FeatureTag[] = [
		'API',
		'SDKs',
		'Webhooks',
		'AI',
		'Deliverability',
		'UI/UX',
		'Docs',
		'Security',
		'Performance',
		'Billing'
	];

	let header: HTMLElement | undefined = $state();

	onMount(() => {
		if (!header) return;
		return createFromAnimationCleanup({
			scope: header,
			targets: '[data-animate]',
			vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
		});
	});
</script>

<Seo
	title="Changelog | Lettr"
	description="Everything we ship to Lettr, month by month: new features, improvements and bugfixes across the transactional API, campaigns, audience and the platform."
	ogTitle="Lettr Changelog"
	canonical="/changelog/"
/>

<section id="top" class="pt-32 pb-24">
	<div bind:this={header} class="mb-20">
		<h1 data-animate class="font-heading text-4xl text-surface">Changelog</h1>
		<p data-animate class="mt-4 max-w-2xl text-body leading-[1.8] text-muted">
			Everything we ship to Lettr, a month at a time. If a change is something you could notice
			from the outside, it is written down here — including the ones we would rather have shipped
			quietly.
		</p>
		<p data-animate class="mt-4 max-w-2xl text-body leading-[1.8] text-muted">
			Each month lists new features first, then improvements, then bugfixes. Work that never
			leaves our side of the wire — infrastructure, refactors, internal tooling — stays out.
		</p>

		<div data-animate class="mt-10 border-t border-border/40 pt-8">
			<h2 class="font-heading text-[13px] tracking-[0.1em] text-surface uppercase">
				Reading the badges
			</h2>
			<p class="mt-4 text-sm leading-[1.7] text-muted">
				Every entry carries the part of Lettr it touches. An entry that spans several carries all
				of them.
			</p>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each modules as module (module)}
					<ChangelogBadge {module} />
				{/each}
			</div>
			<p class="mt-6 text-sm leading-[1.7] text-muted">
				Outline badges say what kind of change it is, where that is not obvious from the entry.
			</p>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each tags as tag (tag)}
					<ChangelogBadge {tag} />
				{/each}
			</div>
			<p class="mt-6 flex flex-wrap items-center gap-2 text-sm leading-[1.7] text-muted">
				<ChangelogBadge tag="Breaking" />
				<span>marks something to read before you upgrade.</span>
			</p>
		</div>

		<div data-animate class="mt-10 border-t border-border/40 pt-8">
			<h2 class="font-heading text-[13px] tracking-[0.1em] text-surface uppercase">
				Browse by month
			</h2>
			<div class="mt-4 flex flex-wrap gap-x-5 gap-y-2">
				{#each MONTHS as id (id)}
					<a
						href="/changelog/{id}/"
						class="font-code text-[13px] text-muted transition-colors hover:text-primary"
					>
						{formatMonth(id)}
					</a>
				{/each}
			</div>
		</div>

		<p data-animate class="mt-10 max-w-2xl text-sm leading-[1.7] text-muted">
			Something missing, wrong, or worth more detail than it got?
			<a
				href="/support/"
				class="text-primary underline underline-offset-4 transition-colors hover:text-primary/70"
			>
				Tell us
			</a>
			— we would rather fix the entry than have you find out the hard way.
		</p>
	</div>

	<ChangelogFeed initial={data.month} />
</section>
