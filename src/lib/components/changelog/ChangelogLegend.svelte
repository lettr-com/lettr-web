<script lang="ts">
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import type { FeatureTag, Module } from '$lib/changelog/types';
	import ChangelogBadge from './ChangelogBadge.svelte';

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

	const rowClass = 'grid gap-x-10 gap-y-3 py-5 sm:grid-cols-[15rem_minmax(0,1fr)]';
</script>

<!--
	Explains the badge system without taking space from the log itself. Built on
	<details>/<summary> like the blog FAQ, so it works before hydration and is
	keyboard-accessible by default. Each row keeps text on the left and badges
	on the right so the two never interleave.
-->
<details class="group border border-border/50 bg-white">
	<summary
		class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-surface sm:px-6 [&::-webkit-details-marker]:hidden"
	>
		How to read the badges
		<CaretDownIcon
			size={16}
			class="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
		/>
	</summary>

	<div class="divide-y divide-border/40 border-t border-border/40 px-5 sm:px-6">
		<div class={rowClass}>
			<div>
				<p class="text-sm font-medium text-surface">Product area</p>
				<p class="mt-1 text-sm leading-[1.6] text-muted">
					Which part of Lettr the entry touches. An entry that spans several carries all of
					them.
				</p>
			</div>
			<div class="flex flex-wrap content-start gap-1.5 sm:pt-0.5">
				{#each modules as module (module)}
					<ChangelogBadge {module} />
				{/each}
			</div>
		</div>

		<div class={rowClass}>
			<div>
				<p class="text-sm font-medium text-surface">Type of change</p>
				<p class="mt-1 text-sm leading-[1.6] text-muted">
					Added when the entry alone does not make it obvious.
				</p>
			</div>
			<div class="flex flex-wrap content-start gap-1.5 sm:pt-0.5">
				{#each tags as tag (tag)}
					<ChangelogBadge {tag} />
				{/each}
			</div>
		</div>

		<div class={rowClass}>
			<div>
				<p class="text-sm font-medium text-surface">Breaking change</p>
				<p class="mt-1 text-sm leading-[1.6] text-muted">Read before you upgrade.</p>
			</div>
			<div class="flex flex-wrap content-start gap-1.5 sm:pt-0.5">
				<ChangelogBadge tag="Breaking" />
			</div>
		</div>
	</div>
</details>
